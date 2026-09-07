import { useEffect, useRef } from 'react'

// ============================================================================
// SplashDrop — the boot loader. A white drop falls under real gravity
// (rAF-integrated velocity, stretching with speed), squashes on impact,
// throws ballistic droplets, and the impact point blooms into an expanding
// hole in the dark overlay — the site is revealed through the splash.
// ============================================================================

const N_DROPLETS = 7

export default function SplashDrop({
  onReveal,
  onDone,
}: {
  onReveal: () => void
  onDone: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const dropletRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const overlay = overlayRef.current
    const drop = dropRef.current
    if (!overlay || !drop) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const ix = vw / 2
    const iy = vh * 0.8
    // fall: real kinematics, ~740ms from just above the viewport to impact
    const y0 = -40
    const T = 0.74
    const g = (2 * (iy - y0)) / (T * T)
    // reveal must cover the farthest corner
    const R =
      Math.max(
        Math.hypot(ix, iy),
        Math.hypot(vw - ix, iy),
        Math.hypot(ix, vh - iy),
        Math.hypot(vw - ix, vh - iy),
      ) + 60

    const squashMs = 95
    const revealMs = 720
    let revealed = false
    let finished = false
    const reveal = () => { if (!revealed) { revealed = true; onReveal() } }
    const finish = () => { if (!finished) { finished = true; reveal(); onDone() } }

    // droplets: up-and-out ballistics, seeded at impact
    const parts = Array.from({ length: N_DROPLETS }, (_, k) => {
      const a = (k / (N_DROPLETS - 1)) * Math.PI - Math.PI // spread across the top half
      return {
        vx: Math.cos(a) * (240 + Math.random() * 380),
        vy: -(340 + Math.random() * 520),
        s: 5 + Math.random() * 6,
      }
    })

    const setMask = (r: number) => {
      const m = `radial-gradient(circle ${r}px at ${ix}px ${iy}px, transparent 99%, #000 100%)`
      overlay.style.webkitMaskImage = m
      overlay.style.maskImage = m
    }
    setMask(0)

    let raf = 0
    const t0 = performance.now()
    let impactAt = 0

    const frame = (now: number) => {
      const t = (now - t0) / 1000

      if (t < T) {
        // -------- falling: y = y0 + ½gt², stretch with speed --------
        const y = y0 + 0.5 * g * t * t
        const v = g * t
        const stretch = Math.min(v / 2400, 0.45)
        drop.style.transform =
          `translate(${ix}px, ${y}px) translate(-50%, -50%) scale(${1 - stretch * 0.35}, ${1 + stretch})`
        raf = requestAnimationFrame(frame)
        return
      }

      if (!impactAt) {
        impactAt = now
        reveal() // the site starts dealing in behind the splash
      }
      const ti = now - impactAt

      // -------- impact squash --------
      if (ti <= squashMs) {
        const p = ti / squashMs
        drop.style.transform =
          `translate(${ix}px, ${iy}px) translate(-50%, -50%) scale(${1 + p * 1.6}, ${1 - p * 0.62})`
      } else {
        drop.style.opacity = '0'
      }

      // -------- droplets --------
      const ts = ti / 1000
      parts.forEach((pt, k) => {
        const el = dropletRefs.current[k]
        if (!el) return
        const px = ix + pt.vx * ts
        const py = iy + pt.vy * ts + 0.5 * 2300 * ts * ts
        const life = Math.max(0, 1 - ts / 0.72)
        el.style.opacity = String(life * 0.95)
        el.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${life})`
        el.style.width = `${pt.s}px`
        el.style.height = `${pt.s}px`
      })

      // -------- splash rings --------
      const ring = (el: HTMLDivElement | null, delay: number, dur: number, rMax: number) => {
        if (!el) return
        const tr = (ti - delay) / dur
        if (tr <= 0 || tr >= 1) { el.style.opacity = '0'; return }
        const e = 1 - Math.pow(1 - tr, 3)
        const r = 12 + e * rMax
        el.style.opacity = String(0.85 * (1 - tr))
        el.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%)`
        el.style.width = `${r * 2}px`
        el.style.height = `${r * 2}px`
      }
      ring(ring1Ref.current, 0, 520, 110)
      ring(ring2Ref.current, 130, 700, 190)

      // -------- the hole blooms open --------
      const tv = Math.min(1, ti / revealMs)
      const er = 1 - Math.pow(1 - tv, 4) // fast bloom, liquid settle
      setMask(14 + er * R)

      if (ti > revealMs + 250) {
        finish()
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    // never strand the page if rAF is throttled (hidden tab)
    const failsafe = window.setTimeout(finish, 3500)
    return () => { cancelAnimationFrame(raf); clearTimeout(failsafe) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="dl-overlay" ref={overlayRef} aria-hidden="true">
      <div className="dl-drop" ref={dropRef} />
      <div className="dl-ring" ref={ring1Ref} />
      <div className="dl-ring" ref={ring2Ref} />
      {Array.from({ length: N_DROPLETS }, (_, k) => (
        <div key={k} className="dl-p" ref={(el) => { dropletRefs.current[k] = el }} />
      ))}
    </div>
  )
}
