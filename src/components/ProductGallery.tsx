'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryImage = { id: string | number; src: string; width: number; height: number; alt: string; caption?: string | null }

type Labels = { open: string; viewer: string; prev: string; next: string; close: string; counter: string }

const fill = (tpl: string, n: number, total: number) => tpl.replace('{n}', String(n)).replace('{total}', String(total))

/**
 * Desktop: images stacked in their own aspect ratio, scrolling with the page.
 * Mobile: horizontal swipe track with scroll-snap and an "n / total" counter. Vertical page scroll is never captured.
 * Click opens a native <dialog> lightbox (Esc closes, focus stays inside while open, page scroll is not locked).
 */
export function ProductGallery({ images, labels }: { images: GalleryImage[]; labels: Labels }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [visible, setVisible] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const total = images.length

  // Track which slide is in view on the mobile track.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const items = Array.from(track.children) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(items.indexOf(e.target as HTMLElement))
      },
      { root: track, threshold: 0.6 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [total])

  const show = useCallback((i: number) => {
    setOpen(i)
    const d = dialogRef.current
    if (d && !d.open) d.showModal()
  }, [])

  const step = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + total) % total)), [total])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  }

  const current = open === null ? null : images[open]

  return (
    <div className="pg">
      <ul className="pg-track" ref={trackRef}>
        {images.map((img, i) => (
          <li key={img.id} className="pg-item">
            <button type="button" className="pg-open" onClick={() => show(i)} aria-label={fill(labels.open, i + 1, total)}>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1440px) 790px, (min-width: 900px) 56vw, calc(100vw - 32px)"
                priority={i === 0}
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? undefined : 'lazy'}
              />
            </button>
          </li>
        ))}
      </ul>
      {total > 1 && (
        <p className="pg-count label" aria-hidden="true">{fill(labels.counter, visible + 1, total)}</p>
      )}

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={labels.viewer}
        onClose={() => setOpen(null)}
        onKeyDown={onKey}
        onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current?.close() }}
      >
        {current && (
          <figure className="lb-fig">
            <div className="lb-img">
              <Image key={current.id} src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" />
            </div>
            <figcaption className="lb-cap label">
              <span>{fill(labels.counter, (open ?? 0) + 1, total)}</span>
              {current.caption && <span className="muted">{current.caption}</span>}
            </figcaption>
          </figure>
        )}
        <div className="lb-ctrl">
          {total > 1 && <button type="button" className="btn-ghost" onClick={() => step(-1)}>← <span className="sr-only">{labels.prev}</span></button>}
          {total > 1 && <button type="button" className="btn-ghost" onClick={() => step(1)}><span className="sr-only">{labels.next}</span> →</button>}
          <button type="button" className="btn-ghost" onClick={() => dialogRef.current?.close()} autoFocus>{labels.close}</button>
        </div>
      </dialog>
    </div>
  )
}
