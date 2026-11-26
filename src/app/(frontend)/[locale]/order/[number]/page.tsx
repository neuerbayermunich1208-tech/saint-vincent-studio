import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/data'
import { formatPrice } from '@/lib/site'
import { safeEqualHex } from '@/lib/commerce/payos'
import { syncPayosOrder } from '@/lib/commerce/sync'
import { Totals } from '@/components/cart/Totals'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ locale: Locale; number: string }>; searchParams: Promise<{ t?: string; cancelled?: string }> }

export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' }

/** Private order page: the random token in the link is the key. */
export default async function OrderPage({ params, searchParams }: Props) {
  const { locale, number } = await params
  const { t: token } = await searchParams
  setRequestLocale(locale)
  if (!token || !/^SV\d{7}$/.test(number)) notFound()

  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'orders', where: { orderNumber: { equals: number } }, limit: 1, depth: 0, overrideAccess: true, showHiddenFields: true })
  let order = res.docs[0]
  if (!order || !order.accessToken || !safeEqualHex(order.accessToken, token)) notFound()
  order = await syncPayosOrder(payload, order)

  const [t, settings] = await Promise.all([getTranslations('order'), getSiteSettings()])
  const bank = settings.checkout?.bank
  const fresh = ['pending_payment', 'awaiting_transfer', 'confirmed', 'paid'].includes(order.status)

  return (
    <section className="section page-top">
      <div className="wrap narrow order">
        <p className="label">{t('title', { number: order.orderNumber })}</p>
        <h1 className="d-m">{order.status === 'cancelled' ? t('status_cancelled') : fresh ? t('thanks') : t(`status_${order.status}`)}</h1>
        {order.status !== 'cancelled' && <p className="lede muted">{t('lede')}</p>}

        <dl className="spec-rows">
          <div><dt>{t('status')}</dt><dd>{t(`status_${order.status}`)}</dd></div>
          {order.shipping?.trackingNumber && <div><dt>{t('tracking')}</dt><dd>{order.shipping.trackingNumber}</dd></div>}
        </dl>

        {order.status === 'cancelled' && order.paymentMethod === 'payos' && <p className="form-msg" data-tone="error">{t('cancelledNote')}</p>}

        {order.status === 'pending_payment' && order.payment?.checkoutUrl && (
          <p><a className="btn btn-solid" href={order.payment.checkoutUrl}>{t('payNow')}</a></p>
        )}

        {order.status === 'awaiting_transfer' && bank?.accountNumber && (
          <div className="note-card">
            <h2 className="label">{t('transferHeading')}</h2>
            <dl className="spec-rows">
              {bank.bankName && <div><dt>{t('bank')}</dt><dd>{bank.bankName}</dd></div>}
              {bank.accountName && <div><dt>{t('accountName')}</dt><dd>{bank.accountName}</dd></div>}
              <div><dt>{t('accountNumber')}</dt><dd style={{ userSelect: 'all' }}>{bank.accountNumber}</dd></div>
              <div><dt>{t('amount')}</dt><dd>{formatPrice(order.totalVnd, 'VND', locale)}</dd></div>
              <div><dt>{t('reference')}</dt><dd style={{ userSelect: 'all' }}>{order.orderNumber}</dd></div>
            </dl>
            <p className="muted">{t('transferNote')}</p>
          </div>
        )}

        <h2 className="label">{t('items')}</h2>
        <ul className="summary-lines">
          {(order.items ?? []).map((l) => (
            <li key={l.id ?? l.sku}>
              <span>{l.productName}{l.variantLabel ? ` · ${l.variantLabel}` : ''} × {l.quantity}</span>
              <span>{formatPrice(l.lineTotalVnd, 'VND', locale)}</span>
            </li>
          ))}
        </ul>
        <Totals subtotal={order.subtotalVnd} shipping={order.shippingVnd ?? null} total={order.totalVnd} locale={locale} />

        <h2 className="label">{t('deliverTo')}</h2>
        <p>
          {order.customer.name} · {order.customer.phone}<br />
          {[order.shipping.address, order.shipping.ward, order.shipping.district, order.shipping.province].filter(Boolean).join(', ')}
        </p>
        <p className="muted">{t('contact')}</p>
      </div>
    </section>
  )
}
