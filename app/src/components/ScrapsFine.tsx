import { BRAND_ART } from '../generated/brandIcons'

/**
 * Scraps the raccoon, retired from the brand front. Fine-line easter egg only.
 * Uses the brand kit's scraps-fineline.svg when synced, else a simple inline monoline.
 */
export function ScrapsFine({ className }: { className?: string }) {
  const art = BRAND_ART['scraps-fineline']
  return (
    <svg
      className={className}
      viewBox={art?.viewBox ?? '0 0 120 100'}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...(art ? { dangerouslySetInnerHTML: { __html: art.inner } } : {})}
    >
      {art ? null : (
        <>
          <path d="M18 56c-8-8-4-24 4-30l10 12M102 56c8-8 4-24-4-30L88 38" />
          <path d="M32 38C40 28 80 28 88 38c8 10 10 24 2 34-8 9-22 12-30 12s-22-3-30-12c-8-10-6-24 2-34z" />
          <path d="M34 56c6-8 14-8 20-2M86 56c-6-8-14-8-20-2" opacity={0.6} />
          <circle cx="45" cy="58" r="2" fill="currentColor" stroke="none" />
          <circle cx="75" cy="58" r="2" fill="currentColor" stroke="none" />
          <path d="M56 68c2-2 6-2 8 0-1 3-7 3-8 0z" />
          <path d="M60 71v4M54 77c3 2 9 2 12 0" opacity={0.6} />
          <path d="M60 28v8M52 29l2 7M68 29l-2 7" opacity={0.45} />
        </>
      )}
    </svg>
  )
}
