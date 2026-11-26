'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/lib/site'
import { useCart } from './CartProvider'
import { useQuote } from './useQuote'
import { Totals } from './Totals'

export function CartView({ locale }: { locale: 'en' | 'vi' }) {
  const t = useTranslations('cart')
  const { setQuantity, remove } = useCart()
  const { quote, loading, items } = useQuote(locale)

  if (!loading && items.length === 0) {
    return (
      <div className="cart-empty">
        <p>{t('empty')}</p>
        <Link className="btn" href="/collections">{t('browse')}</Link>
      </div>
    )
  }
  if (loading && !quote) return <p className="muted" role="status">{t('loading')}</p>
  if (!quote) return null

  return (
    <div className="cart" aria-busy={loading}>
      <ul className="cart-lines">
        {quote.lines.map((l) => (
          <li key={`${l.productId}:${l.sku}`} className="cart-line">
            <div>
              <Link href={`/objects/${l.productSlug}`} className="cart-name">{l.productName}</Link>
              {l.variantLabel && <p className="label muted">{l.variantLabel}</p>}
              <p className="label">{formatPrice(l.unitPriceVnd, 'VND', locale)}</p>
            </div>
            <div className="cart-qty">
              <label className="sr-only" htmlFor={`q-${l.productId}-${l.sku}`}>{t('quantity')}</label>
              <input id={`q-${l.productId}-${l.sku}`} type="number" min={1} max={10} value={l.quantity} onChange={(e) => setQuantity(l.productId, l.sku, Number(e.target.value) || 1)} />
              <button type="button" className="link-btn" onClick={() => remove(l.productId, l.sku)}>{t('remove')}</button>
            </div>
            <p className="cart-line-total">{formatPrice(l.lineTotalVnd, 'VND', locale)}</p>
          </li>
        ))}
        {quote.problems.map((p) => (
          <li key={`p-${p.productId}:${p.sku}`} className="cart-line cart-problem">
            <p>{t(`problem_${p.reason}`, { count: p.available ?? 0 })} <span className="label muted">({p.sku})</span></p>
            <div className="cart-qty">
              {p.reason === 'limitedStock' && p.available ? (
                <button type="button" className="link-btn" onClick={() => setQuantity(p.productId, p.sku, p.available!)}>{p.available}</button>
              ) : null}
              <button type="button" className="link-btn" onClick={() => remove(p.productId, p.sku)}>{t('remove')}</button>
            </div>
          </li>
        ))}
      </ul>
      {quote.lines.length > 0 && <Totals subtotal={quote.subtotalVnd} shipping={quote.shippingVnd} total={quote.totalVnd} locale={locale} />}
      {quote.problems.length > 0 ? (
        <p className="form-msg" data-tone="error">{t('fix')}</p>
      ) : (
        quote.lines.length > 0 && <Link className="btn btn-solid" href="/checkout">{t('checkout')}</Link>
      )}
    </div>
  )
}
