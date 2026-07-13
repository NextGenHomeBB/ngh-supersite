// Build-time data layer for the Insights CMS.
// Reads published articles from the Imperium Supabase project via PostgREST.
// No client dependency: plain fetch with the public anon key (RLS restricts
// anonymous reads to status = 'published').

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export type Article = {
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
  status: string
  external_page: boolean
  show_cta: boolean
  external_href: string | null
  published_at: string | null
  sort_date: string | null
}

function assertEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Insights CMS: SUPABASE_URL / SUPABASE_ANON_KEY are not set. ' +
        'Add them to the build environment (.env.local locally, CI secrets in the workflow).',
    )
  }
}

async function query(params: string): Promise<Article[]> {
  assertEnv()
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/insights_articles?${params}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept-Profile': 'imperium',
      },
      // Static export: fetch is resolved once at build time. A publish/unpublish
      // triggers a fresh Cloudflare rebuild, so force-cache (the default) is
      // correct here — 'no-store' would force dynamic rendering and break export.
      cache: 'force-cache',
    },
  )
  if (!res.ok) {
    throw new Error(
      `Insights CMS fetch failed (${res.status}): ${await res.text()}`,
    )
  }
  return (await res.json()) as Article[]
}

// All published articles for the index (newest first), incl. external-page ones.
export async function getPublishedArticles(): Promise<Article[]> {
  return query('status=eq.published&order=sort_date.desc,published_at.desc')
}

// Slugs rendered by the dynamic [slug] template (i.e. not bespoke code pages).
export async function getRenderableSlugs(): Promise<string[]> {
  const rows = await query(
    'status=eq.published&external_page=eq.false&select=slug',
  )
  return rows.map((r) => r.slug)
}

// A single renderable article by slug (null if missing / external / draft).
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const enc = encodeURIComponent(slug)
  const rows = await query(
    `slug=eq.${enc}&status=eq.published&external_page=eq.false&limit=1`,
  )
  return rows[0] ?? null
}

// "2026-07-03" -> "July 3, 2026"
export function formatArticleDate(sortDate: string | null): string {
  if (!sortDate) return ''
  const [y, m, d] = sortDate.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return ''
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return `${months[m - 1]} ${d}, ${y}`
}
