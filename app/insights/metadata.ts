import type { Metadata } from 'next'

type InsightMetadataInput = {
  title: string
  pageTitle?: string
  description: string
  path: `/insights/${string}`
  image: `/images/${string}`
  imageAlt?: string
  publishedTime?: string
  authors?: string[]
}

export function makeInsightMetadata({
  title,
  pageTitle,
  description,
  path,
  image,
  imageAlt,
  publishedTime,
  authors = ['NGH Property Group'],
}: InsightMetadataInput): Metadata {
  return {
    title: pageTitle ?? `${title} | NGH Property Group`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'NGH Property Group',
      type: 'article',
      publishedTime,
      authors,
      images: [
        {
          url: image,
          width: 1200,
          height: 627,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
