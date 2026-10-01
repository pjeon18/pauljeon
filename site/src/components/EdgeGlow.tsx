import { useEffect, useRef } from 'react'

// ============================================================================
// EdgeGlow — a thin chromatic band on the rim of the screen, as if the screen
// were lit from its edge. A crisp ring carries the colour and breathes; a
// blurred copy spills a short way inward and fades before it reaches the
// content; a click lights one more ring for a moment. All of it is CSS; the
// only script here is the click.
// ============================================================================

export default function EdgeGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const flare = () => { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go') }
    window.addEventListener('pointerdown', flare, { passive: true })
    return () => window.removeEventListener('pointerdown', flare)
  }, [])
  return (
    <div className="edge" ref={ref} aria-hidden="true">
      <span className="edge-spill"><i /></span>
      <span className="edge-flare"><i /></span>
      <span className="edge-ring" />
    </div>
  )
}
