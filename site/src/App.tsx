import { useRef, useState } from 'react'
import Sky from './components/Sky'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import About from './components/About'
import Playground from './components/Playground'
import Footer from './components/Footer'
import type { Category } from './content/site'

export default function App() {
  const [filter, setFilter] = useState<Category>('all')
  const zoneRef = useRef<HTMLDivElement>(null)

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
