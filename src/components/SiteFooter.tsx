import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Page, SiteSetting } from '@/payload-types'
import type { NavItem } from './SiteHeader'

export async function SiteFooter({ items, settings, pages }: { items: NavItem[]; settings: SiteSetting; pages: Page[] }) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const social = [
    ['Instagram', settings.contact?.instagram],
    ['TikTok', settings.contact?.tiktok],
    ['Facebook', settings.contact?.facebook],
  ].filter((s): s is [string, string] => Boolean(s[1]))
  const support = pages.filter((p) => p.section === 'support' && p.slug !== 'faq')
  const legal = pages.filter((p) => p.section === 'legal')

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-logo">
            <Image src="/brand/logo-stacked.png" alt="Saint Vincent Studio" width={627} height={627} sizes="140px" />
          </div>
          <div>
            <h2>{t('explore')}</h2>
            <ul>
              {items.map((it) => (
                <li key={it.href}><Link href={it.href}>{it.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t('support')}</h2>
            <ul>
              <li><Link href="/faq">{tn('faq')}</Link></li>
              {support.map((p) => (
                <li key={p.id}><Link href={`/support/${p.slug}`}>{p.title}</Link></li>
              ))}
              <li><Link href="/contact">{tn('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t('contact')}</h2>
            <ul>
              {settings.contact?.email && <li>{settings.contact.email}</li>}
              {social.map(([name, url]) => (
                <li key={name}><a href={url} rel="noopener noreferrer" target="_blank">{name}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="legal-row label">
          <span>© {new Date().getFullYear()} Saint Vincent Studio. {t('rights')}</span>
          <span style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {legal.map((p) => (
              <Link key={p.id} href={`/legal/${p.slug}`}>{p.title}</Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
