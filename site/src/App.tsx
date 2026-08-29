import { Route, Routes } from 'react-router-dom'
import BoxHome from './components/box/BoxHome'
import CaseStudy from './components/CaseStudy'
import Pamphlet from './components/Pamphlet'
import Impostor from './games/Impostor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BoxHome />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/human-inventory" element={<Pamphlet />} />
      <Route path="/impostor" element={<Impostor />} />
      <Route path="*" element={<BoxHome />} />
    </Routes>
  )
}
