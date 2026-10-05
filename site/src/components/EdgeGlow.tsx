import { useEffect, useRef } from 'react'

// ============================================================================
// EdgeGlow — a soft chromatic light on the rim of the screen, as if the screen
// were lit from its edge. A feathered ring carries the colour and breathes; two
// feathered copies crossfade from near to far so the light seems to spill a
// short way inward and fade before the content; a click lights one more for
// a moment. The only animated property is opacity, so the compositor does all
// of it and nothing repaints per frame. The only script here is the click.
// ============================================================================

export default function EdgeGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const flare = el.querySelector('.edge-flare') as HTMLElement
    let t = 0
    // rise gently, hold until it has fully arrived, then let the long transition
    // carry it back down. A second click while lit holds it longer; nothing restarts.
    const onDown = () => { flare.classList.add('lit'); window.clearTimeout(t); t = window.setTimeout(() => flare.classList.remove('lit'), 650) }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => { window.removeEventListener('pointerdown', onDown); window.clearTimeout(t) }
  }, [])
  return (
    <div className="edge" ref={ref} aria-hidden="true">
      <span className="edge-spill near" />
      <span className="edge-spill far" />
      <span className="edge-flare" />
      <span className="edge-ring" />
    </div>
  )
}
