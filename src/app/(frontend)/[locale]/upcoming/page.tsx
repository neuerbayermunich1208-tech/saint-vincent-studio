import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getReleases } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { DropBoard } from '@/components/DropBoard'
import { NotifyForm } from '@/components/NotifyForm'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'upcoming' })
  return buildMetadata({ locale, path: '/upcoming', title: t('title'), description: t('lede') })
}

export default async function UpcomingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('upcoming')
  const releases = await getReleases(locale)
  return (
    <section className="section page-top">
      <div className="wrap">
        <div className="sec-head">
          <h1 className="label">{t('title')}</h1>
          <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('heading') as string }} />
          <p className="lede muted">{t('lede')}</p>
        </div>
        <div className="drops">
          <DropBoard releases={releases} />
          <div className="notify-wrap"><NotifyForm locale={locale} source="upcoming" /></div>
        </div>
      </div>
    </section>
  )
}
