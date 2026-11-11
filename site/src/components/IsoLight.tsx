// ISO, redesigned. The chromatic redesign as one continuous page.
//
// It used to be a deck of full-screen slides that played themselves. Now the
// sections sit one after another at their natural height, with room between
// them, and every piece fades in and rises a little as it scrolls into view
// (useFlow, shared with Harvard Pathways). A few sections keep one small
// scripted moment that starts once it is on screen: the inbox collapsing into
// one dot, and the market drawings settling into their numbers.
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
import shMemories from '../assets/iso-light/memories.webp'
import shSchedule from '../assets/iso-light/schedule.webp'
import figmaRow from '../assets/iso-light/figma-row.webp'
import figmaComps from '../assets/iso-light/figma-components.webp'
import oldHome from '../assets/iso-queue.webp'

const BASE = import.meta.env.BASE_URL
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

const LOOP = [
  { shot: shSearching, line: 'Find someone looks for a person who is online at the same moment. Rings of light spread from your photo while it looks.' },
  { shot: shMatch, line: 'You meet one person, with one question you will both answer.' },
  { shot: shRoom, line: 'You talk live. The ring above the message box shows whose turn it is, and it never ends the chat for you.' },
  { shot: shSealed, line: 'When either of you taps Ready to decide, you both answer Keep talking? in private.' },
  { shot: shMutual, line: 'Both answers show at the same moment. Green appears only here, when you both say yes.' },
]
export default function IsoLight() {
  const root = useRef<HTMLDivElement>(null)
  const [see, setSee] = useState<'watch' | 'try' | 'film'>('watch')
  useFlow(root)
  // the scale drawings play only once they reach the upper part of the screen, so the change is seen
  useEffect(() => {
    const els = [...(root.current?.querySelectorAll<HTMLElement>('[data-play]') ?? [])]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((n) => n.classList.add('go')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('go'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -40% 0px' })
    els.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
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
          <p className="il-boot" style={{ '--bi': 3 } as CSS}>A dating app where you talk to one person at a time.</p>
        </div>
        <div className="il-cover-phone il-boot" style={{ '--bi': 5 } as CSS}>
          <Phone src={shHome} style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
        </div>
      </section>

      {/* the inbox, collapsing into one */}
      <section className="il-sec il-inbox">
        <div className="il-wrap il-center il-stack">
          <Line>Most dating apps work like an inbox.</Line>
          <Line>You keep a dozen chats open, and most of them stop halfway.</Line>
          <div className="il-cloud" data-act>
            {BUBBLES.map((b, i) => {
              const ang = (i / BUBBLES.length) * Math.PI * 2 + 0.4
              const x = Math.cos(ang) * (38 + (i % 3) * 4), y = Math.sin(ang) * (40 + ((i * 7) % 4) * 4)
              return <div key={i} className={'il-bub' + (i % 3 === 1 ? ' me' : '')} style={{ '--x': x.toFixed(1), '--y': y.toFixed(1), '--i': i } as CSS}>{b}</div>
            })}
            <div className="il-one" />
          </div>
          <Line>ISO gives you one person at a time, live.</Line>
        </div>
      </section>

      {/* why now: the apps built like an inbox are shrinking. Each drawing shows the scale the sentence states */}
      <section className="il-sec">
        <div className="il-wrap il-stack">
          <Line>Those apps are losing people.</Line>
          <Row text={<Line>Bumble went public at $14B. In October 2026 it went private for $1.3B.</Line>}>
            {/* the ink square starts at $14B and shrinks to $1.3B by area */}
            <R d={0.2}><div className="il-scale" data-play><i><em>$1.3B</em></i><em className="was">$14B</em></div></R>
          </Row>
          <Row flip text={<Line>In one year, Bumble’s paying users fell from 3.8M to 3.2M.</Line>}>
            {/* one dot per hundred thousand paying users; six empty out */}
            <R d={0.2}><div className="il-dotsw" data-play><div className="il-dots">{Array.from({ length: 38 }, (_, i) => <span key={i} className={i >= 32 ? 'gone' : ''} style={{ '--i': i - 32 } as CSS} />)}</div><div className="il-dotn"><em>3.2M</em><em className="lost">−0.6M</em></div></div></R>
          </Row>
          <Line>At Match Group, paying users fell 6%, and Tinder’s monthly users fell 7%.</Line>
        </div>
      </section>

      {/* why now: the admission */}
      <section className="il-sec il-dark il-quote">
        <div className="il-glow" />
        <div className="il-wrap il-center">
          <Line>“We failed to recognize and respond to changes in the younger demographic, especially Gen Z and what they want.”</Line>
          <R d={0.5}><p className="il-quote-by">Spencer Rascoff, CEO of Match Group</p></R>
        </div>
      </section>

      {/* why now: the exception */}
      <section className="il-sec">
        <div className="il-wrap il-stack">
          <Row text={<Line>Hinge is the exception. It was built around intent instead of volume, and its revenue grew 22% last quarter.</Line>}>
            {/* the same quarter a year apart: the second bar rises by 22% */}
            <R d={0.2}><div className="il-grow" data-play><span /><span><b><em>+22%</em></b></span></div></R>
          </Row>
          <Line>Hinge’s founder decided the format itself was the problem. He left to build Overtone, an app with no swiping.</Line>
        </div>
      </section>

      {/* why now: ISO's answer */}
      <section className="il-sec il-dark il-answer">
        <div className="il-glow" />
        <div className="il-wrap il-center il-stack">
          <Line>ISO starts from the same conclusion.</Line>
          <Line>Until this conversation ends, there is nobody else to talk to, so the next step is to meet.</Line>
        </div>
      </section>

      {/* the redesign: orange everywhere, then color only where someone is live */}
      <section className="il-sec il-dark il-swap">
        <div className="il-wrap">
          <Row text={<Line>The first version of ISO was orange on every screen.</Line>}>
            <R d={0.2}><Phone src={oldHome} /></R>
          </Row>
        </div>
      </section>
      <section className="il-sec il-swap-new">
        <div className="il-glow" />
        <div className="il-wrap">
          <Row flip text={<Line>The redesign is white and black. Color only appears as light, like the glowing dot beside the number of people online.</Line>}>
            <R d={0.2}><Phone src={shHome} /></R>
          </Row>
        </div>
      </section>

      {/* the loop, one screen per step */}
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
          <Row text={<Line>While you are talking with Maya, the queue stays closed. It opens again when the conversation ends.</Line>}>
            <R d={0.2}><Phone src={shInconvo} /></R>
          </Row>
        </div>
      </section>

      {/* hold a moment, then Memories and the hours */}
      <section className="il-sec il-hold">
        <div className="il-wrap il-stack">
          {[
            { src: shSelect, line: 'ISO does not save your chats. To keep part of one, long-press a message and tap where the good part ends.' },
            { src: shFeel, line: 'Then pick the words for how it felt, and add a line for later if you want.' },
            { src: shMoment, line: 'The moment keeps their words and shows only their initial. If either of you blocks the other, it is deleted.' },
            { src: shMemories, line: 'Memories is private to you. It shows this week’s conversations and the moments you kept.' },
            { src: shSchedule, line: 'ISO opens at set hours, the same for everyone, so the people looking are online together.' },
          ].map((h, i) => (
            <Row key={i} flip={i % 2 === 1} text={<Line>{h.line}</Line>}>
              <R d={0.15}><Phone src={h.src} /></R>
            </Row>
          ))}
        </div>
      </section>

      {/* how it was made */}
      <section className="il-sec il-figma">
        <div className="il-wrap il-stack-s">
          <Line>I redesigned ISO over eight days in October 2026, with Claude assisting my workflow so I could prototype and iterate faster.</Line>
          <Line d={0.2}>I built all 64 screens in Figma using Figma MCP, on shared colors, type and components.</Line>
        </div>
        <R className="il-strip"><img src={figmaRow} alt="The core flow in Figma" /></R>
        <div className="il-wrap il-comps-wrap">
          <R className="il-comps"><img src={figmaComps} alt="The component library in Figma" /></R>
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
            {see === 'film' && 'A film of every feature, recorded from the prototype.'}
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
          <R d={0.2} className="il-links">
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
