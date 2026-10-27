import { MARK_MOUTH } from '../components/Mark'

/** The elements the send flight animates. All are owned by the calling component. */
export interface FlightTargets {
  bubble: HTMLElement
  mark: HTMLElement
  lid: SVGGElement
  glint: HTMLElement
}

export interface FlightHandle {
  /** Resolves when the whole flight (including the mark fading away) is over, or it was cancelled. */
  finished: Promise<void>
  cancel: () => void
}

interface FlightOptions {
  reducedMotion: boolean
  /** Keep the mark on screen before and after (the onboarding loop) instead of revealing and fading it. */
  persistentMark?: boolean
  /** Fires the moment the lid shuts on the message: the caller adds the item to the thread. */
  onLanded: () => void
}

const LID_OPEN_DEG = -44
const T = { lidOpen: 120, fly: 180, flyMs: 500, lidShut: 680, glint: 840 }

/** Animates one element and resolves when it ends. Cancelled animations resolve too. */
function run(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions, live: Animation[]): Promise<void> {
  const animation = el.animate(keyframes, { fill: 'forwards', ...options })
  live.push(animation)
  return animation.finished.then(() => undefined, () => undefined)
}

function distanceToMouth(bubble: HTMLElement, mark: HTMLElement): { dx: number; dy: number } {
  const b = bubble.getBoundingClientRect()
  const m = mark.getBoundingClientRect()
  return {
    dx: m.left + m.width * MARK_MOUTH.x - (b.left + b.width / 2),
    dy: m.top + m.height * MARK_MOUTH.y - (b.top + b.height / 2),
  }
}

/**
 * The signature send: the blue bubble flies into the dumpster, the lid hinges open,
 * the message shrinks and drops in, the lid shuts, a four-point glint flashes. About 1.2s.
 * Reduced motion collapses it to a single fade.
 */
export function playSend(targets: FlightTargets, options: FlightOptions): FlightHandle {
  const live: Animation[] = []
  let cancelled = false
  const { bubble, mark, lid, glint } = targets

  const sequence = async () => {
    if (options.reducedMotion) {
      if (!options.persistentMark) mark.style.opacity = '0'
      await run(bubble, [{ opacity: 0 }, { opacity: 1 }], { duration: 160 }, live)
      if (cancelled) return
      options.onLanded()
      await run(bubble, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, delay: 120 }, live)
      return
    }
    const { dx, dy } = distanceToMouth(bubble, mark)
    const timers: Array<Promise<void>> = []

    if (!options.persistentMark) timers.push(run(mark, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.8,.2,1)' }, live))
    await run(bubble, [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 120 }, live)
    if (cancelled) return

    timers.push(run(lid, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${LID_OPEN_DEG}deg)` }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' }, live))
    await sleep(T.fly - T.lidOpen)
    if (cancelled) return

    timers.push(run(bubble, [
      { opacity: 1, transform: 'translate(0,0) scale(1)' },
      { opacity: 1, transform: `translate(${dx * 0.78}px, ${dy * 0.5}px) scale(.62)`, offset: 0.6 },
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.08)` },
    ], { duration: T.flyMs, easing: 'cubic-bezier(.55,0,.8,.3)' }, live))

    await sleep(T.lidShut - T.fly)
    if (cancelled) return
    timers.push(run(lid, [
      { transform: `rotate(${LID_OPEN_DEG}deg)` },
      { transform: 'rotate(3deg)', offset: 0.7 },
      { transform: 'rotate(0deg)' },
    ], { duration: 240, easing: 'ease-in' }, live))
    timers.push(run(mark, [{ transform: 'none' }, { transform: 'translateY(2px)' }, { transform: 'none' }], { duration: 220, delay: 120 }, live))

    await sleep(T.glint - T.lidShut)
    if (cancelled) return
    options.onLanded()
    timers.push(run(glint, [
      { opacity: 0, transform: 'scale(.3) rotate(0deg)' },
      { opacity: 1, transform: 'scale(1) rotate(45deg)', offset: 0.4 },
      { opacity: 0, transform: 'scale(.6) rotate(90deg)' },
    ], { duration: 460, easing: 'ease-out' }, live))
    if (!options.persistentMark) timers.push(run(mark, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: 140, easing: 'ease-out' }, live))
    await Promise.all(timers)
  }

  const finished = sequence().catch(() => undefined)
  return {
    finished,
    cancel: () => {
      cancelled = true
      live.forEach((animation) => animation.cancel())
    },
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
