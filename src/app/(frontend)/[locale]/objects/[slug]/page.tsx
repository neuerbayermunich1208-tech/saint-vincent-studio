import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Product, ProductCollection } from '@/payload-types'
import { getProductBySlug, getSiteSettings } from '@/lib/data'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { absoluteUrl, formatDimensions, formatPrice } from '@/lib/site'
import { CornerDrawing, ObjectDrawing } from '@/components/Drawings'
import { Hotspots } from '@/components/Hotspots'
import { MediaImage, asMedia } from '@/components/Media'
import { NotifyForm } from '@/components/NotifyForm'
import { ProductCard } from '@/components/ProductCard'
import { SaveButton } from '@/components/SaveButton'

export const revalidate = 300
// Rendered on first request, then cached and refreshed when content changes.
export function generateStaticParams() {
  return []
}
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const p = await getProductBySlug(slug, locale)
  if (!p) return {}
  const img = asMedia(p.seo?.image) ?? asMedia(p.gallery?.[0])
  return buildMetadata({
    locale,
    path: `/objects/${slug}`,
    title: p.seo?.title ?? p.name,
    description: p.seo?.description ?? p.tagline,
    image: img?.url ? absoluteUrl(img.url) : null,
    noIndex: p.seo?.noIndex,
  })
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (<><dt>{label}</dt><dd>{value}</dd></>)
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const product = await getProductBySlug(slug, locale)
  if (!product) notFound()
  const [t, settings] = await Promise.all([getTranslations(), getSiteSettings()])

  const gallery = (product.gallery ?? []).map(asMedia).filter((m): m is NonNullable<typeof m> => Boolean(m))
  const collection = (product.collections ?? []).find((c): c is ProductCollection => typeof c === 'object')
  const s = product.specs
  const commerce = settings.mode === 'commerce'
  const firstPrice = product.variants?.find((v) => typeof v.priceVnd === 'number')?.priceVnd
  const related = (product.related ?? []).filter((r): r is Product => typeof r === 'object')
  const compatible = (product.assembly?.compatibleWith ?? []).filter((r): r is Product => typeof r === 'object')
  const manual = asMedia(product.assembly?.manual)

  const jsonLd: object[] = [
    breadcrumbJsonLd([
      { name: t('collections.title'), url: absoluteUrl(`/${locale}/collections`) },
      ...(collection ? [{ name: collection.name, url: absoluteUrl(`/${locale}/collections/${collection.slug}`) }] : []),
      { name: product.name, url: absoluteUrl(`/${locale}/objects/${slug}`) },
    ]),
  ]
  // Product schema only when a real, purchasable offer exists.
  if (commerce && product.status === 'available' && typeof firstPrice === 'number') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.variants?.[0]?.sku,
      brand: { '@type': 'Brand', name: 'Saint Vincent Studio' },
      image: gallery.map((g) => (g.url ? absoluteUrl(g.url) : null)).filter(Boolean),
      offers: { '@type': 'Offer', priceCurrency: 'VND', price: firstPrice, availability: 'https://schema.org/InStock' },
    })
  }

  return (
    <section className="section page-top">
      <div className="wrap">
        <ol className="breadcrumb label muted">
          <li><Link href="/collections">{t('collections.title')}</Link></li>
          {collection && <li><Link href={`/collections/${collection.slug}`}>{collection.name}</Link></li>}
          <li aria-current="page">{product.name}</li>
        </ol>
        <div className="pdp">
          <div className="pdp-gallery">
            <div className="feature" style={{ display: 'block' }}>
              <Hotspots
                spots={(product.hotspots ?? []).map((h) => ({ x: h.x, y: h.y, title: h.title ?? '', body: h.body }))}
                emptyTitle={product.hotspots?.length ? t('home.selectDetail') : product.name}
                emptyBody={product.hotspots?.length ? t('home.selectDetailHint') : product.tagline ?? ''}
              >
                <div className="plate r-1611">
                  {gallery[0] ? (
                    <MediaImage media={gallery[0]} sizes="(min-width: 900px) 58vw, 100vw" priority />
                  ) : product.productType === 'diorama' ? (
                    <CornerDrawing label={`${t('common.conceptDrawing')}: ${product.name}`} />
                  ) : (
                    <ObjectDrawing kind={product.productType} label={`${t('common.conceptDrawing')}: ${product.name}`} />
                  )}
                  {(!gallery[0] || gallery[0].isConcept) && <span className="concept-tag">{t('common.concept')}</span>}
                </div>
              </Hotspots>
            </div>
            {gallery.slice(1).map((g) => (
              <div key={g.id} className="plate r-32"><MediaImage media={g} sizes="(min-width: 900px) 58vw, 100vw" /></div>
            ))}
            {product.story && (
              <div className="prose" style={{ marginTop: 'var(--s-4)' }}>
                <h2 className="label" style={{ marginBottom: '1rem' }}>{t('product.story')}</h2>
                <RichText data={product.story} />
              </div>
            )}
          </div>

          <aside className="pdp-info">
            <p className="label pencil">{[product.catalogueNumber, t(`status.${product.status}`)].filter(Boolean).join(' · ')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
              <h1 className="d-l">{product.name}</h1>
              {settings.features?.wishlist !== false && (
                <div style={{ position: 'relative', width: 44, height: 44, flex: '0 0 auto' }}>
                  <SaveButton id={String(product.id)} addLabel={t('wishlist.add', { name: product.name })} removeLabel={t('wishlist.remove', { name: product.name })} />
                </div>
              )}
            </div>
            {product.tagline && <p className="lede">{product.tagline}</p>}
            {commerce && typeof firstPrice === 'number' && <p className="d-m">{formatPrice(firstPrice, 'VND', locale)}</p>}

            <dl className="specs" aria-label={t('product.specs')}>
              <Row label={t('product.collection')} value={collection?.name} />
              <Row label={t('product.scale')} value={s?.scale} />
              <Row label={t('product.dimensions')} value={formatDimensions(s)} />
              <Row label={t('product.weight')} value={s?.weightG ? `${s.weightG} g` : null} />
              <Row label={t('product.materials')} value={s?.materials} />
              <Row label={t('product.finish')} value={s?.finish} />
              <Row label={t('product.colors')} value={s?.colors?.map((c) => c.label).join(', ')} />
              <Row label={t('product.included')} value={s?.includedComponents?.map((c) => c.item).join(', ')} />
              <Row label={t('product.packaging')} value={s?.packaging} />
              {product.productType === 'lighting' && (
                <>
                  <Row label={t('product.lightSource')} value={product.lighting?.lightSource} />
                  <Row label={t('product.power')} value={product.lighting?.power} />
                  <Row label={t('product.wattage')} value={product.lighting?.wattage} />
                  <Row label={t('product.colorTemperature')} value={product.lighting?.colorTemperature} />
                  <Row label={t('product.dimming')} value={product.lighting?.dimming} />
                  <Row label={t('product.safety')} value={product.lighting?.safety} />
                </>
              )}
              {product.assembly?.requiresAssembly && (
                <>
                  <Row label={t('product.difficulty')} value={product.assembly.difficulty} />
                  <Row label={t('product.time')} value={product.assembly.time} />
                </>
              )}
              {compatible.length > 0 && (
                <><dt>{t('product.compatible')}</dt><dd>{compatible.map((c, i) => <span key={c.id}>{i > 0 && ', '}<Link href={`/objects/${c.slug}`}>{c.name}</Link></span>)}</dd></>
              )}
              {!s?.materials && !formatDimensions(s) && (<><dt>{t('product.specs')}</dt><dd className="muted">{t('common.pendingSpec')}</dd></>)}
            </dl>
            {manual?.url && <a className="link" href={manual.url}>{t('product.manual')} ↓</a>}
            {s?.care && <p className="muted"><span className="label">{t('product.care')} · </span>{s.care}</p>}

            {(!commerce || product.status !== 'available') && (
              <div style={{ borderTop: '1px solid var(--ink)', paddingTop: 'var(--s-3)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2 className="h3">{t('product.notifyHeading')}</h2>
                <p className="muted">{t('product.notifyLede')}</p>
                <NotifyForm locale={locale} source={`product:${product.slug}`} />
              </div>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 'var(--s-6)' }}>
            <div className="sec-head"><p className="label">{t('product.related')}</p></div>
            <div className="cards">{related.map((r) => <ProductCard key={r.id} product={r} showSave={settings.features?.wishlist !== false} />)}</div>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}
