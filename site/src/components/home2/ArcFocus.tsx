import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cards, caseStudies } from '../../content/site'
import type { Card } from '../../content/site'
import CardArt from '../CardArt'

// ============================================================================
// ArcFocus — the right half of the home page. All projects hang on a vertical
// arc whose pivot sits off the right edge (the reference carousel rotated
// 90°). The wheel — or a vertical drag, or ↑/↓ — spins the arc; it snaps to
// the nearest card when you stop. Clicking the focused card pulls it out of
// the arc and opens a switch-on-hover tab panel (Overview / Role / Stack /
// Links) built from the card + its case study.
// ============================================================================

const STEP = 17 // degrees between cards
const R = 620 // arc radius (card width lives in .af-card CSS)
const OVERHANG = 150 // pivot distance past the pane's right edge

interface TabDef {
  id: string
  label: string
  body?: string
  links?: { label: string; href: string; internal?: boolean }[]
}

function tabsFor(card: Card): TabDef[] {
  const cs = card.slug ? caseStudies[card.slug] : undefined
  const tabs: TabDef[] = [{ id: 'overview', label: 'Overview', body: card.blurb }]
  if (cs?.role) tabs.push({ id: 'role', label: 'My role', body: cs.role })
  if (cs?.stack) tabs.push({ id: 'stack', label: 'Stack', body: cs.stack })
  const links: TabDef['links'] = []
  if (card.slug) links.push({ label: 'Read the case study', href: `/work/${card.slug}`, internal: true })
  if (card.page) links.push({ label: card.linkLabel || 'Open', href: card.page, internal: true })
  if (card.href && !card.href.startsWith('#')) links.push({ label: card.linkLabel || 'Open', href: card.href })
  if (card.demo) links.push({ label: card.demo.label, href: card.demo.href })
  if (links.length) tabs.push({ id: 'links', label: 'Links', links })
  return tabs
}

function wrapOffset(i: number, pos: number, n: number) {
  let off = (i - pos) % n
  if (off < -n / 2) off += n
  if (off >= n / 2) off -= n
  return off
}

export default function ArcFocus() {
  const paneRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0) // continuous card index along the arc
  const [pos, setPos] = useState(0)
  const [popped, setPopped] = useState(false)
  const snapRaf = useRef(0)
  const idleTimer = useRef(0)
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const n = cards.length
  const active = ((Math.round(pos) % n) + n) % n
  const settled = Math.abs(pos - Math.round(pos)) < 0.02

  const setPosBoth = (v: number) => {
    posRef.current = v
    setPos(v)
  }

  const snapToNearest = (to?: number) => {
    cancelAnimationFrame(snapRaf.current)
    const target = to ?? Math.round(posRef.current)
    if (reduced) {
      setPosBoth(target)
      return
    }
    const step = () => {
      const d = target - posRef.current
      if (Math.abs(d) < 0.003) {
        setPosBoth(target)
        return
      }
      setPosBoth(posRef.current + d * 0.14)
      snapRaf.current = requestAnimationFrame(step)
    }
    snapRaf.current = requestAnimationFrame(step)
  }

  // wheel spins the arc (scoped to the pane — page never scrolls here)
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (popped) {
        setPopped(false)
        return
      }
      cancelAnimationFrame(snapRaf.current)
      window.clearTimeout(idleTimer.current)
      setPosBoth(posRef.current + e.deltaY * 0.0032)
      idleTimer.current = window.setTimeout(() => snapToNearest(), 140)
    }
    pane.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      pane.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(snapRaf.current)
      window.clearTimeout(idleTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped])

  // vertical drag spins it too; a still click on a card focuses/pops it
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.af-panel, a, .af-tab')) return
      let lastY = e.clientY
      let moved = false
      const pid = e.pointerId
      const move = (ev: PointerEvent) => {
        const dy = ev.clientY - lastY
        if (!moved && Math.abs(ev.clientY - e.clientY) > 6) {
          moved = true
          try { pane.setPointerCapture(pid) } catch { /* no-op */ }
          cancelAnimationFrame(snapRaf.current)
        }
        if (!moved) return
        lastY = ev.clientY
        setPosBoth(posRef.current - dy * 0.011)
      }
      const up = () => {
        pane.removeEventListener('pointermove', move)
        pane.removeEventListener('pointerup', up)
        pane.removeEventListener('pointercancel', up)
        try { pane.releasePointerCapture(pid) } catch { /* no-op */ }
        if (moved) snapToNearest()
      }
      pane.addEventListener('pointermove', move)
      pane.addEventListener('pointerup', up)
      pane.addEventListener('pointercancel', up)
    }
    pane.addEventListener('pointerdown', onDown)
    return () => pane.removeEventListener('pointerdown', onDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keyboard + escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopped(false)
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        setPopped(false)
        snapToNearest(Math.round(posRef.current) + (e.key === 'ArrowDown' ? 1 : -1))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCardClick = (i: number) => {
    const off = wrapOffset(i, Math.round(posRef.current), n)
    if (off === 0 && settled) {
      setPopped((p) => !p)
    } else {
      setPopped(false)
      snapToNearest(Math.round(posRef.current) + off)
    }
  }

  const activeCard = cards[active]
  const tabs = useMemo(() => tabsFor(activeCard), [activeCard])
  const [activeTab, setActiveTab] = useState('overview')
  useEffect(() => setActiveTab('overview'), [active, popped])

  return (
    <div
      className={'af-pane' + (popped ? ' af-popped' : '')}
      ref={paneRef}
      role="listbox"
      aria-label="Projects — scroll to browse, click to open"
    >
      <div className="af-arc" style={{ right: -OVERHANG }}>
        {cards.map((card, i) => {
          const off = wrapOffset(i, pos, n)
          const theta = off * STEP
          const isActive = i === active && settled
          const isPop = isActive && popped
          const hidden = Math.abs(theta) > 78
          return (
            <button
              key={card.id}
              className={
                'af-card' + (isActive ? ' af-active' : '') + (isPop ? ' af-out' : '')
              }
              style={{
                transform: `rotate(${theta}deg) translateX(${-R}px)`,
                opacity: hidden ? 0 : 1,
                zIndex: 100 - Math.round(Math.abs(theta)),
                pointerEvents: hidden ? 'none' : 'auto',
              }}
              onClick={() => onCardClick(i)}
              aria-selected={isActive}
              aria-label={card.title}
            >
              <span className="af-lift">
                <span className="af-photo"><CardArt card={card} /></span>
                <span className="af-caption">
                  <span className="af-t">{card.title}</span>
                  <span className="af-m">{card.meta}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* switch-on-hover tabs for the pulled card */}
      <div className="af-panel" aria-hidden={!popped}>
        <div className="af-panel-kicker">{activeCard.meta}</div>
        <h2 className="af-panel-title">{activeCard.title}</h2>
        <div className="af-tabs">
          {tabs.map((t) => (
            <div key={t.id} className={'af-tab' + (activeTab === t.id ? ' on' : '')}>
              <button
                className="af-tab-label"
                onMouseEnter={() => setActiveTab(t.id)}
                onFocus={() => setActiveTab(t.id)}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
              <div className="af-tab-body">
                {t.body && <p>{t.body}</p>}
                {t.links && (
                  <div className="af-links">
                    {t.links.map((l) =>
                      l.internal ? (
                        <Link key={l.href} to={l.href} className="af-link">
                          {l.label} <span className="arr">→</span>
                        </Link>
                      ) : (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="af-link">
                          {l.label} <span className="arr">↗</span>
                        </a>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="af-close" onClick={() => setPopped(false)} aria-label="Close details">
          close
        </button>
      </div>

      <div className="af-hint" aria-hidden="true">scroll to browse · click to open</div>
    </div>
  )
}
