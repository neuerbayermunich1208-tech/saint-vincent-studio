/* Concept line drawings in the studio's blue-pencil style. Used only where no product photography exists yet,
   and always labelled as concept on the page. */

const INK = 'var(--ink)'
const PENCIL = 'var(--pencil)'

export function LanternDrawing({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 500" role="img" aria-label={label}>
      <g fill="none" stroke={INK} strokeWidth="1.4">
        <ellipse cx="200" cy="140" rx="92" ry="22" />
        <path d="M108 140 L132 300 M292 140 L268 300" />
        <ellipse cx="200" cy="300" rx="68" ry="15" />
        <path d="M200 315 V398" />
        <path d="M150 398 h100 l14 30 h-128z" />
        <ellipse cx="200" cy="300" rx="40" ry="8" strokeDasharray="3 4" />
      </g>
      <g fill="none" stroke={PENCIL} strokeWidth="1">
        <path d="M80 140 V300 M74 140 h12 M74 300 h12" />
        <path d="M108 460 H292 M108 454 v12 M292 454 v12" />
        <circle cx="200" cy="230" r="26" strokeDasharray="2 3" />
      </g>
      <g fill={PENCIL} fontFamily="var(--f-mono)" fontSize="11">
        <text x="30" y="224" transform="rotate(-90 40 224)">H — tbd</text>
        <text x="172" y="482">Ø — tbd</text>
        <text x="236" y="210">warm diffusion</text>
      </g>
    </svg>
  )
}

export function CornerDrawing({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 800 550" role="img" aria-label={label}>
      <g fill="none" stroke={INK} strokeWidth="1.4">
        <path d="M120 360 L400 470 L690 340 L410 240 Z" />
        <path d="M120 360 v26 L400 496 v-26 M690 340 v26 L400 496" />
        <path d="M210 330 L430 418 M300 300 L520 386" strokeDasharray="10 8" />
        <path d="M450 262 L560 302 L560 180 L450 140 Z" />
        <path d="M560 302 L640 268 L640 148 L560 180 M450 140 L530 108 L640 148" />
        <path d="M470 180 l20 7 v26 l-20 -7z M510 194 l20 7 v26 l-20 -7z M470 228 l20 7 v26 l-20 -7z M510 242 l20 7 v26 l-20 -7z" />
        <path d="M250 352 l52 20 l20 -9 l-52 -20 z M250 352 v8 l52 20 v-8 M302 380 l20 -9 v-8" />
      </g>
      <g fill="none" stroke={PENCIL} strokeWidth="1" strokeDasharray="3 4">
        <path d="M690 340 L760 312 M120 360 L48 330" />
      </g>
    </svg>
  )
}

const COLLECTION_PATHS: Record<string, string> = {
  diorama: 'M40 150 L160 190 L280 140 L160 100Z M160 100 v-40 l40 -14 v40',
  model_kit: 'M70 80h60v60h-60z M130 80h60v60h-60z M100 140h60v60h-60z',
  lighting: 'M100 70 a60 14 0 1 0 120 0 a60 14 0 1 0 -120 0 M100 70 L120 170 M220 70 L200 170 M160 184 v30',
  object: 'M70 170 h180 M90 170 v-60 h60 v60 M170 170 v-90 h50 v90',
  edition: 'M96 120 a64 64 0 1 0 128 0 a64 64 0 1 0 -128 0 M96 120 h128 M160 56 v128',
}

/** Index i picks a drawing in collection order; `kind` picks it by product type. */
export function ObjectDrawing({ kind, label }: { kind: keyof typeof COLLECTION_PATHS | string; label: string }) {
  const d = COLLECTION_PATHS[kind] ?? COLLECTION_PATHS.edition
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label={label}>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4" />
    </svg>
  )
}

export const drawingForIndex = (i: number) => ['diorama', 'model_kit', 'lighting', 'object', 'edition'][i % 5]
