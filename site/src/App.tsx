import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import CursorDot from './components/CursorDot'
import EdgeGlow from './components/EdgeGlow'
import CaseStudy from './components/CaseStudy'
import StuddyMag from './components/StuddyMag'
import IsoMag from './components/IsoMag'
import PrepMag from './components/PrepMag'
import IsoLight from './components/IsoLight'
import PathwaysCase from './components/PathwaysCase'
import { IsoBrand, IsoProcess } from './components/IsoPages'
import { installSoon } from './lib/soon'

installSoon()

// The React site now only holds the case studies. Its old home pages are gone, so its own front
// page and any unknown address go to the current home one level up (/classic/ -> /).
// The pamphlet (components/Pamphlet) and the Impostor game (games/Impostor) are kept in the
// source but have no route for now.
const HOME = import.meta.env.BASE_URL.replace(/classic\/$/, '')
function ToHome() {
  useEffect(() => {
    if (HOME === import.meta.env.BASE_URL) return
    // inside the home page's case-study frame, take the whole page home, not just the frame
    try { (window.top ?? window).location.replace(HOME) } catch { window.location.replace(HOME) }
  }, [])
  return null
}

export default function App() {
  return (
    <>
      <EdgeGlow />
      <CursorDot />
      <Routes>
        <Route path="/" element={<ToHome />} />
        <Route path="/work/studdy" element={<StuddyMag />} />
        <Route path="/work/iso" element={<IsoMag />} />
        <Route path="/work/prep-io" element={<PrepMag />} />
        <Route path="/work/iso-redesign" element={<IsoLight />} />
        <Route path="/work/harvard-pathways" element={<PathwaysCase />} />
        <Route path="/work/iso-redesign/brand" element={<IsoBrand />} />
        <Route path="/work/iso-redesign/process" element={<IsoProcess />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<ToHome />} />
      </Routes>
    </>
  )
}
