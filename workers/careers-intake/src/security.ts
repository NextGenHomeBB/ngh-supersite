export type UploadKind = 'resume' | 'introVideo'

export type UploadRequest = {
  kind: UploadKind
  fileName: string
  size: number
  contentType: string
}

export type ValidationResult = { ok: true } | { ok: false; error: string }

export const RESUME_MAX_BYTES = 10 * 1024 * 1024
export const VIDEO_MAX_BYTES = 20 * 1024 * 1024
export const RETENTION_DAYS_AFTER_ROLE_CLOSE = 28

const resumeExtensions = ['.pdf', '.doc', '.docx']
const videoExtensions = ['.mp4', '.mov', '.webm']

function lowerName(fileName: string) {
  return fileName.trim().toLowerCase()
}

export function sanitizeFileName(fileName: string) {
  return lowerName(fileName)
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96) || 'upload.bin'
}

export function validateUploadRequest(upload: UploadRequest): ValidationResult {
  const name = lowerName(upload.fileName)
  if (!Number.isFinite(upload.size) || upload.size <= 0) {
    return { ok: false, error: 'Upload file is empty.' }
  }

  if (upload.kind === 'resume') {
    if (upload.size > RESUME_MAX_BYTES) return { ok: false, error: 'Resume must be 10MB or smaller.' }
    if (!resumeExtensions.some((extension) => name.endsWith(extension))) {
      return { ok: false, error: 'Resume must be PDF, DOC, or DOCX.' }
    }
    return { ok: true }
  }

  if (upload.size > VIDEO_MAX_BYTES) return { ok: false, error: 'Intro video must be 20MB or smaller.' }
  if (!videoExtensions.some((extension) => name.endsWith(extension))) {
    return { ok: false, error: 'Intro video must be MP4, MOV, or WEBM.' }
  }
  return { ok: true }
}

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value)
}

function isPdf(bytes: Uint8Array) {
  return startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])
}

function isDoc(bytes: Uint8Array) {
  return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
}

function isDocx(bytes: Uint8Array) {
  return startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) || startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) || startsWith(bytes, [0x50, 0x4b, 0x07, 0x08])
}

function isMp4OrMov(bytes: Uint8Array) {
  return bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70
}

function isWebm(bytes: Uint8Array) {
  return startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])
}

export function validateUploadMagicBytes(kind: UploadKind, fileName: string, bytes: Uint8Array): ValidationResult {
  if (kind === 'resume') {
    if (isPdf(bytes) || isDoc(bytes) || (lowerName(fileName).endsWith('.docx') && isDocx(bytes))) return { ok: true }
    return { ok: false, error: 'Resume must be a real PDF, DOC, or DOCX file.' }
  }

  if (isMp4OrMov(bytes) || isWebm(bytes)) return { ok: true }
  return { ok: false, error: 'Intro video must be a real MP4, MOV, or WEBM file.' }
}

export function addDaysUtc(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) throw new Error('Invalid role close date.')
  parsed.setUTCDate(parsed.getUTCDate() + days)
  return parsed
}

export function isApplicationExpired(roleCloseDate: string, now = new Date()) {
  return addDaysUtc(roleCloseDate, RETENTION_DAYS_AFTER_ROLE_CLOSE).getTime() < now.getTime()
}
