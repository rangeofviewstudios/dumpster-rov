import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useState } from 'react'
import { Icon } from './Icon'
import { Mascot, type MascotPose } from './Mascot'

interface Slide {
  pose: MascotPose
  bg: string
  title: string
  body: string
  art: 'none' | 'sort' | 'share'
}

const SLIDES: Slide[] = [
  { pose: 'wave', bg: 'var(--yellow)', title: 'Text yourself, but it remembers.', body: 'Meet Scraps. Dump links, addresses, photos and half-thoughts into one thread.', art: 'none' },
  { pose: 'dig', bg: 'var(--butter)', title: 'You dump. Scraps sorts.', body: 'Everything lands in a Pile. Places, Watch Later, To-dos. No folders to make.', art: 'sort' },
  { pose: 'hold', bg: 'var(--sky)', title: 'Share from anywhere.', body: 'Hit share in any app, pick Dumpster, and it is Tossed. Then Dig it back up in plain words.', art: 'share' },
]

const SWIPE_THRESHOLD = 60

function SortArt() {
  return (
    <div className="ob-art ob-art--sort" aria-hidden="true">
      <span className="nb-chip nb-chip--shadow">47 Maple St</span>
      <span className="nb-chip nb-chip--shadow">youtu.be/…</span>
      <span className="nb-chip nb-chip--shadow">buy batteries</span>
      <div className="ob-art__piles">
        {(['pile-places', 'pile-watch', 'pile-todos'] as const).map((cls) => (
          <span key={cls} className={`nb-folder ${cls}`}><span className="nb-folder__body" /></span>
        ))}
      </div>
    </div>
  )
}

function ShareArt() {
  return (
    <div className="ob-art ob-art--share" aria-hidden="true">
      {['Messages', 'Mail', 'Dumpster'].map((label) => (
        <span key={label} className="ob-art__target" data-us={label === 'Dumpster'}>
          <span className="nb-icon-tile" style={label === 'Dumpster' ? undefined : { ['--tile' as string]: 'var(--cream)' }}><Icon name={label === 'Dumpster' ? 'dump' : 'share'} /></span>
          <span className="t-meta">{label}</span>
        </span>
      ))}
    </div>
  )
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
    <div className="onboarding" style={{ background: slide.bg }} role="dialog" aria-modal="true" aria-label="Welcome to Dumpster">
      <div className="onboarding__top">
        <span className="t-meta">{step + 1} / {SLIDES.length}</span>
        <button type="button" className="nb-btn nb-btn--cream nb-btn--sm" onClick={onFinish}>Skip</button>
      </div>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          className="onboarding__slide"
          custom={direction}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.16 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={onDragEnd}
        >
          <div className="onboarding__stage">
            <Mascot pose={slide.pose} size={slide.art === 'none' ? 220 : 150} />
            {slide.art === 'sort' && <SortArt />}
            {slide.art === 'share' && <ShareArt />}
          </div>
          <h1 className="t-h1 onboarding__title">{slide.title}</h1>
          <p className="t-body onboarding__body">{slide.body}</p>
        </motion.div>
      </AnimatePresence>
      <div className="onboarding__foot">
        <div className="dots-nav" role="group" aria-label="Steps">
          {SLIDES.map((_, index) => (
            <button key={index} type="button" className="dots-nav__dot" data-on={index === step} aria-label={`Go to step ${index + 1}`} aria-current={index === step} onClick={() => go(index)} />
          ))}
        </div>
        <button type="button" className="nb-btn nb-btn--ink onboarding__next" onClick={() => go(step + 1)}>
          {isLast ? 'Start dumping' : 'Next'}
        </button>
      </div>
    </div>
  )
}
