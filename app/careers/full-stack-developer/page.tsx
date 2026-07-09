import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers at NGH Property Group',
  description: 'This test careers role has been removed. View current opportunities at NGH Property Group.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function RemovedFullStackDeveloperRolePage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] px-6 py-32 text-[#1F1F1F] lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#C8B9A6]/40 bg-white/75 p-8 shadow-sm">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#C6A96C]">Careers at NGH</p>
        <h1 className="text-4xl font-light leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
          This role is no longer open.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-[#4A4A4A]">
          This temporary test listing has been removed from the production careers page. Please view the current open opportunity instead.
        </p>
        <Link
          href="/careers"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1F1F1F] px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition hover:bg-[#C6A96C] hover:text-[#1F1F1F]"
        >
          View current roles
        </Link>
      </section>
    </main>
  )
}
