import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export type SheetState =
  | { type: 'item'; id: string }
  | { type: 'picker'; id: string }
  | { type: 'settings' }
  | null

export interface ToastState {
  key: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface UiValue {
  sheet: SheetState
  toast: ToastState | null
  shareOpen: boolean
  openItem: (id: string) => void
  openPicker: (id: string) => void
  openSettings: () => void
  closeSheet: () => void
  setShareOpen: (open: boolean) => void
  showToast: (message: string, action?: { label: string; onAction: () => void }) => void
  dismissToast: () => void
}

const UiContext = createContext<UiValue | null>(null)
const TOAST_MS = 4200

export function UiProvider({ children, initialSheet = null, initialShare = false }: { children: ReactNode; initialSheet?: SheetState; initialShare?: boolean }) {
  const [sheet, setSheet] = useState<SheetState>(initialSheet)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [shareOpen, setShareOpen] = useState(initialShare)
  const timer = useRef<number>(0)

  const dismissToast = useCallback(() => setToast(null), [])

  const showToast = useCallback<UiValue['showToast']>((message, action) => {
    window.clearTimeout(timer.current)
    setToast({ key: Date.now(), message, actionLabel: action?.label, onAction: action?.onAction })
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  const value = useMemo<UiValue>(
    () => ({
      sheet, toast, shareOpen, showToast, dismissToast, setShareOpen,
      openItem: (id) => setSheet({ type: 'item', id }),
      openPicker: (id) => setSheet({ type: 'picker', id }),
      openSettings: () => setSheet({ type: 'settings' }),
      closeSheet: () => setSheet(null),
    }),
    [sheet, toast, shareOpen, showToast, dismissToast],
  )
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi(): UiValue {
  const value = useContext(UiContext)
  if (!value) throw new Error('useUi must be used inside UiProvider')
  return value
}
