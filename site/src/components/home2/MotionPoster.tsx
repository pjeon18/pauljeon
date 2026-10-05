import { useEffect, useState } from 'react'

// ============================================================================
// MotionPoster — the focused card's art comes alive. Each one is a short loop
// drawn for that project, on the card's own 242×228 frame: a chart that
// draws itself, a dot that hops, a route that finds its pin. Pure SVG + CSS
// keyframes (motion.css, prefix mp-), mounted only while the card is in focus,
// so the loop always starts from its first beat.
// ============================================================================

const W = 242, H = 228

function useCount(to: number, ms: number) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, ms])
  return v
}

/** two lap-time traces racing; the undercut line dips under and crosses */
function F1() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mp-f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stopColor="#0b0c10" stopOpacity="0" /><stop offset="1" stopColor="#0b0c10" stopOpacity="0.86" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#mp-f1)" />
      <g className="mp-fade" style={{ animationDelay: '200ms' }}>
        <text x="14" y="160" className="mp-f1-k">GAP TO RIVAL</text>
        <path className="mp-draw" pathLength={1} d="M14 196 C 50 192, 70 184, 100 188 S 150 196, 228 190" fill="none" stroke="#9AA3B5" strokeWidth="2" />
        <path className="mp-draw d2" pathLength={1} d="M14 192 C 48 190, 66 200, 96 206 L 104 182 C 130 176, 170 172, 228 170" fill="none" stroke="#FF8A3D" strokeWidth="2.4" />
        <circle className="mp-dotpop" cx="104" cy="182" r="4" fill="#FF8A3D" />
        <text x="110" y="176" className="mp-f1-pit">PIT</text>
      </g>
    </svg>
  )
}

/** the project's headline trend, as published (Pew): two bars, 2020 and 2025,
    which give way to the line between them. Only the two real endpoints. */
function Media() {
  const bars = [{ y: '2020', v: 9 }, { y: '2025', v: 43 }]
  const x = (i: number) => 58 + i * 92
  const h = (v: number) => v * 2.6
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} fill="#0d0d0f" className="mp-fade" />
      {bars.map((b, i) => (
        <g key={b.y}>
          <rect className="mp-bar" style={{ animationDelay: `${150 + i * 160}ms`, transformOrigin: `${x(i) + 18}px 196px` }} x={x(i)} y={196 - h(b.v)} width={36} height={h(b.v)} rx={4} fill="#E8E2D6" />
          <text className="mp-media-y" x={x(i) + 18} y="212" textAnchor="middle">{b.y}</text>
          <text className="mp-media-v" style={{ animationDelay: `${700 + i * 160}ms` }} x={x(i) + 18} y={188 - h(b.v)} textAnchor="middle">{b.v}%</text>
        </g>
      ))}
      <path className="mp-media-line" pathLength={1} d={`M${x(0) + 18} ${196 - h(9)} L${x(1) + 18} ${196 - h(43)}`} fill="none" stroke="#FF6A3D" strokeWidth="3" strokeLinecap="round" />
      <text x="20" y="34" className="mp-media-t">Adults under 30 who get news on TikTok</text>
      <text x="20" y="50" className="mp-media-s">Pew Research Center</text>
    </svg>
  )
}

/** the cumulative-utility plot redraws itself */
function RL() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} fill="#fff" />
      <g stroke="#D9D6CF" strokeWidth="1">
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1="34" x2="230" y1={40 + i * 38} y2={40 + i * 38} />)}
      </g>
      <line x1="34" y1="192" x2="230" y2="192" stroke="#121110" strokeWidth="1.2" />
      <line x1="34" y1="30" x2="34" y2="192" stroke="#121110" strokeWidth="1.2" />
      <path className="mp-draw" pathLength={1} d="M40 160 L46 120 L50 52 L230 44" fill="none" stroke="#2F6FD8" strokeWidth="2.4" />
      <path className="mp-draw d2" pathLength={1} d="M40 186 L44 150 L230 146" fill="none" stroke="#F08A2A" strokeWidth="2.4" />
      <text x="34" y="22" className="mp-rl-t">Cumulative utility</text>
      <g className="mp-fade" style={{ animationDelay: '1500ms' }}>
        <rect x="150" y="150" width="76" height="30" rx="5" fill="#fff" stroke="#E2DFD8" />
        <line x1="157" y1="160" x2="170" y2="160" stroke="#2F6FD8" strokeWidth="2.4" /><text x="174" y="163" className="mp-rl-l">learned</text>
        <line x1="157" y1="171" x2="170" y2="171" stroke="#F08A2A" strokeWidth="2.4" /><text x="174" y="174" className="mp-rl-l">baseline</text>
      </g>
    </svg>
  )
}

/** the dot hops through its three colours, the trail of crumbs filling in */
function Dot() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} fill="#fff" />
      <g className="mp-dot-hop"><circle cx="121" cy="96" r="44" className="mp-dot-c" /></g>
      <ellipse className="mp-dot-sh" cx="121" cy="150" rx="30" ry="5" fill="#000" opacity="0.08" />
      <g transform="translate(103 176)">
        <circle className="mp-crumb" style={{ animationDelay: '0ms' }} cx="0" cy="0" r="5" fill="#E02B1D" />
        <circle className="mp-crumb" style={{ animationDelay: '900ms' }} cx="18" cy="0" r="5" fill="#121110" />
        <circle className="mp-crumb" style={{ animationDelay: '1800ms' }} cx="36" cy="0" r="5" fill="#1DB954" />
      </g>
    </svg>
  )
}

/** "Keep talking?" both checks land, and the room turns green */
function ISO() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <g className="mp-iso-b" style={{ animationDelay: '150ms' }}>
        <rect x="10" y="44" width="92" height="30" rx="15" fill="#fff" stroke="#EDE6DA" />
        <text x="22" y="63" className="mp-iso-t">so what's the move</text>
      </g>
      <g className="mp-iso-b" style={{ animationDelay: '650ms' }}>
        <rect x="138" y="86" width="94" height="30" rx="15" fill="#FF8000" />
        <text x="150" y="105" className="mp-iso-t w">coffee saturday?</text>
      </g>
      <g className="mp-iso-b" style={{ animationDelay: '1300ms' }}>
        <rect x="50" y="150" width="146" height="40" rx="14" fill="#fff" stroke="#EDE6DA" />
        <text x="64" y="174" className="mp-iso-t k">Keep talking?</text>
        <circle className="mp-iso-ck" style={{ animationDelay: '1900ms' }} cx="160" cy="170" r="8" fill="#00C463" />
        <circle className="mp-iso-ck" style={{ animationDelay: '2250ms' }} cx="179" cy="170" r="8" fill="#00C463" />
      </g>
    </svg>
  )
}

/** a reticle hops between tiles on the board, settling on a target */
function Tactics() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <g className="mp-ret">
        <rect x="-15" y="-15" width="30" height="30" rx="4" fill="none" stroke="#FFD43B" strokeWidth="3" />
        <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#FFD43B" opacity="0.18" />
      </g>
      <g className="mp-hit"><circle cx="104" cy="148" r="16" fill="none" stroke="#FF5A3D" strokeWidth="3" /></g>
    </svg>
  )
}

/** the answer's location pin drops onto the map and settles, a ripple going out */
function Pokemaps() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <ellipse className="mp-pin-sh" cx="150" cy="118" rx="9" ry="3" fill="#000" opacity="0.25" />
      <circle className="mp-ripple" cx="150" cy="118" r="6" fill="none" stroke="#E02B1D" strokeWidth="2" />
      <g className="mp-pin" style={{ transformOrigin: '150px 118px' }}>
        <path d="M150 118 C 139 103, 136 94, 136 89 a 14 14 0 1 1 28 0 c 0 5 -3 14 -14 29 Z" fill="#E02B1D" stroke="#fff" strokeWidth="2.2" />
        <circle cx="150" cy="88.5" r="5" fill="#fff" />
      </g>
    </svg>
  )
}

/** enrichment: brand tiles pop across the field while the count climbs */
function Onapsis() {
  const n = useCount(13000, 2600)
  const tiles = [[150, 18], [180, 40], [204, 18], [16, 168], [44, 190], [190, 170], [214, 196], [120, 196]]
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      {tiles.map(([x, y], i) => <rect key={i} className="mp-tile" style={{ animationDelay: `${i * 160}ms` }} x={x} y={y} width="22" height="22" fill="#5FB3B0" />)}
      <g className="mp-fade" style={{ animationDelay: '300ms' }}>
        <text x="121" y="158" textAnchor="middle" className="mp-on-n">{n.toLocaleString()}</text>
        <text x="121" y="174" textAnchor="middle" className="mp-on-l">contacts enriched</text>
      </g>
    </svg>
  )
}

/** the letters deal in, then the account graph connects beneath them */
function Lila() {
  const nodes = [[40, 160], [86, 182], [128, 150], [170, 178], [210, 156]]
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} fill="#000" />
      {'LILA'.split('').map((c, i) => (
        <text key={i} className="mp-lila-c" style={{ animationDelay: `${i * 110}ms` }} x={30 + i * 61} y="128" textAnchor="middle">{c}</text>
      ))}
      <path className="mp-draw d3" pathLength={1} d={nodes.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" />
      {nodes.map(([x, y], i) => <circle key={i} className="mp-crumb" style={{ animationDelay: `${900 + i * 140}ms` }} cx={x} cy={y} r="3.6" fill="#fff" />)}
    </svg>
  )
}

/** a selection bar walks down the tree */
function Org() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <rect className="mp-sel" x="12" y="0" width="226" height="18" rx="4" fill="#2F6FD8" opacity="0.14" />
      <rect className="mp-sel" x="12" y="0" width="3" height="18" rx="1.5" fill="#2F6FD8" />
    </svg>
  )
}

/** three role cards flip; one of them is the impostor */
function Impostor() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${170 + i * 24} ${190 + (i === 1 ? -5 : 0)}) rotate(${(i - 1) * 8})`}>
          <g className="mp-flip" style={{ animationDelay: `${300 + i * 260}ms` }}>
            <rect x="-14" y="-20" width="28" height="40" rx="4" fill={i === 1 ? '#E02B1D' : '#121110'} />
            <text x="0" y="5" textAnchor="middle" className="mp-imp-t">{i === 1 ? '!' : 'A'}</text>
          </g>
        </g>
      ))}
    </svg>
  )
}

/** steam drifts up from the café */
function Studdy() {
  return (
    <svg className="mp" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} className="mp-steam" style={{ animationDelay: `${i * 350}ms` }} x={108 + (i % 3) * 7} y="118" width="7" height="7" fill="#fff" stroke="#6B4A2A" strokeOpacity="0.35" />)}
    </svg>
  )
}

const POSTERS: Record<string, () => JSX.Element> = {
  f1: F1, media: Media, rl: RL, 'the-dot': Dot, iso: ISO, 'pocket-tactics': Tactics,
  pokemaps: Pokemaps, onapsis: Onapsis, lila: Lila, org: Org, impostor: Impostor, studdy: Studdy,
}

export const hasPoster = (id: string) => id in POSTERS

export default function MotionPoster({ id }: { id: string }) {
  const P = POSTERS[id]
  return P ? <P /> : null
}
