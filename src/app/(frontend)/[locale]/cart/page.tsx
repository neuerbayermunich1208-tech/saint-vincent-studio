import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { CartView } from '@/components/cart/CartView'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  return buildMetadata({ locale, path: '/cart', title: t('title'), noIndex: true })
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([getTranslations('cart'), getSiteSettings()])
  if (settings.mode !== 'commerce') notFound()
  return (
    <section className="section page-top">
      <div className="wrap narrow">
        <h1 className="d-m">{t('title')}</h1>
        <CartView locale={locale} />
      </div>
    </section>
  )
}
