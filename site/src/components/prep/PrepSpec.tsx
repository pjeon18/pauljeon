// The spec-shaped parts of the Prep.io case study: user stories, lo-fi
// wireframes read against the shipped screens, the hot-seat state machine,
// and a hypothetical pilot model. Kept out of PrepMag.tsx so the narrative
// file stays readable.
import React, { useState } from 'react'

// ---------------------------------------------------------------------------
// User stories, one card each, with the check that decides acceptance.

type Status = 'shipped' | 'stubbed' | 'deferred'

interface Story { who: string; story: string; accepted: string[]; status: Status; note?: string }

const STORIES: Story[] = [
  {
    who: 'The explorer',
    story: 'As a sophomore who cannot name the jobs yet, I want to watch a room without an account, so I can leave the moment it is not for me.',
    accepted: ['No public room asks for a login', 'My name appears nowhere until I raise a hand'],
    status: 'shipped',
  },
  {
    who: 'The explorer',
    story: 'I want to wander the floor by field, so I can overhear questions I would not have thought to ask.',
    accepted: ['Eight booths in a fixed floor plan, nothing ranked', 'An empty booth says nobody is live and never pads itself'],
    status: 'shipped',
  },
  {
    who: 'The prepper',
    story: 'As a junior with a superday on Thursday, I want to ask one written question and see where I stand in line.',
    accepted: ['The hand joins a visible queue with my position', 'Lowering my hand leaves the queue immediately'],
    status: 'shipped',
  },
  {
    who: 'The prepper',
    story: 'I want to go deeper with the host right after my answer, without leaving to book somewhere else.',
    accepted: ['The host can offer a private breakout from the hot seat', 'I accept or decline, and payment is a separate third step'],
    status: 'stubbed',
    note: 'payment',
  },
  {
    who: 'The switcher',
    story: 'As a consultant eyeing product, I want to know the host is who they claim, so I can weigh the candor.',
    accepted: ['A badge on every surface a host appears', 'Unverified hosts are marked, never hidden'],
    status: 'shipped',
  },
  {
    who: 'The switcher',
    story: 'I want to find someone two years ahead at a company I am targeting.',
    accepted: ['Searching a company surfaces its people, live rooms and recordings', 'Stated goals drive the Explore shelves, behavior never does'],
    status: 'shipped',
  },
  {
    who: 'The host',
    story: 'As a professional six years in, I want to give one hour and produce nothing else.',
    accepted: ['Going live is a section, a title, now or later, and hand-raise settings', 'The recording chapters itself by question'],
    status: 'stubbed',
    note: 'scheduling',
  },
  {
    who: 'The host',
    story: 'I want to choose who I call on, and to see which questions people paid to raise.',
    accepted: ['Boosted questions pin higher in my queue view', 'Nobody reaches the stage without my click'],
    status: 'shipped',
  },
  {
    who: 'The TA',
    story: 'As a TA for a course of nine hundred, I want office hours to be one link that records itself.',
    accepted: ['A course is one channel, live now, this week, recordings and clips', 'The same raise-hand gate, with no changes'],
    status: 'shipped',
  },
]

const STATUS_LABEL: Record<Status, string> = { shipped: 'Shipped', stubbed: 'Shipped, stub', deferred: 'Deferred' }

export function StoryCards() {
  return (
    <div className="mg-stories mg-rv">
      {STORIES.map((s, i) => (
        <article className="mg-story" key={i}>
          <div className="mg-story-top">
            <span className="mg-story-who">{s.who}</span>
            <span className={'mg-story-status is-' + s.status}>
              {STATUS_LABEL[s.status]}{s.note ? ` (${s.note})` : ''}
            </span>
          </div>
          <p>{s.story}</p>
          <h4>Accepted when</h4>
          <ul>
            {s.accepted.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </article>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Lo-fi wireframes. Four screens of the loop, drawn as boxes at phone size.

const INK = '#8F8B83'
const LINE = '#C9C4B8'
const FILL = '#FFFFFF'
const DIM = '#EEEBE3'

function Box({ x, y, w, h, r = 8, dark = false }: { x: number; y: number; w: number; h: number; r?: number; dark?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={dark ? '#5A5751' : FILL} stroke={dark ? 'none' : LINE} strokeWidth="1.5" />
}
function Bar({ x, y, w, h = 8 }: { x: number; y: number; w: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={DIM} />
}
function Label({ x, y, t, anchor = 'start', tone = INK, size = 13 }: { x: number; y: number; t: string; anchor?: 'start' | 'middle' | 'end'; tone?: string; size?: number }) {
  return <text x={x} y={y} fontSize={size} fontWeight="700" fill={tone} textAnchor={anchor} letterSpacing="0.02em">{t}</text>
}
function Note({ x, y, t }: { x: number; y: number; t: string }) {
  return <text x={x} y={y} fontSize="11.5" fill="#A19D94" fontStyle="italic">{t}</text>
}
function Tabs() {
  return (
    <g>
      <line x1="0" y1="770" x2="390" y2="770" stroke={LINE} />
      {['Home', 'Explore', 'Library', 'Host'].map((t, i) => (
        <g key={t}>
          <rect x={30 + i * 90} y={786} width={30} height={22} rx={6} fill={i === 0 ? '#5A5751' : DIM} />
          <Label x={45 + i * 90} y={830} t={t} anchor="middle" size={11} />
        </g>
      ))}
    </g>
  )
}
function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <svg className="mg-wire" viewBox="0 0 390 844" role="img" aria-label={'Wireframe: ' + title}>
      <rect x="0" y="0" width="390" height="844" fill="#FBFAF6" />
      {children}
    </svg>
  )
}

function WireFair() {
  return (
    <Frame title="the fair floor">
      <Label x={20} y={58} t="prep.io" tone="#121110" size={18} />
      <Box x={120} y={38} w={250} h={30} r={15} />
      <Note x={134} y={58} t="search a company or a person" />
      <Label x={20} y={112} t="LIVE NOW" size={11} />
      <Box x={20} y={124} w={168} h={96} r={10} dark />
      <rect x={30} y={134} width={40} height={16} rx={8} fill="#B0402D" />
      <Box x={202} y={124} w={168} h={96} r={10} dark />
      <rect x={212} y={134} width={40} height={16} rx={8} fill="#B0402D" />
      <Bar x={20} y={232} w={150} />
      <Bar x={202} y={232} w={130} />
      <Note x={20} y={262} t="count comes from the simulation, never typed in" />
      <Label x={20} y={304} t="THIS WEEK" size={11} />
      {[0, 1].map((i) => (
        <g key={i}>
          <Box x={20} y={316 + i * 62} w={350} h={50} />
          <Bar x={34} y={330 + i * 62} w={180} />
          <Bar x={34} y={346 + i * 62} w={110} h={6} />
          <rect x={300} y={330 + i * 62} width={56} height={20} rx={10} fill={DIM} />
        </g>
      ))}
      <Label x={20} y={468} t="THE FLOOR" size={11} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i}>
          <Box x={20 + (i % 2) * 180} y={480 + Math.floor(i / 2) * 66} w={170} h={54} />
          <Bar x={34 + (i % 2) * 180} y={498 + Math.floor(i / 2) * 66} w={80} />
          {i === 0 && <circle cx={176} cy={492} r={4} fill="#B0402D" />}
        </g>
      ))}
      <Note x={20} y={758} t="one booth is stocked, seven are honestly thin" />
      <Tabs />
    </Frame>
  )
}

function WireRoom({ hotseat = false }: { hotseat?: boolean }) {
  return (
    <Frame title={hotseat ? 'the hot seat' : 'a live room'}>
      <Box x={0} y={0} w={390} h={360} r={0} dark />
      <rect x={20} y={20} width={44} height={18} rx={9} fill="#B0402D" />
      <text x={70} y={34} fontSize="11" fill="#D9D5CB">134 watching</text>
      <circle cx={195} cy={150} r={54} fill="#8C877D" />
      <path d="M60 260 q20 -30 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#D9D5CB" strokeWidth="3" />
      <text x={20} y={318} fontSize="11.5" fill="#A19D94" fontStyle="italic">camera mocked, on purpose</text>
      {hotseat && (
        <g>
          <rect x={20} y={286} width={350} height={44} rx={8} fill="#B0402D" />
          <text x={195} y={313} fontSize="13" fontWeight="800" fill="#FFFFFF" textAnchor="middle">YOU'RE ON THE HOT SEAT</text>
        </g>
      )}
      <Bar x={20} y={380} w={230} h={12} />
      <rect x={20} y={402} width={64} height={18} rx={9} fill="#1C5C41" />
      <Note x={94} y={416} t="verified role, the only green" />
      {hotseat ? (
        <g>
          <Box x={20} y={440} w={350} h={70} />
          <Label x={34} y={462} t="YOUR QUESTION" size={10} />
          <Bar x={34} y={476} w={300} />
          <Bar x={34} y={492} w={200} />
          <Note x={20} y={536} t="answered in front of the room" />
        </g>
      ) : (
        <g>
          <Label x={20} y={456} t="2 IN QUEUE" size={10} />
          <Box x={20} y={466} w={350} h={40} />
          <Bar x={34} y={482} w={220} />
        </g>
      )}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={30} cy={562 + i * 40} r={9} fill={DIM} />
          <Bar x={48} y={556 + i * 40} w={80 + (i % 3) * 60} />
          <Bar x={48} y={570 + i * 40} w={40} h={5} />
        </g>
      ))}
      <Box x={20} y={718} w={hotseat ? 350 : 250} h={40} r={20} />
      {hotseat ? (
        <Label x={195} y={744} t="Step down" anchor="middle" tone="#121110" />
      ) : (
        <g>
          <Note x={36} y={743} t="say something" />
          <rect x={282} y={718} width={88} height={40} rx={20} fill="#121110" />
          <Label x={326} y={744} t="Raise hand" anchor="middle" tone="#FFFFFF" size={11} />
        </g>
      )}
      <Tabs />
    </Frame>
  )
}

function WireSheet() {
  return (
    <Frame title="the raise-hand sheet">
      <Box x={0} y={0} w={390} h={360} r={0} dark />
      <rect x={0} y={0} width={390} height={844} fill="#121110" opacity="0.45" />
      <rect x={0} y={330} width={390} height={514} rx={28} fill="#FBFAF6" />
      <rect x={165} y={344} width={60} height={5} rx={3} fill={LINE} />
      <Label x={20} y={392} t="Raise your hand" tone="#121110" size={22} />
      <Note x={20} y={418} t="your question joins a visible queue" />
      <Note x={20} y={436} t="your name appears for the first time here" />
      <Box x={20} y={456} w={350} h={110} />
      <Note x={34} y={482} t="one written question" />
      <Label x={20} y={604} t="BOOST, OPTIONAL" size={10} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={20 + i * 84} y={616} width={74} height={30} rx={15} fill={FILL} stroke={LINE} strokeWidth="1.5" />
          <Label x={57 + i * 84} y={636} t={`${(i + 1) * 50} pts`} anchor="middle" size={11} />
        </g>
      ))}
      <Note x={20} y={676} t="pins higher in the host's view, pays the host" />
      <Note x={20} y={694} t="it never buys the stage" />
      <rect x={20} y={722} width={350} height={48} rx={24} fill="#121110" />
      <Label x={195} y={752} t="Raise it" anchor="middle" tone="#FFFFFF" size={14} />
    </Frame>
  )
}

export interface WireShots { fair: string; room: string; sheet: string; hotseat: string }

export function Wireframes({ shots }: { shots: WireShots }) {
  const pairs: { name: string; wire: React.ReactNode; shot: string; cap: string }[] = [
    { name: 'The fair', wire: <WireFair />, shot: shots.fair, cap: 'Live rooms, the week, the floor. The booth with a dot is the one that is stocked.' },
    { name: 'The room', wire: <WireRoom />, shot: shots.room, cap: 'Stage on top, chat below, the hand-raise button in the composer. Watching asks for nothing.' },
    { name: 'The sheet, then the queue', wire: <WireSheet />, shot: shots.sheet, cap: 'The sheet asks for one written question and prints the rule under it. What ships after it is the queued state, position shown.' },
    { name: 'The hot seat', wire: <WireRoom hotseat />, shot: shots.hotseat, cap: 'A banner that stays up while you have the floor, then a step-down button.' },
  ]
  return (
    <div className="mg-wires mg-rv">
      {pairs.map((p) => (
        <figure className="mg-wirepair" key={p.name}>
          <div className="mg-wire-name">{p.name}</div>
          {p.wire}
          <img src={p.shot} alt={p.name + ', as shipped'} loading="lazy" />
          <figcaption>{p.cap}</figcaption>
        </figure>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// The hot-seat state machine, drawn with every exit labeled.

export function HotSeatStates() {
  const nodes = [
    { x: 30, label: 'In the crowd', sub: 'anonymous, free' },
    { x: 220, label: 'Queued', sub: 'position visible' },
    { x: 410, label: 'Hot seat', sub: 'one at a time', hero: true },
    { x: 600, label: 'Answered', sub: 'becomes a chapter' },
  ]
  const W = 150
  const Y = 118
  const H = 62
  return (
    <svg className="mg-chart" viewBox="0 0 790 320" role="img" aria-label="The hot-seat state machine">
      <defs>
        <marker id="hsArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#8F8B83" />
        </marker>
        <marker id="hsArrAcc" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#B0402D" />
        </marker>
      </defs>
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={Y} width={W} height={H} rx={12} fill={n.hero ? '#B0402D' : '#FFFFFF'} stroke={n.hero ? 'none' : '#DBD5C7'} strokeWidth="1.5" />
          <text x={n.x + W / 2} y={Y + 27} textAnchor="middle" fontSize="15" fontWeight="800" fill={n.hero ? '#FFFFFF' : '#121110'}>{n.label}</text>
          <text x={n.x + W / 2} y={Y + 46} textAnchor="middle" fontSize="11.5" fill={n.hero ? '#F3D9D2' : '#8F8B83'}>{n.sub}</text>
        </g>
      ))}
      {/* forward edges */}
      <line x1={180} y1={Y + 31} x2={218} y2={Y + 31} stroke="#8F8B83" strokeWidth="1.5" markerEnd="url(#hsArr)" />
      <text x={199} y={Y - 10} textAnchor="middle" fontSize="11" fill="#55524B">you raise a hand</text>
      <line x1={370} y1={Y + 31} x2={408} y2={Y + 31} stroke="#B0402D" strokeWidth="1.5" markerEnd="url(#hsArrAcc)" />
      <text x={389} y={Y - 10} textAnchor="middle" fontSize="11" fill="#96311F" fontWeight="700">the host clicks</text>
      <line x1={560} y1={Y + 31} x2={598} y2={Y + 31} stroke="#8F8B83" strokeWidth="1.5" markerEnd="url(#hsArr)" />
      <text x={579} y={Y - 10} textAnchor="middle" fontSize="11" fill="#55524B">step down</text>
      {/* exits back to the crowd */}
      <path d={`M295 ${Y + H} v46 H105 v-40`} fill="none" stroke="#8F8B83" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#hsArr)" />
      <text x={200} y={Y + H + 62} textAnchor="middle" fontSize="11" fill="#55524B">you lower it, or the host dismisses it</text>
      <path d={`M485 ${Y + H} v76 H105 v-70`} fill="none" stroke="#8F8B83" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#hsArr)" />
      <text x={295} y={Y + H + 92} textAnchor="middle" fontSize="11" fill="#55524B">back in the crowd after the answer</text>
      {/* session ends mid seat */}
      <path d={`M485 ${Y} v-58 H675 v56`} fill="none" stroke="#8F8B83" strokeWidth="1.5" markerEnd="url(#hsArr)" />
      <text x={580} y={Y - 66} textAnchor="middle" fontSize="11" fill="#55524B">session ends mid seat, still credited</text>
      {/* guard note */}
      <text x={30} y={302} fontSize="11.5" fill="#A19D94" fontStyle="italic">
        The only arrow into the hot seat starts at Queued. A boost changes where a hand sits in the host's list, not which arrows exist.
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// A hypothetical pilot. One series, two reference lines, hover for the week.

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
        <path d={path} fill="none" stroke="#B0402D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {WEEKS.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={hi === i ? 6 : 4} fill="#B0402D" stroke="#FDFDFB" strokeWidth="2" />
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
            <text x="12" y="54" fontSize="11" fill="#B9B4A8">{RAISED[hi]} hands raised</text>
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
