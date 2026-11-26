import Image from 'next/image'
import type { Media as MediaDoc } from '@/payload-types'

export const asMedia = (m: unknown): MediaDoc | null => (m && typeof m === 'object' && 'url' in m ? (m as MediaDoc) : null)

export function MediaImage({ media, sizes, priority, className }: { media: MediaDoc; sizes: string; priority?: boolean; className?: string }) {
  if (!media.url || !media.width || !media.height) return null
  return (
    <Image
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
