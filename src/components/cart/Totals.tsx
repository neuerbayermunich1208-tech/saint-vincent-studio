import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/site'

export function Totals({ subtotal, shipping, total, locale }: { subtotal: number; shipping: number | null; total: number; locale: string }) {
  const t = useTranslations('cart')
  return (
    <dl className="totals">
      <div><dt>{t('subtotal')}</dt><dd>{formatPrice(subtotal, 'VND', locale)}</dd></div>
      <div><dt>{t('shipping')}</dt><dd>{shipping === null ? t('shippingTbc') : shipping === 0 ? t('shippingFree') : formatPrice(shipping, 'VND', locale)}</dd></div>
      <div className="totals-total"><dt>{t('total')}</dt><dd>{formatPrice(total, 'VND', locale)}</dd></div>
    </dl>
  )
}
