'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ObjectDrawing, drawingForIndex } from './Drawings'

export type IndexItem = { slug: string; name: string; summary?: string | null; themes: string[]; coverUrl?: string | null; coverAlt?: string | null }

export function CollectionIndex({ items, exploreLabel, conceptLabel }: { items: IndexItem[]; exploreLabel: string; conceptLabel: string }) {
  const [open, setOpen] = useState(0)
  return (
    <ul className="index">
      {items.map((c, i) => {
        const isOpen = open === i
        return (
          <li key={c.slug} data-open={isOpen}>
            <button type="button" className="index-btn" aria-expanded={isOpen} aria-controls={`col-${c.slug}`} onClick={() => setOpen(isOpen ? -1 : i)}>
              <span className="label muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="index-name">{c.name}</span>
              <span className="label muted" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="index-detail" id={`col-${c.slug}`}>
              <div>
                <div className="index-in">
                  <span />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                    {c.summary && <p>{c.summary}</p>}
                    {c.themes.length > 0 && (
                      <div className="tags label muted">{c.themes.map((t) => <span key={t}>{t}</span>)}</div>
                    )}
                    <Link className="link" href={`/collections/${c.slug}`} tabIndex={isOpen ? 0 : -1}>
                      {exploreLabel} {c.name} →
                    </Link>
                  </div>
                  <div className="plate r-1610">
                    {c.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.coverUrl} alt={c.coverAlt ?? ''} loading="lazy" />
                    ) : (
                      <>
                        <ObjectDrawing kind={drawingForIndex(i)} label={`${conceptLabel}: ${c.name}`} />
                        <span className="concept-tag">{conceptLabel}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
