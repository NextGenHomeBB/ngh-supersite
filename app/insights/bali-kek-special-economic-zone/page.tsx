import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bali\'s New Special Economic Zone (KEK) — What It Means for Property Investors | NGH Property Group',
  description: 'Indonesia announces Bali as a Special Economic Zone (KEK) for Family Offices. Learn what this means for foreign property investors, tax incentives, and the future of Bali real estate.',
  openGraph: {
    title: 'Bali\'s New Special Economic Zone (KEK) — What It Means for Property Investors',
    description: 'Indonesia announces Bali as a Special Economic Zone (KEK) for Family Offices. Learn what this means for foreign property investors, tax incentives, and the future of Bali real estate.',
    images: [{ url: '/images/kek-hero-v2.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/kek-hero-v2.jpg'],
  },
}

export default function BaliKEKArticle() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1F1F1F' }}>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/kek-hero-v2.jpg"
          alt="Bali Special Economic Zone KEK - Uluwatu Cliffs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(31,31,31,0.3), rgba(31,31,31,0.8))' }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs tracking-[0.2em] uppercase mb-4 block" style={{ color: '#C6A96C' }}>
              Market Insights
            </span>
            <h1 className="text-3xl md:text-5xl font-light leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>
              Bali&apos;s New Special Economic Zone (KEK) — What It Means for Property Investors
            </h1>
            <span className="text-sm" style={{ color: '#8A8F83' }}>May 1, 2026</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="prose prose-invert prose-lg" style={{ color: '#D4D0C8' }}>

          <p className="text-xl font-light leading-relaxed mb-8" style={{ color: '#F5F3EE', fontFamily: 'var(--font-serif)' }}>
            On April 8, 2026, Indonesia&apos;s government officially proposed Bali as a Special Economic Zone (Kawasan Ekonomi Khusus, or KEK) for Family Offices. Announced at a government work meeting at Merdeka Palace in Jakarta, this marks a significant shift in how Indonesia positions Bali for international investment.
          </p>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>What Is a KEK?</h2>
          <p className="mb-6 leading-relaxed">
            A Kawasan Ekonomi Khusus (KEK) is a designated area in Indonesia that offers special tax incentives, streamlined regulations, and infrastructure priority to attract foreign investment. Indonesia already operates several KEKs across the archipelago, but Bali&apos;s designation for Family Offices is a first of its kind.
          </p>
          <p className="mb-6 leading-relaxed">
            Family Offices — private wealth management firms that serve ultra-high-net-worth individuals and families — have been growing rapidly across Southeast Asia. Singapore and Hong Kong have traditionally dominated this space, but Indonesia is now making a strong bid to attract this capital to Bali.
          </p>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>Why Bali?</h2>
          <p className="mb-6 leading-relaxed">
            Bali is already Indonesia&apos;s most internationally recognized destination, with world-class infrastructure, a thriving expat community, and a lifestyle that attracts global talent and wealth. The island&apos;s appeal goes beyond tourism:
          </p>
          <ul className="space-y-3 mb-8">
            <li><strong style={{ color: '#F5F3EE' }}>Strategic Location:</strong> Bali sits at the crossroads of Asia-Pacific trade routes, within a few hours&apos; flight of Singapore, Hong Kong, Sydney, and Tokyo.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Cost Advantage:</strong> Compared to Singapore or Hong Kong, operating costs in Bali are significantly lower while offering comparable quality of life.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Growing Digital Infrastructure:</strong> Bali&apos;s co-working spaces, fiber internet, and digital nomad ecosystem have laid the groundwork for professional services.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Lifestyle Factor:</strong> For wealthy families, Bali offers a unique combination of culture, nature, safety, and international schooling that few destinations can match.</li>
          </ul>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>What This Means for Property Investors</h2>
          <p className="mb-6 leading-relaxed">
            The KEK designation is expected to have a significant ripple effect on Bali&apos;s real estate market. Here&apos;s what investors should pay attention to:
          </p>

          <h3 className="text-xl font-light mt-8 mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>1. Increased Demand for Premium Properties</h3>
          <p className="mb-6 leading-relaxed">
            Family Offices bring not just capital, but people — fund managers, legal advisors, support staff, and the families themselves. These professionals need high-quality housing, from luxury apartments to fully furnished villas. The demand for premium, well-managed properties in Bali&apos;s south (particularly Uluwatu, Jimbaran, and Nusa Dua) is expected to rise significantly.
          </p>

          <h3 className="text-xl font-light mt-8 mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>2. Potential Tax Incentives</h3>
          <p className="mb-6 leading-relaxed">
            KEK zones typically offer tax holidays, reduced corporate tax rates, and customs duty exemptions. While the specific incentive structure for Bali&apos;s Family Office KEK is still being finalized, early reports suggest favorable conditions for foreign entities establishing operations on the island.
          </p>

          <h3 className="text-xl font-light mt-8 mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>3. Infrastructure Development</h3>
          <p className="mb-6 leading-relaxed">
            KEK designations come with government commitment to infrastructure improvements. This could mean better roads, upgraded utilities, and improved connectivity in the designated zones — all of which directly increase property values in surrounding areas.
          </p>

          <h3 className="text-xl font-light mt-8 mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>4. Legitimization of Bali as an Investment Hub</h3>
          <p className="mb-6 leading-relaxed">
            Perhaps the most important impact is psychological. The KEK designation signals to the global investment community that Indonesia is serious about positioning Bali as more than a tourist destination. It&apos;s becoming a recognized center for wealth management and international business — and that changes the narrative for property investment entirely.
          </p>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>South Bali: The Epicenter of Growth</h2>
          <p className="mb-6 leading-relaxed">
            The Bukit Peninsula — home to Uluwatu, Balangan, and Jimbaran — is already Bali&apos;s fastest-growing luxury real estate market. The KEK announcement is expected to accelerate this trend, particularly in areas that combine lifestyle appeal with proximity to business infrastructure.
          </p>
          <p className="mb-6 leading-relaxed">
            Uluwatu&apos;s dramatic coastline, world-class surf breaks, and growing collection of five-star resorts and beach clubs make it the natural choice for high-net-worth individuals looking to combine work and lifestyle. Properties in this area are positioning themselves at the intersection of two powerful trends: Bali&apos;s tourism boom and its emerging role as a financial center.
          </p>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>What Should Investors Do Now?</h2>
          <p className="mb-6 leading-relaxed">
            For investors already considering Bali, the KEK announcement reinforces the long-term thesis: Bali&apos;s real estate market is maturing, and early movers in premium segments stand to benefit the most. Here are some practical steps:
          </p>
          <ul className="space-y-3 mb-8">
            <li><strong style={{ color: '#F5F3EE' }}>Secure Positions Early:</strong> As the KEK details are finalized and international media coverage increases, expect more competition for premium properties in South Bali.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Focus on Quality:</strong> The incoming demographic — Family Office professionals and their families — will demand properties built to international standards, not budget developments.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Think Long-Term:</strong> KEK benefits typically unfold over 5-10 years. Investors who enter now at current prices are positioning for significant appreciation as the zone matures.</li>
            <li><strong style={{ color: '#F5F3EE' }}>Work with Local Experts:</strong> Understanding Indonesian ownership structures (leasehold, PT PMA) and navigating the regulatory landscape requires experienced partners on the ground.</li>
          </ul>

          <h2 className="text-2xl font-light mt-12 mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#F5F3EE' }}>The Bottom Line</h2>
          <p className="mb-6 leading-relaxed">
            Bali&apos;s KEK designation for Family Offices is more than a policy announcement — it&apos;s a signal that the island is entering a new chapter. For property investors, this means increased demand, better infrastructure, and a stronger investment narrative. The window to invest before this transformation is priced into the market is now.
          </p>

          <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(198,169,108,0.2)' }}>
            <p className="text-sm mb-4" style={{ color: '#8A8F83' }}>
              Want to explore investment opportunities in South Bali before the KEK effect takes hold? Talk to our team.
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
          <Link href="/#insights" className="text-sm transition-colors duration-300 hover:opacity-80" style={{ color: '#C6A96C' }}>
            &larr; Back to Insights
          </Link>
        </div>
      </article>
    </main>
  )
}
