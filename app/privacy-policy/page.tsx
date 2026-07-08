import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Notice - Careers - NGH Property Group',
  description: 'Privacy Notice for NGH Property Group careers applications.',
  openGraph: {
    title: 'Privacy Notice - Careers - NGH Property Group',
    description: 'How NGH Property Group handles careers application data.',
    url: 'https://nghpropertygroup.com/privacy',
    siteName: 'NGH Property Group',
    type: 'website',
  },
}

const noticeParagraphs = [
  "Controller: PT Next Gen Home, Bali, Indonesia. These roles are based in Indonesia and this careers page is not specifically directed at residents of the EU. Contact: info@nghpropertygroup.com.",
  "What we collect: your name, date of birth, email, phone/WhatsApp, location, LinkedIn/portfolio URL, salary expectation, experience, motivation, tools & AI usage, CV, intro video, and answers to role-specific questions. For bot/abuse prevention we also process your IP address via Cloudflare Turnstile.",
  "Framework & legal basis: handled primarily under Indonesia's Personal Data Protection Law (UU PDP, Law 27/2022). For any applicant in the EU, the GDPR also applies and our lawful basis is Art. 6(1)(b) (steps before a possible employment contract) and Art. 6(1)(f) (legitimate interest in evaluating suitability, and in bot/abuse prevention). We do not rely on consent to process your application.",
  "AI & human decision: We may use AI tools to help organise, summarise and score applications. A member of our team always makes the final decision, you are never rejected by a purely automated process.",
  "How long we keep it: Your application (CV, intro video and answers) is stored securely in the EU and automatically deleted around 28 days after the role closes. Internal notifications to our hiring team are kept only for as long as needed for recruitment. Some technical and security logs may be retained by our hosting/security providers under their own policies.",
  "Storage & processors: Cloudflare (R2 file storage + intake Worker + Turnstile bot protection, EU region); zxcs (mail.zxcs.nl, notification + confirmation emails); Telegram (internal \"new application\" alert, link/reference only, no candidate data in the message). Each under appropriate data-processing terms.",
  "Your rights: you may request access, correction, deletion, restriction and portability of your data, and object to the processing; and lodge a complaint with the relevant data-protection authority, in the Netherlands the Autoriteit Persoonsgegevens, in Indonesia the authority under the UU PDP. Email info@nghpropertygroup.com.",
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#1F1F1F]">
      <section className="px-6 pb-20 pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-[#C6A96C]">
            Careers Privacy Notice
          </p>
          <h1
            className="mb-6 text-4xl font-light leading-tight md:text-6xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Privacy Notice
          </h1>
          <div className="space-y-6 rounded-2xl border border-[#C8B9A6]/40 bg-white/70 p-6 text-base leading-relaxed text-[#4A4A4A] shadow-sm md:p-8">
            {noticeParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
