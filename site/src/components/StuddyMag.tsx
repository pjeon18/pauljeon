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
  Band, Beats, BigList, Chapter, ChartBeats, Duo, PersonaSwitch,
  Reveal, Say, Sequence, StatScreens, StoryChrome, WideImg,
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
        ['--st-tint' as string]: '#FFE9F0', ['--st-cream' as string]: '#FFF3D9', ['--st-night' as string]: '#1d0f18',
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
            <a href="https://pauljeon.org/studdy/" target="_blank" rel="noreferrer">Open the café ↗</a>
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
        { text: 'Beans buy furniture, hats and a café cat. They never buy a higher rank or any advantage.' },
        { text: 'Friends’ cafés are one door away, with real people inside.', tone: 'acc' },
      ]} />
      <div className="st-sp" />
      <Say size="xl">Try it yourself. This is the deployed build, so open a café and walk around it.</Say>
      <div className="st-sp-s" />
      <LiveEmbed kind="browser" src="https://pauljeon.org/studdy/" title="Studdy" />

      {/* ---------------- 01 research ---------------- */}
      <Chapter n="01" title="How people actually study now" name="Research" />
      <Sequence lines={[
        { text: 'In South Korea, students began broadcasting themselves studying. Hours of silence, a desk lamp, turning pages.', size: 'xl' },
        { text: 'It got a name, gongbang, and crossed the Pacific as study with me.', align: 'indent' },
        { text: 'The psychology has a name too. Body doubling is working beside someone who asks nothing of you.' },
        { text: 'None of this needed inventing. It needed a room.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <Say size="l">Five products already serve people who study this way.</Say>
      <RefCarousel />
      <StatScreens stats={[
        { to: 15.8, decimals: 1, suffix: 'M', post: 'people subscribe to one illustrated girl studying forever.', bg: '#FF7A9E', fg: '#17150F', num: '#FFFFFF' },
        { to: 79, suffix: '%', post: 'of Gen Z adults report loneliness, the most of any generation.', bg: '#1d0f18', fg: '#F5F2EC', num: '#FF7A9E', align: 'center', big: true, dark: true },
        { to: 60, suffix: 'M', post: 'people use Forest to stay off their phones, completely alone.', bg: '#FFF3D9', fg: '#17150F', num: '#D9527E', align: 'right' },
      ]} />
      <div className="st-sp" />
      <ChartBeats beats={[
        'Two questions place every study product. Can the other people see you too, and how much does it ask of you?',
        'Streamers never see their viewers, and coworking on camera feels like a meeting.',
        'Nothing let people see each other without asking anything of them.',
        'Studdy fills that gap. Everyone in a café can see each other, and sitting down is all it asks.',
      ]}>
        <MarketMap />
      </ChartBeats>
      <Duo frame="desktop" side="right" img={refRoblox} alt="An avatar platform's home page" lines={[
        { text: 'The generation that grew up inside avatar worlds is aging into exams and theses.', size: 'l' },
        { text: 'On the biggest platform, 44% of daily users are now past 17.' },
        { text: 'To them, an avatar in a room feels like a place to spend time.', tone: 'acc' },
      ]} />

      {/* ---------------- 02 people ---------------- */}
      <Chapter n="02" title="Three personas from the research" name="People" />
      <Say size="l">Composites drawn from stream chats, study servers and the playtesters who later lived in the prototype. The portraits come from the game’s own character engine.</Say>
      <div className="st-sp-s" />
      <PersonaSwitch art="figure" people={[
        { name: 'mina', quote: 'Mina, 19, studies alone in her dorm with Lofi Girl on a second monitor.', img: personaMina, alt: 'Mina’s character, long lavender hair and cat ears', lines: ['She wants company that expects nothing from her, and a cozy place to sit.', 'The stream never knows she is there, and a distraction is always one click away.', 'Every café runs its own lofi radio with rain outside the windows. Sitting down is her whole contribution.'] },
        { name: 'daniel', quote: 'Daniel, 22, closes the library most nights and still distrusts his own hour count.', img: personaDaniel, alt: 'Daniel’s character, short dark hair and glasses', lines: ['He wants someone studying at the next desk, and an honest record of his focus time.', 'Camera-on coworking felt like a job interview, and every timer he tried could be gamed.', 'Focus is verified on the server, only while the app is awake. The shared clock gives the room its structure.'] },
        { name: 'caroline', quote: 'Caroline, 21, finishes every checklist she meets and wants her hours to leave something behind.', img: personaCaroline, alt: 'Caroline’s character, caramel hair and a red beret', lines: ['She wants a space of her own that grows over time.', 'Streaks that punish one rest day read as guilt, and she leaves.', 'Every focused minute becomes a bean she can spend on her café and outfits, never on an advantage. She is the real playtester who bought everything.'] },
      ]} />

      {/* ---------------- 03 the bet ---------------- */}
      <Band tone="tint">
        <Chapter n="03" title="Defining the product" name="The bet" />
        <Duo frame="none" side="right" img={refCyworld} alt="The Cyworld logo" lines={[
          { text: 'Studdy comes from Cyworld’s minirooms. In 2000s Korea, about nine in ten twenty-somethings kept a tiny decorated room.', size: 'l' },
          { text: 'Combine that with the feeling of a library at 2am and you get the idea, which never changed.' },
        ]} />
        <Say size="xl" align="center" tone="acc">A little café you own, where real people come to study, and the only thing anyone can do to each other is be there.</Say>
      </Band>
      {/* ---------------- 04 day one ---------------- */}
      <Chapter n="04" title="The first prototype" name="Day one" />
      <WideImg src={v0Img} alt="The first committed build of Studdy, a gray empty room" />
      <Beats lines={[
        { text: 'The first build was a gray, empty room. It proved a fixed camera angle could still feel alive and that a browser could draw a furnished room smoothly.' },
        { text: 'The walls, the lighting and the font all had to change before anyone wanted to sit in it.', align: 'indent' },
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
          { text: 'The character is small and mostly head. From the game’s zoomed-out view, the head is the only part big enough to recognize.', size: 'l' },
          { text: 'There is no walk cycle and no emote wheel.', align: 'indent' },
          { text: 'You express yourself through what you wear, the note on your napkin, whether your headphones are on, and the fact that you showed up.', align: 'right', tone: 'acc' },
        ]} />
      </Band>

      {/* ---------------- 06 art direction ---------------- */}
      <Chapter n="06" title="Choosing the art direction" name="Art" />
      <Beats lines={[
        { text: 'The first users called the flat-shaded look muddy and plasticky.', size: 'xl' },
        { text: 'The fix happened in a lab, away from the live game. One scene, rendered four ways.', align: 'indent' },
      ]} />
      <WideImg src={texlabImg} alt="The texture lab, four treatments side by side" />
      <BigList items={[
        { head: 'Baseline', line: 'Flat shading, the plastic look users disliked. Rejected.' },
        { head: 'Grain', line: 'Wood and paper textures. They made the colors muddy.' },
        { head: 'Toon ramp', line: 'Three hard shading steps. Close, but the shadows looked gray.' },
        { head: 'Hue shift', line: 'Purple-tinted shadows and warm highlights. Shipped.' },
      ]} />
      <div className="st-sp" />
      <Beats lines={[
        { text: 'The trick comes from pixel artists. Instead of darkening a shadow, change its color.', size: 'xl', align: 'right' },
      ]} />
      <WideImg src={roomlabImg} alt="The room lab, the chosen treatment on a full café" />
      <Duo frame="desktop" img={badRetroImg} alt="The removed retro mode, heavily pixelated" lines={[
        { text: 'I could not choose between crisp and pixelated, so I shipped both as a setting.', size: 'l' },
        { text: '“Honestly just get rid of it.”', tone: 'acc' },
        { text: 'Deleted within the hour. A setting like that just passed my own indecision on to users.' },
      ]} />

      {/* ---------------- 07 light ---------------- */}
      <Band tone="cream">
        <Chapter n="07" title="Tuning the lighting" name="Light" />
        <Duo frame="desktop" side="right" img={badLightImg} alt="The over-bright, evenly lit room after the first fix" lines={[
          { text: '“The corners are darker than the middle.” One ceiling light became a grid of hanging lamps.', size: 'l' },
          { text: '“Now it’s way too strong.” Every time of day got its own brightness curve.' },
          { text: 'Then the details. Lamp light that pools softly, shades that never color the light, and a warm or cool bulb for each café.', tone: 'acc' },
        ]} />
      </Band>

      {/* ---------------- 08 economy ---------------- */}
      <Chapter n="08" title="Designing the economy" name="Economy" />
      <Say size="xl">One focused minute earns one bean, and every price is set in minutes of study.</Say>
      <BigList items={[
        { head: 'Impulse', line: '8 to 45 beans, minutes of study. Everyday furniture, plants, mugs.' },
        { head: 'Session', line: '45 to 150 beans, about an hour. Café themes and statement pieces.' },
        { head: 'Commitment', line: '150 to 400 beans, a day or two. Hats, tag charms, big rugs.' },
        { head: 'Atelier', line: '250 to 800 beans, up to a week. The café cat, the fireplace, the aquarium.' },
      ]} />
      <Sequence lines={[
        { text: 'Mid-build I priced room edits with escalating costs.', size: 'xl' },
        { text: 'The game handed you a free room, then charged you to keep shaping it.', align: 'indent' },
        { text: 'I removed it. Moving and rearranging furniture is free, and only new items cost beans.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <Duo frame="desktop" img={shopImg} alt="The atelier tab of the shop" lines={[
        { text: 'The first player to finish the economy hit level 21 with 1,800 beans and nothing left to want.', size: 'l' },
        { text: 'What shipped was worth wanting. A café cat that breathes, a fireplace that lights the room, and a wardrobe that travels with you.' },
      ]} />
      <Duo frame="desktop" side="right" img={salonImg} alt="The salon mirror with the wardrobe" lines={[
        { text: 'Skin, hair and glasses are free forever.', size: 'l' },
        { text: 'Purchases only change how things look. Nothing you buy earns faster or ranks higher.', tone: 'acc' },
      ]} />

      <div className="sm-finale sm-band">
        <Say size="xxl" align="center" tone="light">The café is open. Sit down and study for a sprint.</Say>
        <a className="sm-finale-cta" href="https://pauljeon.org/studdy/" target="_blank" rel="noreferrer">
          The café is open → pauljeon.org/studdy
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
