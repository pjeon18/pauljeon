/*
 * ISO, redesigned: the two companion pages to the case study deck.
 *   /work/iso-redesign/brand    the brand: mark, light, type, voice, posters, mockups, films, shaders, the kit
 *   /work/iso-redesign/process  how it was made: the whole pipeline, at a glance and then stage by stage
 * Same language as the deck: white and ink, big type, one idea per block, media that plays when it is seen.
 */
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import '../styles/iso-pages.css'

const BASE = import.meta.env.BASE_URL
const R = `${BASE}iso-redesign/`
const F = `${BASE}films/`
const PROTO = `${BASE}iso-chromatic/index.html`

/* videos play only while on screen */
function useAutoplay(root: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const vids = root.current ? [...root.current.querySelectorAll<HTMLVideoElement>('video[data-auto]')] : []
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target as HTMLVideoElement
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause()
    }), { threshold: 0.25 })
    vids.forEach(v => io.observe(v))
    return () => io.disconnect()
  }, [root])
}
/* blocks rise in once, the first time they are seen */
function useReveal(root: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const els = root.current ? [...root.current.querySelectorAll<HTMLElement>('.ip-r')] : []
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } }), { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [root])
}

const Loop = ({ src, poster, className = '' }: { src: string; poster?: string; className?: string }) => (
  <video className={className} data-auto src={src} poster={poster} muted loop playsInline preload="metadata" />
)
const Top = ({ here }: { here: 'brand' | 'process' }) => (
  <header className="ip-top">
    <BackToSite />
    <nav>
      <Link to="/work/iso-redesign">Case study</Link>
      <Link to="/work/iso-redesign/brand" className={here === 'brand' ? 'on' : ''}>Brand</Link>
      <Link to="/work/iso-redesign/process" className={here === 'process' ? 'on' : ''}>Process</Link>
    </nav>
  </header>
)
const Foot = ({ next }: { next: 'brand' | 'process' }) => (
  <footer className="ip-foot ip-r">
    <p className="ip-big">One conversation at a time.</p>
    <div className="ip-links">
      <Link to="/work/iso-redesign">Read the case study</Link>
      {next === 'process' ? <Link to="/work/iso-redesign/process">How it was made</Link> : <Link to="/work/iso-redesign/brand">See the brand</Link>}
      <a href={`${PROTO}?mode=watch`} target="_blank" rel="noreferrer">Open the prototype ↗</a>
      <Link to="/" state={{ from: '/work/iso-redesign' }}>Back to all work</Link>
    </div>
  </footer>
)

/* ================================================================== brand */

const FILMS = [
  { src: 'iso-hype.mp4', poster: 'iso-hype.jpg', t: 'ISO in eighteen seconds' },
  { src: 'iso-brand.mp4', poster: 'iso-brand.jpg', t: 'The brand' },
  { src: 'iso-features.mp4', poster: 'iso-features.jpg', t: 'Every feature' },
]
const KIT_LOOPS = [['logo-build', 'The mark builds'], ['noise-loop', 'Everything else'], ['found-loop', 'Found someone'], ['clock-loop', 'ISO Live'], ['chat-loop', 'One turn at a time'],
  ['flip-loop', 'Sealed, then yes'], ['held-loop', 'Hold a moment'], ['wheel-loop', 'Everyone'], ['light-ink', 'Light on ink'], ['light-white', 'Light on white']]
const KIT_STILLS = [['logo-dark', 'Mark, ink'], ['logo-light', 'Mark, white'], ['palette', 'Palette'], ['components', 'Components'], ['clock', 'ISO Live'], ['found', 'Found'],
  ['profile', 'Profile'], ['chat', 'Chat'], ['yes', 'Both said yes'], ['held', 'Held'], ['question', 'Tonight’s question'], ['refuses', 'What it refuses'], ['one-person', 'One person'], ['wheel', 'Everyone']]
const MOCKS = [['02-shelter', 'Bus shelter, night'], ['04-phone', '7:58'], ['09-subway', 'Platform']]
const POSTER: Record<string, string> = { 'logo-build': 'logo-dark', 'found-loop': 'found', 'clock-loop': 'clock', 'chat-loop': 'chat', 'flip-loop': 'yes', 'held-loop': 'held', 'wheel-loop': 'wheel' }

export function IsoBrand() {
  const root = useRef<HTMLDivElement>(null)
  useAutoplay(root); useReveal(root)
  useEffect(() => { document.title = 'ISO, the brand · Paul Jeon'; window.scrollTo(0, 0) }, [])
  return (
    <div className="ip" ref={root}>
      <Top here="brand" />

      <section className="ip-stack">
        <div className="ip-r"><h1>ISO, the brand.</h1><p className="ip-lead">White and ink. Light only where someone is live.</p></div>
        <Loop className="ip-wide ip-r" src={`${R}loops/brand-construction-loop.mp4`} poster={`${R}brand/brand-construction.webp`} />
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">The mark</h2>
        <div className="ip-pair ip-r"><img src={`${R}brand/brand-crop-i.webp`} alt="The i, cropped" /><img src={`${R}brand/brand-crop-o.webp`} alt="The o, cropped" /></div>
        <p className="ip-cap ip-r">The o is the ring you see while ISO looks for someone. The i’s head is the dot that means a person is here.</p>
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">The light</h2>
        <Loop className="ip-wide ip-r" src={`${R}loops/brand-light-loop.mp4`} poster={`${R}brand/brand-light.webp`} />
        <p className="ip-cap ip-r">Four lights that never mix into each other, and one green that only means present.</p>
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">The type</h2>
        <div className="ip-pair ip-r"><img src={`${R}brand/brand-type.webp`} alt="Inter Tight specimen" /><img src={`${R}brand/brand-lexicon.webp`} alt="The lexicon" /></div>
      </section>

      <section className="ip-sec ip-ink">
        <h2 className="ip-r">ISO Live</h2>
        <div className="ip-posters ip-r">{['eight', 'one', 'here'].map(k => <img key={k} src={`${R}brand/poster-${k}.webp`} alt="" />)}</div>
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">In the world</h2>
        <div className="ip-mocks">{MOCKS.map(([k, t]) => <figure key={k} className="ip-r"><img src={`${R}mock/${k}.webp`} alt={t} loading="lazy" /><figcaption>{t}</figcaption></figure>)}</div>
        <figure className="ip-r ip-mock-wide"><img src={`${R}mock/06-cards.webp`} alt="Cards" loading="lazy" /><figcaption>Cards</figcaption></figure>
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">Films</h2>
        <div className="ip-films">{FILMS.map(f => <figure key={f.src} className="ip-r"><video src={`${F}${f.src}`} poster={`${F}${f.poster}`} controls playsInline preload="none" /><figcaption>{f.t}</figcaption></figure>)}</div>
      </section>

      <section className="ip-sec ip-ink">
        <h2 className="ip-r">Light, rendered</h2>
        <div className="ip-pair ip-r">
          <figure><Loop src={`${R}shader/orb-loop.mp4`} poster={`${R}shader/orb-loop.jpg`} /><figcaption>The dot, lit from behind</figcaption></figure>
          <figure><Loop src={`${R}shader/glass-loop.mp4`} poster={`${R}shader/glass-loop.jpg`} /><figcaption>A glass pill over Here now</figcaption></figure>
        </div>
      </section>

      <section className="ip-sec">
        <h2 className="ip-r">The kit</h2>
        <div className="ip-grid">{KIT_LOOPS.map(([k, t]) => <figure key={k} className="ip-r"><Loop src={`${R}loops/${k}.mp4`} poster={POSTER[k] ? `${R}brand/${POSTER[k]}.webp` : undefined} /><figcaption>{t}</figcaption></figure>)}</div>
        <div className="ip-grid">{KIT_STILLS.map(([k, t]) => <figure key={k} className="ip-r"><img src={`${R}brand/${k}.webp`} alt={t} loading="lazy" /><figcaption>{t}</figcaption></figure>)}</div>
      </section>

      <Foot next="process" />
    </div>
  )
}

/* ================================================================== process */

/* a very small highlighter: comments, strings, numbers, a few keywords */
function Code({ lang, children }: { lang: string; children: string }) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  // one pass, so a token's own markup is never re-matched by a later rule
  const TOK = /(\/\/[^\n]*|#\s[^\n]*)|('[^'\n]*'|`[^`\n]*`|"[^"\n]*")|\b(const|let|await|async|for|return|function|vec3|vec2|float|int|new|if)\b|\b(\d+\.?\d*)\b/g
  const html = esc(children.trim()).replace(TOK, (m, c, str, k) => `<i class="${c ? 'c' : str ? 's' : k ? 'k' : 'n'}">${m}</i>`)
  return <pre className="ip-code ip-r"><span className="ip-lang">{lang}</span><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
}

const STAGES = [
  ['01', 'Figma', 'Screens, variables, components', 'Figma MCP'],
  ['02', 'Prototype', 'Every screen, working', 'HTML · CSS · JS'],
  ['03', 'Films', 'Rendered frame by frame', 'Playwright · ffmpeg'],
  ['04', 'Light', 'The chromatic signature', 'GLSL'],
  ['05', 'Shaders', 'Glass and lit objects', 'WebGPU'],
  ['06', 'Kit', 'Every asset from one page', 'renderAt(t)'],
]

export function IsoProcess() {
  const root = useRef<HTMLDivElement>(null)
  useAutoplay(root); useReveal(root)
  useEffect(() => { document.title = 'ISO, how it was made · Paul Jeon'; window.scrollTo(0, 0) }, [])
  return (
    <div className="ip" ref={root}>
      <Top here="process" />

      <section className="ip-hero ip-hero-text">
        <div className="ip-hero-copy ip-r"><h1>How it was made.</h1><p>From a Figma file to a working prototype, films and a brand system.</p></div>
      </section>

      {/* the whole pipeline at a glance */}
      <section className="ip-sec">
        <ol className="ip-pipe">
          {STAGES.map(([n, k, v, tool], i) => (
            <li key={n} className="ip-r" style={{ transitionDelay: `${i * 60}ms` }}><a href={`#s${n}`}><span className="n">{n}</span><b>{k}</b><span className="v">{v}</span><span className="tool">{tool}</span></a></li>
          ))}
        </ol>
        <p className="ip-cap ip-r">Claude was integrated into my workflow for rapid prototyping, experimentation and design.</p>
      </section>

      {/* 01 */}
      <section className="ip-sec ip-stage" id="s01">
        <div className="ip-head ip-r"><span className="n">01</span><h2>Figma</h2><p>Built all 64 screens using Figma MCP, on shared color, type and component variables.</p></div>
        {[['row', 'The core flow'], ['L-home', 'Home, by the hour of the night'], ['L-profile', 'Profile'], ['L-memories', 'Memories'], ['L-hold', 'Holding a moment'],
          ['L-after', 'After a conversation'], ['L-live', 'ISO Live'], ['L-onboarding', 'Onboarding']].map(([k, t]) => (
          <figure key={k} className={'ip-r ip-figflow' + (k === 'L-home' ? ' ip-fig-tall' : '')}>
            <figcaption className="above">{t}</figcaption><div className="ip-pan"><img src={`${R}figma/${k}.webp`} alt={t} loading="lazy" /></div>
          </figure>
        ))}
        <div className="ip-split">
          <img className="ip-r" src={`${R}figma/components.webp`} alt="The component page in Figma" />
          <div>
            <Code lang="use_figma · JS">{`// bind a fill to a color variable, then put the opacity back:
// setBoundVariableForPaint drops it, which made the glows loud
const paint = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: hex('#9E8AFF') }, 'color', iris)
node.fills = [{ ...paint, opacity: 0.18 }]`}</Code>
            <ul className="ip-facts ip-r"><li><b>Variables</b> for color and type, never hard-coded fills</li><li><b>Glow</b> is one component, not a gradient per screen</li><li><b>Variations</b> sit beside the screen they replace</li></ul>
          </div>
        </div>
      </section>

      {/* 02 */}
      <section className="ip-sec ip-stage" id="s02">
        <div className="ip-head ip-r"><span className="n">02</span><h2>Prototype</h2><p>Every screen as working HTML, CSS and JavaScript. Three modes: try it, watch it play itself, or feed the film.</p></div>
        <div className="ip-split">
          <Loop className="ip-r" src={`${F}iso-features-loop.mp4`} poster={`${F}iso-features.jpg`} />
          <div>
            <Code lang="tour.js">{`// the watch mode drives the real screens, not a recording
await T.tap('.s-home .lw .btn')          // Find someone
await T.until(() => $('.s-match'))       // wait for a real match
await T.hold('.row[data-i="2"] .bubble') // long-press to hold
await T.type('#why', 'Forgot to be nervous.')`}</Code>
            <ul className="ip-facts ip-r"><li><b>?mode=try</b> nothing plays on its own</li><li><b>?mode=watch</b> a finger and captions</li><li><b>?film</b> a bare phone for the camera</li></ul>
          </div>
        </div>
      </section>

      {/* 03 */}
      <section className="ip-sec ip-stage" id="s03">
        <div className="ip-head ip-r"><span className="n">03</span><h2>Films</h2><p>A headless browser plays the prototype on a fake clock, one sixtieth of a second at a time, and keeps every frame.</p></div>
        <div className="ip-flow ip-r"><span>Fake clock</span><i /><span>Step every animation</span><i /><span>Screenshot</span><i /><span>ffmpeg</span></div>
        <div className="ip-split">
          <Code lang="render.cjs">{`await ctx.clock.install({ time: 0 })
for (let f = 0; f < MAX * 60; f++) {
  await page.clock.runFor(1000 / 60)       // advance exactly one frame
  await page.evaluate(() => window.__sync()) // pin every Web Animation to it
  await page.screenshot({ path: frame(f) })
}`}</Code>
          <ul className="ip-facts ip-r"><li><b>5,547</b> frames in the features film</li><li><b>0</b> dropped frames, at any machine speed</li><li><b>3 s</b> re-rendered to change an intro, spliced into the rest</li></ul>
        </div>
      </section>

      {/* 04 */}
      <section className="ip-sec ip-stage ip-ink" id="s04">
        <div className="ip-head ip-r"><span className="n">04</span><h2>Light</h2><p>The chromatic light is a shader. Four lights on an arc, and each pixel takes the color of the one that owns it, so they never mix into mud.</p></div>
        <div className="ip-split">
          <Loop className="ip-r" src={`${R}loops/light-ink.mp4`} />
          <Code lang="GLSL">{`for (int i = 0; i < 4; i++) {
  float w  = exp(-dot(p - c[i], p - c[i]) / sig);
  float ws = w * w * w * w;     // sharpen: the strongest light wins
  acc += col[i] * ws; wsum += ws; I = max(I, w);
}
vec3 hue = acc / wsum;          // one hue per pixel, never an average`}</Code>
        </div>
      </section>

      {/* 05 */}
      <section className="ip-sec ip-stage ip-ink" id="s05">
        <div className="ip-head ip-r"><span className="n">05</span><h2>Shaders</h2><p>WebGPU components for real light and glass: the dot lit from behind by the four ISO lights, and a lens that magnifies what it passes over.</p></div>
        <div className="ip-pair ip-r"><Loop src={`${R}shader/orb-loop.mp4`} poster={`${R}shader/orb-loop.jpg`} /><Loop src={`${R}shader/glass-loop.mp4`} poster={`${R}shader/glass-loop.jpg`} /></div>
        <div className="ip-split">
          <Code lang="shaders/js">{`await createShader(canvas, { components: [{
  type: 'Irradiance', id: 'orb',
  props: { shape: sphere(0.3), lightHeight: -0.55,  // lights behind it
           lights: [ember, bloom, iris, tide] } }] },
  { toneMapping: 'linear' })   // agx lifts the ink to grey
shader.update('orb', { lights: orbit(t) })        // 12 s seamless loop`}</Code>
          <ul className="ip-facts ip-r"><li><b>~50×</b> faster on the real GPU than software rendering</li><li><b>0.07</b> refraction; any more and the lens flips the type</li></ul>
        </div>
      </section>

      {/* 06 */}
      <section className="ip-sec ip-stage" id="s06">
        <div className="ip-head ip-r"><span className="n">06</span><h2>Kit</h2><p>Every still and loop in the brand comes from one page. Each shot is a function of time, so a still is just one moment of its loop.</p></div>
        <div className="ip-grid ip-grid-s">{['clock-loop', 'flip-loop', 'held-loop', 'found-loop'].map(k => <Loop key={k} className="ip-r" src={`${R}loops/${k}.mp4`} poster={`${R}brand/${POSTER[k]}.webp`} />)}</div>
        <Code lang="kit.html">{`shot('clock-loop', { dur: 3.2, draw(t) {
  tiles.forEach((n, i) => show(n, xs[i], 530, t, .1 + i * .08))  // rise, hang, settle
  gl({ level: lerp(.35, .9, seg(t, 1.15, 1.6)) })                  // the light comes on
} })
// node render-kit.cjs clock-loop  →  2x PNG still + 60 fps MP4`}</Code>
      </section>

      <Foot next="brand" />
    </div>
  )
}
