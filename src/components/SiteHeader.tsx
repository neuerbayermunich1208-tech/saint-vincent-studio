'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { CartLink } from '@/components/cart/CartLink'

export type NavItem = { href: string; label: string }

type Props = {
  locale: Locale
  items: NavItem[]
  commerce?: boolean
  labels: { menu: string; close: string; primary: string; language: string; homeLabel: string }
}

export function SiteHeader({ locale, items, labels, commerce = false }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <header className="hdr" data-scrolled={scrolled}>
        <div className="wrap hdr-in">
          <Link className="brand" href="/" aria-label={labels.homeLabel}>
            <Image src="/brand/logo-horizontal.png" alt="Saint Vincent Studio" width={1086} height={362} sizes="(min-width: 900px) 140px, 120px" priority />
          </Link>
          <nav className="nav" aria-label={labels.primary}>
            {items.map((it) => (
              <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? 'page' : undefined}>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="tools">
            {commerce && <CartLink />}
            <div className="lang" role="group" aria-label={labels.language}>
              {(['en', 'vi'] as const).map((l) => (
                <Link key={l} href={pathname} locale={l} aria-current={l === locale ? 'true' : undefined} hrefLang={l}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            <button type="button" className="btn-ghost menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
              {labels.menu}
            </button>
          </div>
        </div>
      </header>
      <div className="overlay" id="mobile-menu" data-open={open} aria-hidden={!open} inert={!open}>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
          {labels.close}
        </button>
        <nav aria-label={labels.primary}>
          {items.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)}>
              {it.label}
            </Link>
          ))}
        </nav>
        {commerce && <CartLink onNavigate={() => setOpen(false)} />}
        <p className="label" style={{ color: 'var(--rule)' }}>saintvincent.studio</p>
      </div>
    </>
  )
}
