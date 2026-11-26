'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useCart } from './CartProvider'

export type SellableVariant = { sku: string; label: string; priceText: string; inStock: boolean }

export function AddToCart({ productId, variants }: { productId: number; variants: SellableVariant[] }) {
  const t = useTranslations('cart')
  const { add } = useCart()
  const id = useId()
  const firstInStock = variants.find((v) => v.inStock) ?? variants[0]
  const [sku, setSku] = useState(firstInStock?.sku ?? '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const current = variants.find((v) => v.sku === sku)
  if (!current) return null

  return (
    <div className="add-to-cart">
      {variants.length > 1 && (
        <>
          <label className="label" htmlFor={`${id}-v`}>{t('variant')}</label>
          <select id={`${id}-v`} value={sku} onChange={(e) => { setSku(e.target.value); setAdded(false) }}>
            {variants.map((v) => (
              <option key={v.sku} value={v.sku} disabled={!v.inStock}>
                {v.label} · {v.priceText}{v.inStock ? '' : ` · ${t('soldOut')}`}
              </option>
            ))}
          </select>
        </>
      )}
      <div className="field-line">
        <label className="sr-only" htmlFor={`${id}-q`}>{t('quantity')}</label>
        <input id={`${id}-q`} type="number" min={1} max={10} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} />
        <button
          type="button"
          disabled={!current.inStock}
          onClick={() => { add({ productId, sku, quantity: qty }); setAdded(true) }}
        >
          {current.inStock ? t('add') : t('soldOut')}
        </button>
      </div>
      <p className="form-msg" role="status" data-tone={added ? 'ok' : undefined}>
        {added && (<>{t('added')} · <Link href="/cart">{t('link')}</Link></>)}
      </p>
    </div>
  )
}
