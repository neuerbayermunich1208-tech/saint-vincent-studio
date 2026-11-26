import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Product, ProductCollection } from '@/payload-types'
import { getCollections, getHomepage, getJournalPosts, getReleases, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { formatDimensions } from '@/lib/site'
import { CollectionIndex } from '@/components/CollectionIndex'
import { CornerDrawing, LanternDrawing, ObjectDrawing } from '@/components/Drawings'
import { DropBoard } from '@/components/DropBoard'
import { Hotspots } from '@/components/Hotspots'
import { MediaImage, asMedia, asMediaList } from '@/components/Media'
import { ModularBoard } from '@/components/ModularBoard'
import { NotifyForm } from '@/components/NotifyForm'

export const revalidate = 300

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildMetadata({ locale, path: '/', title: t('defaultTitle'), description: t('defaultDescription') })
}

const PROCESS = ['concept', 'design', 'prototype', 'refine', 'manufacture', 'finish'] as const

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const [home, settings, collections, releases] = await Promise.all([
    getHomepage(locale),
    getSiteSettings(),
    getCollections(locale),
    getReleases(locale),
  ])
  const journal = settings.features?.journal ? await getJournalPosts(locale, 3) : []
  const featured = typeof home.featuredProduct === 'object' ? (home.featuredProduct as Product | null) : null
  const featuredImage = asMedia(featured?.planImage) ?? asMedia(featured?.gallery?.[0])
  const heroImage = asMedia(home.heroImage)
  const heroProduct = typeof home.heroProduct === 'object' ? (home.heroProduct as Product | null) : null
  const wide = home.heroLayout === 'wide' && Boolean(heroImage)
  const strip = asMediaList(home.detailStrip).slice(0, 3)
  const featuredCollection = (featured?.collections ?? []).find((c): c is ProductCollection => typeof c === 'object')
  const html = (key: string) => ({ __html: t.raw(key) as string })

  return (
    <>
      {/* 01 Hero */}
      {wide && heroImage ? (
        <section className="hero hero-wide">
          <div className="wrap">
            <figure className="hero-wide-fig">
              {heroProduct ? (
                <Link href={`/objects/${heroProduct.slug}`} className="hero-wide-link" aria-label={heroProduct.name}>
                  <MediaImage media={heroImage} fit="natural" priority sizes="(min-width: 1440px) 1360px, (min-width: 900px) calc(100vw - 80px), 100vw" />
                </Link>
              ) : (
                <MediaImage media={heroImage} fit="natural" priority sizes="(min-width: 1440px) 1360px, (min-width: 900px) calc(100vw - 80px), 100vw" />
              )}
              {(heroImage.caption || home.heroNote) && (
                <figcaption className="figcap label muted">
                  <span>{heroImage.caption}</span>
                  {home.heroNote && <span className="hero-note">{home.heroNote}</span>}
                </figcaption>
              )}
            </figure>
            <div className="hero-wide-grid">
              {home.heroLabel && <p className="label pencil hero-label">{home.heroLabel}</p>}
              <h1 className="d-xl">
                {(home.heroLines ?? []).map((line, i) => (
                  <span key={i} className={`l${line.indent ? ' indent' : ''}`}>
                    <span>{line.italic ? <em>{line.text}</em> : line.text}</span>
                  </span>
                ))}
              </h1>
              <div className="hero-copy">
                {home.heroLede && <p className="lede">{home.heroLede}</p>}
                <div className="ctas">
                  {heroProduct ? (
                    <Link className="btn" href={`/objects/${heroProduct.slug}`}>{t('featured.view')} <span className="arr">→</span></Link>
                  ) : (
                    <Link className="btn" href="/collections">{t('home.ctaCollections')} <span className="arr">→</span></Link>
                  )}
                  <Link className="link" href={heroProduct ? '/collections' : '/studio'}>{heroProduct ? t('home.ctaCollections') : t('home.ctaStudio')}</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
      <section className="hero">
        <div className="wrap hero-grid">
          <h1 className="d-xl">
            {(home.heroLines ?? []).map((line, i) => (
              <span key={i} className={`l${line.indent ? ' indent' : ''}`}>
                <span>{line.italic ? <em>{line.text}</em> : line.text}</span>
              </span>
            ))}
          </h1>
          <figure className="hero-fig parallax" style={{ margin: 0 }}>
            <div className="plate r-45">
              {heroImage ? <MediaImage media={heroImage} sizes="(min-width: 900px) 33vw, 100vw" priority /> : <LanternDrawing label={t('common.conceptDrawing')} />}
            </div>
            <figcaption className="figcap label muted">
              <span>{heroImage?.caption ?? (heroImage ? '' : 'Fig. 01 — Lantern Study')}</span>
              <span>{heroImage?.isConcept === false ? '' : t('common.conceptDrawing')}</span>
            </figcaption>
          </figure>
          <div className="hero-copy">
            {home.heroLede && <p className="lede">{home.heroLede}</p>}
            <div className="ctas">
              <Link className="btn" href="/collections">{t('home.ctaCollections')} <span className="arr">→</span></Link>
              <Link className="link" href="/studio">{t('home.ctaStudio')}</Link>
            </div>
          </div>
        </div>
      </section>

      )}

      {/* 02 Brand introduction */}
      <section className="section" id="studio">
        <div className="wrap">
          <div className="sec-head">
            <p className="label">{t('home.studioEyebrow')}</p>
            {home.introHeading && <h2 className="d-l">{home.introHeading}</h2>}
          </div>
          <div className="intro">
            {home.introStatement && <p className="big d-m reveal">{home.introStatement}</p>}
            {!!home.pillars?.length && (
              <div className="notes">
                {home.pillars.map((p, i) => (
                  <div key={i} className="reveal">
                    <span className="label pencil">{p.label}</span>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 03 Featured collections */}
      {collections.length > 0 && (
        <section className="section" id="collections">
          <div className="wrap">
            <div className="sec-head">
              <p className="label">{t('home.collectionsEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={html('home.collectionsHeading')} />
            </div>
            <CollectionIndex
              exploreLabel={t('common.explore')}
              conceptLabel={t('common.concept')}
              items={collections.map((c) => {
                const cover = asMedia(c.cover)
                return { slug: c.slug, name: c.name, summary: c.summary, themes: (c.themes ?? []).map((x) => x.label).filter((x): x is string => Boolean(x)), coverUrl: cover?.url, coverAlt: cover?.alt }
              })}
            />
          </div>
        </section>
      )}

      {/* 04 Featured design */}
      {featured && (
        <section className="section" id="featured">
          <div className="wrap">
            <div className="sec-head">
              <p className="label">{t('home.featuredEyebrow')}</p>
              <h2 className="d-l">{featured.name}{featured.tagline ? <><br /><em>{featured.tagline}</em></> : null}</h2>
            </div>
            <div className="feature">
              <Hotspots
                spots={(featured.hotspots ?? []).map((h) => ({ x: h.x, y: h.y, title: h.title ?? '', body: h.body }))}
                emptyTitle={t('home.selectDetail')}
                emptyBody={t('home.selectDetailHint')}
              >
                {featuredImage ? (
                  <>
                    <MediaImage media={featuredImage} fit="natural" sizes="(min-width: 1440px) 900px, (min-width: 900px) 64vw, calc(100vw - 32px)" />
                    {featuredImage.isConcept && <span className="concept-tag">{t('common.concept')}</span>}
                  </>
                ) : (
                  <div className="plate r-1611">
                    {featured.productType === 'diorama' ? <CornerDrawing label={`${t('common.conceptDrawing')}: ${featured.name}`} /> : <ObjectDrawing kind={featured.productType} label={featured.name} />}
                    <span className="concept-tag">{t('common.concept')}</span>
                  </div>
                )}
              </Hotspots>
              <div className="side">
                <p className="label pencil">{featured.catalogueNumber ? `${featured.catalogueNumber} · ` : ''}{t(`status.${featured.status}`)}</p>
                <dl className="specs">
                  {featuredCollection && (<><dt>{t('featured.collection')}</dt><dd>{featuredCollection.name}</dd></>)}
                  {featured.specs?.scale && (<><dt>{t('featured.scale')}</dt><dd>{featured.specs.scale}</dd></>)}
                  <dt>{t('featured.dimensions')}</dt><dd className={formatDimensions(featured.specs) ? '' : 'muted'}>{formatDimensions(featured.specs) ?? t('common.pendingSpec')}</dd>
                  {(featured.specs?.extra ?? []).slice(0, 2).map((row) => (
                    <div key={row.id ?? row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
                  ))}
                  {!featured.specs?.extra?.length && (<><dt>{t('featured.materials')}</dt><dd className={featured.specs?.materials ? '' : 'muted'}>{featured.specs?.materials ?? t('common.pendingSpec')}</dd></>)}
                </dl>
                <Link className="btn" href={`/objects/${featured.slug}`}>{t('featured.view')} <span className="arr">→</span></Link>
              </div>
            </div>
            {strip.length > 0 && (
              <ul className="strip" aria-label={t('home.detailStrip', { name: featured.name })}>
                {strip.map((m, i) => (
                  <li key={m.id} className="strip-item">
                    <MediaImage media={m} fit="natural" sizes={['(min-width: 1440px) 560px, (min-width: 900px) 40vw, 78vw', '(min-width: 1440px) 450px, (min-width: 900px) 32vw, 78vw', '(min-width: 1440px) 340px, (min-width: 900px) 24vw, 78vw'][i] ?? '78vw'} />
                    {m.caption && <p className="figcap label muted"><span>{m.caption}</span></p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* 05 From idea to object */}
      <section className="section" id="process">
        <div className="wrap process">
          <div className="stick">
            <div className="sec-head" style={{ display: 'block', marginBottom: 'var(--s-3)' }}>
              <p className="label" style={{ marginBottom: '1rem' }}>{t('home.processEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={html('home.processHeading')} />
            </div>
            <p className="muted" style={{ maxWidth: '24rem' }}>{t('home.processLede')}</p>
          </div>
          <ol>
            {PROCESS.map((k) => {
              const [title, body] = t.raw(`process.${k}`) as [string, string]
              return (
                <li key={k} className="reveal"><h3>{title}</h3><p>{body}</p></li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* 06 The Modular Universe */}
      {settings.features?.modularPreview !== false && (
        <section className="section" id="modular">
          <div className="wrap">
            <div className="sec-head">
              <p className="label">{t('home.modularEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={html('home.modularHeading')} />
            </div>
            <ModularBoard
              labels={{
                modules: { base: t('modules.base'), building: t('modules.building'), tree: t('modules.tree'), lamp: t('modules.lamp') },
                empty: t.raw('modules.empty') as string,
                placedAt: t.raw('modules.placedAt') as string,
                placed: t('home.placed'),
                clear: t('home.clear'),
                price: t('home.price'),
                priceLater: t('home.priceLater'),
                hint: t('home.modularHint'),
              }}
            />
          </div>
        </section>
      )}

      {/* 07 Studio Journal (only when switched on and there is content) */}
      {journal.length > 0 && (
        <section className="section" id="journal">
          <div className="wrap">
            <div className="sec-head">
              <p className="label">{t('home.journalEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={html('home.journalHeading')} />
            </div>
            <div className="journal">
              {journal.map((post) => {
                const cover = asMedia(post.cover)
                return (
                  <Link key={post.id} className="entry reveal" href={`/journal/${post.slug}`}>
                    <div className="plate r-32">{cover && <MediaImage media={cover} sizes="(min-width: 900px) 30vw, 100vw" />}</div>
                    <span className="label muted">{post.category}</span>
                    <h3>{post.title}</h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 08 Upcoming drops */}
      <section className="section" id="upcoming">
        <div className="wrap">
          <div className="sec-head">
            <p className="label">{t('home.upcomingEyebrow')}</p>
            <h2 className="d-l" dangerouslySetInnerHTML={html('home.upcomingHeading')} />
          </div>
          <div className="drops">
            <DropBoard releases={releases} />
            <div className="notify-wrap"><NotifyForm locale={locale} source="home" /></div>
          </div>
        </div>
      </section>

      {/* 09 Closing statement */}
      {home.closingStatement && (
        <div className="closing"><div className="wrap"><p className="reveal">{home.closingStatement}</p></div></div>
      )}
    </>
  )
}
