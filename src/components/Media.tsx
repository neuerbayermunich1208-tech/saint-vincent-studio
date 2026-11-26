import Image from 'next/image'
import type { Media as MediaDoc } from '@/payload-types'

export const asMedia = (m: unknown): MediaDoc | null => (m && typeof m === 'object' && 'url' in m ? (m as MediaDoc) : null)

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

/** Payload returns absolute URLs for local uploads; make same-site ones relative so next/image treats them as local. */
export function mediaSrc(url: string) {
  if (SITE_ORIGIN && url.startsWith(SITE_ORIGIN + '/')) return url.slice(SITE_ORIGIN.length)
  return url
}

/** Media docs from a hasMany upload field, populated ones only. */
export const asMediaList = (list: unknown): MediaDoc[] =>
  (Array.isArray(list) ? list : []).map(asMedia).filter((m): m is MediaDoc => Boolean(m?.url && m.width && m.height))

/**
 * `fit="cover"` fills a fixed-ratio plate. `fit="natural"` keeps the image's own aspect ratio (no cropping),
 * which is what hotspots and product photos need.
 */
export function MediaImage({
  media,
  sizes,
  priority,
  className,
  fit = 'cover',
  quality = 85,
}: {
  media: MediaDoc
  sizes: string
  priority?: boolean
  className?: string
  fit?: 'cover' | 'contain' | 'natural'
  /** Product photography is shown at 85 by default so it stays crisp on 2x screens. */
  quality?: number
}) {
  if (!media.url || !media.width || !media.height) return null
  const style =
    fit === 'natural'
      ? { width: '100%', height: 'auto' }
      : { width: '100%', height: '100%', objectFit: fit, objectPosition: focal(media) }
  return (
    <Image
      src={mediaSrc(media.url)}
      alt={media.alt ?? ''}
      width={media.width}
      height={media.height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={style}
    />
  )
}

function focal(m: MediaDoc) {
  return typeof m.focalX === 'number' && typeof m.focalY === 'number' ? `${m.focalX}% ${m.focalY}%` : undefined
}
