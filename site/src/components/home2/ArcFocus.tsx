import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { cards, caseStudies } from '../../content/site'
import type { Card } from '../../content/site'
import CardArt from '../CardArt'
import { markArrival } from '../../lib/arrival'
import { protos, films, filmFor } from '../../content/motion'
import ProtoStage from './ProtoStage'
import Reels from './Reels'
import MotionPoster, { hasPoster } from './MotionPoster'

// ============================================================================
// ArcFocus — the right half of the home page. All projects hang on a vertical
// arc whose pivot sits off the right edge (the reference carousel rotated
// 90°). The wheel — or a vertical drag, or ↑/↓ — spins the arc; it snaps to
// the nearest card when you stop. Clicking the focused card pulls it out of
// the arc and opens a switch-on-hover tab panel (Overview / Role / Stack /
// Links) built from the card + its case study.
// ============================================================================

const STEP = 26 // degrees between cards — five in view, none touching
const R = 600 // arc radius — tight wheel, pronounced curve
const OVERHANG = 160 // pivot distance past the pane's right edge
const CARD_W = 264 // must match .af-card width in home2.css
const TILT = 0.55 // cards counter-rotate to 55% of their arc angle (flatter corners)
const DOCK_PAD = 28 // pane edge padding around the docked layout
const DOCK_GAP = 44 // space between the tab panel and the docked card
const ARC_SHIFT = 200 // .af-popped .af-arc translateX in home2.css — dock compensates
// notch strength in cards/s²; ?detent=0 turns it off to compare
const DETENT = new URLSearchParams(location.search).get('detent') === '0' ? 0 : 9

interface TabDef {
  id: string
  label: string
  body?: string
  stack?: string
  links?: { label: string; href: string; internal?: boolean; soon?: boolean }[]
}

function tabsFor(card: Card): TabDef[] {
  const cs = card.slug ? caseStudies[card.slug] : undefined
  const tabs: TabDef[] = [{ id: 'overview', label: 'Overview', body: card.blurb }]
  // role and stack read as one story (what I did, with what), so they share a tab
  if (cs?.role && cs?.stack) tabs.push({ id: 'role', label: 'Role & stack', body: cs.role, stack: cs.stack })
  else if (cs?.role) tabs.push({ id: 'role', label: 'My role', body: cs.role })
  else if (cs?.stack) tabs.push({ id: 'stack', label: 'Stack', body: cs.stack })
  const links: TabDef['links'] = []
  if (card.slug) links.push({ label: 'Read the case study', href: `/work/${card.slug}`, internal: true })
  if (card.page) links.push({ label: card.linkLabel || 'Open', href: card.page, internal: true })
  if (card.href && !card.href.startsWith('#')) links.push({ label: card.linkLabel || 'Open', href: card.href })
  if (card.demo) links.push({ label: card.demo.label, href: card.demo.href, soon: card.demo.soon })
  if (links.length) tabs.push({ id: 'links', label: 'Links', links })
  return tabs
}

function wrapOffset(i: number, pos: number, n: number) {
  let off = (i - pos) % n
  if (off < -n / 2) off += n
  if (off >= n / 2) off -= n
  return off
}

// the card the wheel comes to rest on when the site first opens
const HOME_CARD = Math.max(0, cards.findIndex((c) => c.id === 'lila'))

export default function ArcFocus({ spinIn = false, awaitCollision = false, dockIndex = null }: { spinIn?: boolean; awaitCollision?: boolean; dockIndex?: number | null }) {
  const navigate = useNavigate()
  const paneRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(dockIndex ?? HOME_CARD) // continuous card index along the arc
  // returning from a case study, the arc mounts with that card already docked
  // so the page's hero has a card to morph back into. It lets go a beat later.
  const [pos, setPos] = useState(dockIndex ?? HOME_CARD)
  const [popped, setPoppedRaw] = useState(dockIndex !== null)
  const [pane, setPane] = useState({ w: 0, h: 900 })
  const snapRaf = useRef(0)
  const reduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // toggling the pop opens a brief window where card transforms animate
  // Opening slides the card out of the arc (a lean toward you, then a spring
  // into the dock) while the pane takes a small camera punch; closing slides it
  // home with the opposite lean. The classes only live for the move itself.
  const poppedRef = useRef(dockIndex !== null)
  const animTimer = useRef(0)
  const setPopped = (v: boolean | ((p: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(poppedRef.current) : v
    const pane = paneRef.current
    if (pane && next !== poppedRef.current) {
      window.clearTimeout(animTimer.current)
      pane.classList.remove('af-opening', 'af-closing', 'af-punch')
      void pane.offsetWidth // restart the keyframes if a move is interrupted
      pane.classList.add('af-anim', next ? 'af-opening' : 'af-closing')
      if (next) pane.classList.add('af-punch')
      animTimer.current = window.setTimeout(() => pane.classList.remove('af-anim', 'af-opening', 'af-closing', 'af-punch'), 760)
    }
    poppedRef.current = next
    setPoppedRaw(next)
  }

  // the docked detail layout is computed from the pane's real width
  useEffect(() => {
    const el = paneRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setPane({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    setPane({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // the whole arc scales with pane height: the 900px-tall composition is the
  // design space, taller windows see it proportionally larger (bigger cards,
  // same rhythm). Scale origin sits on the focused card so it stays anchored.
  const S = Math.min(1.7, Math.max(0.8, pane.h / 900))
  // On a phone the pane is the full width and stacked under the intro. The
  // pivot moves so the focused card sits centred, the neighbours curve off
  // to the right, and a docked card centres too with the panel as a sheet.
  // phone layout is a viewport decision (it matches the CSS breakpoint). The
  // pane alone is under 880px on most laptops, which docked the card on top
  // of the panel.
  const narrow = pane.w > 0 && window.innerWidth <= 880
  const over = narrow ? R - pane.w / 2 : OVERHANG
  const shift = narrow ? 0 : ARC_SHIFT
  const popW = narrow ? Math.min(300, pane.w * 0.62) : Math.min(400, Math.max(280, pane.w * 0.34))
  const panelW = narrow ? pane.w - DOCK_PAD * 2 : Math.round(Math.max(180, pane.w - DOCK_PAD * 2 - DOCK_GAP - popW))
  const popLift = popW / (CARD_W * S)
  const dockCenterX = narrow ? pane.w / 2 : DOCK_PAD + panelW + DOCK_GAP + popW / 2
  // dock translate lives inside the scaled arc: invert shift + scale
  const dockT = (dockCenterX - shift - (pane.w + over) + R) / S - R

  const n = cards.length
  const active = ((Math.round(pos) % n) + n) % n
  const settled = Math.abs(pos - Math.round(pos)) < 0.02

  const setPosBoth = (v: number) => {
    posRef.current = v
    setPos(v)
  }

  // One motion loop for everything that moves the arc once the hand lets go.
  // It coasts under friction, then a spring pulls it onto the nearest card, or
  // onto an explicit aim for keys and clicks. Input adds to velocity rather
  // than resetting it, so gestures stack the way a real wheel's would.
  const velRef = useRef(0)                       // cards per second
  const aimRef = useRef<number | null>(null)
  const motionRaf = useRef(0)
  const lastT = useRef(0)
  const FRICTION = 0.935, SNAP_V = 1.4, DAMP = 22
  // the spring is normally brisk; the idle drift borrows a lazy one for its single notch
  const softRef = useRef(false)
  // a planned resting card for a coasting spin; any hand input clears it
  const landRef = useRef<number | null>(null)

  const stopMotion = () => { cancelAnimationFrame(motionRaf.current); motionRaf.current = 0 }
  const startMotion = () => {
    if (motionRaf.current) return
    cancelAnimationFrame(snapRaf.current)          // a running boot spin yields to the hand
    if (reduced) {
      velRef.current = 0
      setPosBoth(aimRef.current ?? Math.round(posRef.current))
      aimRef.current = null
      return
    }
    lastT.current = performance.now()
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastT.current) / 1000)
      lastT.current = now
      let p = posRef.current
      let v = velRef.current
      const a = aimRef.current
      if (a === null && Math.abs(v) > SNAP_V) {
        v *= Math.pow(FRICTION, dt * 60)
        // detents: a gentle pull toward each card as it passes, so a slow spin
        // clicks through card by card while a fast one sails over them
        if (DETENT) v -= DETENT * Math.sin(2 * Math.PI * p) * dt
        p += v * dt
      } else {
        const target = a ?? landRef.current ?? Math.round(p)
        const stiff = softRef.current ? 26 : 210, damp = softRef.current ? 10 : DAMP
        v += ((target - p) * stiff - v * damp) * dt
        p += v * dt
        if (Math.abs(target - p) < 0.0006 && Math.abs(v) < 0.02) {
          velRef.current = 0
          aimRef.current = null
          landRef.current = null
          motionRaf.current = 0
          softRef.current = false
          setPosBoth(target)
          return
        }
      }
      velRef.current = v
      setPosBoth(p)
      motionRaf.current = requestAnimationFrame(step)
    }
    motionRaf.current = requestAnimationFrame(step)
  }
  const aim = (target: number) => { softRef.current = false; landRef.current = null; aimRef.current = target; velRef.current = 0; startMotion() }
  const fling = (dv: number) => { softRef.current = false; landRef.current = null; aimRef.current = null; velRef.current += dv; startMotion() }
  // a fling sized to coast onto a chosen card: coasting from v covers about
  // (v - SNAP_V) / (60 (1 - FRICTION)) cards, then the spring settles it
  const flingOnto = (card: number, atLeast: number) => {
    const p = posRef.current, v = velRef.current, per = 60 * (1 - FRICTION)
    let k = Math.ceil(p + atLeast)
    while (((k % n) + n) % n !== card) k++
    fling((k - p) * per + SNAP_V - v)
    landRef.current = k
  }
  // A wheel tick from rest always reaches the next card. Coasting from v0
  // covers (v0 - SNAP_V) / (60 (1 - FRICTION)) cards before the spring takes
  // over, so a light scroll is topped up to just clear the halfway point. A
  // scroll that lands while already moving keeps its own momentum.
  const nudge = (dv: number) => {
    const p = posRef.current, v0 = velRef.current, dir = Math.sign(dv)
    if (aimRef.current === null && Math.abs(v0) < SNAP_V && dir !== 0) {
      const need = SNAP_V + 60 * (1 - FRICTION) * (0.56 - dir * (p - Math.round(p)))
      const v = v0 + dv
      if (Math.abs(v) < need) { aimRef.current = null; landRef.current = null; velRef.current = dir * need; startMotion(); return }
    }
    fling(dv)
  }

  // boot: the arc arrives already turning and decelerates onto the focused
  // card. Position is integrated with a quintic ease-out so the last few
  // degrees crawl, which is what reads as mass rather than a transition.
  const spun = useRef(false)
  useEffect(() => {
    if (!spinIn || spun.current) return
    spun.current = true
    if (reduced) return
    // The arc arrives fast and decelerates like a wheel under friction, but
    // with a long time constant, so it is still creeping when the guide dot
    // reaches it about 6.8s in. The collision's fling cancels this and takes
    // over, so boot and collision read as one motion, not two spins. If no
    // collision comes, the spring parks it on the nearest card at the end.
    // Without a tour coming (phones, replays) the same curve runs short, so
    // the arc simply arrives and parks.
    const FROM = HOME_CARD - 3.0
    const TAU = awaitCollision ? 1.55 : 0.42   // seconds, the decay of the arrival speed
    const MS = awaitCollision ? 6650 : 1700
    const DELAY = 320         // let the splash mask finish opening first
    const dist = HOME_CARD - FROM
    const v0 = dist / (TAU * (1 - Math.exp(-MS / 1000 / TAU)))
    const t0 = performance.now() + DELAY
    setPosBoth(FROM)
    const step = () => {
      const t = Math.min(MS / 1000, Math.max(0, (performance.now() - t0) / 1000))
      const travelled = v0 * TAU * (1 - Math.exp(-t / TAU))
      setPosBoth(FROM + travelled)
      if (t < MS / 1000) snapRaf.current = requestAnimationFrame(step)
      else startMotion()
    }
    snapRaf.current = requestAnimationFrame(step)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinIn])

  // the returning dock lets go once the hero has landed in the card
  useEffect(() => {
    if (dockIndex === null) return
    const t = window.setTimeout(() => setPopped(false), 900)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the guide dot colliding with the wheel: a hard fling that the same friction
  // and spring bring to rest, so it moves like every other input
  useEffect(() => {
    // it travels at least as far as the old fixed shove did, then parks on the home card
    const onSpin = () => { if (!popped) flingOnto(HOME_CARD, 10) }
    window.addEventListener('pj:spin', onSpin)
    return () => window.removeEventListener('pj:spin', onSpin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped])

  // wheel spins the arc (scoped to the pane, the page never scrolls here)
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    let acc = 0, quiet = 0, lock = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (popped) {
        // one notch, one card: a trackpad's long swipe still moves only once
        const now = performance.now()
        if (now - quiet > 220) acc = 0
        quiet = now
        if (now < lock) return
        acc += e.deltaY
        if (Math.abs(acc) > 28) { stepOpen(Math.sign(acc)); acc = 0; lock = now + 420 }
        return
      }
      nudge(e.deltaY * 0.055)
    }
    pane.addEventListener('wheel', onWheel, { passive: false })
    return () => { pane.removeEventListener('wheel', onWheel); stopMotion() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped])

  // vertical drag spins it too; a still click on a card focuses/pops it
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    const K = 1 / 260  // px of drag per card, the arc is big so it moves slowly under the hand
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.af-panel, a, .af-tab')) return
      let lastY = e.clientY
      let lastTime = performance.now()
      let moved = false
      const pid = e.pointerId
      const move = (ev: PointerEvent) => {
        if (!moved && Math.abs(ev.clientY - e.clientY) > 6) {
          moved = true
          try { pane.setPointerCapture(pid) } catch { /* no-op */ }
          stopMotion(); cancelAnimationFrame(snapRaf.current); aimRef.current = null; landRef.current = null; velRef.current = 0
        }
        if (!moved) return
        const now = performance.now()
        const dp = (ev.clientY - lastY) * K
        setPosBoth(posRef.current + dp)
        // velocity from the last movement, lightly smoothed
        velRef.current = velRef.current * 0.4 + (dp / Math.max(1, now - lastTime) * 1000) * 0.6
        lastY = ev.clientY; lastTime = now
      }
      const up = () => {
        pane.removeEventListener('pointermove', move)
        pane.removeEventListener('pointerup', up)
        pane.removeEventListener('pointercancel', up)
        try { pane.releasePointerCapture(pid) } catch { /* no-op */ }
        if (moved) startMotion()
      }
      pane.addEventListener('pointermove', move)
      pane.addEventListener('pointerup', up)
      pane.addEventListener('pointercancel', up)
    }
    pane.addEventListener('pointerdown', onDown)
    return () => pane.removeEventListener('pointerdown', onDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // card tilt: the card under the pointer leans toward it, a few degrees, and
  // levels when the pointer leaves. Written straight to the element, so it
  // costs nothing to React.
  useEffect(() => {
    const pane = paneRef.current
    if (!pane || reduced) return
    let cur: HTMLElement | null = null
    const level = () => { if (cur) { cur.style.removeProperty('--rx'); cur.style.removeProperty('--ry'); cur.style.removeProperty('--tz'); cur = null } }
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest('.af-card:not(.af-out)') as HTMLElement | null
      const lift = card?.querySelector('.af-lift') as HTMLElement | null
      if (lift !== cur) { level(); cur = lift }
      if (!card || !lift) return
      const r = card.getBoundingClientRect()
      const ox = (e.clientX - r.left) / r.width - 0.5, oy = (e.clientY - r.top) / r.height - 0.5
      lift.style.setProperty('--rx', `${(-oy * 5).toFixed(2)}deg`)
      lift.style.setProperty('--ry', `${(ox * 5).toFixed(2)}deg`)
      lift.style.setProperty('--tz', '8px')
    }
    pane.addEventListener('pointermove', onMove, { passive: true })
    pane.addEventListener('pointerleave', level)
    return () => { pane.removeEventListener('pointermove', onMove); pane.removeEventListener('pointerleave', level); level() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Idle drift: ten quiet seconds and the arc turns one notch on its own,
  // slowly, as a hint that it moves. Once per quiet stretch; any input cancels.
  // It waits for the first real input, so the opening rests on the home card.
  useEffect(() => {
    if (reduced) return
    let t = 0
    let touched = false
    const arm = () => {
      window.clearTimeout(t)
      if (softRef.current) { softRef.current = false; stopMotion(); startMotion() }
      t = window.setTimeout(() => {
        if (!touched || poppedRef.current || motionRaf.current || document.body.classList.contains('rl-open') || document.body.classList.contains('ps-open')) return arm()
        softRef.current = true
        aimRef.current = Math.round(posRef.current) + 1
        velRef.current = 0
        startMotion()
      }, 10000)
    }
    const onInput = () => { touched = true; arm() }
    const evs = ['pointermove', 'pointerdown', 'wheel', 'keydown'] as const
    evs.forEach(e => window.addEventListener(e, onInput, { passive: true }))
    arm()
    return () => { evs.forEach(e => window.removeEventListener(e, onInput)); window.clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // an open card closes on a click anywhere outside it and its panel (the cursor shows an X there)
  useEffect(() => {
    if (!popped) return
    const onClick = (e: MouseEvent) => {
      if (document.body.classList.contains('rl-open') || document.body.classList.contains('ps-open')) return
      const t = e.target as HTMLElement
      if (!t.closest('.sh-page') || t.closest('.af-out, .af-panel, .af-reels, .ug-arrow, a, button:not(.af-card)')) return
      e.preventDefault(); e.stopPropagation()
      setPopped(false)
    }
    // after this click finishes, so the click that opened the card doesn't close it
    const t = window.setTimeout(() => document.addEventListener('click', onClick, true), 0)
    return () => { window.clearTimeout(t); document.removeEventListener('click', onClick, true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped])

  // keyboard + escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopped(false)
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const dir = e.key === 'ArrowDown' ? 1 : -1
        if (poppedRef.current) { stepOpen(dir); return }
        aim(Math.round(posRef.current) + dir)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // With a card open, up and down swap it for its neighbour without closing:
  // the next card slides up out of the arc into the dock as this one goes home.
  const swapT = useRef(0)
  const stepOpen = (dir: number) => {
    const pane = paneRef.current
    stopMotion(); cancelAnimationFrame(snapRaf.current); aimRef.current = null; landRef.current = null; velRef.current = 0
    if (pane) {
      window.clearTimeout(swapT.current)
      pane.classList.remove('af-swap-up', 'af-swap-down'); void pane.offsetWidth
      pane.classList.add('af-anim', dir > 0 ? 'af-swap-down' : 'af-swap-up')
      swapT.current = window.setTimeout(() => pane.classList.remove('af-anim', 'af-swap-up', 'af-swap-down'), 720)
    }
    setPosBoth(Math.round(posRef.current) + dir)
  }

  const onCardClick = (i: number) => {
    const off = wrapOffset(i, Math.round(posRef.current), n)
    if (off === 0 && settled) {
      setPopped((p) => !p)
    } else {
      setPopped(false)
      aim(Math.round(posRef.current) + off)
    }
  }

  const activeCard = cards[active]
  const tabs = useMemo(() => tabsFor(activeCard), [activeCard])
  const [activeTab, setActiveTab] = useState('overview')
  // the on-page prototype: the pill's rect is where the window grows from
  const proto = protos[activeCard.id]
  const [stage, setStage] = useState<DOMRect | null>(null)
  const tryRef = useRef<HTMLButtonElement>(null)
  // reels open by zooming out of whatever launched them
  const [reels, setReels] = useState<{ start: number; from: DOMRect } | null>(null)
  const film = filmFor(activeCard.id)
  const openReels = (start: number, el: Element | null) => el && setReels({ start, from: el.getBoundingClientRect() })
  useEffect(() => setActiveTab('overview'), [active, popped])

  return (
    <div
      className={'af-pane' + (popped ? ' af-popped' : '')}
      ref={paneRef}
      role="listbox"
      aria-label="Projects"
    >
      <div
        className="af-arc"
        style={{
          right: -over,
          transformOrigin: `${-R}px 0px`,
          transform: `translateX(${popped ? shift : 0}px) scale(${S.toFixed(4)})`,
        }}
      >
        {cards.map((card, i) => {
          const off = wrapOffset(i, pos, n)
          const theta = off * STEP
          const isActive = i === active && settled
          const isPop = isActive && popped
          // 5 cards visible: neighbours full-ish, the outer pair faint and cut
          const absOff = Math.abs(off)
          const fade = absOff <= 1 ? 1 - 0.28 * absOff : Math.max(0, 0.72 - 0.4 * (absOff - 1))
          const hidden = fade <= 0.01
          // size falls off with distance from focus: 1 -> 0.62 -> 0.50
          const size = 1 - 0.42 * Math.min(absOff, 1) - 0.10 * Math.max(0, Math.min(absOff - 1, 1))
          return (
            <button
              key={card.id}
              className={
                'af-card' + (isActive ? ' af-active' : '') + (isPop ? ' af-out' : '')
              }
              style={{
                ['--di' as string]: `${i * 55}ms`,
                transform: isPop
                  ? `translateX(${Math.round(dockT)}px)`
                  : `rotate(${theta}deg) translateX(${-R}px) rotate(${-theta * TILT}deg) scale(${size.toFixed(3)})`,
                opacity: hidden ? 0 : fade,
                zIndex: isPop ? 300 : 100 - Math.round(Math.abs(theta)),
                pointerEvents: hidden ? 'none' : 'auto',
              }}
              onClick={() => onCardClick(i)}
              aria-selected={isActive}
              aria-label={card.title}
            >
              <span className="af-slide">
              <span className="af-lift" style={isPop ? { transform: `scale(${popLift.toFixed(3)})` } : undefined}>
                <span className="af-photo" style={isPop ? ({ viewTransitionName: 'case-hero' } as React.CSSProperties) : undefined}>
                  <CardArt card={card} />
                  {isActive && filmFor(card.id) && (
                    <video className="af-film" src={filmFor(card.id)!.loop} poster={filmFor(card.id)!.poster} muted loop autoPlay playsInline aria-hidden />
                  )}
                  {isActive && !filmFor(card.id) && hasPoster(card.id) && <MotionPoster id={card.id} />}
                </span>
                <span className="af-caption">
                  <span className="af-t" style={isPop ? ({ viewTransitionName: 'case-title' } as React.CSSProperties) : undefined}>{card.title}</span>
                  <span className="af-m">{card.meta}</span>
                </span>
              </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* switch-on-hover tabs for the pulled card */}
      <div className="af-panel" style={{ width: panelW, left: DOCK_PAD }} aria-hidden={!popped}>
        <div className="af-panel-kicker">{activeCard.when} · {activeCard.meta}</div>
        <h2 className="af-panel-title">{activeCard.title}</h2>
        <div className="af-tabs">
          {tabs.map((t, ti) => (
            <div
              key={t.id}
              className={'af-tab' + (activeTab === t.id ? ' on' : '')}
              style={{ '--i': ti } as React.CSSProperties}
            >
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
                {t.stack && <p className="af-stack"><span>Stack</span>{t.stack}</p>}
                {t.links && (
                  <div className="af-links">
                    {t.links.map((l) =>
                      l.internal ? (
                        <Link key={l.href} to={l.href} className="af-link" onClick={(e) => {
                          const d = document as Document & { startViewTransition?: (cb: () => void) => void }
                          if (!d.startViewTransition) return
                          e.preventDefault()
                          markArrival()
                          d.startViewTransition(() => { flushSync(() => navigate(l.href)) })
                        }}>
                          {l.label} <span className="arr">→</span>
                        </Link>
                      ) : (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="af-link" data-soon={l.soon || undefined}>
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
        {film && (
          <button className="af-watch" onClick={() => openReels(films.indexOf(film), document.querySelector('.af-card.af-out .af-photo'))}>
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden><path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor" /></svg>
            Watch the demo
          </button>
        )}
        {proto && (
          <button
            ref={tryRef}
            className={'af-try' + (stage ? ' ps-hidden' : '')}
            onClick={() => tryRef.current && setStage(tryRef.current.getBoundingClientRect())}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor" /></svg>
            Try it live
          </button>
        )}
        <button className="af-close" onClick={() => setPopped(false)} aria-label="Close details">
          close
        </button>
      </div>

      <button className="af-reels" onClick={e => openReels(0, e.currentTarget)} aria-label="Watch the product demos">
        <i><svg width="8" height="8" viewBox="0 0 12 12" aria-hidden><path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor" /></svg></i>
        Product Demos
      </button>
      {reels && <Reels start={reels.start} from={reels.from} onClose={() => setReels(null)} />}
      {stage && proto && (
        <ProtoStage url={proto.url} host={proto.host} title={activeCard.title} from={stage} onClose={() => setStage(null)} />
      )}
    </div>
  )
}
