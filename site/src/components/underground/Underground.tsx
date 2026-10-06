import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { about, cards, type Card } from '../../content/site'
import { Guide, R, clearShapes, type Kind } from './guide'
import '../../styles/underground.css'

// ============================================================================
// About Me — the underground. A second, louder half of the home page that you
// fall into. The camera finds the period of "Hi, I'm Paul.", and that dot
// falls with you while the page stretches away and the light goes from white
// to black. It lands as the period of "About Me." and waits there as the
// start button. From then on the dot is the guide: it bounces into every
// heading, then hops onto the button for the next section and becomes it.
// Climbing back up stops with the dot in the middle of the screen, and the
// home page renders back in around it.
// ============================================================================

type V = CSSProperties & Record<`--${string}`, string | number>
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const mixRGB = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const PAPER = [253, 253, 251], INK = [11, 11, 10]
const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** the order of the walk, and the button the dot becomes at the end of each part */
const FLOW: Record<string, { name: string; pad?: { kind: Kind; label: string; next: string } }> = {
  land: { name: 'About Me' },
  work: { name: 'Work', pad: { kind: 'pill', label: 'Things I like', next: 'likes' } },
  likes: { name: 'Things I like', pad: { kind: 'triangle', label: 'Play', next: 'play' } },
  play: { name: 'The dot', pad: { kind: 'circle', label: 'An idea', next: 'agent' } },
  agent: { name: 'An idea', pad: { kind: 'square', label: 'Résumé', next: 'resume' } },
  resume: { name: 'Résumé', pad: { kind: 'tag', label: 'Contact', next: 'contact' } },
  contact: { name: 'Contact', pad: { kind: 'pill', label: 'Back to the top', next: 'up' } },
}

/* ------------------------------------------------------------------------- */
/* the home page's period: where the camera focuses                           */
/* ------------------------------------------------------------------------- */

interface Focus { home: HTMLElement; O: { x: number; y: number }; P: { x: number; y: number }; r0: number }
function measureHome(): Focus | null {
  const home = document.querySelector<HTMLElement>('.sh-page')
  if (!home) return null
  const prev = home.style.transform, vis = home.style.visibility
  home.style.transform = 'none'; home.style.visibility = ''
  const o = home.getBoundingClientRect()
  const per = home.querySelector<HTMLElement>('.sh-period'), bl = home.querySelector<HTMLElement>('.sh-bl')
  let P = { x: innerWidth / 2, y: innerHeight / 2 }, r0 = 6
  if (per && bl) {
    const pr = per.getBoundingClientRect(), br = bl.getBoundingClientRect(), fs = parseFloat(getComputedStyle(per).fontSize) || 60
    r0 = fs * 0.09
    P = { x: pr.left + pr.width * 0.42, y: br.top - r0 * 1.05 }
  }
  home.style.transform = prev; home.style.visibility = vis
  return { home, O: { x: o.left, y: o.top }, P: { x: P.x - o.left, y: P.y - o.top }, r0 }
}
/** the camera move: k=0 is the page as it is, k=1 has its period in the middle of the screen */
function focusAt(f: Focus, k: number) {
  const s = 1 + 0.16 * k
  const cx = innerWidth / 2, cy = innerHeight / 2
  const qx = f.O.x + f.P.x + (cx - f.O.x - f.P.x) * k, qy = f.O.y + f.P.y + (cy - f.O.y - f.P.y) * k
  return { t: `translate(${qx - f.O.x - s * f.P.x}px, ${qy - f.O.y - s * f.P.y}px) scale(${s})`, x: qx, y: qy }
}

/* ------------------------------------------------------------------------- */
/* the dive                                                                   */
/* ------------------------------------------------------------------------- */

interface DiveEls { shaft: HTMLDivElement; streaks: HTMLDivElement[]; ug: HTMLDivElement; inner: HTMLDivElement }

/**
 * dir 1 goes down, -1 climbs back up. Depth D runs 0 → LAND: a dip, a cubic
 * acceleration (the speed keeps climbing), then an underdamped spring that
 * slides past the landing and settles back, which is the camera catching up.
 * The light follows depth, not time, so it stays white for the first stretch.
 */
function dive(dir: 1 | -1, el: DiveEls, guide: Guide, f: Focus | null, onLand: () => void) {
  const H = innerHeight
  const LAND = H * 6, TB = dir === 1 ? 1.9 : 1.5, DB = H * 4.4
  const FOCUS = dir === 1 && f ? 0.85 : 0, crouch = 0.22
  const cx = innerWidth / 2, cy = H / 2
  const t0 = performance.now()
  let D = 0, v = 0, last = t0, phase: 'focus' | 'crouch' | 'fall' | 'land' = FOCUS ? 'focus' : 'crouch', done = false, tc = 0
  const streaks = el.streaks.map((s, i) => ({ s, x: Math.random() * 100, y: Math.random() * (H + 400), par: 0.4 + (i % 5) * 0.22 }))
  el.shaft.style.display = 'block'
  if (f) f.home.style.transformOrigin = '0 0'

  const frame = (now: number) => {
    const t = (now - t0) / 1000
    const dt = Math.min(0.034, (now - last) / 1000); last = now
    let crouchY = 0, focusK = 1
    if (phase === 'focus') {
      focusK = ease(clamp(t / FOCUS))
      if (t >= FOCUS) { phase = 'crouch'; tc = t }
    } else if (phase === 'crouch') {
      crouchY = Math.sin(clamp((t - tc) / crouch) * Math.PI) * 14 * dir
      if (t - tc >= crouch) { phase = 'fall'; tc = t }
    }
    let u = 0
    if (phase === 'fall') {
      u = clamp((t - tc) / TB)
      const nD = DB * u * u * u
      v = (nD - D) / Math.max(dt, 0.001); D = nD
      if (u >= 1) { phase = 'land'; v = (3 * DB) / TB }
    } else if (phase === 'land') {
      v += ((LAND - D) * 110 - v * 17) * dt
      D += v * dt
      if (Math.abs(LAND - D) < 1.2 && Math.abs(v) < 15) { D = LAND; v = 0; finish(); return }
    }
    const speed = Math.abs(v)
    const depth = phase === 'land' ? 1 : phase === 'fall' ? u : 0
    const dark = dir === 1 ? smooth(0.3, 0.9, depth) : 1 - smooth(0.12, 0.7, depth)
    const bg = mixRGB(PAPER, INK, dark), fg = mixRGB(INK, PAPER, dark)
    el.shaft.style.background = bg
    guide.pinColor = fg

    // the page you are leaving stretches backwards as it goes
    const k = 1 + Math.min(0.7, speed / 9000)
    if (dir === 1) {
      if (f) {
        const fo = focusAt(f, focusK), yb = H - f.O.y
        f.home.style.transform = `translateY(${-D + crouchY}px) translateY(${yb * (1 - k)}px) scaleY(${k}) ${fo.t}`
        if (phase === 'focus') guide.pin(fo.x, fo.y, 0, f.r0 + (R - f.r0) * focusK)
        else guide.pin(cx, cy + crouchY, speed)
      } else guide.pin(cx, cy + crouchY, speed)
      const lag = clamp(v * 0.03, -90, 90)                       // the content trails the camera
      el.ug.style.transform = `translateY(${LAND - D}px)`
      el.inner.style.transform = `translateY(${lag}px)`
    } else {
      el.ug.style.transformOrigin = '50% 0'
      el.ug.style.transform = `translateY(${D + crouchY}px) scaleY(${k})`
      guide.pin(cx, cy + crouchY, speed)
    }
    streaks.forEach((s) => {
      const len = 4 + speed * 0.035 * s.par
      const y = ((((s.y - dir * D * s.par) % (H + 400)) + (H + 400)) % (H + 400)) - 200
      s.s.style.transform = `translate(${s.x}vw, ${y}px) scaleY(${len})`
      s.s.style.background = fg
      s.s.style.opacity = String(clamp(speed / 2500) * 0.55)
    })
    raf = requestAnimationFrame(frame)
  }
  const finish = () => {
    if (done) return
    done = true
    streaks.forEach((s) => (s.s.style.opacity = '0'))
    if (dir === 1) {
      el.shaft.style.display = 'none'
      if (f) f.home.style.transform = `translateY(${-LAND}px)`
      el.ug.style.transform = ''
      el.inner.style.transform = ''
    } else {
      el.ug.style.transform = `translateY(${LAND}px)`
    }
    onLand()
  }
  let raf = requestAnimationFrame(frame)
  const safety = window.setTimeout(finish, 6000)
  return () => { cancelAnimationFrame(raf); clearTimeout(safety) }
}

/** the climb's last beat: the home page renders back in around the dot */
function reveal(f: Focus, guide: Guide, done: () => void) {
  const D = 1.3, t0 = performance.now()
  const far = Math.hypot(innerWidth, innerHeight) * 1.1
  const home = f.home
  home.style.transformOrigin = '0 0'
  guide.pinColor = 'rgb(11,11,10)'
  const frame = (now: number) => {
    const t = clamp((now - t0) / 1000 / D)
    const k = 1 - ease(t), r = (1 - Math.pow(1 - t, 3)) * far
    const fo = focusAt(f, k)
    home.style.transform = fo.t
    home.style.clipPath = `circle(${r.toFixed(1)}px at ${f.P.x}px ${f.P.y}px)`
    guide.pin(fo.x, fo.y, 0, R + (f.r0 - R) * ease(t))
    if (t < 1) raf = requestAnimationFrame(frame)
    else { home.style.transform = ''; home.style.clipPath = ''; done() }
  }
  let raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}

/* ------------------------------------------------------------------------- */
/* small pieces                                                               */
/* ------------------------------------------------------------------------- */

function useSeen<T extends Element>(root: React.RefObject<HTMLElement>, threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current || seen) return
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect() } }, { root: root.current, threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen, root, threshold])
  return [ref, seen] as const
}

/** letters that slam in, one after another; the last word carries the dot's slot */
function Slam({ text, on, slot, delay = 0 }: { text: string; on: boolean; slot?: string; delay?: number }) {
  const ws = text.split(' ')
  return (
    <span className={`ug-slam ${on ? 'on' : ''}`} aria-label={text}>
      {ws.map((w, wi) => {
        const start = ws.slice(0, wi).reduce((n, x) => n + x.length + 1, 0)
        return (
          <Fragment key={wi}>{wi > 0 ? ' ' : ''}<span className="ug-word" aria-hidden="true">
            {[...w].map((c, j) => { const i = start + j; return <span key={j} style={{ '--i': i, '--d': `${delay}ms`, '--r': `${((i * 37) % 11) - 5}deg` } as V}>{c}</span> })}
            {wi === ws.length - 1 && slot ? <i className="ug-slot" data-slot={slot} /> : null}
          </span></Fragment>
        )
      })}
    </span>
  )
}
const Pad = ({ id }: { id: string }) => <div className="ug-next"><div className="ug-pad" data-pad={id} /></div>

const hrefOf = (c: Card) => (c.slug ? `/work/${c.slug}` : c.page ? c.page : c.href ?? c.demo?.href ?? '#')
const internal = (c: Card) => !!(c.slug || c.page)

/* ------------------------------------------------------------------------- */
/* sections                                                                   */
/* ------------------------------------------------------------------------- */

/** Work, at speed: the section pins, and scrolling throws the cards sideways. */
function Work({ root, scrollV }: { root: React.RefObject<HTMLDivElement>; scrollV: React.MutableRefObject<number> }) {
  const sec = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const words = useRef<HTMLDivElement>(null)
  const list = cards.filter((c) => c.image || c.icon)
  useEffect(() => {
    let raf = 0, skew = 0
    const tick = () => {
      const r = root.current, s = sec.current, tr = track.current
      if (r && s && tr && innerWidth > 880) {
        const top = s.getBoundingClientRect().top
        const span = s.offsetHeight - r.clientHeight
        const p = clamp(-top / Math.max(1, span))
        const max = tr.scrollWidth - innerWidth + 80
        skew += (clamp(scrollV.current * 0.012, -14, 14) - skew) * 0.12
        tr.style.transform = `translate3d(${-p * max}px,0,0) skewX(${-skew}deg)`
        if (words.current) words.current.style.transform = `translate3d(${p * 900 - 450}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [root, scrollV])
  return (
    <section ref={sec} className="ug-work" style={{ height: `${list.length * 30 + 110}vh` }} data-sec="work" data-tone="dark">
      <div className="ug-pin">
        <div ref={words} className="ug-bigword" aria-hidden="true">WORK WORK WORK WORK</div>
        <h2 className="ug-h" aria-label="Work"><span className="ug-word">Work<i className="ug-slot" data-slot="work" /></span></h2>
        <div ref={track} className="ug-track">
          {list.map((c) => {
            const body = (
              <>
                <div className="ug-card-pic"><img src={c.image ?? c.icon} alt="" loading="lazy" /></div>
                <b>{c.title.replace('Currently: ', '')}</b>
              </>
            )
            return internal(c)
              ? <Link key={c.id} to={hrefOf(c)} className="ug-card">{body}</Link>
              : <a key={c.id} href={hrefOf(c)} target="_blank" rel="noreferrer" className="ug-card">{body}</a>
          })}
        </div>
        <Pad id="work" />
      </div>
    </section>
  )
}

/** The things Paul likes, as cards that stack up as you scroll. */
const LIKES = [
  { t: 'Designs that feel special', bg: '#0B0B0A', fg: '#F5F2EC' },
  { t: 'Painting', bg: '#E02B1D', fg: '#fff' },
  { t: 'Music, loud', bg: '#fff', fg: '#0B0B0A' },
  { t: 'Old Pokémon games on a Game Boy', bg: '#12A150', fg: '#fff' },
  { t: '2018 James Harden highlights', bg: '#0B0B0A', fg: '#F5F2EC' },
  { t: 'Snacks, while designing', bg: '#E02B1D', fg: '#fff' },
]
function Likes({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.2)
  const els = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const cs = els.current
      cs.forEach((c, i) => {
        const nx = cs[i + 1]
        if (!c || !nx) return
        const q = clamp(1 - (nx.getBoundingClientRect().top - c.getBoundingClientRect().top) / 420)
        c.style.transform = `scale(${1 - q * 0.05})`
        c.style.filter = `brightness(${1 - q * 0.14})`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <section ref={ref} className="ug-likes" data-sec="likes" data-tone="light">
      <h2 className="ug-h"><Slam text="Things I like" on={seen} slot="likes" /></h2>
      <div className="ug-stack">
        {LIKES.map((l, i) => (
          <div key={l.t} ref={(e) => { els.current[i] = e }} className="ug-like" style={{ background: l.bg, color: l.fg, top: `calc(16vh + ${i * 22}px)`, zIndex: i + 1, boxShadow: l.bg === '#fff' ? 'inset 0 0 0 2px #0B0B0A' : undefined }}>
            <span className="ug-like-n">{i + 1}</span>
            <h3>{l.t}</h3>
          </div>
        ))}
      </div>
      <Pad id="likes" />
    </section>
  )
}

/** The dot itself, in a box you can throw it around in. */
function Play({ root, box, boxInv }: { root: React.RefObject<HTMLDivElement>; box: React.RefObject<HTMLDivElement>; boxInv: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.3)
  return (
    <section ref={ref} className="ug-play" data-sec="play" data-tone="dark">
      <h2 className="ug-h"><Slam text="Using a dot to navigate" on={seen} slot="play" /></h2>
      <p className="ug-p">On my site, the period in my name is the navigation. It falls, bounces, and turns into whichever button you need next.</p>
      <p className="ug-p ug-soft">Grab it and throw it. Every hard bounce inverts the box.</p>
      <div ref={box} className="ug-box">
        <div className="ug-ob" style={{ left: '12%', top: '50%', width: 190, height: 66, borderRadius: 33 }} />
        <div className="ug-ob" style={{ left: '46%', top: '20%', width: 116, height: 116, borderRadius: 58 }} />
        <div className="ug-ob" style={{ left: '73%', top: '56%', width: 108, height: 108, borderRadius: 22 }} />
        <div ref={boxInv} className="ug-box-inv" />
      </div>
      <Pad id="play" />
    </section>
  )
}

/* -------- a product idea: the cursor as an agent -------- */

const STEPS = [
  { target: 'task', say: 'Book a room for Thursday at 3.', note: 'You say what you want.' },
  { target: 'date', type: 'Thursday, Oct 8', note: 'It opens the date field.' },
  { target: 'time', type: '3:00 PM', note: 'It fills in the time.' },
  { target: 'room', type: 'Room 4B, fits 6', note: 'It picks a room that fits.' },
  { target: 'book', note: 'It stops before the last click, so you approve it.' },
]
/** The guide hands itself to the agent: run counts handoffs, onDone hands it back. */
function Agent({ root, run, onDone }: { root: React.RefObject<HTMLDivElement>; run: number; onDone: (x: number, y: number) => void }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.3)
  const win = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(-1)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [booked, setBooked] = useState(false)
  const doneRef = useRef(onDone); doneRef.current = onDone
  useEffect(() => {
    if (!run) return
    const at = (key: string) => {
      const w = win.current, el = w?.querySelector<HTMLElement>(`[data-k="${key}"]`)
      if (!w || !el) return { x: 40, y: 40 }
      const a = w.getBoundingClientRect(), b = el.getBoundingClientRect()
      return { x: b.left - a.left + Math.min(46, b.width / 2), y: b.top - a.top + b.height / 2 }
    }
    setStep(-1); setVals({}); setBooked(false)
    const s0 = at('task')
    let raf = 0, last = performance.now(), x = s0.x, y = s0.y, vx = 0, vy = 0, tx = x, ty = y
    let i = -1, wait = 0.5, typing: { key: string; text: string; n: number } | null = null, clickT = 0, over = false
    const timers: number[] = []
    const tick = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000); last = now
      // a spring that overshoots a touch, so it moves like a hand and not a tween
      vx += ((tx - x) * 120 - vx * 15) * dt; vy += ((ty - y) * 120 - vy * 15) * dt; x += vx * dt; y += vy * dt
      const sp = Math.hypot(vx, vy)
      if (typing) {
        typing.n += dt * 22
        const shown = typing.text.slice(0, Math.floor(typing.n)), k = typing.key
        setVals((v) => (v[k] === shown ? v : { ...v, [k]: shown }))
        if (typing.n >= typing.text.length) { typing = null; wait = 0.6 }
      } else if (!over) {
        wait -= dt
        if (wait <= 0) {
          i++
          if (i >= STEPS.length) {
            // hand the dot back to the guide where it stands
            over = true
            const a = win.current!.getBoundingClientRect()
            if (dot.current) dot.current.style.opacity = '0'
            doneRef.current(a.left + x, a.top + y)
          } else {
            const st = STEPS[i]; setStep(i)
            const p = at(st.target); tx = p.x; ty = p.y; clickT = 0.75
            wait = 99
            timers.push(window.setTimeout(() => {
              if (st.say) typing = { key: 'task', text: st.say, n: 0 }
              else if (st.type) typing = { key: st.target, text: st.type, n: 0 }
              else { setBooked(true); wait = 1.5 }
            }, 600))
          }
        }
      }
      clickT = Math.max(0, clickT - dt)
      if (dot.current && !over) {
        const st = Math.min(0.5, sp / 2600), ang = Math.atan2(vy, vx)
        const press = clickT > 0 && clickT < 0.12 ? 0.75 : 1
        dot.current.style.opacity = '1'
        dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${ang}rad) scale(${(1 + st) * press}, ${(1 - st * 0.5) * press})`
        dot.current.style.background = sp > 160 ? '#E02B1D' : '#F5F2EC'
      }
      if (!over) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const d = dot.current
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); if (d) d.style.opacity = '0' }
  }, [run])
  return (
    <section ref={ref} className="ug-agent" data-sec="agent" data-tone="red">
      <h2 className="ug-h"><Slam text="An idea: the cursor as an agent" on={seen} slot="agent" /></h2>
      <p className="ug-p">You tell the dot what you want. It moves through the interface the way you would, so you can watch every step and stop it at any one.</p>
      <div className="ug-agent-row">
        <div ref={win} className="ug-win" data-agent-win>
          <div className="ug-win-bar"><i /><i /><i /><span>Rooms</span></div>
          <div className="ug-field big" data-k="task"><span>Ask the dot</span><b>{vals.task ?? ''}</b></div>
          <div className="ug-grid">
            <div className="ug-field" data-k="date"><span>Date</span><b>{vals.date ?? ''}</b></div>
            <div className="ug-field" data-k="time"><span>Time</span><b>{vals.time ?? ''}</b></div>
            <div className="ug-field wide" data-k="room"><span>Room</span><b>{vals.room ?? ''}</b></div>
          </div>
          <button className={`ug-book ${booked ? 'on' : ''}`} data-k="book" tabIndex={-1}>{booked ? 'Waiting for your OK' : 'Book'}</button>
          <div ref={dot} className="ug-agent-dot" style={{ opacity: 0 }} />
        </div>
        <ol className="ug-steps">
          {STEPS.map((s, i) => <li key={i} className={i === step ? 'on' : i < step ? 'done' : ''}>{s.note}</li>)}
        </ol>
      </div>
      <Pad id="agent" />
    </section>
  )
}

/** The résumé as a run of lines that slam in from alternating sides. */
const ROWS = [
  { what: 'Lila Sciences', how: 'Enterprise GTM co-op. The account-intelligence system behind enterprise sales.' },
  { what: 'Onapsis', how: 'AI GTM intern. 13,000 contacts enriched into a scored pipeline.' },
  { what: 'The Harvard Shop', how: 'Procurement and special projects. $1.3M of inventory, a 60% margin.' },
  { what: 'Harvard', how: 'Computer science, with a secondary in Visual Studies.' },
]
function Resume({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.25)
  return (
    <section ref={ref} className={`ug-resume ${seen ? 'on' : ''}`} data-sec="resume" data-tone="light">
      <h2 className="ug-h"><Slam text="Résumé" on={seen} slot="resume" /></h2>
      <div className="ug-rows">
        {ROWS.map((r, i) => (
          <div key={r.what} className="ug-row" style={{ '--k': i, '--from': i % 2 ? '60vw' : '-60vw' } as V}>
            <b>{r.what}</b>
            <span className="ug-how">{r.how}</span>
          </div>
        ))}
      </div>
      <a className="ug-pdf" href={`${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`} target="_blank" rel="noreferrer" data-soon>Full résumé</a>
      <Pad id="resume" />
    </section>
  )
}

function Contact({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.4)
  return (
    <section ref={ref} className="ug-contact" data-sec="contact" data-tone="dark">
      <h2 className="ug-h"><Slam text="Get in touch" on={seen} slot="contact" /></h2>
      <a className="ug-mail" href={`mailto:${about.email}`}>{about.email}</a>
      <div className="ug-links">
        <a href="https://github.com/pjeon18" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/paul-j-jeon/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <Pad id="contact" />
    </section>
  )
}

/* ------------------------------------------------------------------------- */
/* the whole layer                                                            */
/* ------------------------------------------------------------------------- */

export default function Underground({ onClosed }: { onClosed: () => void }) {
  const ug = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const shaft = useRef<HTMLDivElement>(null)
  const streaks = useRef<(HTMLDivElement | null)[]>([])
  const svgG = useRef<SVGGElement>(null), svgPath = useRef<SVGPathElement>(null), svgFx = useRef<SVGGElement>(null)
  const label = useRef<HTMLDivElement>(null), inv = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null), boxInv = useRef<HTMLDivElement>(null)
  const guide = useRef<Guide | null>(null)
  const where = useRef('land')
  const seq = useRef(0)
  const [landed, setLanded] = useState(false)
  const [chapter, setChapter] = useState('About Me')
  const [agentRun, setAgentRun] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const scrollV = useRef(0)
  const busy = useRef(true)
  const upRef = useRef<() => void>(() => {})

  const q = <T extends Element>(s: string) => ug.current!.querySelector<T>(s)!
  const later = (fn: () => void, ms: number) => { const k = seq.current; window.setTimeout(() => { if (k === seq.current) fn() }, REDUCED() ? 0 : ms) }

  const pending = useRef<string | null>(null)
  const onScreen = (el: Element) => { const b = el.getBoundingClientRect(); return b.top > 70 && b.bottom < innerHeight - 20 }
  /** go to the part's button if you can see it; otherwise wait for the reader to scroll to it */
  const toPad = (id: string) => {
    const g = guide.current
    if (!g || !FLOW[id]?.pad) return
    const pad = q<HTMLElement>(`[data-pad="${id}"]`)
    if (onScreen(pad)) { padOnto(id); return }
    const need = pad.getBoundingClientRect().bottom + 40 - innerHeight
    const slot = q<HTMLElement>(`[data-slot="${id}"]`).getBoundingClientRect()
    if (need > 0 && slot.top - need > 90) { g.glideTo(g.top + need, 700); later(() => (onScreen(pad) ? padOnto(id) : (pending.current = id)), 650); return }
    pending.current = id
  }
  const padOnto = (id: string) => {
    pending.current = null
    const g = guide.current, p = FLOW[id]?.pad
    if (!g || !p) return
    const el = q<HTMLElement>(`[data-pad="${id}"]`)
    if (REDUCED()) g.ontoNow(el, p.kind, p.label, p.next)
    else g.onto(el, p.kind, p.label, p.next)
  }

  /** the dot has landed in a heading; what it does next depends on the part */
  const arrive = (id: string) => {
    const g = guide.current
    if (!g) return
    seq.current++; where.current = id; pending.current = null
    if (id === 'land') { g.start(q('[data-slot="land"]'), 'work'); return }
    if (id === 'play') { later(() => g.enterBox(box.current!, boxInv.current!, () => live.current.toPad('play')), 550); return }
    if (id === 'agent') {
      const task = () => { const r = q<HTMLElement>('[data-k="task"]').getBoundingClientRect(); return { x: r.left + Math.min(46, r.width / 2), y: r.top + r.height / 2 + g.top } }
      later(() => g.hopTo(task, 110, () => { g.hide(); setAgentRun((n) => n + 1) }), 600)
      return
    }
    later(() => toPad(id), 650)
  }

  /** clicking the dot's button: it is thrown at the next heading and the camera follows */
  const go = (next: string) => {
    const g = guide.current
    if (!g || busy.current) return
    if (next === 'up') { upRef.current(); return }
    seq.current++; where.current = next
    const slot = q<HTMLElement>(`[data-slot="${next}"]`)
    if (REDUCED()) { slot.scrollIntoView({ block: 'center' }); g.placeOn(slot); arrive(next); return }
    g.throwTo(slot, true, () => arrive(next))
  }
  const live = useRef({ go, arrive, padOnto, toPad }); live.current = { go, arrive, padOnto, toPad }

  const els = (): DiveEls => ({ shaft: shaft.current!, streaks: streaks.current.filter(Boolean) as HTMLDivElement[], ug: ug.current!, inner: inner.current! })

  // the way down
  useEffect(() => {
    clearShapes()
    const g = new Guide({ root: ug.current!, g: svgG.current!, path: svgPath.current!, fx: svgFx.current!, label: label.current!, inv: inv.current! })
    guide.current = g
    if (import.meta.env.DEV) (window as unknown as { __ug: Guide }).__ug = g
    g.onClick = (n) => live.current.go(n)
    document.body.classList.add('ug-open')
    try { if (location.hash !== '#underground') history.pushState({ ug: 1 }, '', '#underground') } catch { /* no-op */ }
    const f = measureHome()
    const land = () => {
      busy.current = false; setLanded(true)
      if (f) f.home.style.visibility = 'hidden'
      const slot = q<HTMLElement>('[data-slot="land"]')
      if (REDUCED()) { g.placeOn(slot); live.current.arrive('land'); return }
      // the dot swings out of the middle of the screen into the headline
      window.setTimeout(() => g.hopTo(() => g.slot(slot), 150, () => { g.settle(slot); live.current.arrive('land') }), 120)
    }
    let stop = () => {}
    if (REDUCED()) { ug.current!.style.transform = ''; land() }
    else { ug.current!.style.transform = `translateY(${innerHeight * 6}px)`; stop = dive(1, els(), g, f, land) }
    return () => {
      stop(); g.destroy(); guide.current = null
      document.body.classList.remove('ug-open')
      const h = document.querySelector<HTMLElement>('.sh-page')
      if (h) { h.style.transform = ''; h.style.visibility = ''; h.style.clipPath = '' }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the way back up: the dot goes to the middle, the climb, then home renders in around it
  const up = useCallback(() => {
    const g = guide.current
    if (!g || busy.current) return
    busy.current = true; seq.current++; setLeaving(true)
    const finish = () => {
      document.body.classList.remove('ug-open')
      if (location.hash === '#underground') { try { history.replaceState(null, '', location.pathname + location.search) } catch { /* no-op */ } }
      onClosed()
    }
    // on phones the home scrolls; come back to its top so the period is on screen
    window.scrollTo(0, 0)
    const f = measureHome()
    if (REDUCED() || !f) { if (f) f.home.style.visibility = ''; finish(); return }
    const climb = () => {
      // home waits, focused on its period and not drawn yet
      f.home.style.visibility = ''
      f.home.style.transformOrigin = '0 0'
      f.home.style.transform = focusAt(f, 1).t
      f.home.style.clipPath = `circle(0px at ${f.P.x}px ${f.P.y}px)`
      dive(-1, els(), g, null, () => reveal(f, g, () => { shaft.current!.style.display = 'none'; g.hide(); finish() }))
    }
    const cx = innerWidth / 2, cy = innerHeight / 2
    const vy = g.y - g.top
    const visible = g.mode !== 'hidden' && g.mode !== 'off' && vy > -20 && vy < innerHeight + 20
    if (visible) g.hopTo(() => ({ x: cx, y: cy + g.top }), 120, () => { g.pin(cx, cy); window.setTimeout(climb, 160) })
    else { g.pin(cx, cy); climb() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClosed])
  upRef.current = up

  useEffect(() => {
    const pop = () => { if (location.hash !== '#underground') up() }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') up() }
    window.addEventListener('popstate', pop); window.addEventListener('keydown', key)
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('keydown', key) }
  }, [up])

  // scroll velocity (for the work cards), the chapter, and the dot catching up when you scroll on your own
  useEffect(() => {
    const r = ug.current
    if (!r) return
    let lastY = r.scrollTop, lastT = performance.now(), raf = 0
    const tick = (now: number) => {
      const dt = Math.max(1, now - lastT)
      scrollV.current += (((r.scrollTop - lastY) / dt) * 1000 - scrollV.current) * 0.2
      lastY = r.scrollTop; lastT = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const inView = (el: Element | null) => { if (!el) return false; const b = el.getBoundingClientRect(); return b.bottom > 30 && b.top < innerHeight - 30 }
    const iv = window.setInterval(() => {
      const g = guide.current
      let cur: string | null = null
      r.querySelectorAll<HTMLElement>('[data-sec]').forEach((s) => { const b = s.getBoundingClientRect(); if (b.top <= innerHeight * 0.5 && b.bottom > innerHeight * 0.5) cur = s.dataset.sec ?? null })
      if (cur) setChapter(FLOW[cur]?.name ?? '')
      if (!g || busy.current) return
      const pend = pending.current
      if (pend && pend === where.current && (g.mode === 'rest' || g.mode === 'morph')) {
        const pad = r.querySelector<HTMLElement>(`[data-pad="${pend}"]`)
        if (pad) { const b = pad.getBoundingClientRect(); if (b.top > 70 && b.bottom < innerHeight - 20) {
          pending.current = null
          const vy = g.y - g.top
          if (vy > 0 && vy < innerHeight) live.current.padOnto(pend)
          else g.dropOnto(() => g.center(pad), () => live.current.padOnto(pend))
          return
        } }
      }
      if (!cur || cur === where.current) return
      if (['free', 'hop', 'drag', 'pin', 'off'].includes(g.mode)) return
      // only move once the dot is out of sight, so a quick peek doesn't steal it
      const anchor = g.mode === 'hidden' ? r.querySelector('[data-agent-win]') : g.box ? g.box.el : g.at
      if (inView(anchor)) return
      const id: string = cur
      const pad = r.querySelector<HTMLElement>(`[data-pad="${id}"]`), slot = r.querySelector<HTMLElement>(`[data-slot="${id}"]`)
      const p = FLOW[id]?.pad
      seq.current++; where.current = id; pending.current = null
      if (pad && p && inView(pad) && !(slot && inView(slot))) {
        if (REDUCED()) { g.ontoNow(pad, p.kind, p.label, p.next); return }
        g.dropOnto(() => g.center(pad), () => live.current.padOnto(id))
      } else if (slot && inView(slot)) {
        if (REDUCED()) { g.placeOn(slot); live.current.arrive(id); return }
        g.dropOnto(() => g.slot(slot), () => { g.settle(slot); live.current.arrive(id) })
      } else where.current = '?'
    }, 250)
    return () => { cancelAnimationFrame(raf); clearInterval(iv) }
  }, [])

  const handBack = useCallback((x: number, y: number) => {
    const g = guide.current
    if (!g || where.current !== 'agent' || g.mode !== 'hidden') return
    g.showAt(x, y)
    later(() => live.current.toPad('agent'), 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div ref={shaft} className="ug-shaft" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => <div key={i} ref={(e) => { streaks.current[i] = e }} className="ug-streak" />)}
      </div>
      <div ref={ug} className={`ug ${landed ? 'landed' : ''}`} role="dialog" aria-label="About Me">
        <div ref={inner}>
          <section className="ug-land" data-sec="land" data-tone="dark">
            <h1 aria-label="About Me">About Me<i className="ug-slot" data-slot="land" /></h1>
            <p className="ug-lede">Press the dot. It will walk you through my work, the things I like, an idea I keep coming back to, my résumé, and how to reach me.</p>
          </section>
          <Work root={ug} scrollV={scrollV} />
          <Likes root={ug} />
          <Play root={ug} box={box} boxInv={boxInv} />
          <Agent root={ug} run={agentRun} onDone={handBack} />
          <Resume root={ug} />
          <Contact root={ug} />
        </div>
      </div>
      <div ref={inv} className="ug-inv" aria-hidden="true" />
      <svg className="ug-guide" aria-hidden="true"><g ref={svgFx} /><g ref={svgG}><path ref={svgPath} /></g></svg>
      <div ref={label} className="ug-guide-label" aria-hidden="true" />
      {landed && !leaving && (
        <div className="ug-hud">
          <button onClick={up} className="ug-hud-up" aria-label="Back to the top">↑</button>
          <span>{chapter}</span>
        </div>
      )}
    </>
  )
}

export function UndergroundArrow({ onDive }: { onDive: () => void }): ReactNode {
  return (
    <button className="ug-arrow" onClick={onDive} aria-label="About me" data-say="About me">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  )
}
