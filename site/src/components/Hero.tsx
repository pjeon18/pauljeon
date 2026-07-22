import { useEffect, useRef, useState } from 'react'
import { pinnedMode } from './Sky'
import { smoothScrollToId } from '../lib/scroll'
import type { Category } from '../content/site'

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
    const tick = () => setTime(fmt.format(new Date()) + ' EST')
    tick()
    const iv = setInterval(tick, 15000)
    return () => clearInterval(iv)
  }, [])
  return time
}

function greeting(): string {
  const mode = pinnedMode()
  if (mode === 'sunset') return 'Good evening'
  if (mode === 'night') return 'Up late'
  return new Date().getHours() < 12 ? 'Good morning' : 'Good afternoon'
}

const HEADLINE = (
  <>
    Hi, I'm Paul. I design and manage products for{' '}
    <em className="accent ink-word">
      claircognizance
      <svg className="ink-stroke" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3,8 C24,3.5 52,9.5 76,6 C94,3.5 108,7 117,5" pathLength={1} />
      </svg>
    </em>{' '}
    <span className="thin">— intuitive clarity.</span>
  </>
)

export default function Hero({
  filter,
  onFilter,
}: {
  filter: Category
  onFilter: (c: Category) => void
}) {
  const time = useClock()
  const headRef = useRef<HTMLHeadingElement>(null)

  // cursor-reveal glow: the headline is always lit; a blurred glow copy behind
  // a radial mask trails the pointer with floaty easing (see .cr-glow styles)
  useEffect(() => {
    const h = headRef.current
    if (!h) return
    const hero = h.closest('.ig-hero') as HTMLElement | null
    if (!hero) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hoverable = window.matchMedia('(hover: hover)').matches
    if (reduced || !hoverable) {
      h.classList.add('cr-static', 'inked')
      return
    }

    const REVEAL = 150
    const FOLLOW = 0.14
    let tx = 0, ty = 0, tr = 0, x = 0, y = 0, r = 0
    const onMove = (e: MouseEvent) => {
      const rect = h.getBoundingClientRect()
      tx = e.clientX - rect.left
      ty = e.clientY - rect.top
      tr = REVEAL
    }
    const onLeave = () => { tr = 0 }
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      x += (tx - x) * FOLLOW
      y += (ty - y) * FOLLOW
      r += (tr - r) * 0.10
      h.style.setProperty('--crx', x.toFixed(1) + 'px')
      h.style.setProperty('--cry', y.toFixed(1) + 'px')
      h.style.setProperty('--crr', Math.max(r, 0).toFixed(1) + 'px')
    }
    raf = requestAnimationFrame(loop)

    // draw the ink stroke under the accent word once the entrance settles
    const inkTimer = setTimeout(() => h.classList.add('inked'), 900)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(inkTimer)
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const chips: { cat: Category; label: string }[] = [
    { cat: 'all', label: 'All' },
    { cat: 'product', label: 'Product' },
    { cat: 'engineering', label: 'Engineering' },
    { cat: 'ml', label: 'AI / ML' },
  ]

  return (
    <>
      <div className="ig-nav">
        <span className="nav-left">
          <span className="logo">Paul Jeon</span>
          <span className="nav-time">{time}</span>
        </span>
        <span className="links">
          <a href="#work" onClick={(e) => { e.preventDefault(); smoothScrollToId('work', 40) }}>Work</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); smoothScrollToId('about', 60) }}>About</a>
        </span>
      </div>

      <div className="ig-hero">
        <div className="hello">
          <span className="dot">●</span>&nbsp; {greeting()} from Cambridge, MA — Harvard CS '27
        </div>
        <h1 className="cr" ref={headRef} style={{ '--crx': '50%', '--cry': '50%', '--crr': '0px' } as React.CSSProperties}>
          <span className="cr-layer cr-dim">{HEADLINE}</span>
          <span className="cr-layer cr-abs cr-glow" aria-hidden="true">{HEADLINE}</span>
        </h1>
        <p className="sub">
          I take new ideas into workable prototypes, while baking in purposeful design and code. Check them out below!
        </p>
      </div>

      <div className="ig-chips" id="work">
        {chips.map((c) => (
          <button
            key={c.cat}
            className={'ig-chip' + (filter === c.cat ? ' active' : '')}
            aria-pressed={filter === c.cat}
            onClick={() => onFilter(c.cat)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </>
  )
}
