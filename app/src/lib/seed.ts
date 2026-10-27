import { classifyText } from './classifier'
import type { ImageVariant, Item } from './types'

const HOUR = 3_600_000

interface SeedEntry {
  id: string
  /** [days ago, extra hours ago] relative to "now" so the demo always feels current. */
  ago: [number, number]
  text: string
  title?: string
  watched?: boolean
  done?: boolean
  image?: { variant: ImageVariant; extracted: string }
  voice?: { transcript: string; durationSec: number }
}

const ENTRIES: SeedEntry[] = [
  { id: 'yt-cast-iron', ago: [20, 4], text: 'https://www.youtube.com/watch?v=Ck83a', title: 'How to season a cast iron pan (the right way)' },
  { id: 'mom-cacio', ago: [19, 6], text: 'mom: https://www.nytimes.com/2026/09/30/dining/cacio-e-pepe-recipe.html' },
  { id: 'todo-dentist', ago: [18, 3], text: 'call dentist', done: true },
  { id: 'mom-addr', ago: [17, 0], text: 'mom: 48 Willow Creek Dr, Apt 3B, Brooklyn NY 11215' },
  { id: 'tt-noodles', ago: [16, 8], text: 'https://www.tiktok.com/@chefmilo/video/7283', title: '30-second garlic noodles' },
  { id: 'idea-candle', ago: [16, 2], text: 'idea: a candle that smells like a new notebook' },
  { id: 'ikea-kallax', ago: [15, 7], text: 'https://www.ikea.com/us/en/p/kallax-shelf-unit-white-80275887/', title: 'Kallax shelf unit, white' },
  { id: 'jay-ramen', ago: [14, 5], text: 'Jay: Menya Ramen - 41 E 9th St. Get the spicy miso, trust me' },
  { id: 'todo-card', ago: [14, 1], text: 'buy a birthday card for dad', done: true },
  { id: 'verge-sonos', ago: [13, 6], text: 'https://www.theverge.com/2026/10/6/24203111/sonos-new-speaker-review' },
  { id: 'yt-bakery', ago: [13, 2], text: 'https://www.youtube.com/watch?v=9bZkp', title: 'Why every bakery smells the same', watched: true },
  {
    id: 'voice-trip', ago: [12, 9], text: 'Voice note',
    voice: { transcript: 'Okay, so for the trip we need to book the Airbnb before the 15th and ask Jay about the car.', durationSec: 23 },
  },
  { id: 'amz-anker', ago: [11, 4], text: 'https://www.amazon.com/dp/B0C3Z', title: 'Anker 10,000mAh power bank, slim' },
  { id: 'mom-dish', ago: [11, 1], text: 'mom: she wants the blue casserole dish back, no rush' },
  {
    id: 'img-wifi', ago: [10, 6], text: 'Screenshot',
    image: { variant: 'wifi', extracted: 'Network: Moonbeam_5G / Password: pancake-tuesday-42' },
  },
  { id: 'ig-apartment', ago: [9, 3], text: 'https://www.instagram.com/reel/Cx92k/', title: 'Tiny apartment tour: 280 sq ft' },
  { id: 'todo-passport', ago: [9, 0], text: 'remember to renew passport' },
  { id: 'nyt-sleep', ago: [8, 5], text: 'https://www.nytimes.com/2026/10/12/well/live/sleep-after-40.html' },
  { id: 'jay-gym', ago: [8, 2], text: 'Jay: 2214 Mission St - the climbing gym, day pass is $24' },
  { id: 'idea-panic', ago: [7, 7], text: "what if the app had a 'panic' button that sorts everything before my meeting" },
  { id: 'yt-sourdough', ago: [7, 1], text: 'https://www.youtube.com/watch?v=Zi_XL', title: 'Beginner sourdough, no scale needed' },
  { id: 'amz-mat', ago: [6, 6], text: 'https://www.amazon.com/dp/B09DK', title: 'Anti-fatigue standing desk mat' },
  { id: 'todo-batteries', ago: [6, 3], text: 'buy AA batteries' },
  { id: 'tt-pothos', ago: [5, 5], text: 'https://www.tiktok.com/@plantsbyleo/video/7301', title: "You've been watering your pothos wrong" },
  { id: 'mom-soup', ago: [5, 2], text: "Mom: grandma's soup recipe - 2 carrots, celery, lots of dill, simmer 90 min" },
  { id: 'se-potatoes', ago: [4, 8], text: 'https://www.seriouseats.com/crispy-smashed-potatoes-recipe' },
  {
    id: 'img-flyer', ago: [4, 4], text: 'Photo',
    image: { variant: 'flyer', extracted: 'OPEN MIC NIGHT / FRI 8PM / THE RUSTY SPOON / NO COVER' },
  },
  { id: 'todo-landlord', ago: [3, 6], text: 'email landlord about the heater' },
  { id: 'verge-keyboards', ago: [3, 1], text: 'https://www.theverge.com/2026/10/15/24204/best-budget-mechanical-keyboards' },
  { id: 'ikea-hemnes', ago: [2, 7], text: 'https://www.ikea.com/us/en/p/hemnes-bedside-table/', title: 'Hemnes bedside table, black-brown' },
  { id: 'jay-bday', ago: [9, 6], text: "Jay's birthday is Nov 12. He likes 70s synth records" },
  { id: 'mom-phone', ago: [12, 2], text: 'mom: new number is 917-555-0142' },
  { id: 'dr-patel', ago: [15, 3], text: "Dr. Patel's office: 212-555-0188" },
  { id: 'jay-lupa', ago: [0, 9], text: 'Jay: birthday dinner at Lupa, Sat 7:30. 95 Thompson Street' },
  { id: 'yt-desks', ago: [1, 9], text: 'https://www.youtube.com/watch?v=Lk2pq', title: 'I tried every standing desk so you do not have to' },
  { id: 'todo-drycleaning', ago: [1, 5], text: 'pick up dry cleaning' },
  {
    id: 'voice-idea', ago: [1, 2], text: 'Voice note',
    voice: { transcript: 'Idea for the website. What if the hero has the logo falling into a bin.', durationSec: 9 },
  },
  { id: 'todo-callmom', ago: [0, 3], text: 'call mom about Sunday' },
  { id: 'yt-pasta', ago: [0, 5], text: 'https://www.youtube.com/watch?v=Qp4rt', title: 'Pasta water is a sauce ingredient' },
  { id: 'mom-parking', ago: [0, 1], text: 'Mom: parking behind the building, code 4471' },
]

function buildItem(entry: SeedEntry, now: number): Item {
  const [days, hours] = entry.ago
  const classified = classifyText(entry.text)
  const item: Item = {
    ...classified,
    id: entry.id,
    createdAt: now - days * 24 * HOUR - hours * HOUR,
    title: entry.title ?? classified.title,
    done: entry.done ?? classified.done,
    watched: entry.watched,
  }
  if (entry.image) {
    return { ...item, kind: 'image', pile: 'unsorted', imageVariant: entry.image.variant, extracted: entry.image.extracted }
  }
  if (entry.voice) {
    const voiceClass = classifyText(entry.voice.transcript)
    return { ...item, kind: 'voice', pile: voiceClass.pile, transcript: entry.voice.transcript, durationSec: entry.voice.durationSec }
  }
  return item
}

export function createSeed(now: number = Date.now()): Item[] {
  return ENTRIES.map((entry) => buildItem(entry, now))
}
