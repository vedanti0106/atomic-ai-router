import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init } from '@plausible-analytics/tracker'

if (typeof window !== 'undefined') {
  init({
    domain: 'atomic-ai-router.vercel.app',
    captureOnLocalhost: true,
    bindToWindow: true,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
