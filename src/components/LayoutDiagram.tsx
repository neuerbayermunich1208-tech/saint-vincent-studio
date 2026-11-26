/**
 * "Two bases, one street": a schematic plan drawn in code (ink on paper) from the product's
 * layout modules and overall dimensions. Only public values are drawn; nothing is measured off photos.
 */
type Module = { code: string; name?: string | null }

export function LayoutDiagram({
  modules,
  widthMm,
  depthMm,
  split = 'width',
  jointLabel,
  label,
}: {
  modules: Module[]
  widthMm?: number | null
  depthMm?: number | null
  /** 'depth': bases sit one behind the other (joint runs across the width). 'width': side by side. */
  split?: 'depth' | 'width'
  jointLabel: string
  label: string
}) {
  if (!modules.length) return null
  const W = widthMm && widthMm > 0 ? widthMm : 432
  const D = depthMm && depthMm > 0 ? depthMm : 260
  const pad = 46
  const k = 1.6 // drawing units per mm
  const w = W * k
  const d = D * k
  const vbW = w + pad * 2
  const vbH = d + pad * 2
  const n = modules.length
  const x0 = pad
  const y0 = pad

  const cells = modules.map((m, i) =>
    split === 'depth'
      ? { m, x: x0, y: y0 + (d / n) * i, w, h: d / n }
      : { m, x: x0 + (w / n) * i, y: y0, w: w / n, h: d },
  )

  return (
    <svg className="layout-svg" viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label={label}>
      <defs>
        <pattern id="lay-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
        </pattern>
        <marker id="lay-tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.4" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor">
        {cells.map(({ m, x, y, w: cw, h: ch }, i) => (
          <g key={m.code + i}>
            <rect x={x} y={y} width={cw} height={ch} fill={i % 2 ? 'url(#lay-hatch)' : 'none'} strokeWidth="1.6" />
            <text x={x + cw / 2} y={y + ch / 2 - 6} textAnchor="middle" className="lay-code" fill="currentColor" stroke="none">{m.code}</text>
            {m.name && <text x={x + cw / 2} y={y + ch / 2 + 18} textAnchor="middle" className="lay-name" fill="currentColor" stroke="none">{m.name}</text>}
          </g>
        ))}
        {/* Joints between bases */}
        {cells.slice(1).map((c, i) =>
          split === 'depth' ? (
            <g key={`j${i}`}>
              <line x1={x0 - 10} y1={c.y} x2={x0 + w + 10} y2={c.y} strokeWidth="1.2" strokeDasharray="6 5" className="pencil-stroke" />
              <text x={x0 + w - 4} y={c.y - 7} textAnchor="end" className="lay-note pencil-fill" stroke="none">{jointLabel}</text>
            </g>
          ) : (
            <g key={`j${i}`}>
              <line x1={c.x} y1={y0 - 10} x2={c.x} y2={y0 + d + 10} strokeWidth="1.2" strokeDasharray="6 5" className="pencil-stroke" />
              <text x={c.x + 7} y={y0 + 16} className="lay-note pencil-fill" stroke="none">{jointLabel}</text>
            </g>
          ),
        )}
        {/* Overall dimensions */}
        <line x1={x0} y1={y0 + d + 24} x2={x0 + w} y2={y0 + d + 24} strokeWidth="0.9" markerStart="url(#lay-tick)" markerEnd="url(#lay-tick)" />
        <text x={x0 + w / 2} y={y0 + d + 40} textAnchor="middle" className="lay-note" fill="currentColor" stroke="none">{W} mm</text>
        <line x1={x0 - 24} y1={y0} x2={x0 - 24} y2={y0 + d} strokeWidth="0.9" markerStart="url(#lay-tick)" markerEnd="url(#lay-tick)" />
        <text x={x0 - 30} y={y0 + d / 2} textAnchor="middle" className="lay-note" fill="currentColor" stroke="none" transform={`rotate(-90 ${x0 - 30} ${y0 + d / 2})`}>{D} mm</text>
      </g>
    </svg>
  )
}
