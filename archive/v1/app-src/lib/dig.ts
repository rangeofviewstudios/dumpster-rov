import { formatShortDate, startOfDay } from './format'
import { getPile } from './piles'
import type { Item, Sender } from './types'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'that', 'this', 'those', 'these', 'was', 'were', 'is', 'are', 'of', 'to', 'for', 'from',
  'me', 'my', 'i', 'it', 'sent', 'send', 'what', 'which', 'where', 'who', 'when', 'have', 'has', 'had',
  'about', 'find', 'show', 'get', 'stuff', 'things', 'thing', 'any', 'anything', 'some', 'one', 'weekend',
  'and', 'in', 'on', 'with', 'saved', 'dumped', 'last', 'week',
])

const SYNONYMS: Record<string, string[]> = {
  address: ['street', 'location', 'places', 'directions'],
  place: ['places', 'address', 'restaurant', 'cafe', 'location'],
  video: ['youtube', 'tiktok', 'instagram', 'watch', 'reel'],
  watch: ['video', 'youtube', 'tiktok', 'instagram'],
  buy: ['shopping', 'amazon', 'ikea', 'order', 'purchase'],
  shop: ['shopping', 'amazon', 'ikea'],
  read: ['reads', 'article', 'nytimes', 'theverge'],
  article: ['reads', 'nytimes', 'theverge'],
  recipe: ['cook', 'dinner', 'soup', 'pasta', 'noodles'],
  todo: ['todos', 'call', 'email', 'remember'],
  task: ['todos', 'call', 'email', 'remember'],
  idea: ['ideas', 'what', 'maybe'],
  password: ['wifi', 'network', 'screenshot'],
  wifi: ['password', 'network'],
  photo: ['image', 'screenshot'],
  picture: ['image', 'screenshot'],
  voice: ['transcript', 'memo'],
  food: ['ramen', 'recipe', 'soup', 'pasta', 'dinner', 'restaurant'],
}

const SENDER_WORDS: Record<string, Sender> = { mom: 'Mom', mum: 'Mom', mother: 'Mom', jay: 'Jay' }
const MAX_RESULTS = 8
const SYNONYM_WEIGHT = 0.8
const FUZZY_WEIGHT = 0.6

export interface DigResult {
  items: Item[]
  answer: string
}

function stem(word: string): string {
  if (word.endsWith('ses') && word.length > 4) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) return word.slice(0, -1)
  return word
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(stem)
}

function withinOneEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (b.length > a.length) j++
    else { i++; j++ }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

function wordMatch(token: string, words: string[]): number {
  if (words.includes(token)) return 1
  if (token.length >= 3 && words.some((word) => word.startsWith(token))) return 0.9
  if (token.length >= 5 && words.some((word) => withinOneEdit(token, word))) return FUZZY_WEIGHT
  return 0
}

/** Body words weigh more than metadata words (pile, kind, platform, domain). */
function bodyWords(item: Item): string[] {
  return tokenize([item.text, item.title, item.address, item.extracted, item.transcript, item.fileName].filter(Boolean).join(' '))
}

function metaWords(item: Item): string[] {
  return tokenize([getPile(item.pile).name, item.kind, item.platform, item.domain?.replace(/\./g, ' '), item.from].filter(Boolean).join(' '))
}

function scoreToken(token: string, body: string[], meta: string[]): number {
  const group: Array<[string, number]> = [[token, 1], ...(SYNONYMS[token] ?? []).map((word): [string, number] => [stem(word), SYNONYM_WEIGHT])]
  return Math.max(...group.map(([word, weight]) => Math.max(wordMatch(word, body) * 3, wordMatch(word, meta) * 2) * weight))
}

function detectSender(tokens: string[]): Sender | undefined {
  const hit = tokens.find((token) => SENDER_WORDS[token])
  return hit ? SENDER_WORDS[hit] : undefined
}

function timeWindow(query: string, now: number): ((item: Item) => boolean) | undefined {
  const lowered = query.toLowerCase()
  const today = startOfDay(now)
  if (/\byesterday\b/.test(lowered)) return (item) => item.createdAt >= today - 86_400_000 && item.createdAt < today
  if (/\btoday\b/.test(lowered)) return (item) => item.createdAt >= today
  if (/\blast week\b|\bthis week\b/.test(lowered)) return (item) => item.createdAt >= today - 7 * 86_400_000
  return undefined
}

const NOUNS: Record<string, string> = { address: 'address', video: 'video', article: 'article', recipe: 'recipe', todo: 'to-do', image: 'image', voice: 'voice note', note: 'note', link: 'link', file: 'file' }

function nounFor(item: Item): string {
  if (item.kind === 'link') {
    if (item.pile === 'watch') return NOUNS.video
    if (item.platform === 'recipe') return NOUNS.recipe
    if (item.platform === 'article') return NOUNS.article
    return NOUNS.link
  }
  return NOUNS[item.kind]
}

function plural(noun: string, count: number): string {
  if (count === 1) return noun
  return noun.endsWith('ss') || noun === 'address' ? `${noun}es` : `${noun}s`
}

function describe(items: Item[], sender: Sender | undefined): string {
  const nouns = new Set(items.map(nounFor))
  const noun = nouns.size === 1 ? [...nouns][0] : 'item'
  const label = plural(noun, items.length)
  const who = sender ? ` ${sender} sent` : ''
  if (items.length === 1) return `Found 1 ${label}${who} on ${formatShortDate(items[0].createdAt)}:`
  return `Dug up ${items.length} ${label}${who}. Newest first:`
}

/** Fuzzy keyword + synonym search over the dump. Pure, so it is easy to test. */
export function runDig(query: string, items: Item[], now: number = Date.now()): DigResult {
  const rawTokens = tokenize(query)
  const sender = detectSender(rawTokens)
  const tokens = rawTokens.filter((token) => !STOPWORDS.has(token) && !SENDER_WORDS[token])
  const inWindow = timeWindow(query, now)
  const candidates = items.filter((item) => (!sender || item.from === sender) && (!inWindow || inWindow(item)))

  if (tokens.length === 0 && !sender) return { items: [], answer: '' }
  const scored = candidates
    .map((item) => {
      const body = bodyWords(item)
      const meta = metaWords(item)
      const score = tokens.length === 0 ? 1 : tokens.reduce((sum, token) => sum + scoreToken(token, body, meta), 0)
      return { item, score }
    })
    .filter(({ score }) => score > 0)

  const best = Math.max(0, ...scored.map(({ score }) => score))
  const matches = scored
    .filter(({ score }) => score >= best * 0.5)
    .sort((a, b) => b.item.createdAt - a.item.createdAt)
    .slice(0, MAX_RESULTS)
    .map(({ item }) => item)

  return { items: matches, answer: matches.length ? describe(matches, sender) : '' }
}

export const SUGGESTED_DIGS = ['address from mom', 'videos to watch this weekend', 'what was that ramen place', 'stuff to buy']
