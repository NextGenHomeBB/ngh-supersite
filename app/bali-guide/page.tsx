import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bali Guide — Everything You Need to Know About Investing in Bali | NGH Property Group',
  description: 'Your complete guide to investing in Bali real estate. Ownership structures, legal frameworks, permits, visas, area guides, and construction standards — by NGH Property Group.',
}

export default function BaliGuidePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1F1F1F' }}>
      {/* Header */}
      <div className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-12 h-[2px] mb-8" style={{ backgroundColor: '#C6A96C' }} />
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6"
            style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}
          >
            Bali Guide
          </h1>
          <p className="text-xl font-light leading-relaxed max-w-2xl" style={{ color: '#D4D0C8', fontFamily: 'var(--font-serif)' }}>
            Everything you need to know about investing in Bali real estate — from your first steps to key handover.
          </p>
        </div>
      </div>

      {/* Guide Content */}
      <article className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
        <div className="prose prose-invert prose-lg" style={{ color: '#D4D0C8' }}>

          {/* 01 - Getting Started */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>01</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Getting Started</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Why Bali?</h3>
            <p className="mb-6 leading-relaxed">
              Bali has established itself as one of Southeast Asia&apos;s most compelling real estate markets. With over 5 million international visitors annually, a rapidly growing digital nomad community, and infrastructure investments accelerating across the island, the fundamentals for property investment are strong.
            </p>
            <p className="mb-6 leading-relaxed">
              The southern peninsula — particularly the Uluwatu and Bukit area — has seen the most structured growth, attracting a mix of lifestyle buyers, remote professionals, and yield-focused investors from Europe, Australia, and Asia.
            </p>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Your First Steps</h3>
            <ul className="space-y-3 mb-8">
              <li><strong style={{ color: '#F5F3EE' }}>Define your goal:</strong> Are you buying for personal use, rental income, or long-term capital appreciation? This determines the structure, location, and unit type.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Set your budget:</strong> Entry-level apartments start from EUR 112,500. Villas typically range from EUR 200,000 to EUR 500,000+.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Choose a developer:</strong> Work with established developers who can demonstrate track records, transparent pricing, and proper permits. Ask for references and visit completed projects.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Visit Bali:</strong> While remote purchases are possible, a site visit gives you invaluable context — the neighborhood, construction quality, and surrounding infrastructure.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Secure with a reservation:</strong> Most developments offer a reservation fee (typically EUR 1,500) with a cooling-off period, giving you time to finalize your decision.</li>
            </ul>
          </section>

          {/* 02 - Legal & Ownership */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>02</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Legal &amp; Ownership</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <p className="mb-6 leading-relaxed">
              Indonesian law does not allow direct freehold ownership by foreign nationals. However, there are well-established legal structures that provide secure, long-term property rights.
            </p>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Ownership Structures</h3>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Leasehold (Hak Sewa)</h4>
              <p className="text-sm leading-relaxed mb-2">The most common and straightforward structure for foreign investors. You lease the land for 25&ndash;30 years with extension options, and own the building outright. Lease agreements are notarized and registered.</p>
              <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Individual investors seeking simplicity and security</p>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>PT PMA (Foreign-Owned Company)</h4>
              <p className="text-sm leading-relaxed mb-2">A foreign-owned Indonesian company can hold property rights (Hak Pakai or Right to Use). This structure allows for Hak Guna Bangunan (Right to Build) for up to 80 years. More complex to set up but offers stronger long-term rights.</p>
              <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Larger investments, commercial operations, or multiple properties</p>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Nominee Structure — Avoid This</h4>
              <p className="text-sm leading-relaxed mb-2">Some agents suggest using an Indonesian nominee to hold freehold title on your behalf. This is technically illegal under Indonesian law and leaves the foreign investor with no legal protection. The nominee is the legal owner — full stop.</p>
              <p className="text-xs" style={{ color: '#C6A96C' }}>Warning: NGH Property Group never recommends nominee arrangements</p>
            </div>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Key Legal Documents</h3>
            <ul className="space-y-3 mb-8">
              <li><strong style={{ color: '#F5F3EE' }}>Notarized Lease Agreement:</strong> Registered with the local land office, specifying lease duration, extension terms, and building ownership.</li>
              <li><strong style={{ color: '#F5F3EE' }}>IMB / PBG (Building Permit):</strong> Confirms the property is legally permitted for its intended use.</li>
              <li><strong style={{ color: '#F5F3EE' }}>SLF (Certificate of Function):</strong> Confirms the building meets safety and compliance standards.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Land Certificate (SHM/SHGB):</strong> The underlying land title held by the landowner, which your lease agreement references.</li>
            </ul>
          </section>

          {/* 03 - Permits & Compliance */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>03</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Permits &amp; Compliance</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <p className="mb-6 leading-relaxed">
              Bali&apos;s permit landscape has evolved significantly. Understanding the current requirements protects your investment and ensures your property can legally operate as intended.
            </p>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Essential Permits</h3>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>PBG (Persetujuan Bangunan Gedung)</h4>
              <p className="text-sm leading-relaxed">The new building approval system replacing the old IMB. Required before construction begins. Issued through the OSS (Online Single Submission) system.</p>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Pondok Wisata (Homestay License)</h4>
              <p className="text-sm leading-relaxed">Required for short-term rental operations. Allows you to legally list on platforms like Airbnb and Booking.com. Processing time varies by regency.</p>
            </div>

            <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
              <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Environmental Compliance</h4>
              <p className="text-sm leading-relaxed">Developments must comply with environmental regulations including waste management, water treatment, and green space requirements. Larger projects require an AMDAL (Environmental Impact Assessment).</p>
            </div>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>What NGH Handles</h3>
            <p className="mb-6 leading-relaxed">
              At NGH Property Group, all permits and compliance requirements are included in our turnkey delivery. You don&apos;t need to navigate the permit process yourself — we handle PBG applications, Pondok Wisata licensing, and all regulatory compliance as part of the project.
            </p>
          </section>

          {/* 04 - Visas & Living */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>04</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Visas &amp; Living</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <p className="mb-6 leading-relaxed">
              Indonesia offers several visa pathways for property owners and long-term residents. The right visa depends on your intended stay duration and activities.
            </p>

            <div className="space-y-6 mb-8">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>B211A (Social/Business Visa)</h4>
                <p className="text-sm leading-relaxed mb-2">Valid for 60 days, extendable up to 180 days. The most flexible option for frequent visitors. Can be obtained through a sponsor or visa agent.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Property owners visiting regularly, exploring investment opportunities</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>KITAS (Temporary Stay Permit)</h4>
                <p className="text-sm leading-relaxed mb-2">Valid for 1&ndash;2 years. Available through employment, investment, or retirement pathways. Requires a sponsor (employer or PT PMA company).</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Those planning to live in Bali full-time with business activities</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Second Home Visa</h4>
                <p className="text-sm leading-relaxed mb-2">Valid for 5&ndash;10 years. Designed for high-net-worth individuals. Requires proof of savings or investment (typically USD 130,000+). No work permit included.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Retirees, lifestyle investors, part-time residents</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Digital Nomad Visa (B211A Remote Worker)</h4>
                <p className="text-sm leading-relaxed mb-2">A newer pathway allowing remote workers to live in Indonesia for up to 1 year. Must demonstrate income from outside Indonesia.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Best for: Remote workers who want to base themselves in Bali</p>
              </div>
            </div>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Cost of Living</h3>
            <p className="mb-6 leading-relaxed">
              Bali offers a high quality of life at a fraction of European or Australian costs. A comfortable lifestyle in the Uluwatu area — including housing, dining, transport, and entertainment — can be maintained for EUR 1,500&ndash;3,000 per month, depending on lifestyle choices.
            </p>
          </section>

          {/* 05 - Bali Areas Guide */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>05</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Bali Areas Guide</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <div className="space-y-6 mb-8">
              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Uluwatu &amp; Bukit Peninsula</h4>
                <p className="text-sm leading-relaxed mb-2">The fastest-growing luxury area in Bali. Dramatic clifftop locations, world-class beaches (Balangan, Bingin, Padang Padang), and a growing ecosystem of cafes, beach clubs, and wellness centers. Attracts surfers, lifestyle seekers, and premium rental demand.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Investment profile: High growth, premium rentals, strong capital appreciation</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Canggu</h4>
                <p className="text-sm leading-relaxed mb-2">Bali&apos;s digital nomad capital. A vibrant, fast-paced area with a high concentration of co-working spaces, restaurants, and nightlife. Very popular for short-term rentals but increasingly saturated with competition.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Investment profile: High occupancy, competitive market, moderate yields</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Seminyak</h4>
                <p className="text-sm leading-relaxed mb-2">Bali&apos;s established luxury hub. Premium dining, boutique shopping, and beach clubs. Land prices are the highest on the island, making new development projects less common. Best suited for buyers seeking established neighborhoods.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Investment profile: Mature market, premium pricing, stable returns</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Ubud</h4>
                <p className="text-sm leading-relaxed mb-2">Bali&apos;s cultural heart, surrounded by rice terraces and tropical forests. Popular with yoga practitioners, artists, and wellness seekers. Rental demand is seasonal but consistent for unique, well-designed properties.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Investment profile: Niche market, wellness/retreat focus, moderate yields</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(198,169,108,0.05)', border: '1px solid rgba(198,169,108,0.15)' }}>
                <h4 className="text-lg font-light mb-2" style={{ color: '#C6A96C' }}>Nusa Dua &amp; Jimbaran</h4>
                <p className="text-sm leading-relaxed mb-2">Home to Bali&apos;s five-star resort corridor. Nusa Dua is more resort-oriented, while Jimbaran offers a mix of local charm and upscale dining (famous seafood restaurants on the beach). Close to the airport.</p>
                <p className="text-xs" style={{ color: '#8A8F83' }}>Investment profile: Resort-grade, family-friendly, steady demand</p>
              </div>
            </div>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Why We Chose Uluwatu</h3>
            <p className="mb-6 leading-relaxed">
              NGH Property Group selected the Uluwatu-Ungasan corridor for Uluwatu Paradise based on three key factors: the area&apos;s rapid but structured growth, proximity to Bali&apos;s best beaches, and the gap in the market for quality mid-range developments built to international standards. The Bukit Peninsula offers the best combination of lifestyle appeal and investment fundamentals on the island.
            </p>
          </section>

          {/* 06 - Building & Development */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(198,169,108,0.15)', color: '#C6A96C' }}>06</span>
              <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Building &amp; Development</h2>
            </div>
            <div className="w-full h-[1px] mb-8" style={{ backgroundColor: 'rgba(198,169,108,0.2)' }} />

            <p className="mb-6 leading-relaxed">
              Construction quality is the single biggest differentiator in Bali real estate. The gap between a well-built property and a poorly constructed one is enormous — affecting everything from maintenance costs to guest reviews to resale value.
            </p>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>The NGH Standard</h3>
            <ul className="space-y-3 mb-8">
              <li><strong style={{ color: '#F5F3EE' }}>Dutch construction standards:</strong> Reinforced concrete structures, proper foundations, and premium materials. No shortcuts.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Quality materials:</strong> Marble flooring, premium fixtures, and finishes that are designed to withstand Bali&apos;s tropical climate.</li>
              <li><strong style={{ color: '#F5F3EE' }}>10-year structural warranty:</strong> We stand behind our construction with a decade-long warranty on structural elements.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Transparent timeline:</strong> 12&ndash;18 months from contract to key handover, with regular photo and video updates throughout the process.</li>
              <li><strong style={{ color: '#F5F3EE' }}>Turnkey delivery:</strong> Fully furnished, rental-ready units. Land lease, construction, interior, pool, permits — everything is included in the price.</li>
            </ul>

            <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>What to Watch Out For</h3>
            <p className="mb-6 leading-relaxed">
              Unfortunately, Bali&apos;s construction industry has a reputation problem. Many developers cut corners on materials, skip proper engineering, or use unqualified labor. Before committing to any project, ask:
            </p>
            <ul className="space-y-3 mb-8">
              <li>Can you visit a completed project by the same developer?</li>
              <li>Are the construction materials and methods documented?</li>
              <li>Is there a structural warranty?</li>
              <li>Are all permits in place before construction starts?</li>
              <li>What happens if the timeline is delayed?</li>
              <li>Is the price truly all-inclusive, or will there be hidden costs?</li>
            </ul>
          </section>

          {/* CTA */}
          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(198,169,108,0.2)' }}>
            <p className="text-lg font-light mb-2" style={{ color: '#F5F3EE', fontFamily: 'var(--font-serif)' }}>
              Ready to explore your options?
            </p>
            <p className="text-sm mb-6" style={{ color: '#8A8F83' }}>
              Book a free consultation with our team. We&apos;ll walk you through the process, answer your questions, and help you find the right investment for your goals.
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
        </div>

        <div className="mt-16">
          <Link href="/" className="text-sm transition-colors duration-300 hover:opacity-80" style={{ color: '#C6A96C' }}>
            &larr; Back to Home
          </Link>
        </div>
      </article>
    </main>
  )
}
