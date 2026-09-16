import { useEffect, useRef } from 'react'

// ============================================================================
// GuideDot — the period in "Hi, I'm Paul." leaves the sentence and walks a
// first-time visitor around the page, then settles back as punctuation.
//
// Two things make it read as alive rather than tweened. Transits blend a
// quintic in-out with a slice of linear, so they burst through the middle and
// still carry residual velocity at both ends: the dot slows but never stops.
// The circles are driven by gravity rather than a time curve, integrated once
// at build time, so the path stays a true circle and only the speed varies.
//
// Position is written straight to the element inside a rAF. Nothing here goes
// through React state, so a tour costs no re-renders.
// ============================================================================

const RED = '#E02B1D'
const INK = '#121110'
const DOT = 13 // must match .guide-dot in home2.css

// ---------------------------------------------------------------- easing
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2)
const LIN = (t: number) => t

// a quintic in-out peaks near 5x its average speed, which is where the zip
// comes from. The linear share leaves the ends drifting instead of stopping.
const DRIFT = 0.13
const transit = (t: number) => (1 - DRIFT) * easeInOutQuint(t) + DRIFT * t
// the launch accelerates hard, and still leaves the folder already moving
const launch = (t: number) => 0.1 * t + 0.9 * t ** 4
// one hop of the link sweep: eases down over a link without settling on it
const hop = (f: number) =>
  0.16 * f + 0.84 * (f < 0.5 ? 8 * f ** 4 : 1 - Math.pow(-2 * f + 2, 4) / 2)

interface P { x: number; y: number }
const qbez = (p0: P, c: P, p1: P, u: number): P => ({
  x: (1 - u) ** 2 * p0.x + 2 * (1 - u) * u * c.x + u * u * p1.x,
  y: (1 - u) ** 2 * p0.y + 2 * (1 - u) * u * c.y + u * u * p1.y,
})

const rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mixCol = (a: string, b: string, t: number) => {
  const A = rgb(a), B = rgb(b)
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`
}

// ---------------------------------------------------------------- geometry
// A bead on a circular track under gravity: fastest through the bottom,
// slowest over the top. Integrated once, then sampled by normalised time.
function gravityOrbit(c: P, r: number, a0: number, turns = 1, topFactor = 0.32) {
  const g = 2600 // tuned for feel, not realism
  const vTop = topFactor * Math.sqrt(2 * g * r) // keeps it from stalling at the apex
  const N = 720
  const dA = (turns * Math.PI * 2) / N
  const ts = new Float64Array(N + 1)
  let t = 0
  for (let i = 0; i < N; i++) {
    const a = a0 + dA * (i + 0.5)
    // 1 + sin(a) is 0 at the top of the circle and 2 at the bottom
    t += (r * dA) / Math.sqrt(vTop * vTop + 2 * g * r * (1 + Math.sin(a)))
    ts[i + 1] = t
  }
  const T = t
  return (u: number): P => {
    const target = Math.min(Math.max(u, 0), 1) * T
    let lo = 0, hi = N
    while (lo < hi) { const m = (lo + hi) >> 1; if (ts[m] < target) lo = m + 1; else hi = m }
    const i = Math.max(1, lo)
    const f = (target - ts[i - 1]) / (ts[i] - ts[i - 1] || 1)
    const a = a0 + dA * (i - 1 + f)
    return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r }
  }
}

// a straight horizontal run above a row, easing down over each item
function rowSweep(xs: number[], y: number) {
  const n = xs.length - 1
  return (u: number): P => {
    const s = Math.min(0.99999, Math.max(0, u)) * n
    const i = Math.floor(s)
    return { x: xs[i] + (xs[i + 1] - xs[i]) * hop(s - i), y }
  }
}

// the biggest true circle that still fits, centred on what it points at
function fitCircle(box: DOMRect | P & { width: number; height: number; left: number; top: number },
                   bounds: { left: number; right: number; top: number; bottom: number }, want: number) {
  const cx = box.left + box.width / 2
  let cy = box.top + box.height / 2
  const rMax = Math.min(cx - bounds.left, bounds.right - cx, (bounds.bottom - bounds.top) / 2)
  const r = Math.max(34, Math.min(want, rMax))
  cy = Math.max(bounds.top + r, Math.min(cy, bounds.bottom - r))
  return { c: { x: cx, y: cy }, r }
}

const textRect = (el: Element) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect() }
function unionRect(a: DOMRect, b: DOMRect) {
  const left = Math.min(a.left, b.left), top = Math.min(a.top, b.top)
  const right = Math.max(a.right, b.right), bottom = Math.max(a.bottom, b.bottom)
  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

interface Seg {
  dur: number
  ease: (t: number) => number
  at: (u: number) => P
  sc?: [number, number]
  col?: [string, string]
  squash?: boolean
  exit?: () => void
}

// ============================================================================

export default function GuideDot({ run }: { run: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([])
  const state = useRef({
    home: { x: 0, y: 0 } as P,
    restScale: 0.46,
    touring: false,
    aborting: false,
    live: false,
    cancelled: false,
    raf: 0,
    px: 0,
    py: 0,
  })

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    const S = state.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const period = document.querySelector('.sh-period') as HTMLElement | null
    const baseline = document.querySelector('.sh-bl') as HTMLElement | null
    const intro = document.querySelector('.sh-intro') as HTMLElement | null
    const folderEl = document.querySelector('.mf-folder') as HTMLElement | null
    const linksEl = document.querySelector('.sh-links') as HTMLElement | null
    const pane = document.querySelector('.af-pane') as HTMLElement | null
    if (!period || !baseline || !intro || !folderEl || !linksEl || !pane) return

    // The exact ink box of the period glyph, drawn to a canvas in the same
    // font. The span's own rect is the line box, which is far taller than the
    // glyph and sits nowhere near it.
    const periodInk = () => {
      const cs = getComputedStyle(period)
      const fs = parseFloat(cs.fontSize)
      const pad = Math.ceil(fs * 1.5)
      const c = document.createElement('canvas')
      c.width = c.height = pad * 2
      const g = c.getContext('2d')
      if (!g) return { size: DOT * 0.46, dx: 0, dy: -DOT * 0.23 }
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`
      g.textBaseline = 'alphabetic'
      g.fillStyle = '#000'
      g.fillText('.', pad, pad) // pen origin at (pad, pad), baseline at y = pad
      const d = g.getImageData(0, 0, c.width, c.height).data
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          if (d[(y * c.width + x) * 4 + 3] > 40) {
            if (x < x0) x0 = x; if (x > x1) x1 = x
            if (y < y0) y0 = y; if (y > y1) y1 = y
          }
        }
      }
      if (x1 < 0) return { size: DOT * 0.46, dx: 0, dy: -DOT * 0.23 } // font not ready
      return { size: Math.max(x1 - x0 + 1, y1 - y0 + 1), dx: (x0 + x1) / 2 - pad, dy: (y0 + y1) / 2 - pad }
    }

    const measureHome = () => {
      const ink = periodInk()
      const pr = period.getBoundingClientRect()
      S.home = { x: pr.left + ink.dx, y: baseline.getBoundingClientRect().top + ink.dy }
      S.restScale = ink.size / DOT
    }

    const place = (x: number, y: number, sx: number, sy: number, angle = 0) => {
      dot.style.transform =
        `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${angle}rad) scale(${sx},${sy})`
    }
    const rest = () => {
      measureHome()
      dot.style.background = INK
      place(S.home.x, S.home.y, S.restScale, S.restScale, 0)
    }

    // the dot only takes the period's place once it is about to move. Before
    // that the real glyph renders, so it never sits detached while the
    // headline is still sliding in from the boot choreography.
    const goLive = () => {
      if (S.live) return
      S.live = true
      rest()
      document.documentElement.classList.add('guide-live')
      dot.classList.add('live')
    }

    const buildTour = (): Seg[] => {
      measureHome()
      const home = S.home
      const h1 = intro.querySelector('h1')!
      const para = intro.querySelector('p')!
      const ir = unionRect(textRect(h1), textRect(para))
      const leftPane = (document.querySelector('.sh-left') as HTMLElement).getBoundingClientRect()
      const fr = folderEl.getBoundingClientRect()
      const fo = { x: fr.left + fr.width / 2, y: fr.top + fr.height / 2 }
      const lr = linksEl.getBoundingClientRect()
      const pr = pane.getBoundingClientRect()

      const introFit = fitCircle(ir as never, { left: 20, right: leftPane.right - 16, top: 22, bottom: innerHeight - 22 },
        Math.hypot(ir.width / 2, ir.height / 2) + 26)
      // enter and leave at the point on the circle nearest the period, which
      // is also a slow part of the track, so both joins are gentle
      const introA0 = Math.atan2(home.y - introFit.c.y, home.x - introFit.c.x)
      const introOrbit = gravityOrbit(introFit.c, introFit.r, introA0, 1)
      const orbitStart = introOrbit(0), orbitEnd = introOrbit(1)

      const folderOrbit = gravityOrbit(fo, 60, -Math.PI / 2, 1)
      const folderStart = folderOrbit(0)

      // Aim at the focused card itself, not at the pane. The arc's pivot sits
      // off the right edge, so the card lands roughly 250px inside the pane
      // and a hit measured from the pane edge misses it by about 200px.
      const focused = pane.querySelector('.af-card.af-active') as HTMLElement | null
      const cr = focused?.getBoundingClientRect()
      const hit = cr
        ? { x: cr.left + 2, y: cr.top + cr.height / 2 }
        : { x: pr.left + 52, y: pr.top + pr.height / 2 }

      const sweepY = lr.top - 15
      const xs = [...linksEl.children].map((el) => {
        const r = el.getBoundingClientRect()
        return r.left + r.width / 2
      })
      const linksSweep = rowSweep(xs, sweepY)
      const linksStart = { x: xs[0], y: sweepY }
      const linksEnd = { x: xs[xs.length - 1], y: sweepY }

      const anticip = { x: home.x - 8, y: home.y - 14 }
      // it arrives from below left, so it carries a little past the period
      // and eases back down onto it
      const homeOver = { x: home.x + 11, y: home.y - 9 }

      return [
        { dur: 460, ease: easeInOutSine, at: (u) => ({ x: home.x - 8 * u, y: home.y - 14 * u }),
          sc: [S.restScale, 1], col: [INK, RED] },

        { dur: 460, ease: transit, at: (u) => qbez(anticip, { x: anticip.x + 30, y: anticip.y - 40 }, orbitStart, u) },
        { dur: 1500, ease: LIN, at: introOrbit },

        { dur: 820, ease: transit,
          at: (u) => qbez(orbitEnd, { x: orbitEnd.x - 80, y: (orbitEnd.y + folderStart.y) / 2 + 40 }, folderStart, u) },
        { dur: 760, ease: LIN, at: folderOrbit },

        { dur: 740, ease: launch,
          at: (u) => qbez(folderStart, { x: (folderStart.x + hit.x) / 2, y: folderStart.y - 210 }, hit, u) },
        { dur: 170, ease: LIN, at: () => hit, squash: true,
          exit: () => window.dispatchEvent(new CustomEvent('pj:spin')) },

        // the slow head of this move is the recoil off the wheel, which is
        // also when the spin is at its most violent
        { dur: 1150, ease: transit,
          at: (u) => qbez(hit, { x: (hit.x + linksStart.x) / 2, y: hit.y - 150 }, linksStart, u) },
        { dur: 1080, ease: LIN, at: linksSweep },

        { dur: 900, ease: transit,
          at: (u) => qbez(linksEnd, { x: home.x + 40, y: (linksEnd.y + home.y) / 2 }, homeOver, u) },
        { dur: 520, ease: easeOutCubic,
          at: (u) => ({ x: homeOver.x + (home.x - homeOver.x) * u, y: homeOver.y + (home.y - homeOver.y) * u }),
          sc: [1, S.restScale], col: [RED, INK], exit: rest },
      ]
    }

    const runTour = () => {
      if (S.touring || reduced) return
      goLive()
      S.touring = true
      S.aborting = false
      const segs = buildTour()
      S.px = S.home.x; S.py = S.home.y
      place(S.home.x, S.home.y, S.restScale, S.restScale, 0)
      let i = 0
      let t0 = performance.now()
      let history: P[] = []

      const frame = (now: number) => {
        if (!S.touring) return
        const s = segs[i]
        let u = (now - t0) / s.dur
        if (u >= 1) {
          u = 1
          s.exit?.()
          i++; t0 = now
          if (i >= segs.length) { S.touring = false; return }
        }
        const e = s.ease(Math.min(u, 1))
        const p = s.at(e)

        if (s.col) dot.style.background = mixCol(s.col[0], s.col[1], e)
        const base = s.sc ? s.sc[0] + (s.sc[1] - s.sc[0]) * e : 1

        // speed drives the stretch, which is what sells it as a body
        const dx = p.x - S.px, dy = p.y - S.py
        const speed = Math.hypot(dx, dy)
        const stretch = Math.min(speed / 46, 0.34)
        let angle = speed > 0.6 ? Math.atan2(dy, dx) : 0
        let sx = base * (1 + stretch)
        let sy = base * (1 - stretch * 0.55)
        if (s.squash) {
          const k = Math.sin(Math.min(u, 1) * Math.PI)
          sx = base * (1 - 0.5 * k); sy = base * (1 + 0.62 * k); angle = 0
        }
        S.px = p.x; S.py = p.y

        history.push(p)
        if (history.length > 26) history.shift()
        ghostRefs.current.forEach((g, k) => {
          if (!g) return
          const h = history[Math.max(0, history.length - 1 - (k + 1) * 3)]
          if (!h) return
          g.style.opacity = String(0.24 * (1 - k / 5) * Math.max(0, Math.min(1, (speed - 4) / 13)))
          g.style.transform = `translate(${h.x}px,${h.y}px) translate(-50%,-50%) scale(${0.86 - k * 0.13})`
        })

        place(p.x, p.y, sx, sy, angle)
        S.raf = requestAnimationFrame(frame)
      }
      S.raf = requestAnimationFrame(frame)
    }

    // any real intent from the visitor wins, and the dot eases home
    const abort = () => {
      S.cancelled = true
      if (!S.touring) return
      S.touring = false
      S.aborting = true
      cancelAnimationFrame(S.raf)
      measureHome()
      const from = { x: S.px, y: S.py }
      const t0 = performance.now()
      ghostRefs.current.forEach((g) => { if (g) g.style.opacity = '0' })
      const back = (now: number) => {
        if (!S.aborting) return
        const u = Math.min(1, (now - t0) / 460)
        const e = easeInOutSine(u)
        const sc = 1 + (S.restScale - 1) * e
        dot.style.background = u < 1 ? mixCol(RED, INK, e) : INK
        place(from.x + (S.home.x - from.x) * e, from.y + (S.home.y - from.y) * e, sc, sc, 0)
        if (u < 1) requestAnimationFrame(back)
        else { S.aborting = false; rest() }
      }
      requestAnimationFrame(back)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === '.') {
        // a tap on the full stop replays it, whenever
        if (e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName)) return
        abort()
        window.setTimeout(runTour, 60)
        return
      }
      abort()
    }
    const onResize = () => { if (S.live && !S.touring && !S.aborting) rest() }

    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', abort)
    window.addEventListener('wheel', abort, { passive: true })
    window.addEventListener('resize', onResize)

    ;(window as unknown as Record<string, unknown>).__pjGuide = runTour

    return () => {
      cancelAnimationFrame(S.raf)
      S.touring = false; S.aborting = false
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', abort)
      window.removeEventListener('wheel', abort)
      window.removeEventListener('resize', onResize)
      document.documentElement.classList.remove('guide-live')
    }
  }, [])

  // the first run is armed by SplitHome once the boot choreography has settled
  useEffect(() => {
    if (!run) return
    const S = state.current
    if (S.cancelled) return
    const go = (window as unknown as Record<string, unknown>).__pjGuide as (() => void) | undefined
    if (!go) return
    // wait for the webfont, or the glyph measurement is taken from a fallback
    if (document.fonts?.status === 'loaded') go()
    else document.fonts?.ready.then(() => { if (!state.current.cancelled) go() })
  }, [run])

  return (
    <>
      <div className="guide-dot" ref={dotRef} aria-hidden="true" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="guide-ghost" key={i} aria-hidden="true"
             ref={(el) => { ghostRefs.current[i] = el }} />
      ))}
    </>
  )
}
