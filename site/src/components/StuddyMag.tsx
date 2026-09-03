// The Studdy case study, magazine edition — a bespoke long-read with its own
// layout system (see studdy-mag.css). Content lives inline: this page IS the
// deliverable, and its structure changes with its story.
import { useEffect, useRef } from 'react'
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
// Chart 1: the market, mapped. X = presence (one-way → mutual),
// Y = pressure (ambient → demanding).

function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; hero?: boolean; dx?: number; dy?: number }[] = [
    { x: 14, y: 18, label: 'Lofi Girl', sub: '15.8M subscribers' },
    { x: 26, y: 34, label: 'Study-with-me video', sub: 'gongbang, since ~2018' },
    { x: 40, y: 78, label: 'Forest', sub: '60M users · solo, gamified', dy: 14 },
    { x: 58, y: 52, label: 'Study Together', sub: '1M-member Discord', dx: 6 },
    { x: 88, y: 86, label: 'Focusmate', sub: '9M sessions · camera on', dx: -128, dy: 14 },
    { x: 82, y: 24, label: 'Studdy', sub: 'mutual, ambient', hero: true },
  ]
  return (
    <svg className="sm-chart" viewBox="0 0 640 460" role="img" aria-label="Market map: presence versus pressure">
      <defs>
        <marker id="smArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#B9B4A8" />
        </marker>
      </defs>
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      {/* the open quadrant */}
      <rect x="340" y="20" width="270" height="190" fill="#FFF3EC" opacity="0.55" />
      <text x="595" y="42" textAnchor="end" fontSize="11.5" fill="#C86A3F" fontStyle="italic">the open corner: mutual + calm</text>
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      {/* axes */}
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" markerEnd="url(#smArr)" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" markerEnd="url(#smArr)" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">one-way presence</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">mutual presence</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">demanding</text>
      <text x="58" y="120" fontSize="12" fill="#38352F" transform="rotate(-90 58 120)" fontWeight="700">ambient</text>
      {dots.map((d) => {
        const cx = 70 + (d.x / 100) * 540
        const cy = 20 + (d.y / 100) * 380
        return (
          <g key={d.label}>
            <circle cx={cx} cy={cy} r={d.hero ? 9 : 6} fill={d.hero ? '#E05C1F' : '#38352F'} opacity={d.hero ? 1 : 0.75} />
            {d.hero && <circle cx={cx} cy={cy} r="15" fill="none" stroke="#E05C1F" strokeDasharray="3 3" />}
            <text x={cx + (d.dx ?? 12)} y={cy + (d.dy ?? -8)} fontSize="13.5" fontWeight="800" fill="#121110">{d.label}</text>
            <text x={cx + (d.dx ?? 12)} y={cy + (d.dy ?? -8) + 14} fontSize="11" fill="#8F8B83">{d.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Chart 2: Studdy's own UI, graded. X = protects focus, Y = makes you feel
// accompanied. Filled = strength; outlined = a watched risk.

function DecisionMap() {
  const dots: { x: number; y: number; label: string; risk?: boolean; end?: boolean; dy?: number }[] = [
    { x: 88, y: 88, label: 'communal 25/5 clock', end: true },
    { x: 82, y: 62, label: 'chat only at breaks', end: true },
    { x: 62, y: 78, label: 'napkin status', dy: 20 },
    { x: 74, y: 40, label: 'headphones = do-not-disturb', end: true },
    { x: 55, y: 90, label: 'name tags over heads', end: true },
    { x: 42, y: 70, label: 'guestbook doodles', end: true },
    { x: 30, y: 82, label: '"friend is studying" banner', risk: true },
    { x: 26, y: 34, label: 'xp leaderboard', risk: true },
    { x: 66, y: 22, label: 'streaks (pausing)', dy: 20 },
    { x: 48, y: 50, label: 'lofi radio per café', dy: 20 },
    { x: 38, y: 16, label: 'furnish & wardrobe', end: true },
  ]
  return (
    <svg className="sm-chart" viewBox="0 0 640 460" role="img" aria-label="Studdy UI decisions: focus versus company">
      <rect x="70" y="20" width="540" height="380" fill="#FBFAF6" stroke="#EDEBE5" />
      <line x1="70" y1="210" x2="610" y2="210" stroke="#EDEBE5" />
      <line x1="340" y1="20" x2="340" y2="400" stroke="#EDEBE5" />
      <line x1="70" y1="400" x2="610" y2="400" stroke="#B9B4A8" />
      <line x1="70" y1="400" x2="70" y2="20" stroke="#B9B4A8" />
      <text x="76" y="422" fontSize="12" fill="#8F8B83">tempts you away</text>
      <text x="604" y="422" fontSize="12" fill="#38352F" textAnchor="end" fontWeight="700">protects the sprint</text>
      <text x="58" y="396" fontSize="12" fill="#8F8B83" transform="rotate(-90 58 396)">works alone</text>
      <text x="58" y="140" fontSize="12" fill="#38352F" transform="rotate(-90 58 140)" fontWeight="700">feels accompanied</text>
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
              x={d.end ? cx - 13 : cx + 13}
              y={cy + (d.dy ?? 4)}
              textAnchor={d.end ? 'end' : 'start'}
              fontSize="12.5"
              fontWeight="700"
              fill={d.risk ? '#C86A3F' : '#121110'}
            >{d.label}</text>
          </g>
        )
      })}
      <g>
        <circle cx="440" cy="443" r="5.5" fill="#38352F" />
        <text x="452" y="447" fontSize="11.5" fill="#55524B">held its ground</text>
        <circle cx="548" cy="443" r="5.5" fill="#FBFAF6" stroke="#E05C1F" strokeWidth="2.2" />
        <text x="560" y="447" fontSize="11.5" fill="#55524B">watched risk</text>
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------

interface Complaint {
  quote: string
  fix: string
  lesson: string
}

const COMPLAINTS: Complaint[] = [
  {
    quote: 'When you sit, you sink into the chair.',
    fix: 'Seat math rebuilt: the sit pose measures from the cushion top, and every seat height was re-tuned against the character.',
    lesson: 'Nobody files a ticket about "seat anchoring." They say it looks wrong. Translate feel into geometry.',
  },
  {
    quote: 'It should have usernames over heads, like Minecraft.',
    fix: 'Floating name tags with level badges, custom colors sold in the salon — which quietly became an identity feature.',
    lesson: 'Users cite other products as shorthand for a need. The need here was "I want to be seen," not "copy Minecraft."',
  },
  {
    quote: 'The room light gets darker toward the corners. It should be even.',
    fix: 'A pendant grid that scales with room size, normalized so five lamps aren’t five times brighter than one.',
    lesson: 'The first fix washed out the whole palette — evenness and brightness are different asks. It took three rounds.',
  },
  {
    quote: 'Now it’s way too bright. And dusk looks the same as day.',
    fix: 'Per-mode intensity curves and a lower ceiling on daytime brightness; warm/cool bulbs became a café setting.',
    lesson: 'Every knob you give users needs its own limits per context. One global max was lazy math.',
  },
  {
    quote: 'There are two of me on my screen.',
    fix: 'One body per person: presence deduplicates by identity, not connection, and a reload says goodbye before it leaves.',
    lesson: 'Distributed-systems jank reads as horror-movie jank. Ghosts are a bug class users FEEL.',
  },
  {
    quote: 'She redecorated but I still see her old room.',
    fix: 'A security migration had silently broken publishing (column grants versus upsert). Rooms also now refresh live, every 20 seconds, while you stand in them.',
    lesson: 'My proudest hardening work shipped my quietest data-loss bug. Every migration needs a round-trip test from the CLIENT’s side.',
  },
  {
    quote: 'She closed her laptop overnight and woke up rich.',
    fix: 'The focus clock only counts while the app is awake; a long absence tucks your chair in and pays what you earned.',
    lesson: 'The exploit was also a design question: honor, pause, or kick? We chose the kind version of all three.',
  },
  {
    quote: 'Our laptops get hot and the battery drains fast.',
    fix: 'Low-power GPU preference and an idle governor: 30fps when your hands are off, full rate the instant you touch anything.',
    lesson: 'An idle game that renders like a shooter is a design contradiction. Performance is product, not plumbing.',
  },
  {
    quote: 'The retro mode looks overly pixelated and buggy. Honestly just get rid of it.',
    fix: 'Deleted, same day. One look — crisp — with adaptive quality that steps down on weak hardware instead.',
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
        <div className="sm-kicker rv">Case study · shipped &amp; live · 2026</div>
        <h1 className="rv">
          A study spot<br />that <em>never closes.</em>
        </h1>
        <p className="sm-dek rv">
          Studdy is a multiplayer study café — real people in tiny pixel bodies, one 25/5 clock shared by
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

      {/* ---------------- part one: research ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>01</span> The research</div>
        <h2 className="rv">Everyone already studies with strangers.</h2>
        <div className="sm-cols rv">
          <p>
            Start in South Korea, around the college entrance exams. Students there began broadcasting
            themselves studying — hours of silence, a desk lamp, turning pages. The genre got a name,
            <b> gongbang</b> (study broadcast), and a purpose: the pressure of being watched, and the
            company of watching. It crossed the Pacific as "study with me," and it grew into an economy
            of presence: Lofi Girl streaming beats-to-study-to to a channel of <b>15.8 million</b>, with
            around a hundred thousand people listening at any moment. The largest study community on
            Discord, started by students in Berlin in 2020, passed <b>a million members</b> — twenty
            thousand of them sitting muted in voice channels on any given night.
          </p>
          <p>
            The psychology under all of it has a name too. <b>Body doubling</b> — working beside another
            person who demands nothing of you — is one of the most recommended focus strategies in the
            ADHD community, and the small literature around it points at real mechanisms: social presence
            recruits the same dopamine circuitry that ADHD runs short on, and a calm body nearby regulates
            arousal. A market grew here as well: Forest has gamified <b>60 million</b> phones into staying
            locked; Focusmate has sold <b>9 million</b> scheduled coworking sessions with a stranger on
            camera. And the backdrop explains the demand: the loneliest generation on record — roughly
            <b> four in five</b> Gen Z adults report loneliness — coming of age just as the physical third
            place, Oldenburg's café-pub-library layer of life, priced itself out of their cities.
          </p>
        </div>
        <div className="sm-stats rv">
          <div><span className="v">15.8M</span><span className="l">Lofi Girl subscribers — ~100k listening at any hour</span></div>
          <div><span className="v">1M+</span><span className="l">members in Discord's largest study server</span></div>
          <div><span className="v">60M</span><span className="l">Forest users growing trees by not touching their phone</span></div>
          <div><span className="v">9M</span><span className="l">Focusmate sessions of camera-on coworking</span></div>
          <div><span className="v">79%</span><span className="l">of Gen Z adults report loneliness — the highest of any generation</span></div>
          <div><span className="v">44%</span><span className="l">of daily users on the biggest social-gaming platform are now over 17 — its fastest-growing cohort is 17–24, aging up with the platform</span></div>
        </div>
        <div className="sm-cols rv">
          <p>
            Two more observations shaped the brief. First: every product above is lopsided. The streams and
            videos are <em>one-way glass</em> — the streamer will never know you existed. The Discord servers
            are mutual but formless — a black window with names in it. Focusmate is mutual and effective and
            feels like a meeting. Forest works and is utterly alone. Nobody was building <b>mutual presence
            at ambient pressure</b> — company that sees you back but never asks you to perform.
          </p>
          <p>
            Second: the generation that grew up inside social 3D worlds is aging into exams, theses, and
            remote work — nearly half the daily population of the biggest such platform is now past 17, and
            its fastest growth is people who never left. They don't experience an avatar in a room as a
            game. They experience it as <em>a place</em>. The study tools above haven't caught up to that
            expectation; a study space built like a world, rather than an app, meets those users where they
            already live.
          </p>
        </div>
        <figure className="sm-figure rv">
          <MarketMap />
          <figcaption>
            The map that started the project. Everything crowds the one-way or high-pressure edges;
            the calm, mutual corner was empty.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- part two: the bet ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>02</span> The bet</div>
        <h2 className="rv">Presence is the product.</h2>
        <div className="sm-cols rv">
          <p>
            The concept came from a specific childhood memory: Cyworld minirooms — the Korean web's tiny
            decorated bedrooms, where a room WAS a self. Cross that with the library-at-2am feeling and you
            get the pitch that never changed afterward: <b>a little café you own, where real people come to
            study, and the only thing anyone can do to each other is be there.</b>
          </p>
          <p>
            Three pillars were fixed before any code. <b>Companionship without performance</b> — being
            visible is the entire contribution; there is no follower count, no camera, nothing to keep up.
            <b> A place, not an app</b> — you walk in a door, you take a seat, someone's radio is playing;
            interface where a world will do. And <b>the aesthetic of low stakes</b> — soft voxels, one warm
            palette, a cat — because a tool that looks like a spreadsheet asks to be measured by one, and a
            tool that looks like a toy is allowed to be kind.
          </p>
        </div>
        <blockquote className="sm-pull rv">
          Company that sees you back —<br />but never asks you to perform.
        </blockquote>
      </section>

      {/* ---------------- part three: day one ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>03</span> Day one</div>
        <h2 className="rv">It looked like this.</h2>
        <figure className="sm-figure rv">
          <img src={v0Img} alt="The first committed build of Studdy" />
          <figcaption>
            The first commit, running today: gray walls, an empty floor, flat shading, a five-minute
            sprint clock. Title bar reads "style test."
          </figcaption>
        </figure>
        <div className="sm-cols rv">
          <p>
            The first commit was a style test, and it already contained the three riskiest decisions:
            a fixed isometric camera (can a static diorama feel alive?), a merged-voxel renderer (can a
            browser draw a furnished room at 60fps on a laptop from 2019?), and the communal clock ticking
            in the corner before there was anyone to share it with. Everything else — accounts, friends,
            clubs, the economy — was deliberately absent. If the empty room didn't feel like somewhere you
            wanted to sit, no feature list was going to rescue it.
          </p>
          <p>
            What the prototype got wrong is equally visible: walls the color of a rental deposit, lighting
            with no opinion, an interface in whatever font the browser found first. It didn't feel cheap —
            it felt <em>unowned</em>, which for this product was the same failure. The next two phases were
            mostly about earning the right to the word "cozy": a real pixel typeface with hand-redrawn
            digits, a single confident palette, and eventually a full art-direction overhaul that started
            in a laboratory, not in the game.
          </p>
        </div>
      </section>

      {/* ---------------- interlude: the character ---------------- */}
      <section className="sm-part sm-charpart">
        <div className="sm-partmark rv"><span>—</span> Interlude</div>
        <h2 className="rv">The body you study in.</h2>
        <div className="sm-chargrid rv">
          <figure><img src={charBeret} alt="The Studdy character wearing a beret" /></figure>
          <figure className="sm-char-mid"><img src={charPlain} alt="The Studdy character with glasses" /></figure>
          <figure><img src={charCatears} alt="The Studdy character from behind, wearing cat ears" /></figure>
        </div>
        <div className="sm-cols rv">
          <p>
            The chibi is two units tall and mostly head, on purpose: at diorama distance, a head is the
            only thing big enough to carry identity. The eyes are calm vertical lines that blink and read —
            never wide, never staring — because everyone in this world is minding their own business. There
            is no walk cycle and no emote wheel. The character's entire expressive range is: what you wear,
            what your napkin says, whether your headphones are on, and the fact that you came.
          </p>
          <p>
            That restraint became the monetization surface much later. Hats are drawn directly into the
            head's voxel grid so they turn and bob with it; a tag charm rides your floating name. Both
            travel with you to every café — which is exactly why they're the most expensive things in the
            game. Identity that others see is worth saving for. Identity itself — skin, hair, a room's
            walls — is free forever, and the economy document says so in writing.
          </p>
        </div>
      </section>

      {/* ---------------- part four: art direction ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>04</span> Art direction</div>
        <h2 className="rv">Four treatments, one lab, no mercy.</h2>
        <div className="sm-cols rv">
          <p>
            Months in, the flat-shaded look had a diagnosis from its first users: "muddy, plasticky —
            it looks AI-generated." The fix could have destroyed the game — retexturing every surface live —
            so it didn't happen in the game. It happened in a lab: a separate page rendering one identical
            scene four ways. <b>A</b>, the baseline. <b>B</b>, procedural grain — real wood, real paper.
            <b> C</b>, a hard three-step toon ramp. <b>D</b>, the ramp plus gentle pixelation.
          </p>
          <p>
            Grain lost — verdict from the user, verbatim: <em>"it muddies the color."</em> What won was a
            rule borrowed from pixel artists who've fought low resolution for forty years: never darken a
            shadow, <b>shift its hue</b>. Studdy's shadows bend toward violet, its highlights toward warm
            yellow, in a four-band toon ramp whose bands land exactly on flat voxel faces. The palette
            stopped being muddy the day the shadows stopped being gray.
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={texlabImg} alt="The texture lab: four treatments side by side" />
          <figcaption>texture-lab.html — the same scene, four candidate skins. Screenshots went to the user; only D survived.</figcaption>
        </figure>
        <figure className="sm-figure rv">
          <img src={roomlabImg} alt="The room lab: treatment D on a full café, crisp versus pixelated" />
          <figcaption>
            room-lab.html — treatment D promoted to a full furnished café before touching the game,
            with an adjustable pixel-size slider so the user could pick the level, not describe it.
          </figcaption>
        </figure>
        <div className="sm-duo rv">
          <figure>
            <img src={badRetroImg} alt="The killed retro mode, heavily pixelated" />
            <figcaption>The "retro" pixelation toggle, as shipped. Reconstructed here — it no longer exists to screenshot.</figcaption>
          </figure>
          <div className="sm-duo-text">
            <h3>The toggle I shouldn't have shipped</h3>
            <p>
              The user couldn't choose between crisp and pixelated, so I shipped both as a setting. Weeks
              later, the verdict arrived: <em>"the retro effect is definitely wrong — overly pixelated and
              buggy. Honestly just get rid of it."</em> It was deleted within the hour, replaced by one
              crisp look with adaptive quality underneath — the renderer supersamples on strong hardware and
              quietly steps down on weak machines, and nobody chooses anything.
            </p>
            <p>
              The lesson stuck: a settings toggle is often a designer's indecision, exported. When both
              options looked good in the lab, the right call was picking one — not making two users on two
              laptops discover which one was a lie.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- part five: light ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>05</span> Light</div>
        <h2 className="rv">Three rounds to make a lamp honest.</h2>
        <div className="sm-duo rv">
          <div className="sm-duo-text">
            <p>
              No subsystem ate more feedback than lighting, and every complaint arrived in feel-words, not
              spec-words. <em>"The corners are darker than the middle — it should be even."</em> So the
              single room light became a pendant grid that scales with the room. Then: <em>"now it's way too
              strong,"</em> and — worse — <em>"dusk and night are as bright as day."</em> The grid's falloff
              had been tuned against the old single lamp; every mode needed its own curve, and daytime
              eventually got a lower ceiling on the brightness slider than dusk and night, because full
              daylight plus full pendants was simply too much light to mean anything.
            </p>
            <p>
              The last rounds were pure taste: lamp glow that pools at 38 voxels instead of clipping through
              walls, shades that never tint the light their own color, and a warm/cool bulb choice per café —
              which users immediately treated as identity, not settings. The reconstruction on the right is
              what "even lighting, first attempt" actually looked like: technically even, emotionally blank.
            </p>
          </div>
          <figure>
            <img src={badLightImg} alt="Reconstruction of the over-bright even lighting" />
            <figcaption>Reconstructed: the flat, washed-out room after the first "make it even" fix. Even ≠ good.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- part six: trust ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>06</span> Trust</div>
        <h2 className="rv">The line between honor and proof.</h2>
        <div className="sm-cols rv">
          <p>
            Focused minutes are the only currency, so the first design question was the oldest one in
            multiplayer: what stops me from lying? The answer is a boundary, not a police force.
            <b> Anything private runs on honor</b> — your beans are a diary, and if you want to lie to a
            pixel cat, that's between you and the cat. <b>Anything another person can see is witnessed</b> —
            leaderboard XP and café ratings are granted only by the server, which hears a heartbeat from a
            live session about once a minute and refuses to credit time faster than a wall clock. Open the
            devtools, inflate your save, enjoy your imaginary beans: your rank won't move.
          </p>
          <p>
            The boundary was stress-tested in week one, when a field tester closed her laptop mid-session
            and woke up rich. The product question was better than the bug: should idle time be an honor
            call, should the clock pause, or should the game kick you out of your seat? The shipped answer
            is all three, in their kindest forms: the clock only counts while the app is truly awake, a long
            absence stands you up gently — <em>"you drifted off — we tucked your chair in ♪"</em> — and you
            keep every minute you actually did. The anti-cheat system speaks in the product's voice, because
            users can't tell the difference between a rule and an accusation when the copy is cold.
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={loopImg} alt="Seated in the café, session HUD open" />
          <figcaption>
            The loop as shipped: seated, on the communal clock, earning 2.2 beans a verified minute.
            The napkin is a status; headphones mean do-not-disturb; the streak on the pill pauses instead of breaking.
          </figcaption>
        </figure>
        <div className="sm-cols rv">
          <p>
            The same philosophy runs the retention layer, tested against one question: <b>does this still
            respect the user on their worst day?</b> Streaks pause when you miss a day and keep their count;
            only a second missed day resets them, and nothing turns red either way. Self-set goals are
            honor-system but claimable only the next day, which quietly kills impulse-claiming. The "a
            friend is studying right now" banner — the closest thing to a notification in the product — is
            one tap to join, one tap to snooze half an hour.
          </p>
          <p>
            Technically, the trust line is Postgres. Row-level security everywhere, and the ranked columns —
            XP, café stars — are writable by no client at all: security-definer functions grant them from
            session heartbeats, with per-beat caps, a six-hour session ceiling, and a sixteen-hour day. When
            a later feature (clubs) wanted a +10% bonus while a clubmate studies, the bonus was computed
            server-side from live sessions too. If a number can rank you, no browser writes it.
          </p>
        </div>
      </section>

      {/* ---------------- part seven: the ledger ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>07</span> The ledger</div>
        <h2 className="rv">Everything the users broke.</h2>
        <p className="sm-lede rv">
          Studdy's QA team was two people who actually studied in it, daily. This ledger is their words
          (lightly compressed), what shipped in response — always the same day — and what each one taught.
          A spec anticipates the product as imagined; these are collisions with the product as built.
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
            <figcaption>Not reconstructed so much as re-committed: the café cat, the day its breathing animation overwrote the voxel scale.</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- part eight: the decisions, graded ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>08</span> The audit</div>
        <h2 className="rv">Every UI decision, graded on two axes.</h2>
        <div className="sm-cols rv">
          <p>
            The product's whole tension lives on two axes: does a feature <b>protect the sprint</b>, and does
            it make you <b>feel accompanied</b>? Plotting the shipped interface against both is the most
            honest self-review I know how to do. The communal clock earns its keep in the top right —
            maximum company, maximum protection, because it IS the etiquette. The quiet presence layer
            (napkins, headphones, name tags) clusters high on company at modest cost.
          </p>
          <p>
            Two features are drawn as open circles because they're managed risks, not clean wins. The
            leaderboard adds pressure by existing — it stays because it's the one place verified time gets
            to matter, but it ranks a number, never a person, and it lives two taps deep. The "friend is
            studying" banner is the only feature that interrupts, which is exactly why it's dismissable,
            snoozable, and capped at one. Both would be the first cut if the worst-day test ever failed.
          </p>
        </div>
        <figure className="sm-figure rv">
          <DecisionMap />
          <figcaption>Filled dots held their ground in field testing. Open circles are risks with leashes on.</figcaption>
        </figure>
      </section>

      {/* ---------------- part nine: economy ---------------- */}
      <section className="sm-part">
        <div className="sm-partmark rv"><span>09</span> The economy</div>
        <h2 className="rv">Priced in hours, written in one page.</h2>
        <div className="sm-cols rv">
          <p>
            One focused minute earns one bean, scaled gently by level and capped — that sentence anchors
            every price in the game, and it's written down in a one-page economy document every new price
            has to answer to. Impulse décor costs minutes. Statement furniture costs a session. The
            animated endgame pieces cost up to a week of steady study. And the sinks only ever buy
            <b> expression</b>: nothing purchasable earns faster or ranks higher, anywhere.
          </p>
          <p>
            The document also records a reversal. Mid-build, I priced structural room edits — width, depth,
            windows — with escalating costs, standard gacha logic. Living with it for a day exposed the
            problem: the game gives you a free room, then charges you to keep shaping it. That's a
            bait-and-switch wearing an economy costume. It was unshipped, and the principle went in writing
            so it stays unshipped: <b>structure is identity, and identity is never priced.</b>
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
            The economy's real exam arrived when the first player finished it: level 21, 1,800 beans banked,
            all goals cleared, and — her words — nothing left to want. The lazy patch is bigger numbers; the
            actual answer was things worth wanting. The <b>atelier</b>: animated showpieces expensive enough
            to be a project. The <b>wardrobe</b>: hats and name-tag charms that follow you to every café,
            priced above furniture because identity that travels is worth more than décor that stays home.
          </p>
          <p>
            Everything ranked stayed protected while the sinks grew — that's the discipline the one-pager
            enforces. The next sinks are already designed against the same rules: window views, pet
            accessories, a room-wing extension as the one large structural purchase, adding space, never
            power. An economy that respects its players is mostly a list of things it refuses to sell.
          </p>
        </div>
        <figure className="sm-figure rv">
          <img src={salonImg} alt="The salon mirror with the wardrobe" />
          <figcaption>
            The mirror: skin, hair, length, glasses — free forever, ten options each. Hats and charms carry
            price tags until you own them.
          </figcaption>
        </figure>
      </section>

      {/* ---------------- coda ---------------- */}
      <section className="sm-part sm-coda">
        <div className="sm-partmark rv"><span>10</span> Open late</div>
        <h2 className="rv">What this project is, underneath.</h2>
        <div className="sm-cols rv">
          <p>
            On paper Studdy is a study tool. Underneath, it's a thesis about where social software goes
            next: the generation that grew up in avatar worlds is aging into work, and they will keep
            choosing <em>places</em> over apps — spaces with bodies, rooms, and ambient company, tuned for
            what adult life actually needs. Studying is the first vertical because it's where the demand
            already shows (a million muted students on Discord are the proof). The same architecture — one
            shared clock, witnessed effort, expression-only economics — points at coworking, reading rooms,
            practice spaces.
          </p>
          <p>
            The craft under it: a voxel renderer with a hue-shifted toon ramp, one state store enforcing the
            product's promises, Postgres row-level security drawing the trust line, realtime presence that
            survived its ghosts, and an economy document that has already survived one reversal and one
            maxed-out player. Every piece of it shipped to production, broke against two real users, and
            got better. The café is open — it never closes — and the next complaint is already welcome.
          </p>
        </div>
        <blockquote className="sm-pull rv">
          Time you actually spent,<br />made visible in a place you actually like.
        </blockquote>
        <div className="sm-sources rv">
          <h4>Sources &amp; further reading</h4>
          <p>
            Lofi Girl scale: <a href="https://en.wikipedia.org/wiki/Lofi_Girl" target="_blank" rel="noreferrer">Wikipedia</a> ·
            gongbang origins: <a href="https://observatory.tec.mx/edu-news/gongbang-study-with-me/" target="_blank" rel="noreferrer">Tec de Monterrey Observatory</a>, <a href="https://www.scmp.com/week-asia/lifestyle-culture/article/3121568/study-buddies-south-korean-youtubers-take-cram-sessions" target="_blank" rel="noreferrer">SCMP</a> ·
            Study Together: <a href="https://discord.com/servers/study-together-595999872222756885" target="_blank" rel="noreferrer">Discord</a> ·
            body doubling: <a href="https://health.clevelandclinic.org/body-doubling-for-adhd" target="_blank" rel="noreferrer">Cleveland Clinic</a>, <a href="https://arxiv.org/pdf/2509.12153" target="_blank" rel="noreferrer">arXiv (VR body doubling)</a> ·
            Forest: <a href="https://forestapp.cc/" target="_blank" rel="noreferrer">forestapp.cc</a> ·
            Focusmate: <a href="https://www.focusmate.com/business/" target="_blank" rel="noreferrer">focusmate.com</a> ·
            Gen Z loneliness &amp; third places: <a href="https://www.simplypsychology.com/articles/third-places-loneliness" target="_blank" rel="noreferrer">Simply Psychology</a>, <a href="https://www.huffpost.com/entry/third-spaces-and-gen-z_l_675ca0fee4b0a6324e3b58ad" target="_blank" rel="noreferrer">HuffPost</a> ·
            platform aging-up: <a href="https://www.thebloxline.com/articles/roblox-now-has-123-million-daily-users-but-the-bigger-story-is-who-those-users-are-becoming" target="_blank" rel="noreferrer">The Bloxline</a>, <a href="https://backlinko.com/roblox-users" target="_blank" rel="noreferrer">Backlinko</a>.
          </p>
        </div>
      </section>

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
