import { useEffect, useRef } from 'react'
import { cards } from '../../content/site'

// ============================================================================
// Dial — the thumbwheel at the right edge, the visible axle the arc hangs
// from. It draws itself from the arc's live position (pj:pos) and sends its
// own drags back (pj:dial), so the two are one mechanism with two hands.
//
// The wheel is a cylinder about a horizontal axle, drawn per frame: each rib
// is placed by its angle, so ribs bunch and thin toward the poles where the
// rim curves away. That is what reads as a solid rather than scrolling stripes.
// ============================================================================

const CW = 36, CH = 288
const RIBS = 60
const N = cards.length
const RIBS_PER_CARD = RIBS / N   // one lap of the arc is one turn of the wheel
const RIM = CH / 2 - 2
const PITCH = 46                 // px per card on the scale

export default function Dial() {
  const wellRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scaleRef = useRef<SVGSVGElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const detent = useRef(0)

  useEffect(() => {
    const cv = canvasRef.current, scale = scaleRef.current, pointer = pointerRef.current, well = wellRef.current
    if (!cv || !scale || !pointer || !well) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    cv.width = CW * DPR; cv.height = CH * DPR
    ctx.scale(DPR, DPR)

    const drawWheel = (pos: number) => {
      ctx.clearRect(0, 0, CW, CH)
      const cy = CH / 2
      // dark machined body, lit from above-left
      const body = ctx.createLinearGradient(0, 0, 0, CH)
      body.addColorStop(0, '#0F0F11'); body.addColorStop(0.18, '#1E1E22'); body.addColorStop(0.5, '#2A2A2F')
      body.addColorStop(0.82, '#1C1C20'); body.addColorStop(1, '#0D0D0F')
      ctx.fillStyle = body
      ctx.fillRect(0, 0, CW, CH)
      const rot = pos * RIBS_PER_CARD * (Math.PI * 2 / RIBS)
      for (let i = 0; i < RIBS; i++) {
        let phi = i * (Math.PI * 2 / RIBS) - rot
        phi = ((phi + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
        if (Math.abs(phi) >= Math.PI / 2) continue          // back of the cylinder
        const face = Math.cos(phi)                           // 1 facing you, 0 at the pole
        const y = cy - Math.sin(phi) * RIM
        const h = 1.2 + face * 2.2
        ctx.fillStyle = `rgba(0,0,0,${0.55 * face + 0.15})`
        ctx.fillRect(3, y - h / 2, CW - 6, h)
        ctx.fillStyle = `rgba(255,255,255,${0.10 + face * 0.16})`
        ctx.fillRect(3, y + h / 2, CW - 6, 1)
      }
      const sheen = ctx.createLinearGradient(0, 0, CW, 0)
      sheen.addColorStop(0, 'rgba(255,255,255,0.10)'); sheen.addColorStop(0.35, 'rgba(255,255,255,0.02)'); sheen.addColorStop(1, 'rgba(0,0,0,0.28)')
      ctx.fillStyle = sheen; ctx.fillRect(0, 0, CW, CH)
      const cap = ctx.createLinearGradient(0, 0, 0, CH)
      cap.addColorStop(0, 'rgba(0,0,0,0.55)'); cap.addColorStop(0.12, 'rgba(0,0,0,0)')
      cap.addColorStop(0.88, 'rgba(0,0,0,0)'); cap.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = cap; ctx.fillRect(0, 0, CW, CH)
    }

    // The scale is a timeline. It moves, the pointer stays. One major tick
    // per card, four minor, and a month label wherever the month changes
    // (plus always on the focused card), so a run of same-month work reads
    // as one span rather than a stutter of repeated labels.
    const drawScale = (pos: number) => {
      let out = ''
      const focus = Math.round(pos)
      for (let k = -4; k <= 4; k++) {
        const idx = focus + k
        const y = 150 - (idx - pos) * PITCH
        const card = ((idx % N) + N) % N
        const prev = (((idx - 1) % N) + N) % N
        const near = Math.max(0, 1 - Math.abs(idx - pos) / 3.2)
        const boundary = cards[card].when !== cards[prev].when || idx === focus
        out += `<line x1="${boundary ? 34 : 40}" x2="52" y1="${y}" y2="${y}" stroke="#121110" stroke-opacity="${0.25 + near * 0.75}" stroke-width="1.6"/>`
        if (boundary) out += `<text x="0" y="${y + 3}" font-family="Inter,sans-serif" font-size="8.5" font-weight="600" letter-spacing="0.02em" fill="${idx === focus ? '#E05C1F' : '#121110'}" fill-opacity="${idx === focus ? 1 : 0.25 + near * 0.6}">${cards[card].when}</text>`
        for (let m = 1; m < 5; m++) {
          const my = y - m * PITCH / 5
          out += `<line x1="46" x2="52" y1="${my}" y2="${my}" stroke="#121110" stroke-opacity="0.22" stroke-width="1"/>`
        }
      }
      scale.innerHTML = out
    }

    const render = (pos: number) => {
      posRef.current = pos
      drawWheel(pos)
      drawScale(pos)
      // the detent: the pointer kicks each time the arc crosses a card
      const idx = Math.round(pos)
      if (idx !== detent.current) {
        detent.current = idx
        if (!reduced) {
          pointer.classList.add('tick')
          requestAnimationFrame(() => requestAnimationFrame(() => pointer.classList.remove('tick')))
        }
      }
    }
    render(0)
    const onPos = (e: Event) => render((e as CustomEvent<number>).detail)
    window.addEventListener('pj:pos', onPos)

    // dragging the wheel: the arc follows 1:1, and takes the release velocity
    const K = 1 / 110
    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('pj:dial', { detail: { type: 'start' } }))
      let lastY = e.clientY, lastTime = performance.now(), vel = 0
      const pid = e.pointerId
      try { well.setPointerCapture(pid) } catch { /* no-op */ }
      const move = (ev: PointerEvent) => {
        const now = performance.now()
        const dp = (ev.clientY - lastY) * K
        vel = vel * 0.4 + (dp / Math.max(1, now - lastTime) * 1000) * 0.6
        window.dispatchEvent(new CustomEvent('pj:dial', { detail: { type: 'move', dp, vel } }))
        lastY = ev.clientY; lastTime = now
      }
      const up = () => {
        well.removeEventListener('pointermove', move); well.removeEventListener('pointerup', up); well.removeEventListener('pointercancel', up)
        try { well.releasePointerCapture(pid) } catch { /* no-op */ }
        window.dispatchEvent(new CustomEvent('pj:dial', { detail: { type: 'end' } }))
      }
      well.addEventListener('pointermove', move); well.addEventListener('pointerup', up); well.addEventListener('pointercancel', up)
    }
    well.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('pj:pos', onPos); well.removeEventListener('pointerdown', onDown) }
  }, [])

  return (
    <div className="dial" aria-hidden="true">
      <div className="dial-scale">
        <svg ref={scaleRef} width="52" height="300" />
        <div className="dial-pointer" ref={pointerRef} />
      </div>
      <div className="dial-well" ref={wellRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
