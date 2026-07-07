import { describe, expect, it } from 'vitest'
import {
  addDaysUtc,
  isApplicationExpired,
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
    expect(isApplicationExpired('2026-07-01', new Date('2026-07-29T00:00:00Z'))).toBe(false)
    expect(isApplicationExpired('2026-07-01', new Date('2026-07-30T00:00:00Z'))).toBe(true)
  })

  it('adds days in UTC without local timezone drift', () => {
    expect(addDaysUtc('2026-07-01', 28).toISOString()).toBe('2026-07-29T00:00:00.000Z')
  })
})
