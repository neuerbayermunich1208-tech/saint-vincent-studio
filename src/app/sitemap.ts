import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getCollections, getJournalPosts, getPages, getProducts, getSiteSettings } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

/** Only lists pages that are switched on and published. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = routing.defaultLocale
  const [settings, collections, products, pages] = await Promise.all([
    getSiteSettings(),
    getCollections(locale),
    getProducts(locale, { limit: 500 }),
    getPages(locale),
  ])
  const journal = settings.features?.journal ? await getJournalPosts(locale, 500) : []

  const paths: { path: string; lastModified?: string }[] = [
    { path: '' },
    { path: '/collections' },
    { path: '/studio' },
    { path: '/upcoming' },
    { path: '/contact' },
    ...collections.map((c) => ({ path: `/collections/${c.slug}`, lastModified: c.updatedAt })),
    ...products.filter((p) => !p.seo?.noIndex).map((p) => ({ path: `/objects/${p.slug}`, lastModified: p.updatedAt })),
    ...pages.filter((p) => !p.seo?.noIndex).map((p) => ({ path: p.slug === 'faq' ? '/faq' : `/${p.section}/${p.slug}`, lastModified: p.updatedAt })),
    ...(settings.features?.journal ? [{ path: '/journal' }] : []),
    ...journal.map((j) => ({ path: `/journal/${j.slug}`, lastModified: j.updatedAt })),
  ]

  return paths.map(({ path, lastModified }) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  }))
}
