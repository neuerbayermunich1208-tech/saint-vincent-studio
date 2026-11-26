import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getHomepage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }
const PROCESS = ['concept', 'design', 'prototype', 'refine', 'manufacture', 'finish'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'studio' })
  const home = await getHomepage(locale)
  return buildMetadata({ locale, path: '/studio', title: t('title'), description: home.introStatement })
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const home = await getHomepage(locale)
  return (
    <>
      <section className="section page-top">
        <div className="wrap">
          <div className="sec-head">
            <h1 className="label">{t('studio.title')}</h1>
            <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('studio.heading') as string }} />
          </div>
          <div className="intro">
            {home.introStatement && <p className="big d-m">{home.introStatement}</p>}
            {!!home.pillars?.length && (
              <div className="notes">
                {home.pillars.map((p, i) => (
                  <div key={i}><span className="label pencil">{p.label}</span><p>{p.text}</p></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section" id="process">
        <div className="wrap process">
          <div className="stick">
            <div className="sec-head" style={{ display: 'block', marginBottom: 'var(--s-3)' }}>
              <p className="label" style={{ marginBottom: '1rem' }}>{t('home.processEyebrow')}</p>
              <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('home.processHeading') as string }} />
            </div>
            <p className="muted" style={{ maxWidth: '24rem' }}>{t('home.processLede')}</p>
          </div>
          <ol>
            {PROCESS.map((k) => {
              const [title, body] = t.raw(`process.${k}`) as [string, string]
              return <li key={k} className="reveal"><h3>{title}</h3><p>{body}</p></li>
            })}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap ctas">
          <Link className="btn" href="/collections">{t('home.ctaCollections')} <span className="arr">→</span></Link>
          <Link className="link" href="/contact">{t('nav.contact')}</Link>
        </div>
      </section>
    </>
  )
}
