import { useEffect, useState } from 'react'
import { formatDuration } from '../../lib/format'
import type { Item } from '../../lib/types'
import { Icon } from '../Icon'
import { SampleImage } from './SampleImage'

export function NoteBubble({ item }: { item: Item }) {
  return <p className="note-bubble">{item.text}</p>
}

export function ImageCard({ item }: { item: Item }) {
  return (
    <div className="image-card">
      <SampleImage variant={item.imageVariant ?? 'wifi'} />
      <div className="extract">
        <span className="extract__label label">Text found</span>
        <span className="extract__text">{item.extracted}</span>
      </div>
    </div>
  )
}

const WAVE_HEIGHTS = [8, 14, 22, 12, 28, 18, 10, 24, 30, 16, 9, 20, 26, 12, 18, 30, 14, 8, 22, 16, 10, 24, 12, 18]

export function VoiceCard({ item }: { item: Item }) {
  const total = item.durationSec ?? 10
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= total) {
          setPlaying(false)
          return 0
        }
        return current + 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [playing, total])

  const progress = playing ? Math.round((elapsed / total) * WAVE_HEIGHTS.length) : 0
  return (
    <div className="voice-card">
      <div className="voice-card__row">
        <button
          type="button"
          className="btn btn--send voice-card__play"
          aria-label={playing ? 'Pause voice note' : 'Play voice note'}
          onClick={() => setPlaying((current) => !current)}
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} />
        </button>
        <div className="wave" aria-hidden="true">
          {WAVE_HEIGHTS.map((height, index) => (
            <span key={index} className="wave__bar" data-on={index < progress} style={{ height }} />
          ))}
        </div>
        <span className="meta">{formatDuration(playing ? elapsed : total)}</span>
      </div>
      <p className="voice-card__transcript small">
        <span className="label">Transcript</span>
        {item.transcript}
      </p>
    </div>
  )
}

export function FileCard({ item }: { item: Item }) {
  return (
    <div className="file-card">
      <span className="file-card__icon"><Icon name="file" size={22} /></span>
      <div>
        <p className="file-card__name">{item.fileName}</p>
        <p className="meta">PDF · 184 KB</p>
      </div>
    </div>
  )
}
