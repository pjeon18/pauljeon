import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArcFocus from './ArcFocus'
import Dial from './Dial'
import GuideDot from './GuideDot'
import MediaFolder from './MediaFolder'
import SplashDrop from './SplashDrop'
import { about } from '../../content/site'

// ============================================================================
// SplitHome — the homepage. Left: a minimal introduction and the About Paul
// media folder. Right: every project on the vertical arc-focus carousel.
// One viewport, no page scroll — the wheel belongs to the arc.
// ============================================================================

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
    const tick = () => setTime(fmt.format(new Date()) + ' EST')
    tick()
    const iv = setInterval(tick, 15000)
    return () => clearInterval(iv)
  }, [])
  return time
}

export default function SplitHome() {
  const time = useClock()

  // a white drop falls and splashes the site into view — once per session,
  // skipped for reduced motion
  const [sessionBoot] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem('pj-booted')) return false
    try { sessionStorage.setItem('pj-booted', '1') } catch { /* no-op */ }
    return true
  })
  const [boot, setBoot] = useState(sessionBoot)
  const [gone, setGone] = useState(!boot)
  // the guide waits for the boot choreography to settle. Starting it earlier
  // would have it circling a headline that is still sliding into place.
  const [guide, setGuide] = useState(false)

  useEffect(() => {
    if (boot) return
    const t = window.setTimeout(() => setGuide(true), 2100)
    return () => window.clearTimeout(t)
  }, [boot])

  useEffect(() => {
    document.title = 'Paul Jeon — Product & Engineering'
    document.body.classList.add('sh-lock')
    return () => document.body.classList.remove('sh-lock')
  }, [])

  return (
    <div className={'sh-page' + (boot ? '' : ' sh-ready')}>
      {!gone && sessionBoot && (
        <SplashDrop onReveal={() => setBoot(false)} onDone={() => setGone(true)} />
      )}
      {/* .sh-cam is the camera's subject: both panes and the guide dot move as
          one. The dial and the cursor sit outside it, fixed to the viewport,
          because hardware lives on the chassis and not in the picture. */}
      <div className="sh-cam">
      <div className="sh-left">
        <header className="sh-nav">
          <span className="sh-logo">Paul Jeon</span>
          <span className="sh-time">{time}</span>
        </header>

        <div className="sh-intro">
          {/* the period is its own element so the guide dot can stand in for
              it, and .sh-bl is a zero-size box whose top edge is the baseline */}
          <h1>Hi, I'm Paul<span className="sh-period">.</span><span className="sh-bl" /></h1>
          <p>I build products centered around user productivity and clarity.</p>
        </div>

        <MediaFolder />

        <footer className="sh-links">
          <a href={`mailto:${about.email}`}>Email</a>
          <a href="https://github.com/pjeon18" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/paul-j-jeon" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`} target="_blank" rel="noreferrer">Résumé</a>
          <Link to="/box">The Box</Link>
        </footer>
      </div>

      <ArcFocus spinIn={!boot} />
      <GuideDot run={guide} />
      </div>
      <Dial />
    </div>
  )
}
