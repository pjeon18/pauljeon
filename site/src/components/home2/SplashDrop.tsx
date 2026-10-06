import { useLayoutEffect, useRef } from 'react'

// ============================================================================
// SplashDrop — the boot loader. A drop forms at the top edge and lets go. It
// falls under gravity, hits the bottom of the screen, and the bounce carries
// it in an arc onto the period of "Hi, I'm Paul." (which the trailer frames
// large in the middle of the screen). It lands there, and the page opens
// around it, so the falling drop becomes the period. Everything is written
// straight to the DOM inside one rAF.
// ============================================================================

interface Pt { x: number; y: number; r: number }

/** where the period will be on screen when the page opens */
function periodTarget(vw: number, vh: number): Pt {
  const gd = document.querySelector<HTMLElement>('.guide-dot')
  // the trailer frames the guide dot on the period; without it, aim for the period itself
  if (gd && document.body.classList.contains('guide-trailer')) {
    const r = gd.getBoundingClientRect()
    if (r.width > 2 && getComputedStyle(gd).display !== 'none') return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 }
  }
  const per = document.querySelector<HTMLElement>('.sh-period'), bl = document.querySelector<HTMLElement>('.sh-bl')
  if (per && bl) {
    const pr = per.getBoundingClientRect(), br = bl.getBoundingClientRect(), fs = parseFloat(getComputedStyle(per).fontSize) || 60
    const r = fs * 0.09
    return { x: pr.left + pr.width * 0.42, y: br.top - r * 1.05, r }
  }
  return { x: vw / 2, y: vh / 2, r: 8 }
}

export default function SplashDrop({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const holeRef = useRef<SVGPathElement>(null)
  const dropRef = useRef<SVGEllipseElement>(null)
  const neckRef = useRef<SVGPathElement>(null)
  const ringRef = useRef<SVGEllipseElement>(null)

  useLayoutEffect(() => {
    const svg = svgRef.current, hole = holeRef.current, drop = dropRef.current, neck = neckRef.current, ring = ringRef.current
    if (!svg || !hole || !drop || !neck || !ring) return
    // the overlay's own box, not innerWidth: on phones that can still be the 980px layout width here
    const box = svg.getBoundingClientRect()
    const vw = box.width || window.innerWidth, vh = box.height || window.innerHeight
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    const frameRect = `M0 0H${vw}V${vh}H0Z`
    hole.setAttribute('d', frameRect)              // cover the page before the first paint

    const R0 = 15                                   // the drop's radius
    const FORM = 0.55                               // swelling at the top edge
    const T = 0.78                                  // the fall to the bottom
    const floor = vh - R0
    const g = (2 * (floor - 26 - R0)) / (T * T)
    const SQUASH = 0.09, LAND = 0.1, REVEAL = 0.9

    // where it falls: a little to the side of the period, so the bounce has somewhere to carry it
    let tgt = periodTarget(vw, vh)
    const ix = Math.min(vw - 60, Math.max(60, tgt.x + Math.min(240, vw * 0.16)))

    // the bounce: a ballistic arc from the floor that comes down onto the period
    let arc: { vx: number; vy: number; T: number } | null = null
    const planArc = () => {
      tgt = periodTarget(vw, vh)                    // measured late, once the trailer has framed it
      const apex = Math.min(tgt.y, floor) - Math.max(60, vh * 0.12)
      const vy = -Math.sqrt(2 * g * (floor - apex))
      const t2 = (-vy + Math.sqrt(vy * vy + 2 * g * (tgt.y - floor))) / g
      arc = { vx: (tgt.x - ix) / t2, vy, T: t2 }
    }

    let revealed = false, finished = false
    const reveal = () => { if (!revealed) { revealed = true; onReveal() } }
    const finish = () => { if (!finished) { finished = true; reveal(); onDone() } }
    const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const t = (now - t0) / 1000

      if (t < FORM) {
        // -------- forming: a bead swells at the top and hangs from a neck --------
        const u = t / FORM
        const r = R0 * (0.25 + 0.75 * (1 - Math.pow(1 - u, 2)))
        const sag = u * u * 26
        drop.setAttribute('cx', String(ix)); drop.setAttribute('cy', String(sag + r))
        drop.setAttribute('rx', String(r)); drop.setAttribute('ry', String(r * (1 + u * 0.12)))
        const nw = r * (1.4 - u * 0.9)
        neck.setAttribute('d', `M${ix - nw} 0 Q${ix} ${sag * 0.7} ${ix - r * 0.55} ${sag + r * 0.5} L${ix + r * 0.55} ${sag + r * 0.5} Q${ix} ${sag * 0.7} ${ix + nw} 0Z`)
        neck.style.opacity = String(1 - u * 0.4)
        raf = requestAnimationFrame(frame)
        return
      }
      neck.style.opacity = '0'
      const tf = t - FORM

      if (tf < T) {
        // -------- the fall, stretching with speed --------
        const y = 26 + R0 + 0.5 * g * tf * tf
        const st = Math.min((g * tf) / 2600, 0.5), snap = Math.exp(-tf * 14) * 0.25
        drop.setAttribute('cx', String(ix)); drop.setAttribute('cy', String(Math.min(y, floor)))
        drop.setAttribute('rx', String(R0 * (1 - st * 0.32 + snap))); drop.setAttribute('ry', String(R0 * (1 + st - snap)))
        drop.removeAttribute('transform')
        raf = requestAnimationFrame(frame)
        return
      }

      const tb = tf - T
      if (tb < SQUASH) {
        // -------- it hits the bottom: flatten, one soft ring --------
        const p = Math.sin((tb / SQUASH) * Math.PI)
        drop.setAttribute('cy', String(floor + R0 * 0.35 * p))
        drop.setAttribute('rx', String(R0 * (1 + 0.7 * p))); drop.setAttribute('ry', String(R0 * (1 - 0.4 * p)))
        if (!arc) planArc()
      }
      const e = Math.min(1, tb / 0.6)
      ring.setAttribute('cx', String(ix)); ring.setAttribute('cy', String(vh - 2))
      ring.setAttribute('rx', String(12 + (1 - Math.pow(1 - e, 3)) * 120)); ring.setAttribute('ry', String(4 + (1 - Math.pow(1 - e, 3)) * 18))
      ring.style.opacity = String(0.55 * (1 - e))
      if (tb < SQUASH) { raf = requestAnimationFrame(frame); return }

      if (!arc) planArc()
      const A = arc!
      const ta = tb - SQUASH
      if (ta < A.T) {
        // -------- the bounce carries it onto the period, growing to its size --------
        const x = ix + A.vx * ta, y = floor + A.vy * ta + 0.5 * g * ta * ta
        const vy = A.vy + g * ta, sp = Math.hypot(A.vx, vy)
        const k = ta / A.T, r = R0 + (tgt.r - R0) * (k * k * (3 - 2 * k))
        const st = Math.min(sp / 3200, 0.4), ang = Math.atan2(vy, A.vx) * 180 / Math.PI
        drop.setAttribute('cx', String(x)); drop.setAttribute('cy', String(y))
        drop.setAttribute('rx', String(r * (1 + st))); drop.setAttribute('ry', String(r * (1 - st * 0.45)))
        drop.setAttribute('transform', `rotate(${ang} ${x} ${y})`)
        raf = requestAnimationFrame(frame)
        return
      }

      const tl = ta - A.T
      if (tl < LAND) {
        // -------- it lands on the period --------
        const p = Math.sin((tl / LAND) * Math.PI)
        drop.removeAttribute('transform')
        drop.setAttribute('cx', String(tgt.x)); drop.setAttribute('cy', String(tgt.y + tgt.r * 0.2 * p))
        drop.setAttribute('rx', String(tgt.r * (1 + 0.3 * p))); drop.setAttribute('ry', String(tgt.r * (1 - 0.22 * p)))
        raf = requestAnimationFrame(frame)
        return
      }

      // -------- the page opens around it, and the drop is the period --------
      // it turns to ink as the page opens and holds as the period until the
      // real one has arrived underneath, then lets go
      reveal()
      const tr = tl - LAND
      drop.style.fill = '#121110'
      drop.setAttribute('cx', String(tgt.x)); drop.setAttribute('cy', String(tgt.y))
      drop.setAttribute('rx', String(tgt.r)); drop.setAttribute('ry', String(tgt.r))
      drop.style.opacity = String(tr < 0.8 ? 1 : Math.max(0, 1 - (tr - 0.8) / 0.2))
      const tv = Math.min(1, tr / REVEAL)
      const far = Math.max(Math.hypot(tgt.x, tgt.y), Math.hypot(vw - tgt.x, tgt.y), Math.hypot(tgt.x, vh - tgt.y), Math.hypot(vw - tgt.x, vh - tgt.y)) + 40
      const r = tgt.r * 1.25 + (1 - Math.pow(1 - tv, 3)) * far
      hole.setAttribute('d', frameRect + circle(tgt.x, tgt.y, r))
      if (tv >= 1 && tr >= 1) { finish(); return }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    // never strand the page if rAF is throttled (hidden tab)
    const failsafe = window.setTimeout(finish, 5000)
    return () => { cancelAnimationFrame(raf); clearTimeout(failsafe) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="dl-overlay" aria-hidden="true">
      <svg ref={svgRef} className="dl-svg" preserveAspectRatio="none">
        <path ref={holeRef} className="dl-dark" fillRule="evenodd" />
        <ellipse ref={ringRef} className="dl-ring" />
        <path ref={neckRef} className="dl-ink" />
        <ellipse ref={dropRef} className="dl-ink" />
      </svg>
    </div>
  )
}
