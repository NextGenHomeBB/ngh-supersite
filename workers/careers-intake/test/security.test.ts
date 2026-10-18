import { describe, expect, it } from 'vitest'
import {
  addDaysUtc,
  isApplicationExpired,
  RETENTION_DAYS_AFTER_ROLE_CLOSE,
  validateUploadMagicBytes,
  validateUploadRequest,
} from '../src/security'

describe('careers intake security helpers', () => {
  it('accepts real PDF magic bytes within the resume size cap', () => {
    const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])
    expect(validateUploadMagicBytes('resume', 'cv.pdf', pdf)).toEqual({ ok: true })
  })

  it('rejects spoofed PDF extension when magic bytes are not PDF/doc/docx', () => {
    const fake = new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c])
    expect(validateUploadMagicBytes('resume', 'cv.pdf', fake)).toEqual({
      ok: false,
      error: 'Resume must be a real PDF, DOC, or DOCX file.',
    })
  })

  it('accepts MP4/MOV ftyp video containers', () => {
    const mp4 = new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d])
    expect(validateUploadMagicBytes('introVideo', 'intro.mp4', mp4)).toEqual({ ok: true })
  })

  it('rejects upload requests over hard caps before presigning', () => {
    expect(
      validateUploadRequest({
        kind: 'introVideo',
        fileName: 'intro.mp4',
        size: 101 * 1024 * 1024,
        contentType: 'video/mp4',
      }),
    ).toEqual({ ok: false, error: 'Intro video must be 100MB or smaller.' })
  })

  it('calculates expiry from role close date, not upload age', () => {
    const lastDayKept = addDaysUtc('2026-07-01', RETENTION_DAYS_AFTER_ROLE_CLOSE)
    const dayAfter = addDaysUtc('2026-07-01', RETENTION_DAYS_AFTER_ROLE_CLOSE + 1)
    expect(isApplicationExpired('2026-07-01', lastDayKept)).toBe(false)
    expect(isApplicationExpired('2026-07-01', dayAfter)).toBe(true)
  })

  // The retention period is a promise printed on the application form and in the privacy
  // policy, so it must not be quietly retuned. If this fails, the two public texts need the
  // same edit in the same commit: components/sections/career/ApplicationForm.tsx in
  // ngh-website-2026, and app/privacy-policy/page.tsx in this repo.
  it('keeps the retention period at the value stated in the public copy', () => {
    expect(RETENTION_DAYS_AFTER_ROLE_CLOSE).toBe(365)
  })

  it('adds days in UTC without local timezone drift', () => {
    expect(addDaysUtc('2026-07-01', 28).toISOString()).toBe('2026-07-29T00:00:00.000Z')
  })
})
