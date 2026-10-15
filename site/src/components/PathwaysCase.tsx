// Harvard Pathways, as a deck you scroll. Same engine as ISO, redesigned (IsoLight.tsx):
// each slide is a sticky stage, pieces arrive on windows of the slide's progress (--t in,
// --u out), and a few slides add scripted motion in FX. Prefix pw-.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
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

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3)
const easeIn = (k: number) => k * k * k
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const backOut = (k: number) => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2)
const win = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

function W({ a, b, c, d, cls = 'pw-in', style, children }: { a: number; b: number; c?: number; d?: number; cls?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return <div className={cls} data-a={a} data-b={b} data-c={c} data-d={d} style={style}>{children}</div>
}
function Line({ a, b, c, d, children, className = '' }: { a: number; b: number; c?: number; d?: number; children: string; className?: string }) {
  return (
    <p className={'pw-line pw-words ' + className} data-a={a} data-b={b} data-c={c} data-d={d}>
      {children.split(' ').map((w, i) => <span key={i} className="w">{w + ' '}</span>)}
    </p>
  )
}
const Phone = ({ src, className = '', style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <div className={'pw-phone ' + className} style={style}><img src={src} alt="" /></div>
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
const SLAM = [-1, 0.12, 0.44, 0.48, 0.52, 0.56]
const ROT = [-8, 6, -4, 9, -6, 5]
const SLIDES = 10

/* ---------- scripted motion ---------- */
type Fx = (p: number, el: HTMLElement) => void
const FX: Record<string, Fx> = {
  cover(p, el) {
    el.style.setProperty('--k', easeInOut(win(p, 0, 0.7)).toFixed(4))
  },
  notes(p, el) {
    const lit = easeInOut(win(p, 0.3, 0.38))
    el.querySelectorAll<HTMLElement>('.pw-note').forEach((n, i) => {
      const t = easeOut(win(p, 0.02 + i * 0.012, 0.1 + i * 0.012))
      const fam = n.classList.contains('fam')
      n.style.opacity = (t * (fam ? 1 : 1 - lit * 0.75)).toFixed(3)
      n.style.setProperty('--lit', fam ? lit.toFixed(3) : '0')
      const tm = performance.now() / 1000
      const dx = Math.sin(tm * 0.5 + i * 1.7) * 6, dy = Math.cos(tm * 0.6 + i * 2.3) * 5
      n.style.transform = `translate(calc(-50% + ${dx.toFixed(2)}px), calc(-50% + ${((1 - t) * 18 + dy).toFixed(2)}px))`
    })
  },
  ideas(p, el) {
    const spread = easeOut(win(p, 0.02, 0.14))
    const merge = easeInOut(win(p, 0.36, 0.5))
    const pick = easeInOut(win(p, 0.68, 0.8))
    const narrow = window.innerWidth < 860
    el.querySelectorAll<HTMLElement>('.pw-idea').forEach((c, i) => {
      const keep = i === 3
      const col = (i - 1.5) * 1
      // on phones the four cards fan like a hand of cards instead of a row
      const x = col * (narrow ? 13 : 12) * (1 - merge)
      const bob = Math.sin(performance.now() / 1000 * 0.9 + i * 1.4) * 0.5 * (1 - merge)
      const y = (1 - spread) * 8 + (keep ? 0 : pick * 30) + bob
      const rot = (narrow ? col * 7 * (1 - merge) : 0) + merge * (i - 1.5) * 4 * (1 - (keep ? pick : 0))
      const s = 1 - merge * 0.04 + (keep ? pick * 0.12 : 0)
      c.style.transform = `translate(calc(-50% + ${x.toFixed(2)}vw), calc(-50% + ${y.toFixed(2)}vh)) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`
      c.style.opacity = (spread * (keep ? 1 : 1 - pick)).toFixed(3)
      c.style.zIndex = String(keep ? 5 : i)
    })
    el.style.setProperty('--merge', (merge * (1 - pick)).toFixed(4))
  },
  bet(p, el) {
    const fan = [[-1.35, -12], [-0.45, -4], [0.45, 4], [1.35, 12]]
    const a = easeOut(win(p, 0.03, 0.1)) - easeInOut(win(p, 0.11, 0.17))
    const b = easeOut(win(p, 0.17, 0.24)) - easeInOut(win(p, 0.25, 0.31))
    const lose = easeInOut(win(p, 0.31, 0.35))
    el.querySelectorAll<HTMLElement>('.pw-major').forEach((c, i) => {
      const [dx, r] = fan[i], [dx2, r2] = fan[3 - i]
      const win_ = i === 3
      const x = (dx * a + dx2 * b) * 9
      const rot = r * a + r2 * b
      const s = win_ ? 1 + lose * 0.12 : 1 - lose * 0.25
      c.style.transform = `translate(calc(-50% + ${x.toFixed(2)}vw), -50%) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`
      c.style.opacity = (win_ ? 1 - easeInOut(win(p, 0.42, 0.47)) : 1 - lose).toFixed(3)
    })
    const ir = easeInOut(win(p, 0.36, 0.46))
    el.style.setProperty('--ir', ir.toFixed(4))
    const pop = win(p, 0.45, 0.53)
    el.style.setProperty('--pop', (pop <= 0 ? 0.3 : 0.3 + 0.7 * backOut(pop)).toFixed(4))
    el.style.setProperty('--pa', clamp(pop * 5).toFixed(3))
    // confetti burst on the pop
    const k = win(p, 0.46, 0.62)
    el.querySelectorAll<HTMLElement>('.pw-conf').forEach((c, i) => {
      const ang = -Math.PI * (0.06 + 0.88 * ((i * 37) % 100) / 100), r = 170 + ((i * 53) % 150)
      const o = easeOut(clamp(k / 0.5))
      c.style.transform = `translate(${(Math.cos(ang) * r * 1.3 * o).toFixed(1)}px, ${(Math.sin(ang) * r * o + 140 * k * k).toFixed(1)}px) rotate(${(k * (i % 2 ? 300 : -300)).toFixed(0)}deg)`
      c.style.opacity = (k <= 0 || k >= 1 ? 0 : k < 0.7 ? 1 : (1 - k) / 0.3).toFixed(3)
    })
  },
  passes(p, el) {
    // the wireframe flow pans by on the Figma canvas, then gives way to the four passes
    const pan = el.querySelector<HTMLElement>('.pw-pan')
    if (pan) {
      const w = pan.scrollWidth, vw = window.innerWidth
      const k = easeInOut(win(p, 0.02, 0.28))
      pan.style.transform = `translateX(${(vw * 0.06 - k * (w - vw * 0.9)).toFixed(1)}px)`
      pan.style.opacity = (easeOut(win(p, 0, 0.04)) * (1 - win(p, 0.26, 0.31))).toFixed(3)
    }
    el.style.setProperty('--wire', (1 - easeInOut(win(p, 0.27, 0.33))).toFixed(4))
  },
  loop(p, el) {
    const n = LOOP.length, k = Math.min(n - 1, Math.floor(p * n))
    el.querySelectorAll('.pw-steps i').forEach((d, i) => d.classList.toggle('on', i === k))
    // the phone turns a little toward each new screen, then settles
    const local = p * n - k, settle = easeOut(clamp(local / 0.3))
    const from = k % 2 ? -7 : 7, to = k % 2 ? 7 : -7
    el.style.setProperty('--ry', `${(from + (to - from) * settle).toFixed(2)}deg`)
  },
  stamp(p, el) {
    let cur = 1, count = 1
    el.querySelectorAll<HTMLElement>('.pw-slot').forEach((s, j) => {
      const st = s.querySelector<HTMLElement>('.st')!, rg = s.querySelector<HTMLElement>('.rg')!
      if (j === 0) { st.style.opacity = '1'; st.style.transform = `rotate(${ROT[0]}deg)`; return }
      const hero = j === 1, d = hero ? 0.05 : 0.02, k = p - SLAM[j]
      if (k < 0) { st.style.opacity = '0'; rg.style.opacity = '0'; return }
      cur = j; count++
      const sc = k < d ? 2.8 - 1.9 * easeIn(k / d) : 0.9 + 0.1 * easeOut(clamp((k - d) / 0.02))
      st.style.opacity = clamp(k / 0.006).toFixed(3)
      st.style.transform = `scale(${sc.toFixed(4)}) rotate(${ROT[j]}deg)`
      const rk = clamp((k - d) / (hero ? 0.08 : 0.05))
      rg.style.opacity = (rk > 0 && rk < 1 ? (1 - rk) * 0.7 : 0).toFixed(3)
      rg.style.transform = `scale(${(1 + rk * 0.8).toFixed(3)})`
    })
    const h = el.querySelector('.pw-sh'), pr = el.querySelector('.pw-sp')
    if (h) h.textContent = STOPS[cur]
    if (pr) pr.textContent = `${count} of 6 stops stamped`
    let shake = 0
    SLAM.forEach((s, j) => { if (j === 0) return; const k = p - s - (j === 1 ? 0.05 : 0.02); if (k > 0 && k < 0.03) shake += Math.sin(k * 500) * (1 - k / 0.03) * (j === 1 ? 7 : 3) })
    el.style.setProperty('--shake', `${shake.toFixed(2)}px`)
    const full = win(p, 0.58, 0.62)
    el.style.setProperty('--full', Math.sin(full * Math.PI).toFixed(4))
    const id = win(p, 0.7, 0.82)
    el.style.setProperty('--id', id <= 0 ? '0' : backOut(id).toFixed(4))
    el.style.setProperty('--cardout', easeInOut(win(p, 0.66, 0.74)).toFixed(4))
  },
}

/* ---------- the deck engine (same as ISO, redesigned) ---------- */
function useDeck(root: React.RefObject<HTMLDivElement>, onSlide: (i: number) => void) {
  useLayoutEffect(() => {
    const el = root.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const slides = [...el.querySelectorAll<HTMLElement>('.pw-slide')]
    el.querySelectorAll<HTMLElement>('.pw-words').forEach((line) => {
      const a = Number(line.dataset.a), b = Number(line.dataset.b), ws = line.querySelectorAll<HTMLElement>('.w'), n = ws.length
      ws.forEach((w, i) => {
        const span = (b - a) * 0.55
        w.dataset.a = String(a + ((b - a - span) * i) / Math.max(1, n - 1))
        w.dataset.b = String(Number(w.dataset.a) + span)
        if (line.dataset.c) { w.dataset.c = line.dataset.c; w.dataset.d = line.dataset.d }
      })
    })
    const pieces = slides.map((s) => [...s.querySelectorAll<HTMLElement>('[data-a]:not(.pw-words)')])
    let tops: number[] = [], lens: number[] = [], vh = window.innerHeight
    const measure = () => {
      vh = window.innerHeight
      tops = slides.map((s) => s.getBoundingClientRect().top + window.scrollY)
      lens = slides.map((s) => Number(s.dataset.len))
    }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    window.addEventListener('resize', measure)
    let y = window.scrollY, last = performance.now(), raf = 0, cur = -1
    const set = (n: HTMLElement, k: string, v: number) => { const s = v.toFixed(4); if (n.style.getPropertyValue(k) !== s) n.style.setProperty(k, s) }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const target = window.scrollY
      y = reduce ? target : y + (target - y) * (1 - Math.exp(-dt * 11))
      if (Math.abs(target - y) < 0.1) y = target
      const docH = document.documentElement.scrollHeight
      el.style.setProperty('--prog', clamp(y / Math.max(1, docH - vh)).toFixed(4))
      let active = 0
      slides.forEach((s, i) => {
        const top = tops[i], len = lens[i]
        // progress runs out just as the next slide starts to rise, so every beat is seen whole
        const p = clamp((y - top) / (Math.max(0.3, len - 1) * vh))
        const e = i === 0 ? 1 : clamp(1 - (top - y) / vh)
        const next = tops[i + 1]
        const c = next == null ? 0 : clamp(1 - (next - y) / vh)
        set(s, '--p', p); set(s, '--e', easeOut(e)); set(s, '--c', c)
        if (y + vh * 0.5 >= top) active = i
        if (e <= 0 || c >= 1) return
        pieces[i].forEach((n) => {
          set(n, '--t', easeOut(win(p, Number(n.dataset.a), Number(n.dataset.b))))
          if (n.dataset.c) set(n, '--u', easeInOut(win(p, Number(n.dataset.c), Number(n.dataset.d))))
        })
        FX[s.dataset.fx || '']?.(p, s)
      })
      if (active !== cur) { cur = active; onSlide(active); el.classList.toggle('on-dark', slides[active].classList.contains('pw-dark')) }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
}

const S = ({ id, len, fx, dark, className = '', children }: { id: string; len: number; fx?: string; dark?: boolean; className?: string; children: React.ReactNode }) => (
  <section className={`pw-slide pw-s-${id} ${dark ? 'pw-dark' : ''} ${className}`} data-len={len} data-fx={fx} style={{ height: `${(len + 1) * 100}vh` }}>
    <div className="pw-stage">{children}</div>
  </section>
)
const CHECK = <svg viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>

export default function PathwaysCase() {
  const root = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  useDeck(root, setSlide)
  useEffect(() => { document.title = 'Harvard Pathways · Paul Jeon'; window.scrollTo(0, 0) }, [])
  const goTo = (i: number) => {
    const s = root.current?.querySelectorAll<HTMLElement>('.pw-slide')[i]
    if (s) window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY + 2, behavior: 'smooth' })
  }
  const n = CHANGES.length

  return (
    <div className="pw" ref={root}>
      <div className="pw-progress" />
      <header className="pw-top">
        <BackToSite />
        <span className="pw-count">{String(slide + 1).padStart(2, '0')} / {SLIDES}</span>
      </header>
      <nav className="pw-dots" aria-label="Slides">
        {Array.from({ length: SLIDES }, (_, i) => (
          <button key={i} className={i === slide ? 'on' : ''} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}><i /></button>
        ))}
      </nav>

      {/* 01 cover */}
      <S id="cover" len={1.6} fx="cover">
        <div className="pw-blush" />
        <div className="pw-cover-text">
          <h1 style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
            {['Harvard', 'Pathways'].map((w, i) => <span key={w} className="pw-boot" style={{ '--bi': i } as React.CSSProperties}>{w}</span>)}
          </h1>
          <p>A five-question quiz turns a kid into a specific Harvard student. Then the family walks that student’s day on campus.</p>
          <p className="pw-meta">{COURSE}. Fall 2026, team of three.</p>
        </div>
        <div className="pw-cover-phone"><Phone src={shLanding} className="pw-float" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} /></div>
      </S>

      {/* 02 research */}
      <S id="notes" len={3.4} fx="notes">
        {NOTES.map(([t, x, y, fam], i) => (
          <div key={i} className={'pw-note' + (fam ? ' fam' : '')} style={{ left: `${x}%`, top: `${y}%` }}>{t}</div>
        ))}
        <div className="pw-beat"><Line a={0.03} b={0.12} c={0.27} d={0.31}>We interviewed 10 groups of visitors in Harvard Yard.</Line></div>
        <div className="pw-beat"><Line a={0.33} b={0.42} c={0.55} d={0.59}>Three were families visiting with their kids.</Line></div>
        <div className="pw-beat"><Line a={0.61} b={0.7} c={0.8} d={0.84}>The parents wanted to pass on the feel of the place. Most had been once, years ago, or never.</Line></div>
        <div className="pw-beat"><Line a={0.86} b={0.95}>And telling a kid they could go here someday meant very little.</Line></div>
      </S>

      {/* 03 the problem */}
      <S id="problem" len={2} dark>
        <div className="pw-problem">
          <p className="pw-line pw-words pw-light-words" data-a={0.06} data-b={0.6}>
            {'How can we empower parents of young children who have no connection to Harvard to become personalized tour guides for their children on campus?'.split(' ').map((w, i) => <span key={i} className="w">{w + ' '}</span>)}
          </p>
        </div>
      </S>

      {/* 04 four ideas to one */}
      <S id="ideas" len={3.4} fx="ideas">
        <div className="pw-ideas-text">
          <div className="pw-beatb"><Line a={0.02} b={0.1} c={0.28} d={0.32}>We prototyped four ideas.</Line></div>
          <div className="pw-beatb"><Line a={0.36} b={0.45} c={0.6} d={0.64}>Then we combined them into one app, with stamps and points, and tested it with families.</Line></div>
          <div className="pw-beatb"><Line a={0.68} b={0.78}>It tried to do everything. We kept Harvard Pathways, because it gave older kids a reason to care about each building.</Line></div>
        </div>
        <div className="pw-ideas">
          <div className="pw-oneapp">One app · stamps · points</div>
          {IDEAS.map((c) => (
            <div key={c.t} className={'pw-idea' + (c.t === 'Harvard Pathways' ? ' keep' : '')}><b>{c.t}</b><span>{c.d}</span></div>
          ))}
        </div>
      </S>

      {/* 05 the bet */}
      <S id="bet" len={3.8} fx="bet">
        <div className="pw-iris" />
        <div className="pw-bet-text">
          <div className="pw-beatb"><Line a={0.02} b={0.1} c={0.28} d={0.33}>A five-question quiz picks one of four Harvard students for the kid to become.</Line></div>
          <div className="pw-beatb on-pink"><Line a={0.55} b={0.63} c={0.74} d={0.78}>We bet that families would follow a route more willingly if it came from the kid’s own answers.</Line></div>
          <div className="pw-beatb on-pink"><Line a={0.8} b={0.88}>And that a kid who is the student stays longer at a building where they have class.</Line></div>
        </div>
        <div className="pw-bet-stage">
          {MAJORS.map(([t, bg, fg, d]) => (
            <div key={t} className="pw-major" style={{ background: bg, color: fg }}>
              <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg></i>
              <b>{t}</b>
            </div>
          ))}
          <div className="pw-reveal">
            {Array.from({ length: 30 }, (_, i) => <span key={i} className="pw-conf" style={{ background: ['#fff', '#FFD15C', '#FF8D28', '#FFC4CF', '#46ACFF'][i % 5] }} />)}
            <img className="pw-av" src={avatar} alt="" />
            <p className="pw-ya">YOU ARE A</p>
            <p className="pw-yh">Junior studying Computer Science</p>
          </div>
        </div>
      </S>

      {/* 06 sketch to hi-fi */}
      <S id="passes" len={4.6} fx="passes">
        <div className="pw-wire-text"><Line a={0.02} b={0.09} c={0.25} d={0.29}>We wireframed the whole flow in Figma first, from the quiz to the end of the day.</Line></div>
        <div className="pw-pan"><img src={wireStrip} alt="The Harvard Pathways wireframe flow in Figma" /></div>
        <div className="pw-passes-text">
          <div className="pw-beatb"><Line a={0.32} b={0.39} c={0.48} d={0.51}>Then the same screen, through four passes.</Line></div>
          <div className="pw-beatb"><Line a={0.53} b={0.6} c={0.68} d={0.71}>We tested medium-fi with three families. A teen understood it right away. A younger kid struggled with the words and ignored the map.</Line></div>
          <div className="pw-beatb"><Line a={0.73} b={0.79} c={0.84} d={0.87}>So we narrowed it to kids from 10 to 17.</Line></div>
          <div className="pw-beatb"><Line a={0.88} b={0.95}>For hi-fi, I built one student’s flow by hand in Figma. Claude, through the Figma MCP, built the other three on the same variables.</Line></div>
        </div>
        <div className="pw-passes">
          {PASSES.map((s, i) => (
            <W key={s.k} a={0.32 + i * 0.04} b={0.4 + i * 0.04} cls="pw-in pw-pass">
              <Phone src={s.src} className="pw-float" style={{ animationDelay: `${-i * 1.3}s` } as React.CSSProperties} />
              <span>{s.k}</span>
            </W>
          ))}
        </div>
      </S>

      {/* 07 what testing changed */}
      <S id="changes" len={4.8}>
        <div className="pw-changes-text">
          <div className="pw-beatb"><Line a={0.02} b={0.08} c={0.16} d={0.19}>Then four usability tests, each with a visitor role to play.</Line></div>
          {CHANGES.map((c, i) => {
            const a = 0.2 + i * 0.22
            return <div className="pw-beatb" key={i}><Line a={a} b={a + 0.07} c={a + 0.18} d={a + 0.21}>{c.line}</Line></div>
          })}
          <div className="pw-beatb"><Line a={0.87} b={0.95}>Career outcomes by major and a leaderboard can wait. The career data needs a real source first.</Line></div>
        </div>
        <div className="pw-pairs">
          {CHANGES.map((c, i) => {
            const a = 0.2 + i * 0.22
            return (
              <W key={i} a={a - 0.01} b={a + 0.05} c={a + 0.18} d={a + 0.21} cls="pw-in pw-pair">
                <div className="pw-pair-col before"><Phone src={c.before} /><span>Tested</span></div>
                <W a={a + 0.07} b={a + 0.12} cls="pw-in swing pw-pair-col"><Phone src={c.after} /><span>Changed</span></W>
              </W>
            )
          })}
        </div>
        <div className="pw-steps pw-steps-pairs">{Array.from({ length: n }, (_, i) => <i key={i} />)}</div>
      </S>

      {/* 08 the final flow */}
      <S id="loop" len={5} fx="loop">
        <div className="pw-loop-text">
          {LOOP.map((s, i) => {
            const k = LOOP.length
            return <div className="pw-beatb" key={i}><Line a={i / k + 0.01} b={i / k + 0.06} c={i < k - 1 ? (i + 1) / k - 0.035 : undefined} d={i < k - 1 ? (i + 1) / k - 0.005 : undefined}>{s.line}</Line></div>
          })}
        </div>
        <div className="pw-loop-phone">
          <div className="pw-blush" />
          <div className="pw-phone">
            {LOOP.map((s, i) => {
              const k = LOOP.length
              return (
                <W key={i} a={i / k - 0.02} b={i / k + 0.02} c={i < k - 1 ? (i + 1) / k - 0.02 : undefined} d={i < k - 1 ? (i + 1) / k + 0.02 : undefined} cls="scr" style={{ position: 'absolute', inset: 0, opacity: 'calc(var(--t,0) * (1 - var(--u,0)))' } as React.CSSProperties}>
                  <img src={s.shot} alt="" />
                </W>
              )
            })}
          </div>
        </div>
        <div className="pw-steps">{LOOP.map((_, i) => <i key={i} />)}</div>
      </S>

      {/* 09 rewarding the walk */}
      <S id="stamp" len={3.8} fx="stamp">
        <div className="pw-stamp-text">
          <div className="pw-beatb"><Line a={0.0} b={0.06} c={0.32} d={0.36}>For the final demo, every check-in stamps a card.</Line></div>
          <div className="pw-beatb"><Line a={0.38} b={0.44} c={0.62} d={0.66}>Six stops, six stamps.</Line></div>
          <div className="pw-beatb"><Line a={0.7} b={0.78}>Then the day ends on a student ID with your year, major, House and stamps.</Line></div>
        </div>
        <div className="pw-stamp-stage">
          <div className="pw-scard-wrap">
            <p className="pw-sh">Science Center</p>
            <div className="pw-scard">
              <small>STAMP CARD</small>
              {STAMPS.map((l, j) => (
                <div key={l} className="pw-slot" style={{ left: 22 + (j % 3) * 128, top: 54 + Math.floor(j / 3) * 150 }}>
                  <div className="em">{j + 1}</div><div className="rg" /><div className="st">{CHECK}</div><span>{l}</span>
                </div>
              ))}
            </div>
            <p className="pw-sp">1 of 6 stops stamped</p>
          </div>
          <img className="pw-id" src={idCard} alt="The Harvard Pathways student ID at the end of the day" />
        </div>
      </S>

      {/* 10 learned, and the film */}
      <S id="end" len={2.8} dark>
        <div className="pw-end-text">
          <div className="pw-beat"><Line a={0.02} b={0.1} c={0.22} d={0.26}>What we learned</Line></div>
          <div className="pw-beat"><Line a={0.28} b={0.36} c={0.46} d={0.5}>A result only feels chosen when the kid can see why they got it.</Line></div>
          <div className="pw-beat"><Line a={0.52} b={0.6} c={0.68} d={0.72}>Real photos matter in a product about finding real places. Every building photo here is a real, credited one.</Line></div>
        </div>
        <W a={0.74} b={0.86} cls="pw-in pw-film">
          <video src={FILM} poster={FILM_POSTER} controls playsInline preload="metadata" />
          <div className="pw-links">
            <a href={FIGMA} target="_blank" rel="noreferrer">Open the Figma prototype ↗</a>
            <Link to="/" state={{ from: '/work/harvard-pathways' }}>Back to all work</Link>
          </div>
          <p className="pw-credit">With Carolyn Dorantes and Kim Cortes-Martinez. Building photos from Wikimedia Commons.</p>
        </W>
      </S>
    </div>
  )
}
