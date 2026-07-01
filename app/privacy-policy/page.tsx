import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — NGH Property Group',
  description:
    'Privacy policy for NGH Property Group, Uluwatu Paradise, and NGH Nexa social media integrations.',
  openGraph: {
    title: 'Privacy Policy — NGH Property Group',
    description:
      'How NGH Property Group handles personal data for Uluwatu Paradise and NGH Nexa social media integrations.',
    url: 'https://nghpropertygroup.com/privacy',
    siteName: 'NGH Property Group',
    type: 'website',
  },
}

const sections = [
  {
    title: 'Who we are',
    body: [
      'This privacy policy applies to NGH Property Group and its Uluwatu Paradise project, including related social media and website operations managed through the NGH Nexa application.',
      'NGH Nexa is used to support approved content operations, social media publishing, analytics, and reporting for NGH Property Group channels.',
    ],
  },
  {
    title: 'Information we may process',
    body: [
      'When you interact with NGH Property Group, Uluwatu Paradise, or our social media channels, we may process information that you choose to provide, such as your name, contact details, messages, inquiries, meeting requests, and preferences.',
      'Through platform integrations such as LinkedIn, we may receive limited profile, page, post, engagement, and analytics information according to the permissions approved by the relevant platform user or administrator.',
    ],
  },
  {
    title: 'How we use information',
    body: [
      'We use information to respond to inquiries, provide project information, manage appointments, prepare approved social media content, publish approved posts, review content performance, and improve our communication with investors, buyers, partners, and interested visitors.',
      'We do not sell personal data. We do not use LinkedIn or other social platform data for unrelated third-party advertising resale.',
    ],
  },
  {
    title: 'Social media integrations',
    body: [
      'NGH Nexa may connect to social platforms such as LinkedIn to support approved publishing and analytics workflows. Access is limited to operational needs and platform-approved permissions.',
      'Public publishing remains subject to an internal approval workflow before posts are made live on company channels.',
    ],
  },
  {
    title: 'Sharing and service providers',
    body: [
      'We may use trusted service providers for website hosting, analytics, CRM, scheduling, email, file storage, and social media operations. These providers process information only as needed to deliver their services to us.',
      'We may disclose information if required by law, to protect our rights, or to comply with a valid legal process.',
    ],
  },
  {
    title: 'Retention',
    body: [
      'We keep information only for as long as reasonably necessary for the purposes described in this policy, unless a longer retention period is required for legal, accounting, security, or legitimate business reasons.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      'You may contact us to request access, correction, or deletion of personal information we hold about you, subject to legal and operational limitations.',
      'You can also manage permissions directly through the social platform account that granted access to an integration.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'For privacy questions or requests, contact us at info@nghpropertygroup.com.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#1F1F1F]">
      <section className="px-6 pb-20 pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-[#C6A96C]">
            Privacy Policy
          </p>
          <h1
            className="mb-6 text-4xl font-light leading-tight md:text-6xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Privacy Policy
          </h1>
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[#4A4A4A]">
            This page explains how NGH Property Group handles personal data for Uluwatu Paradise, related digital channels, and NGH Nexa social media operations.
          </p>
          <div className="mb-12 rounded-2xl border border-[#C8B9A6]/40 bg-white/60 p-6 text-sm leading-relaxed text-[#4A4A4A] shadow-sm">
            <p>
              <strong className="text-[#1F1F1F]">Last updated:</strong> June 29, 2026
            </p>
            <p className="mt-2">
              This policy is intended as a practical operational privacy notice for website and approved social media integration use.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="border-t border-[#C8B9A6]/40 pt-8">
                <h2
                  className="mb-4 text-2xl font-light text-[#1F1F1F] md:text-3xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-[#4A4A4A]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
