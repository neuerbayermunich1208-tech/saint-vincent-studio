import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getCollectionBySlug, getProducts, getSiteSettings } from '@/lib/data'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { ProductCard } from '@/components/ProductCard'

export const revalidate = 300
// Rendered on first request, then cached and refreshed when content changes.
export function generateStaticParams() {
  return []
}
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const c = await getCollectionBySlug(slug, locale)
  if (!c) return {}
  return buildMetadata({ locale, path: `/collections/${slug}`, title: c.seo?.title ?? c.name, description: c.seo?.description ?? c.summary, noIndex: c.seo?.noIndex })
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const collection = await getCollectionBySlug(slug, locale)
  if (!collection) notFound()
  const [t, products, settings] = await Promise.all([getTranslations(), getProducts(locale, { collectionId: collection.id }), getSiteSettings()])
  const crumbs = breadcrumbJsonLd([
    { name: t('collections.title'), url: absoluteUrl(`/${locale}/collections`) },
    { name: collection.name, url: absoluteUrl(`/${locale}/collections/${slug}`) },
  ])
  return (
    <section className="section page-top">
      <div className="wrap">
        <ol className="breadcrumb label muted">
          <li><Link href="/collections">{t('collections.title')}</Link></li>
          <li aria-current="page">{collection.name}</li>
        </ol>
        <div className="sec-head">
          <p className="label">{collection.code ? `SV-${collection.code}` : t('collections.title')}</p>
          <h1 className="d-l">{collection.name}</h1>
          {collection.summary && <p className="lede">{collection.summary}</p>}
        </div>
        {!!collection.themes?.length && (
          <dl className="specs" style={{ marginBottom: 'var(--s-5)', maxWidth: '40rem' }}>
            <dt>{t('collections.includes')}</dt>
            <dd>{collection.themes.map((x) => x.label).join(' · ')}</dd>
          </dl>
        )}
        {products.length ? (
          <div className="cards">
            {products.map((p) => <ProductCard key={p.id} product={p} showSave={settings.features?.wishlist !== false} />)}
          </div>
        ) : (
          <p className="d-m muted">{t('collections.noPieces')}</p>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
    </section>
  )
}
