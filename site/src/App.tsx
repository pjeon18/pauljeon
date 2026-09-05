import { Route, Routes } from 'react-router-dom'
import BoxHome from './components/box/BoxHome'
import SplitHome from './components/home2/SplitHome'
import CaseStudy from './components/CaseStudy'
import Pamphlet from './components/Pamphlet'
import Impostor from './games/Impostor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplitHome />} />
      <Route path="/box" element={<BoxHome />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/human-inventory" element={<Pamphlet />} />
      <Route path="/impostor" element={<Impostor />} />
      <Route path="*" element={<SplitHome />} />
    </Routes>
  )
}
