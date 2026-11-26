'use client'

import { useState } from 'react'

const SHAPES = {
  base: <rect x="10" y="30" width="80" height="40" />,
  building: <path d="M25 85V30l25-15 25 15v55z M40 45h20v15H40z" />,
  tree: <><circle cx="50" cy="40" r="22" /><path d="M50 62v25" /></>,
  lamp: <><path d="M50 88V25h18" /><circle cx="70" cy="28" r="5" /></>,
} as const
type ModuleKey = keyof typeof SHAPES

type Labels = { modules: Record<ModuleKey, string>; empty: string; placedAt: string; placed: string; clear: string; price: string; priceLater: string; hint: string }

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
const tileId = (i: number) => `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`

/** The first sketch of the modular configurator. State is local; nothing is saved. */
export function ModularBoard({ labels }: { labels: Labels }) {
  const [current, setCurrent] = useState<ModuleKey>('building')
  const [tiles, setTiles] = useState<(ModuleKey | null)[]>(() => {
    const t: (ModuleKey | null)[] = Array(12).fill(null)
    t[0] = 'base'; t[1] = 'building'; t[5] = 'tree'
    return t
  })
  const count = tiles.filter(Boolean).length

  return (
    <div className="mod">
      <div className="board" role="group" aria-label="4 × 3">
        {tiles.map((v, i) => (
          <button
            key={i}
            type="button"
            className="cell"
            aria-label={v ? fill(labels.placedAt, { module: labels.modules[v], n: tileId(i) }) : fill(labels.empty, { n: tileId(i) })}
            onClick={() => setTiles((t) => t.map((x, k) => (k === i ? (x ? null : current) : x)))}
          >
            <span className="id">{tileId(i)}</span>
            {v && (
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <g fill="none" stroke="var(--ink)" strokeWidth="2">{SHAPES[v]}</g>
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className="panel">
        <p className="muted">{labels.hint}</p>
        <div className="chips" role="group">
          {(Object.keys(SHAPES) as ModuleKey[]).map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={current === k} onClick={() => setCurrent(k)}>
              {labels.modules[k]}
            </button>
          ))}
        </div>
        <dl className="specs">
          <dt>{labels.placed}</dt>
          <dd style={{ fontVariantNumeric: 'tabular-nums' }}>{count} / 12</dd>
          <dt>{labels.price}</dt>
          <dd className="muted">{labels.priceLater}</dd>
        </dl>
        <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setTiles(Array(12).fill(null))}>
          {labels.clear}
        </button>
      </div>
    </div>
  )
}
