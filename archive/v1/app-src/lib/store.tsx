import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createSeed } from './seed'
import type { Item } from './types'

const STORAGE_KEY = 'dumpster.items.v1'
const ONBOARDED_KEY = 'dumpster.onboarded.v1'
const FRESH_MS = 20_000

interface StoreValue {
  items: Item[]
  freshIds: string[]
  addItem: (item: Item) => void
  patchItem: (id: string, patch: Partial<Item>) => void
  removeItem: (id: string) => void
  restoreItem: (item: Item) => void
  resetData: () => void
  getItem: (id: string) => Item | undefined
}

const StoreContext = createContext<StoreValue | null>(null)

function loadItems(): Item[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as Item[]
    }
  } catch {
    // storage blocked or corrupt: fall back to the seed
  }
  return createSeed()
}

function saveItems(items: Item[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // demo still works without persistence
  }
}

export function readOnboarded(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDED_KEY) === '1'
  } catch {
    return false
  }
}

export function writeOnboarded(done: boolean): void {
  try {
    if (done) window.localStorage.setItem(ONBOARDED_KEY, '1')
    else window.localStorage.removeItem(ONBOARDED_KEY)
  } catch {
    // ignore
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(loadItems)
  const [freshIds, setFreshIds] = useState<string[]>([])

  useEffect(() => saveItems(items), [items])

  const addItem = useCallback((item: Item) => {
    setItems((current) => [...current, item])
    setFreshIds((current) => [...current, item.id])
    window.setTimeout(() => setFreshIds((current) => current.filter((id) => id !== item.id)), FRESH_MS)
  }, [])

  const patchItem = useCallback((id: string, patch: Partial<Item>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const restoreItem = useCallback((item: Item) => {
    setItems((current) => [...current, item].sort((a, b) => a.createdAt - b.createdAt))
  }, [])

  const resetData = useCallback(() => {
    setItems(createSeed())
    setFreshIds([])
  }, [])

  const getItem = useCallback((id: string) => items.find((item) => item.id === id), [items])

  const value = useMemo(
    () => ({ items, freshIds, addItem, patchItem, removeItem, restoreItem, resetData, getItem }),
    [items, freshIds, addItem, patchItem, removeItem, restoreItem, resetData, getItem],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside StoreProvider')
  return value
}
