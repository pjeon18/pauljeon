// The ISO case study, magazine edition. Content lives inline because the page
// IS the deliverable: its structure follows this product's argument, not a
// generic template. Shared furniture comes from styles/mag.css.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import '../styles/mag.css'

import isoIcon from '../assets/iso-icon.png'
import splash from '../assets/iso-splash-screen.png'
import queue from '../assets/iso-queue.png'
import searching from '../assets/iso-searching.png'
import match from '../assets/iso-match.png'
import room from '../assets/iso-room.png'
import roomTimer from '../assets/iso-room-timer.png'
import keepAsk from '../assets/iso-keep-ask.png'
import keepMutual from '../assets/iso-keep-mutual.png'
import keepDeclined from '../assets/iso-keep-declined.png'
import closedView from '../assets/iso-closed-view.png'
import oneChat from '../assets/iso-onechat.png'
import noMatch from '../assets/iso-no-match.png'
import closeoutOutcome from '../assets/iso-closeout-outcome.png'
import closeoutReflection from '../assets/iso-closeout-reflection.png'
import maybeAgain from '../assets/iso-maybe-again.png'
import safety from '../assets/iso-safety-center.png'
import profile from '../assets/iso-profile.png'
import memories from '../assets/iso-memories.png'
import trend from '../assets/iso-trend.png'
import paywall from '../assets/iso-paywall.png'
import settings from '../assets/iso-settings.png'
import obSignup from '../assets/iso-ob-1-signup.png'
import obEdu from '../assets/iso-ob-2-edu.png'
import obPhoto from '../assets/iso-ob-3-photo.png'
import editProfile from '../assets/iso-edit-profile.png'

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
// Chart 1: the market. Real-time on x, exclusive on y. Labels hug their dot,
// and `end` flips a label left so nothing overlaps near the right edge.

function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; hero?: boolean; end?: boolean }[] = [
    { x: 12, y: 14, label: 'Tinder', sub: '~9M payers, down 7% YoY' },
    { x: 22, y: 40, label: 'Hinge', sub: 'revenue up 25%' },
    { x: 40, y: 30, label: 'Bumble', sub: '24h match timer' },
    { x: 30, y: 72, label: 'Beli', sub: 'ranks restaurants, not people', end: false },
    { x: 84, y: 84, label: 'ISO', sub: 'live, one at a time', hero: true, end: true },
  ]
  return (
    <svg className="mg-chart" viewBox="0 0 640 460" role="img" aria-label="Market map: real-time versus exclusive">
      <defs>
        <marker id="mgArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#B9B4A8" />
        </marker>
      </defs>
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <rect x="340" y="20" width="270" height="190" fill="#FFF3EC" opacity="0.6" />
      <text x="595" y="42" textAnchor="end" fontSize="11.5" fill="#C24E14" fontStyle="italic">
        the empty quadrant
      </text>
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" markerEnd="url(#mgArr)" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" markerEnd="url(#mgArr)" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">asynchronous</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">real-time</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">parallel chats</text>
      <text x="58" y="130" fontSize="12" fill="#38352F" transform="rotate(-90 58 130)" fontWeight="700">exclusive</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + ((100 - d.y) / 100) * 380
        const tx = d.end ? cx - 17 : cx + 17
        const anchor = d.end ? 'end' : 'start'
        return (
          <g key={d.label}>
            <circle cx={cx} cy={cy} r={d.hero ? 9 : 6} fill={d.hero ? '#FF8000' : '#38352F'} opacity={d.hero ? 1 : 0.75} />
            {d.hero && <circle cx={cx} cy={cy} r="15" fill="none" stroke="#FF8000" strokeDasharray="3 3" />}
            <text x={tx} y={cy - 1} textAnchor={anchor} fontSize="13.5" fontWeight="800" fill="#121110">{d.label}</text>
            <text x={tx} y={cy + 13} textAnchor={anchor} fontSize="11" fill="#8F8B83">{d.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Chart 2: the shipped surfaces, graded on the two questions that matter.

function AuditMap() {
  const dots: { x: number; y: number; label: string; risk?: boolean; end?: boolean }[] = [
    { x: 90, y: 88, label: 'one live conversation', end: true },
    { x: 84, y: 62, label: 'mutual keep-talking', end: true },
    { x: 70, y: 78, label: 'reply timer', end: true },
    { x: 62, y: 40, label: 'the no-match screen' },
    { x: 78, y: 26, label: 'burnout nudge', end: true },
    { x: 52, y: 90, label: '.edu verification', end: true },
    { x: 44, y: 66, label: 'outcome loop' },
    { x: 34, y: 82, label: 'private reflection', end: true },
    { x: 40, y: 20, label: 'Memories', risk: true },
    { x: 26, y: 44, label: 'Maybe We’ll Meet Again', risk: true },
    { x: 22, y: 12, label: 'ISO+ tier', risk: true },
  ]
  return (
    <svg className="mg-chart" viewBox="0 0 640 460" role="img" aria-label="ISO surfaces: intention versus roster risk">
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">weak signal of intent</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">forces intention</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">could rebuild a roster</text>
      <text x="58" y="150" fontSize="12" fill="#38352F" transform="rotate(-90 58 150)" fontWeight="700">structurally can't</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + ((100 - d.y) / 100) * 380
        return (
          <g key={d.label}>
            {d.risk ? (
              <circle cx={cx} cy={cy} r="6.5" fill="#FBFAF6" stroke="#FF8000" strokeWidth="2.5" />
            ) : (
              <circle cx={cx} cy={cy} r="6.5" fill="#38352F" />
            )}
            <text
              x={d.end ? cx - 15 : cx + 15}
              y={cy + 4.5}
              textAnchor={d.end ? 'end' : 'start'}
              fontSize="12.5"
              fontWeight="700"
              fill={d.risk ? '#C24E14' : '#121110'}
            >{d.label}</text>
          </g>
        )
      })}
      <g>
        <circle cx="392" cy="443" r="5.5" fill="#38352F" />
        <text x="404" y="447" fontSize="11.5" fill="#55524B">held its ground</text>
        <circle cx="518" cy="443" r="5.5" fill="#FBFAF6" stroke="#FF8000" strokeWidth="2.2" />
        <text x="530" y="447" fontSize="11.5" fill="#55524B">watched risk</text>
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------

const INCUMBENTS = [
  {
    img: queue,
    name: 'The swipe deck',
    stat: 'Tinder, ~9M payers, down 7% YoY',
    line: 'Volume is the product. Liquidity and brand are real, and so is the fatigue: it is the app people name when they say they are tired.',
  },
  {
    img: oneChat,
    name: 'The intentional inbox',
    stat: 'Hinge, revenue up 25%',
    line: 'Better prompts, better brand, same shape underneath. You still end up holding a roster of half-finished chats, and ghosting still works.',
  },
  {
    img: roomTimer,
    name: 'The match timer',
    stat: 'Bumble, 24 hours to reply',
    line: 'A clock on the match adds pressure without adding presence. The backlog stays, it just expires.',
  },
  {
    img: trend,
    name: 'The reflection loop',
    stat: 'Beli, ranking restaurants',
    line: 'Borrowed on purpose, with one line drawn hard. Beli ranks places. ISO tracks how conversations felt and never scores a person.',
  },
]

function IncumbentCarousel() {
  const [i, setI] = useState(0)
  const n = INCUMBENTS.length
  const go = (d: number) => setI((v) => (v + d + n) % n)
  return (
    <div className="mg-carousel mg-rv">
      <div className="mg-caro-stage">
        {INCUMBENTS.map((r, j) => {
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
          {INCUMBENTS.map((x, j) => (
            <button key={x.name} className={j === i ? 'on' : ''} onClick={() => setI(j)} aria-label={x.name} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next">→</button>
      </div>
      <p className="mg-lede" style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#8F8B83' }}>
        Screens are ISO's own, standing in for each shape. Click a card to bring it forward.
      </p>
    </div>
  )
}

interface Fix { quote: string; fix: string; lesson: string }

const LEDGER: Fix[] = [
  {
    quote: 'Two people finally choose each other, and the partner goes silent forever',
    fix: 'The reply scheduler guarded on phase !== "live", which muted the partner the instant a conversation became mutual. The guard now excludes only the deciding takeover.',
    lesson: 'The reward for the product’s best moment was its worst bug. Any state machine with a celebratory new phase needs the old behavior explicitly re-permitted, not assumed.',
  },
  {
    quote: 'Onboarding wedges on step three and never advances',
    fix: 'AnimatePresence mode="wait" gated the next step on an exit animation completing, which stalls in a throttled or background tab. Replaced with a keyed entrance-only transition.',
    lesson: 'Animation should never be load-bearing for navigation. If a frame never arrives, the user should still get where they were going.',
  },
  {
    quote: 'The brand green is two different greens',
    fix: 'Green was corrected mid-build from #20C55E to #00FF77, and the token moved. Three rgba literals of the old value survive in the pulse keyframes, the orbiting presence dot, and the "said yes" card border.',
    lesson: 'A token rename only finds declarations. Colors written inline as rgba are invisible to it, so a find-and-replace pass has to run on the literal too.',
  },
  {
    quote: 'The design document argues against emoji while using them',
    fix: 'Still open. The annotated design doc predates the emoji purge and the nine-photo grid, so it renders face-scale emoji and still says three photo slots.',
    lesson: 'A generated artifact that describes the product becomes wrong the moment the product moves. Either regenerate it in the same commit or date it clearly.',
  },
  {
    quote: 'The logomark is clipped flat at the bottom of the letters',
    fix: 'Figma exported drop-shadow filter regions sliced tight to the glyphs. Regions widened and the viewBox padded.',
    lesson: 'Exported SVG filters carry their own bounding boxes. They survive every resize you test and fail at the one you ship.',
  },
  {
    quote: 'Sixty frames per second, but only on a laptop',
    fix: 'The wave and match reveal animate transform and opacity only, with willChange set, and hold 60fps through CPU-throttled runs. A physical mid-range phone was never available in this environment.',
    lesson: 'Write the caveat down rather than rounding it up to "verified". A throttled desktop is evidence, not proof.',
  },
]

// ---------------------------------------------------------------------------

export default function IsoMag() {
  const root = useReveals()
  const bar = useProgress()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="mag" ref={root} style={{ ['--acc' as string]: '#FF8000', ['--acc-deep' as string]: '#C24E14', ['--acc-tint' as string]: '#FFF3EC' }}>
      <div className="mg-progress" ref={bar} />

      <nav className="case-nav mg-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← All work</Link>
      </nav>

      {/* ---------------- masthead ---------------- */}
      <header className="mg-masthead">
        <img src={isoIcon} alt="ISO" width="76" height="76" style={{ borderRadius: 18, display: 'block', marginBottom: 24 }} />
        <div className="mg-kicker mg-rv">Product case study · interactive prototype · 2026</div>
        <h1 className="mg-rv">
          A dating app<br />built on a <em>refusal</em>
        </h1>
        <p className="mg-dek mg-rv">
          ISO matches you with one present person, live, and gives you no way to hold a second conversation.
          No inbox, no roster, no feed. This is the whole argument: the research that found the gap, the
          people it is for, the mechanics that enforce it, the things it deliberately will not do, and the
          bugs that taught me the most.
        </p>
        <div className="mg-meta mg-rv">
          <span><b>Role</b> product, design, engineering, solo</span>
          <span><b>Stack</b> React · TypeScript · Zustand · Framer Motion</span>
          <span className="mg-meta-links">
            <a href="https://pjeon18.github.io/iso-prototype/" target="_blank" rel="noreferrer">Open the prototype ↗</a>
            <a href="https://pjeon18.github.io/iso-demo/?tour" target="_blank" rel="noreferrer">Guided tour ↗</a>
            <a href="https://pjeon18.github.io/iso-prototype/design-doc.html" target="_blank" rel="noreferrer">Design doc ↗</a>
          </span>
        </div>
      </header>

      {/* ---------------- the product, first ---------------- */}
      <section className="mg-part mg-productfirst">
        <div className="mg-partmark mg-rv"><span>◆</span> The product, in one minute</div>
        <div className="mg-product-grid mg-rv">
          <div className="mg-product-what">
            <h2>One conversation, or none</h2>
            <ul>
              <li>You enter a queue. No browsing, no deck, no likes to check.</li>
              <li>You are matched <b>live</b> with one person who is present right now.</li>
              <li>A calm timer marks whose turn it is. It never punishes you for being slow.</li>
              <li>At the end you both answer <b>keep talking?</b> in sealed envelopes. Two yeses opens your one ongoing chat. Anything else closes it kindly.</li>
              <li>Then the only question the product actually cares about: <b>did you two meet?</b></li>
            </ul>
            <a className="mg-playbtn" href="https://pjeon18.github.io/iso-prototype/" target="_blank" rel="noreferrer">
              Open the prototype
            </a>
          </div>
          <figure className="mg-product-shot mg-phone">
            <img src={room} alt="The ISO live room mid-conversation" loading="lazy" />
          </figure>
        </div>
        <div className="mg-shots mg-rv" style={{ marginTop: 34 }}>
          <figure><img src={splash} alt="The ISO splash screen" loading="lazy" /><figcaption>The boot, staged over five seconds. Buttons stay inert until they have visibly arrived.</figcaption></figure>
          <figure><img src={queue} alt="The queue home screen" loading="lazy" /><figcaption>Home is one button. The count of people nearby is live, and it is the only number on screen.</figcaption></figure>
          <figure><img src={match} alt="A match found" loading="lazy" /><figcaption>The face lands first, the name half a second later, then a shared ice-breaker.</figcaption></figure>
          <figure><img src={keepMutual} alt="A mutual keep-talking result" loading="lazy" /><figcaption>Both envelopes open at once. This is the only moment the app turns green.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 01 the research ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>01</span> The research</div>
        <h2 className="mg-rv">Why people are quitting the apps they are still on</h2>
        <div className="mg-cols mg-rv">
          <p>
            The complaint is not that dating apps fail to produce matches. They produce plenty. The
            complaint is what a pile of matches turns into: five open conversations, none of them
            exciting, all of them owed a reply. My primary persona says it better than I can, and she
            is a composite of exactly this feedback: <em>"I have five chats going and I'm not excited
            about any of them. It's a part-time job I didn't sign up for."</em>
          </p>
          <p>
            The root cause is a business model, not a design mistake. Revenue scales with engagement
            and optionality, so more matches and more time in-app are the things worth building. The
            talking stage is not a cultural accident. It is what the mechanics reward. Anything that
            makes people feel disposable also makes the quarter look good.
          </p>
        </div>

        <div className="mg-stats mg-rv">
          <div><span className="v">79%</span><span className="l">of US college students are not on any dating app</span></div>
          <div><span className="v">50%+</span><span className="l">of Gen Z report burnout from dating apps, the highest of any age band</span></div>
          <div><span className="v">~90%</span><span className="l">of Gen Z would rather meet offline</span></div>
          <div><span className="v">41%</span><span className="l">name safety a top concern</span></div>
          <div><span className="v">−7%</span><span className="l">Tinder payers year over year, while Hinge revenue grew 25%</span></div>
          <div><span className="v">18–26</span><span className="l">the beachhead: campus density is what makes live matching work</span></div>
        </div>

        <p className="mg-lede mg-rv">Four shapes already own this space. Each solves one thing and inherits the same backlog:</p>
        <IncumbentCarousel />

        <div className="mg-statement mg-band mg-band-dark mg-rv">
          <p>Nobody enforces one conversation at a time.</p>
          <p className="mg-statement-sub">
            Every incumbent lets you hold a roster, because a roster is the thing that keeps you
            opening the app. The quadrant that is both live and exclusive sits empty, and it stays
            empty because filling it means giving up the revenue mechanic underneath.
          </p>
          <p className="mg-statement-big">That is not a gap in the market. It is a <em>refusal</em> the market cannot afford.</p>
        </div>

        <figure className="mg-figure mg-rv">
          <MarketMap />
          <figcaption>
            The map that set the scope. Everything crowds the asynchronous and parallel edges. Beli sits
            off to the side as the mechanical inspiration for reflection, and it is the one thing borrowed.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- 02 the people ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>02</span> The people</div>
        <h2 className="mg-rv">Three kinds of user, and what each is actually asking for</h2>
        <p className="mg-lede mg-rv">
          These segments come out of the research above and they are load-bearing in the code, not just
          the deck. Every simulated person in the prototype carries a <b>segment</b> field, and their
          scripted voice is written to match it, so testing the loop means testing it against all three.
        </p>

        <div className="mg-personas mg-rv">
          <article className="mg-persona">
            <header>Burned out · 21 · college junior</header>
            <p className="mg-persona-quote">"I have five chats going and I'm not excited about any of them."</p>
            <p className="mg-persona-bio">
              Deleted Hinge twice. Dates rarely materialize. Wants something real and distrusts apps
              for structural reasons, not aesthetic ones.
            </p>
            <h4>What she wants</h4>
            <ul>
              <li>Less time, more signal</li>
              <li>To stop owing replies to strangers</li>
              <li>One person worth texting back</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> Managing the roster became the work, and none of it led anywhere.</p>
          </article>

          <article className="mg-persona">
            <header>Intentional · 24 · working</header>
            <p className="mg-persona-quote">"Something intentional. I'm not here to collect people."</p>
            <p className="mg-persona-bio">
              Busy and sincere, hates small talk, hates ghosting. Will pay for quality and resents
              anything that smells like pay-to-win.
            </p>
            <h4>What he wants</h4>
            <ul>
              <li>A conversation that starts somewhere real</li>
              <li>A clear signal that the other person is present</li>
              <li>Fewer, better, finished</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> Paid tiers that sell visibility make the whole product feel rigged.</p>
          </article>

          <article className="mg-persona">
            <header>Safety first · 20 · sophomore</header>
            <p className="mg-persona-quote">"Verified humans only. The .edu thing is why I'm here."</p>
            <p className="mg-persona-bio">
              Cautious about bad actors, values verification and hard control over who can reach her.
              Reads the settings screen before using the product.
            </p>
            <h4>What she wants</h4>
            <ul>
              <li>Proof the other person is a real student</li>
              <li>Report and block that actually ends contact</li>
              <li>No surface where someone can accumulate her</li>
            </ul>
            <p className="mg-persona-pain"><b>Breaking point</b> Apps that treat safety as a settings toggle rather than a precondition.</p>
          </article>
        </div>

        <h3 className="mg-subhead mg-rv">What each of them needs the product to be</h3>
        <div className="mg-serves mg-rv">
          <div className="mg-serve">
            <span>burned out</span>
            <p>
              The roster is removed at the level of the data model, so there is nothing to manage even
              if she wants to. One conversation exists or none does. When one ends it writes a history
              record and returns her to the queue, so <b>nothing rots and nothing is owed</b>. The
              burnout nudge exists for her specifically: after three rough conversations the app
              suggests she stop for the night, and makes that the primary button.
            </p>
          </div>
          <div className="mg-serve">
            <span>intentional</span>
            <p>
              Presence is the precondition rather than a feature. Matching is live, so the person on
              the other side is there right now, and the reply timer makes turn-taking visible without
              threatening anyone. Continuation is <b>mutual only</b>, which means no conversation
              continues out of politeness. The paid tier is printed with its own limit: it never buys
              matches, visibility, or queue position.
            </p>
          </div>
          <div className="mg-serve">
            <span>safety first</span>
            <p>
              Verification happens before a first match, not after a report. The product line is
              stated plainly in-app: <em>"Only verified students can ever match with you, that's not a
              setting, it's the product."</em> Blocking is absolute and retroactive, clearing held
              flags and filtering that person out of history. And because there is no inbox and no
              profile browsing, <b>there is no surface on which someone can collect her</b>.
            </p>
          </div>
        </div>

        <div className="mg-shots mg-shots-3 mg-rv" style={{ marginTop: 36 }}>
          <figure><img src={obSignup} alt="Onboarding: create your account" loading="lazy" /><figcaption>Step one of ten. Verification is front-loaded, because trust is the precondition rather than a later setting.</figcaption></figure>
          <figure><img src={obEdu} alt="Onboarding: a non-.edu address is rejected" loading="lazy" /><figcaption>A non-.edu address is refused inline and the button stays dead. The explanation is the product line: it bounds the trust circle to your campus.</figcaption></figure>
          <figure><img src={obPhoto} alt="Onboarding: photo verification" loading="lazy" /><figcaption>Liveness, with its own privacy promise attached. Used only to verify, never shown on a profile.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 03 the bet ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#FFF3E6' }}>
        <div className="mg-partmark mg-rv"><span>03</span> The bet</div>
        <h2 className="mg-rv">Defining the product by what it will not do</h2>
        <p className="mg-lede mg-rv">
          Most product specs list features. This one is easier to defend as a list of refusals, because
          every refusal maps to a symptom in the research. Three of them are marked permanent, which in
          practice means a request to add them gets flagged rather than built.
        </p>

        <div className="mg-pillars mg-rv">
          <div className="mg-pillar">
            <span>Pillar 1</span>
            <h3>One at a time, enforced</h3>
            <p>Not encouraged, not nudged. A second conversation is unreachable from any state the app can be in.</p>
          </div>
          <div className="mg-pillar">
            <span>Pillar 2</span>
            <h3>Mutual or finished</h3>
            <p>Every conversation resolves. It becomes your one chat, or it closes and returns you to the queue.</p>
          </div>
          <div className="mg-pillar">
            <span>Pillar 3</span>
            <h3>Rank experiences, never people</h3>
            <p>Reflection is a private note about how something felt. No score, no list, no leaderboard of humans.</p>
          </div>
        </div>

        <div className="mg-twolists mg-rv" style={{ marginTop: 40 }}>
          <div>
            <h3>Permanently out of scope</h3>
            <ul>
              <li>Any ranking, scoring, or leaderboard <em>of people</em></li>
              <li>Any monetization that sells matches or paid visibility</li>
              <li>A discovery feed, profile browsing, or a "likes you" surface</li>
              <li>Optionality framing in revival, such as "your top person is free"</li>
            </ul>
          </div>
          <div>
            <h3>Metrics it refuses to optimize</h3>
            <ul>
              <li>Time in app</li>
              <li>Total swipes</li>
              <li>Total matches</li>
              <li>All three are tracked as diagnostics only. <em>Optimizing them recreates the problem.</em></li>
            </ul>
          </div>
        </div>

        <blockquote className="mg-pull mg-rv">
          Both of you show up,<br />or nobody does.
        </blockquote>
      </section>

      {/* ---------------- 04 the loop ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>04</span> The loop</div>
        <h2 className="mg-rv">How one conversation actually runs</h2>
        <div className="mg-shots mg-shots-3 mg-rv">
          <figure><img src={searching} alt="Searching for a match" loading="lazy" /><figcaption>Waiting shows liquidity instead of hiding it. The count is live and the phrases rotate at reading pace.</figcaption></figure>
          <figure><img src={roomTimer} alt="The reply timer running" loading="lazy" /><figcaption>Forty seconds a turn, under the header rather than above the composer, where it would read as a countdown bomb.</figcaption></figure>
          <figure><img src={keepAsk} alt="The keep talking decision" loading="lazy" /><figcaption>Sealed envelopes. Your answer is computed and withheld for two to four seconds, so it lands as a held breath.</figcaption></figure>
          <figure><img src={keepDeclined} alt="A non-mutual reveal" loading="lazy" /><figcaption>The other ending, and the one that had to be gotten right. Both cards flip together, so nobody watches the other person decide.</figcaption></figure>
          <figure><img src={closedView} alt="The polite close" loading="lazy" /><figcaption>Straight into a soft landing, with an optional reflection and a way back to the queue.</figcaption></figure>
          <figure><img src={oneChat} alt="The one ongoing chat" loading="lazy" /><figcaption>The reward is singular and labelled as such. There is no second row under it.</figcaption></figure>
        </div>

        <div className="mg-cols mg-rv" style={{ marginTop: 30 }}>
          <p>
            The timer is the piece I rewrote most, because a clock in a conversation is inherently
            threatening and the whole product depends on it not being. It runs only when it is
            genuinely your turn. It softens as it drains instead of reddening. At zero it says
            <em> "no rush, whenever you're ready"</em> and nothing happens. Beside it, permanently,
            two words that are the product thesis in miniature: <b>presence, not pressure</b>.
          </p>
          <p>
            Let it lapse and you get a system line asking if you are still there. Let it lapse twice
            in a row and the app reads the room, says <em>"seems like a natural pause"</em>, and opens
            the keep-talking decision early. That is the whole penalty. A dating app that punishes a
            slow reply is just the anxiety it claims to be fixing, wearing a timer.
          </p>
        </div>

        <details className="mg-details mg-rv">
          <summary>The three ways keep-talking fires, and why there are three</summary>
          <ul>
            <li><b>Turns.</b> At twelve human messages, after a beat. The headline reads "That was a good one." This is the common path and it catches conversations that are going well.</li>
            <li><b>Decide.</b> Either person taps a quiet underlined link, available once there are at least four messages. Headline: "Ready to decide." This exists so nobody is trapped waiting for a counter.</li>
            <li><b>Pause.</b> Two consecutive timer lapses. Headline: "Seems like a natural pause." This converts a conversation dying of silence into a clean ending rather than a ghost.</li>
            <li>All three land in the same sealed simultaneous reveal, and all three write the same history record, so the analytics never have to guess how a conversation ended.</li>
          </ul>
        </details>
      </section>

      {/* ---------------- 05 the invariant ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>05</span> The invariant</div>
        <h2 className="mg-rv">Where the rule actually lives</h2>
        <div className="mg-duo mg-duo-narrow mg-rv">
          <figure className="mg-phone">
            <img src={noMatch} alt="The no match screen" loading="lazy" />
            <figcaption>Thin liquidity, narrated as integrity rather than hidden behind a spinner.</figcaption>
          </figure>
          <div className="mg-duo-text">
            <p>
              A product principle that lives in the interface is a suggestion. The one-conversation
              rule is enforced in the state store, where the UI cannot route around it. Entering the
              queue is a no-op whenever a chat exists, and it returns an explanatory message instead
              of failing silently. The single comment in that file is the design thesis of the whole
              project: <b>disabled buttons are decoration, the invariant lives in the action</b>.
            </p>
            <p>
              There is a second guard inside the matchmaker's own callback, commented
              <em> "belt-and-braces: never match while chatting"</em>, defending a rule that was
              already enforced at the entry point. Saying hi and accepting a revival check it
              independently too. I tried to break it three ways while validating and could not.
            </p>
            <p>
              The consequence in the UI is the part I like most. The queue button <b>stays tappable</b>
              during an active conversation. It does not gray out. It answers with a sentence and
              points you back to the person you are already talking to. The product explains itself
              rather than going dim.
            </p>
          </div>
        </div>

        <details className="mg-details mg-rv">
          <summary>Engineering notes: how the store holds the line</summary>
          <ul>
            <li>The active conversation is a <b>nullable singleton</b>, typed and commented as such. There is no collection of chats to accidentally grow.</li>
            <li><code>enterQueue()</code> returns early while a chat exists. The queue timeout callback re-checks before matching.</li>
            <li>Revival can only surface when you are free. Forcing it mid-chat refuses with a message rather than queueing it up.</li>
            <li>Blocking is retroactive: it clears the held flag, filters that person out of history, ends the conversation, and clears any pending match.</li>
            <li>Nothing in the matchmaker reads the subscription flag. That is the mechanical form of the no-pay-to-win promise, and it is greppable.</li>
            <li>Matchmaking is mocked with a 2 to 6 second delay and a persona draw that avoids immediately redrawing the last person.</li>
          </ul>
        </details>
      </section>

      {/* ---------------- 06 the refusals in the UI ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#F2F6F3' }}>
        <div className="mg-partmark mg-rv"><span>06</span> The refusals, on screen</div>
        <h2 className="mg-rv">Four screens that argue against their own engagement</h2>
        <p className="mg-lede mg-rv">
          Anyone can write principles into a document. These are the four places the product pays for
          them, in sessions it chose not to have.
        </p>
        <div className="mg-shots mg-shots-3 mg-rv">
          <figure><img src={settings} alt="The settings screen" loading="lazy" /><figcaption>The settings footer points at absences: no manage-your-matches, no read receipts to buy, nothing to grind.</figcaption></figure>
          <figure><img src={memories} alt="The memories screen" loading="lazy" /><figcaption>A private journal of mutual conversations. Read-only, with no composer in the DOM at all.</figcaption></figure>
          <figure><img src={paywall} alt="The paywall" loading="lazy" /><figcaption>The paid tier prints its own constraint: never more matches, visibility, or queue position.</figcaption></figure>
        </div>

        <div className="mg-riskcards mg-rv" style={{ marginTop: 34 }}>
          <div className="mg-riskcard">
            <h3>The burnout nudge is the clearest one</h3>
            <p>
              After three low-satisfaction conversations the app offers to end your night, and
              <b> pausing is the primary button</b>. The copy refuses to blame the user: "that's on the
              night, not on you." An engagement-optimized product cannot ship this screen, which is
              exactly why it is the best evidence that this one is not.
            </p>
          </div>
          <div className="mg-riskcard">
            <h3>The no-match screen turns a weakness into the pitch</h3>
            <p>
              Live matching depends on density, so a quiet campus is a real structural flaw. Instead of
              a spinner, the screen says nobody compatible is free this exact minute, <em>and that's the
              point</em>, because when you do match they are really there. The honest version of the
              weakness is more convincing than hiding it.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 07 reflection ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>07</span> Reflection</div>
        <h2 className="mg-rv">Measuring how it felt without grading anyone</h2>
        <div className="mg-duo mg-rv">
          <div className="mg-duo-text">
            <p>
              The first version asked you to rate every conversation. I cut it, and the reasoning is
              the most useful thing in the spec: ISO is deliberately low-volume and every conversation
              is already an emotionally loaded event. Rating each one turns a human moment into
              homework, and worse, it quietly reframes the product as <em>grade the person you just
              talked to</em>.
            </p>
            <p>
              What shipped is implicit-first, in three tiers. Behavior carries the matching signal, and
              there is plenty of it already: keep-talking answers, reply latency, whether the
              conversation reached the outcome question, whether they met. On top of that, an optional
              one-tap check-in, dismissible with no friction. The real explicit moment is
              <b> batched weekly</b> into a recap, which makes it one calm ritual instead of a tax on
              every interaction.
            </p>
            <p>
              The trend chart has a floor built into its geometry. Satisfaction maps into a bounded
              band, so a slow week reads as resting and the line cannot crash. The comment in that
              code is a rule I would keep: <b>metric shame is a design bug</b>.
            </p>
          </div>
          <figure className="mg-phone">
            <img src={trend} alt="The trend and recap screen" loading="lazy" />
            <figcaption>
              Direction over numbers. Five dots labelled rough, flat, fine, warm, glowing replaced a row
              of emoji faces, and every reflection surface prints a skip and a privacy line.
            </figcaption>
          </figure>
        </div>

        <div className="mg-shots mg-shots-3 mg-rv" style={{ marginTop: 30 }}>
          <figure><img src={closeoutOutcome} alt="The outcome question" loading="lazy" /><figcaption>The only question the North Star is made of. Asked at most once per conversation.</figcaption></figure>
          <figure><img src={closeoutReflection} alt="The reflection step" loading="lazy" /><figcaption>"Private, about the experience, never a score on a person. Skip freely."</figcaption></figure>
          <figure><img src={maybeAgain} alt="Maybe we'll meet again" loading="lazy" /><figcaption>One slot, with its own expiry shown as live arithmetic.</figcaption></figure>
        </div>

        <div className="mg-decision mg-rv" style={{ marginTop: 30 }}>
          <div className="mg-decision-tag">Decision record · the hardest one to get right</div>
          <p>
            <b>Revival, or "Maybe We'll Meet Again", is the feature most likely to smuggle the roster
            back in.</b> Letting people hold someone in reserve is optionality hoarding with better
            manners. It shipped anyway, under four constraints that each close a specific hole.
          </p>
          <p>
            <b>One slot</b>, because reserving someone new means un-reserving whoever was there, which
            mirrors the live constraint exactly. <b>Blind</b>, so a one-sided hold is invisible and no
            second rejection is possible. <b>Decaying</b>, at fourteen days or after three strong later
            conversations, silently, because holding someone on ice forever is its own unkindness.
            And <b>only when you are free</b>, absolutely.
          </p>
          <p>
            Going from one slot to three later is additive and easy. Going from three to one would feel
            like a confiscation, so it starts restrictive. There is even a guardrail metric watching
            for the failure mode: if revival attempts per user climb abnormally, the feature is driving
            the exact behavior the product exists to remove.
          </p>
        </div>
      </section>

      {/* ---------------- 08 motion ---------------- */}
      <section className="mg-part mg-band" style={{ background: '#FFF8EC' }}>
        <div className="mg-partmark mg-rv"><span>08</span> Motion</div>
        <h2 className="mg-rv">Five moments loud, everything else quiet</h2>
        <p className="mg-lede mg-rv">
          Thirty-one screens only feel like one product if they share one set of physics, so every
          transition pulls from a named preset and ad-hoc easing counts as an audit failure. On top of
          that sits one deliberately loud effect, spent five times.
        </p>
        <div className="mg-table mg-rv">
          <div className="mg-tr mg-th"><span>Moment</span><span>Color</span><span>Tempo</span><span>What it means</span></div>
          <div className="mg-tr"><span>Enter the queue</span><span>orange</span><span>bloom</span><span>Committing to be present</span></div>
          <div className="mg-tr"><span>Match found</span><span>orange</span><span>burst</span><span>Arrival</span></div>
          <div className="mg-tr"><span>Mutual keep-talking</span><span>green</span><span>bloom</span><span>A connection forming</span></div>
          <div className="mg-tr"><span>Yes, we met</span><span>green</span><span>one pulse</span><span>The North Star, with no confetti</span></div>
          <div className="mg-tr"><span>Clean close</span><span>soft amber</span><span>gentle</span><span>Closure, not celebration</span></div>
        </div>
        <div className="mg-cols mg-rv">
          <p>
            The effect is a disc of brand color blooming from the exact point you touched, sized to
            reach the farthest corner. The destination screen mounts underneath while the color is at
            full cover, then it clears to reveal it. That makes it a <b>handoff rather than a curtain</b>,
            and it is interruptible: a new bloom replaces the current one, and if the host is not
            mounted the action still fires.
          </p>
          <p>
            The reason to use color rather than a page transition is a sentence I kept coming back to
            while building. A route change says "different page". A flood of color from your fingertip
            says <em>you did something that matters</em>. Those five moments are the five sentences of
            the product thesis: commit, meet, choose each other, meet for real, end well.
          </p>
        </div>
        <div className="mg-shots mg-shots-3 mg-rv">
          <figure><img src={editProfile} alt="Edit profile" loading="lazy" /><figcaption>Nine captioned photo slots, rebuilt from three during the build. Prompts are framed as talking points rather than a résumé.</figcaption></figure>
          <figure><img src={maybeAgain} alt="Maybe we'll meet again" loading="lazy" /><figcaption>Deep routes nest under Profile and arrive with a morph, so the three-tab rule never bends.</figcaption></figure>
          <figure><img src={profile} alt="The profile bento" loading="lazy" /><figcaption>An asymmetric bento of nine destinations, each showing its own state at a glance.</figcaption></figure>
        </div>
      </section>

      {/* ---------------- 09 the audit ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>09</span> The audit</div>
        <h2 className="mg-rv">Grading every surface against the two risks</h2>
        <p className="mg-lede mg-rv">
          Two questions decide whether a feature belongs here. Does it <b>force intention</b>, and
          could it <b>rebuild a roster</b>? Plotting the shipped product against both is the most
          honest review I know how to do, because the interesting entries are the ones near the edge.
        </p>
        <figure className="mg-figure mg-rv">
          <AuditMap />
          <figcaption>
            Filled dots survived validation without argument. Open circles are the features that could
            drift, kept on short leashes.
          </figcaption>
        </figure>
        <div className="mg-riskcards mg-rv">
          <div className="mg-riskcard">
            <h3>Why Memories stays</h3>
            <p>
              A list of people you connected with is a roster wearing a scrapbook cover. It survives
              because it is strictly read-only, and one clause in its own description does the work:
              <em> "nothing here can be replied to, and no one is waiting."</em> That sentence is the
              difference between a journal and an inbox.
            </p>
          </div>
          <div className="mg-riskcard">
            <h3>Why the paid tier stays</h3>
            <p>
              Any subscription in a dating app invites the suspicion that money buys reach. It stays
              because the matchmaker provably never reads the flag, and because the limit is printed on
              the paywall rather than buried in terms. It would be the first thing cut if that ever
              stopped being true.
            </p>
          </div>
        </div>

        <h3 className="mg-subhead mg-rv">Prioritizing the build</h3>
        <p className="mg-lede mg-rv">
          The same surfaces, sorted the way they were actually planned. The bottom-right quadrant is the
          most useful one on the board, because it is the list of things this product said no to.
        </p>
        <div className="mg-matrix mg-rv">
          <div className="mg-matrix-y"><span>High value</span><span>Low value</span></div>
          <div className="mg-matrix-grid">
            <div className="mg-quad mg-q-blue">
              <div className="mg-quad-tag">High value · low effort</div>
              <div className="mg-quad-name">Shipped first</div>
              <div className="mg-quad-chips">
                <span>store-enforced invariant</span><span>reply timer</span><span>polite close</span>
                <span>three tabs</span><span>no-match screen</span>
              </div>
            </div>
            <div className="mg-quad mg-q-green">
              <div className="mg-quad-tag">High value · high effort</div>
              <div className="mg-quad-name">The big bets</div>
              <div className="mg-quad-chips">
                <span>live matchmaking</span><span>sealed simultaneous reveal</span><span>ten-step onboarding</span>
                <span>outcome loop</span><span>the motion system</span>
              </div>
            </div>
            <div className="mg-quad mg-q-purple">
              <div className="mg-quad-tag">Low value · low effort</div>
              <div className="mg-quad-name">Nice to have</div>
              <div className="mg-quad-chips">
                <span>weekly recap card</span><span>date planner</span><span>custom icon set</span>
              </div>
            </div>
            <div className="mg-quad mg-q-yellow">
              <div className="mg-quad-tag">Low value · high effort</div>
              <div className="mg-quad-name">Declined or deferred</div>
              <div className="mg-quad-chips">
                <span>discovery feed (never)</span><span>likes-you surface (never)</span>
                <span>paid visibility (never)</span><span>two-tab live mode (deferred)</span>
              </div>
            </div>
          </div>
          <div className="mg-matrix-x"><span>Low effort</span><span>High effort</span></div>
        </div>
      </section>

      {/* ---------------- 10 what broke ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>10</span> What broke</div>
        <h2 className="mg-rv">The bugs, and what each one taught</h2>
        <p className="mg-lede mg-rv">
          Every item below was found by exercising the running app against its own acceptance criteria,
          which is also how the nine criteria got traced in the first place. The first one is my
          favourite bug in anything I have built.
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
          <figure className="mg-phone">
            <img src={safety} alt="The safety center" loading="lazy" />
            <figcaption>Trust status, reports and blocks, and meeting-up guidance in one place.</figcaption>
          </figure>
          <div className="mg-duo-text">
            <h3>What is still open, stated plainly</h3>
            <p>
              <b>Two-tab live mode was never built.</b> The build spec called it the most convincing
              possible demonstration of presence: open the app in two tabs and watch a real conversation
              cross between them over a broadcast channel. It was scoped as a stretch goal and it is the
              one scoped feature that did not ship. It remains the single highest-value thing left.
            </p>
            <p>
              <b>The chat-open morph is an approximation.</b> A true shared-element transition carries
              the searching disc into the match reveal and then into the room header. The rest of the
              screen fades in beneath it, and it holds up, but it is not the full continuous morph the
              motion brief describes.
            </p>
            <p>
              <b>The design document has drifted.</b> It predates two shipped changes and now contradicts
              the product on photo count and on emoji. It is a good artifact that needs regenerating,
              and it is listed here rather than quietly fixed because the drift is the interesting part.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 11 metrics ---------------- */}
      <section className="mg-part">
        <div className="mg-partmark mg-rv"><span>11</span> Metrics</div>
        <h2 className="mg-rv">The one number, and the numbers that keep it honest</h2>
        <div className="mg-split mg-rv">
          <div className="mg-split-col is-hi">
            <div className="mg-split-tag">North Star</div>
            <h3>Real-life dates initiated, per active user per month</h3>
            <ul>
              <li>Self-reported through the outcome question</li>
              <li>The atomic unit is one answer: <b>yes, we met</b></li>
              <li>Version one measured mutual conversations instead. That became a leading indicator.</li>
            </ul>
            <p>We win when two people leave the app together, not when they swipe longer.</p>
          </div>
          <div className="mg-split-col">
            <div className="mg-split-tag">Why the pairing matters</div>
            <h3>What a mismatch would diagnose</h3>
            <ul>
              <li>Leading indicator up, North Star flat, means the loop works and the handoff to real life is broken</li>
              <li>Both flat means the loop itself is not landing</li>
              <li>North Star up on thin conversation volume means the queue is under-serving a group that is already succeeding</li>
            </ul>
            <p>A single metric cannot tell those three apart, which is the argument for keeping both.</p>
          </div>
        </div>

        <div className="mg-table mg-table-3 mg-rv">
          <div className="mg-tr mg-th"><span>Metric</span><span>Target</span><span>Why this threshold</span></div>
          <div className="mg-tr"><span>Match liquidity</span><span>≤ 60s median</span><span>Prime-time queue to live match. Past a minute, waiting stops reading as presence.</span></div>
          <div className="mg-tr"><span>Queue success rate</span><span>≥ 80%</span><span>Share of queue sessions reaching a live match at prime time.</span></div>
          <div className="mg-tr"><span>Mutual continue rate</span><span>≥ 25%</span><span>One in four conversations becoming mutual is the loop working as designed.</span></div>
          <div className="mg-tr"><span>D7 / D30 retention</span><span>≥ 30% / ≥ 15%</span><span>Deliberately modest, because a low-volume product should not look like a game.</span></div>
          <div className="mg-tr"><span>Verification completion</span><span>≥ 60%</span><span>Verification is the trust boundary, so abandonment here is a product failure.</span></div>
          <div className="mg-tr"><span>Revival attempts per user</span><span>watch, do not grow</span><span>A climb means the held-flag feature is rebuilding the roster.</span></div>
        </div>

        <details className="mg-details mg-rv">
          <summary>Guardrails that must not regress</summary>
          <ul>
            <li>Reports per thousand conversations</li>
            <li>Median reply time in the live room</li>
            <li>Involuntary session drops, and abandon rate mid-conversation</li>
            <li>Reflection prompt completion measured against a <b>retention delta</b>, because a negative delta means reflection is causing fatigue rather than insight</li>
            <li>Sessions ending via the burnout nudge versus a natural exit</li>
            <li>Blind-mutual hit rate on revival, framed in the spec as a diagnostic and explicitly <b>not a target to inflate</b></li>
          </ul>
        </details>
      </section>

      {/* ---------------- coda ---------------- */}
      <section className="mg-part mg-coda">
        <div className="mg-partmark mg-rv"><span>12</span> What I would carry forward</div>
        <h2 className="mg-rv">Takeaways</h2>
        <div className="mg-takeaways mg-rv">
          <div className="mg-take">
            <b>Put the principle in the store</b>
            <p>A rule enforced in the state layer survives every future screen. A rule enforced in the UI survives until someone adds a button.</p>
          </div>
          <div className="mg-take">
            <b>Refusals are a positioning strategy</b>
            <p>The empty quadrant was empty because filling it costs incumbents revenue. That makes a refusal defensible in a way a feature never is.</p>
          </div>
          <div className="mg-take">
            <b>Narrate the weakness</b>
            <p>Thin liquidity is a real flaw. Saying so on the no-match screen converted it into the most persuasive copy in the product.</p>
          </div>
          <div className="mg-take">
            <b>Measure the thing you actually want</b>
            <p>Mutual conversations were easy to move and easy to fake. Dates initiated is harder to report and impossible to game, so it became the number.</p>
          </div>
        </div>
        <div className="mg-shipchips mg-rv">
          <span>31 screens</span>
          <span>3 tabs, never an inbox</span>
          <span>9 acceptance criteria traced</span>
          <span>5 threshold moments</span>
          <span>22 custom icons, no emoji</span>
          <span>optional LLM partner behind a dev proxy</span>
          <span>full PRD + design doc</span>
          <span>two-tab live mode still open</span>
        </div>
      </section>

      <div className="mg-finale mg-band mg-rv">
        <blockquote className="mg-pull mg-pull-light">
          Presence, not pressure.
        </blockquote>
        <a className="mg-finale-cta" href="https://pjeon18.github.io/iso-prototype/" target="_blank" rel="noreferrer">
          Open the prototype → pjeon18.github.io/iso-prototype
        </a>
      </div>

      <details className="mg-details mg-sources mg-rv">
        <summary>Sources &amp; notes</summary>
        <p className="mg-sources-p">
          Market and behavior figures are as cited in the product requirements document: college
          non-adoption (Axios), Gen Z burnout (Forbes Health 2025), offline preference (Kinsey /
          DatingAdvice), safety concern (2025 survey), and payer and revenue movement from public
          quarterly reporting. Personas are composites written from that research, not interview
          subjects. All conversation partners in the prototype are fictional, with scripted voices and
          an optional model-driven mode that runs behind a development proxy so no key reaches the
          browser. Competitor names appear for identification and commentary, and all marks belong to
          their owners.
        </p>
      </details>

      <div className="case-next mg-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/prep-io" className="case-next-link">
          Prep.io. Office hours, made live. <span className="arr">→</span>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
