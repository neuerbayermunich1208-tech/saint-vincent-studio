import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Hanken_Grotesk, IBM_Plex_Mono, Noto_Serif_Display } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type React from 'react'
import { routing, type Locale } from '@/i18n/routing'
import { getPages, getSiteSettings } from '@/lib/data'
import { organizationJsonLd } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader, type NavItem } from '@/components/SiteHeader'
import { CartProvider } from '@/components/cart/CartProvider'
import '@/styles/globals.css'

const display = Noto_Serif_Display({ subsets: ['latin', 'vietnamese'], style: ['normal', 'italic'], variable: '--f-display', display: 'swap' })
const body = Hanken_Grotesk({ subsets: ['latin', 'vietnamese'], variable: '--f-body', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin', 'vietnamese'], weight: ['400', '500'], variable: '--f-mono', display: 'swap' })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = { themeColor: '#fdf5ea', viewportFit: 'cover', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('defaultTitle'), template: `%s · ${t('siteName')}` },
    description: t('defaultDescription'),
    applicationName: t('siteName'),
    icons: { icon: [{ url: '/brand/favicon-48.png', sizes: '48x48' }], apple: '/brand/apple-touch-icon.png' },
    openGraph: { siteName: t('siteName'), images: [{ url: '/brand/og-default.png', width: 1200, height: 630 }] },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [t, settings, pages] = await Promise.all([getTranslations('nav'), getSiteSettings(), getPages(locale as Locale)])
  const items: NavItem[] = [
    { href: '/collections', label: t('collections') },
    { href: '/studio', label: t('studio') },
    ...(settings.features?.journal ? [{ href: '/journal', label: t('journal') }] : []),
    { href: '/upcoming', label: t('upcoming') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <CartProvider>
          <a className="skip" href="#main">{t('skip')}</a>
          <SiteHeader
            locale={locale as Locale}
            items={items}
            commerce={settings.mode === 'commerce'}
            labels={{ menu: t('menu'), close: t('close'), primary: t('primary'), language: t('language'), homeLabel: t('homeLabel') }}
          />
          <main id="main">{children}</main>
          <SiteFooter items={items} settings={settings} pages={pages} />
          </CartProvider>
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  )
}
