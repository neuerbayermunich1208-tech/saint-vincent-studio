'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MAX_QTY_PER_LINE, normaliseCart, type CartItem } from '@/lib/commerce/cart'

const KEY = 'sv-cart'

type CartApi = {
  items: CartItem[]
  ready: boolean
  count: number
  add: (item: CartItem) => void
  setQuantity: (productId: number, sku: string, quantity: number) => void
  remove: (productId: number, sku: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

function read(): CartItem[] {
  try {
    return normaliseCart(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return []
  }
}

/** Cart kept in the visitor's browser. Prices and stock are always re-checked on the server. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after hydration
    setItems(read())
    setReady(true)
    const onStorage = (e: StorageEvent) => e.key === KEY && setItems(read())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((next: CartItem[]) => {
    const clean = normaliseCart(next)
    setItems(clean)
    try { localStorage.setItem(KEY, JSON.stringify(clean)) } catch { /* storage blocked: keep in memory */ }
  }, [])

  const api = useMemo<CartApi>(() => ({
    items,
    ready,
    count: items.reduce((n, i) => n + i.quantity, 0),
    add: (item) => save([...items, item]),
    setQuantity: (productId, sku, quantity) =>
      save(items.map((i) => (i.productId === productId && i.sku === sku ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY_PER_LINE, quantity)) } : i))),
    remove: (productId, sku) => save(items.filter((i) => !(i.productId === productId && i.sku === sku))),
    clear: () => save([]),
  }), [items, ready, save])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
