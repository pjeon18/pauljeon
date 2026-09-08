import { useEffect, useRef } from 'react'

// ============================================================================
// CursorDot — replaces the arrow with a small dot.
//
// Position is written straight to the element inside a rAF, never through
// React state, so moving the mouse costs no re-render. The dot itself never
// animates its position: lag on a cursor reads as broken rather than smooth.
// Only its size animates, growing into a ring over anything clickable.
//
// mix-blend-mode: difference means one dot works on the cream pages and the
// near-black bands without needing to know which it is over.
// ============================================================================

const INTERACTIVE = [
  'a', 'button', '[role="button"]', 'input', 'textarea', 'select', 'summary',
  '.af-card', '.af-tab', '.mf-win', '.mf-folder', '.mg-caro-card', '.sm-caro-card',
  '.bx-folder', '.mread', '.mless', '.pam-slider',
].join(',')

export default function CursorDot() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // a dot is meaningless without a real pointer, and on touch it would
    // stick wherever the last tap landed
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    if (!el) return

    document.body.classList.add('has-dot')
    let x = -100
    let y = -100
    let raf = 0
    let shown = false

    const draw = () => {
      raf = 0
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!shown) { shown = true; el.classList.add('on') }
      schedule()
      const t = e.target as Element | null
      el.classList.toggle('hot', !!(t && t.closest && t.closest(INTERACTIVE)))
    }
    const onOut = (e: PointerEvent) => {
      // relatedTarget is null only when the pointer actually leaves the window
      if (e.relatedTarget === null) { shown = false; el.classList.remove('on') }
    }
    const onDown = () => el.classList.add('down')
    const onUp = () => el.classList.remove('down')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })

    return () => {
      document.body.classList.remove('has-dot')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return <div className="cursor-dot" ref={ref} aria-hidden="true" />
}
