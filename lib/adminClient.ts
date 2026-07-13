// Browser-side client for the /admin CMS.
// Auth = Supabase Auth (email+password). All reads/writes go through the
// `insights-admin` edge function with the logged-in user's access token — the
// database grants `authenticated` no direct write access, so the function is the
// only write path. The anon key + URL are public by design (RLS-protected).

import { createClient, type Session } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://saaomspgrsjqnaargoat.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYW9tc3BncnNqcW5hYXJnb2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDE3OTcsImV4cCI6MjA5MjYxNzc5N30.tYYC9yOLOAK29wwjlFpdZsXRuVCeoNB97OmclePCsu0'

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/insights-admin`

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
})

export type { Session }

async function accessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

// Call the edge function with a JSON action.
export async function api<T = unknown>(
  action: string,
  body: { id?: string; data?: Record<string, unknown> } = {},
): Promise<T> {
  const token = await accessToken()
  if (!token) throw new ApiError('not_signed_in', 401)
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...body }),
  })
  const out = await res.json().catch(() => ({}))
  if (!res.ok || out?.ok === false) {
    throw new ApiError(out?.error || `http_${res.status}`, res.status)
  }
  return out as T
}

// Upload an image (multipart) and return its public URL.
export async function uploadImage(file: File, articleId: string): Promise<string> {
  const token = await accessToken()
  if (!token) throw new ApiError('not_signed_in', 401)
  const form = new FormData()
  form.append('file', file)
  form.append('id', articleId || 'misc')
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
    body: form,
  })
  const out = await res.json().catch(() => ({}))
  if (!res.ok || out?.ok === false) {
    throw new ApiError(out?.error || `http_${res.status}`, res.status)
  }
  return out.url as string
}

export type Article = {
  id: string
  slug: string
  title: string
  category: string | null
  excerpt: string | null
  intro: string | null
  body_html: string | null
  cover_image: string | null
  og_image: string | null
  image_alt: string | null
  seo_title: string | null
  seo_description: string | null
  author: string | null
  status: 'draft' | 'published'
  external_page: boolean
  show_cta: boolean
  external_href: string | null
  published_at: string | null
  sort_date: string | null
  updated_at?: string
}

export const CATEGORIES = [
  'Market Insights',
  'Investment',
  'Development',
  'Lifestyle',
  'Area Guide',
  'News',
]
