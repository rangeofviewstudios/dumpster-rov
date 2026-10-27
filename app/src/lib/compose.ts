import { classifyText } from './classifier'
import type { ImageVariant, Item } from './types'

let sampleCursor = 0

function nextId(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/** Turns typed or shared text into a fully classified item. */
export function itemFromText(text: string): Item {
  return { ...classifyText(text), id: nextId(), createdAt: Date.now() }
}

const SAMPLE_IMAGES: Array<{ variant: ImageVariant; extracted: string; text: string }> = [
  { variant: 'receipt', text: 'Photo', extracted: 'BLUE DOOR CAFE / 2 x OAT LATTE 9.50 / TOTAL 10.31' },
  { variant: 'flyer', text: 'Photo', extracted: 'OPEN MIC NIGHT / FRI 8PM / THE RUSTY SPOON / NO COVER' },
  { variant: 'wifi', text: 'Screenshot', extracted: 'Network: Moonbeam_5G / Password: pancake-tuesday-42' },
]

const SAMPLE_VOICE_NOTES = [
  { transcript: 'Remind me to ask Jay about the ladder before the weekend.', durationSec: 7 },
  { transcript: 'Idea: a rainy day playlist that only plays songs under three minutes.', durationSec: 11 },
]

export function sampleImageItem(): Item {
  const sample = SAMPLE_IMAGES[sampleCursor++ % SAMPLE_IMAGES.length]
  return {
    id: nextId(), createdAt: Date.now(), from: 'Me', kind: 'image', pile: 'unsorted',
    text: sample.text, imageVariant: sample.variant, extracted: sample.extracted,
  }
}

export function sampleVoiceItem(): Item {
  const sample = SAMPLE_VOICE_NOTES[sampleCursor++ % SAMPLE_VOICE_NOTES.length]
  return {
    id: nextId(), createdAt: Date.now(), from: 'Me', kind: 'voice', pile: classifyText(sample.transcript).pile,
    text: 'Voice note', transcript: sample.transcript, durationSec: sample.durationSec,
  }
}

export function sampleFileItem(): Item {
  return {
    id: nextId(), createdAt: Date.now(), from: 'Me', kind: 'file', pile: 'unsorted',
    text: 'File', fileName: 'lease-renewal-2027.pdf',
  }
}

