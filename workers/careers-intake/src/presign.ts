const encoder = new TextEncoder()

function awsEncode(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function asArrayBuffer(key: ArrayBuffer | Uint8Array) {
  if (key instanceof ArrayBuffer) return key
  return key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string) {
  const cryptoKey = await crypto.subtle.importKey('raw', asArrayBuffer(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
}

async function sha256Hex(data: string) {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(data)))
}

async function signingKey(secret: string, dateStamp: string) {
  const kDate = await hmac(encoder.encode(`AWS4${secret}`), dateStamp)
  const kRegion = await hmac(kDate, 'auto')
  const kService = await hmac(kRegion, 's3')
  return hmac(kService, 'aws4_request')
}

function timestamp(now: Date) {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  return { amzDate: iso, dateStamp: iso.slice(0, 8) }
}

export type PresignInput = {
  method: 'PUT' | 'GET'
  endpoint: string
  bucket: string
  key: string
  accessKeyId: string
  secretAccessKey: string
  expiresSeconds: number
  now?: Date
}

export async function presignR2Url(input: PresignInput) {
  const now = input.now || new Date()
  const { amzDate, dateStamp } = timestamp(now)
  const endpoint = input.endpoint.replace(/\/$/, '')
  const host = new URL(endpoint).host
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const canonicalUri = `/${awsEncode(input.bucket)}/${input.key.split('/').map(awsEncode).join('/')}`
  const params: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${input.accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(input.expiresSeconds),
    'X-Amz-SignedHeaders': 'host',
  }
  const canonicalQuery = Object.keys(params)
    .sort()
    .map((key) => `${awsEncode(key)}=${awsEncode(params[key])}`)
    .join('&')
  const canonicalHeaders = `host:${host}\n`
  const canonicalRequest = [input.method, canonicalUri, canonicalQuery, canonicalHeaders, 'host', 'UNSIGNED-PAYLOAD'].join('\n')
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n')
  const key = await signingKey(input.secretAccessKey, dateStamp)
  const signature = toHex(await hmac(key, stringToSign))
  return `${endpoint}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
}
