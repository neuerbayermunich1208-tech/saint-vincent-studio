import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageView } from '@/components/PageView'

export const revalidate = 300
// Rendered on first request, then cached and refreshed when content changes.
export function generateStaticParams() {
  return []
}
type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getPage(slug, 'support', locale)
  if (!page) return {}
  return buildMetadata({ locale, path: '/support/' + slug, title: page.seo?.title ?? page.title, description: page.seo?.description, noIndex: page.seo?.noIndex })
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getPage(slug, 'support', locale)
  if (!page) notFound()
  const t = await getTranslations('footer')
  return <PageView page={page} eyebrow={t('support')} />
}
