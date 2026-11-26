import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <section className="section">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
        <p className="label pencil">404</p>
        <h1 className="d-l">{t('title')}</h1>
        <Link className="btn" href="/">{t('back')} <span className="arr">→</span></Link>
      </div>
    </section>
  )
}
