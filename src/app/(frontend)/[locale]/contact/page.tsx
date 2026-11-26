import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/ContactForm'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return buildMetadata({ locale, path: '/contact', title: t('title'), description: t('lede') })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([getTranslations('contact'), getSiteSettings()])
  return (
    <section className="section page-top">
      <div className="wrap">
        <div className="sec-head">
          <h1 className="label">{t('title')}</h1>
          <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('heading') as string }} />
          <p className="lede muted">{t('lede')}</p>
        </div>
        <div className="grid12">
          <div style={{ gridColumn: '1 / -1', maxWidth: '40rem' }} className="lg:[grid-column:4/10]">
            <ContactForm locale={locale} />
            {settings.contact?.email && (
              <p className="muted" style={{ marginTop: 'var(--s-4)' }}>
                {t('directEmail')}: <span style={{ color: 'var(--ink)', userSelect: 'all' }}>{settings.contact.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
