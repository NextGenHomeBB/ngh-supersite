import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { careerRoles, getCareerRole, getRoleQuestions } from '@/data/careers'
import ApplicationForm from './ApplicationForm'

export function generateStaticParams() {
  return careerRoles.map((role) => ({ slug: role.slug }))
}

type CareerPageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: CareerPageParams }): Promise<Metadata> {
  const { slug } = await params
  const role = getCareerRole(slug)
  if (!role) {
    return { title: 'Career role not found — NGH Property Group' }
  }

  return {
    title: `${role.title} | Careers at NGH Property Group`,
    description: role.description,
  }
}

export default async function CareerDetailPage({ params }: { params: CareerPageParams }) {
  const { slug } = await params
  const role = getCareerRole(slug)
  if (!role || role.status !== 'open') {
    notFound()
  }

  const questions = getRoleQuestions(role)

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#1F1F1F]">
      <section className="bg-[#1F1F1F] px-6 pb-16 pt-32 text-[#F5F3EE] lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link href="/careers" className="mb-8 inline-block text-sm text-[#C6A96C] transition hover:opacity-75">
            &larr; Back to all roles
          </Link>
          <div className="mb-6 flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.18em]">
            <span className="rounded-full bg-[#C6A96C] px-3 py-1 text-[#1F1F1F]">{role.type}</span>
            <span className="rounded-full border border-[#C6A96C]/50 px-3 py-1 text-[#D4D0C8]">{role.department}</span>
            <span className="rounded-full border border-[#C6A96C]/50 px-3 py-1 text-[#D4D0C8]">{role.location}</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-light leading-tight md:text-6xl" style={{ fontFamily: 'var(--font-serif)' }}>
            {role.title}
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-[#D4D0C8]">
            {(role.summary ?? [role.description]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#8A8F83]">Role close date: {role.closingDate}</p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-8">
            {role.responsibilities ? (
              <div className="rounded-3xl border border-[#C8B9A6]/40 bg-white/70 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  What you'll do
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-[#4A4A4A]">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C6A96C]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-3xl border border-[#C8B9A6]/40 bg-white/70 p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                Requirements
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-[#4A4A4A]">
                {role.requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C6A96C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {role.niceToHave ? (
              <div className="rounded-3xl border border-[#C8B9A6]/40 bg-white/70 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  Nice To Have
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-[#4A4A4A]">
                  {role.niceToHave.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C6A96C]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {role.offer ? (
              <div className="rounded-3xl border border-[#C8B9A6]/40 bg-white/70 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  What We Offer
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-[#4A4A4A]">
                  {role.offer.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C6A96C]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {role.howToApply ? (
              <div className="rounded-3xl border border-[#C8B9A6]/40 bg-white/70 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  How to Apply
                </h2>
                <p className="text-sm leading-relaxed text-[#4A4A4A]">{role.howToApply}</p>
              </div>
            ) : null}

            <div className="rounded-3xl border border-[#C8B9A6]/40 bg-[#1F1F1F] p-6 text-[#F5F3EE] shadow-sm">
              <h2 className="mb-3 text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                Application package
              </h2>
              <p className="text-sm leading-relaxed text-[#D4D0C8]">
                Submit the NGH questionnaire, your CV, and a short intro video in one secure application flow. We delete your application data within 28 days after the role is filled or closed.
              </p>
            </div>
          </aside>

          <ApplicationForm role={role} questions={questions} />
        </div>
      </section>
    </main>
  )
}
