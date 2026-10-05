import { useEffect, useRef } from 'react'

// ============================================================================
// CursorDot — the arrow is the dot. It sits exactly under the pointer, and
// the only thing that moves is its body: speed stretches it along the way it
// is going and warms it from ink toward red, so a fast hand reads as a red
// streak and a still one as a black point. The same grammar as the guide dot.
//
// The dot also speaks. Linger on a link that goes somewhere non-obvious and a
// thin ring fills around the dot; when it fills, a glass bubble blooms from
// the dot and says what the link opens, and the same line goes to a polite
// live region for screen readers. Pass through quickly and it says nothing.
// Everything is written per frame inside one rAF; no React state.
// ============================================================================

const RED = '#E02B1D', INK = '#121110'
const DWELL = 500            // ms on a link before it speaks
const RATE = 32              // follow rate: fraction of the gap closed per second, exp-decayed

const rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mix = (a: string, b: string, t: number) => {
  const A = rgb(a), B = rgb(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}

// What a link says when the dot lingers on it. Explicit copy wins; otherwise
// the dot describes only what is not obvious from the label: leaving the
// site, opening Mail, or a promise that is not kept yet.
function describe(a: HTMLAnchorElement): { say: string; sub: string } | null {
  if (a.dataset.say) return { say: a.dataset.say, sub: a.dataset.sub || '' }
  if (a.hasAttribute('data-soon')) return { say: 'Not ready yet', sub: '' }
  const href = a.getAttribute('href') || ''
  if (href.startsWith('mailto:')) return { say: 'Opens Mail', sub: href.slice(7) }
  if (/^https?:/.test(href)) {
    try {
      const u = new URL(href)
      if (u.origin !== location.origin) return { say: 'Leaves the site', sub: (u.host + u.pathname).replace(/^www\./, '').replace(/\/$/, '') }
    } catch { /* not a url */ }
  }
  return null
}

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGSVGElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const sayRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const glyphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // a dot is meaningless without a real pointer, and on touch it would
    // stick wherever the last tap landed
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current, ring = ringRef.current, arc = arcRef.current
    const bubble = bubbleRef.current, say = sayRef.current, sub = subRef.current, live = liveRef.current
    const glyph = glyphRef.current
    if (!dot || !ring || !arc || !bubble || !say || !sub || !live || !glyph) return
    document.body.classList.add('has-dot')

    // context: the dot grows into a play glyph over a film, shows a grip over
    // the open arc, and leans toward a button it is near. All eased, never cut.
    const C = { size: 1, ox: 0, oy: 0, mode: '' as '' | 'play' | 'grip' | 'magnet' }
    const context = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      if (!el) return { mode: '' as const }
      const btn = el.closest('.af-try, .af-watch, .af-reels, .rl-btn, .rl-round, .rl-close, .rl-pp, .af-close, .mf-folder') as HTMLElement | null
      if (btn) { const r = btn.getBoundingClientRect(); return { mode: 'magnet' as const, cx: r.left + r.width / 2, cy: r.top + r.height / 2 } }
      // the control bar is for precise work: plain dot there, no glyph on the knob
      if (el.closest('.rl-controls')) return { mode: '' as const }
      if (el.closest('.rl-frame') || el.closest('.af-card.af-active .af-photo')?.querySelector('.af-film')) return { mode: 'play' as const }
      if (el.closest('.af-pane') && !el.closest('.af-panel, .af-card, button, a')) return { mode: 'grip' as const }
      return { mode: '' as const }
    }
    const S = { x: -100, y: -100, mx: -100, my: -100, vx: 0, vy: 0, seen: false, over: null as HTMLAnchorElement | null, since: 0, speaking: null as HTMLAnchorElement | null, offT: 0 }

    const under = (): HTMLAnchorElement | null => {
      const el = document.elementFromPoint(S.x, S.y)
      const a = el ? (el.closest('a[href]') as HTMLAnchorElement | null) : null
      return a && describe(a) ? a : null
    }
    const placeBubble = () => {
      // hangs off the dot's upper right, tail on the dot, kept on screen
      const w = bubble.offsetWidth, h = bubble.offsetHeight
      let x = S.x - 19, y = S.y - 22 - h
      if (x + w > innerWidth - 16) x = innerWidth - 16 - w
      if (x < 8) x = 8
      if (y < 12) y = S.y + 18
      bubble.style.left = `${x}px`; bubble.style.top = `${y}px`
    }
    const speak = (a: HTMLAnchorElement) => {
      const d = describe(a); if (!d) return
      S.speaking = a
      window.clearTimeout(S.offT)
      say.textContent = d.say; sub.textContent = d.sub
      live.textContent = `${a.textContent?.trim()}: ${d.say}${d.sub ? ', ' + d.sub : ''}`
      bubble.classList.remove('off'); bubble.classList.add('on')
      placeBubble()
    }
    const hush = () => {
      if (!S.speaking) return
      S.speaking = null
      bubble.classList.remove('on'); bubble.classList.add('off')
      S.offT = window.setTimeout(() => bubble.classList.remove('off'), 220)
    }

    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000)); last = now
      if (S.seen) {
        // exponential follow: stable at any frame time, never overshoots, and
        // tight enough that it reads as the pointer itself
        const f = 1 - Math.exp(-RATE * dt)
        const nx = S.x + (S.mx - S.x) * f, ny = S.y + (S.my - S.y) * f
        S.vx = (nx - S.x) / dt; S.vy = (ny - S.y) / dt
        S.x = nx; S.y = ny
        const sp = Math.hypot(S.vx, S.vy)
        const stretch = Math.min(sp / 2600, 0.3)
        const ang = sp > 20 ? Math.atan2(S.vy, S.vx) : 0
        const ctx = context(S.mx, S.my)
        if (ctx.mode !== C.mode) { C.mode = ctx.mode; glyph.dataset.mode = ctx.mode; dot.dataset.mode = ctx.mode }
        const g = 1 - Math.exp(-13 * dt)
        const want = ctx.mode === 'play' ? 2.6 : ctx.mode === 'grip' ? 2.1 : ctx.mode === 'magnet' ? 1.7 : 1
        C.size += (want - C.size) * g
        // the lean toward a button: a quarter of the way to its centre
        const tox = ctx.mode === 'magnet' && 'cx' in ctx ? (ctx.cx! - S.x) * 0.24 : 0
        const toy = ctx.mode === 'magnet' && 'cy' in ctx ? (ctx.cy! - S.y) * 0.24 : 0
        C.ox += (tox - C.ox) * g; C.oy += (toy - C.oy) * g
        const px = S.x + C.ox, py = S.y + C.oy
        dot.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%) rotate(${ang}rad) scale(${((1 + stretch) * C.size).toFixed(3)},${((1 - stretch * 0.5) * C.size).toFixed(3)})`
        glyph.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`
        dot.style.background = mix(INK, RED, Math.min(1, sp / 1400))
        ring.style.transform = `translate(${S.x - 18}px,${S.y - 18}px)`

        const a = under()
        if (a !== S.over) { S.over = a; S.since = now; if (!a) hush() }
        if (a) {
          const k = Math.min(1, (now - S.since) / DWELL)
          ring.classList.toggle('on', k < 1 && !S.speaking)
          arc.style.strokeDashoffset = String(1 - k)
          if (k >= 1 && S.speaking !== a) speak(a)
        } else ring.classList.remove('on')
        if (S.speaking) placeBubble()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: PointerEvent) => {
      S.mx = e.clientX; S.my = e.clientY
      if (!S.seen) { S.seen = true; S.x = e.clientX; S.y = e.clientY; dot.classList.add('on') }
    }
    const onOut = (e: PointerEvent) => {
      // relatedTarget is null only when the pointer actually leaves the window
      if (e.relatedTarget === null) { S.seen = false; dot.classList.remove('on'); ring.classList.remove('on'); hush() }
    }
    // a click is an answer, so the dot stops talking
    const onDown = () => { hush(); S.since = performance.now() + 400 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      document.body.classList.remove('has-dot')
      cancelAnimationFrame(raf)
      window.clearTimeout(S.offT)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <>
      <svg className="cursor-ring" ref={ringRef} viewBox="0 0 36 36" aria-hidden="true">
        <circle ref={arcRef} cx="18" cy="18" r="15" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
      </svg>
      <div className="dot-bubble" ref={bubbleRef} aria-hidden="true">
        <div className="dot-glass"><p ref={sayRef} /><small ref={subRef} /><span className="dot-tail" /></div>
      </div>
      <div className="sr-only" role="status" aria-live="polite" ref={liveRef} />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-glyph" ref={glyphRef} aria-hidden="true">
        <svg className="g-play" width="12" height="12" viewBox="0 0 12 12"><path d="M3.4 1.8 L10 6 L3.4 10.2 Z" fill="currentColor" /></svg>
        <svg className="g-grip" width="10" height="14" viewBox="0 0 10 14"><path d="M2 5 L5 2 L8 5 M2 9 L5 12 L8 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </>
  )
}
