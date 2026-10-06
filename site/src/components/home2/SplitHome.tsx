import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ArcFocus from './ArcFocus'
import GuideDot from './GuideDot'
import MediaFolder from './MediaFolder'
import SplashDrop from './SplashDrop'
import Underground, { UndergroundArrow } from '../underground/Underground'
import { about, cards } from '../../content/site'

// ============================================================================
// SplitHome — the homepage. Left: a minimal introduction and the About Paul
// media folder. Right: every project on the vertical arc-focus carousel.
// One viewport, no page scroll — the wheel belongs to the arc.
// ============================================================================

// which card a case path belongs to, for the return morph
const cardIndexFor = (path: string | undefined): number | null => {
  if (!path) return null
  const i = cards.findIndex((c) => (c.slug && path === `/work/${c.slug}`) || (c.page && path === c.page))
  return i >= 0 ? i : null
}

let bootThisLoad: boolean | null = null

export default function SplitHome() {
  // arriving back from a case study: mount with its card docked, skip the
  // choreography, and let the tour wait for a fresh visit
  const { state } = useLocation() as { state?: { from?: string } }
  const [dockIndex] = useState<number | null>(() => cardIndexFor(state?.from))
  const returning = dockIndex !== null
  // the tour only plays on the two-pane layout, and never on a return
  const [tourComing] = useState(() => !returning && !window.matchMedia('(max-width: 880px)').matches)

  // a white drop falls and splashes the site into view — once per session,
  // skipped for reduced motion
  const [sessionBoot] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    // decided once per page load, so StrictMode's double call can't eat it
    if (bootThisLoad === null) {
      bootThisLoad = !sessionStorage.getItem('pj-booted')
      try { sessionStorage.setItem('pj-booted', '1') } catch { /* no-op */ }
    }
    return bootThisLoad
  })
  const [boot, setBoot] = useState(sessionBoot)
  const [gone, setGone] = useState(!boot)
  // the first visit of a session opens with the trailer, after the drop.
  // Later mounts get the light tour, and the period replays it on click.
  // the trailer only plays on the two-pane layout; arming it on a phone would
  // leave the page framed on the period at 7x with nothing to pull it back
  const mode: 'trailer' | 'tour' = sessionBoot && tourComing ? 'trailer' : 'tour'
  // the guide waits for the boot choreography to settle. Starting it earlier
  // would have it circling a headline that is still sliding into place.
  const [guide, setGuide] = useState(false)

  useEffect(() => {
    if (boot || !tourComing) return
    // the trailer holds on the period while the mask opens, so it starts at once
    if (mode === 'trailer') { setGuide(true); return }
    const t = window.setTimeout(() => setGuide(true), 2100)
    return () => window.clearTimeout(t)
  }, [boot])

  // the underground: the arrow (or a firm scroll down over the left pane) drops you into it
  const [under, setUnder] = useState(false)
  const [diveId, setDiveId] = useState(0)
  const goUnder = () => { if (!under) { setUnder(true); setDiveId((n) => n + 1) } }
  useEffect(() => {
    if (location.hash === '#underground') goUnder()
    const left = document.querySelector<HTMLElement>('.sh-left')
    if (!left) return
    let acc = 0, t = 0
    const wheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) { acc = 0; return }
      acc += e.deltaY; clearTimeout(t); t = window.setTimeout(() => (acc = 0), 260)
      if (acc > 420) { acc = 0; goUnder() }
    }
    left.addEventListener('wheel', wheel, { passive: true })
    return () => left.removeEventListener('wheel', wheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [under])

  useEffect(() => {
    document.title = 'Paul Jeon — Product & Engineering'
    document.body.classList.add('sh-lock')
    return () => document.body.classList.remove('sh-lock')
  }, [])

  return (
    <>
    <div className={'sh-page' + (boot ? '' : ' sh-ready') + (returning ? ' sh-return' : '') + (mode === 'trailer' ? ' sh-trailer' : '')}>
      {!gone && sessionBoot && (
        <SplashDrop onReveal={() => setBoot(false)} onDone={() => setGone(true)} />
      )}
      {/* .sh-cam is the camera's subject: both panes and the guide dot move as
          one. The cursor sits outside it, fixed to the viewport. */}
      <div className="sh-cam">
      <div className="sh-left">
        <header className="sh-nav">
          <span className="sh-logo">Paul Jeon</span>
        </header>

        <div className="sh-intro">
          {/* the period is its own element so the guide dot can stand in for
              it, and .sh-bl is a zero-size box whose top edge is the baseline */}
          <h1 aria-label="Hi, I'm Paul.">
            <span aria-hidden="true">{"Hi, I'm Paul".split('').map((c, i) => (
              <span key={i} className="ch" style={{ '--li': i } as React.CSSProperties}>{c === ' ' ? '\u00A0' : c}</span>
            ))}</span>
            <span className="sh-period" aria-hidden="true">.</span><span className="sh-bl" />
          </h1>
          <p>I build products centered around user productivity and clarity.</p>
        </div>

        <MediaFolder />

        <footer className="sh-links">
          <a href={`mailto:${about.email}`}>Email</a>
          <a href="https://github.com/pjeon18" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/paul-j-jeon/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`} target="_blank" rel="noreferrer" data-soon>Résumé</a>
          <Link to="/box" data-say="The old portfolio">The Box</Link>
        </footer>
      </div>

      <ArcFocus spinIn={!boot && !returning} awaitCollision={tourComing} dockIndex={dockIndex} />
      <GuideDot run={guide} mode={mode} />
      </div>
      <UndergroundArrow onDive={goUnder} />
    </div>
    {under && <Underground key={diveId} onClosed={() => setUnder(false)} />}
    </>
  )
}
