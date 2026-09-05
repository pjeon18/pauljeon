import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArcFocus from './ArcFocus'
import MediaFolder from './MediaFolder'
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

  useEffect(() => {
    document.title = 'Paul Jeon — Product & Engineering'
    document.body.classList.add('sh-lock')
    return () => document.body.classList.remove('sh-lock')
  }, [])

  return (
    <div className="sh-page">
      <div className="sh-left">
        <header className="sh-nav">
          <span className="sh-logo">Paul Jeon</span>
          <span className="sh-time">{time}</span>
        </header>

        <div className="sh-intro">
          <h1>Hi, I'm Paul.</h1>
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

      <ArcFocus />
    </div>
  )
}
