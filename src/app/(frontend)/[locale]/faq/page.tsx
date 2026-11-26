import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageView } from '@/components/PageView'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })
  return buildMetadata({ locale, path: '/faq', title: t('title') })
}

/** The FAQ is a support page with the slug "faq", edited in the admin under Pages. */
export default async function FaqPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPage('faq', 'support', locale)
  if (!page) notFound()
  const t = await getTranslations('footer')
  return <PageView page={page} eyebrow={t('support')} />
}
