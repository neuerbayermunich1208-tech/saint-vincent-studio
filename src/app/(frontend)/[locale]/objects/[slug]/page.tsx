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
import { MediaImage, asMedia, asMediaList, mediaSrc } from '@/components/Media'
import { LayoutDiagram } from '@/components/LayoutDiagram'
import { ProductGallery } from '@/components/ProductGallery'
import { NotifyForm } from '@/components/NotifyForm'
import { AddToCart, type SellableVariant } from '@/components/cart/AddToCart'
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
  if (!p || p.status === 'archived') return {}
  const img = asMedia(p.seo?.image) ?? asMedia(p.cardImage) ?? asMedia(p.gallery?.[0])
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
  // Archived pieces are kept in the CMS but no longer have a public page.
  if (!product || product.status === 'archived') notFound()
  const [t, settings] = await Promise.all([getTranslations(), getSiteSettings()])

  const gallery = asMediaList(product.gallery)
  const planImage = asMedia(product.planImage) ?? gallery[0] ?? null
  const details = asMediaList(product.detailImages)
  const modules = (product.layout?.modules ?? []).filter((m) => m.code)
  const layoutNotes = (product.layout?.notes ?? []).filter((n) => n.label && n.value)
  const spots = (product.hotspots ?? []).map((h) => ({ x: h.x, y: h.y, title: h.title ?? '', body: h.body }))
  const included = (product.specs?.includedComponents ?? []).map((c) => c.item).filter((x): x is string => Boolean(x))
  const collection = (product.collections ?? []).find((c): c is ProductCollection => typeof c === 'object')
  const s = product.specs
  const commerce = settings.mode === 'commerce'
  const firstPrice = product.variants?.find((v) => typeof v.priceVnd === 'number')?.priceVnd
  const sellable: SellableVariant[] =
    commerce && product.status === 'available'
      ? (product.variants ?? [])
          .filter((v) => typeof v.priceVnd === 'number' && v.priceVnd > 0)
          .map((v) => ({ sku: v.sku, label: v.label || v.sku, priceText: formatPrice(v.priceVnd!, 'VND', locale), inStock: (v.stock ?? 0) > 0 }))
      : []
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
            {gallery.length > 0 ? (
              <ProductGallery
                images={gallery.map((g) => ({ id: g.id, src: mediaSrc(g.url!), width: g.width!, height: g.height!, alt: g.alt ?? '', caption: g.caption }))}
                labels={{
                  open: t.raw('product.openImage') as string,
                  viewer: t('product.viewer', { name: product.name }),
                  prev: t('product.prev'),
                  next: t('product.next'),
                  close: t('nav.close'),
                  counter: t.raw('product.counter') as string,
                }}
              />
            ) : (
              <div className="plate r-1611">
                {product.productType === 'diorama' ? (
                  <CornerDrawing label={`${t('common.conceptDrawing')}: ${product.name}`} />
                ) : (
                  <ObjectDrawing kind={product.productType} label={`${t('common.conceptDrawing')}: ${product.name}`} />
                )}
                <span className="concept-tag">{t('common.concept')}</span>
              </div>
            )}
            {product.photoNote && <p className="photo-note">{product.photoNote}</p>}
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
              {(s?.extra ?? []).map((row) => <Row key={row.id ?? row.label} label={row.label} value={row.value} />)}
              {included.length > 0 && (
                <><dt>{t('product.included')}</dt><dd><ul className="inbox">{included.map((item) => <li key={item}>{item}</li>)}</ul></dd></>
              )}
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

            {sellable.length > 0 && <AddToCart productId={product.id} variants={sellable} />}

            {sellable.length === 0 && (
              <div style={{ borderTop: '1px solid var(--ink)', paddingTop: 'var(--s-3)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2 className="h3">{t('product.notifyHeading')}</h2>
                <p className="muted">{t('product.notifyLede')}</p>
                <NotifyForm locale={locale} source={`product:${product.slug}`} />
              </div>
            )}
          </aside>
          {product.story && (
            <div className="pdp-story prose">
              <h2 className="label">{t('product.story')}</h2>
              <RichText data={product.story} />
            </div>
          )}
        </div>

        {planImage && spots.length > 0 && (
          <div className="pdp-sec" id="plan">
            <div className="sec-head">
              <p className="label">{t('product.planEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('product.planHeading') as string }} />
            </div>
            <div className="feature">
              <Hotspots spots={spots} emptyTitle={t('home.selectDetail')} emptyBody={t('home.selectDetailHint')}>
                <MediaImage media={planImage} fit="natural" sizes="(min-width: 1440px) 900px, (min-width: 900px) 64vw, calc(100vw - 32px)" />
              </Hotspots>
            </div>
          </div>
        )}

        {details.length > 0 && (
          <div className="pdp-sec" id="details">
            <div className="sec-head"><p className="label">{t('product.detailsEyebrow')}</p></div>
            <div className="details">
              {details.map((d, i) => (
                <figure key={d.id} className="detail">
                  <MediaImage media={d} fit="natural" sizes="(min-width: 900px) 46vw, calc(100vw - 32px)" />
                  <figcaption className="figcap label muted">
                    <span>{`Fig. ${String(i + 1).padStart(2, '0')}`}</span>
                    {d.caption && <span>{d.caption}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {modules.length > 0 && (
          <div className="pdp-sec" id="layout">
            <div className="sec-head">
              <p className="label">{t('product.layoutEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('product.layoutHeading') as string }} />
            </div>
            <div className="layout">
              <div className="layout-fig">
                <LayoutDiagram
                  modules={modules.map((m) => ({ code: m.code, name: m.name }))}
                  widthMm={s?.widthMm}
                  depthMm={s?.depthMm}
                  jointLabel={t('product.joint')}
                  label={t('product.diagramLabel', { modules: modules.map((m) => m.code).join(' + ') })}
                />
                <p className="label muted">{t('product.diagramNote')}</p>
              </div>
              {layoutNotes.length > 0 && (
                <dl className="specs">
                  {layoutNotes.map((n) => <Row key={n.id ?? n.label} label={n.label} value={n.value} />)}
                </dl>
              )}
            </div>
          </div>
        )}

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
