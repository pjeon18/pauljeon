// ISO, redesigned. The chromatic redesign as one continuous page.
//
// It used to be a deck of full-screen slides that played themselves. Now the
// sections sit one after another at their natural height, with room between
// them, and every piece fades in and rises a little as it scrolls into view
// (useFlow, shared with Harvard Pathways). A few sections keep one small
// scripted moment that starts once it is on screen: the inbox collapsing into
// one dot, the turn ring draining, the countdown to 8, the review swaps.
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import { dl, useFlow } from './flow'
import '../styles/iso-light.css'

import mark from '../assets/iso-light/mark.svg'
import shHome from '../assets/iso-light/home.webp'
import shSearching from '../assets/iso-light/searching.webp'
import shMatch from '../assets/iso-light/match.webp'
import shRoom from '../assets/iso-light/room.webp'
import shSealed from '../assets/iso-light/sealed.webp'
import shMutual from '../assets/iso-light/mutual.webp'
import shInconvo from '../assets/iso-light/inconvo.webp'
import shSelect from '../assets/iso-light/select.webp'
import shFeel from '../assets/iso-light/feel.webp'
import shMoment from '../assets/iso-light/moment.webp'
import figmaRow from '../assets/iso-light/figma-row.webp'
import figmaComps from '../assets/iso-light/figma-components.webp'
import oldHome from '../assets/iso-queue.webp'

const BASE = import.meta.env.BASE_URL
const PAUL = `${BASE}iso-chromatic/assets/paul.jpg`
const MAYA = 'https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?w=320&h=320&fit=crop&crop=faces&q=80&auto=format'
const PROTO = `${BASE}iso-chromatic/index.html`
const FILM = `${BASE}films/iso-features.mp4`
const FILM_POSTER = `${BASE}films/iso-features.jpg`

type CSS = React.CSSProperties & Record<`--${string}`, string | number>

/** a big line whose words fade in and rise one after another once it is in view */
function Line({ children, className = '', d = 0 }: { children: string; className?: string; d?: number }) {
  return (
    <p className={'il-line il-words ' + className} data-r style={dl(d)}>
      {children.split(' ').map((w, i) => <span key={i} className="w" style={{ '--i': i } as CSS}>{w + ' '}</span>)}
    </p>
  )
}
/** a block that fades in and rises once it is in view */
function R({ d = 0, className = '', style, children }: { d?: number; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return <div className={className} data-r style={{ ...dl(d), ...style }}>{children}</div>
}
const Phone = ({ src, className = '', style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <div className={'il-phone ' + className} style={style}><img src={src} alt="" /></div>
)
/** words on one side, the picture on the other */
const Row = ({ flip, className = '', text, children }: { flip?: boolean; className?: string; text: React.ReactNode; children?: React.ReactNode }) => (
  <div className={`il-row ${flip ? 'flip' : ''} ${className}`}>
    <div className="il-row-text">{text}</div>
    <div className="il-row-vis">{children}</div>
  </div>
)

const BUBBLES = ['hey', 'haha', 'you up?', 'sorry, just saw this', 'so what do you do', 'lol', 'wyd', 'omg same', 'we should get coffee', 'hiii', 'how was your week', 'ok', 'whats your sign', 'brb', 'nice', 'sounds fun', 'hey stranger', 'u around?']
const RING = 2 * Math.PI * 104

const LOOP = [
  { shot: shHome, line: 'Home is the queue. One button, and a count of who is here.' },
  { shot: shSearching, line: 'ISO looks for someone who is online at the same moment.' },
  { shot: shMatch, line: 'You get one person and one question you will both answer.' },
  { shot: shRoom, line: 'In the live room, a slow ring shows whose turn it is.' },
  { shot: shSealed, line: 'Either of you can ask to keep talking. Your answer stays sealed.' },
  { shot: shMutual, line: 'Both answers flip at the same time. Green means you both said yes.' },
]
/** the countdown to 8, run once when the clock comes into view */
function LiveClock() {
  const ref = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState(8)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLeft(0); return }
    let t = 0
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return
      io.disconnect()
      const tick = () => setLeft((l) => { if (l > 1) t = window.setTimeout(tick, 420); return Math.max(0, l - 1) })
      t = window.setTimeout(tick, 700)
    }, { rootMargin: '0px 0px -20% 0px' })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  const on = left === 0
  return (
    <div className={'il-live-stage' + (on ? ' on' : '')} ref={ref}>
      <div className="il-live-rise" />
      <div className={'il-live-state' + (on ? ' on' : '')}><i /><span>{on ? 'Live now' : 'Opens tonight at 8'}</span></div>
      <div className="il-clock">{on ? <>8:00:<span>00</span></> : <>7:59:<span>{String(60 - left).padStart(2, '0')}</span></>}</div>
    </div>
  )
}

export default function IsoLight() {
  const root = useRef<HTMLDivElement>(null)
  const [see, setSee] = useState<'watch' | 'try' | 'film'>('watch')
  useFlow(root)
  useEffect(() => {
    document.title = 'ISO, redesigned · Paul Jeon'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="il" ref={root}>
      <header className="il-top">
        <BackToSite />
        <nav className="il-sub"><Link to="/work/iso-redesign/brand">Brand</Link><Link to="/work/iso-redesign/process">Process</Link></nav>
      </header>

      {/* cover */}
      <section className="il-sec il-cover">
        <div className="il-glow" />
        <img className="il-cover-mark" src={mark} alt="ISO" />
        <div className="il-cover-title">
          <h1 style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
            {'ISO, redesigned'.split(' ').map((w, i) => <span key={i} className="il-boot" style={{ '--bi': i } as CSS}>{w + ' '}</span>)}
          </h1>
          <p className="il-boot" style={{ '--bi': 3 } as CSS}>
            A dating app where you talk to one person at a time. I redesigned it over eight days in October 2026, with Claude in my workflow for faster prototyping and iteration.
          </p>
        </div>
        <div className="il-cover-phone il-boot" style={{ '--bi': 5 } as CSS}>
          <Phone src={shHome} style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
        </div>
      </section>

      {/* why now: the market */}
      <section className="il-sec">
        <div className="il-wrap il-stack">
          <Line className="il-kick">Why now</Line>
          <Row text={<Line>Bumble went private this week for $1.3B. Five years ago it IPO’d at $14B.</Line>}>
            <R d={0.2}><div className="il-fig"><span className="dim">$14B</span><span>$1.3B</span></div></R>
          </Row>
          <Row text={<Line>Paying users fell from about 3.8M to 3.2M in a year, and revenue has declined for nearly two.</Line>}>
            <R d={0.2}><div className="il-fig"><span className="dim">3.8M</span><span>3.2M</span></div></R>
          </Row>
          <Row text={<Line>Match Group is holding up better but still shrinking: 13.3M payers, down 6%, with Tinder’s monthly actives down 7%.</Line>}>
            <R d={0.2}><div className="il-fig"><span>−6%</span><small>Match Group payers</small><span>−7%</span><small>Tinder monthly actives</small></div></R>
          </Row>
          <Row text={<Line>Both now charge more per subscriber to cover the people leaving.</Line>}>
            <R d={0.2}><div className="il-fig"><span>More</span><small>per subscriber</small></div></R>
          </Row>
        </div>
      </section>

      {/* why now: the admission */}
      <section className="il-sec il-dark il-quote">
        <div className="il-glow" />
        <div className="il-wrap il-center">
          <Line>“We failed to recognize and respond to changes in the younger demographic, especially Gen Z and what they want.”</Line>
          <R d={0.5}><p className="il-quote-by">Spencer Rascoff, CEO, Match Group</p></R>
        </div>
      </section>

      {/* why now: the exception, and where everyone is heading */}
      <section className="il-sec">
        <div className="il-wrap il-stack">
          <Row text={<Line>Hinge is the exception. Revenue grew 22% last quarter to $203M.</Line>}>
            <R d={0.2}><div className="il-fig"><span className="up">+22%</span><small>Hinge revenue, $203M</small></div></R>
          </Row>
          <Row text={<Line>It was the one major app built around intent instead of volume, and it’s the one still growing.</Line>} />
          <Row text={<Line>The rest of the industry is moving the same direction. Tinder added an Events tab for meeting in person. Bumble is betting on group meetups and a replacement for the swipe.</Line>}>
            <R d={0.2}><div className="il-fig il-fig-list"><span>Events</span><span>Meetups</span><span className="dim">The swipe</span></div></R>
          </Row>
          <Row text={<Line>Hinge’s founder, Justin McLeod, recently left to build Overtone: no swiping.</Line>}>
            <R d={0.2}><div className="il-fig"><span>No swiping.</span><small>Overtone</small></div></R>
          </Row>
          <Row text={<Line>The person who built the app that works still decided the format was the problem.</Line>} />
        </div>
      </section>

      {/* why now: ISO's answer */}
      <section className="il-sec il-dark il-answer">
        <div className="il-glow" />
        <div className="il-wrap il-center il-stack">
          <Line>ISO started from the same conclusion. One conversation at a time, live, with someone on your campus who you’ll actually run into.</Line>
          <Line>Tinder and Bumble are adding commitment to feeds designed for abundance. Overtone makes the choice for you.</Line>
          <Line>ISO leaves the choice with you and removes the backup plan: there’s nobody else to talk to until this ends, so the obvious next step is to meet.</Line>
        </div>
      </section>

      {/* the inbox, collapsing into one */}
      <section className="il-sec il-inbox">
        <div className="il-wrap il-center il-stack">
          <Line>Most dating apps work like an inbox.</Line>
          <Line>You keep a dozen conversations open, and most of them stop halfway.</Line>
          <div className="il-cloud" data-act>
            {BUBBLES.map((b, i) => {
              const ang = (i / BUBBLES.length) * Math.PI * 2 + 0.4
              const x = Math.cos(ang) * (38 + (i % 3) * 4), y = Math.sin(ang) * (40 + ((i * 7) % 4) * 4)
              return <div key={i} className={'il-bub' + (i % 3 === 1 ? ' me' : '')} style={{ '--x': x.toFixed(1), '--y': y.toFixed(1), '--i': i } as CSS}>{b}</div>
            })}
            <div className="il-one" />
          </div>
          <Line>ISO lets you talk to one person at a time, live.</Line>
        </div>
      </section>

      {/* orange to light */}
      <section className="il-sec il-dark il-swap">
        <div className="il-wrap">
          <Row text={<><Line>The first version of ISO was orange.</Line><Line className="c2" d={0.3}>It worked, but every screen was loud.</Line></>}>
            <R d={0.2}><Phone src={oldHome} /></R>
          </Row>
        </div>
      </section>
      <section className="il-sec il-swap-new">
        <div className="il-glow" />
        <div className="il-wrap">
          <Row flip text={<><Line>The redesign starts from white and ink.</Line><Line className="c2" d={0.3}>Color only shows up where someone is live.</Line></>}>
            <R d={0.2}><Phone src={shHome} /></R>
          </Row>
        </div>
      </section>

      {/* the light: dot, ring, rings, green */}
      <section className="il-sec il-light">
        <div className="il-wrap il-light-grid">
          <div className="il-light-item">
            <R className="il-light-vis"><div className="il-pdot" /></R>
            <Line d={0.15}>The dot means a person is online right now.</Line>
          </div>
          <div className="il-light-item">
            <R className="il-light-vis">
              <div className="il-ring" data-act>
                <svg viewBox="0 0 230 230">
                  <defs><linearGradient id="ilg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset=".3" stopColor="#FF5BA8" /><stop offset=".55" stopColor="#B86BFF" /><stop offset=".8" stopColor="#5A9BFF" /><stop offset="1" stopColor="#3FDCD2" /></linearGradient></defs>
                  <circle cx="115" cy="115" r="104" fill="none" stroke="#E7E7EA" strokeWidth="7" />
                  <circle className="arc" cx="115" cy="115" r="104" fill="none" stroke="url(#ilg)" strokeWidth="7" strokeLinecap="round" strokeDasharray={String(RING)} style={{ '--drain': (RING * 0.7).toFixed(1) } as CSS} />
                </svg>
              </div>
            </R>
            <Line d={0.15}>The ring shows whose turn it is. It never turns red, and it never ends the chat for you.</Line>
          </div>
          <div className="il-light-item">
            <R className="il-light-vis">
              <div className="il-ripples"><div className="il-ripple" /><div className="il-ripple" /><div className="il-ripple" /><img className="av" src={PAUL} alt="" /></div>
            </R>
            <Line d={0.15}>While ISO looks for someone, rings spread out from your photo.</Line>
          </div>
          <div className="il-light-item">
            <R className="il-light-vis"><div className="il-pair"><img src={PAUL} alt="" /><img src={MAYA} alt="" /><span className="yes" /></div></R>
            <Line d={0.15}>Green shows up once, when you both say yes.</Line>
          </div>
        </div>
      </section>

      {/* figma */}
      <section className="il-sec il-figma">
        <div className="il-wrap"><Line>Every screen started in a Figma file.</Line></div>
        <R className="il-strip"><img src={figmaRow} alt="The core flow in Figma" /></R>
        <div className="il-wrap">
          <Row text={<Line>Built all 64 screens using Figma MCP, on shared colors, type and components.</Line>}>
            <R d={0.2} className="il-comps"><img src={figmaComps} alt="The component library in Figma" /></R>
          </Row>
        </div>
      </section>

      {/* the loop */}
      <section className="il-sec il-loop">
        <div className="il-wrap il-stack">
          {LOOP.map((s, i) => (
            <Row key={i} flip={i % 2 === 1} text={<Line>{s.line}</Line>}>
              <R d={0.15}><Phone src={s.shot} /></R>
            </Row>
          ))}
        </div>
      </section>

      {/* one at a time */}
      <section className="il-sec il-dark il-gate">
        <div className="il-wrap">
          <Row text={<Line>While you are talking with Maya, the queue stays closed. You can meet someone new after this conversation ends.</Line>}>
            <R d={0.2}><Phone src={shInconvo} /></R>
          </Row>
        </div>
      </section>

      {/* hold a moment */}
      <section className="il-sec il-hold">
        <div className="il-wrap il-stack">
          {[
            { src: shRoom, z: 1.05, oy: 0, line: 'ISO does not save your conversations.' },
            { src: shSelect, z: 1.45, oy: 16, line: 'Long-press a message, then tap where the good part ends.' },
            { src: shFeel, z: 1.3, oy: 14, line: 'Then pick a word for how it felt.' },
            { src: shMoment, z: 1.18, oy: 6, line: 'Their words stay and their name becomes an initial. If either of you blocks the other, the moment is deleted.' },
          ].map((h, i) => (
            <Row key={i} flip={i % 2 === 1} text={<Line>{h.line}</Line>}>
              <R d={0.15} className="lens"><img src={h.src} alt="" style={{ '--z': h.z, '--oy': `${-h.oy}%` } as CSS} /></R>
            </Row>
          ))}
        </div>
      </section>

      {/* memories */}
      <section className="il-sec il-mem">
        <div className="il-wrap">
          <Row text={<div className="il-stack-s"><Line>Memories keeps the conversations you had and the moments you chose to hold.</Line><Line d={0.4}>Big words in grey tiles. Nothing is color coded, and nobody gets a score.</Line></div>}>
            <div className="il-bento">
              {[
                { cls: 'full hl', fx: '-24px', fy: '-18px', fr: '-2deg', s: 'Tonight', b: 'What’s the last thing that made you laugh out loud?', e: 'M.  ·  14 min  ·  kept talking' },
                { cls: '', fx: '-30px', fy: '14px', fr: '2deg', s: 'This week', b: '4', xl: true, e: 'conversations' },
                { cls: '', fx: '30px', fy: '16px', fr: '-2deg', s: 'Mostly', b: 'Laughed.', e: 'How it’s felt' },
                { cls: 'full', fx: '18px', fy: '26px', fr: '1.5deg', s: 'Held  ·  9:02 PM', b: '“Honestly? My roommate trying to parallel park for eleven minutes.”', e: 'M.  ·  Laughed, butterflies' },
              ].map((t, i) => (
                <div key={i} className={'il-tile ' + t.cls} data-r style={{ '--fx': t.fx, '--fy': t.fy, '--fr': t.fr, '--dl': `${0.15 + i * 0.12}s` } as CSS}>
                  <small>{t.s}</small><b className={t.xl ? 'xl' : ''}>{t.b}</b><em>{t.e}</em>
                </div>
              ))}
            </div>
          </Row>
        </div>
      </section>

      {/* ISO Live */}
      <section className="il-sec il-live">
        <LiveClock />
        <div className="il-wrap il-center il-stack">
          <Line>ISO only opens at set hours.</Line>
          <Line>Everyone looking is looking at once, so the first match comes fast.</Line>
          <Line>Thursday Late runs until 2 am. Slow Sunday opens in the afternoon.</Line>
        </div>
      </section>

      {/* what changed in review */}
      <section className="il-sec il-rev">
        <div className="il-wrap il-stack">
          <Line>Four things changed after I reviewed them.</Line>
          <div className="il-rv il-rv-s" data-act>
            <Row text={<R><p className="il-line">I renamed <span className="il-strike">Journal</span> back to Memories.</p></R>}>
              <R d={0.2}>
                <div className="il-word">
                  <span className="old">Journal</span>
                  <span className="new">Memories</span>
                </div>
              </R>
            </Row>
          </div>
          <div className="il-rv il-rv-gh" data-act>
            <Row flip text={<Line>The gradient header was too strong, so it became one thin line of light.</Line>}>
              <R d={0.2}><div className="il-gheader"><div className="band" /><div className="ttl">Memories</div><div className="acc" /><div className="row" /><div className="row" /></div></R>
            </Row>
          </div>
          <div className="il-rv il-rv-gr" data-act>
            <Row text={<Line>A color for every feeling looked like a template, so feelings became big words in grey tiles.</Line>}>
              <R d={0.2}>
                <div className="il-cards2">
                  {[['#F5B83D', 'Laughed', '“The whole street clapped when she finally got it.”'], ['#FF5BA8', 'Seen', '“You don’t have to have it figured out.”'], ['#2FCFC4', 'Calm', '“Let’s just talk about sandwiches.”']].map(([c, f, q]) => (
                    <div key={f} className="cc" style={{ '--rail': c } as CSS}><small><span className="dt" />{f}</small><b>{q}</b></div>
                  ))}
                </div>
              </R>
            </Row>
          </div>
          <div className="il-rv il-rv-fz" data-act>
            <Row flip text={<Line>In the film, the phone frame fades out and the app fills the screen.</Line>}>
              <R d={0.2}><div className="il-frame-demo"><Phone src={shFeel} className="ph" /></div></R>
            </Row>
          </div>
        </div>
      </section>

      {/* how it was built */}
      <section className="il-sec il-dark il-made">
        <div className="il-wrap">
          <Line>Claude assisted my workflow, so I could prototype and iterate faster.</Line>
          <div className="il-made-list">
            {[
              ['Figma', 'Built all 64 screens, the color and type variables and the components using Figma MCP.'],
              ['Prototype', 'A coded prototype, with a tour that drives the real screens instead of a recording.'],
              ['Film', 'Rendered frame by frame from that prototype, with a camera that follows the finger.'],
              ['Direction', 'I set the direction, made the calls, and cut anything that read as template work.'],
            ].map(([k, v], i) => (
              <R key={k} d={0.1 + i * 0.12} className="il-made-row"><b>{k}</b><span>{v}</span></R>
            ))}
          </div>
        </div>
      </section>

      {/* see it */}
      <section className="il-sec il-see">
        <div className="il-glow" />
        <div className="il-wrap il-see-grid">
        <R className="il-see-copy">
          <p className="il-line">See it three ways.</p>
          <div className="il-tabs">
            <button className={see === 'watch' ? 'on' : ''} onClick={() => setSee('watch')}>Watch it</button>
            <button className={see === 'try' ? 'on' : ''} onClick={() => setSee('try')}>Try it</button>
            <button className={see === 'film' ? 'on' : ''} onClick={() => setSee('film')}>The film</button>
          </div>
          <p>
            {see === 'watch' && 'It plays itself. A finger types, taps and long-presses through the real screens, with a caption for each step.'}
            {see === 'try' && 'Nothing plays on its own. Type the email and code yourself and send your own messages. Maya answers from her script.'}
            {see === 'film' && 'A fast cut of every feature, filmed from the prototype. Partway through, the camera goes inside the app.'}
          </p>
          <div className="il-links">
            <a href={`${PROTO}?mode=${see === 'film' ? 'watch' : see}`} target="_blank" rel="noreferrer">Open it full screen ↗</a>
          </div>
        </R>
        <R d={0.2} className="il-see-vis">
        {see === 'film' ? (
          <div className="il-see-film"><video key="film" src={FILM} poster={FILM_POSTER} controls playsInline preload="metadata" /></div>
        ) : (
          <div className="il-see-frame"><div className="il-phone"><iframe key={see} src={`${PROTO}?embed&mode=${see}`} title="ISO prototype" /></div></div>
        )}
        </R>
        </div>
      </section>

      {/* outro */}
      <section className="il-sec il-out">
        <div className="il-glow" />
        <R><img className="il-out-mark" src={mark} alt="ISO" /></R>
        <div className="il-out-line">
          <Line>One conversation at a time.</Line>
          <R d={0.3} className="il-links">
            <Link to="/work/iso-redesign/brand">The brand</Link>
            <Link to="/work/iso-redesign/process">How it was made</Link>
            <a href={`${PROTO}?mode=watch`} target="_blank" rel="noreferrer">Watch the prototype ↗</a>
            <Link to="/" state={{ from: '/work/iso-redesign' }}>Back to all work</Link>
          </R>
        </div>
        <p className="il-credit">Maya’s portrait is from <a href="https://unsplash.com/photos/smiling-woman-at-wooden-table-Ll9YOG20UFI" target="_blank" rel="noreferrer">Unsplash</a>.</p>
      </section>
    </div>
  )
}
