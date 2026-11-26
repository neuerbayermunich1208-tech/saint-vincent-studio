'use client'

import { useEffect, useState } from 'react'

const KEY = 'sv-wishlist'

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Wishlist kept in the visitor's browser until customer accounts exist (Phase 4). */
export function SaveButton({ id, addLabel, removeLabel }: { id: string; addLabel: string; removeLabel: string }) {
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after hydration
    setSaved(read().includes(id))
  }, [id])
  const toggle = () => {
    const list = read()
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage blocked: keep in memory */ }
    setSaved(next.includes(id))
  }
  return (
    <button type="button" className="save" aria-pressed={saved} aria-label={saved ? removeLabel : addLabel} onClick={toggle}>
      {saved ? '♥' : '♡'}
    </button>
  )
}
