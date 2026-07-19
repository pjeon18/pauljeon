// Smooth scroll with inertia: fast start, long deceleration (easeOutExpo).
export function smoothScrollTo(el: HTMLElement, offset = 24) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollIntoView()
    return
  }
  const startY = window.scrollY
  const targetY = el.getBoundingClientRect().top + startY - offset
  const dist = targetY - startY
  if (Math.abs(dist) < 2) return
  // quick but distance-aware: ~600ms for a screen, capped ~1s for long throws
  const dur = Math.min(1000, 420 + Math.abs(dist) * 0.18)
  const start = performance.now()
  function step(now: number) {
    const t = Math.min(1, (now - start) / dur)
    const e = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
    window.scrollTo(0, startY + dist * e)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function smoothScrollToId(id: string, offset = 24) {
  const el = document.getElementById(id)
  if (el) smoothScrollTo(el, offset)
}
