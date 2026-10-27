import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { readParams } from './lib/params'
import { applyTheme, readTheme } from './lib/theme'
import './styles/theme.css'
import './styles/screens.css'
import './styles/cards.css'
import './styles/sheets.css'
import './styles/flight.css'

const previewTheme = readParams().theme
applyTheme(previewTheme ?? readTheme(), false)

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined)
  })
}
