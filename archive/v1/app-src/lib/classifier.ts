import type { Classification, PileId, Platform, Sender } from './types'

interface DomainRule {
  pile: PileId
  platform: Platform
}

const DOMAIN_RULES: Record<string, DomainRule> = {
  'youtube.com': { pile: 'watch', platform: 'youtube' },
  'youtu.be': { pile: 'watch', platform: 'youtube' },
  'tiktok.com': { pile: 'watch', platform: 'tiktok' },
  'instagram.com': { pile: 'watch', platform: 'instagram' },
  'vimeo.com': { pile: 'watch', platform: 'youtube' },
  'nytimes.com': { pile: 'reads', platform: 'article' },
  'theverge.com': { pile: 'reads', platform: 'article' },
  'wired.com': { pile: 'reads', platform: 'article' },
  'medium.com': { pile: 'reads', platform: 'article' },
  'seriouseats.com': { pile: 'reads', platform: 'recipe' },
  'bonappetit.com': { pile: 'reads', platform: 'recipe' },
  'amazon.com': { pile: 'shopping', platform: 'amazon' },
  'ikea.com': { pile: 'shopping', platform: 'ikea' },
  'etsy.com': { pile: 'shopping', platform: 'store' },
  'target.com': { pile: 'shopping', platform: 'store' },
  'bestbuy.com': { pile: 'shopping', platform: 'store' },
  'yelp.com': { pile: 'places', platform: 'maps' },
  'maps.google.com': { pile: 'places', platform: 'maps' },
}

const URL_PATTERN = /https?:\/\/[^\s]+/i
const ADDRESS_PATTERN =
  /\b\d{1,5}\s+(?:[A-Za-z0-9.'-]+\s+){1,4}(?:st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|ln|lane|way|ct|court|pl|place|pkwy|parkway|hwy)\b\.?(?:,\s*[A-Za-z0-9 ]{2,20}){0,3}/i
const TODO_PATTERN =
  /^(?:remember to|remind me to|buy|get|call|pick up|email|book|schedule|renew|pay|text|order|fix|clean|return|send|ask)\b/i
const IDEA_PATTERN = /\b(?:idea|what if|maybe|could|should we|imagine)\b/i
const PEOPLE_PATTERN = /\b(?:birthday|anniversary|gift for)\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/i
const PLACE_CONTEXT_PATTERN = /\b(?:parking|building|apt|apartment|entrance|address|floor|suite|buzzer|gate code|door code)\b/i
const SENDER_PREFIX = /^\s*(mom|jay)\s*:\s*/i
const SENDER_ANYWHERE = /\bfrom (mom|jay)\b/i

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/** Detects who a message is "from": text starting with "mom:" or containing "from mom". */
export function detectSender(text: string): { from: Sender; text: string } {
  const prefix = SENDER_PREFIX.exec(text)
  if (prefix) return { from: capitalize(prefix[1]) as Sender, text: text.replace(SENDER_PREFIX, '') }
  const anywhere = SENDER_ANYWHERE.exec(text)
  if (anywhere) return { from: capitalize(anywhere[1]) as Sender, text }
  return { from: 'Me', text }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function ruleForHost(host: string): DomainRule | undefined {
  const key = Object.keys(DOMAIN_RULES).find((domain) => host === domain || host.endsWith(`.${domain}`))
  return key ? DOMAIN_RULES[key] : undefined
}

export function titleFromUrl(url: string): string {
  const host = hostOf(url)
  let segments: string[] = []
  try {
    segments = new URL(url).pathname.split('/').filter(Boolean)
  } catch {
    // fall through to the generic title
  }
  const slug = [...segments]
    .reverse()
    .map((segment) => segment.replace(/\.(html?|php)$/i, ''))
    .find((segment) => /[a-z]{3,}-[a-z]/i.test(segment))
  if (!slug) return `Saved from ${host}`
  const sentence = slug
    .replace(/-recipe$/i, '')
    .split('-')
    .filter((word) => !/^\d+$/.test(word))
    .join(' ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

function classifyLink(text: string, from: Sender, url: string): Classification {
  const domain = hostOf(url)
  const rule = ruleForHost(domain)
  const looksLikeRecipe = /recipe|cooking/i.test(url)
  return {
    kind: 'link',
    pile: rule?.pile ?? 'unsorted',
    platform: looksLikeRecipe ? 'recipe' : (rule?.platform ?? 'web'),
    text,
    from,
    url,
    domain,
    title: titleFromUrl(url),
  }
}

/** Rule-based mock of the "AI". Order: link, address, to-do, people, idea, fallback. */
export function classifyText(rawText: string): Classification {
  const { from, text } = detectSender(rawText.trim())
  const link = URL_PATTERN.exec(text)
  if (link) return classifyLink(text, from, link[0])

  const address = ADDRESS_PATTERN.exec(text)
  if (address) return { kind: 'address', pile: 'places', text, from, address: address[0].trim().replace(/[.,]+$/, '') }

  if (TODO_PATTERN.test(text)) return { kind: 'todo', pile: 'todos', text, from, done: false }
  // The sender is metadata only. It never decides the pile.
  if (PLACE_CONTEXT_PATTERN.test(text)) return { kind: 'note', pile: 'places', text, from }
  if (PEOPLE_PATTERN.test(text)) return { kind: 'note', pile: 'people', text, from }
  if (IDEA_PATTERN.test(text) || text.split(/\s+/).length >= 5) return { kind: 'note', pile: 'ideas', text, from }
  return { kind: 'note', pile: 'unsorted', text, from }
}
