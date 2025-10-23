import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fix for mobile 100vh behavior: set a CSS variable --vh equal to 1% of the
// viewport height so components can use calc(var(--vh) * 100) instead of 100vh.
// This avoids the white gap on some mobile browsers when the address bar shows/hides.
function setVhProperty() {
  try {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  } catch (e) {
    // ignore in non-browser environments
  }
}

if (typeof window !== 'undefined') {
  setVhProperty()
  window.addEventListener('resize', () => setVhProperty())
  window.addEventListener('orientationchange', () => setVhProperty())
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
