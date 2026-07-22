import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tiles } from '../content/site'
import type { Tile } from '../content/site'

// One continuous marker zigzag; drawn on hover via a dash-offset transition
// (pathLength=1 normalizes it for any tile size).
const SCRIBBLE_D =
  'M-10,8 C25,2 60,14 110,7 C68,20 28,16 -10,25 C35,19 78,29 110,24 C64,38 22,33 -10,43 C40,37 82,47 110,42 C60,56 20,51 -10,61 C45,55 86,65 110,60 C55,74 25,69 -10,79 C40,73 82,83 110,78 C60,92 30,87 -10,95 C40,91 80,99 110,94'

function Scribble() {
  return (
    <svg className="scr" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="scr-b" pathLength={1} d={SCRIBBLE_D} />
      <path className="scr-h" pathLength={1} d={SCRIBBLE_D} />
    </svg>
  )
}

function TileArt({ tile }: { tile: Tile }) {
  if (tile.gradient) return <div className="ta" style={{ background: tile.gradient }} />
  if (tile.image) return <img src={tile.image} alt={tile.title} loading="lazy" />
  switch (tile.art) {
    case 'iso-brand':
      return (
        <div className="ta ta-brand">
          <span className="c1" /><span className="c2" /><span className="word">ISO</span>
        </div>
      )
    case 'wireframes':
      return (
        <svg viewBox="0 0 220 300" width="100%" height="100%" aria-hidden="true">
          <g stroke="#D9D4C9" strokeWidth="1.4" fill="none">
            <rect x="24" y="26" width="76" height="110" rx="8" /><rect x="120" y="26" width="76" height="110" rx="8" />
            <rect x="24" y="158" width="76" height="110" rx="8" /><rect x="120" y="158" width="76" height="110" rx="8" />
            <line x1="36" y1="52" x2="88" y2="52" /><line x1="36" y1="68" x2="72" y2="68" />
            <line x1="132" y1="52" x2="184" y2="52" /><line x1="132" y1="68" x2="168" y2="68" />
            <circle cx="62" cy="205" r="16" /><line x1="132" y1="190" x2="184" y2="190" /><line x1="132" y1="206" x2="170" y2="206" />
          </g>
        </svg>
      )
    case 'clouds':
      return <div className="ta ta-clouds"><span className="p1" /><span className="p2" /></div>
    case 'telemetry':
      return (
        <svg viewBox="0 0 220 260" width="100%" height="100%" aria-hidden="true" style={{ background: '#191A20' }}>
          <g stroke="#33343E" strokeWidth="1"><path d="M20 70 H200 M20 130 H200 M20 190 H200" /></g>
          <polyline points="20,208 56,178 88,192 118,124 150,142 182,74 204,86" fill="none" stroke="#FF5A3C" strokeWidth="2.6" />
          <g fill="#FF5A3C"><circle cx="118" cy="124" r="4" /><circle cx="182" cy="74" r="4" /></g>
        </svg>
      )
    case 'impostor':
      return <div className="ta ta-imp"><span className="blob" /><span className="visor" /></div>
    case 'deck':
      return <div className="ta ta-deck"><span className="bar" /><span className="l1" /><span className="l2" /><span className="btn" /></div>
    case 'type':
      return <div className="ta ta-type"><span className="aa">Aa</span><span className="gg">Gg</span></div>
    default:
      return null
  }
}

function words(title: string) {
  // word gaps come from .w margin-right — whitespace inside an
  // inline-block span gets trimmed and renders as no space at all
  return title.split(' ').map((w, i) => (
    <span key={i} className="w" style={{ '--d': `${i * 45}ms` } as React.CSSProperties}>
      {w}
    </span>
  ))
}

export default function Playground() {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  return (
    <div className="playground">
      <div className="pg-head">
        <h2>Gallery <span className="pg-hint">(hover anything)</span></h2>
      </div>
      <div className="masonry">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={'mtile' + (open[tile.id] ? ' open' : '')}
            onClick={tile.to ? () => navigate(tile.to!) : undefined}
            role={tile.to ? 'link' : undefined}
            tabIndex={tile.to ? 0 : undefined}
            onKeyDown={tile.to ? (e) => { if (e.key === 'Enter') navigate(tile.to!) } : undefined}
          >
            <div className="mvisual">
              <div className="mph" style={{ height: tile.height }}>
                <TileArt tile={tile} />
              </div>
              <Scribble />
              <div className="mtxt">
                <div className="mt-title">{words(tile.title)}</div>
                {tile.sub && (
                  <div className="msub">
                    {tile.sub}{' '}
                    {tile.expand && (
                      <span className="mread" onClick={() => setOpen((o) => ({ ...o, [tile.id]: true }))}>
                        Read more →
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {tile.expand && (
              <div className="mexp">
                <div className="mexp-in">
                  <p dangerouslySetInnerHTML={{ __html: tile.expand }} />
                  {tile.link && (
                    <a className="mexp-link" href={tile.link.href} target="_blank" rel="noreferrer">
                      {tile.link.label}
                    </a>
                  )}
                  <span className="mless" onClick={() => setOpen((o) => ({ ...o, [tile.id]: false }))}>
                    Show less ↑
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
