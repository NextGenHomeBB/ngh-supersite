import { afterEach, describe, expect, it, vi } from 'vitest'
import worker from '../src/index'

type StoredObject = { key: string; body: unknown; size: number; bytes?: Uint8Array }

class FakeBucket {
  objects = new Map<string, StoredObject>()
  deleted: string[] = []

  seedJson(key: string, body: unknown) {
    const raw = JSON.stringify(body)
    this.objects.set(key, { key, body, size: raw.length })
  }

  seedFile(key: string, bytes: Uint8Array) {
    this.objects.set(key, { key, body: null, size: bytes.byteLength, bytes })
  }

  async put(key: string, value: string) {
    this.objects.set(key, { key, body: JSON.parse(value), size: value.length })
  }

  async get(key: string) {
    const object = this.objects.get(key)
    if (!object) return null
    return {
      json: async () => object.body,
      arrayBuffer: async () => (object.bytes || new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])).buffer,
    }
  }

  async head(key: string) {
    const object = this.objects.get(key)
    if (!object) return null
    return { size: object.size }
  }

  async list({ prefix }: { prefix?: string; cursor?: string }) {
    const objects = [...this.objects.keys()]
      .filter((key) => !prefix || key.startsWith(prefix))
      .map((key) => ({ key }))
    return { objects, truncated: false, cursor: undefined }
  }

  async delete(keys: string | string[]) {
    const list = Array.isArray(keys) ? keys : [keys]
    for (const key of list) {
      this.deleted.push(key)
      this.objects.delete(key)
    }
  }
}

const appId = '11111111-1111-4111-8111-111111111111'
const resumeKey = `applications/${appId}/candidate.pdf`
const videoKey = `applications/${appId}/intro-video-candidate.mp4`

function validAnswers() {
  return [
    { id: 'availability', label: 'availability', section: 'Availability', value: 'now' },
    { id: 'salaryExpectation', label: 'salary', section: 'Availability', value: '1000' },
    { id: 'experience', label: 'experience', section: 'Experience', value: '5 years' },
    { id: 'motivation', label: 'motivation', section: 'Motivation', value: 'aligned' },
    { id: 'toolsAiUsage', label: 'tools', section: 'Tools & AI', value: 'AI tools' },
    { id: 'projectControlExample', label: 'project', section: 'Role-specific questions', value: 'example' },
    { id: 'budgetDelayScenario', label: 'budget', section: 'Role-specific questions', value: 'scenario' },
  ]
}

function jsonRequest(path: string, body: unknown) {
  return new Request(`https://intake.test${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function testEnv(bucket = new FakeBucket()) {
  return {
    CAREERS_BUCKET: bucket,
    TURNSTILE_TEST_MODE: 'true',
    R2_S3_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
    R2_ACCESS_KEY_ID: 'test-access-key',
    R2_SECRET_ACCESS_KEY: 'test-secret-key',
    R2_BUCKET_NAME: 'ngh-careers-applications-dev',
  }
}

describe('intake Worker hardening', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fails closed when Turnstile secret is missing and explicit test mode is not enabled', async () => {
    const response = await worker.fetch(
      jsonRequest('/uploads/presign', {
        appId,
        roleSlug: 'operations-planning-manager',
        turnstileToken: 'test-token',
        files: [
          { kind: 'resume', fileName: 'john-smith-cv.pdf', size: 1000, contentType: 'application/pdf' },
          { kind: 'introVideo', fileName: 'intro.mp4', size: 1000, contentType: 'video/mp4' },
        ],
      }),
      { CAREERS_BUCKET: new FakeBucket() } as never,
    )

    expect(response.status).toBe(403)
  })

  it('uses the SETUP.md per-appId R2 object contract', async () => {
    const response = await worker.fetch(
      jsonRequest('/uploads/presign', {
        appId,
        roleSlug: 'operations-planning-manager',
        turnstileToken: 'test-token',
        files: [
          { kind: 'resume', fileName: 'Jane Smith CV.pdf', size: 1000, contentType: 'application/pdf' },
          { kind: 'introVideo', fileName: 'Jane Smith Intro.mp4', size: 1000, contentType: 'video/mp4' },
        ],
      }),
      testEnv() as never,
    )

    expect(response.status).toBe(200)
    const body = await response.json() as { uploads: Array<{ key: string; uploadUrl: string }> }
    expect(body.uploads.map((upload) => upload.key)).toEqual([
      `applications/${appId}/jane-smith-cv.pdf`,
      `applications/${appId}/intro-video-jane-smith-intro.mp4`,
    ])
  })

  it('rejects finalize when both signed uploads are not provided', async () => {
    const bucket = new FakeBucket()
    bucket.seedJson(`applications/${appId}/session.json`, {
      appId,
      roleSlug: 'operations-planning-manager',
      createdAt: new Date().toISOString(),
      uploads: [
        { kind: 'resume', fileName: 'candidate.pdf', size: 1000, contentType: 'application/pdf', key: resumeKey },
        { kind: 'introVideo', fileName: 'candidate.mp4', size: 1000, contentType: 'video/mp4', key: videoKey },
      ],
    })

    const response = await worker.fetch(
      jsonRequest('/applications', {
        appId,
        roleSlug: 'operations-planning-manager',
        consentAccepted: true,
        candidate: { name: 'Jane', email: 'jane@example.com', phone: '+62', location: 'Bali' },
        answers: validAnswers(),
        uploads: [],
      }),
      { CAREERS_BUCKET: bucket } as never,
    )

    expect(response.status).toBe(400)
    const body = await response.json() as { error: string }
    expect(body.error).toMatch(/Exactly one resume and one intro video/)
  })

  it('rejects finalize when the signed session is missing a resume and does not write metadata', async () => {
    const bucket = new FakeBucket()
    bucket.seedJson(`applications/${appId}/session.json`, {
      appId,
      roleSlug: 'operations-planning-manager',
      createdAt: new Date().toISOString(),
      uploads: [
        { kind: 'introVideo', fileName: 'candidate.mp4', size: 1000, contentType: 'video/mp4', key: videoKey },
      ],
    })

    const response = await worker.fetch(
      jsonRequest('/applications', {
        appId,
        roleSlug: 'operations-planning-manager',
        consentAccepted: true,
        candidate: { name: 'Jane', email: 'jane@example.com', phone: '+62', location: 'Bali' },
        answers: validAnswers(),
        uploads: [
          { kind: 'introVideo', key: videoKey, fileName: 'candidate.mp4', size: 1000, contentType: 'video/mp4' },
        ],
      }),
      { CAREERS_BUCKET: bucket } as never,
    )

    expect(response.status).toBe(400)
    expect(bucket.objects.has(`applications/${appId}/metadata.json`)).toBe(false)
  })

  it('writes metadata.json and sends only the secondary Telegram ping on finalize', async () => {
    const bucket = new FakeBucket()
    bucket.seedJson(`applications/${appId}/session.json`, {
      appId,
      roleSlug: 'operations-planning-manager',
      createdAt: new Date().toISOString(),
      uploads: [
        { kind: 'resume', fileName: 'candidate.pdf', size: 5, contentType: 'application/pdf', key: resumeKey },
        { kind: 'introVideo', fileName: 'candidate.mp4', size: 12, contentType: 'video/mp4', key: videoKey },
      ],
    })
    bucket.seedFile(resumeKey, new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]))
    bucket.seedFile(videoKey, new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]))

    const calls: Array<{ url: string; body: unknown }> = []
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), body: init?.body ? JSON.parse(String(init.body)) : null })
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }))

    const response = await worker.fetch(
      jsonRequest('/applications', {
        appId,
        roleSlug: 'operations-planning-manager',
        consentAccepted: true,
        candidate: { name: 'Jane Candidate', email: 'jane@example.com', phone: '+62 812', location: 'Bali' },
        answers: validAnswers(),
        uploads: [
          { kind: 'resume', key: resumeKey, fileName: 'ignored.pdf', size: 5, contentType: 'application/pdf' },
          { kind: 'introVideo', key: videoKey, fileName: 'ignored.mp4', size: 12, contentType: 'video/mp4' },
        ],
      }),
      {
        ...testEnv(bucket),
        TELEGRAM_NOTIFY_BOT_TOKEN: 'test-telegram-token',
        TELEGRAM_NOTIFY_CHAT_ID: 'sandbox-group',
      } as never,
    )

    expect(response.status).toBe(200)
    expect(calls.some((call) => call.url.includes('/emails'))).toBe(false)
    const metadata = bucket.objects.get(`applications/${appId}/metadata.json`)?.body as { applicantName: string; applicantEmail: string; applicantPhone: string; role: string; cvKey: string; videoUrl: string; answers: Record<string, string> }
    expect(metadata).toMatchObject({
      applicantName: 'Jane Candidate',
      applicantEmail: 'jane@example.com',
      applicantPhone: '+62 812',
      role: 'Operations & Planning Manager',
      cvKey: resumeKey,
    })
    expect(metadata.answers.availability).toBe('now')
    expect(metadata.videoUrl).toContain(videoKey)

    const telegram = calls.find((call) => call.url.includes('api.telegram.org'))?.body as { text: string }
    expect(telegram.text).toContain('New application for Operations & Planning Manager')
    expect(telegram.text).toContain('Name: Jane Candidate')
    expect(telegram.text).toContain('Email: jane@example.com')
    expect(telegram.text).toContain('Phone: +62 812')
    expect(telegram.text).toContain(`Application ID: ${appId}`)
    expect(telegram.text).toContain('CV: yes')
    expect(telegram.text).toContain('Intro video: yes')
  })
})
