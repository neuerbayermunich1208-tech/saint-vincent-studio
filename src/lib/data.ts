import 'server-only'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import type { Locale } from '@/i18n/routing'
import type { Homepage, Journal as JournalPost, Product, ProductCollection, Release, SiteSetting, Page } from '@/payload-types'
import { getPayloadClient } from './payload'

/** Draft content is only returned when an admin is previewing. */
async function isPreview() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
})

export const getHomepage = cache(async (locale: Locale): Promise<Homepage> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', locale, depth: 2, draft: await isPreview() })
})

export const getCollections = cache(async (locale: Locale): Promise<ProductCollection[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'product-collections',
    overrideAccess: false,
    locale,
    depth: 1,
    sort: 'order',
    limit: 50,
    where: { visible: { equals: true } },
  })
  return res.docs
})

export const getCollectionBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'product-collections',
    overrideAccess: false,
    locale,
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { visible: { equals: true } }] },
  })
  return res.docs[0] ?? null
})

export const getProducts = cache(
  async (locale: Locale, opts: { collectionId?: number | string; featured?: boolean; limit?: number } = {}): Promise<Product[]> => {
    const payload = await getPayloadClient()
    const draft = await isPreview()
    const and: Record<string, unknown>[] = [{ status: { not_equals: 'archived' } }]
    if (opts.collectionId) and.push({ collections: { in: [opts.collectionId] } })
    if (opts.featured) and.push({ featured: { equals: true } })
    const res = await payload.find({
      collection: 'products',
      locale,
      depth: 1,
      draft,
      limit: opts.limit ?? 48,
      sort: 'catalogueNumber',
      where: { and } as never,
      overrideAccess: draft,
    })
    return res.docs
  },
)

export const getProductBySlug = cache(async (slug: string, locale: Locale): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const res = await payload.find({
    collection: 'products',
    locale,
    depth: 2,
    draft,
    limit: 1,
    where: { slug: { equals: slug } },
    overrideAccess: draft,
  })
  return res.docs[0] ?? null
})

export const getReleases = cache(async (locale: Locale): Promise<Release[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'releases',
    overrideAccess: false,
    locale,
    depth: 1,
    sort: 'order',
    limit: 20,
    where: { visible: { equals: true } },
  })
  return res.docs
})

export const getJournalPosts = cache(async (locale: Locale, limit = 12): Promise<JournalPost[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'journal', locale, depth: 1, limit, sort: '-publishedAt', overrideAccess: false })
  return res.docs
})

export const getJournalPost = cache(async (slug: string, locale: Locale): Promise<JournalPost | null> => {
  const payload = await getPayloadClient()
  const draft = await isPreview()
  const res = await payload.find({
    collection: 'journal',
    locale,
    depth: 2,
    draft,
    limit: 1,
    where: { slug: { equals: slug } },
    overrideAccess: draft,
  })
  return res.docs[0] ?? null
})

export const getPage = cache(async (slug: string, section: 'legal' | 'support', locale: Locale): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    locale,
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { section: { equals: section } }] },
  })
  return res.docs[0] ?? null
})

export const getPages = cache(async (locale: Locale): Promise<Page[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', locale, depth: 0, limit: 50, sort: 'title', overrideAccess: false })
  return res.docs
})
