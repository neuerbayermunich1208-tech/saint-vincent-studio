'use client'

import { useEffect, useState } from 'react'
import { quoteCart } from '@/actions/checkout'
import type { FullQuote } from '@/lib/commerce/server'
import { useCart } from './CartProvider'

/** Re-prices the browser cart on the server whenever it changes. */
export function useQuote(locale: 'en' | 'vi') {
  const { items, ready } = useCart()
  const [quote, setQuote] = useState<FullQuote | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!ready) return
    let live = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading state for the server round trip
    setLoading(true)
    quoteCart(items, locale)
      .then((q) => live && setQuote(q))
      .catch(() => live && setQuote(null))
      .finally(() => live && setLoading(false))
    return () => { live = false }
  }, [items, ready, locale])
  return { quote, loading: loading || !ready, items }
}
