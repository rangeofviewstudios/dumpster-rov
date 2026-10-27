import type { Ref } from 'react'

/**
 * The Dumpster mark: a fine-line dumpster with a hinged lid.
 * Geometry is ported from brand/assets/mark-animated.svg (lid slab, open body, ribs, two wheels).
 * Marks under 16px use the brand's mark-small.svg body (fewer details, heavier stroke).
 */
const MARK_VIEWBOX = '0 0 64 64'
const SMALL_MARK_MAX_PX = 15
const LID = { x: 5.5, y: 11, width: 53, height: 6, rx: 1.8 }
const BODY_DETAILED = ['M9.5 17V45.5H51L54.5 17Z', 'M9.5 26H53.3', 'M15 45.5v2M45 45.5v2']
const BODY_SMALL = ['M9.5 17V45.5H51L54.5 17Z']
const RIBS = { x: 16, y: 32, width: 22, height: 5, rx: 1.4 }
const WHEELS_DETAILED: Array<[number, number, number]> = [[15, 50, 2.6], [45, 50, 2.6]]
const WHEELS_SMALL: Array<[number, number, number]> = [[15, 49.6, 2.4], [45, 49.6, 2.4]]

/** Where, in 0-1 of the mark's box, a dropped message should disappear (just above the lid line). */
export const MARK_MOUTH = { x: 0.5, y: 0.2 }

interface MarkProps {
  size?: number
  /** Stroke width in viewBox units (64). Smaller marks want heavier strokes: 1.3 at 150px, 4.4 at 20px. */
  strokeWidth?: number
  /** Resting lid angle in degrees (negative = open). */
  lidAngle?: number
  lidRef?: Ref<SVGGElement>
  svgRef?: Ref<SVGSVGElement>
  className?: string
}

export function DumpsterMark({ size = 24, strokeWidth, lidAngle = 0, lidRef, svgRef, className }: MarkProps) {
  const small = size <= SMALL_MARK_MAX_PX
  const weight = strokeWidth ?? (small ? 4 : Math.min(3.2, Math.max(1.4, 70 / size)))
  const wheels = small ? WHEELS_SMALL : WHEELS_DETAILED
  return (
    <svg
      ref={svgRef}
      className={className}
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <g ref={lidRef} className="mark-lid" style={{ transform: `rotate(${lidAngle}deg)` }}>
        <rect {...LID} />
      </g>
      {(small ? BODY_SMALL : BODY_DETAILED).map((d) => <path key={d} d={d} />)}
      {!small && <rect {...RIBS} />}
      {wheels.map(([cx, cy, r]) => <circle key={cx} cx={cx} cy={cy} r={r} />)}
    </svg>
  )
}

/** Four-point glint. */
export function Glint({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M24 2C25 15 29 19 46 24C29 29 25 33 24 46C23 33 19 29 2 24C19 19 23 15 24 2Z" />
    </svg>
  )
}

export function Wordmark({ size = 14 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      <DumpsterMark size={Math.round(size * 1.6)} />
      Dumpster
    </span>
  )
}
