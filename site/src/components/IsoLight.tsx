// ISO, redesigned. The chromatic redesign as a deck you scroll.
//
// How the motion works:
// - Every slide is a section `len` screens tall with a sticky stage. Sections overlap by one
//   screen, so the next stage rises over the pinned one (it rounds its shoulders while it rises,
//   and the covered stage recedes and dims).
// - One rAF loop reads a smoothed scroll position and writes, per slide, --p (progress through
//   the slide), --e (how far it has risen into place) and --c (how far the next one covers it).
// - Inside a slide, anything with data-a/data-b arrives over that window of --p and leaves over
//   data-c/data-d. The loop writes eased --t and --u, and CSS turns them into opacity, travel and
//   blur. Words in .il-words get their own staggered windows.
// - A few slides add their own scripted motion in FX (the inbox collapsing into one dot, the
//   countdown to 8, the Figma pan, the pinned phone's screens).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
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

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3)
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const win = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

/** a piece on a window of the slide: in over [a, b], out over [c, d] */
function W({ a, b, c, d, cls = 'il-in', as = 'div', style, children }: {
  a: number; b: number; c?: number; d?: number; cls?: string; as?: keyof React.JSX.IntrinsicElements; style?: React.CSSProperties; children?: React.ReactNode
}) {
  const Tag = as as 'div'
  return <Tag className={cls} data-a={a} data-b={b} data-c={c} data-d={d} style={style}>{children}</Tag>
}
/** a big line whose words arrive one after another over [a, b] */
function Line({ a, b, c, d, children, className = '' }: { a: number; b: number; c?: number; d?: number; children: string; className?: string }) {
  return (
    <p className={'il-line il-words ' + className} data-a={a} data-b={b} data-c={c} data-d={d}>
      {children.split(' ').map((w, i) => <span key={i} className="w">{w + ' '}</span>)}
    </p>
  )
}

/* ---------- per-slide scripted motion ---------- */
type Fx = (p: number, el: HTMLElement) => void
const BUBBLES = ['hey', 'haha', 'you up?', 'sorry, just saw this', 'so what do you do', 'lol', 'wyd', 'omg same', 'we should get coffee', 'hiii', 'how was your week', 'ok', 'whats your sign', 'brb', 'nice', 'sounds fun', 'hey stranger', 'u around?']
const FX: Record<string, Fx> = {
  cover(p, el) {
    el.style.setProperty('--k', easeInOut(win(p, 0, 0.6)).toFixed(4))
    el.style.setProperty('--k2', easeOut(win(p, 0.28, 0.9)).toFixed(4))
  },
  inbox(p, el) {
    const bs = el.querySelectorAll<HTMLElement>('.il-bub')
    const merge = easeInOut(win(p, 0.62, 0.8))
    bs.forEach((b, i) => {
      const appear = easeOut(win(p, 0.04 + i * 0.022, 0.14 + i * 0.022))
      const ang = (i / bs.length) * Math.PI * 2 + 0.4
      const rx = 38 + (i % 3) * 4, ry = 30 + ((i * 7) % 4) * 3
      const x = Math.cos(ang) * rx, y = Math.sin(ang) * ry
      const drift = Math.sin(p * 9 + i) * 0.6
      // fly to the dot, which sits above the centered line
      const tx = x * (1 - merge), ty = (y + drift) * (1 - merge) + merge * -16
      b.style.transform = `translate(calc(-50% + ${tx.toFixed(2)}vw), calc(-50% + ${ty.toFixed(2)}vh)) scale(${(0.86 + appear * 0.14) * (1 - merge * 0.92)})`
      b.style.opacity = (appear * (1 - merge) * (p > 0.3 && p < 0.62 ? 0.55 : 1)).toFixed(3)
    })
    el.style.setProperty('--one', easeOut(win(p, 0.72, 0.86)).toFixed(4))
  },
  swap(p, el) {
    el.style.setProperty('--lite', easeInOut(win(p, 0.44, 0.66)).toFixed(4))
    el.style.setProperty('--flip', easeInOut(win(p, 0.4, 0.66)).toFixed(4))
  },
  light(p, el) {
    // the ring drains through its own beat
    const ring = el.querySelector<SVGCircleElement>('.il-ring .arc')
    if (ring) ring.style.strokeDashoffset = String((win(p, 0.27, 0.5) * 0.7 * 2 * Math.PI * 104).toFixed(1))
  },
  figma(p, el) {
    const pan = el.querySelector<HTMLElement>('.il-pan')
    if (pan) {
      const w = pan.scrollWidth, vw = window.innerWidth
      const k = easeInOut(win(p, 0.02, 0.5))
      pan.style.transform = `translateX(${(vw * 0.06 - k * (w - vw * 0.86)).toFixed(1)}px)`
      pan.style.opacity = (1 - win(p, 0.44, 0.5)).toFixed(3)
    }
    el.style.setProperty('--cp', easeInOut(win(p, 0.56, 1)).toFixed(4))
  },
  loop(p, el) {
    const k = Math.min(5, Math.floor(p * 6))
    el.querySelectorAll('.il-steps i').forEach((d, i) => d.classList.toggle('on', i === k))
    // the phone turns a little toward each new beat
    const local = p * 6 - k, settle = easeOut(clamp(local / 0.25))
    const from = k % 2 ? -8 : 8, to = k % 2 ? 8 : -8
    el.style.setProperty('--ry', `${(from + (to - from) * settle).toFixed(2)}deg`)
  },
  hold(_p, el) {
    // each screen zooms toward the part the line is about
    el.querySelectorAll<HTMLElement>('.lens img').forEach((img) => {
      const t = Number(img.style.getPropertyValue('--t') || 0), u = Number(img.style.getPropertyValue('--u') || 0)
      const z = Number(img.dataset.z || 1), oy = Number(img.dataset.oy || 0)
      const k = easeInOut(clamp(t))
      img.style.opacity = (t * (1 - u)).toFixed(3)
      img.style.transform = `translate(-50%, ${(-oy * k).toFixed(2)}%) scale(${(1 + (z - 1) * k).toFixed(4)})`
    })
  },
  live(p, el) {
    const left = Math.round(8 * (1 - win(p, 0.06, 0.42)))
    const clock = el.querySelector('.il-clock')
    if (clock) clock.innerHTML = left > 0 ? `7:59:<span>${String(60 - left).padStart(2, '0')}</span>` : '8:00:<span>00</span>'
    const bloom = easeInOut(win(p, 0.42, 0.62))
    el.style.setProperty('--bloom', bloom.toFixed(4))
    const st = el.querySelector('.il-live-state')
    if (st) { st.classList.toggle('on', left === 0); st.lastChild!.textContent = left === 0 ? 'Live now' : 'Opens tonight at 8' }
  },
  rev(p, el) {
    el.style.setProperty('--s', easeInOut(win(p, 0.29, 0.36)).toFixed(4))
    el.style.setProperty('--gh', (1 - easeInOut(win(p, 0.53, 0.63))).toFixed(4))
    el.style.setProperty('--gr', easeInOut(win(p, 0.76, 0.85)).toFixed(4))
    el.style.setProperty('--fz', easeInOut(win(p, 0.93, 1)).toFixed(4))
  },
}

/* ---------- the deck engine ---------- */
function useDeck(root: React.RefObject<HTMLDivElement>, onSlide: (i: number) => void) {
  useLayoutEffect(() => {
    const el = root.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const slides = [...el.querySelectorAll<HTMLElement>('.il-slide')]
    // split windowed words once, so every word owns a slice of its line's window
    el.querySelectorAll<HTMLElement>('.il-words').forEach((line) => {
      const a = Number(line.dataset.a), b = Number(line.dataset.b), ws = line.querySelectorAll<HTMLElement>('.w'), n = ws.length
      ws.forEach((w, i) => {
        const span = (b - a) * 0.55
        w.dataset.a = String(a + ((b - a - span) * i) / Math.max(1, n - 1))
        w.dataset.b = String(Number(w.dataset.a) + span)
        if (line.dataset.c) { w.dataset.c = line.dataset.c; w.dataset.d = line.dataset.d }
      })
    })
    const pieces = slides.map((s) => [...s.querySelectorAll<HTMLElement>('[data-a]:not(.il-words)')])
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
    const set = (n: HTMLElement, k: string, v: number) => {
      const s = v.toFixed(4); if (n.style.getPropertyValue(k) !== s) n.style.setProperty(k, s)
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const target = window.scrollY
      // the visuals trail the scroll a touch, so motion glides instead of stepping with the wheel
      y = reduce ? target : y + (target - y) * (1 - Math.exp(-dt * 11))
      if (Math.abs(target - y) < 0.1) y = target
      const docH = document.documentElement.scrollHeight
      el.style.setProperty('--prog', clamp(y / Math.max(1, docH - vh)).toFixed(4))
      let active = 0
      slides.forEach((s, i) => {
        const top = tops[i], len = lens[i]
        const p = clamp((y - top) / (len * vh))
        const e = i === 0 ? 1 : clamp(1 - (top - y) / vh)
        const next = tops[i + 1]
        const c = next == null ? 0 : clamp(1 - (next - y) / vh)
        set(s, '--p', p); set(s, '--e', easeOut(e)); set(s, '--c', c)
        if (y + vh * 0.5 >= top) active = i
        // only slides on screen do the per-piece work
        if (e <= 0 || c >= 1) return
        pieces[i].forEach((n) => {
          const a = Number(n.dataset.a), b = Number(n.dataset.b)
          set(n, '--t', easeOut(win(p, a, b)))
          if (n.dataset.c) set(n, '--u', easeInOut(win(p, Number(n.dataset.c), Number(n.dataset.d))))
        })
        FX[s.dataset.fx || '']?.(p, s)
      })
      if (active !== cur) {
        cur = active; onSlide(active)
        el.classList.toggle('on-dark', slides[active].classList.contains('il-dark'))
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
}

/* ---------- slides ---------- */
const S = ({ id, len, fx, dark, className = '', children }: { id: string; len: number; fx?: string; dark?: boolean; className?: string; children: React.ReactNode }) => (
  <section className={`il-slide il-${id} ${dark ? 'il-dark' : ''} ${className}`} data-len={len} data-fx={fx} style={{ height: `${(len + 1) * 100}vh` }}>
    <div className="il-stage">{children}</div>
  </section>
)
const Phone = ({ src, className = '', style }: { src: string; className?: string; style?: React.CSSProperties }) => (
  <div className={'il-phone ' + className} style={style}><img src={src} alt="" /></div>
)

const LOOP = [
  { shot: shHome, line: 'Home is the queue. One button, and a count of who is here.' },
  { shot: shSearching, line: 'ISO looks for someone who is online at the same moment.' },
  { shot: shMatch, line: 'You get one person and one question you will both answer.' },
  { shot: shRoom, line: 'In the live room, a slow ring shows whose turn it is.' },
  { shot: shSealed, line: 'Either of you can ask to keep talking. Your answer stays sealed.' },
  { shot: shMutual, line: 'Both answers flip at the same time. Green means you both said yes.' },
]
const SLIDE_COUNT = 18

export default function IsoLight() {
  const root = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  const [see, setSee] = useState<'watch' | 'try' | 'film'>('watch')
  useDeck(root, setSlide)
  useEffect(() => {
    document.title = 'ISO, redesigned · Paul Jeon'
    window.scrollTo(0, 0)
  }, [])
  const goTo = (i: number) => {
    const s = root.current?.querySelectorAll<HTMLElement>('.il-slide')[i]
    if (!s) return
    const top = s.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + 2, behavior: 'smooth' })
  }

  return (
    <div className="il" ref={root}>
      <div className="il-progress" />
      <header className="il-top">
        <BackToSite />
        <nav className="il-sub"><Link to="/work/iso-redesign/brand">Brand</Link><Link to="/work/iso-redesign/process">Process</Link></nav>
        <span className="il-count">{String(slide + 1).padStart(2, '0')} / {SLIDE_COUNT}</span>
      </header>
      <nav className="il-dots" aria-label="Slides">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button key={i} className={i === slide ? 'on' : ''} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}><i /></button>
        ))}
      </nav>

      {/* 01 cover */}
      <S id="cover" len={1.3} fx="cover">
        <div className="il-glow" />
        <img className="il-cover-mark" src={mark} alt="ISO" />
        <div className="il-cover-title">
          <h1 style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
            {'ISO, redesigned'.split(' ').map((w, i) => <span key={i} className="il-boot" style={{ '--bi': i } as React.CSSProperties}>{w + ' '}</span>)}
          </h1>
          <p className="il-boot" style={{ '--bi': 3 } as React.CSSProperties}>
            A dating app where you talk to one person at a time. I redesigned it over eight days in October 2026, with Claude in my workflow for faster prototyping and iteration.
          </p>
        </div>
        <Phone src={shHome} className="il-cover-phone" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
        <div className="il-cover-hint">Scroll<i /></div>
      </S>

      {/* 02 why now: the market */}
      <S id="why" len={4.2} fx="why">
        <div className="il-why-text">
          <div className="il-beatb"><Line a={0.01} b={0.06} c={0.14} d={0.17}>Why now</Line></div>
          <div className="il-beatb"><Line a={0.18} b={0.23} c={0.32} d={0.35}>Bumble went private this week for $1.3B. Five years ago it IPO’d at $14B.</Line></div>
          <div className="il-beatb"><Line a={0.36} b={0.41} c={0.5} d={0.53}>Paying users fell from about 3.8M to 3.2M in a year, and revenue has declined for nearly two.</Line></div>
          <div className="il-beatb"><Line a={0.54} b={0.59} c={0.67} d={0.7}>Match Group is holding up better but still shrinking: 13.3M payers, down 6%, with Tinder’s monthly actives down 7%.</Line></div>
          <div className="il-beatb"><Line a={0.71} b={0.77}>Both now charge more per subscriber to cover the people leaving.</Line></div>
        </div>
        <div className="il-why-fig">
          <W a={0.18} b={0.23} c={0.32} d={0.35} cls="il-in scale"><div className="il-fig"><span className="dim">$14B</span><span>$1.3B</span></div></W>
          <W a={0.36} b={0.41} c={0.5} d={0.53} cls="il-in scale"><div className="il-fig"><span className="dim">3.8M</span><span>3.2M</span></div></W>
          <W a={0.54} b={0.59} c={0.67} d={0.7} cls="il-in scale"><div className="il-fig"><span>−6%</span><small>Match Group payers</small><span>−7%</span><small>Tinder monthly actives</small></div></W>
          <W a={0.71} b={0.77} cls="il-in scale"><div className="il-fig"><span>More</span><small>per subscriber</small></div></W>
        </div>
      </S>

      {/* 03 why now: the admission */}
      <S id="quote" len={1.4} dark className="il-quote">
        <div className="il-glow" />
        <div className="il-quote-text">
          <Line a={0.04} b={0.4}>“We failed to recognize and respond to changes in the younger demographic, especially Gen Z and what they want.”</Line>
          <W a={0.42} b={0.6} cls="il-in soft"><p className="il-quote-by">Spencer Rascoff, CEO, Match Group</p></W>
        </div>
      </S>

      {/* 04 why now: the exception, and where everyone is heading */}
      <S id="shift" len={4.6} fx="shift">
        <div className="il-why-text">
          <div className="il-beatb"><Line a={0.01} b={0.06} c={0.16} d={0.19}>Hinge is the exception. Revenue grew 22% last quarter to $203M.</Line></div>
          <div className="il-beatb"><Line a={0.2} b={0.25} c={0.34} d={0.37}>It was the one major app built around intent instead of volume, and it’s the one still growing.</Line></div>
          <div className="il-beatb"><Line a={0.38} b={0.43} c={0.52} d={0.55}>The rest of the industry is moving the same direction. Tinder added an Events tab for meeting in person. Bumble is betting on group meetups and a replacement for the swipe.</Line></div>
          <div className="il-beatb"><Line a={0.56} b={0.61} c={0.68} d={0.71}>Hinge’s founder, Justin McLeod, recently left to build Overtone: no swiping.</Line></div>
          <div className="il-beatb"><Line a={0.72} b={0.78}>The person who built the app that works still decided the format was the problem.</Line></div>
        </div>
        <div className="il-why-fig">
          <W a={0.01} b={0.06} c={0.34} d={0.37} cls="il-in scale"><div className="il-fig"><span className="up">+22%</span><small>Hinge revenue, $203M</small></div></W>
          <W a={0.38} b={0.43} c={0.52} d={0.55} cls="il-in scale"><div className="il-fig il-fig-list"><span>Events</span><span>Meetups</span><span className="dim">The swipe</span></div></W>
          <W a={0.56} b={0.61} cls="il-in scale"><div className="il-fig"><span>No swiping.</span><small>Overtone</small></div></W>
        </div>
      </S>

      {/* 05 why now: ISO's answer */}
      <S id="answer" len={2.6} dark className="il-answer">
        <div className="il-glow" />
        <div className="il-answer-text">
          <div className="il-beatb"><Line a={0.02} b={0.08} c={0.24} d={0.28}>ISO started from the same conclusion. One conversation at a time, live, with someone on your campus who you’ll actually run into.</Line></div>
          <div className="il-beatb"><Line a={0.3} b={0.36} c={0.5} d={0.54}>Tinder and Bumble are adding commitment to feeds designed for abundance. Overtone makes the choice for you.</Line></div>
          <div className="il-beatb"><Line a={0.56} b={0.64}>ISO leaves the choice with you and removes the backup plan: there’s nobody else to talk to until this ends, so the obvious next step is to meet.</Line></div>
        </div>
      </S>

      {/* 06 the inbox, collapsing into one */}
      <S id="inbox" len={2.6} fx="inbox">
        {BUBBLES.map((b, i) => <div key={i} className={'il-bub' + (i % 3 === 1 ? ' me' : '')}>{b}</div>)}
        <div className="il-one" />
        <div className="il-beat"><Line a={0.02} b={0.12} c={0.27} d={0.32}>Most dating apps work like an inbox.</Line></div>
        <div className="il-beat"><Line a={0.34} b={0.46} c={0.58} d={0.63}>You keep a dozen conversations open, and most of them stop halfway.</Line></div>
        <div className="il-beat"><Line a={0.74} b={0.88}>ISO lets you talk to one person at a time, live.</Line></div>
      </S>

      {/* 03 orange to light */}
      <S id="swap" len={2.4} fx="swap" dark className="il-swap">
        <div className="il-glow" />
        <div className="il-swap-text">
          <div className="il-beatb">
            <Line a={0.03} b={0.12} c={0.34} d={0.4}>The first version of ISO was orange.</Line>
            <Line a={0.14} b={0.24} c={0.34} d={0.4} className="c2">It worked, but every screen was loud.</Line>
          </div>
          <div className="il-beatb">
            <Line a={0.58} b={0.68}>The redesign starts from white and ink.</Line>
            <Line a={0.68} b={0.8} className="c2">Color only shows up where someone is live.</Line>
          </div>
        </div>
        <div className="il-swap-phones">
          <Phone src={oldHome} className="old" />
          <Phone src={shHome} className="new" />
        </div>
      </S>

      {/* 04 the light: dot, ring, rings, green */}
      <S id="light" len={4} fx="light">
        <div className="il-lightstage">
          <W a={0.02} b={0.08} c={0.22} d={0.26} cls="il-in scale"><div className="il-pdot" /></W>
          <W a={0.25} b={0.31} c={0.47} d={0.51} cls="il-in scale">
            <div className="il-ring">
              <svg viewBox="0 0 230 230">
                <defs><linearGradient id="ilg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset=".3" stopColor="#FF5BA8" /><stop offset=".55" stopColor="#B86BFF" /><stop offset=".8" stopColor="#5A9BFF" /><stop offset="1" stopColor="#3FDCD2" /></linearGradient></defs>
                <circle cx="115" cy="115" r="104" fill="none" stroke="#E7E7EA" strokeWidth="7" />
                <circle className="arc" cx="115" cy="115" r="104" fill="none" stroke="url(#ilg)" strokeWidth="7" strokeLinecap="round" strokeDasharray={String(2 * Math.PI * 104)} />
              </svg>
            </div>
          </W>
          <W a={0.5} b={0.56} c={0.72} d={0.76} cls="il-in scale">
            <div className="il-ripples"><div className="il-ripple" /><div className="il-ripple" /><div className="il-ripple" /><img className="av" src={PAUL} alt="" /></div>
          </W>
          <W a={0.76} b={0.84} cls="il-in scale">
            <div className="il-pair"><img src={PAUL} alt="" /><img src={MAYA} alt="" /><span className="yes" /></div>
          </W>
        </div>
        <div className="il-lighttext">
          <div className="il-beatb"><Line a={0.04} b={0.11} c={0.22} d={0.26}>The dot means a person is online right now.</Line></div>
          <div className="il-beatb"><Line a={0.27} b={0.34} c={0.47} d={0.51}>The ring shows whose turn it is. It never turns red, and it never ends the chat for you.</Line></div>
          <div className="il-beatb"><Line a={0.52} b={0.59} c={0.72} d={0.76}>While ISO looks for someone, rings spread out from your photo.</Line></div>
          <div className="il-beatb"><Line a={0.78} b={0.87}>Green shows up once, when you both say yes.</Line></div>
        </div>
      </S>

      {/* 05 figma */}
      <S id="figma" len={2.6} fx="figma">
        <div className="il-figma-text">
          <div className="il-beatb"><Line a={0.02} b={0.1} c={0.42} d={0.47}>Every screen started in a Figma file.</Line></div>
          <div className="il-beatb"><Line a={0.5} b={0.62}>Built all 64 screens using Figma MCP, on shared colors, type and components.</Line></div>
        </div>
        <div className="il-pan"><img src={figmaRow} alt="The core flow in Figma" /></div>
        <W a={0.52} b={0.62} cls="il-comps"><div className="il-comps-frame"><img src={figmaComps} alt="The component library in Figma" /></div></W>
      </S>

      {/* 06 the loop, on a pinned phone */}
      <S id="loop" len={5.4} fx="loop">
        <div className="il-loop-text">
          {LOOP.map((s, i) => (
            <div className="il-beatb" key={i}>
              <Line a={i / 6 + 0.01} b={i / 6 + 0.06} c={i < 5 ? (i + 1) / 6 - 0.035 : undefined} d={i < 5 ? (i + 1) / 6 - 0.005 : undefined}>{s.line}</Line>
            </div>
          ))}
        </div>
        <div className="il-loop-phone">
          <div className="il-glow" />
          <div className="il-phone">
            {LOOP.map((s, i) => (
              <W key={i} a={i / 6 - 0.02} b={i / 6 + 0.02} c={i < 5 ? (i + 1) / 6 - 0.02 : undefined} d={i < 5 ? (i + 1) / 6 + 0.02 : undefined} cls="scr" style={{ position: 'absolute', inset: 0, opacity: 'calc(var(--t,0) * (1 - var(--u,0)))' } as React.CSSProperties}>
                <img src={s.shot} alt="" />
              </W>
            ))}
          </div>
        </div>
        <div className="il-steps">{LOOP.map((_, i) => <i key={i} />)}</div>
      </S>

      {/* 07 one at a time */}
      <S id="gate" len={1.5} dark>
        <div className="il-gate-text">
          <p className="il-line il-words il-light-words" data-a={0.04} data-b={0.62}>
            {'While you are talking with Maya, the queue stays closed. You can meet someone new after this conversation ends.'.split(' ').map((w, i) => <span key={i} className="w" style={{ opacity: 1, transform: 'none', filter: 'none' }}>{w + ' '}</span>)}
          </p>
        </div>
        <W a={0} b={0.25} cls="il-gate-phone"><Phone src={shInconvo} /></W>
      </S>

      {/* 08 hold a moment */}
      <S id="hold" len={3.8} fx="hold">
        <div className="il-hold-text">
          <div className="il-beatb"><Line a={0.02} b={0.08} c={0.22} d={0.26}>ISO does not save your conversations.</Line></div>
          <div className="il-beatb"><Line a={0.27} b={0.34} c={0.47} d={0.51}>Long-press a message, then tap where the good part ends.</Line></div>
          <div className="il-beatb"><Line a={0.52} b={0.59} c={0.72} d={0.76}>Then pick a word for how it felt.</Line></div>
          <div className="il-beatb"><Line a={0.77} b={0.86}>Their words stay and their name becomes an initial. If either of you blocks the other, the moment is deleted.</Line></div>
        </div>
        <div className="il-hold-view">
          <div className="il-glow" />
          <div className="lens">
            <img src={shRoom} data-a={0} data-b={0.08} data-c={0.22} data-d={0.27} data-z="1.05" data-oy="0" alt="" />
            <img src={shSelect} data-a={0.24} data-b={0.34} data-c={0.47} data-d={0.52} data-z="1.45" data-oy="16" alt="" />
            <img src={shFeel} data-a={0.49} data-b={0.59} data-c={0.72} data-d={0.77} data-z="1.3" data-oy="14" alt="" />
            <img src={shMoment} data-a={0.74} data-b={0.84} data-z="1.18" data-oy="6" alt="" />
          </div>
        </div>
      </S>

      {/* 09 memories */}
      <S id="mem" len={2.6}>
        <div className="il-mem-text">
          <div className="il-beatb"><Line a={0.02} b={0.1} c={0.44} d={0.49}>Memories keeps the conversations you had and the moments you chose to hold.</Line></div>
          <div className="il-beatb"><Line a={0.52} b={0.62}>Big words in grey tiles. Nothing is color coded, and nobody gets a score.</Line></div>
        </div>
        <div className="il-bento">
          {[
            { cls: 'full hl', fx: '-80px', fy: '-60px', fr: '-6deg', s: 'Tonight', b: 'What’s the last thing that made you laugh out loud?', e: 'M.  ·  14 min  ·  kept talking' },
            { cls: '', fx: '-120px', fy: '40px', fr: '8deg', s: 'This week', b: '4', xl: true, e: 'conversations' },
            { cls: '', fx: '120px', fy: '50px', fr: '-7deg', s: 'Mostly', b: 'Laughed.', e: 'How it’s felt' },
            { cls: 'full', fx: '60px', fy: '90px', fr: '5deg', s: 'Held  ·  9:02 PM', b: '“Honestly? My roommate trying to parallel park for eleven minutes.”', e: 'M.  ·  Laughed, butterflies' },
          ].map((t, i) => (
            <div key={i} className={'il-tile ' + t.cls} data-a={0.06 + i * 0.07} data-b={0.2 + i * 0.07} style={{ '--fx': t.fx, '--fy': t.fy, '--fr': t.fr } as React.CSSProperties}>
              <small>{t.s}</small><b className={t.xl ? 'xl' : ''}>{t.b}</b><em>{t.e}</em>
            </div>
          ))}
        </div>
      </S>

      {/* 10 ISO Live */}
      <S id="live" len={3.2} fx="live">
        <div className="il-live-rise" />
        <div className="il-live-state"><i /><span>Opens tonight at 8</span></div>
        <div className="il-clock">7:59:52</div>
        <div className="il-live-text">
          <div className="il-beatb"><Line a={0.03} b={0.1} c={0.36} d={0.4}>ISO only opens at set hours.</Line></div>
          <div className="il-beatb"><Line a={0.48} b={0.56} c={0.72} d={0.76}>Everyone looking is looking at once, so the first match comes fast.</Line></div>
          <div className="il-beatb"><Line a={0.78} b={0.87}>Thursday Late runs until 2 am. Slow Sunday opens in the afternoon.</Line></div>
        </div>
      </S>

      {/* 11 what changed in review */}
      <S id="rev" len={4.4} fx="rev">
        <div className="il-rev-text">
          <div className="il-beatb"><Line a={0.02} b={0.08} c={0.2} d={0.24}>Four things changed after I reviewed them.</Line></div>
          <div className="il-beatb">
            <W a={0.25} b={0.3} c={0.44} d={0.48} cls="il-in"><p className="il-line">I renamed <span className="il-strike">Journal</span> back to Memories.</p></W>
          </div>
          <div className="il-beatb"><Line a={0.49} b={0.55} c={0.67} d={0.71}>The gradient header was too strong, so it became one thin line of light.</Line></div>
          <div className="il-beatb"><Line a={0.72} b={0.78} c={0.88} d={0.91}>A color for every feeling looked like a template, so feelings became big words in grey tiles.</Line></div>
          <div className="il-beatb"><Line a={0.92} b={0.98}>In the film, the phone frame fades out and the app fills the screen.</Line></div>
        </div>
        <div className="il-rev-vis">
          <W a={0.25} b={0.3} c={0.44} d={0.48} cls="il-in scale">
            <div className="il-word" style={{ position: 'relative' }}>
              <span style={{ opacity: 'calc(1 - var(--s, 0))', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' } as React.CSSProperties}>Journal</span>
              <span style={{ opacity: 'var(--s, 0)', filter: 'blur(calc((1 - var(--s, 0)) * 8px))' } as React.CSSProperties}>Memories</span>
            </div>
          </W>
          <W a={0.49} b={0.55} c={0.67} d={0.71} cls="il-in scale">
            <div className="il-gheader"><div className="band" /><div className="ttl">Memories</div><div className="acc" /><div className="row" /><div className="row" /></div>
          </W>
          <W a={0.72} b={0.78} c={0.88} d={0.91} cls="il-in scale">
            <div className="il-cards2">
              {[['#F5B83D', 'Laughed', '“The whole street clapped when she finally got it.”'], ['#FF5BA8', 'Seen', '“You don’t have to have it figured out.”'], ['#2FCFC4', 'Calm', '“Let’s just talk about sandwiches.”']].map(([c, f, q]) => (
                <div key={f} className="cc" style={{ '--rail': c } as React.CSSProperties}><small><span className="dt" />{f}</small><b>{q}</b></div>
              ))}
            </div>
          </W>
          <W a={0.92} b={0.98} cls="il-in scale">
            <div className="il-frame-demo"><Phone src={shFeel} className="ph" /></div>
          </W>
        </div>
      </S>

      {/* 12 how it was built */}
      <S id="made" len={1.8} dark className="il-made">
        <div className="il-made-list">
          <Line a={0.02} b={0.12}>Claude assisted my workflow, so I could prototype and iterate faster.</Line>
          <div style={{ height: 34 }} />
          {[
            ['Figma', 'Built all 64 screens, the color and type variables and the components using Figma MCP.'],
            ['Prototype', 'A coded prototype, with a tour that drives the real screens instead of a recording.'],
            ['Film', 'Rendered frame by frame from that prototype, with a camera that follows the finger.'],
            ['Direction', 'I set the direction, made the calls, and cut anything that read as template work.'],
          ].map(([k, v], i) => (
            <W key={k} a={0.16 + i * 0.09} b={0.26 + i * 0.09} cls="il-made-row il-in soft"><b>{k}</b><span>{v}</span></W>
          ))}
        </div>
      </S>

      {/* 13 see it */}
      <S id="see" len={1} className="il-see">
        <div className="il-glow" />
        <div className="il-see-copy">
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
        </div>
        {see === 'film' ? (
          <div className="il-see-film"><video key="film" src={FILM} poster={FILM_POSTER} controls playsInline preload="metadata" /></div>
        ) : (
          <div className="il-see-frame"><div className="il-phone"><iframe key={see} src={`${PROTO}?embed&mode=${see}`} title="ISO prototype" /></div></div>
        )}
      </S>

      {/* 14 outro */}
      <S id="out" len={0.6} className="il-out">
        <div className="il-glow" />
        <img className="il-out-mark" src={mark} alt="ISO" />
        <div className="il-out-line">
          <p className="il-line" style={{ margin: '0 auto' }}>One conversation at a time.</p>
          <div className="il-links">
            <Link to="/work/iso-redesign/brand">The brand</Link>
            <Link to="/work/iso-redesign/process">How it was made</Link>
            <a href={`${PROTO}?mode=watch`} target="_blank" rel="noreferrer">Watch the prototype ↗</a>
            <Link to="/" state={{ from: '/work/iso-redesign' }}>Back to all work</Link>
          </div>
        </div>
        <p className="il-credit">Maya’s portrait is from <a href="https://unsplash.com/photos/smiling-woman-at-wooden-table-Ll9YOG20UFI" target="_blank" rel="noreferrer">Unsplash</a>.</p>
      </S>
    </div>
  )
}
