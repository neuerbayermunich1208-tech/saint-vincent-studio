'use client'

import { useEffect, useRef, useState } from 'react'

type Part = { title: string; note: string }

/** Scroll-linked exploded view. Uses native scrolling only; reduced motion shows a static, half-exploded state. */
export function ExplodedLamp({ heading, hint, parts, label }: { heading: string; hint: string; parts: Part[]; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0.6)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = track.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight))))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const e = Math.min(1, p * 1.6)
  const offsets = [-150, -80, -25, 25, 110]
  const on = (k: number) => p > k * 0.14 + 0.08
  const left = parts.slice(0, 3)
  const right = parts.slice(3)

  return (
    <div className="explode-track" ref={track}>
      <div className="explode-pin">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', paddingBlock: '1.5rem 1rem', borderBottom: '1px solid var(--ink)' }}>
          <h2 className="d-l" dangerouslySetInnerHTML={{ __html: heading }} />
          <span className="label muted">{hint}</span>
        </div>
        <div className="wrap explode-stage">
          <ul className="parts">
            {left.map((pt, k) => (
              <li key={pt.title} data-on={on(k)}>
                <span className="label">{String(k + 1).padStart(2, '0')}</span>
                <span><b>{pt.title}</b><br /><span className="muted">{pt.note}</span></span>
              </li>
            ))}
          </ul>
          <svg viewBox="0 0 500 640" role="img" aria-label={label}>
            <g transform={`translate(0 ${offsets[0] * e})`} fill="none" stroke="var(--ink)" strokeWidth="1.4">
              <path d="M175 70 h150 l-8 26 h-134z" /><ellipse cx="250" cy="70" rx="75" ry="14" />
            </g>
            <g transform={`translate(0 ${offsets[1] * e})`} fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.4">
              <path d="M160 110 h180 l-30 130 h-120z" /><ellipse cx="250" cy="110" rx="90" ry="18" />
            </g>
            <g transform={`translate(0 ${offsets[2] * e})`} stroke="var(--pencil)" strokeWidth="1.4" fill="none">
              <ellipse cx="250" cy="248" rx="58" ry="11" /><rect x="226" y="248" width="48" height="22" />
            </g>
            <g transform={`translate(0 ${offsets[3] * e})`} fill="none" stroke="var(--ink)" strokeWidth="1.4">
              <rect x="238" y="270" width="24" height="200" />
            </g>
            <g transform={`translate(0 ${offsets[4] * e})`} fill="none" stroke="var(--ink)" strokeWidth="1.4">
              <path d="M150 470 h200 v26 a100 14 0 0 1 -200 0z" /><ellipse cx="250" cy="470" rx="100" ry="14" />
            </g>
          </svg>
          <ul className="parts">
            {right.map((pt, k) => (
              <li key={pt.title} data-on={on(k + 3)}>
                <span className="label">{String(k + 4).padStart(2, '0')}</span>
                <span><b>{pt.title}</b><br /><span className="muted">{pt.note}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="explode-progress" aria-hidden="true"><i style={{ ['--p' as string]: p }} /></div>
      </div>
    </div>
  )
}
