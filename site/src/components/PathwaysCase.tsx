// Harvard Pathways, as one continuous page. Sections sit one after another at
// their natural height with room between them, and every piece fades in and
// rises a little as it scrolls into view (useFlow, shared with ISO, redesigned).
// A couple of sections keep one small moment that starts once it is on screen:
// the interview notes where the families light up, and the stamp card filling.
// Prefix pw-.
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import { dl, useFlow } from './flow'
import '../styles/pathways.css'

import shLanding from '../assets/pathways/landing.webp'
import shQ1 from '../assets/pathways/q1.webp'
import shResult from '../assets/pathways/result.webp'
import shDay from '../assets/pathways/day.webp'
import shStop from '../assets/pathways/stop.webp'
import shSketch from '../assets/pathways/s-model.webp'
import wireStrip from '../assets/pathways/wire-strip.webp'
import shWire from '../assets/pathways/w-you.webp'
import shMed from '../assets/pathways/m-you.webp'
import shTested from '../assets/pathways/a-you-cs.webp'
import shDayBefore from '../assets/pathways/a-day-art.webp'
import shDayAfter from '../assets/pathways/f-day-art.webp'
import shEmBefore from '../assets/pathways/a-emerson.webp'
import shEmAfter from '../assets/pathways/f-emerson.webp'
import shAstroMajor from '../assets/pathways/f-astro-major.webp'
import shPhil from '../assets/pathways/f-phil-you.webp'
import idCard from '../assets/pathways/idcard.webp'
import avatar from '../assets/pathways/avatar.webp'

const BASE = import.meta.env.BASE_URL
const FILM = `${BASE}films/pathways.mp4`
const FILM_POSTER = `${BASE}films/pathways.jpg`
const COURSE = 'CS79 at Harvard, Design of Useful and Usable Interactive Systems'
const FIGMA = 'https://www.figma.com/proto/I4cEOdyCjuai9axtngVx8G/Harvard-Pathways?node-id=213-112&starting-point-node-id=213-112'

type CSS = React.CSSProperties & Record<`--${string}`, string | number>

function Line({ children, className = '', d = 0 }: { children: string; className?: string; d?: number }) {
  return (
    <p className={'pw-line pw-words ' + className} data-r style={dl(d)}>
      {children.split(' ').map((w, i) => <span key={i} className="w" style={{ '--i': i } as CSS}>{w + ' '}</span>)}
    </p>
  )
}
function R({ d = 0, className = '', style, children }: { d?: number; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return <div className={className} data-r style={{ ...dl(d), ...style }}>{children}</div>
}
const Phone = ({ src, className = '', style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <div className={'pw-phone ' + className} style={style}><img src={src} alt="" /></div>
)
const Row = ({ flip, className = '', text, children }: { flip?: boolean; className?: string; text: React.ReactNode; children?: React.ReactNode }) => (
  <div className={`pw-row ${flip ? 'flip' : ''} ${className}`}>
    <div className="pw-row-text">{text}</div>
    <div className="pw-row-vis">{children}</div>
  </div>
)

/* ---------- content ---------- */
// lines from our Round 1 interview notes; fam = one of the three families with kids
const NOTES: [string, number, number, boolean?][] = [
  ['Where can we buy a Harvard sweater?', 14, 13],
  ['Were any movies shot here?', 50, 9],
  ['Which buildings are open, and when?', 83, 15],
  ['Hard to find where things are', 9, 31, true],
  ['Would like to know what each building is', 37, 21],
  ['Taking pictures to inspire their kids', 73, 30, true],
  ['Urban legends that are true', 12, 50],
  ['Only 30 minutes on campus', 88, 48],
  ['Visited the statue at 16. Came back to show their child', 20, 71, true],
  ['Which coffee shops should we try?', 82, 67],
  ['Where are the quiet spots for a small child?', 57, 79, true],
  ['A path like the Freedom Trail', 30, 89],
  ['Gilmore Girls and other pop culture', 76, 89],
]
const IDEAS = [
  { t: 'Trip recommender', d: 'Families post tips for each other and keep a photo album of the trip.' },
  { t: 'Scavenger hunt', d: 'Solve a riddle or photograph an object to unlock its story.' },
  { t: 'I Spy', d: 'Clues written the way a kid sees things, like a man on a chair.' },
  { t: 'Harvard Pathways', d: 'A quiz makes you a Harvard student. Then you walk their day.' },
]
const MAJORS: [string, string, string, string][] = [
  ['Art & Film', '#FFF0F3', '#E5173F', 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1a1.6 1.6 0 0 1 1.7-1.7h2c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2z'],
  ['Philosophy', '#2B2B30', '#FFFFFF', 'M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'],
  ['Astrophysics', '#FF8D28', '#FFFFFF', 'M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.6a1 1 0 0 0 .9 1.4h12.8a1 1 0 0 0 .9-1.4l-5.1-10.2a2 2 0 0 1-.2-.9V2M8.5 2h7M7 16h10'],
  ['Computer Science', '#FF2D55', '#FFFFFF', 'M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2'],
]
const PASSES = [
  { src: shSketch, k: 'Sketch' },
  { src: shWire, k: 'Wireframe' },
  { src: shMed, k: 'Medium-fi' },
  { src: shTested, k: 'Hi-fi, tested' },
]
const CHANGES = [
  { before: shTested, after: shResult, line: 'A middle schooler who expected math was shocked to get a Computer Science student. Now every profile says why you got it, and shows where your classes meet.' },
  { before: shDayBefore, after: shDayAfter, line: 'A returning visitor had already seen the John Harvard statue and could not skip it. Now every stop can be skipped and added back.' },
  { before: shEmBefore, after: shEmAfter, line: 'The fact at Emerson Hall gave away the answer to its own task. Now the answer waits behind a button.' },
]
const LOOP = [
  { shot: shQ1, line: 'Five questions, one per screen. Go back and change an answer without starting over.' },
  { shot: shPhil, line: 'The first answer picks the student. Reading and debating makes you a first-year in Hollis Hall.' },
  { shot: shAstroMajor, line: 'Every major shows how common it is, from Harvard’s 2024 graduation numbers.' },
  { shot: shDay, line: 'Your Day shows the route, the time left, and which stops are must-see.' },
  { shot: shStop, line: 'Each stop says what you do there, gives you something to try, and one fact.' },
]
const STAMPS = ['Statue', 'Science Center', 'Memorial Hall', 'Smith Center', 'Kirkland', 'SEC']
const STOPS = ['John Harvard Statue', 'Science Center', 'Memorial Hall', 'Smith Campus Center', 'Kirkland House', 'Science and Engineering Complex']
const ROT = [-8, 6, -4, 9, -6, 5]

const CHECK = <svg viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>

/** the stamp card fills one stop at a time once it comes into view */
function StampCard() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(6); return }
    let t = 0
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return
      io.disconnect()
      const step = () => setCount((c) => { if (c < 5) t = window.setTimeout(step, 650); return Math.min(6, c + 1) })
      t = window.setTimeout(step, 900)
    }, { rootMargin: '0px 0px -20% 0px' })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  return (
    <div className="pw-scard-wrap" ref={ref}>
      <p className="pw-sh">{STOPS[count - 1]}</p>
      <div className="pw-scard">
        <small>STAMP CARD</small>
        {STAMPS.map((l, j) => (
          <div key={l} className={'pw-slot' + (j < count ? ' on' : '')} style={{ left: 22 + (j % 3) * 128, top: 54 + Math.floor(j / 3) * 150, '--r': `${ROT[j]}deg` } as CSS}>
            <div className="em">{j + 1}</div><div className="st">{CHECK}</div><span>{l}</span>
          </div>
        ))}
      </div>
      <p className="pw-sp">{count} of 6 stops stamped</p>
    </div>
  )
}

export default function PathwaysCase() {
  const root = useRef<HTMLDivElement>(null)
  useFlow(root)
  useEffect(() => { document.title = 'Harvard Pathways · Paul Jeon'; window.scrollTo(0, 0) }, [])

  return (
    <div className="pw" ref={root}>
      <header className="pw-top">
        <BackToSite />
      </header>

      {/* cover */}
      <section className="pw-sec pw-cover">
        <div className="pw-blush" />
        <div className="pw-wrap pw-row">
          <div className="pw-cover-text">
            <h1 style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
              {['Harvard', 'Pathways'].map((w, i) => <span key={w} className="pw-boot" style={{ '--bi': i } as CSS}>{w}</span>)}
            </h1>
            <p>A five-question quiz turns a kid into a specific Harvard student. Then the family walks that student’s day on campus.</p>
            <p className="pw-meta">{COURSE}. Fall 2026, team of three.</p>
          </div>
          <div className="pw-cover-phone"><Phone src={shLanding} className="pw-float" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} /></div>
        </div>
      </section>

      {/* research */}
      <section className="pw-sec pw-notes-sec">
        <div className="pw-wrap pw-center pw-stack">
          <Line>We interviewed 10 groups of visitors in Harvard Yard.</Line>
          <div className="pw-notes" data-act>
            {NOTES.map(([t, x, y, fam], i) => (
              <div key={i} className={'pw-note' + (fam ? ' fam' : '')} style={{ left: `${x}%`, top: `${y}%`, '--i': i } as CSS}>{t}</div>
            ))}
          </div>
          <Line>Three were families visiting with their kids.</Line>
          <Line>The parents wanted to pass on the feel of the place. Most had been once, years ago, or never.</Line>
          <Line>And telling a kid they could go here someday meant very little.</Line>
        </div>
      </section>

      {/* the problem */}
      <section className="pw-sec pw-dark">
        <div className="pw-wrap pw-problem">
          <Line>How can we empower parents of young children who have no connection to Harvard to become personalized tour guides for their children on campus?</Line>
        </div>
      </section>

      {/* four ideas to one */}
      <section className="pw-sec">
        <div className="pw-wrap pw-stack">
          <Line>We prototyped four ideas.</Line>
          <div className="pw-ideas">
            {IDEAS.map((c, i) => (
              <R key={c.t} d={0.1 + i * 0.12} className={'pw-idea' + (c.t === 'Harvard Pathways' ? ' keep' : '')}><b>{c.t}</b><span>{c.d}</span></R>
            ))}
          </div>
          <Row text={<Line>Then we combined them into one app, with stamps and points, and tested it with families.</Line>}>
            <R d={0.2}><div className="pw-oneapp">One app · stamps · points</div></R>
          </Row>
          <Line>It tried to do everything. We kept Harvard Pathways, because it gave older kids a reason to care about each building.</Line>
        </div>
      </section>

      {/* the bet */}
      <section className="pw-sec">
        <div className="pw-wrap pw-stack">
          <Line>A five-question quiz picks one of four Harvard students for the kid to become.</Line>
          <div className="pw-majors">
            {MAJORS.map(([t, bg, fg, d], i) => (
              <R key={t} d={0.1 + i * 0.12} className="pw-major" style={{ background: bg, color: fg }}>
                <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg></i>
                <b>{t}</b>
              </R>
            ))}
          </div>
        </div>
      </section>
      <section className="pw-sec pw-pink">
        <div className="pw-wrap">
          <Row text={<div className="pw-stack-s"><Line>We bet that families would follow a route more willingly if it came from the kid’s own answers.</Line><Line d={0.3}>And that a kid who is the student stays longer at a building where they have class.</Line></div>}>
            <R d={0.2} className="pw-reveal">
              <img className="pw-av" src={avatar} alt="" />
              <p className="pw-ya">YOU ARE A</p>
              <p className="pw-yh">Junior studying Computer Science</p>
            </R>
          </Row>
        </div>
      </section>

      {/* sketch to hi-fi */}
      <section className="pw-sec pw-passes-sec">
        <div className="pw-wrap"><Line>We wireframed the whole flow in Figma first, from the quiz to the end of the day.</Line></div>
        <R className="pw-strip"><img src={wireStrip} alt="The Harvard Pathways wireframe flow in Figma" /></R>
        <div className="pw-wrap pw-stack">
          <Line>Then the same screen, through four passes.</Line>
          <div className="pw-passes">
            {PASSES.map((s, i) => (
              <R key={s.k} d={0.1 + i * 0.12} className="pw-pass">
                <Phone src={s.src} className="pw-float" style={{ animationDelay: `${-i * 1.3}s` } as React.CSSProperties} />
                <span>{s.k}</span>
              </R>
            ))}
          </div>
          <Line>We tested medium-fi with three families. A teen understood it right away. A younger kid struggled with the words and ignored the map.</Line>
          <Line>So we narrowed it to kids from 10 to 17.</Line>
          <Line>For hi-fi, I built one student’s flow by hand in Figma. Claude, through the Figma MCP, built the other three on the same variables.</Line>
        </div>
      </section>

      {/* what testing changed */}
      <section className="pw-sec pw-tint">
        <div className="pw-wrap pw-stack">
          <Line>Then four usability tests, each with a visitor role to play.</Line>
          {CHANGES.map((c, i) => (
            <Row key={i} flip={i % 2 === 1} text={<Line>{c.line}</Line>}>
              <div className="pw-pair">
                <R d={0.15} className="pw-pair-col before"><Phone src={c.before} /><span>Tested</span></R>
                <R d={0.4} className="pw-pair-col"><Phone src={c.after} /><span>Changed</span></R>
              </div>
            </Row>
          ))}
          <Line>Career outcomes by major and a leaderboard can wait. The career data needs a real source first.</Line>
        </div>
      </section>

      {/* the final flow */}
      <section className="pw-sec">
        <div className="pw-wrap pw-stack">
          {LOOP.map((s, i) => (
            <Row key={i} flip={i % 2 === 1} text={<Line>{s.line}</Line>}>
              <R d={0.15}><Phone src={s.shot} /></R>
            </Row>
          ))}
        </div>
      </section>

      {/* rewarding the walk */}
      <section className="pw-sec pw-tint">
        <div className="pw-wrap pw-stack">
          <Row text={<div className="pw-stack-s"><Line>For the final demo, every check-in stamps a card.</Line><Line d={0.3}>Six stops, six stamps.</Line></div>}>
            <R d={0.2}><StampCard /></R>
          </Row>
          <Row flip text={<Line>Then the day ends on a student ID with your year, major, House and stamps.</Line>}>
            <R d={0.2}><img className="pw-id" src={idCard} alt="The Harvard Pathways student ID at the end of the day" /></R>
          </Row>
        </div>
      </section>

      {/* learned, and the film */}
      <section className="pw-sec pw-dark pw-end">
        <div className="pw-wrap pw-center pw-stack">
          <Line className="pw-kick">What we learned</Line>
          <Line>A result only feels chosen when the kid can see why they got it.</Line>
          <Line>Real photos matter in a product about finding real places. Every building photo here is a real, credited one.</Line>
          <R className="pw-film">
            <video src={FILM} poster={FILM_POSTER} controls playsInline preload="metadata" />
            <div className="pw-links">
              <a href={FIGMA} target="_blank" rel="noreferrer">Open the Figma prototype ↗</a>
              <Link to="/" state={{ from: '/work/harvard-pathways' }}>Back to all work</Link>
            </div>
            <p className="pw-credit">With Carolyn Dorantes and Kim Cortes-Martinez. Building photos from Wikimedia Commons.</p>
          </R>
        </div>
      </section>
    </div>
  )
}
