// The Studdy case study, magazine edition — a bespoke long-read with its own
// layout system (see studdy-mag.css). Content lives inline: this page IS the
// deliverable, and its structure changes with its story.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import '../styles/studdy-mag.css'

import heroImg from '../assets/studdy-hero.jpg'
import loopImg from '../assets/studdy-loop.jpg'
import salonImg from '../assets/studdy-salon.jpg'
import shopImg from '../assets/studdy-shop.jpg'
import v0Img from '../assets/studdy-v0.jpg'
import texlabImg from '../assets/studdy-texlab.jpg'
import roomlabImg from '../assets/studdy-roomlab.jpg'
import badLightImg from '../assets/studdy-bad-light.jpg'
import badRetroImg from '../assets/studdy-bad-retro.jpg'
import bugCatImg from '../assets/studdy-bug-cat.jpg'
import bugGhostImg from '../assets/studdy-bug-ghost.jpg'
import charBeret from '../assets/studdy-char-beret.jpg'
import charCatears from '../assets/studdy-char-catears.jpg'
import charPlain from '../assets/studdy-char-plain.jpg'
import refLofigirl from '../assets/ref-lofigirl.jpg'
import refStudywithme from '../assets/ref-studywithme.jpg'
import refStudytogether from '../assets/ref-studytogether.jpg'
import refForest from '../assets/ref-forest.jpg'
import refFocusmate from '../assets/ref-focusmate.jpg'
import refRoblox from '../assets/ref-roblox.jpg'
import refCyworld from '../assets/ref-cyworld.jpg'
import wordmark from '../assets/studdy-wordmark.png'
import personaMina from '../assets/studdy-persona-mina.png'
import personaDaniel from '../assets/studdy-persona-daniel.png'
import personaCaroline from '../assets/studdy-persona-caroline.png'

// ---------------------------------------------------------------------------

function useReveals() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = root.current?.querySelectorAll('.rv') ?? []
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
// Chart 1: the market. Every label sits beside its dot, vertically centered;
// `end` flips it to the left side for dots near the right edge.

function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; hero?: boolean; end?: boolean }[] = [
    { x: 14, y: 16, label: 'Lofi Girl', sub: '15.8M subscribers' },
    { x: 26, y: 34, label: 'Study-with-me video', sub: 'gongbang, since ~2018' },
    { x: 40, y: 78, label: 'Forest', sub: '60M users · solo, gamified' },
    { x: 58, y: 55, label: 'Study Together', sub: '1M-member Discord' },
    { x: 86, y: 84, label: 'Focusmate', sub: '9M sessions · camera on', end: true },
    { x: 84, y: 22, label: 'Studdy', sub: 'mutual, ambient', hero: true, end: true },
  ]
  return (
    <svg className="sm-chart" viewBox="0 0 640 460" role="img" aria-label="Market map: presence versus pressure">
      <defs>
        <marker id="smArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#B9B4A8" />
        </marker>
      </defs>
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <rect x="340" y="20" width="270" height="190" fill="#FFF3EC" opacity="0.55" />
      <text x="595" y="42" textAnchor="end" fontSize="11.5" fill="#C86A3F" fontStyle="italic">the open corner: mutual + calm</text>
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" markerEnd="url(#smArr)" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" markerEnd="url(#smArr)" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">one-way presence</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">mutual presence</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">demanding</text>
      <text x="58" y="120" fontSize="12" fill="#38352F" transform="rotate(-90 58 120)" fontWeight="700">ambient</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + (d.y / 100) * 380
        const tx = d.end ? cx - 17 : cx + 17
        const anchor = d.end ? 'end' : 'start'
        return (
          <g key={d.label}>
            <circle cx={cx} cy={cy} r={d.hero ? 9 : 6} fill={d.hero ? '#E05C1F' : '#38352F'} opacity={d.hero ? 1 : 0.75} />
            {d.hero && <circle cx={cx} cy={cy} r="15" fill="none" stroke="#E05C1F" strokeDasharray="3 3" />}
            <text x={tx} y={cy - 1} textAnchor={anchor} fontSize="13.5" fontWeight="800" fill="#121110">{d.label}</text>
            <text x={tx} y={cy + 13} textAnchor={anchor} fontSize="11" fill="#8F8B83">{d.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Chart 2: Studdy's own UI, graded. Same rule: every label hugs its dot.

function DecisionMap() {
  const dots: { x: number; y: number; label: string; risk?: boolean; end?: boolean }[] = [
    { x: 88, y: 88, label: 'communal 25/5 clock', end: true },
    { x: 82, y: 62, label: 'chat only at breaks', end: true },
    { x: 62, y: 76, label: 'napkin status' },
    { x: 74, y: 40, label: 'headphones = do-not-disturb', end: true },
    { x: 52, y: 92, label: 'name tags over heads', end: true },
    { x: 42, y: 68, label: 'guestbook doodles', end: true },
    { x: 30, y: 84, label: '"friend is studying" banner', risk: true, end: true },
    { x: 26, y: 34, label: 'xp leaderboard', risk: true },
    { x: 66, y: 22, label: 'streaks (pausing)' },
    { x: 50, y: 52, label: 'lofi radio per café' },
    { x: 38, y: 14, label: 'furnish & wardrobe', end: true },
  ]
  return (
    <svg className="sm-chart" viewBox="0 0 640 460" role="img" aria-label="Studdy UI decisions: focus versus company">
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">hurts focus</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">supports focus</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">works alone</text>
      <text x="58" y="140" fontSize="12" fill="#38352F" transform="rotate(-90 58 140)" fontWeight="700">adds company</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + ((100 - d.y) / 100) * 380
        return (
          <g key={d.label}>
            {d.risk ? (
              <circle cx={cx} cy={cy} r="6.5" fill="#FBFAF6" stroke="#E05C1F" strokeWidth="2.5" />
            ) : (
              <circle cx={cx} cy={cy} r="6.5" fill="#38352F" />
            )}
            <text
              x={d.end ? cx - 15 : cx + 15}
              y={cy + 4.5}
              textAnchor={d.end ? 'end' : 'start'}
              fontSize="12.5"
              fontWeight="700"
              fill={d.risk ? '#C86A3F' : '#121110'}
            >{d.label}</text>
          </g>
        )
      })}
      <g>
        <circle cx="410" cy="443" r="5.5" fill="#38352F" />
        <text x="422" y="447" fontSize="11.5" fill="#55524B">held its ground</text>
        <circle cx="533" cy="443" r="5.5" fill="#FBFAF6" stroke="#E05C1F" strokeWidth="2.2" />
        <text x="545" y="447" fontSize="11.5" fill="#55524B">watched risk</text>
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------

const REFS = [
  {
    img: refLofigirl,
    name: 'Lofi Girl',
    stat: '15.8M subscribers',
    line: 'One illustrated girl, studying forever. ~100k people listening at any hour.',
  },
  {
    img: refStudywithme,
    name: '"Study with me"',
    stat: 'millions of views per video',
    line: 'Two silent hours of a stranger at a desk. Born in Korea as gongbang.',
  },
  {
    img: refStudytogether,
    name: 'Study Together',
    stat: '1,068,281 members',
    line: 'Discord’s largest study server. "How chatty? Like a busy coffee shop."',
  },
  {
    img: refForest,
    name: 'Forest',
    stat: '60M users',
    line: 'Stay off your phone, grow a tree. Effective, gamified, and utterly alone.',
  },
  {
    img: refFocusmate,
    name: 'Focusmate',
    stat: '9M sessions',
    line: 'Scheduled coworking with a stranger, camera on. It works. It feels like a meeting.',
  },
]

function PriorityMatrix() {
  const Q = [
    {
      cls: 'q-blue', tag: 'High value · low effort', name: 'Shipped first',
      items: ['communal clock', 'napkin status', 'headphones = DND', 'streak pausing', 'name tags'],
    },
    {
      cls: 'q-green', tag: 'High value · high effort', name: 'The big bets',
      items: ['realtime presence', 'server-verified economy', 'clubs + clubhouse', 'lofi radio'],
    },
    {
      cls: 'q-purple', tag: 'Low value · low effort', name: 'Nice-to-haves',
      items: ['tag charms', 'guestbook doodles', 'warm/cool bulbs'],
    },
    {
      cls: 'q-yellow', tag: 'Low value · high effort', name: 'Declined or deferred',
      items: ['retro toggle (shipped, killed)', 'room extension (deferred)', 'voice chat (never)'],
    },
  ]
  return (
    <div className="sm-matrix rv">
      <div className="sm-matrix-y"><span>High value</span><span>Low value</span></div>
      <div className="sm-matrix-grid">
        {Q.map((q) => (
          <div className={'sm-quad ' + q.cls} key={q.name}>
            <div className="sm-quad-tag">{q.tag}</div>
            <div className="sm-quad-name">{q.name}</div>
            <div className="sm-quad-chips">
              {q.items.map((it) => <span key={it}>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="sm-matrix-x"><span>Low effort</span><span>High effort</span></div>
    </div>
  )
}

function RefCarousel() {
  const [i, setI] = useState(0)
  const n = REFS.length
  const go = (d: number) => setI((v) => (v + d + n) % n)
  return (
    <div className="sm-carousel rv">
      <div className="sm-caro-stage">
        {REFS.map((r, j) => {
          let off = j - i
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const cls = off === 0 ? 'is-focus' : Math.abs(off) === 1 ? 'is-side' : 'is-hidden'
          return (
            <div
              className={'sm-caro-card ' + cls}
              key={r.name}
              style={{ transform: `translateX(${off * 72}%) scale(${off === 0 ? 1 : 0.82})` }}
              onClick={() => off !== 0 && setI(j)}
            >
              <img src={r.img} alt={r.name} loading="lazy" />
              <div className="sm-caro-body">
                <div className="sm-refcard-name">{r.name}</div>
                <div className="sm-refcard-stat">{r.stat}</div>
                <p>{r.line}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="sm-caro-nav">
        <button onClick={() => go(-1)} aria-label="Previous product">←</button>
        <div className="sm-caro-dots">
          {REFS.map((x, j) => (
            <button key={x.name} className={j === i ? 'on' : ''} onClick={() => setI(j)} aria-label={x.name} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next product">→</button>
      </div>
    </div>
  )
}

interface Complaint {
  quote: string
  fix: string
  lesson: string
}

const COMPLAINTS: Complaint[] = [
  {
    quote: 'When you sit, you sink into the chair.',
    fix: 'Seat math rebuilt. The sit pose now measures from the cushion top, and every seat was re-tuned against the character.',
    lesson: 'Nobody files a ticket about "seat anchoring." They say it looks wrong. Translate feel into geometry.',
  },
  {
    quote: 'It should have usernames over heads, like Minecraft.',
    fix: 'Floating name tags with level badges. Custom tag colors went on sale in the salon and quietly became an identity feature.',
    lesson: 'Users cite other products as shorthand for a need. The need here was "I want to be seen," not "copy Minecraft."',
  },
  {
    quote: 'The room light gets darker toward the corners. It should be even.',
    fix: 'One ceiling light became a pendant grid that scales with the room, normalized so five lamps aren’t five times brighter than one.',
    lesson: 'The first fix washed out the whole palette. Evenness and brightness are different asks; it took three rounds.',
  },
  {
    quote: 'Now it’s way too bright. And dusk looks the same as day.',
    fix: 'Per-mode intensity curves, plus a lower ceiling on daytime brightness. Warm and cool bulbs became a café setting.',
    lesson: 'Every knob you hand users needs its own limits per context. One global max was lazy math.',
  },
  {
    quote: 'There are two of me on my screen.',
    fix: 'One body per person: presence deduplicates by identity instead of connection, and a reload says goodbye before it leaves.',
    lesson: 'Distributed-systems jank reads as horror-movie jank. Ghosts are a bug class users FEEL.',
  },
  {
    quote: 'She redecorated but I still see her old room.',
    fix: 'A security migration had silently broken publishing (column grants versus upsert). Rooms also now refresh live, every 20 seconds, while you stand in them.',
    lesson: 'My proudest hardening work shipped my quietest data-loss bug. Every migration needs a round-trip test from the client’s side.',
  },
  {
    quote: 'She closed her laptop overnight and woke up rich.',
    fix: 'The focus clock only counts while the app is awake. A long absence tucks your chair in and pays what you actually earned.',
    lesson: 'The exploit was also a design question: honor, pause, or kick? We chose the kind version of all three.',
  },
  {
    quote: 'Our laptops get hot and the battery drains fast.',
    fix: 'Low-power GPU preference and an idle governor: 30fps when your hands are off, full rate the instant you touch anything.',
    lesson: 'An idle game that renders like a shooter is a design contradiction. Performance is product, not plumbing.',
  },
  {
    quote: 'The retro mode looks overly pixelated and buggy. Honestly just get rid of it.',
    fix: 'Deleted, same day. One look now, with adaptive quality that steps down on weak hardware instead of asking anyone to choose.',
    lesson: 'I shipped the toggle because I couldn’t choose. Users shouldn’t inherit your indecision as a settings menu.',
  },
  {
    quote: 'I’m level 21 with 1,800 beans and there’s nothing left to do.',
    fix: 'The atelier (animated showpieces), the wardrobe (hats, tag charms), and a written economy with real price bands.',
    lesson: 'Your most engaged user hitting the ceiling is the best problem statement you will ever receive. Answer it with wants, not numbers.',
  },
]

// ---------------------------------------------------------------------------

export default function StuddyMag() {
  const root = useReveals()
  const bar = useProgress()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="smag" ref={root}>
      <div className="sm-progress" ref={bar} />

      <nav className="case-nav sm-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← All work</Link>
      </nav>

      {/* ---------------- masthead ---------------- */}
      <header className="sm-masthead">
        <img className="sm-wordmark rv" src={wordmark} alt="Studdy" />
        <div className="sm-kicker rv">Case study · shipped &amp; live · 2026</div>
        <h1 className="rv">
          A study spot<br />that <em>never closes</em> ♪
        </h1>
        <p className="sm-dek rv">
          Studdy is a multiplayer study café. Real people in tiny pixel bodies, one 25/5 clock shared by
          every room in the world. This is the whole build, told honestly: the research, the ugly first
          versions, the complaints that shaped it, and the economics of a place people want to sit in.
        </p>
        <div className="sm-meta rv">
          <span><b>Role</b> product · design · engineering, solo</span>
          <span><b>Stack</b> three.js · TypeScript · Supabase · PWA</span>
          <span className="sm-meta-links">
            <a href="https://pjeon18.github.io/studdy/" target="_blank" rel="noreferrer">Open the café ↗</a>
            <a href="https://github.com/pjeon18/studdy" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://github.com/pjeon18/studdy/blob/main/docs/ECONOMY.md" target="_blank" rel="noreferrer">Economy doc ↗</a>
          </span>
        </div>
      </header>

      <figure className="sm-bleed rv">
        <img src={heroImg} alt="A busy Studdy café mid-sprint" />
        <figcaption>moon_latte's café, mid-sprint. The bubble is a regular announcing five more minutes until break.</figcaption>
      </figure>

      {/* ---------------- the product, first ---------------- */}
      <section className="sm-part sm-productfirst">
        <div className="sm-partmark rv"><span>♪</span> The product, in one minute</div>
        <div className="sm-product-grid rv">
          <div className="sm-product-what">
            <h2>Own a café. Study in everyone's.</h2>
            <ul>
              <li>Sit anywhere and a verified focus clock starts. A minute of focus earns a bean.</li>
              <li>Every café shares one 25/5 sprint clock. Chat opens at breaks.</li>
              <li>Beans buy furniture, hats, and an animated café cat. Never rank, never power.</li>
              <li>Friends' cafés are one door away, live, with real people inside.</li>
            </ul>
            <a className="sm-playbtn" href="https://pjeon18.github.io/studdy/" target="_blank" rel="noreferrer">
              ▸ open the café — free, ten seconds, no signup
            </a>
          </div>
          <figure className="sm-product-shot">
            <img src={loopImg} alt="Studying in Studdy" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* ---------------- part one: research ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>01</span> The research</div>
        <h2 className="rv">How people actually study now</h2>
        <div className="sm-cols rv">
          <p>
            Start in South Korea, around the college entrance exams. Students began broadcasting themselves
            studying: hours of silence, a desk lamp, turning pages. The genre got a name (<b>gongbang</b>, "study
            broadcast") and a purpose. Being watched applies pressure. Watching provides company.
            It crossed the Pacific as "study with me" and grew into an entire economy of presence.
          </p>
          <p>
            The psychology underneath has a name too: <b>body doubling</b>. Working beside a person who
            demands nothing of you is one of the most recommended focus strategies in the ADHD community.
            The mechanism is real. Social presence recruits the dopamine circuitry that ADHD runs short on,
            and a calm body nearby regulates arousal. None of this needed inventing. It needed a room.
          </p>
        </div>

        <p className="sm-lede rv">Five products own this behavior today. Meet them:</p>
        <RefCarousel />

        <div className="sm-stats rv">
          <div><span className="v">15.8M</span><span className="l">Lofi Girl subscribers, ~100k listening at any hour</span></div>
          <div><span className="v">1M+</span><span className="l">members in Discord's largest study server</span></div>
          <div><span className="v">60M</span><span className="l">Forest users growing trees by not touching their phone</span></div>
          <div><span className="v">9M</span><span className="l">Focusmate sessions of camera-on coworking</span></div>
          <div><span className="v">79%</span><span className="l">of Gen Z adults report loneliness, the highest of any generation</span></div>
          <div><span className="v">44%</span><span className="l">of daily users on the biggest avatar platform are now over 17</span></div>
        </div>

        <div className="sm-statement sm-band sm-band-dark rv">
          <p>Every one of these is lopsided.</p>
          <p className="sm-statement-sub">
            The streams are one-way glass: the streamer will never know you existed. The Discord is mutual
            but formless, a black window with names in it. Focusmate works and feels like a meeting.
            Forest works and is utterly alone.
          </p>
          <p className="sm-statement-big">Nobody was building <em>mutual presence at ambient pressure.</em></p>
        </div>

        <figure className="sm-figure rv">
          <MarketMap />
          <figcaption>
            The map that started the project. Everything crowds the one-way or high-pressure edges.
            The calm, mutual corner was empty.
          </figcaption>
        </figure>

        <div className="sm-duo rv">
          <div className="sm-duo-text">
            <h3>One more observation</h3>
            <p>
              The generation that grew up inside avatar worlds is aging into exams, theses, and remote work.
              On the biggest such platform, 44% of daily users are now past 17, and the fastest-growing
              cohort is 17 to 24. They didn't leave. They grew up in place.
            </p>
            <p>
              These users don't experience an avatar in a room as a game. They experience it as
              <em> somewhere to be</em>. A study space built like a world, rather than an app, meets them
              where they already live. The study tools above haven't caught up to that expectation.
            </p>
          </div>
          <figure>
            <img src={refRoblox} alt="An avatar platform's home page" loading="lazy" />
            <figcaption>The default childhood of a generation: one avatar, millions of rooms. Nearly half its daily users are now over 17.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- part two: the people ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>02</span> The people</div>
        <h2 className="rv">Three personas from the research</h2>
        <p className="sm-lede rv">
          The market map says where the gap is. These three say who is standing in it. They are composites
          drawn from the communities above: stream chats, study servers, and the playtesters who later
          lived in the prototype. Their portraits are rendered by the game's own character engine.
        </p>

        <div className="sm-personas rv">
          <article className="sm-persona">
            <header>mina · 19 · sophomore</header>
            <div className="sm-persona-fig"><img src={personaMina} alt="Mina's Studdy character: long lavender hair and cat ears" loading="lazy" /></div>
            <p className="sm-persona-bio">
              Studies alone in her dorm with Lofi Girl on a second monitor every night. Deleted two social
              apps because they drained her, but the silence in the room gets heavy around 11pm.
            </p>
            <h4>What she wants</h4>
            <ul>
              <li>Company that asks nothing back</li>
              <li>Atmosphere: music, rain, warm light</li>
              <li>Something gentle to look at between sprints</li>
            </ul>
            <p className="sm-persona-pain"><b>Breaking point</b> The stream never knows she is there, and YouTube keeps a distraction one recommendation away.</p>
          </article>

          <article className="sm-persona">
            <header>daniel · 22 · pre-med</header>
            <div className="sm-persona-fig"><img src={personaDaniel} alt="Daniel's Studdy character: short dark hair and glasses" loading="lazy" /></div>
            <p className="sm-persona-bio">
              Closes the library most nights and still distrusts his own tally of hours. Tried camera-on
              coworking once; being watched by a stranger on video felt like a job interview.
            </p>
            <h4>What he wants</h4>
            <ul>
              <li>A body at the next desk, no talking required</li>
              <li>An honest count of his focused time</li>
              <li>Structure that the room imposes, not a calendar</li>
            </ul>
            <p className="sm-persona-pain"><b>Breaking point</b> Every focus timer he tried could be gamed, so the numbers meant nothing to him within a week.</p>
          </article>

          <article className="sm-persona">
            <header>caroline · 21 · junior</header>
            <div className="sm-persona-fig"><img src={personaCaroline} alt="Caroline's Studdy character: caramel hair and a red beret" loading="lazy" /></div>
            <p className="sm-persona-bio">
              Plays cozy games between problem sets and finishes every checklist she meets. Studies plenty
              already; what bothers her is that the hours vanish without leaving anything behind.
            </p>
            <h4>What she wants</h4>
            <ul>
              <li>A space of her own that accrues over time</li>
              <li>Goals worth finishing and things worth saving for</li>
              <li>Progress she can show someone</li>
            </ul>
            <p className="sm-persona-pain"><b>Breaking point</b> Streak mechanics that punish one rest day read as guilt, not motivation, and she churns out.</p>
          </article>
        </div>

        <h3 className="sm-serve-head rv">What each of them needs the product to be</h3>
        <div className="sm-serves rv">
          <div className="sm-serve">
            <span>for mina</span>
            <p>
              The café itself is the ambience. Every café runs a lofi radio on one shared schedule, rain
              falls outside the windows, and she sets her own light. Presence carries no obligation: no
              camera, no DMs, sitting down is the whole contribution, and chat only opens on the shared break.
            </p>
          </div>
          <div className="sm-serve">
            <span>for daniel</span>
            <p>
              The clock has to be honest before it can mean anything. Focused time is verified on the
              server and only accrues while the app is actually awake, so a closed laptop earns one beat
              and not a night. The communal 25/5 sprint clock gives the room its structure; he schedules nothing.
            </p>
          </div>
          <div className="sm-serve">
            <span>for caroline</span>
            <p>
              Hours leave a residue. Every focused minute becomes a bean, beans buy expression and never
              advantage, and the long game is cosmetic: café themes, a wardrobe, animated atelier pieces.
              She became the real playtester who maxed the economy, and her complaint drives part ten.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- part three: the bet ---------------- */}
      <section className="sm-part sm-band sm-band-pink">
        <div className="sm-partmark rv"><span>03</span> The bet</div>
        <h2 className="rv">Defining the product</h2>
        <div className="sm-duo rv">
          <div className="sm-duo-text">
            <p>
              The concept comes from a specific childhood memory: Cyworld's minirooms. In 2000s Korea,
              your homepage was a tiny isometric bedroom you decorated, and at the peak, roughly 90% of
              Korean twenty-somethings kept one. A room was a self.
            </p>
            <p>
              Cross that memory with the library-at-2am feeling and you get the pitch, which never changed
              afterward: <b>a little café you own, where real people come to study, and the only thing
              anyone can do to each other is be there.</b>
            </p>
          </div>
          <figure className="sm-cylogo">
            <img src={refCyworld} alt="Cyworld logo" loading="lazy" />
            <figcaption>Cyworld, 1999. The miniroom is Studdy's grandparent: identity as a small decorated room.</figcaption>
          </figure>
        </div>

        <div className="sm-pillars rv">
          <div className="sm-pillar">
            <span>Pillar 1</span>
            <h3>Companionship without performance</h3>
            <p>Being visible is the entire contribution. No follower count, no camera, nothing to keep up.</p>
          </div>
          <div className="sm-pillar">
            <span>Pillar 2</span>
            <h3>A place, not an app</h3>
            <p>You walk in a door. You take a seat. Someone's radio is playing. Interface only where a world won't do.</p>
          </div>
          <div className="sm-pillar">
            <span>Pillar 3</span>
            <h3>Low stakes, on purpose</h3>
            <p>Soft voxels, one warm palette, a cat. A tool that looks like a toy is allowed to be kind.</p>
          </div>
        </div>

        <blockquote className="sm-pull rv">
          Company that sees you back,<br />but never asks you to perform.
        </blockquote>
      </section>

      {/* ---------------- part three: day one ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>04</span> Day one</div>
        <h2 className="rv">The first prototype</h2>
        <figure className="sm-figure rv">
          <img src={v0Img} alt="The first committed build of Studdy" />
          <figcaption>
            The first commit, checked out and running today. Gray walls, an empty floor, flat shading.
            The title bar reads "style test."
          </figcaption>
        </figure>
        <div className="sm-twolists rv">
          <div>
            <h3>What day one had to prove</h3>
            <ul>
              <li>A fixed isometric camera can feel alive, not static.</li>
              <li>A browser can draw a furnished voxel room at 60fps on a 2019 laptop.</li>
              <li>The communal clock ticks in the corner before there is anyone to share it with.</li>
              <li>An empty room can still feel like somewhere you'd want to sit.</li>
            </ul>
          </div>
          <div>
            <h3>What day one got wrong</h3>
            <ul>
              <li>Walls the color of a rental deposit.</li>
              <li>Lighting with no opinion.</li>
              <li>Whatever font the browser found first.</li>
              <li>It didn't feel cheap. It felt <em>unowned</em>, which was the same failure.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- interlude: the character ---------------- */}
      <section className="sm-part sm-charpart sm-band sm-band-sky">
        <div className="sm-partmark rv"><span>—</span> Interlude</div>
        <h2 className="rv">Designing the avatar</h2>
        <div className="sm-chargrid rv">
          <figure><img src={charBeret} alt="The Studdy character wearing a beret" /></figure>
          <figure className="sm-char-mid"><img src={charPlain} alt="The Studdy character with glasses" /></figure>
          <figure><img src={charCatears} alt="The Studdy character from behind, wearing cat ears" /></figure>
        </div>
        <div className="sm-cols rv">
          <p>
            The chibi is two units tall and mostly head, on purpose. At diorama distance a head is the only
            thing big enough to carry identity. The eyes are calm vertical lines that blink and read. Never
            wide, never staring, because everyone in this world is minding their own business.
          </p>
          <p>
            There is no walk cycle and no emote wheel. The character's entire expressive range is what you
            wear, what your napkin says, whether your headphones are on, and the fact that you came. That
            restraint became the monetization surface much later: hats are drawn into the head's voxel grid
            so they turn and bob with it, and both hats and tag charms travel with you to every café.
          </p>
        </div>
      </section>

      {/* ---------------- part four: art direction ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>05</span> Art direction</div>
        <h2 className="rv">Choosing the art direction</h2>
        <div className="sm-cols rv">
          <p>
            Months in, the flat-shaded look earned a diagnosis from its first users: muddy, plasticky,
            "it looks AI-generated." The fix could have wrecked the live game, so it didn't happen in the
            game. It happened in a lab: one identical scene, rendered four ways, screenshots sent for
            verdicts like swatches at a tailor.
          </p>
          <p>
            The winning rule is borrowed from pixel artists, who have fought low resolution for forty
            years: never simply darken a shadow. <b>Shift its hue.</b> Studdy's shadows bend toward violet
            and its highlights toward warm yellow, in a four-band toon ramp whose bands land exactly on
            flat voxel faces. The palette stopped being muddy the day the shadows stopped being gray.
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={texlabImg} alt="The texture lab: four treatments side by side" />
          <figcaption>texture-lab.html: the same scene in four candidate skins.</figcaption>
        </figure>
        <div className="sm-verdicts rv">
          <div className="sm-verdict"><b>A · baseline</b><p>Flat Lambert. The "plasticky" control.</p><span className="sv-no">rejected</span></div>
          <div className="sm-verdict"><b>B · grain</b><p>Procedural wood and paper texture.</p><span className="sv-no">"muddies the color"</span></div>
          <div className="sm-verdict"><b>C · toon ramp</b><p>Hard three-step shading. Bands, but gray ones.</p><span className="sv-no">close</span></div>
          <div className="sm-verdict"><b>D · hue-shift</b><p>Violet shadows, warm highlights, gentle pixels.</p><span className="sv-yes">shipped</span></div>
        </div>
        <figure className="sm-figure rv">
          <img src={roomlabImg} alt="The room lab: treatment D on a full café" />
          <figcaption>
            room-lab.html: treatment D promoted to a full furnished café before touching the game. The
            pixel-size slider let the user pick the level instead of describing it.
          </figcaption>
        </figure>
        <div className="sm-duo rv">
          <figure>
            <img src={badRetroImg} alt="The killed retro mode, heavily pixelated" />
            <figcaption>The "retro" toggle as shipped. Reconstructed; it no longer exists to screenshot.</figcaption>
          </figure>
          <div className="sm-duo-text">
            <h3>The toggle I shouldn't have shipped</h3>
            <p>
              I couldn't choose between crisp and pixelated, so I shipped both as a setting. Weeks later
              the verdict arrived: <em>"the retro effect is definitely wrong — overly pixelated and buggy.
              Honestly just get rid of it."</em>
            </p>
            <p>
              Deleted within the hour. What replaced it is one crisp look with adaptive quality underneath:
              the renderer supersamples on strong hardware and quietly steps down on weak machines. Nobody
              chooses anything.
            </p>
            <p>
              The lesson stuck. A settings toggle is often a designer's indecision, exported. When both
              options look good in the lab, pick one.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- part five: light ---------------- */}
      <section className="sm-part sm-band sm-band-butter">
        <div className="sm-partmark rv"><span>06</span> Light</div>
        <h2 className="rv">Tuning the lighting</h2>
        <div className="sm-duo rv">
          <div className="sm-duo-text">
            <p>
              No subsystem ate more feedback than lighting, and every complaint arrived in feel-words,
              never spec-words. The sequence, in order:
            </p>
            <ol className="sm-rounds">
              <li>
                <b>"The corners are darker than the middle. It should be even."</b>
                The single room light became a pendant grid that scales with the room.
              </li>
              <li>
                <b>"Now it's way too strong. And dusk looks like day."</b>
                The grid's falloff had been tuned against the old single lamp. Every time-of-day mode got
                its own curve, and daytime got a lower ceiling on the slider than dusk and night.
              </li>
              <li>
                <b>Pure taste.</b>
                Lamp glow that pools instead of clipping through walls. Shades that never tint the light
                their own color. A warm/cool bulb choice per café, which users immediately treated as
                identity rather than settings.
              </li>
            </ol>
          </div>
          <figure>
            <img src={badLightImg} alt="Reconstruction of the over-bright even lighting" />
            <figcaption>Reconstructed: the room after round one. Technically even, emotionally blank. Even ≠ good.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- part six: trust ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>07</span> Trust</div>
        <h2 className="rv">Designing trust: honor vs. proof</h2>
        <p className="sm-lede rv">
          Focused minutes are the only currency, so the oldest multiplayer question arrived first:
          what stops me from lying? The answer is a boundary, not a police force.
        </p>

        <div className="sm-split rv">
          <div className="sm-split-col">
            <div className="sm-split-tag">On honor</div>
            <h3>Anything private</h3>
            <ul>
              <li>Your beans (a diary, not a rank)</li>
              <li>Your napkin, your goals</li>
              <li>Your streak</li>
            </ul>
            <p>If you want to lie to a pixel cat, that's between you and the cat.</p>
          </div>
          <div className="sm-split-col is-witnessed">
            <div className="sm-split-tag">Witnessed</div>
            <h3>Anything others see</h3>
            <ul>
              <li>Leaderboard XP</li>
              <li>Café star ratings</li>
              <li>The club study bonus</li>
            </ul>
            <p>Granted only by the server, from live session heartbeats that cannot outrun a wall clock.</p>
          </div>
        </div>

        <div className="sm-cols rv">
          <p>
            The boundary got its stress test in week one, when a field tester closed her laptop mid-session
            and woke up rich. The product question inside the bug was better than the bug: should idle time
            be an honor call, should the clock pause, or should the game kick you out of your seat?
          </p>
          <p>
            The shipped answer is all three, in their kindest forms. The clock only counts while the app is
            truly awake. A long absence stands you up gently, with the words <em>"you drifted off — we
            tucked your chair in ♪"</em>, and you keep every minute you actually did. Anti-cheat in the
            product's own voice, because users can't tell a rule from an accusation when the copy is cold.
          </p>
        </div>

        <figure className="sm-figure rv">
          <img src={loopImg} alt="Seated in the café, session HUD open" />
          <figcaption>
            The loop as shipped. Seated, on the communal clock, earning 2.2 beans a verified minute. The
            napkin is a status; headphones mean do-not-disturb.
          </figcaption>
        </figure>

        <details className="sm-details rv">
          <summary>Engineering notes: how the server draws the line</summary>
          <ul>
            <li>Postgres row-level security on every table; café docs, notes, and friendships all scoped by policy.</li>
            <li>The ranked columns (XP, café stars) are writable by <b>no client at all</b>. Security-definer functions grant them from session heartbeats.</li>
            <li>Heartbeats credit real elapsed time, capped at 90 seconds per beat, 6 hours per sitting, 16 hours per day.</li>
            <li>The clubs feature wanted a +10% bonus while a clubmate studies. That bonus is computed server-side from live sessions too.</li>
            <li>Rate limits in policies, not app code: one study-log row per 8 minutes, 3 gifts a day, 5 reports a day.</li>
          </ul>
        </details>

        <details className="sm-details rv">
          <summary>Retention, tested against one question</summary>
          <p>Does this still respect the user on their worst day?</p>
          <ul>
            <li><b>Streaks pause.</b> Miss a day and the count keeps, quietly. Only a second missed day resets it. Nothing turns red, ever.</li>
            <li><b>Goals are honor-system</b> but claimable only the next day, which kills impulse-claiming without policing anyone.</li>
            <li><b>One interruption exists</b>: the "a friend is studying" banner. One tap to join, one tap to snooze for half an hour.</li>
            <li><b>The weekly recap is a postcard</b>, not a report card.</li>
          </ul>
        </details>
      </section>

      {/* ---------------- the workflow ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>08</span> The loop</div>
        <h2 className="rv">How every change shipped</h2>
        <div className="sm-steps rv">
          <div className="sm-step"><span>1</span><b>Lab first</b><p>Risky visuals prototyped on a separate page, never in the live game.</p></div>
          <div className="sm-step"><span>2</span><b>Ship small</b><p>Same-day deploys to production. Two real users on the other end.</p></div>
          <div className="sm-step"><span>3</span><b>Field test</b><p>They studied in it daily and reported in feel-words, not spec-words.</p></div>
          <div className="sm-step"><span>4</span><b>Fix same day</b><p>Every break they found shipped a fix before the next session.</p></div>
        </div>
        <p className="sm-lede rv">
          Below: the actual ledger. Their words, lightly compressed. What shipped. What it taught.
        </p>
        <div className="sm-ledger">
          {COMPLAINTS.map((c, i) => (
            <div className="sm-card rv" key={i}>
              <div className="sm-card-q">“{c.quote}”</div>
              <div className="sm-card-fix"><b>Shipped:</b> {c.fix}</div>
              <div className="sm-card-lesson">{c.lesson}</div>
            </div>
          ))}
        </div>
        <div className="sm-duo rv">
          <figure>
            <img src={bugGhostImg} alt="Two identical characters standing in a café" />
            <figcaption>Reconstructed: the presence ghost. A reload gave the same person a second body until the server noticed.</figcaption>
          </figure>
          <figure>
            <img src={bugCatImg} alt="The café cat stretched into a tall gray tower" />
            <figcaption>Re-committed for the camera: the café cat, the day its breathing animation overwrote the voxel scale.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- part eight: the audit ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>09</span> The audit</div>
        <h2 className="rv">Grading the interface</h2>
        <p className="sm-lede rv">
          Two questions grade every feature: does it <b>support focus</b>, and does it <b>add company</b>?
          Plotting the shipped interface against both is the most honest self-review I know.
        </p>
        <figure className="sm-figure rv">
          <DecisionMap />
          <figcaption>Filled dots held their ground in field testing. Open circles are risks with leashes on.</figcaption>
        </figure>
        <div className="sm-riskcards rv">
          <div className="sm-riskcard">
            <h3>Why the leaderboard stays</h3>
            <p>
              It adds pressure by existing. It survives because it's the one place verified time gets to
              matter, it ranks a number and never a person, and it lives two taps deep. It would be the
              first cut if the worst-day test ever failed.
            </p>
          </div>
          <div className="sm-riskcard">
            <h3>Why the banner stays</h3>
            <p>
              "A friend is studying right now" is the only feature that interrupts. That's exactly why it's
              dismissable, snoozable for half an hour, and capped at one. Presence should invite, never
              summon.
            </p>
          </div>
        </div>
        <h3 className="sm-subhead rv">Prioritizing the roadmap</h3>
        <p className="sm-lede rv">
          The same features, sorted the way they were actually planned: by user value against build effort.
          The bottom-right quadrant matters most. It's the list of things this product said no to.
        </p>
        <PriorityMatrix />
      </section>

      {/* ---------------- part nine: economy ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>10</span> The economy</div>
        <h2 className="rv">Designing the economy</h2>
        <p className="sm-lede rv">
          One focused minute earns one bean, scaled gently by level. Every price in the game answers to
          that anchor, in a one-page economy document with real bands:
        </p>
        <div className="sm-table rv">
          <div className="sm-tr sm-th"><span>Band</span><span>Price</span><span>≈ study time</span><span>Examples</span></div>
          <div className="sm-tr"><span>Impulse</span><span>8–45</span><span>minutes</span><span>everyday furniture, plants, mugs</span></div>
          <div className="sm-tr"><span>Session</span><span>45–150</span><span>about an hour</span><span>café themes, statement pieces</span></div>
          <div className="sm-tr"><span>Commitment</span><span>150–400</span><span>a day or two</span><span>hats, tag charms, big rugs</span></div>
          <div className="sm-tr"><span>Atelier</span><span>250–800</span><span>up to a week</span><span>the café cat, the fireplace, the aquarium</span></div>
        </div>
        <div className="sm-decision rv">
          <div className="sm-decision-tag">Decision record · reversed</div>
          <p>
            Mid-build, I priced structural room edits (width, depth, windows) with escalating costs.
            Standard gacha logic. Living with it for a day exposed the problem: the game hands you a free
            room, then charges you to keep shaping it. That's a bait-and-switch wearing an economy costume.
            Unshipped, and the principle went in writing so it stays unshipped:
            <b> structure is identity, and identity is never priced.</b>
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={shopImg} alt="The atelier tab of the shop" />
          <figcaption>
            The atelier: a café cat that breathes (600), a fireplace that lights the room (500), an
            aquarium with three fish on laps (450). A week of study, made visible.
          </figcaption>
        </figure>
        <div className="sm-cols rv">
          <p>
            The economy's real exam arrived when the first player finished it. Level 21, 1,800 beans
            banked, all goals cleared, and, in her words, nothing left to want. Bigger numbers would have
            been the lazy patch. What shipped instead was worth wanting: the atelier's animated showpieces,
            and a wardrobe that follows you to every café. Identity that travels is worth more than décor
            that stays home, and it's priced that way.
          </p>
          <p>
            Sinks only ever buy <b>expression</b>. Nothing purchasable earns faster or ranks higher,
            anywhere in the game. The next sinks are already designed against the same rules: window views,
            pet accessories, a room-wing extension as the one large structural purchase. It adds space,
            never power. An economy that respects its players is mostly a list of things it refuses to
            sell.
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={salonImg} alt="The salon mirror with the wardrobe" />
          <figcaption>
            The mirror. Skin, hair, length, glasses: free forever, ten options each. Hats and charms carry
            price tags until you own them.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- coda ---------------- */}
      <section className="sm-part sm-coda">
        <div className="sm-partmark rv"><span>11</span> Where this goes</div>
        <h2 className="rv">Takeaways</h2>
        <div className="sm-takeaways rv">
          <div className="sm-take"><b>Places beat apps</b><p>The avatar generation is aging into work. They'll bring their platform expectations with them.</p></div>
          <div className="sm-take"><b>Presence beats features</b><p>The product's best retention mechanic is another person's chair being occupied.</p></div>
          <div className="sm-take"><b>Kindness scales</b><p>Streaks that pause, anti-cheat that tucks your chair in. Nothing here shames anyone, and nothing broke because of it.</p></div>
          <div className="sm-take"><b>Two users are enough</b><p>Every important fix on this page came from someone real colliding with something shipped.</p></div>
        </div>
        <div className="sm-shipchips rv">
          <span>live &amp; installable</span>
          <span>server-verified economy</span>
          <span>realtime presence</span>
          <span>lofi radio per café</span>
          <span>study clubs</span>
          <span>wardrobe &amp; atelier</span>
          <span>report &amp; block</span>
          <span>2 field testers</span>
        </div>
      </section>

      <div className="sm-finale sm-band sm-band-dark rv">
        <blockquote className="sm-pull sm-pull-light">
          Time you actually spent,<br />made visible in a place you actually like.
        </blockquote>
        <a className="sm-finale-cta" href="https://pjeon18.github.io/studdy/" target="_blank" rel="noreferrer">
          The café is open → pjeon18.github.io/studdy
        </a>
      </div>

      <figure className="sm-bleed sm-finale-img rv">
        <img src={heroImg} alt="A full Studdy café" loading="lazy" />
      </figure>

      <details className="sm-details sm-sourcefold rv">
        <summary>Sources &amp; further reading</summary>
        <p className="sm-sources-p">
          Lofi Girl scale: <a href="https://en.wikipedia.org/wiki/Lofi_Girl" target="_blank" rel="noreferrer">Wikipedia</a> ·
          gongbang origins: <a href="https://observatory.tec.mx/edu-news/gongbang-study-with-me/" target="_blank" rel="noreferrer">Tec de Monterrey Observatory</a>, <a href="https://www.scmp.com/week-asia/lifestyle-culture/article/3121568/study-buddies-south-korean-youtubers-take-cram-sessions" target="_blank" rel="noreferrer">SCMP</a> ·
          Study Together: <a href="https://discord.com/servers/study-together-595999872222756885" target="_blank" rel="noreferrer">Discord</a> ·
          body doubling: <a href="https://health.clevelandclinic.org/body-doubling-for-adhd" target="_blank" rel="noreferrer">Cleveland Clinic</a>, <a href="https://arxiv.org/pdf/2509.12153" target="_blank" rel="noreferrer">arXiv (VR body doubling)</a> ·
          Forest: <a href="https://forestapp.cc/" target="_blank" rel="noreferrer">forestapp.cc</a> ·
          Focusmate: <a href="https://www.focusmate.com/business/" target="_blank" rel="noreferrer">focusmate.com</a> ·
          Gen Z loneliness &amp; third places: <a href="https://www.simplypsychology.com/articles/third-places-loneliness" target="_blank" rel="noreferrer">Simply Psychology</a>, <a href="https://www.huffpost.com/entry/third-spaces-and-gen-z_l_675ca0fee4b0a6324e3b58ad" target="_blank" rel="noreferrer">HuffPost</a> ·
          Cyworld: <a href="https://en.wikipedia.org/wiki/Cyworld" target="_blank" rel="noreferrer">Wikipedia</a> ·
          platform aging-up: <a href="https://www.thebloxline.com/articles/roblox-now-has-123-million-daily-users-but-the-bigger-story-is-who-those-users-are-becoming" target="_blank" rel="noreferrer">The Bloxline</a>, <a href="https://backlinko.com/roblox-users" target="_blank" rel="noreferrer">Backlinko</a>.
          Product screenshots appear for identification and commentary; all marks belong to their owners.
        </p>
      </details>

      <div className="case-next sm-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/prep-io" className="case-next-link">
          Prep.io. Office hours, made live. <span className="arr">→</span>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
