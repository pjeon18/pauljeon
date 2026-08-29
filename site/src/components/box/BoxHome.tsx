import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { caseOrder, caseStudies, folders } from '../../content/site'
import BoxScene from './BoxScene'
import FolderCard from './FolderCard'

// ============================================================================
// BoxHome — the homepage: a small closed cardboard box in a white void.
// Click → the camera flies in on an arced path while the box squares up →
// the tape is cut, the flaps fold open in facing pairs, folders rise → the
// camera pushes in for browsing, where you can drag to look around. Each
// folder expands into a detail card.
//
// State machine:  far → approaching → opening → browsing ⇄ focused
//                  ↑←———————— closing ←————————↓
// The camera is a pose {x, z, yaw, elev} tweened between authored marks
// (FAR → ARRIVE → BROWSE) by a time-based rAF loop writing straight to refs —
// zero React renders per frame. Flap/folder choreography is CSS transitions
// keyed off the state classes.
// ============================================================================

type BoxState = 'far' | 'approaching' | 'opening' | 'browsing' | 'focused' | 'closing'
type Cam = { x: number; z: number; yaw: number; elev: number }

const easeInOutQuint = (x: number) => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2)
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = () => window.matchMedia('(max-width: 720px)').matches
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// authored camera marks
const cams = () => ({
  FAR: { x: 0, z: mobile() ? -6600 : -10500, yaw: -38, elev: -9 } as Cam,
  ARRIVE: { x: 0, z: mobile() ? -240 : -300, yaw: 0, elev: -20 } as Cam,
  BROWSE: { x: 0, z: mobile() ? -90 : -40, yaw: 0, elev: -18 } as Cam,
})

const times = () => ({
  approachMs: mobile() ? 2700 : 3700,
  dwellMs: 950, // arrived: a beat to read the box before it opens
  flapsMs: 2650, // opening → browsing (tape cut + flap pairs + folder settle)
  pushMs: 1100, // browsing: ease closer once the box has opened
  packMs: 1500, // closing: folders sink + flaps shut before the dolly-out
  departMs: 1500,
})

const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({
  x: a.x + (b.x - a.x) * p,
  z: a.z + (b.z - a.z) * p,
  yaw: a.yaw + (b.yaw - a.yaw) * p,
  elev: a.elev + (b.elev - a.elev) * p,
})

// the approach arc: lateral drift + a touch of extra yaw and pitch mid-flight,
// all returning to zero at the end — a crane move instead of a straight dolly
const swing = (p: number, c: Cam): Cam => {
  const s = Math.sin(p * Math.PI)
  return { ...c, x: c.x - 130 * s, yaw: c.yaw - 5 * s, elev: c.elev - 3.5 * s }
}

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    })
    const tick = () => setTime(fmt.format(new Date()) + ' EST')
    tick()
    const iv = setInterval(tick, 15000)
    return () => clearInterval(iv)
  }, [])
  return time
}

export default function BoxHome() {
  const [sp, setSp] = useSearchParams()
  const [state, setState] = useState<BoxState>(() => (sp.get('folder') ? 'browsing' : 'far'))
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const stageRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({})
  const camRef = useRef<Cam>(cams().FAR)
  const rafRef = useRef(0)
  const timersRef = useRef<number[]>([])
  const dwellRef = useRef<number | null>(null)
  const skipRef = useRef(false)
  const dragEndRef = useRef(0)
  const time = useClock()

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }

  const applyCam = (c: Cam) => {
    camRef.current = c
    const w = worldRef.current
    const r = rigRef.current
    if (!w || !r) return
    w.style.transform = `translateX(${c.x.toFixed(1)}px) translateZ(${c.z.toFixed(1)}px) rotateX(${c.elev.toFixed(2)}deg)`
    r.style.transform = `rotateY(${c.yaw.toFixed(2)}deg)`
  }

  const tweenCam = (
    to: Cam,
    ms: number,
    ease: (x: number) => number,
    path?: (p: number, c: Cam) => Cam,
    done?: () => void,
  ) => {
    cancelAnimationFrame(rafRef.current)
    const from = { ...camRef.current }
    const t0 = performance.now()
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      applyCam(to)
      done?.()
    }
    const step = (now: number) => {
      if (finished) return
      let p = Math.min(1, (now - t0) / ms)
      if (skipRef.current) {
        p = 1
        skipRef.current = false
      }
      if (p >= 1) {
        finish()
        return
      }
      const pe = ease(p)
      applyCam(path ? path(pe, lerpCam(from, to, pe)) : lerpCam(from, to, pe))
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    // rAF can be suspended (hidden/throttled tab) — never strand the machine
    later(finish, ms + 400)
  }

  // initial pose before first paint; cleanup on unmount
  useLayoutEffect(() => {
    applyCam(stateRef.current === 'far' ? cams().FAR : cams().BROWSE)
    return () => {
      cancelAnimationFrame(rafRef.current)
      timersRef.current.forEach(clearTimeout)
      if (dwellRef.current !== null) clearTimeout(dwellRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.title = 'Paul Jeon — Product & Engineering'
  }, [])

  // deep link: /?folder=iso skips the cinematic and opens the card
  useEffect(() => {
    const id = sp.get('folder')
    if (id && stateRef.current === 'browsing' && !focusedId && folders.some((f) => f.id === id)) {
      later(() => {
        setFocusedId(id)
        setState('focused')
      }, 350)
    }
    // browser Back while a card is open → the param disappears → close
    if (!id && stateRef.current === 'focused') {
      setFocusedId(null)
      setState('browsing')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])

  const beginOpening = () => {
    setState('opening')
    later(() => {
      setState('browsing')
      // once the flaps have landed and the folders settled, ease in closer
      if (reduced()) applyCam(cams().BROWSE)
      else tweenCam(cams().BROWSE, times().pushMs, easeInOutCubic)
    }, times().flapsMs)
  }

  const approach = () => {
    const s = stateRef.current
    if (s === 'approaching') {
      if (dwellRef.current !== null) {
        // click during the reading beat = open now
        clearTimeout(dwellRef.current)
        dwellRef.current = null
        beginOpening()
      } else {
        skipRef.current = true // click during the flight = skip ahead
      }
      return
    }
    if (s !== 'far') return
    if (reduced()) {
      applyCam(cams().BROWSE)
      setState('browsing')
      return
    }
    setState('approaching')
    tweenCam(cams().ARRIVE, times().approachMs, easeInOutQuint, swing, () => {
      dwellRef.current = window.setTimeout(() => {
        dwellRef.current = null
        beginOpening()
      }, times().dwellMs)
    })
  }

  const closeBox = () => {
    if (stateRef.current !== 'browsing') return
    if (reduced()) {
      applyCam(cams().FAR)
      setState('far')
      return
    }
    setState('closing')
    later(() => tweenCam(cams().FAR, times().departMs, easeInOutQuint, undefined, () => setState('far')), times().packMs)
  }

  const openFolder = (id: string) => {
    if (stateRef.current !== 'browsing') return
    if (performance.now() - dragEndRef.current < 200) return // that click was an orbit drag
    setFocusedId(id)
    setState('focused')
    setSp({ folder: id })
  }

  const onCardClosed = () => {
    const id = focusedId
    setFocusedId(null)
    setState('browsing')
    // replace (never navigate(-1)) — popping can land on an older ?folder=
    // entry and resurrect a different card
    if (sp.get('folder')) setSp({}, { replace: true })
    if (id) tabsRef.current[id]?.focus()
  }

  const registerTab = (id: string, el: HTMLButtonElement | null) => {
    tabsRef.current[id] = el
  }

  // free-look: drag to orbit while browsing. A still click stays a click —
  // pointer capture is only taken once the drag threshold is crossed, which
  // also retargets the pointer stream away from the folder buttons.
  useEffect(() => {
    if (state !== 'browsing') return
    const stage = stageRef.current
    if (!stage) return
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      let lastX = e.clientX
      let lastY = e.clientY
      let moved = false
      const pid = e.pointerId
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - lastX
        const dy = ev.clientY - lastY
        if (!moved && Math.abs(ev.clientX - e.clientX) + Math.abs(ev.clientY - e.clientY) > 5) {
          moved = true
          try { stage.setPointerCapture(pid) } catch { /* no-op */ }
          stage.classList.add('bx-dragging')
        }
        if (!moved) return
        ev.preventDefault()
        lastX = ev.clientX
        lastY = ev.clientY
        const c = camRef.current
        applyCam({
          ...c,
          yaw: clamp(c.yaw + dx * 0.22, -32, 32),
          // keep enough look-down that the tabs never vanish behind the rim
          elev: clamp(c.elev - dy * 0.12, -32, -12),
        })
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
        stage.classList.remove('bx-dragging')
        try { stage.releasePointerCapture(pid) } catch { /* no-op */ }
        if (moved) dragEndRef.current = performance.now()
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    }
    stage.addEventListener('pointerdown', onDown)
    return () => stage.removeEventListener('pointerdown', onDown)
  }, [state])

  const isOpen = state === 'opening' || state === 'browsing' || state === 'focused'
  const focused = focusedId ? folders.find((f) => f.id === focusedId) ?? null : null

  return (
    <div className={`bx-home is-${state}${isOpen ? ' is-open' : ''}`}>
      <header className="bx-chrome">
        <span className="bx-logo">Paul Jeon</span>
        <span className="bx-time">{time}</span>
      </header>

      <main className="bx-stage" ref={stageRef} aria-label="A cardboard box holding Paul Jeon's work">
        <BoxScene
          worldRef={worldRef}
          rigRef={rigRef}
          open={isOpen}
          browsing={state === 'browsing'}
          focusedId={focusedId}
          registerTab={registerTab}
          onOpenFolder={openFolder}
        />

        {(state === 'far' || state === 'approaching') && (
          <button className="bx-open-btn" onClick={approach} aria-label="Open the box — browse Paul Jeon's work" />
        )}

        <button className="bx-closebox" onClick={closeBox} hidden={state !== 'browsing'}>
          close the box
        </button>
      </main>

      <div className="bx-vh" aria-live="polite">
        {state === 'browsing' ? `Box open. ${folders.length} folders inside. Drag to look around.` : ''}
      </div>

      {/* flat index for crawlers and screen-reader link lists */}
      <nav className="bx-vh" aria-label="All work">
        <ul>
          {caseOrder.map((slug) => (
            <li key={slug}>
              <Link to={`/work/${slug}`}>{caseStudies[slug].title}</Link>
            </li>
          ))}
          <li><Link to="/impostor">Play Impostor</Link></li>
          <li><Link to="/human-inventory">The Human Inventory</Link></li>
          <li><a href={`${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`}>Résumé (PDF)</a></li>
        </ul>
      </nav>

      {focused && (
        <FolderCard
          key={focused.id}
          folder={focused}
          originEl={tabsRef.current[focused.id] ?? null}
          onClosed={onCardClosed}
        />
      )}
    </div>
  )
}
