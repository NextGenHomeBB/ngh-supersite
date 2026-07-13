import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getArticleBySlug,
  getRenderableSlugs,
  formatArticleDate,
  type Article,
} from '../../../lib/insights'

// Static export: only build slugs returned below, nothing on demand.
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getRenderableSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = await getArticleBySlug(slug)
  if (!a) return {}
  const path = `/insights/${a.slug}`
  const image = a.og_image || a.cover_image || undefined
  return {
    title: a.seo_title || `${a.title} | NGH Property Group`,
    description: a.seo_description || a.excerpt || undefined,
    alternates: { canonical: path },
    openGraph: {
      title: a.title,
      description: a.seo_description || a.excerpt || undefined,
      url: path,
      siteName: 'NGH Property Group',
      type: 'article',
      publishedTime: a.published_at || undefined,
      authors: a.author ? [a.author] : ['NGH Property Group'],
      images: image
        ? [{ url: image, width: 1200, height: 627, alt: a.image_alt || a.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description: a.seo_description || a.excerpt || undefined,
      images: image ? [image] : undefined,
    },
  }
}

function DefaultCta() {
  return (
    <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(198,169,108,0.2)' }}>
      <p className="text-sm mb-4" style={{ color: '#8A8F83' }}>
        Interested in Uluwatu Paradise? Book a consultation with our team.
      </p>
      <a
        href="https://calendly.com/nghpropertygroup"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-3 rounded-full text-sm tracking-wider uppercase transition-all duration-300 hover:opacity-90"
        style={{ backgroundColor: '#C6A96C', color: '#1F1F1F' }}
      >
        Book a Consultation
      </a>
    </div>
  )
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const a: Article | null = await getArticleBySlug(slug)
  if (!a) notFound()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1F1F1F' }}>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh]">
        {a.cover_image && (
          <Image
            src={a.cover_image}
            alt={a.image_alt || a.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(31,31,31,0.3), rgba(31,31,31,0.8))' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            {a.category && (
              <span className="text-xs tracking-[0.2em] uppercase mb-4 block" style={{ color: '#C6A96C' }}>
                {a.category}
              </span>
            )}
            <h1
              className="text-3xl md:text-5xl font-light leading-tight mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}
            >
              {a.title}
            </h1>
            <span className="text-sm" style={{ color: '#8A8F83' }}>
              {formatArticleDate(a.sort_date)}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="ngh-article prose prose-invert prose-lg">
          {a.intro && <p className="ngh-lead">{a.intro}</p>}
          {/* body_html is sanitized server-side in the Imperium authoring module
              (allowlisted tags/attrs) before it is stored, and rendered here at
              build time into static HTML. */}
          {a.body_html && <div dangerouslySetInnerHTML={{ __html: a.body_html }} />}
          {a.show_cta && <DefaultCta />}
        </div>

        <div className="mt-16">
          <Link
            href="/insights"
            className="text-sm transition-colors duration-300 hover:opacity-80"
            style={{ color: '#C6A96C' }}
          >
            &larr; Back to Insights
          </Link>
        </div>
      </article>
    </main>
  )
}
