import { useState } from 'react'
import { about } from '../content/site'

export default function About() {
  const [flipped, setFlipped] = useState(false)
  const touch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  return (
    <div className="meet" id="about">
      <div
        className="meet-photo"
        onMouseEnter={() => !touch && setFlipped(true)}
        onMouseLeave={() => !touch && setFlipped(false)}
        onClick={() => touch && setFlipped((f) => !f)}
      >
        <div className={'mp-flip' + (flipped ? ' on' : '')}>
          <div className="mp-face mp-front">
            <img src={about.portraitFront} alt="Paul Jeon" />
          </div>
          <div className="mp-face mp-back">
            <img src={about.portraitBack} alt="Paul inspecting a pizza slice" />
          </div>
        </div>
        <div className="mp-cap">{about.caption}</div>
      </div>
      <div className="meet-text">
        <div className="meet-kicker">{about.kicker}</div>
        <h2>{about.heading}</h2>
        {about.paragraphs.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <div className="meet-stats">{about.stats}</div>
        <div className="meet-cta">
          <a className="btn-line" href={`mailto:${about.email}`}>{about.email}</a>
        </div>
      </div>
    </div>
  )
}
