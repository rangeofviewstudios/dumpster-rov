import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useState } from 'react'
import { FlightStage } from './FlightStage'
import { Icon } from './Icon'
import { DumpsterMark } from './Mark'

interface Slide {
  title: string
  body: string
  art: 'mark' | 'send' | 'share'
}

const SLIDES: Slide[] = [
  { title: 'Dump it. Find it.', body: 'Text yourself, but it remembers.', art: 'mark' },
  { title: 'You dump. It files.', body: 'Links, addresses, photos, half-thoughts. Each lands in a pile. No folders to make.', art: 'send' },
  { title: 'Share from anywhere.', body: 'Hit share in any app, pick Dumpster. Then dig it back up in plain words.', art: 'share' },
]

const SWIPE_THRESHOLD = 60
const LOOP_PAUSE_MS = 1100
const SAMPLES: Array<[string, string]> = [
  ['mom: 48 Willow Creek Dr, Apt 3B', 'Places'],
  ['youtube.com/watch?v=pasta-water', 'Watch later'],
  ['buy AA batteries', 'To-dos'],
  ['idea: a podcast about receipts', 'Ideas'],
]

/** Screen 2: the signature send, on loop. */
function SendLoop() {
  const [round, setRound] = useState(0)
  const [filed, setFiled] = useState(false)
  const [text, pile] = SAMPLES[round % SAMPLES.length]

  function next() {
    window.setTimeout(() => {
      setFiled(false)
      setRound((current) => current + 1)
    }, LOOP_PAUSE_MS)
  }

  return (
    <div className="ob-send" aria-hidden="true">
      <FlightStage key={round} variant="demo" label={text} onLanded={() => setFiled(true)} onDone={next} />
      <p className="ob-send__filed label" data-on={filed}>Filed <i>→ {pile}</i></p>
    </div>
  )
}

function ShareArt() {
  const targets = ['Messages', 'Mail', 'Dumpster']
  return (
    <div className="ob-share" aria-hidden="true">
      {targets.map((label) => (
        <span key={label} className="ob-share__target" data-us={label === 'Dumpster'}>
          <span className="ob-share__tile">
            {label === 'Dumpster' ? <DumpsterMark size={32} /> : <Icon name={label === 'Mail' ? 'bell' : 'share'} size={26} />}
          </span>
          <span className="label">{label}</span>
        </span>
      ))}
    </div>
  )
}

function Art({ kind }: { kind: Slide['art'] }) {
  if (kind === 'send') return <SendLoop />
  if (kind === 'share') return <ShareArt />
  return <DumpsterMark size={156} strokeWidth={1.1} className="ob-mark" />
}

export function Onboarding({ initialStep = 0, onFinish }: { initialStep?: number; onFinish: () => void }) {
  const [step, setStep] = useState(initialStep)
  const [direction, setDirection] = useState(1)
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  function go(next: number) {
    if (next < 0) return
    if (next >= SLIDES.length) return onFinish()
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  function onDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) go(step + 1)
    else if (info.offset.x > SWIPE_THRESHOLD) go(step - 1)
  }

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label="Welcome to Dumpster">
      <div className="onboarding__top">
        <span className="meta">0{step + 1} / 0{SLIDES.length}</span>
        <button type="button" className="onboarding__skip label" onClick={onFinish}>Skip</button>
      </div>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          className="onboarding__slide"
          custom={direction}
          initial={{ x: direction * 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={onDragEnd}
        >
          <div className="onboarding__stage"><Art kind={slide.art} /></div>
          <h1 className="onboarding__title">{slide.title}</h1>
          <p className="onboarding__body">{slide.body}</p>
        </motion.div>
      </AnimatePresence>
      <div className="onboarding__foot">
        <div className="dots-nav" role="group" aria-label="Steps">
          {SLIDES.map((_, index) => (
            <button key={index} type="button" className="dots-nav__dot" data-on={index === step} aria-label={`Go to step ${index + 1}`} aria-current={index === step} onClick={() => go(index)} />
          ))}
        </div>
        <button type="button" className="btn onboarding__next" onClick={() => go(step + 1)}>
          {isLast ? 'Start dumping' : 'Next'}
        </button>
      </div>
    </div>
  )
}
