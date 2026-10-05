import { useLayoutEffect, useRef } from 'react'

// ============================================================================
// SplashDrop — the boot loader. A drop forms at the top edge, swells, necks
// and lets go; it falls under real gravity, stretching with speed, and lands
// on a surface you only see through its ripples. The landing throws a crown of
// droplets and a small rebound jet, and the impact point opens into a hole
// with a liquid edge that wobbles as it grows. The site is revealed through
// the splash. Everything is written straight to the DOM inside one rAF.
// ============================================================================

const N_DROPLETS = 11
const RIM = 72                       // points around the hole's edge

export default function SplashDrop({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const fxRef = useRef<SVGSVGElement>(null)
  const holeRef = useRef<SVGPathElement>(null)
  const rimRef = useRef<SVGPathElement>(null)
  const dropRef = useRef<SVGEllipseElement>(null)
  const neckRef = useRef<SVGPathElement>(null)
  const jetRef = useRef<SVGEllipseElement>(null)
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([])
  const partRefs = useRef<(SVGEllipseElement | null)[]>([])

  useLayoutEffect(() => {
    const svg = svgRef.current, hole = holeRef.current, rim = rimRef.current, drop = dropRef.current, neck = neckRef.current, jet = jetRef.current
    if (!svg || !hole || !rim || !drop || !neck || !jet) return
    const vw = window.innerWidth, vh = window.innerHeight
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    fxRef.current?.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    const ix = vw / 2, iy = vh * 0.8
    const R0 = 15                                   // the drop's radius
    const far = Math.max(Math.hypot(ix, iy), Math.hypot(vw - ix, iy), Math.hypot(ix, vh - iy), Math.hypot(vw - ix, vh - iy)) + 80

    // timeline, seconds
    const FORM = 0.62                               // swelling at the top edge
    const T = 0.82                                  // the fall
    const g = (2 * (iy - R0)) / (T * T)
    const SQUASH = 0.11, REVEAL = 0.95

    let revealed = false, finished = false
    const reveal = () => { if (!revealed) { revealed = true; onReveal() } }
    const finish = () => { if (!finished) { finished = true; reveal(); onDone() } }

    // the crown: droplets thrown up and out, bigger near the middle
    const parts = Array.from({ length: N_DROPLETS }, (_, k) => {
      const u = k / (N_DROPLETS - 1), a = -Math.PI + u * Math.PI
      const sp = 300 + Math.sin(u * Math.PI) * 520 + Math.random() * 160
      return { vx: Math.cos(a) * sp * 0.9, vy: -Math.abs(Math.sin(a)) * sp - 180, s: 2.5 + Math.sin(u * Math.PI) * 4 + Math.random() * 1.5 }
    })
    // the hole's edge: a few low harmonics that ring down as it opens
    const harm = [3, 5, 7, 11].map((n, i) => ({ n, ph: Math.random() * Math.PI * 2, amp: [0.035, 0.022, 0.014, 0.007][i] }))
    const edge = (r: number, t: number) => {
      if (r <= 0) return ''
      const ring = Math.exp(-t * 4.2)
      let d = ''
      for (let i = 0; i <= RIM; i++) {
        const a = (i / RIM) * Math.PI * 2
        let k = 1
        for (const h of harm) k += h.amp * ring * Math.sin(h.n * a + h.ph + t * (6 + h.n))
        d += (i ? 'L' : 'M') + (ix + Math.cos(a) * r * k).toFixed(1) + ' ' + (iy + Math.sin(a) * r * k).toFixed(1)
      }
      return d + 'Z'
    }
    const frameRect = `M0 0H${vw}V${vh}H0Z`

    hole.setAttribute('d', frameRect)            // cover the page before the first paint
    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const t = (now - t0) / 1000

      if (t < FORM) {
        // -------- forming: a bead swells at the top and hangs from a neck --------
        const u = t / FORM
        const r = R0 * (0.25 + 0.75 * (1 - Math.pow(1 - u, 2)))
        const sag = u * u * 26                          // gravity pulls it down as it grows
        const wob = Math.sin(t * 22) * 0.06 * (1 - u)
        drop.setAttribute('cx', String(ix)); drop.setAttribute('cy', String(sag + r))
        drop.setAttribute('rx', String(r * (1 + wob))); drop.setAttribute('ry', String(r * (1 - wob + u * 0.12)))
        const nw = r * (1.4 - u * 0.9)                   // the neck thins until it snaps
        neck.setAttribute('d', `M${ix - nw} 0 Q${ix} ${sag * 0.7} ${ix - r * 0.55} ${sag + r * 0.5} L${ix + r * 0.55} ${sag + r * 0.5} Q${ix} ${sag * 0.7} ${ix + nw} 0Z`)
        neck.style.opacity = String(1 - u * 0.4)
        hole.setAttribute('d', frameRect)
        raf = requestAnimationFrame(frame)
        return
      }
      neck.style.opacity = '0'
      const tf = t - FORM

      if (tf < T) {
        // -------- falling: y = y0 + ½gt², stretch with speed --------
        const y = 26 + R0 + 0.5 * g * tf * tf
        const v = g * tf
        const st = Math.min(v / 2600, 0.5)
        const snap = Math.exp(-tf * 14) * 0.25           // a recoil from the neck letting go
        drop.setAttribute('cx', String(ix)); drop.setAttribute('cy', String(y))
        drop.setAttribute('rx', String(R0 * (1 - st * 0.32 + snap))); drop.setAttribute('ry', String(R0 * (1 + st - snap)))
        raf = requestAnimationFrame(frame)
        return
      }

      const ti = tf - T
      reveal()                                          // the site starts dealing in behind the splash

      // -------- impact: flatten, then gone --------
      if (ti < SQUASH) {
        const p = ti / SQUASH
        drop.setAttribute('cy', String(iy + R0 * 0.4 * p))
        drop.setAttribute('rx', String(R0 * (1 + p * 1.9))); drop.setAttribute('ry', String(R0 * (1 - p * 0.75)))
        drop.style.opacity = '1'
      } else drop.style.opacity = '0'

      // -------- the rebound jet: a small column that rises and falls back --------
      const tj = ti - 0.07
      if (tj > 0 && tj < 0.55) {
        const jy = iy - (420 * tj - 0.5 * 1800 * tj * tj)
        const life = 1 - tj / 0.55
        jet.style.opacity = String(Math.min(1, tj * 20) * life)
        jet.setAttribute('cx', String(ix)); jet.setAttribute('cy', String(Math.min(iy, jy)))
        jet.setAttribute('rx', String(5 * life + 1.5)); jet.setAttribute('ry', String(9 * life + 2))
      } else jet.style.opacity = '0'

      // -------- the crown --------
      parts.forEach((pt, k) => {
        const el = partRefs.current[k]
        if (!el) return
        const px = ix + pt.vx * ti, py = iy + pt.vy * ti + 0.5 * 2600 * ti * ti
        const life = Math.max(0, 1 - ti / 0.8)
        const vy = pt.vy + 2600 * ti, ang = Math.atan2(vy, pt.vx) * 180 / Math.PI
        el.setAttribute('cx', String(px)); el.setAttribute('cy', String(py))
        el.setAttribute('rx', String(pt.s * life * 1.6)); el.setAttribute('ry', String(pt.s * life))
        el.setAttribute('transform', `rotate(${ang} ${px} ${py})`)
        el.style.opacity = String(py > iy + 4 ? 0 : life)
      })

      // -------- ripples on the surface: flattened, so the floor reads as a plane --------
      ;[[0, 0.62, 150], [0.12, 0.8, 250], [0.26, 0.95, 360]].forEach(([delay, dur, rmax], k) => {
        const el = ringRefs.current[k]
        if (!el) return
        const tr = (ti - delay) / dur
        if (tr <= 0 || tr >= 1) { el.style.opacity = '0'; return }
        const e = 1 - Math.pow(1 - tr, 3)
        el.setAttribute('cx', String(ix)); el.setAttribute('cy', String(iy))
        el.setAttribute('rx', String(10 + e * rmax)); el.setAttribute('ry', String((10 + e * rmax) * 0.26))
        el.style.opacity = String(0.8 * (1 - tr))
      })

      // -------- the hole opens with a liquid edge --------
      const tv = Math.max(0, Math.min(1, (ti - 0.06) / REVEAL))
      const er = 1 - Math.pow(1 - tv, 3.4)
      const r = 10 + er * far
      const d = edge(r, ti)
      hole.setAttribute('d', frameRect + d)
      rim.setAttribute('d', d)
      rim.style.opacity = String(0.5 * (1 - tv))

      if (ti > REVEAL + 0.3) { finish(); return }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    // never strand the page if rAF is throttled (hidden tab)
    const failsafe = window.setTimeout(finish, 4200)
    return () => { cancelAnimationFrame(raf); clearTimeout(failsafe) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <div className="dl-overlay" aria-hidden="true">
      <svg ref={svgRef} className="dl-svg" preserveAspectRatio="none">
        <path ref={holeRef} className="dl-dark" fillRule="evenodd" />
        <path ref={rimRef} className="dl-rim" />
      </svg>
    </div>
    <div className="dl-overlay dl-fx" aria-hidden="true">
      <svg ref={fxRef} className="dl-svg" preserveAspectRatio="none">
        {[0, 1, 2].map((k) => <ellipse key={k} ref={(el) => { ringRefs.current[k] = el }} className="dl-ring" />)}
        <path ref={neckRef} className="dl-ink" />
        <ellipse ref={dropRef} className="dl-ink" />
        <ellipse ref={jetRef} className="dl-ink" />
        {Array.from({ length: N_DROPLETS }, (_, k) => <ellipse key={k} ref={(el) => { partRefs.current[k] = el }} className="dl-ink" />)}
      </svg>
    </div>
    </>
  )
}
