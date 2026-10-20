import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { installSprings } from './lib/spring'
import './styles/fonts.css'
import './styles/site.css'
import './styles/box.css'
import './styles/home2.css'
import './styles/motion.css'

installSprings()

// Inside the new home's project view, a case page is shown in a frame: no way "back to site"
// (the frame is the site), and no edge glow around a page that is not the whole window.
if (window.self !== window.top) document.documentElement.classList.add('embedded')

// Every film on the site starts at a quiet level; people can still turn it up.
const QUIET = 0.3
document.addEventListener('play', (e) => {
  const v = e.target as HTMLMediaElement
  if (v instanceof HTMLMediaElement && !v.dataset.quiet) { v.dataset.quiet = '1'; v.volume = QUIET }
}, true)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
