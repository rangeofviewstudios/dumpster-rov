import { useEffect, useRef } from 'react'
import { playSend } from '../lib/sendFlight'
import { Glint, DumpsterMark } from './Mark'

interface FlightStageProps {
  /** Text shown in the blue bubble. */
  label: string
  /** 'thread' hovers above the composer; 'demo' is a self-contained stage (onboarding). */
  variant: 'thread' | 'demo'
  /** CSS lengths measured from the host: where the bubble starts and where the mark sits. */
  bubbleBottom?: number
  markBottom?: number
  onLanded?: () => void
  onDone: () => void
}

/** The signature send, as markup. Plays once on mount; the host unmounts it in onDone. */
export function FlightStage({ label, variant, bubbleBottom = 0, markBottom = 0, onLanded, onDone }: FlightStageProps) {
  const bubble = useRef<HTMLParagraphElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const glint = useRef<HTMLSpanElement>(null)
  const lid = useRef<SVGGElement>(null)
  const landed = useRef(onLanded)
  const done = useRef(onDone)
  landed.current = onLanded
  done.current = onDone

  useEffect(() => {
    if (!bubble.current || !mark.current || !glint.current || !lid.current) return
    const handle = playSend(
      { bubble: bubble.current, mark: mark.current, lid: lid.current, glint: glint.current },
      {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        persistentMark: variant === 'demo',
        onLanded: () => landed.current?.(),
      },
    )
    let cancelled = false
    handle.finished.then(() => { if (!cancelled) done.current() })
    return () => {
      cancelled = true
      handle.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- plays once per mount
  }, [])

  const style = variant === 'thread' ? { ['--bubble-bottom' as string]: `${bubbleBottom}px`, ['--mark-bottom' as string]: `${markBottom}px` } : undefined
  return (
    <div className={`flight flight--${variant}`} style={style} aria-hidden="true">
      {variant === 'thread' && <div className="flight__backdrop" />}
      <div className="flight__box">
        <div className="flight__mark" ref={mark}><DumpsterMark size={96} strokeWidth={1.4} lidRef={lid} /></div>
        <span className="flight__glint" ref={glint}><Glint size={26} /></span>
      </div>
      <p className="flight__bubble" ref={bubble}>{label}</p>
    </div>
  )
}
