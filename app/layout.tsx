import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ScrollProgress from '@/components/ScrollProgress'
import CursorFollower from '@/components/CursorFollower'
import FloatingCTA from '@/components/FloatingCTA'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NGH Property Group — Real Estate Development in Bali',
  description:
    'Premium real estate development in Bali. Luxury villas, exclusive investments, and world-class property management by NGH Property Group.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="google-site-verification" content="P3HGzETX6VO31yg9Smik4_ZJPrGz4QR00C9cOJw6oMo" />
      </head>
      <body>
        <ScrollProgress />
        <CursorFollower />
        <Navigation />
        {children}
        <FloatingCTA />
      </body>
    </html>
  )
}
