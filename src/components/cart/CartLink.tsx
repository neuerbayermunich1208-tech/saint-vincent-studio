'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useCart } from './CartProvider'

export function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations('cart')
  const { count, ready } = useCart()
  return (
    <Link href="/cart" className="cart-link" aria-label={t('count', { count })} onClick={onNavigate}>
      {t('link')}
      <span className="cart-count" aria-hidden="true">{ready ? count : 0}</span>
    </Link>
  )
}
