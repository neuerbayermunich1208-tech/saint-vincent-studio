'use client'

import { useState, type ReactNode } from 'react'

export type Hotspot = { x: number; y: number; title: string; body?: string | null }

export function Hotspots({ spots, children, emptyTitle, emptyBody }: { spots: Hotspot[]; children: ReactNode; emptyTitle: string; emptyBody: string }) {
  const [active, setActive] = useState<number | null>(null)
  const current = active === null ? null : spots[active]
  return (
    <>
      <div className="stage">
        {children}
        {spots.map((s, i) => (
          <button
            key={i}
            type="button"
            className="hot"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            aria-pressed={active === i}
            aria-label={`${i + 1}. ${s.title}`}
            onClick={() => setActive(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="note-card" aria-live="polite">
        <h3 className="h3">{current ? current.title : emptyTitle}</h3>
        <p className="muted">{current ? current.body : emptyBody}</p>
      </div>
    </>
  )
}
