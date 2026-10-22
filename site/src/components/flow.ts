// One motion vocabulary for the bespoke case pages (ISO redesigned, Harvard
// Pathways). The page is one continuous scroll. Anything marked data-r fades in
// and rises a little the first time it comes into view; anything marked
// data-act only gains .go, so CSS can start a small scripted moment (a ring
// draining, a word swapping) once it is on screen. Plain document scroll, so it
// behaves the same inside the home page's iframe.
import { useEffect, type CSSProperties, type RefObject } from 'react'

export function useFlow(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const items = [...el.querySelectorAll<HTMLElement>('[data-r], [data-act]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      items.forEach((n) => n.classList.add('go'))
      return
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('go'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -12% 0px' })
    items.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [root])
}

/** style helper: a stagger delay in seconds */
export const dl = (s: number) => ({ '--dl': `${s}s` }) as CSSProperties
