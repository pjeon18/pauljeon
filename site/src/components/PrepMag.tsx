// The Prep.io case study, magazine edition. Structure follows the decision
// log in the project's own CONCEPT.md, because the interesting story here is
// eighteen dated decisions and the two that reversed.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import '../styles/mag.css'

import mSplash from '../assets/prep-m-splash.png'
import mFair from '../assets/prep-m-fair.png'
import mExplore from '../assets/prep-m-explore.png'
import mRoom from '../assets/prep-m-room.png'
import mRoomHand from '../assets/prep-m-room-hand.png'
import mHotseat from '../assets/prep-m-room-hotseat.png'
import mCommit from '../assets/prep-m-event-commit.png'
import mPremium from '../assets/prep-m-premium.png'
import mVerify from '../assets/prep-m-verify.png'
import mSettings from '../assets/prep-m-settings.png'
import mGrace from '../assets/prep-m-profile-grace.png'
import dFair from '../assets/prep-d-fair.png'
import dExplore from '../assets/prep-d-explore.png'
import dRoomQueue from '../assets/prep-d-room-queue.png'
import dVod from '../assets/prep-d-vod.png'
import dVodLocked from '../assets/prep-d-vod-locked.png'
import dMaya from '../assets/prep-d-profile-maya.png'
import dHostLive from '../assets/prep-d-host-live.png'
import dRecap from '../assets/prep-d-host-recap.png'
import dCampus from '../assets/prep-d-campus.png'
import dCourse from '../assets/prep-d-course.png'
import dSparse from '../assets/prep-d-section-sparse.png'
import dLibrary from '../assets/prep-d-library.png'

// ---------------------------------------------------------------------------

function useReveals() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = root.current?.querySelectorAll('.mg-rv') ?? []
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return root
}

function useProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight)
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return bar
}

// ---------------------------------------------------------------------------
// The market, mapped on the two axes that matter.

function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; hero?: boolean; end?: boolean }[] = [
    { x: 14, y: 16, label: 'Recorded content', sub: 'YouTube, TikTok, unverifiable' },
    { x: 22, y: 74, label: 'ADPList', sub: '40k+ mentors, all unpaid' },
    { x: 36, y: 86, label: 'Intro.co', sub: '$100–$2,000 an hour', end: false },
    { x: 76, y: 20, label: 'Twitch', sub: '300k+ concurrent, no career taxonomy', end: true },
    { x: 44, y: 40, label: 'Career centers', sub: 'their events are webinars' },
    { x: 82, y: 78, label: 'Prep.io', sub: 'live, drop-in, many-to-one', hero: true, end: true },
  ]
  return (
    <svg className="mg-chart" viewBox="0 0 640 460" role="img" aria-label="Market map: liveness versus verified context">
      <defs>
        <marker id="pgArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#B9B4A8" />
        </marker>
      </defs>
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <rect x="340" y="20" width="270" height="190" fill="#F1F6F3" opacity="0.85" />
      <text x="595" y="42" textAnchor="end" fontSize="11.5" fill="#1C5C41" fontStyle="italic">
        live, and vouched for
      </text>
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" markerEnd="url(#pgArr)" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" markerEnd="url(#pgArr)" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">recorded or scheduled</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">live and drop-in</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">anyone can claim it</text>
      <text x="58" y="150" fontSize="12" fill="#38352F" transform="rotate(-90 58 150)" fontWeight="700">verified credentials</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + ((100 - d.y) / 100) * 380
        const tx = d.end ? cx - 17 : cx + 17
        const anchor = d.end ? 'end' : 'start'
        return (
          <g key={d.label}>
            <circle cx={cx} cy={cy} r={d.hero ? 9 : 6} fill={d.hero ? '#B0402D' : '#38352F'} opacity={d.hero ? 1 : 0.75} />
            {d.hero && <circle cx={cx} cy={cy} r="15" fill="none" stroke="#B0402D" strokeDasharray="3 3" />}
            <text x={tx} y={cy - 1} textAnchor={anchor} fontSize="13.5" fontWeight="800" fill="#121110">{d.label}</text>
            <text x={tx} y={cy + 13} textAnchor={anchor} fontSize="11" fill="#8F8B83">{d.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// The funnel, drawn as the narrowing it actually is.

function Funnel() {
  const rows = [
    { w: 100, label: 'Lurk in the crowd', sub: 'free, anonymous, no signup wall', tone: '#EFEDE7' },
    { w: 78, label: 'Raise a hand', sub: 'a written question, opt-in, publicly queued', tone: '#E4E9F2' },
    { w: 54, label: 'The hot seat', sub: 'answered in front of the room, so everyone learns', tone: '#F4E2DC' },
    { w: 32, label: 'Breakout', sub: 'private, paid, and only if both sides accept', tone: '#DDEAE2' },
  ]
  return (
    <div className="mg-rv" style={{ margin: '10px 0 26px' }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
          <div
            style={{
              width: `${r.w}%`, background: r.tone, borderRadius: 12,
              padding: '16px 20px', display: 'flex', alignItems: 'baseline', gap: 14,
              border: '1px solid rgba(18,17,16,0.07)',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: '#A19D94' }}>{i + 1}</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', color: '#121110' }}>{r.label}</span>
            <span style={{ fontSize: 13, color: '#55524B' }}>{r.sub}</span>
          </div>
        </div>
      ))}
      <p style={{ fontSize: 12.5, color: '#8F8B83', margin: '4px 2px 0', lineHeight: 1.6 }}>
        Every step down is a mutual opt-in. The gate between steps two and three lives in the state
        store, which is what made it safe to sell attention at step two.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------

const REFS = [
  {
    img: dFair,
    name: 'The fair floor',
    stat: 'eight booths, one rich on purpose',
    line: 'Career sections you can wander. Finance is stocked and the other seven are honestly thin, which is what a real cold start looks like.',
  },
  {
    img: dRoomQueue,
    name: 'The live room',
    stat: 'stage left, chat right',
    line: 'Twitch geometry with a queue instead of a free-for-all. The footer states the rule: questions go through the queue, not DMs.',
  },
  {
    img: dVod,
    name: 'The recording',
    stat: 'chaptered by question',
    line: 'Every answered hot seat becomes a chapter, so the session keeps answering after everyone logs off.',
  },
  {
    img: dCampus,
    name: 'Campus mode',
    stat: 'a second audience, same machinery',
    line: 'Professors holding office hours. Raise your hand and get called on is what office hours already are, so the consent gate needed no changes.',
  },
]

function RefCarousel() {
  const [i, setI] = useState(0)
  const n = REFS.length
  const go = (d: number) => setI((v) => (v + d + n) % n)
  return (
    <div className="mg-carousel mg-rv">
      <div className="mg-caro-stage">
        {REFS.map((r, j) => {
          let off = j - i
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const cls = off === 0 ? 'is-focus' : Math.abs(off) === 1 ? 'is-side' : 'is-hidden'
          return (
            <div
              className={'mg-caro-card ' + cls}
              key={r.name}
              style={{ transform: `translateX(${off * 72}%) scale(${off === 0 ? 1 : 0.82})` }}
              onClick={() => off !== 0 && setI(j)}
            >
              <img src={r.img} alt={r.name} loading="lazy" />
              <div className="mg-caro-body">
                <div className="mg-caro-name">{r.name}</div>
                <div className="mg-caro-stat">{r.stat}</div>
                <p>{r.line}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mg-caro-nav">
        <button onClick={() => go(-1)} aria-label="Previous">←</button>
        <div className="mg-caro-dots">
          {REFS.map((x, j) => (
            <button key={x.name} className={j === i ? 'on' : ''} onClick={() => setI(j)} aria-label={x.name} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next">→</button>
      </div>
    </div>
  )
}

interface Fix { quote: string; fix: string; lesson: string }

const LEDGER: Fix[] = [
  {
    quote: 'The whole thing reads as generated and generic',
    fix: 'The first build was navy and amber, dark everywhere, and looked like every AI-designed product of the last two years. Rebuilt around paper and ink, with one dark theater scope for live rooms, a serif display face, and three semantic color roles.',
    lesson: 'A palette that could belong to any product belongs to none. Picking a register on purpose beats any amount of polish.',
  },
  {
    quote: 'Ambient color behind the thumbnails looks like smudges',
    fix: 'The ambient gradient sat at 0.16 alpha in dark mode and read as coloured stains behind the video tiles. Dialed down to 0.05.',
    lesson: 'On a video platform the thumbnails are the content. Chrome with a hue fights them, which is why the glass is neutral and the dark theme is graphite.',
  },
  {
    quote: 'Course chips in the sidebar read CS5, STA and EC1',
    fix: 'Truncation was cutting mid-token. Chips now render letters only, so they read CS, STAT and EC.',
    lesson: 'Truncating an identifier produces a different identifier. Drop a whole component instead of half a word.',
  },
  {
    quote: 'A campus URL opens with careers navigation around it',
    fix: 'Mode was persisted rather than derived from the route, so a course link opened inside the careers shell. Mode now follows the route.',
    lesson: 'Anything a deep link can contradict belongs in the URL, not in memory. Persisted state and shareable links are natural enemies.',
  },
  {
    quote: 'A campus room is full of recruiting chatter',
    fix: 'The crowd simulation drew from the careers line pool everywhere. Campus rooms now have their own pool, and campus search its own index.',
    lesson: 'Two audiences on one platform need separate data islands, or one leaks into the other and undermines both.',
  },
  {
    quote: 'A wrapped meta line can start with a floating separator',
    fix: 'The middle dot between metadata items could land at the start of a wrapped line. Separators are now emitted between items rather than appended to them.',
    lesson: 'Small, but this is the class of detail that decides whether a page reads as crafted. It only appears at certain widths.',
  },
]

// ---------------------------------------------------------------------------

export default function PrepMag() {
  const root = useReveals()
  const bar = useProgress()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="mag" ref={root} style={{ ['--acc' as string]: '#B0402D', ['--acc-deep' as string]: '#96311F', ['--acc-tint' as string]: '#F9EDE9' }}>
      <div className="mg-progress" ref={bar} />

      <nav className="case-nav mg-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← All work</Link>
      </nav>

      {/* ---------------- masthead ---------------- */}
      <header className="mg-masthead">
        <div className="mg-kicker mg-rv">Product case study · shipped prototype · 2026</div>
        <h1 className="mg-rv">
          Office hours,<br /><em>made live</em>
        </h1>
        <p className="mg-dek mg-rv">
          A live streaming platform shaped like a college club fair. Verified professionals hold
          drop-in office hours. You move from lurking in the crowd, to the hot seat, to a paid one on
          one. Eighteen dated decisions took it from a pitch to a deployed prototype, and two of them
          reversed.
        </p>
        <div className="mg-meta mg-rv">
          <span><b>Role</b> product, design, engineering, solo</span>
          <span><b>Stack</b> React · TypeScript · Zustand · Framer Motion</span>
          <span className="mg-meta-links">
            <a href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">Open the prototype ↗</a>
            <a href="https://github.com/pjeon18/prep-io" target="_blank" rel="noreferrer">GitHub ↗</a>
          </span>
        </div>
      </header>

      <figure className="mg-bleed mg-rv">
        <img src={dFair} alt="The Prep.io fair floor" />
        <figcaption>
          The fair floor on desktop. Live rooms first, then events, then the eight career booths you
          can wander through without an account.
        </figcaption>
      </figure>

      {/* ---------------- product first ---------------- */}
      <section className="mg-part mg-productfirst">
        <div className="mg-partmark mg-rv"><span>◆</span> The product, in one minute</div>
        <div className="mg-product-grid mg-rv">
          <div className="mg-product-what">
            <h2>Walk in, listen, raise your hand</h2>
            <ul>
              <li>Browse a floor of live rooms by career. <b>No signup to watch.</b></li>
              <li>Every host carries a badge, and so does the absence of one.</li>
              <li>Raise a hand with a written question. It joins a visible queue.</li>
              <li>The host calls on you and answers <b>in front of the room</b>, so two hundred people learn from your question.</li>
              <li>Afterwards the host can offer a private breakout. Both sides have to accept.</li>
            </ul>
            <a className="mg-playbtn" href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">
              Open the prototype
            </a>
          </div>
          <figure className="mg-product-shot mg-phone">
            <img src={mHotseat} alt="The hot seat moment" loading="lazy" />
          </figure>
        </div>
        <div className="mg-shots mg-rv" style={{ marginTop: 34 }}>
          <figure><img src={mSplash} alt="The splash screen" loading="lazy" /><figcaption>Two doors, and a promise that watching needs no account.</figcaption></figure>
          <figure><img src={mFair} alt="The fair on mobile" loading="lazy" /><figcaption>The same floor on mobile, with a bottom tab shell instead of a sidebar.</figcaption></figure>
          <figure><img src={mRoom} alt="A live room on mobile" loading="lazy" /><figcaption>A room mid-session. The stage is honest about being a mock rather than faking a webcam.</figcaption></figure>
          <figure><img src={mRoomHand} alt="A raised hand in the queue" loading="lazy" /><figcaption>Your question, publicly queued, with your position shown.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 01 the gap ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>01</span> The gap</div>
        <h2 className="mg-rv">Career advice is stuck at two extremes</h2>
        <div className="mg-cols mg-rv">
          <p>
            One side is recorded content. Passive, engagement-optimized, and impossible to verify.
            Anyone can claim to be a Goldman analyst.
          </p>
          <p>
            The other is booked one to one mentorship. Genuinely good, and no leverage at all. One
            hour helps one person, behind booking friction and the social cost of asking a stranger
            for thirty minutes.
          </p>
          <p>
            The user this fails hardest is the one nobody builds for. A sophomore who does not know
            what an analyst does all day <b>cannot form the question</b> a one-to-one platform
            requires.
          </p>
          <p>
            They do not need an appointment. They need to wander and overhear.
          </p>
        </div>

        <div className="mg-stats mg-rv">
          <div><span className="v">$16.5B</span><span className="l">career coaching market, growing about 8.5% a year</span></div>
          <div><span className="v">40k+</span><span className="l">verified mentors on ADPList, working for free. Supply exists.</span></div>
          <div><span className="v">$100–2,000</span><span className="l">per hour at the top of Intro.co. Demand exists too.</span></div>
          <div><span className="v">300k+</span><span className="l">average concurrent viewers on Twitch Just Chatting. Live talk retains at scale.</span></div>
          <div><span className="v">~19M</span><span className="l">US college students, before counting early-career switchers</span></div>
          <div><span className="v">0</span><span className="l">platforms owning live, drop-in, many-to-one</span></div>
        </div>

        <div className="mg-statement mg-band mg-band-dark mg-rv">
          <p>Mentorship is scheduled and private. Content is recorded and public.</p>
          <p className="mg-statement-sub">
            Every player owns exactly one layer. ADPList owns supply, Intro owns pricing, Twitch owns
            liveness, LinkedIn owns the network and kills candor by being performative. Nobody
            connects them.
          </p>
          <p className="mg-statement-big">The professor's office hours has <em>no online home</em>.</p>
        </div>

        <figure className="mg-figure mg-rv">
          <MarketMap />
          <figcaption>
            Two axes decide this market. Whether it happens live, and whether you can trust who is
            talking. The top-right corner needs both, which is why it stays empty.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- 02 the people ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>02</span> The people</div>
        <h2 className="mg-rv">A marketplace with two sides and three kinds of demand</h2>
        <p className="mg-lede mg-rv">
          Three viewer personas who want incompatible things. That is why the product is a funnel
          rather than a feature. One wants to lurk forever, one wants help before Thursday, one wants
          candor from someone two years ahead.
        </p>

        <div className="mg-personas mg-rv">
          <article className="mg-persona">
            <header>The explorer · sophomore</header>
            <p className="mg-persona-quote">"I don't know what these jobs actually are."</p>
            <p className="mg-persona-bio">
              Browses the floor, lurks, leaves without commitment. Cannot yet form a question worth
              booking a call about.
            </p>
            <h4>What they need</h4>
            <ul>
              <li>To wander without signing up</li>
              <li>To overhear other people's questions</li>
              <li>Permission to leave</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> Every platform demands a specific ask before it will show them anything.</p>
          </article>

          <article className="mg-persona">
            <header>The prepper · junior</header>
            <p className="mg-persona-quote">"I have a superday next week."</p>
            <p className="mg-persona-bio">
              Needs targeted, interactive help right now. Will raise a hand, and will pay for a
              private breakout if the answer is good.
            </p>
            <h4>What they need</h4>
            <ul>
              <li>A real person, live, this week</li>
              <li>Their specific question answered</li>
              <li>A way to go deeper immediately</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> Booking a mentor takes longer than the deadline they are racing.</p>
          </article>

          <article className="mg-persona">
            <header>The switcher · 27, consulting</header>
            <p className="mg-persona-quote">"I want what it's really like, not a coach."</p>
            <p className="mg-persona-bio">
              Eyeing product management. Wants candor from someone two years ahead rather than a
              polished three hundred dollar an hour session.
            </p>
            <h4>What they need</h4>
            <ul>
              <li>Unfiltered detail about the day to day</li>
              <li>Someone recent enough to remember the switch</li>
              <li>Affordable exploration</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> The honest version of this conversation only happens off the record, and no platform hosts it.</p>
          </article>
        </div>

        <h3 className="mg-subhead mg-rv">And the other side of the market</h3>
        <div className="mg-serves mg-rv">
          <div className="mg-serve">
            <span>the young professional</span>
            <p>
              Two to six years in. Wants to mentor with <b>leverage</b> rather than repeat the same
              answer forty times, and would like the income. What they do not want is to become a
              content creator.
            </p>
            <p>
              So the product asks for an hour of talking and nothing else. No editing, no thumbnails,
              no posting schedule. The room records and chapters itself.
            </p>
          </div>
          <div className="mg-serve">
            <span>the domain personality</span>
            <p>
              Recruiters, admissions consultants, portfolio reviewers. They already sell expertise
              and need a funnel rather than an audience. The hot seat is that funnel, and it is honest
              about being one. Public answers build the case for the private session.
            </p>
          </div>
          <div className="mg-serve">
            <span>the institution</span>
            <p>
              Career centers and alumni offices buying branded fairs. This is the business wedge and
              the cold-start answer, because an institution brings both sides of the marketplace on
              the same afternoon.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 03 the funnel ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#F6F1EC' }}>
        <div className="mg-partmark mg-rv"><span>03</span> The funnel</div>
        <h2 className="mg-rv">One shape, four steps, consent at every gate</h2>
        <Funnel />
        <div className="mg-cols mg-rv">
          <p>
            Each layer feeds the next, and each competitor owns only one. Lurking stays free and
            anonymous forever, because the explorer dies at a signup wall.
          </p>
          <p>
            Raising a hand is the first time your name appears anywhere. The privacy settings say so.
            <em>"You watch anonymously. Your name appears only when you raise your hand."</em>
          </p>
          <p>
            The hot seat makes the economics work. One question answered in front of two hundred
            people is the leverage the host came for and the overhearing the explorer came for, from
            the same minute of work.
          </p>
        </div>
        <div className="mg-shots mg-shots-3 mg-rv">
          <figure><img src={mRoom} alt="Lurking in a room" loading="lazy" /><figcaption>Step one. Watching costs nothing and asks for nothing.</figcaption></figure>
          <figure><img src={mRoomHand} alt="Hand raised, queued" loading="lazy" /><figcaption>Step two. The queue is visible, and your position in it is honest.</figcaption></figure>
          <figure><img src={mHotseat} alt="On the hot seat" loading="lazy" /><figcaption>Step three. A threshold moment with its own overlay, then a persistent on-air banner.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 04 the invariant ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>04</span> The rules, in code</div>
        <h2 className="mg-rv">Where money is allowed to touch the product</h2>
        <p className="mg-lede mg-rv">
          The founding principle is one sentence. <b>Monetize the host's time and tools, never viewer
          visibility and never placement.</b> Easy to write, easy to violate by accident, so it lives
          in the state layer where a future screen cannot route around it.
        </p>

        <div className="mg-split mg-rv">
          <div className="mg-split-col is-hi">
            <div className="mg-split-tag">What it sells</div>
            <h3>Time and tools</h3>
            <ul>
              <li>Private breakouts at the host's own rate, per fifteen minutes</li>
              <li>Boosts that pin a question higher <b>in the host's view</b></li>
              <li>A viewer subscription for the library and study tools</li>
              <li>Channel memberships, and ticketed events with real capacity</li>
            </ul>
            <p>Boost points pay the host. That is the entire mechanism.</p>
          </div>
          <div className="mg-split-col">
            <div className="mg-split-tag">What it refuses</div>
            <h3>Attention it did not earn</h3>
            <ul>
              <li>Promoted placement anywhere in discovery</li>
              <li>Paid discovery boosts</li>
              <li>Viewer-side paywalls on public rooms</li>
              <li>Any path to the stage that skips the host's pick</li>
            </ul>
            <p>Nothing in discovery reads a payment flag, and that is verified by grep rather than by memory.</p>
          </div>
        </div>

        <div className="mg-decision mg-rv">
          <div className="mg-decision-tag">Decision record · the one that needed the most care</div>
          <p>
            <b>Boosts raise visibility, never buy the stage.</b> The obvious version is a super chat.
            Pay more, get answered. It funds the host immediately and destroys the thing the product
            is selling, which is that the queue is fair.
          </p>
          <p>
            What shipped instead pins your question higher <em>in the host's queue view</em> and pays
            the points to the host. Promotion still requires the host's explicit pick, and the only
            route onto the stage is a hand you raised yourself.
          </p>
          <p>
            The simulated host models this honestly rather than flattering it, taking the top boosted
            question about seventy percent of the time, because a boosted question genuinely is more
            visible.
          </p>
          <p>
            The principle was <b>amended rather than repealed</b>. Money may buy the host's
            attention, never a place on stage or in discovery. The raise-hand sheet says it out loud,
            so the user can hold the product to it.
          </p>
        </div>

        <details className="mg-details mg-rv">
          <summary>Engineering notes: the invariants the store actually holds</summary>
          <ul>
            <li><b>One room at a time.</b> Joining a second room returns early rather than tearing down the first.</li>
            <li><b>Archives can never fake liveness.</b> A recording refuses to open as a live session, checked by kind rather than by a flag.</li>
            <li><b>The consent gate.</b> Only a queued hand can be promoted, one hot seat at a time. There is no code path that puts a person on stage without a hand they raised.</li>
            <li><b>Breakouts need two consents.</b> The host offers, the viewer accepts, and payment is a third separate step.</li>
            <li><b>Live state is deliberately not persisted.</b> Saving a live room would resurrect fake liveness on reload, so the room is excluded from the saved slice.</li>
            <li><b>There is no direct-message shape in the store at all.</b> The absence is the feature.</li>
            <li>Capacity, duplicate tickets, and empty questions are all refused in the action rather than disabled in the interface.</li>
          </ul>
        </details>
      </section>

      {/* ---------------- 05 trust ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#F1F6F3' }}>
        <div className="mg-partmark mg-rv"><span>05</span> Trust</div>
        <h2 className="mg-rv">The badge, and the absence of one</h2>
        <div className="mg-duo mg-duo-narrow mg-rv">
          <figure className="mg-phone">
            <img src={mGrace} alt="An unverified host profile" loading="lazy" />
            <figcaption>An unverified host, marked persistently rather than hidden.</figcaption>
          </figure>
          <div className="mg-duo-text">
            <p>
              If the pitch is that recorded advice is unverifiable, then verification is not a feature
              of this product. It is the product.
            </p>
            <p>
              So the badge has three states and one rule. <b>The marking never lies in either
              direction.</b>
            </p>
            <p>
              Verified role and verified school get a green pill, and green appears nowhere else in
              the application. Unverified hosts are not removed or quietly delisted. They carry a
              gray shield everywhere, and their profile says role and employer are self-reported.
            </p>
            <p>
              The seed data includes deliberately unverified hosts for that reason. One writes it into
              her own bio. <em>"Verification pending, treat my takes accordingly."</em>
            </p>
            <p>
              A trust system you only ever see passing is not legible. The failing state is what
              teaches people the badge means something.
            </p>
          </div>
        </div>
        <div className="mg-shots mg-shots-3 mg-rv">
          <figure><img src={mVerify} alt="The verification screen" loading="lazy" /><figcaption>Choose how we confirm who you are. The badge shows everywhere, and so does its absence.</figcaption></figure>
          <figure><img src={dMaya} alt="A verified host profile" loading="lazy" /><figcaption>The verified counterpart, with membership tiers that buy time and tools.</figcaption></figure>
          <figure><img src={mSettings} alt="Privacy settings" loading="lazy" /><figcaption>You watch anonymously. Your name appears only when you raise your hand.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 06 honest liveness ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>06</span> Honest liveness</div>
        <h2 className="mg-rv">Simulating a crowd without lying about one</h2>
        <div className="mg-cols mg-rv">
          <p>
            A prototype of a live platform has an obvious cheat. Hardcode a viewer count, script some
            chat, ship the screenshot. It would look identical in a portfolio and teach me nothing.
          </p>
          <p>
            So the rule became that <b>no number on screen is a constant.</b> Counts move because
            simulated people arrive and leave every two to four seconds.
          </p>
          <p>
            Twelve named personas carry a style and the engine honors it. Lurkers stay silent about
            seventy percent of their turns. Askers raise hands every fourteen to twenty-six seconds,
            capped at four in the queue, and about a quarter of the time they attach a boost.
          </p>
        </div>
        <figure className="mg-figure mg-rv">
          <img src={dHostLive} alt="The host's live room" loading="lazy" />
          <figcaption>
            The host side, where the queue becomes a control surface. Boosted questions sort higher and
            are outlined, but promoting one is still a deliberate click.
          </figcaption>
        </figure>
        <div className="mg-twolists mg-rv">
          <div>
            <h3>What makes it honest</h3>
            <ul>
              <li>Counts change only through the simulation, never by assignment</li>
              <li>A room that is not live is an <em>archive</em>, and is labeled as one</li>
              <li>Live state is never persisted, so a reload cannot resurrect a fake room</li>
              <li>The language model that can drive chat degrades silently to scripted lines with no key and no console errors</li>
            </ul>
          </div>
          <div>
            <h3>What it still approximates</h3>
            <ul>
              <li>The room clock ticks on chained timeouts, so under heavy animation it can drift a few percent from wall time</li>
              <li>Scheduled sessions are display labels rather than a real calendar</li>
              <li>The hot-seat overlay is not announced to screen readers, though the persistent banner carries the state</li>
              <li>There is no real video anywhere, which was a scope decision rather than an oversight</li>
            </ul>
          </div>
        </div>
        <div className="mg-decision mg-rv" style={{ marginTop: 26 }}>
          <div className="mg-decision-tag">Decision record · mocking video without faking it</div>
          <p>
            Real streaming infrastructure was out of scope, because the value here is product
            thinking made visible in an interface rather than WebRTC plumbing. That leaves the
            question of what a stage looks like with no video.
          </p>
          <p>
            The answer was a gradient portrait that breathes while the person speaks, over a radial
            glow, with an animated waveform. <b>Human without pretending to be a camera.</b>
          </p>
          <p>
            The same grammar carries into breakouts and into recordings, where muted gray means not
            live. The stage label says <em>camera mocked</em>, because the alternative is a screenshot
            that quietly claims something untrue.
          </p>
        </div>
      </section>

      {/* ---------------- 07 the design system ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>07</span> The design system</div>
        <h2 className="mg-rv">One token set, two worlds, three colors</h2>
        <p className="mg-lede mg-rv">
          The reskin below was the largest single change in the project. It took an afternoon only
          because color, type and spacing were tokens from the start. Reskinning meant editing the
          token file rather than the thirty screens on top of it.
        </p>
        <div className="mg-table mg-table-3 mg-rv">
          <div className="mg-tr mg-th"><span>Role</span><span>Value</span><span>Why it exists</span></div>
          <div className="mg-tr"><span>Action</span><span>black on white</span><span>Every primary action. Neutral, so it never competes with content.</span></div>
          <div className="mg-tr"><span>Live</span><span>#B0402D</span><span>On air, and nothing else. Seeing it means something is happening now.</span></div>
          <div className="mg-tr"><span>Verified</span><span>#1C5C41</span><span>The only green in the product. It means a credential was checked.</span></div>
          <div className="mg-tr"><span>Theater</span><span>near-black scope</span><span>Live rooms and the player, because a stream plays with the lights down.</span></div>
        </div>
        <div className="mg-cols mg-rv">
          <p>
            Dark mode is not an inversion. The page is true neutral graphite, because a video product
            with a hue cast fights its own thumbnails. Both semantic colors lift on dark or they go
            muddy.
          </p>
          <p>
            Glass is chrome only, never on content surfaces, for the same reason.
          </p>
          <p>
            Motion runs from named presets, six springs and four durations. Springs for anything the
            user caused, durations for ambient things nobody triggered.
          </p>
          <p>
            The stagger helper caps at eight items, because twenty items at fifty milliseconds is a
            full second of somebody waiting on choreography.
          </p>
        </div>
        <div className="mg-shots mg-rv">
          <figure><img src={dExplore} alt="The explore page" loading="lazy" /><figcaption>Explore, in light mode. Goals stated by you, never inferred.</figcaption></figure>
          <figure><img src={dVod} alt="A recording with chapters" loading="lazy" /><figcaption>The watch layout, chapters on the right, each one a question that got asked.</figcaption></figure>
          <figure><img src={dRecap} alt="The host recap" loading="lazy" /><figcaption>The recap, in the editorial register that survived the reskin.</figcaption></figure>
          <figure><img src={dLibrary} alt="The library" loading="lazy" /><figcaption>Library, with history, tickets, playlists and subscriptions. No feed anywhere.</figcaption></figure>
        </div>
        <p className="mg-lede mg-rv" style={{ marginTop: 26 }}>The four surfaces that carry the whole product, click through them:</p>
        <RefCarousel />
      </section>

      {/* ---------------- 08 anti-feed ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#FBF7F1' }}>
        <div className="mg-partmark mg-rv"><span>08</span> The conflict</div>
        <h2 className="mg-rv">When the request contradicts the principle</h2>
        <div className="mg-duo mg-rv">
          <div className="mg-duo-text">
            <p>
              Partway through I asked for a recommendations page. The principles ban algorithmic
              feeds outright, so the request and the spec were in direct conflict.
            </p>
            <p>
              What shipped is goal-driven rather than behavioral. You <b>state</b> your career goals,
              and the page renders finite labeled shelves matched against them. Nothing is inferred
              from what you watched, and nothing scrolls forever.
            </p>
            <p>
              I would defend this one hardest, because the resolution beats either input. A feed
              would have been faster and would have made the product indistinguishable from what it
              criticizes.
            </p>
            <p>
              Writing the constraint down early is what made the conflict visible instead of letting
              it get absorbed.
            </p>
          </div>
          <figure>
            <img src={dExplore} alt="The goal-driven explore page" loading="lazy" />
            <figcaption>
              "Tell it where you're headed. Everything below matches your goals, stated by you, not
              inferred. No feed."
            </figcaption>
          </figure>
        </div>

        <div className="mg-riskcards mg-rv" style={{ marginTop: 30 }}>
          <div className="mg-riskcard">
            <h3>The dollar that is not revenue</h3>
            <p>
              Free events charge a one dollar commitment, refunded on attendance. Not a revenue line.
              A bot filter and an attendance stake, so the forty people in the room meant to be there.
            </p>
            <p>
              Charging a dollar to make something <em>mean</em> something is the cheapest retention
              mechanic in the product.
            </p>
          </div>
          <div className="mg-riskcard">
            <h3>The recordings decision that got reversed halfway</h3>
            <p>
              New recordings default to the premium library, contradicting an earlier decision to
              keep the archive free. That decision was superseded rather than quietly dropped, and
              the boundary held. <b>Watching live stays free for everyone.</b>
            </p>
          </div>
        </div>

        <div className="mg-shots mg-rv" style={{ marginTop: 30 }}>
          <figure><img src={mExplore} alt="Explore on mobile" loading="lazy" /><figcaption>The same goal-driven shelves on mobile. Finite, labeled, and they end.</figcaption></figure>
          <figure><img src={mCommit} alt="The one dollar commitment" loading="lazy" /><figcaption>Not revenue, a filter. Refunded when you attend.</figcaption></figure>
          <figure><img src={mPremium} alt="The premium tier" loading="lazy" /><figcaption>Watching live is free and always will be. Premium is for the studying afterwards.</figcaption></figure>
          <figure><img src={dVodLocked} alt="A locked recording" loading="lazy" /><figcaption>The lock states the rule it is enforcing rather than just blocking.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 09 second audience ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>09</span> The second audience</div>
        <h2 className="mg-rv">The same machinery, pointed at a lecture hall</h2>
        <div className="mg-duo mg-rv">
          <figure>
            <img src={dCourse} alt="A course channel" loading="lazy" />
            <figcaption>A course as a channel. One link, posted once, that records and chapters itself.</figcaption>
          </figure>
          <div className="mg-duo-text">
            <p>
              Late in the build the product grew a second world. A course today is a learning
              management system, a video call, a calendar and a lecture recorder, none of which know
              about each other. Here a course is <b>one channel</b>.
            </p>
            <p>
              It fit because the consent gate needed no changes at all. Raise your hand and get called
              on is what office hours already are.
            </p>
            <p>
              The mechanic was designed for a stranger asking a Goldman analyst about superdays. It
              transferred without modification to a student asking about a problem set.
            </p>
            <p>
              The hard part was isolation. Campus is a separate data island with its own search index,
              so course content cannot leak into careers discovery. A bug during integration proved
              why, rendering a course inside careers navigation.
            </p>
          </div>
        </div>
        <figure className="mg-figure mg-rv">
          <img src={dCampus} alt="Campus home" loading="lazy" />
          <figcaption>
            Campus home. Three seeded courses with real enrollment numbers, the largest at 903 students,
            which is the case that makes office hours a scaling problem in the first place.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- 10 the ledger ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>10</span> What broke</div>
        <h2 className="mg-rv">The critique log, including the one that cost a rebuild</h2>
        <p className="mg-lede mg-rv">
          Everything below came from looking at the running product and writing down what was wrong.
          The first entry is the most expensive note I have ever written to myself.
        </p>
        <div className="mg-ledger">
          {LEDGER.map((c, i) => (
            <div className="mg-card mg-rv" key={i}>
              <div className="mg-card-q">{c.quote}</div>
              <div className="mg-card-fix"><b>Shipped:</b> {c.fix}</div>
              <div className="mg-card-lesson">{c.lesson}</div>
            </div>
          ))}
        </div>

        <div className="mg-duo mg-duo-narrow mg-rv" style={{ marginTop: 30 }}>
          <figure>
            <img src={dSparse} alt="A sparse section" loading="lazy" />
            <figcaption>An honestly empty booth. Nobody is live here right now, and it says so.</figcaption>
          </figure>
          <div className="mg-duo-text">
            <h3>The cold start, left visible on purpose</h3>
            <p>
              One section is stocked and seven are thin. That was a decision, not an unfinished task.
              A demo where all eight categories are equally busy has never met a cold start.
            </p>
            <p>
              The launch shape follows the same reasoning. Ambient always-on liveness is what killed
              Clubhouse, so this launches <b>scheduled events first</b> and uses the campus wedge to
              concentrate both sides of the market in one place at one time.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 11 metrics ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>11</span> Metrics</div>
        <h2 className="mg-rv">One number that catches both sides</h2>
        <div className="mg-split mg-rv">
          <div className="mg-split-col is-hi">
            <div className="mg-split-tag">North Star</div>
            <h3>Questions answered live, per week</h3>
            <ul>
              <li>It cannot rise unless viewers show up <b>and</b> raise hands</li>
              <li>It cannot rise unless hosts go live and actually call on people</li>
              <li>It is the same event that mints a VOD chapter, so the library grows with it</li>
            </ul>
            <p>One number, both sides of the marketplace, no way to fake half of it.</p>
          </div>
          <div className="mg-split-col">
            <div className="mg-split-tag">Guardrails</div>
            <h3>What would tell me it is drifting</h3>
            <ul>
              <li>Host four-week retention, the supply-side survival question</li>
              <li>Median concurrent viewers per session</li>
              <li>Hot-seat conversion, hands raised against hands answered</li>
              <li>Share of sessions with at least one question answered</li>
              <li>Breakout attach rate, the revenue check</li>
            </ul>
            <p>A high North Star with a falling answer rate would mean a few big rooms hiding many dead ones.</p>
          </div>
        </div>

        <div className="mg-stats mg-rv">
          <div><span className="v">27</span><span className="l">routes shipped against about 15 planned</span></div>
          <div><span className="v">2</span><span className="l">full layouts, mobile tab shell and desktop sidebar chrome</span></div>
          <div><span className="v">2</span><span className="l">audiences, careers and campus, on separate data islands</span></div>
          <div><span className="v">37</span><span className="l">custom stroke icons, and no emoji in any interface chrome</span></div>
          <div><span className="v">18</span><span className="l">dated decisions in the log, two of them reversals</span></div>
          <div><span className="v">143 kB</span><span className="l">gzipped JavaScript for the whole thing</span></div>
        </div>
      </section>

      {/* ---------------- coda ---------------- */}
      <section className="mg-part mg-coda">
        <div className="mg-partmark mg-rv"><span>12</span> What I would carry forward</div>
        <h2 className="mg-rv">Takeaways</h2>
        <div className="mg-takeaways mg-rv">
          <div className="mg-take">
            <b>Write the decision down, with the date</b>
            <p>Eighteen entries meant every later argument started from what was settled. The two reversals read as reversals rather than drift.</p>
          </div>
          <div className="mg-take">
            <b>Amend a principle, do not quietly break it</b>
            <p>Boosts needed the money rule to bend. Naming the amendment kept the rest enforceable instead of turning it into a suggestion.</p>
          </div>
          <div className="mg-take">
            <b>Tokens are what make a rebrand survivable</b>
            <p>The reskin that fixed a generic-looking product touched a token file rather than thirty screens. Twice.</p>
          </div>
          <div className="mg-take">
            <b>Fake the medium, never the market</b>
            <p>Mocking video is fine and honest. Mocking a viewer count would have made every screenshot a small lie.</p>
          </div>
        </div>
        <div className="mg-shipchips mg-rv">
          <span>27 routes</span>
          <span>mobile + desktop</span>
          <span>light, dark, theater</span>
          <span>careers + campus</span>
          <span>simulated crowd engine</span>
          <span>store-enforced consent gate</span>
          <span>optional LLM chat behind a proxy</span>
          <span>no real video, by decision</span>
        </div>
      </section>

      <div className="mg-finale mg-band mg-rv">
        <blockquote className="mg-pull mg-pull-light">
          It never buys the stage.<br />The host still chooses.
        </blockquote>
        <a className="mg-finale-cta" href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">
          Open the prototype → pjeon18.github.io/prep-io
        </a>
      </div>

      <details className="mg-details mg-sources mg-rv">
        <summary>Sources &amp; notes</summary>
        <p className="mg-sources-p">
          Market sizing and comparables are as cited in the project's requirements document and
          decision log. Career coaching market size and growth (Market Research Intellect), online
          coaching platforms (Global Growth Insights), mentor supply (ADPList), pricing at the top of
          the market (Intro.co), and concurrent-viewer scale for unstructured live talk (Twitch). All
          hosts, courses, viewers and chat in the prototype are fictional seed data. Company names
          appear for identification and commentary, and all marks belong to their owners.
        </p>
      </details>

      <div className="case-next mg-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/studdy" className="case-next-link">
          Studdy. A study spot that never closes. <span className="arr">→</span>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
