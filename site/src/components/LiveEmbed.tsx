import { useState } from 'react'

// ============================================================================
// LiveEmbed — the shipped product inside the case study, in a phone or a
// browser frame. The iframe loads only when asked, so the page stays light
// and the reader chooses when to hand their attention to the app.
// ============================================================================

interface Props {
  src: string
  title: string
  kind: 'phone' | 'browser'
  poster?: string
}

export default function LiveEmbed({ src, title, kind, poster }: Props) {
  const [on, setOn] = useState(false)
  const host = src.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <div className={`mg-live mg-live-${kind}`}>
      <div className="mg-live-frame">
        {kind === 'browser' && (
          <div className="mg-live-chrome" aria-hidden="true">
            <span /><span /><span />
            <div className="mg-live-url">{host}</div>
          </div>
        )}
        <div className="mg-live-screen">
          {on ? (
            <iframe src={src} title={title} loading="lazy" allow="clipboard-write; fullscreen" />
          ) : (
            <button type="button" className="mg-live-start" onClick={() => setOn(true)} aria-label={`Start ${title}`}>
              {poster && <img src={poster} alt="" loading="lazy" />}
              <span className="mg-live-cta"><i /> Try it live</span>
            </button>
          )}
        </div>
      </div>
      <div className="mg-live-foot">
        <span>{on ? 'Running the deployed build.' : 'The deployed build, not a recording.'}</span>
        <a href={src} target="_blank" rel="noreferrer">Open in a new tab ↗</a>
      </div>
    </div>
  )
}
