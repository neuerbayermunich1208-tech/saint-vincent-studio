import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { SITE_URL } from './site'

type SeoInput = {
  locale: Locale
  path: string // without locale, e.g. '/studio'
  title?: string | null
  description?: string | null
  image?: string | null
  noIndex?: boolean | null
}

export function buildMetadata({ locale, path, title, description, image, noIndex }: SeoInput): Metadata {
  const clean = path === '/' ? '' : path
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${clean}`]))
  return {
    title: title ?? undefined,
    description: description ?? undefined,
    alternates: {
      canonical: `${SITE_URL}/${locale}${clean}`,
      languages: { ...languages, 'x-default': `${SITE_URL}/${routing.defaultLocale}${clean}` },
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url: `${SITE_URL}/${locale}${clean}`,
      siteName: 'Saint Vincent Studio',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saint Vincent Studio',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-stacked.png`,
    description: 'Independent design and manufacturing studio.',
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}
