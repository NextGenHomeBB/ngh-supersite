import { describe, expect, it } from 'vitest'
import { cleanupExpiredApplications } from '../src/index'

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
      new Date('2026-07-30T00:00:00Z'),
    )

    expect(deleted).toBe(1)
    expect(bucket.deleted).toContain('applications/expired/metadata.json')
    expect(bucket.deleted).toContain('applications/expired/resume.pdf')
    expect(bucket.objects.has('applications/open-long/metadata.json')).toBe(true)
    expect(bucket.objects.has('applications/open-long/resume.pdf')).toBe(true)
  })
})
