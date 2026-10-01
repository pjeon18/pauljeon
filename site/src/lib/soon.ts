// ============================================================================
// soon — any link or button carrying `data-soon` is a promise, not a door.
// Clicking it shakes the control, a small head-shake, and floats a short
// "Not ready yet" above it. Installed once at the app root in the capture
// phase, so it works for links rendered anywhere and React never sees the click.
// ============================================================================

let installed = false

export function installSoon() {
  if (installed) return
  installed = true
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-soon]')
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      el.classList.remove('soon-shake')
      void el.offsetWidth
      el.classList.add('soon-shake')
      const r = el.getBoundingClientRect()
      const tip = document.createElement('span')
      tip.className = 'soon-tip'
      tip.textContent = 'Not ready yet'
      tip.style.left = `${r.left + r.width / 2}px`
      tip.style.top = `${r.top - 8}px`
      document.body.appendChild(tip)
      requestAnimationFrame(() => tip.classList.add('on'))
      window.setTimeout(() => {
        tip.classList.remove('on')
        window.setTimeout(() => tip.remove(), 260)
      }, 1300)
    },
    true,
  )
}
