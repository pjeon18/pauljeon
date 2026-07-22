import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Sky from './components/Sky'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import About from './components/About'
import Playground from './components/Playground'
import Footer from './components/Footer'
import CaseStudy from './components/CaseStudy'
import Pamphlet from './components/Pamphlet'
import Impostor from './games/Impostor'
import { smoothScrollToId } from './lib/scroll'
import type { Category } from './content/site'

function Home() {
  const [filter, setFilter] = useState<Category>('all')
  const zoneRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // arriving with a hash (e.g. "/#work" from a case-study page) glides there
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const t = setTimeout(() => smoothScrollToId(id), 120)
      return () => clearTimeout(t)
    }
  }, [location.hash])

  return (
    <>
      <div className="skyzone" ref={zoneRef}>
        <Sky zone={zoneRef} />
        <div className="mockin">
          <Hero filter={filter} onFilter={setFilter} />
          <Carousel filter={filter} />
        </div>
      </div>
      <About />
      <Playground />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/human-inventory" element={<Pamphlet />} />
      <Route path="/impostor" element={<Impostor />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
