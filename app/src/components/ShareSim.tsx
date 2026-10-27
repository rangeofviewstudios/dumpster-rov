import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { itemFromText } from '../lib/compose'
import { getPile } from '../lib/piles'
import { useStore } from '../lib/store'
import { useUi } from '../lib/ui'
import { Icon } from './Icon'
import { DumpsterMark } from './Mark'

const PAGE_URL = 'https://www.youtube.com/watch?v=Xq9pL'
const PAGE_TITLE = 'The 10-minute pasta that changed my weeknights'
const OTHER_TARGETS = [
  { label: 'Messages', icon: 'share' },
  { label: 'Mail', icon: 'bell' },
  { label: 'Notes', icon: 'ideas' },
]
const SHEET_EASE = [0.2, 0.8, 0.2, 1] as const

type Stage = 'sheet' | 'compose'

function SafariPage() {
  return (
    <div className="safari" aria-hidden="true">
      <div className="safari__bar meta"><Icon name="places" size={14} />youtube.com</div>
      <div className="safari__video"><span className="safari__play"><Icon name="play" size={20} /></span></div>
      <p className="safari__title">{PAGE_TITLE}</p>
      <p className="meta">412K views · 3 days ago</p>
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

  function file() {
    const item = itemFromText(PAGE_URL)
    addItem({ ...item, title: PAGE_TITLE, text: note.trim() ? `${note.trim()} ${PAGE_URL}` : PAGE_URL })
    setShareOpen(false)
    onDone()
    showToast(`Filed to ${getPile(item.pile).name}.`)
  }

  return (
    <AnimatePresence>
      {shareOpen && (
        <motion.div className="share-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} role="dialog" aria-modal="true" aria-label="Share sheet demo">
          <SafariPage />
          <div className="sheet-scrim" onClick={() => setShareOpen(false)} />
          <motion.div
            className="share-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: SHEET_EASE }}
          >
            {stage === 'sheet' ? (
              <>
                <div className="share-sheet__preview">
                  <span className="share-sheet__thumb"><Icon name="play" size={18} /></span>
                  <div>
                    <p className="share-sheet__title">{PAGE_TITLE}</p>
                    <p className="meta">youtube.com</p>
                  </div>
                  <button type="button" className="btn btn--icon" aria-label="Close share sheet" onClick={() => setShareOpen(false)}><Icon name="close" /></button>
                </div>
                <ul className="share-targets">
                  <li>
                    <button type="button" className="share-target share-target--us" onClick={() => setStage('compose')}>
                      <span className="share-target__tile"><DumpsterMark size={30} /></span>
                      <span>Dumpster</span>
                    </button>
                  </li>
                  {OTHER_TARGETS.map((target) => (
                    <li key={target.label}>
                      <button type="button" className="share-target" onClick={() => showToast(`${target.label} is not part of this demo.`)}>
                        <span className="share-target__tile"><Icon name={target.icon} size={26} /></span>
                        <span>{target.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <ul className="share-actions">
                  <li><button type="button" onClick={() => showToast('Copied.')}>Copy<Icon name="copy" size={20} /></button></li>
                  <li><button type="button" onClick={() => showToast('Added to Reading List.')}>Add to Reading List<Icon name="reads" size={20} /></button></li>
                </ul>
              </>
            ) : (
              <div className="share-compose">
                <div className="share-compose__head">
                  <span className="share-target__tile share-target__tile--sm"><DumpsterMark size={22} /></span>
                  <h2 className="label">Dump it</h2>
                  <button type="button" className="btn btn--icon" aria-label="Cancel" onClick={() => setShareOpen(false)}><Icon name="close" /></button>
                </div>
                <div className="share-compose__card">
                  <p className="share-sheet__title">{PAGE_TITLE}</p>
                  <p className="meta">youtube.com</p>
                </div>
                <label className="label" htmlFor="share-note">Add a note (optional)</label>
                <input id="share-note" className="share-compose__input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="for the weekend…" />
                <button type="button" className="btn share-compose__go" onClick={file}>Dump it</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
