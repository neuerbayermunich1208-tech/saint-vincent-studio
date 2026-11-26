import { getFormatter, getTranslations } from 'next-intl/server'
import type { Release } from '@/payload-types'

/** Upcoming releases. A date is only shown once it is set in the admin; no countdowns. */
export async function DropBoard({ releases }: { releases: Release[] }) {
  const t = await getTranslations()
  const format = await getFormatter()
  if (!releases.length) return <p className="muted">{t('drops.empty')}</p>
  return (
    <div className="dropboard" tabIndex={0}>
      <table>
        <thead>
          <tr><th>{t('drops.number')}</th><th>{t('drops.piece')}</th><th>{t('drops.stage')}</th><th>{t('drops.release')}</th></tr>
        </thead>
        <tbody>
          {releases.map((r, i) => (
            <tr key={r.id}>
              <td className="mono">{r.catalogueNumber ?? '—'}</td>
              <td className="piece"><span className="flap" style={{ animationDelay: `${i * 120}ms` }}>{r.title}</span></td>
              <td className="mono pencil">{t(`status.${r.stage}`)}</td>
              <td className="mono">{r.releaseDate ? format.dateTime(new Date(r.releaseDate), { dateStyle: 'medium' }) : t('common.tba')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
