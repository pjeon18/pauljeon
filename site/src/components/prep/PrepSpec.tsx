// The pilot model on the Prep.io case study: what a twelve-week campus
// pilot would have to show. The numbers are a model, labeled as unmeasured.
import { useState } from 'react'

const WEEKS = [14, 26, 38, 49, 57, 63, 71, 74, 68, 59, 47, 36]
const HOSTS = [8, 10, 11, 12, 12, 12, 12, 11, 11, 10, 9, 9]
const RAISED = WEEKS.map((v) => Math.round(v / 0.7))

export function PilotChart() {
  const [hi, setHi] = useState<number | null>(null)
  const W = 760
  const H = 340
  const padL = 48
  const padR = 160
  const padT = 26
  const padB = 44
  const iw = W - padL - padR
  const ih = H - padT - padB
  const maxY = 90
  const x = (i: number) => padL + (i / (WEEKS.length - 1)) * iw
  const y = (v: number) => padT + ih - (v / maxY) * ih
  const path = WEEKS.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const ticks = [0, 30, 60, 90]
  const last = WEEKS.length - 1

  return (
    <div className="mg-pilot">
      <svg className="mg-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Questions answered live per week, a twelve-week pilot model"
        onMouseLeave={() => setHi(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} y1={y(t)} x2={padL + iw} y2={y(t)} stroke="#EDEBE5" />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#8F8B83">{t}</text>
          </g>
        ))}
        {WEEKS.map((_, i) => (
          <text key={i} x={x(i)} y={H - 18} textAnchor="middle" fontSize="11" fill="#8F8B83">{i + 1}</text>
        ))}
        <text x={padL + iw / 2} y={H - 2} textAnchor="middle" fontSize="11" fill="#A19D94">week of the pilot</text>
        {/* reference lines */}
        <line x1={padL} y1={y(60)} x2={padL + iw} y2={y(60)} stroke="#8F8B83" strokeDasharray="5 5" />
        <text x={padL + iw + 10} y={y(60) + 4} fontSize="11" fill="#55524B" fontWeight="700">target, 60 a week</text>
        <line x1={padL} y1={y(25)} x2={padL + iw} y2={y(25)} stroke="#8F8B83" strokeDasharray="2 5" />
        <text x={padL + iw + 10} y={y(25) + 4} fontSize="11" fill="#55524B" fontWeight="700">stop line, 25</text>
        <line x1={x(5)} y1={padT} x2={x(5)} y2={padT + ih} stroke="#EDEBE5" strokeDasharray="3 4" />
        <text x={x(5)} y={padT - 8} textAnchor="middle" fontSize="11" fill="#A19D94">week six check</text>
        {/* the series */}
        <path d={path} fill="none" stroke="#0f5c3b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {WEEKS.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={hi === i ? 6 : 4} fill="#0f5c3b" stroke="#FDFDFB" strokeWidth="2" />
            <rect x={x(i) - iw / (WEEKS.length - 1) / 2} y={padT} width={iw / (WEEKS.length - 1)} height={ih} fill="transparent"
              onMouseEnter={() => setHi(i)} onFocus={() => setHi(i)} tabIndex={0} aria-label={`Week ${i + 1}, ${v} questions answered`} />
          </g>
        ))}
        <text x={x(last) + 12} y={y(WEEKS[last]) + 4} fontSize="12" fontWeight="800" fill="#121110">questions answered</text>
        {/* tooltip */}
        {hi !== null && (
          <g transform={`translate(${Math.min(x(hi) + 12, padL + iw - 150)}, ${Math.max(y(WEEKS[hi]) - 70, padT)})`}>
            <rect width="150" height="62" rx="8" fill="#121110" />
            <text x="12" y="20" fontSize="11" fill="#B9B4A8">week {hi + 1} · {HOSTS[hi]} hosts live</text>
            <text x="12" y="39" fontSize="13" fontWeight="800" fill="#FDFDFB">{WEEKS[hi]} answered</text>
            <text x="12" y="54" fontSize="11" fill="#B9B4A8">{RAISED[hi]} questions asked</text>
          </g>
        )}
      </svg>
      <details className="mg-details mg-pilot-table">
        <summary>The same numbers as a table</summary>
        <div className="mg-table mg-table-3" style={{ margin: '0 22px 18px' }}>
          <div className="mg-tr mg-th"><span>Week</span><span>Hosts live</span><span>Hands raised · answered</span></div>
          {WEEKS.map((v, i) => (
            <div className="mg-tr" key={i}><span>{i + 1}</span><span>{HOSTS[i]}</span><span>{RAISED[i]} · {v}</span></div>
          ))}
        </div>
      </details>
    </div>
  )
}
