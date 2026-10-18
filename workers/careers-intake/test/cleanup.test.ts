import { describe, expect, it } from 'vitest'
import { cleanupExpiredApplications } from '../src/index'
import { addDaysUtc, RETENTION_DAYS_AFTER_ROLE_CLOSE } from '../src/security'

type StoredObject = { key: string; body: unknown }

class FakeBucket {
  objects = new Map<string, StoredObject>()
  deleted: string[] = []

  seed(key: string, body: unknown) {
    this.objects.set(key, { key, body })
  }

  async list({ prefix }: { prefix?: string; cursor?: string }) {
    const objects = [...this.objects.keys()]
      .filter((key) => !prefix || key.startsWith(prefix))
      .map((key) => ({ key }))
    return { objects, truncated: false, cursor: undefined }
  }

  async get(key: string) {
    const object = this.objects.get(key)
    if (!object) return null
    return { json: async () => object.body }
  }

  async delete(keys: string | string[]) {
    const list = Array.isArray(keys) ? keys : [keys]
    for (const key of list) {
      this.deleted.push(key)
      this.objects.delete(key)
    }
  }
}

describe('scheduled retention cleanup', () => {
  it('deletes expired application prefixes based on role close date, not upload age', async () => {
    const bucket = new FakeBucket()
    bucket.seed('applications/expired/metadata.json', {
      appId: 'expired',
      roleCloseDate: '2026-07-01',
    })
    bucket.seed('applications/expired/resume.pdf', 'pdf')
    bucket.seed('applications/open-long/metadata.json', {
      appId: 'open-long',
      roleCloseDate: '2026-09-01',
    })
    bucket.seed('applications/open-long/resume.pdf', 'pdf')

    const deleted = await cleanupExpiredApplications(
      { CAREERS_BUCKET: bucket } as never,
      // One day past the retention period for the 2026-07-01 role. Derived from the
      // constant rather than hard-coded, so changing the retention period cannot leave
      // this test asserting a window we no longer use.
      addDaysUtc('2026-07-01', RETENTION_DAYS_AFTER_ROLE_CLOSE + 1),
    )

    expect(deleted).toBe(1)
    expect(bucket.deleted).toContain('applications/expired/metadata.json')
    expect(bucket.deleted).toContain('applications/expired/resume.pdf')
    expect(bucket.objects.has('applications/open-long/metadata.json')).toBe(true)
    expect(bucket.objects.has('applications/open-long/resume.pdf')).toBe(true)
  })

  // Roles advertised "reviewed on a rolling basis" have no closing date, so there
  // is nothing for retention to count from. The cron skips any application whose
  // anchor is missing, which means an open-ended role would have kept the CV and
  // intro video forever while the privacy policy promised deletion. Those
  // applications anchor on the day they were submitted instead.
  it('deletes an open-ended role application from its submission date', async () => {
    const bucket = new FakeBucket()
    bucket.seed('applications/rolling/metadata.json', {
      appId: 'rolling',
      roleCloseDate: null,
      retentionAnchorDate: '2026-10-18',
    })
    bucket.seed('applications/rolling/resume.pdf', 'pdf')

    const stillInside = await cleanupExpiredApplications(
      { CAREERS_BUCKET: bucket } as never,
      addDaysUtc('2026-10-18', RETENTION_DAYS_AFTER_ROLE_CLOSE - 1),
    )
    expect(stillInside).toBe(0)
    expect(bucket.objects.has('applications/rolling/resume.pdf')).toBe(true)

    const deleted = await cleanupExpiredApplications(
      { CAREERS_BUCKET: bucket } as never,
      addDaysUtc('2026-10-18', RETENTION_DAYS_AFTER_ROLE_CLOSE + 1),
    )
    expect(deleted).toBe(1)
    expect(bucket.deleted).toContain('applications/rolling/resume.pdf')
  })

  // Pins the fail-safe, and the reason it is survivable. An application with no
  // anchor at all is never deleted — the cron skips it silently, forever. That is
  // the right call for data whose provenance is unknown, but it is only safe
  // because the write path now always sets retentionAnchorDate. If this ever
  // becomes reachable for new applications, it is an indefinite-retention bug,
  // not a quirk: the whole point of the anchor is that this case cannot occur.
  it('keeps, rather than deletes, an application with no anchor at all', async () => {
    const bucket = new FakeBucket()
    bucket.seed('applications/anchorless/metadata.json', { appId: 'anchorless', roleCloseDate: null })
    bucket.seed('applications/anchorless/resume.pdf', 'pdf')

    const deleted = await cleanupExpiredApplications(
      { CAREERS_BUCKET: bucket } as never,
      addDaysUtc('2026-10-18', RETENTION_DAYS_AFTER_ROLE_CLOSE * 5),
    )

    expect(deleted).toBe(0)
    expect(bucket.objects.has('applications/anchorless/resume.pdf')).toBe(true)
  })
})
