'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { placeOrder, type CheckoutState } from '@/actions/checkout'
import { Link } from '@/i18n/navigation'
import { formatPrice } from '@/lib/site'
import { useCart } from './CartProvider'
import { useQuote } from './useQuote'
import { Totals } from './Totals'

export function CheckoutForm({ locale }: { locale: 'en' | 'vi' }) {
  const t = useTranslations('checkout')
  const tc = useTranslations('cart')
  const { clear } = useCart()
  const { quote, loading, items } = useQuote(locale)
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, { status: 'idle' })
  const id = useId()
  const redirected = useRef(false)

  useEffect(() => {
    if (state.status === 'redirect' && !redirected.current) {
      redirected.current = true
      clear()
      window.location.assign(state.url)
    }
  }, [state, clear])

  if (loading && !quote) return <p className="muted" role="status">{tc('loading')}</p>
  if (!quote || quote.lines.length === 0 || quote.problems.length > 0) {
    return (
      <div className="cart-empty">
        <p>{items.length === 0 ? tc('empty') : t('cartChanged')}</p>
        <Link className="btn" href="/cart">{t('back')}</Link>
      </div>
    )
  }
  if (quote.methods.length === 0) return <p className="form-msg" data-tone="error">{t('noMethods')}</p>

  const values = 'values' in state ? state.values : undefined
  const bad = (f: string) => state.status === 'invalid' && state.fields.includes(f)
  const field = (name: string, opts: { type?: string; auto?: string; required?: boolean; mode?: 'tel' | 'email' } = {}) => (
    <div className="field" data-invalid={bad(name) || undefined}>
      <label className="label" htmlFor={`${id}-${name}`}>{t(name)}</label>
      <input id={`${id}-${name}`} name={name} type={opts.type ?? 'text'} autoComplete={opts.auto} inputMode={opts.mode} required={opts.required ?? true} aria-invalid={bad(name) || undefined} defaultValue={values?.[name]} />
    </div>
  )
  const message = state.status === 'idle' || state.status === 'redirect' ? '' : t(state.status)

  return (
    <form className="checkout" action={action} noValidate>
      <div className="checkout-main">
        <fieldset>
          <legend className="label">{t('contact')}</legend>
          {field('name', { auto: 'name' })}
          <div className="field-pair">
            {field('phone', { type: 'tel', auto: 'tel', mode: 'tel' })}
            {field('email', { type: 'email', auto: 'email', mode: 'email' })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">{t('shipping')}</legend>
          {field('address', { auto: 'street-address' })}
          <div className="field-pair">
            {field('ward', { required: false })}
            {field('district', { required: false })}
          </div>
          {field('province', { auto: 'address-level1' })}
          <div className="field">
            <label className="label" htmlFor={`${id}-note`}>{t('note')}</label>
            <textarea id={`${id}-note`} name="note" rows={3} maxLength={500} defaultValue={values?.note} />
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">{t('payment')}</legend>
          {quote.methods.map((m, i) => (
            <label key={m} className="method">
              <input type="radio" name="method" value={m} defaultChecked={values?.method ? values.method === m : i === 0} />
              <span>
                <strong>{t(`method_${m}`)}</strong>
                <span className="muted">{t(`method_${m}_hint`)}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="cart" value={JSON.stringify(items)} />
        <input type="hidden" name="expectedTotal" value={quote.totalVnd} />
        <div className="hp" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <p className="form-msg" role="status" data-tone={message ? 'error' : undefined}>
          {message}
          {state.status === 'cartChanged' && <> <Link href="/cart">{t('back')}</Link></>}
        </p>
        <button type="submit" className="btn btn-solid" disabled={pending || state.status === 'redirect'}>
          {pending || state.status === 'redirect' ? t('submitting') : `${t('submit')} · ${formatPrice(quote.totalVnd, 'VND', locale)}`}
        </button>
        <p className="label muted">{t('privacy')}</p>
      </div>
      <aside className="checkout-summary" aria-label={t('summary')}>
        <h2 className="label">{t('summary')}</h2>
        <ul className="summary-lines">
          {quote.lines.map((l) => (
            <li key={`${l.productId}:${l.sku}`}>
              <span>{l.productName}{l.variantLabel ? ` · ${l.variantLabel}` : ''} × {l.quantity}</span>
              <span>{formatPrice(l.lineTotalVnd, 'VND', locale)}</span>
            </li>
          ))}
        </ul>
        <Totals subtotal={quote.subtotalVnd} shipping={quote.shippingVnd} total={quote.totalVnd} locale={locale} />
      </aside>
    </form>
  )
}
