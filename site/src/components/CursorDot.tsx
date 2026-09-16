import { useEffect, useRef } from 'react'

// ============================================================================
// CursorDot — the arrow is replaced by a small dot that inverts whatever it is
// over. Near anything clickable it gives way to a glass slab that snaps onto
// the target and hugs its shape, the way the iPadOS pointer does, so small
// targets feel large without being large.
//
// The two states are two elements that cross-fade. The idle dot works by a
// blend mode, and a blend mode cannot animate, so morphing one element would
// always hard-switch somewhere. Position is written inside a rAF; nothing
// here goes through React state.
// ============================================================================

const HOT = [
  'a', 'button', '[role="button"]', 'summary',
  '.af-card', '.mf-win', '.mf-folder', '.mg-caro-card', '.sm-caro-card',
  '.bx-folder', '.mread', '.mless', '.dial-well',
].join(',')
const REACH = 26 // px beyond a target's edge at which the glass takes over

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // a dot is meaningless without a real pointer, and on touch it would
    // stick wherever the last tap landed
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current, glass = glassRef.current
    if (!dot || !glass) return
    document.body.classList.add('has-dot')

    const c = { x: -100, y: -100, w: 11, h: 11, r: 14, vx: 0, vy: 0, vw: 0, vh: 0, g: 0, mx: -100, my: -100, seen: false, down: 0 }

    const nearestHot = (mx: number, my: number): DOMRect | null => {
      let best: DOMRect | null = null, bestD = REACH, bestA = Infinity
      for (const el of document.querySelectorAll<HTMLElement>(HOT)) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) continue
        const dx = Math.max(r.left - mx, 0, mx - r.right), dy = Math.max(r.top - my, 0, my - r.bottom)
        const d = Math.hypot(dx, dy)
        const area = r.width * r.height
        // a link inside a clickable panel beats the panel: nearest first, then smallest
        if (d > bestD || (d === bestD && area >= bestA)) continue
        // hidden panels keep their links in layout at opacity 0, and the arc's
        // far cards are faded out. Only a visible, clickable target draws the glass.
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true } as CheckVisibilityOptions)) continue
        if (getComputedStyle(el).pointerEvents === 'none') continue
        bestD = d; bestA = area; best = r
      }
      return best
    }

    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      if (c.seen) {
        const hot = nearestHot(c.mx, c.my)
        let tx = c.mx, ty = c.my, tw = 11, th = 11, tr = 14
        if (hot) { tx = hot.left + hot.width / 2; ty = hot.top + hot.height / 2; tw = hot.width + 18; th = hot.height + 14; tr = Math.min(16, th / 2) }
        // position on a stiff spring so the snap reads as magnetism; size on a
        // softer one so the slab breathes onto a target rather than clicking to it
        c.vx += ((tx - c.x) * 420 - c.vx * 34) * dt; c.x += c.vx * dt
        c.vy += ((ty - c.y) * 420 - c.vy * 34) * dt; c.y += c.vy * dt
        c.vw += ((tw - c.w) * 260 - c.vw * 24) * dt; c.w += c.vw * dt
        c.vh += ((th - c.h) * 260 - c.vh * 24) * dt; c.h += c.vh * dt
        c.r += (tr - c.r) * Math.min(1, dt * 12)
        c.g += ((hot ? 1 : 0) - c.g) * Math.min(1, dt * 11)
        c.down += ((0) - c.down) * Math.min(1, dt * 18)
        const pos = `translate(${c.x}px,${c.y}px) translate(-50%,-50%)`
        dot.style.transform = `${pos} scale(${(1 - c.g * 0.6) * (1 - c.down * 0.25)})`
        dot.style.opacity = String(1 - c.g)
        glass.style.transform = `${pos} scale(${1 - c.down * 0.04})`
        glass.style.width = `${c.w}px`; glass.style.height = `${c.h}px`; glass.style.borderRadius = `${c.r}px`
        glass.style.opacity = String(c.g)
        // the tint thins as the target grows. On a link it is a lit slab; on a
        // card the same fill would fog the artwork, so a card gets the rim and
        // the float with only a whisper of glass over it.
        const k = Math.max(0.14, Math.min(1, 64 / Math.max(64, Math.max(c.w, c.h))))
        glass.style.background = `linear-gradient(180deg, rgba(255,255,255,${(0.62 * k).toFixed(3)}), rgba(255,255,255,${(0.20 * k).toFixed(3)}))`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: PointerEvent) => {
      c.mx = e.clientX; c.my = e.clientY
      if (!c.seen) { c.seen = true; c.x = e.clientX; c.y = e.clientY; dot.classList.add('on'); glass.classList.add('on') }
    }
    const onOut = (e: PointerEvent) => {
      // relatedTarget is null only when the pointer actually leaves the window
      if (e.relatedTarget === null) { c.seen = false; dot.classList.remove('on'); glass.classList.remove('on') }
    }
    const onDown = () => { c.down = 1 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      document.body.classList.remove('has-dot')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-glass" ref={glassRef} aria-hidden="true" />
    </>
  )
}
