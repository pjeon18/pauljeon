import { useEffect, useRef } from 'react'
import { footer } from '../content/site'

export default function Footer() {
  const bigRef = useRef<HTMLHeadingElement>(null)

  // draw the ink circle around "Connect" the first time it scrolls into view
  useEffect(() => {
    const el = bigRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('inked')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('inked')
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="foot">
      <div className="foot-kicker">{footer.kicker}</div>
      <h2 className="foot-big" ref={bigRef}>
        Let's{' '}
        <span className="fa ink-circle-wrap">
          Connect
          <svg className="ink-circle" viewBox="0 0 120 54" preserveAspectRatio="none" aria-hidden="true">
            <path d="M16,27 C13,13 45,4 74,6 C103,8 114,17 110,29 C106,43 67,51 36,45 C13,41 9,33 18,24" pathLength={1} />
          </svg>
        </span>
        !
      </h2>
      <a className="foot-mail" href={`mailto:${footer.email}`}>{footer.email}</a>
      <div className="foot-links">
        {footer.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
        ))}
      </div>
      <div className="foot-fine">{footer.fine}</div>
    </div>
  )
}
