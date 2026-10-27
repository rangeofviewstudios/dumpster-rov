import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { itemFromText } from '../lib/compose'
import { getPile } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import { Icon } from './Icon'
import { brandUrl } from './Mascot'

const PAGE_URL = 'https://www.youtube.com/watch?v=Xq9pL'
const PAGE_TITLE = 'The 10-minute pasta that changed my weeknights'
const OTHER_TARGETS = [
  { label: 'Messages', icon: 'dump', tint: 'var(--mint)' },
  { label: 'Mail', icon: 'bell', tint: 'var(--sky)' },
  { label: 'Notes', icon: 'ideas', tint: 'var(--butter)' },
]

type Stage = 'sheet' | 'compose'

function SafariPage() {
  return (
    <div className="safari" aria-hidden="true">
      <div className="safari__bar t-meta"><Icon name="places" size={14} />youtube.com</div>
      <div className="safari__video"><span className="thumb__play"><Icon name="play" size={26} /></span></div>
      <p className="safari__title">{PAGE_TITLE}</p>
      <p className="t-meta">412K views · 3 days ago</p>
      <div className="safari__lines"><i /><i /><i style={{ width: '60%' }} /></div>
    </div>
  )
}

export function ShareSim({ onDone }: { onDone: () => void }) {
  const { shareOpen, setShareOpen, showToast } = useUi()
  const { addItem } = useStore()
  const [stage, setStage] = useState<Stage>('sheet')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (shareOpen) {
      setStage('sheet')
      setNote('')
    }
  }, [shareOpen])

  function toss() {
    const item = itemFromText(PAGE_URL)
    addItem({ ...item, title: PAGE_TITLE, text: note.trim() ? `${note.trim()} ${PAGE_URL}` : PAGE_URL })
    setShareOpen(false)
    onDone()
    showToast(`Tossed in ${getPile(item.pile).name}.`)
  }

  return (
    <AnimatePresence>
      {shareOpen && (
        <motion.div className="share-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} role="dialog" aria-modal="true" aria-label="Share sheet demo">
          <SafariPage />
          <div className="sheet-scrim" onClick={() => setShareOpen(false)} />
          <motion.div
            className="share-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 520, damping: 38 }}
          >
            {stage === 'sheet' ? (
              <>
                <div className="share-sheet__preview">
                  <span className="nb-icon-tile pile-watch" style={{ ['--size' as string]: '44px' }}><Icon name="play" /></span>
                  <div>
                    <p className="share-sheet__title">{PAGE_TITLE}</p>
                    <p className="t-meta">youtube.com</p>
                  </div>
                  <button type="button" className="nb-btn nb-btn--cream nb-btn--sq" aria-label="Close share sheet" onClick={() => setShareOpen(false)}><Icon name="close" /></button>
                </div>
                <ul className="share-targets">
                  <li>
                    <button type="button" className="share-target share-target--us" onClick={() => setStage('compose')}>
                      <img src={brandUrl('logo-icon.svg')} width={56} height={56} alt="" />
                      <span>Dumpster</span>
                    </button>
                  </li>
                  {OTHER_TARGETS.map((target) => (
                    <li key={target.label}>
                      <button type="button" className="share-target" onClick={() => showToast(`${target.label} is not part of this demo.`)}>
                        <span className="nb-icon-tile" style={{ ['--size' as string]: '56px', ['--tile' as string]: target.tint }}><Icon name={target.icon} /></span>
                        <span>{target.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <ul className="share-actions">
                  <li><button type="button" onClick={() => showToast('Copied.')}>Copy<Icon name="copy" size={20} /></button></li>
                  <li><button type="button" onClick={() => showToast('Added to Reading List. Not Dumpster, but fine.')}>Add to Reading List<Icon name="reads" size={20} /></button></li>
                </ul>
              </>
            ) : (
              <div className="share-compose">
                <div className="share-compose__head">
                  <img src={brandUrl('logo-icon.svg')} width={40} height={40} alt="" />
                  <h2 className="t-h3">Dump it</h2>
                  <button type="button" className="nb-btn nb-btn--cream nb-btn--sq" aria-label="Cancel" onClick={() => setShareOpen(false)}><Icon name="close" /></button>
                </div>
                <div className="nb-card share-compose__card">
                  <p className="share-sheet__title">{PAGE_TITLE}</p>
                  <p className="t-meta">youtube.com</p>
                </div>
                <label className="t-meta" htmlFor="share-note">Add a note (optional)</label>
                <input id="share-note" className="share-compose__input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="for the weekend…" />
                <button type="button" className="nb-btn share-compose__go" onClick={toss}>Toss it</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
