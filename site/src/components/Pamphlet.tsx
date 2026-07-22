import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import outside from '../assets/pam-outside.jpg'
import inside from '../assets/pam-inside.jpg'
import Footer from './Footer'

// ============================================================================
// The Human Inventory — interactive tri-fold pamphlet in CSS 3D.
//
// The sheet is three hinged panels (P0 left, P1 middle, P2 right). Folding is
// a Z / accordion: P0 swings FORWARD over the middle, P2 swings BACK behind
// it, so from above the paper reads as a Z and the closed pamphlet is exactly
// one panel (1/3) wide. Fully closed, the outside sheet's right third (the
// title cover) faces the viewer and its left third (the series blurb) faces
// away, matching the printed piece.
//
// Face mapping: panel i shows inside-slice i on its front and outside-slice
// (2-i) on its back — that's real print imposition, and it makes both the
// open inside spread and the walk-around outside spread read correctly.
// One theatrical cheat: a physical Z-fold would leave an inside panel on the
// closed back, so P2's faces swap textures at the fold's midpoint — the
// moment the panel is exactly edge-on and the swap is invisible — so the
// closed back shows the blurb panel, the way the piece was designed to read.
// ============================================================================

const PW = 300 // panel width (sheet is 3 panels wide)
const PH = 695 // panel height — sheet aspect 2000x1545

function Face({
  img,
  slice,
  back,
  mirrored,
}: {
  img: string
  slice: number
  back?: boolean
  mirrored?: boolean
}) {
  return (
    <div className={'pam-face' + (back ? ' pam-face-back' : '')}>
      <div
        className="pam-ink"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: '300% 100%',
          backgroundPosition: `${slice * 50}% 0`,
          transform: mirrored ? 'scaleX(-1)' : undefined,
        }}
      />
    </div>
  )
}

export default function Pamphlet() {
  const [fold, setFold] = useState(1) // rendered fold, 0 open — 1 closed
  const [target, setTarget] = useState(1)
  const [orbit, setOrbit] = useState({ yaw: -24, pitch: -6 })
  const stageRef = useRef<HTMLDivElement>(null)
  const foldRef = useRef(fold)
  foldRef.current = fold

  useEffect(() => {
    document.title = 'The Human Inventory — Paul Jeon'
    window.scrollTo(0, 0)
  }, [])

  // ease the fold toward its target
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFold(target)
      return
    }
    let raf = 0
    const step = () => {
      const f = foldRef.current
      const d = target - f
      if (Math.abs(d) < 0.002) {
        setFold(target)
        return
      }
      setFold(f + d * 0.085)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  // drag to orbit; a still click toggles the fold
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.pam-controls')) return
      e.preventDefault()
      let lastX = e.clientX
      let lastY = e.clientY
      let moved = false
      try { stage.setPointerCapture(e.pointerId) } catch { /* no-op */ }

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - lastX
        const dy = ev.clientY - lastY
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true
        lastX = ev.clientX
        lastY = ev.clientY
        setOrbit((o) => ({
          yaw: o.yaw + dx * 0.45,
          pitch: Math.max(-75, Math.min(75, o.pitch - dy * 0.35)),
        }))
      }
      const up = () => {
        try { stage.releasePointerCapture(e.pointerId) } catch { /* no-op */ }
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerup', up)
        stage.removeEventListener('pointercancel', up)
        if (!moved) setTarget((t) => (t > 0.5 ? 0 : 1))
      }
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerup', up)
      stage.addEventListener('pointercancel', up)
    }
    stage.addEventListener('pointerdown', onDown)
    return () => stage.removeEventListener('pointerdown', onDown)
  }, [])

  const a = fold * 180
  const cheat = fold >= 0.5 // P2 face swap at the edge-on moment

  return (
    <div className="pam-page">
      <nav className="case-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← All work</Link>
      </nav>

      <header className="pam-head">
        <div className="case-kicker">EAFM 124 · A Film Series</div>
        <h1>The Human Inventory.</h1>
        <p className="pam-lead">
          The body as capital in Korean cinema — six films, one pamphlet. This is the real
          print piece: drag it around, tap it (or scrub the slider) to unfold.
        </p>
      </header>

      <div className="pam-stage" ref={stageRef}>
        <div className="pam-scene">
          <div
            className="pam-orbit"
            style={{ transform: `rotateX(${orbit.pitch}deg) rotateY(${orbit.yaw}deg)` }}
          >
            <div className="pam-sheet" style={{ width: PW * 3, height: PH }}>
              {/* P0 — folds forward over the middle */}
              <div
                className="pam-panel"
                style={{
                  left: 0,
                  width: PW,
                  height: PH,
                  transformOrigin: '100% 50%',
                  transform: `rotateY(${a}deg) translateZ(${-2.5 * fold}px)`,
                }}
              >
                <Face img={inside} slice={0} />
                <Face img={outside} slice={2} back />
              </div>
              {/* P1 — the anchor panel */}
              <div className="pam-panel" style={{ left: PW, width: PW, height: PH }}>
                <Face img={inside} slice={1} />
                <Face img={outside} slice={1} back />
              </div>
              {/* P2 — folds back behind the middle */}
              <div
                className="pam-panel"
                style={{
                  left: PW * 2,
                  width: PW,
                  height: PH,
                  transformOrigin: '0% 50%',
                  transform: `rotateY(${a}deg) translateZ(${2.5 * fold}px)`,
                }}
              >
                {cheat ? (
                  <>
                    <Face img={outside} slice={0} mirrored />
                    <Face img={inside} slice={2} back mirrored />
                  </>
                ) : (
                  <>
                    <Face img={inside} slice={2} />
                    <Face img={outside} slice={0} back />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pam-shadow" style={{ width: PW * (1 + 2 * (1 - fold)) * 0.9 }} />
      </div>

      <div className="pam-controls">
        <button className="pam-btn" onClick={() => setTarget(target > 0.5 ? 0 : 1)}>
          {target > 0.5 ? 'Unfold' : 'Fold it back'}
        </button>
        <input
          className="pam-slider"
          type="range"
          min={0}
          max={100}
          value={Math.round((1 - fold) * 100)}
          onChange={(e) => {
            const v = 1 - Number(e.target.value) / 100
            setTarget(v)
            setFold(v)
          }}
          aria-label="Fold amount"
        />
        <span className="pam-hint">drag to orbit · tap to open</span>
      </div>

      <Footer />
    </div>
  )
}
