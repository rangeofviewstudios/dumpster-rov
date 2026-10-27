import { useState } from 'react'
import { DigScreen } from './components/DigScreen'
import { DumpScreen } from './components/DumpScreen'
import { ItemSheet } from './components/ItemSheet'
import { Onboarding } from './components/Onboarding'
import { PhoneFrame } from './components/PhoneFrame'
import { PilePicker } from './components/PilePicker'
import { PilesScreen } from './components/PilesScreen'
import { SettingsSheet } from './components/SettingsSheet'
import { ShareSim } from './components/ShareSim'
import { TabBar } from './components/TabBar'
import { Toast } from './components/Toast'
import { readParams, type Tab } from './lib/params'
import { readOnboarded, StoreProvider, writeOnboarded } from './lib/store'
import { UiProvider, useUi, type SheetState } from './lib/ui'
import type { PileId } from './lib/types'

const params = readParams()

function initialSheet(): SheetState {
  if (params.sheet === 'settings') return { type: 'settings' }
  if ((params.sheet === 'item' || params.sheet === 'picker') && params.itemId) {
    return { type: params.sheet, id: params.itemId }
  }
  return null
}

function Shell() {
  const [tab, setTab] = useState<Tab>(params.tab)
  const [openPile, setOpenPile] = useState<PileId | undefined>(params.pile)
  const [showOnboarding, setShowOnboarding] = useState(params.onboarding || (!params.deepLinked && !readOnboarded()))
  const { sheet } = useUi()

  function finishOnboarding() {
    writeOnboarded(true)
    setShowOnboarding(false)
  }

  function changeTab(next: Tab) {
    setTab(next)
    if (next !== 'piles') setOpenPile(undefined)
  }

  const itemId = sheet && (sheet.type === 'item' || sheet.type === 'picker') ? sheet.id : null

  return (
    <PhoneFrame>
      <main className="app-main">
        {tab === 'dump' && <DumpScreen />}
        {tab === 'piles' && <PilesScreen openPileId={openPile} onOpenPile={setOpenPile} />}
        {tab === 'dig' && <DigScreen initialQuery={params.query} />}
      </main>
      <TabBar active={tab} onChange={changeTab} />
      <ItemSheet itemId={sheet?.type === 'item' ? itemId : null} />
      <PilePicker itemId={sheet?.type === 'picker' ? itemId : null} />
      <SettingsSheet open={sheet?.type === 'settings'} onReplayOnboarding={() => setShowOnboarding(true)} />
      <ShareSim onDone={() => changeTab('dump')} />
      <Toast />
      {showOnboarding && <Onboarding initialStep={params.onboardingStep} onFinish={finishOnboarding} />}
    </PhoneFrame>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <UiProvider initialSheet={initialSheet()} initialShare={params.share}>
        <Shell />
      </UiProvider>
    </StoreProvider>
  )
}
