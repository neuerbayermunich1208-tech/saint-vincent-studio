import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getCollections } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { ObjectDrawing, drawingForIndex } from '@/components/Drawings'
import { MediaImage, asMedia } from '@/components/Media'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'collections' })
  return buildMetadata({ locale, path: '/collections', title: t('title') })
}

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const collections = await getCollections(locale)
  return (
    <section className="section page-top">
      <div className="wrap">
        <div className="sec-head">
          <h1 className="label">{t('collections.title')}</h1>
          <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('collections.heading') as string }} />
        </div>
        <div className="journal">
          {collections.map((c, i) => {
            const cover = asMedia(c.cover)
            return (
              <Link key={c.id} href={`/collections/${c.slug}`} className="entry reveal">
                <div className="plate r-1610">
                  {cover ? <MediaImage media={cover} sizes="(min-width: 900px) 30vw, 100vw" /> : <ObjectDrawing kind={drawingForIndex(i)} label={`${t('common.concept')}: ${c.name}`} />}
                  {!cover && <span className="concept-tag">{t('common.concept')}</span>}
                </div>
                <span className="label muted">{String(i + 1).padStart(2, '0')}{c.code ? ` · SV-${c.code}` : ''}</span>
                <h3 className="d-m">{c.name}</h3>
                {c.summary && <p className="muted">{c.summary}</p>}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
