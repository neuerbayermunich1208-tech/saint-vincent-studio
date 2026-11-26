import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'checkout' })
  return buildMetadata({ locale, path: '/checkout', title: t('title'), noIndex: true })
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([getTranslations('checkout'), getSiteSettings()])
  if (settings.mode !== 'commerce') notFound()
  return (
    <section className="section page-top">
      <div className="wrap">
        <h1 className="d-m">{t('title')}</h1>
        <CheckoutForm locale={locale} />
      </div>
    </section>
  )
}
