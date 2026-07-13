import type { Metadata } from 'next'

// Keep the CMS out of search engines. This is a server component so the
// robots directive is emitted in the static HTML head.
export const metadata: Metadata = {
  title: 'NGH Content Studio',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
