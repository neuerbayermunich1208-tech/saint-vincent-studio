import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getJournalPosts, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { MediaImage, asMedia } from '@/components/Media'

export const revalidate = 300
type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'journal' })
  return buildMetadata({ locale, path: '/journal', title: t('title') })
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const settings = await getSiteSettings()
  if (!settings.features?.journal) notFound()
  const [t, posts] = await Promise.all([getTranslations(), getJournalPosts(locale, 50)])
  return (
    <section className="section page-top">
      <div className="wrap">
        <div className="sec-head">
          <h1 className="label">{t('journal.title')}</h1>
          <h2 className="d-l" dangerouslySetInnerHTML={{ __html: t.raw('home.journalHeading') as string }} />
        </div>
        <div className="journal">
          {posts.map((post) => {
            const cover = asMedia(post.cover)
            return (
              <Link key={post.id} className="entry" href={`/journal/${post.slug}`}>
                <div className="plate r-32">{cover && <MediaImage media={cover} sizes="(min-width: 900px) 30vw, 100vw" />}</div>
                <span className="label muted">{post.category}</span>
                <h3>{post.title}</h3>
                {post.excerpt && <p className="muted">{post.excerpt}</p>}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
