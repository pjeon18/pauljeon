// The Studdy case study, told as a sequence of beats with the story kit.
// Studdy keeps its own stylesheet (studdy-mag.css, prefix sm-) for its pink
// theme, wordmark and pixel chrome; the story kit supplies the rhythm.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import Footer from './Footer'
import LiveEmbed from './LiveEmbed'
import { consumeArrival } from '../lib/arrival'
import '../styles/studdy-mag.css'
import {
  Band, Beats, BigList, Chapter, ChartBeats, Duo, LightUp, Ledger, More, PersonaSwitch,
  Reveal, Say, Sequence, Shots, StackCards, StatScreens, StoryChrome,
} from './story/Story'

import heroImg from '../assets/studdy-hero.webp'
import loopImg from '../assets/studdy-loop.webp'
import salonImg from '../assets/studdy-salon.webp'
import shopImg from '../assets/studdy-shop.webp'
import v0Img from '../assets/studdy-v0.webp'
import texlabImg from '../assets/studdy-texlab.webp'
import roomlabImg from '../assets/studdy-roomlab.webp'
import badLightImg from '../assets/studdy-bad-light.webp'
import badRetroImg from '../assets/studdy-bad-retro.webp'
import bugCatImg from '../assets/studdy-bug-cat.webp'
import bugGhostImg from '../assets/studdy-bug-ghost.webp'
import charBeret from '../assets/studdy-char-beret.webp'
import charCatears from '../assets/studdy-char-catears.webp'
import charPlain from '../assets/studdy-char-plain.webp'
import refLofigirl from '../assets/ref-lofigirl.webp'
import refStudywithme from '../assets/ref-studywithme.webp'
import refStudytogether from '../assets/ref-studytogether.webp'
import refForest from '../assets/ref-forest.webp'
import refFocusmate from '../assets/ref-focusmate.webp'
import refRoblox from '../assets/ref-roblox.webp'
import refCyworld from '../assets/ref-cyworld.webp'
import wordmark from '../assets/studdy-wordmark.webp'
import personaMina from '../assets/studdy-persona-mina.webp'
import personaDaniel from '../assets/studdy-persona-daniel.webp'
import personaCaroline from '../assets/studdy-persona-caroline.webp'

// ---------------------------------------------------------------------------

function useReveals() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const els = root.current?.querySelectorAll('.rv') ?? []
    // Arriving through the card's shared-element transition: the wordmark and
    // title must already be visible when the browser snapshots the page.
    if (consumeArrival()) {
      let k = 0
      els.forEach((el) => {
        const h = el as HTMLElement
        if (h.tagName === 'H1' || h.classList.contains('sm-wordmark')) h.classList.add('in')
        else h.style.transitionDelay = `${400 + k++ * 90}ms`
      })
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return root
}

// Chart 1, the market. Presence on x, pressure on y (ambient at the top).
function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; end?: boolean }[] = [
    { x: 14, y: 16, label: 'Lofi Girl', sub: '15.8M subscribers' },
    { x: 26, y: 36, label: 'Study-with-me video', sub: 'gongbang, since about 2018' },
    { x: 40, y: 80, label: 'Forest', sub: '60M users, solo' },
    { x: 58, y: 56, label: 'Study Together', sub: '1M-member Discord' },
    { x: 88, y: 86, label: 'Focusmate', sub: '9M sessions, camera on', end: true },
  ]
  const pos = (d: { x: number; y: number }) => [70 + (d.x / 100) * 540, 20 + (d.y / 100) * 380]
  const [hx, hy] = pos({ x: 84, y: 20 })
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="Market map. Study products crowd the one-way and demanding edges. Studdy sits in the mutual, ambient corner.">
      <rect className="cb-wipe" data-beat="2" x="340" y="20" width="270" height="190" fill="#FFE3EC" />
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#141210" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#141210" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#6E675D">one-way presence</text>
        <text x="608" y="428" fontSize="15" fill="#141210" textAnchor="end" fontWeight="700">mutual presence</text>
        <text x="54" y="398" fontSize="15" fill="#6E675D" transform="rotate(-90 54 398)">demanding</text>
        <text x="54" y="96" fontSize="15" fill="#141210" fontWeight="700" transform="rotate(-90 54 96)">ambient</text>
      </g>
      {dots.map((d) => {
        const [cx, cy] = pos(d)
        const tx = d.end ? cx - 16 : cx + 16
        return (
          <g key={d.label} className="cb-pop" data-beat="1" data-dim="2">
            <circle cx={cx} cy={cy} r="6.5" fill="#141210" />
            <text x={tx} y={cy + 1} textAnchor={d.end ? 'end' : 'start'} fontSize="17" fontWeight="700" fill="#141210">{d.label}</text>
            <text x={tx} y={cy + 18} textAnchor={d.end ? 'end' : 'start'} fontSize="13.5" fill="#6E675D">{d.sub}</text>
          </g>
        )
      })}
      <g className="cb-drop" data-beat="3">
        <circle className="cb-ring" cx={hx} cy={hy} r="12" fill="none" stroke="#FF7A9E" strokeWidth="2" />
        <circle cx={hx} cy={hy} r="9" fill="#FF7A9E" />
        <text x={hx - 18} y={hy + 1} textAnchor="end" fontSize="22" fontWeight="700" fill="#141210">Studdy</text>
        <text x={hx - 18} y={hy + 19} textAnchor="end" fontSize="13.5" fill="#D9527E">mutual and ambient</text>
      </g>
    </svg>
  )
}

// Chart 2, Studdy's own interface graded on focus and company.
function DecisionMap() {
  const dots: { x: number; y: number; label: string; risk?: boolean; end?: boolean }[] = [
    { x: 88, y: 88, label: 'shared 25/5 clock', end: true },
    { x: 82, y: 64, label: 'chat only at breaks', end: true },
    { x: 62, y: 76, label: 'napkin status' },
    { x: 74, y: 40, label: 'headphones mean do-not-disturb', end: true },
    { x: 52, y: 93, label: 'name tags over heads', end: true },
    { x: 42, y: 66, label: 'guestbook doodles', end: true },
    { x: 30, y: 82, label: 'friend-is-studying banner', risk: true },
    { x: 24, y: 32, label: 'xp leaderboard', risk: true },
    { x: 66, y: 20, label: 'streaks that pause' },
    { x: 52, y: 52, label: 'lofi radio per café' },
    { x: 40, y: 12, label: 'furniture and wardrobe', end: true },
  ]
  const pos = (d: { x: number; y: number }) => [70 + (d.x / 100) * 540, 20 + ((100 - d.y) / 100) * 380]
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="Studdy interface decisions graded on supporting focus and adding company">
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#141210" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#141210" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#6E675D">hurts focus</text>
        <text x="608" y="428" fontSize="15" fill="#141210" textAnchor="end" fontWeight="700">supports focus</text>
        <text x="54" y="398" fontSize="15" fill="#6E675D" transform="rotate(-90 54 398)">works alone</text>
        <text x="54" y="150" fontSize="15" fill="#141210" fontWeight="700" transform="rotate(-90 54 150)">adds company</text>
      </g>
      {dots.map((d) => {
        const [cx, cy] = pos(d)
        return (
          <g key={d.label} className="cb-pop" data-beat={d.risk ? 2 : 1}>
            {d.risk
              ? <circle cx={cx} cy={cy} r="7" fill="#FDFDFB" stroke="#FF7A9E" strokeWidth="2.5" />
              : <circle cx={cx} cy={cy} r="7" fill="#141210" />}
            <text x={d.end ? cx - 15 : cx + 15} y={cy + 5} textAnchor={d.end ? 'end' : 'start'} fontSize="14.5" fontWeight="700" fill={d.risk ? '#D9527E' : '#141210'}>{d.label}</text>
          </g>
        )
      })}
      {dots.filter((d) => d.risk).map((d) => {
        const [cx, cy] = pos(d)
        return <circle key={`r${d.label}`} className="cb-pop" data-beat="3" cx={cx} cy={cy} r="17" fill="none" stroke="#FF7A9E" strokeWidth="1.5" strokeDasharray="3 4" />
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------

const REFS = [
  { img: refLofigirl, name: 'Lofi Girl', stat: '15.8M subscribers', line: 'One illustrated girl, studying forever. About 100k people listening at any hour.' },
  { img: refStudywithme, name: 'Study with me', stat: 'millions of views a video', line: 'Two silent hours of a stranger at a desk. Born in Korea as gongbang.' },
  { img: refStudytogether, name: 'Study Together', stat: '1,068,281 members', line: 'Discord’s largest study server. Mutual, and shaped like a black window full of names.' },
  { img: refForest, name: 'Forest', stat: '60M users', line: 'Stay off your phone and grow a tree. It works, and you are completely alone.' },
  { img: refFocusmate, name: 'Focusmate', stat: '9M sessions', line: 'Scheduled coworking with a stranger, camera on. It works, and it feels like a meeting.' },
]

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
            <div className={'sm-caro-card ' + cls} key={r.name} style={{ transform: `translateX(${off * 72}%) scale(${off === 0 ? 1 : 0.82})` }} onClick={() => off !== 0 && setI(j)}>
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
          {REFS.map((x, j) => <button key={x.name} className={j === i ? 'on' : ''} onClick={() => setI(j)} aria-label={x.name} />)}
        </div>
        <button onClick={() => go(1)} aria-label="Next product">→</button>
      </div>
    </div>
  )
}

function PriorityMatrix() {
  const Q = [
    { cls: 'q-blue', name: 'Shipped first', items: ['shared clock', 'napkin status', 'headphones as do-not-disturb', 'streak pausing', 'name tags'] },
    { cls: 'q-green', name: 'The big bets', items: ['realtime presence', 'server-verified economy', 'clubs and clubhouse', 'lofi radio'] },
    { cls: 'q-purple', name: 'Nice to have', items: ['tag charms', 'guestbook doodles', 'warm and cool bulbs'] },
    { cls: 'q-yellow', name: 'Declined or deferred', items: ['retro toggle, shipped then killed', 'room extension, later', 'voice chat, never'] },
  ]
  return (
    <Reveal className="sm-matrix st-matrix-sm">
      <div className="sm-matrix-y"><span>High value</span><span>Low value</span></div>
      <div className="sm-matrix-grid">
        {Q.map((q) => (
          <div className={'sm-quad ' + q.cls} key={q.name}>
            <div className="sm-quad-name">{q.name}</div>
            <div className="sm-quad-chips">{q.items.map((it) => <span key={it}>{it}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="sm-matrix-x"><span>Low effort</span><span>High effort</span></div>
    </Reveal>
  )
}

// ---------------------------------------------------------------------------

export default function StuddyMag() {
  const root = useReveals()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div
      className="smag"
      ref={root}
      style={{
        ['--st-acc-text' as string]: '#D9527E',
        ['--st-band' as string]: '#2B1622', ['--st-band-ink' as string]: '#FBE7EE', ['--st-band-hi' as string]: '#FF9DBA',
        ['--st-tint' as string]: '#FFE9F0', ['--st-cream' as string]: '#FFF3D9', ['--st-night' as string]: '#17150F',
      }}
    >
      <StoryChrome />

      <nav className="case-nav sm-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <BackToSite />
      </nav>

      <header className="sm-masthead">
        <img className="sm-wordmark rv" src={wordmark} alt="Studdy" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
        <div className="sm-kicker rv">Case study · shipped and live · 2026</div>
        <h1 className="rv" style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
          A study spot<br />that <em>never closes</em> ♪
        </h1>
        <Say size="m" tone="soft">A multiplayer study café. Real people in tiny pixel bodies, and one 25/5 clock shared by every room in the world.</Say>
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
      </figure>

      {/* ---------------- product first ---------------- */}
      <Chapter n="00" title="The product, in one minute" name="Product" />
      <Duo frame="desktop" img={loopImg} alt="Seated in a Studdy café with the session panel open" lines={[
        { text: 'Sit anywhere and a verified focus clock starts. A minute of focus earns a bean.', size: 'l' },
        { text: 'Every café shares one 25/5 sprint clock. Chat opens at the breaks.' },
        { text: 'Beans buy furniture, hats and a café cat. Never rank, never power.' },
        { text: 'Friends’ cafés are one door away, with real people inside.', tone: 'acc' },
      ]} />
      <div className="st-sp" />
      <Say size="xl">Try it yourself. This is the deployed build, so open a café and walk around it.</Say>
      <div className="st-sp-s" />
      <LiveEmbed kind="browser" src="https://pjeon18.github.io/studdy/" title="Studdy" />

      {/* ---------------- 01 research ---------------- */}
      <Chapter n="01" title="How people actually study now" name="Research" />
      <Sequence lines={[
        { text: 'In South Korea, students began broadcasting themselves studying. Hours of silence, a desk lamp, turning pages.', size: 'xl' },
        { text: 'It got a name, gongbang, and crossed the Pacific as study with me.', align: 'indent' },
        { text: 'The psychology has a name too. Body doubling is working beside someone who asks nothing of you.' },
        { text: 'None of this needed inventing. It needed a room.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <Say size="l">Five products own this behavior today.</Say>
      <RefCarousel />
      <StatScreens stats={[
        { to: 15.8, decimals: 1, suffix: 'M', post: 'people subscribe to one illustrated girl studying forever.', bg: '#FF7A9E', fg: '#17150F', num: '#FFFFFF' },
        { to: 79, suffix: '%', post: 'of Gen Z adults report loneliness, the most of any generation.', bg: '#17150F', fg: '#F5F2EC', num: '#FF7A9E', align: 'center', big: true, dark: true },
        { to: 60, suffix: 'M', post: 'people use Forest to stay off their phones, completely alone.', bg: '#FFF3D9', fg: '#17150F', num: '#D9527E', align: 'right' },
      ]} />
      <div className="st-sp" />
      <ChartBeats beats={[
        'Two questions place every study product. Does it see you back, and how much does it ask of you?',
        'Everything crowds the edges. Streams are one-way glass, and coworking with a camera feels like a meeting.',
        'The calm, mutual corner was empty.',
        'Studdy is built for it. You can see each other, and sitting down is the only thing asked.',
      ]}>
        <MarketMap />
      </ChartBeats>
      <LightUp text="The streams never know you exist. The Discord is a black window full of names. Nobody was building mutual presence at ambient pressure." accent="mutual presence at ambient pressure" />
      <Duo frame="desktop" side="right" img={refRoblox} alt="An avatar platform's home page" lines={[
        { text: 'The generation that grew up inside avatar worlds is aging into exams and theses.', size: 'l' },
        { text: 'On the biggest platform, 44% of daily users are now past 17.' },
        { text: 'They experience an avatar in a room as somewhere to be.', tone: 'acc' },
      ]} />

      {/* ---------------- 02 people ---------------- */}
      <Chapter n="02" title="Three personas from the research" name="People" />
      <Say size="l">Composites drawn from stream chats, study servers and the playtesters who later lived in the prototype. The portraits come from the game’s own character engine.</Say>
      <div className="st-sp-s" />
      <PersonaSwitch art="figure" people={[
        { name: 'mina', quote: 'Mina, 19, studies alone in her dorm with Lofi Girl on a second monitor.', img: personaMina, alt: 'Mina’s character, long lavender hair and cat ears', lines: ['She wants company that asks nothing back, and somewhere warm to sit.', 'The stream never knows she is there, and a distraction is always one click away.', 'Every café runs its own lofi radio with rain outside the windows. Sitting down is her whole contribution.'] },
        { name: 'daniel', quote: 'Daniel, 22, closes the library most nights and still distrusts his own hour count.', img: personaDaniel, alt: 'Daniel’s character, short dark hair and glasses', lines: ['He wants a body at the next desk and an honest record of his focus.', 'Camera-on coworking felt like a job interview, and every timer he tried could be gamed.', 'Focus is verified on the server, only while the app is awake. The shared clock gives the room its structure.'] },
        { name: 'caroline', quote: 'Caroline, 21, finishes every checklist she meets and wants her hours to leave something behind.', img: personaCaroline, alt: 'Caroline’s character, caramel hair and a red beret', lines: ['She wants a space of her own that grows over time.', 'Streaks that punish one rest day read as guilt, and she leaves.', 'Every focused minute becomes a bean that buys expression, never advantage. She is the real playtester who maxed the economy.'] },
      ]} />

      {/* ---------------- 03 the bet ---------------- */}
      <Band tone="tint">
        <Chapter n="03" title="Defining the product" name="The bet" />
        <Duo frame="none" side="right" img={refCyworld} alt="The Cyworld logo" lines={[
          { text: 'Studdy comes from Cyworld’s minirooms. In 2000s Korea, about nine in ten twenty-somethings kept a tiny decorated room.', size: 'l' },
          { text: 'Cross that with the library at 2am and you get the pitch, which never changed.' },
        ]} />
        <Say size="xl" align="center" tone="acc">A little café you own, where real people come to study, and the only thing anyone can do to each other is be there.</Say>
      </Band>
      <div className="st-sp" />
      <StackCards cards={[
        { n: '1', title: 'Company without performance', body: 'Being visible is the entire contribution. No follower count, no camera, nothing to keep up.', bg: '#FFE9F0', fg: '#17150F', num: '#D9527E' },
        { n: '2', title: 'A place, not an app', body: 'You walk in a door and take a seat. Someone’s radio is playing.', bg: '#E3F0FA', fg: '#17150F', num: '#3A6EA5', variant: 'big' },
        { n: '3', title: 'Low stakes, on purpose', body: 'Soft voxels, one warm palette, and a cat. A tool that looks like a toy is allowed to be kind.', bg: '#17150F', fg: '#FBE7EE', num: '#FF7A9E', variant: 'flip' },
      ]} />

      {/* ---------------- 04 day one ---------------- */}
      <Chapter n="04" title="The first prototype" name="Day one" />
      <Reveal className="st-fade st-figure st-wide-img"><img src={v0Img} alt="The first committed build of Studdy, a gray empty room" /></Reveal>
      <Beats lines={[
        { text: 'Day one had to prove a fixed camera could feel alive, and a browser could draw a furnished room at 60fps.' },
        { text: 'It got the walls, the lighting and the font wrong.', align: 'indent' },
        { text: 'It did not look cheap. It looked like nobody lived there.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />

      {/* ---------------- 05 avatar ---------------- */}
      <Band tone="cream" style={{ background: '#E3F0FA' }}>
        <Chapter n="05" title="Designing the avatar" name="Avatar" />
        <Reveal className="sm-chargrid st-chars">
          <figure><img src={charBeret} alt="The Studdy character wearing a beret" /></figure>
          <figure className="sm-char-mid"><img src={charPlain} alt="The Studdy character with glasses" /></figure>
          <figure><img src={charCatears} alt="The Studdy character from behind, wearing cat ears" /></figure>
        </Reveal>
        <div className="st-sp-s" />
        <Beats lines={[
          { text: 'The chibi is two units tall and mostly head. At diorama distance, a head is the only thing big enough to carry identity.', size: 'l' },
          { text: 'There is no walk cycle and no emote wheel.', align: 'indent' },
          { text: 'Expression is what you wear, what your napkin says, whether your headphones are on, and the fact that you came.', align: 'right', tone: 'acc' },
        ]} />
      </Band>

      {/* ---------------- 06 art direction ---------------- */}
      <Chapter n="06" title="Choosing the art direction" name="Art" />
      <Beats lines={[
        { text: 'The first users called the flat-shaded look muddy and plasticky.', size: 'xl' },
        { text: 'The fix happened in a lab, away from the live game. One scene, rendered four ways.', align: 'indent' },
      ]} />
      <Reveal className="st-fade st-figure st-wide-img"><img src={texlabImg} alt="The texture lab, four treatments side by side" /></Reveal>
      <BigList items={[
        { head: 'Baseline', line: 'Flat shading, the plasticky control. Rejected.' },
        { head: 'Grain', line: 'Procedural wood and paper texture. It muddied the color.' },
        { head: 'Toon ramp', line: 'Hard three-step shading. Close, with gray bands.' },
        { head: 'Hue shift', line: 'Violet shadows and warm highlights. Shipped.' },
      ]} />
      <div className="st-sp" />
      <Beats lines={[
        { text: 'The rule comes from pixel artists. Never simply darken a shadow. Shift its hue.', size: 'xl', align: 'right' },
        { text: 'The palette stopped being muddy the day the shadows stopped being gray.' },
      ]} />
      <Reveal className="st-fade st-figure st-wide-img"><img src={roomlabImg} alt="The room lab, the chosen treatment on a full café" /></Reveal>
      <Duo frame="desktop" img={badRetroImg} alt="The removed retro mode, heavily pixelated" lines={[
        { text: 'I could not choose between crisp and pixelated, so I shipped both as a setting.', size: 'l' },
        { text: '“Honestly just get rid of it.”', tone: 'acc' },
        { text: 'Deleted within the hour. A settings toggle is often a designer’s indecision, exported.' },
      ]} />

      {/* ---------------- 07 light ---------------- */}
      <Band tone="cream">
        <Chapter n="07" title="Tuning the lighting" name="Light" />
        <Duo frame="desktop" side="right" img={badLightImg} alt="The over-bright, evenly lit room after the first fix" lines={[
          { text: '“The corners are darker than the middle.” The single light became a pendant grid.', size: 'l' },
          { text: '“Now it’s way too strong.” Every time of day got its own brightness curve.' },
          { text: 'Then taste. Glow that pools, shades that never tint the light, and a warm or cool bulb per café.', tone: 'acc' },
        ]} />
        <Say size="xl" align="center">The first fix lit the room evenly and made it look flat. Even light was never the goal.</Say>
      </Band>

      {/* ---------------- 08 trust ---------------- */}
      <Chapter n="08" title="Designing trust, honor versus proof" name="Trust" />
      <Beats lines={[
        { text: 'Focused minutes are the only currency, so the first question was what stops someone from lying.', size: 'xl' },
        { text: 'Anything private runs on honor. Your beans, your napkin, your streak.', align: 'indent' },
        { text: 'Anything other people see is granted only by the server, from heartbeats that cannot outrun a wall clock.' },
        { text: 'If you want to lie to a pixel cat, that is between you and the cat.', align: 'right', tone: 'acc' },
      ]} />
      <Sequence lines={[
        { text: 'In week one, a tester closed her laptop mid-session and woke up rich.', size: 'xl' },
        { text: 'Should idle time be on honor, should the clock pause, or should the game stand you up?', align: 'indent' },
        { text: 'All three, in their kindest forms. The clock only counts while the app is awake.' },
        { text: '“You drifted off. We tucked your chair in.”', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <More summary="How the server draws the line">
        <ul>
          <li>Row-level security on every table. Café docs, notes and friendships are all scoped by policy.</li>
          <li>The ranked columns, XP and café stars, are writable by <b>no client at all</b>. Server functions grant them from session heartbeats.</li>
          <li>Heartbeats credit real elapsed time, capped at 90 seconds a beat, 6 hours a sitting and 16 hours a day.</li>
          <li>The club bonus while a clubmate studies is computed on the server from live sessions too.</li>
          <li>Rate limits live in policies. One study-log row per 8 minutes, 3 gifts a day, 5 reports a day.</li>
        </ul>
      </More>
      <More summary="Retention, tested against one question">
        <ul>
          <li>Does this still respect the user on their worst day?</li>
          <li><b>Streaks pause.</b> Miss a day and the count keeps. Only a second missed day resets it, and nothing turns red.</li>
          <li><b>Goals run on honor</b> but can only be claimed the next day, which stops impulse claiming without policing anyone.</li>
          <li><b>One interruption exists,</b> the friend-is-studying banner. One tap to join, one tap to snooze for half an hour.</li>
          <li><b>The weekly recap is a postcard,</b> not a report card.</li>
        </ul>
      </More>

      {/* ---------------- 09 the loop ---------------- */}
      <Chapter n="09" title="How every change shipped" name="The loop" />
      <BigList items={[
        { head: 'Lab first', line: 'Risky visuals were prototyped on a separate page, never in the live game.' },
        { head: 'Ship small', line: 'Same-day deploys to production, with two real users on the other end.' },
        { head: 'Field test', line: 'They studied in it daily and reported in feel words, never spec words.' },
        { head: 'Fix same day', line: 'Every break they found had a fix before their next session.' },
      ]} />
      <div className="st-sp" />
      <Say size="l">The actual ledger. Their words, what shipped, and what it taught.</Say>
      <Ledger tone="band" items={[
        { title: '“When you sit, you sink into the chair.”', fix: 'The sit pose now measures from the cushion top, and every seat was re-tuned against the character.', lesson: 'Nobody files a ticket about seat anchoring. Translate feel into geometry.' },
        { title: '“It should have usernames over heads, like Minecraft.”', fix: 'Floating name tags with level badges. Custom tag colors went on sale and became an identity feature.', lesson: 'The need was to be seen, not to copy Minecraft.' },
        { title: '“The room gets darker toward the corners.”', fix: 'One ceiling light became a pendant grid, normalized so five lamps are not five times brighter than one.', lesson: 'Evenness and brightness are different asks. It took three rounds.' },
        { title: '“There are two of me on my screen.”', fix: 'Presence now deduplicates by identity instead of connection, and a reload says goodbye before it leaves.', lesson: 'Distributed-systems glitches read as horror-movie glitches.' },
        { title: '“She redecorated but I still see her old room.”', fix: 'A security migration had silently broken publishing. Rooms now also refresh every 20 seconds while you stand in them.', lesson: 'Every migration needs a round-trip test from the client’s side.' },
        { title: '“Our laptops get hot and the battery drains fast.”', fix: 'A low-power GPU preference and an idle mode at 30fps, back to full rate the moment you touch anything.', lesson: 'An idle game that renders like a shooter contradicts itself.' },
        { title: '“I’m level 21 with 1,800 beans and there’s nothing left to do.”', fix: 'The atelier of animated showpieces, the wardrobe, and a written economy with real price bands.', lesson: 'Answer the most engaged user with things to want, not bigger numbers.' },
      ]} />
      <Shots frame="desktop" items={[
        { img: bugGhostImg, alt: 'Two identical characters standing in a café', cap: 'Reconstructed. A reload gave the same person a second body.' },
        { img: bugCatImg, alt: 'The café cat stretched into a tall gray tower', cap: 'The day the cat’s breathing animation overwrote its scale.' },
      ]} />

      {/* ---------------- 10 audit ---------------- */}
      <Chapter n="10" title="Grading the interface" name="Audit" />
      <ChartBeats wide beats={[
        'Two questions grade every feature. Does it support focus, and does it add company?',
        'Most of the shipped interface lands top right, and held its ground in field testing.',
        'Two features sit near the edge. The leaderboard and the friend banner.',
        'The leaderboard ranks a number, never a person. The banner is the only interruption, and it snoozes.',
      ]}>
        <DecisionMap />
      </ChartBeats>
      <Say size="l">The same features, sorted by value against effort. The bottom right lists what the product said no to.</Say>
      <PriorityMatrix />

      {/* ---------------- 11 economy ---------------- */}
      <Chapter n="11" title="Designing the economy" name="Economy" />
      <Say size="xl">One focused minute earns one bean. Every price answers to that anchor.</Say>
      <BigList items={[
        { head: 'Impulse', line: '8 to 45 beans, minutes of study. Everyday furniture, plants, mugs.' },
        { head: 'Session', line: '45 to 150 beans, about an hour. Café themes and statement pieces.' },
        { head: 'Commitment', line: '150 to 400 beans, a day or two. Hats, tag charms, big rugs.' },
        { head: 'Atelier', line: '250 to 800 beans, up to a week. The café cat, the fireplace, the aquarium.' },
      ]} />
      <Sequence lines={[
        { text: 'Mid-build I priced room edits with escalating costs.', size: 'xl' },
        { text: 'The game handed you a free room, then charged you to keep shaping it.', align: 'indent' },
        { text: 'It was unshipped, and the rule went in writing so it stays that way.' },
        { text: 'Structure is identity, and identity is never priced.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <Duo frame="desktop" img={shopImg} alt="The atelier tab of the shop" lines={[
        { text: 'The first player to finish the economy hit level 21 with 1,800 beans and nothing left to want.', size: 'l' },
        { text: 'What shipped was worth wanting. A café cat that breathes, a fireplace that lights the room, and a wardrobe that travels with you.' },
      ]} />
      <Duo frame="desktop" side="right" img={salonImg} alt="The salon mirror with the wardrobe" lines={[
        { text: 'Skin, hair and glasses are free forever.', size: 'l' },
        { text: 'Purchases only ever buy expression. Nothing earns faster or ranks higher, anywhere in the game.', tone: 'acc' },
      ]} />

      {/* ---------------- takeaways ---------------- */}
      <Band tone="night">
        <Chapter n="12" title="Where this goes" name="Takeaways" />
        <Beats gap="l" lines={[
          { text: 'People who grew up in avatar worlds want a place to be, not another app.', size: 'xl' },
          { text: 'What brings people back is seeing someone else already studying.', align: 'indent' },
          { text: 'Streaks that pause and a gentle idle check kept people coming back without shaming them.', size: 'xl', align: 'right' },
          { text: 'Two real users are enough to find every important fix.', tone: 'acc' },
        ]} />
      </Band>

      <div className="sm-finale sm-band">
        <Say size="xxl" align="center" tone="light">Time you actually spent, made visible in a place you actually like.</Say>
        <a className="sm-finale-cta" href="https://pjeon18.github.io/studdy/" target="_blank" rel="noreferrer">
          The café is open → pjeon18.github.io/studdy
        </a>
      </div>

      <figure className="sm-bleed sm-finale-img">
        <img src={heroImg} alt="A full Studdy café" loading="lazy" />
      </figure>

      <details className="sm-details sm-sourcefold">
        <summary>Sources and further reading</summary>
        <p className="sm-sources-p">
          Lofi Girl scale: <a href="https://en.wikipedia.org/wiki/Lofi_Girl" target="_blank" rel="noreferrer">Wikipedia</a> ·
          gongbang origins: <a href="https://observatory.tec.mx/edu-news/gongbang-study-with-me/" target="_blank" rel="noreferrer">Tec de Monterrey Observatory</a>, <a href="https://www.scmp.com/week-asia/lifestyle-culture/article/3121568/study-buddies-south-korean-youtubers-take-cram-sessions" target="_blank" rel="noreferrer">SCMP</a> ·
          Study Together: <a href="https://discord.com/servers/study-together-595999872222756885" target="_blank" rel="noreferrer">Discord</a> ·
          body doubling: <a href="https://health.clevelandclinic.org/body-doubling-for-adhd" target="_blank" rel="noreferrer">Cleveland Clinic</a>, <a href="https://arxiv.org/pdf/2509.12153" target="_blank" rel="noreferrer">arXiv (VR body doubling)</a> ·
          Forest: <a href="https://forestapp.cc/" target="_blank" rel="noreferrer">forestapp.cc</a> ·
          Focusmate: <a href="https://www.focusmate.com/business/" target="_blank" rel="noreferrer">focusmate.com</a> ·
          Gen Z loneliness and third places: <a href="https://www.simplypsychology.com/articles/third-places-loneliness" target="_blank" rel="noreferrer">Simply Psychology</a>, <a href="https://www.huffpost.com/entry/third-spaces-and-gen-z_l_675ca0fee4b0a6324e3b58ad" target="_blank" rel="noreferrer">HuffPost</a> ·
          Cyworld: <a href="https://en.wikipedia.org/wiki/Cyworld" target="_blank" rel="noreferrer">Wikipedia</a> ·
          platform aging-up: <a href="https://www.thebloxline.com/articles/roblox-now-has-123-million-daily-users-but-the-bigger-story-is-who-those-users-are-becoming" target="_blank" rel="noreferrer">The Bloxline</a>, <a href="https://backlinko.com/roblox-users" target="_blank" rel="noreferrer">Backlinko</a>.
          Product screenshots appear for identification and commentary, and all marks belong to their owners.
        </p>
      </details>

      <div className="case-next sm-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/prep-io" className="case-next-link">
          Prep.io. Office hours, made live. <span className="arr">→</span>
        </Link>
      </div>

      <Footer compact />
    </div>
  )
}
