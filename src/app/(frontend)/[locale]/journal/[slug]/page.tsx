import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getJournalPost, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { MediaImage, asMedia } from '@/components/Media'

export const revalidate = 300
// Rendered on first request, then cached and refreshed when content changes.
export function generateStaticParams() {
  return []
}
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getJournalPost(slug, locale)
  if (!post) return {}
  return buildMetadata({ locale, path: `/journal/${slug}`, title: post.seo?.title ?? post.title, description: post.seo?.description ?? post.excerpt, noIndex: post.seo?.noIndex })
}

export default async function JournalPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [settings, post] = await Promise.all([getSiteSettings(), getJournalPost(slug, locale)])
  if (!settings.features?.journal || !post) notFound()
  const t = await getTranslations()
  const cover = asMedia(post.cover)
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    image: cover?.url ? [absoluteUrl(cover.url)] : undefined,
    publisher: { '@type': 'Organization', name: 'Saint Vincent Studio' },
  }
  return (
    <article className="section page-top">
      <div className="wrap">
        <ol className="breadcrumb label muted"><li><Link href="/journal">{t('journal.title')}</Link></li><li aria-current="page">{post.title}</li></ol>
        <div className="sec-head"><p className="label">{post.category}</p><h1 className="d-l">{post.title}</h1></div>
        {cover && <div className="plate r-1610" style={{ marginBottom: 'var(--s-5)' }}><MediaImage media={cover} sizes="100vw" priority /></div>}
        <div className="prose">{post.body && <RichText data={post.body} />}</div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
    </article>
  )
}
