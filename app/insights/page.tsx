import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPublishedArticles, formatArticleDate } from '../../lib/insights'

export const metadata: Metadata = {
  title: 'Insights — NGH Property Group',
  description:
    "Expert insights on Bali property investment — market trends, ROI analysis, ownership structures, and opportunities in South Bali's fastest-growing luxury market.",
}

export default async function InsightsPage() {
  const articles = await getPublishedArticles()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1F1F1F' }}>
      {/* Header */}
      <div className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-12 h-[2px] mb-8" style={{ backgroundColor: '#C6A96C' }} />
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}
          >
            Insights
          </h1>
          <p className="text-lg font-light max-w-2xl" style={{ color: '#8A8F83' }}>
            Expert insights on Bali property investment — market trends, ROI analysis, ownership
            structures, and opportunities in South Bali&apos;s fastest-growing luxury market.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="px-6 lg:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const href = article.external_href || `/insights/${article.slug}`
              return (
                <Link key={article.slug} href={href}>
                  <article className="group cursor-pointer">
                    <div className="relative h-56 md:h-64 rounded-xl overflow-hidden mb-6">
                      {article.cover_image && (
                        <Image
                          src={article.cover_image}
                          alt={article.image_alt || article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      <div
                        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                        style={{ backgroundColor: 'rgba(31,31,31,0.2)' }}
                      />
                    </div>
                    {article.category && (
                      <span
                        className="text-xs tracking-[0.2em] uppercase mb-3 block"
                        style={{ color: '#C6A96C' }}
                      >
                        {article.category}
                      </span>
                    )}
                    <h2
                      className="text-lg md:text-xl font-light leading-snug mb-3 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}
                    >
                      {article.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#D4D0C8' }}>
                      {article.excerpt}
                    </p>
                    <span className="text-xs" style={{ color: '#8A8F83' }}>
                      {formatArticleDate(article.sort_date)}
                    </span>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Back to home */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <Link
          href="/"
          className="text-sm transition-colors duration-300 hover:opacity-80"
          style={{ color: '#C6A96C' }}
        >
          &larr; Back to Home
        </Link>
      </div>
    </main>
  )
}
