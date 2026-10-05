import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { about, cards, type Card } from '../../content/site'
import '../../styles/underground.css'

// ============================================================================
// The underground. A second, louder half of the home page that you fall into.
// The arrow at the bottom of the home starts a dive: the page crouches, then
// accelerates away while everything stretches with speed and the light goes
// from paper to black. It lands with inertia (the content arrives a beat after
// the camera) and the falling dot becomes the period of the first headline.
// Below that: work at speed, the things Paul likes as a pile you can throw,
// the dot as an interface, a cursor agent, the résumé, and a way back up.
// Every motion here is integrated in rAF; nothing is a CSS timeline.
// ============================================================================

type V = CSSProperties & Record<`--${string}`, string | number>
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`
const PAPER = [253, 253, 251], INK = [11, 11, 10]
const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------------- */
/* the dive                                                                   */
/* ------------------------------------------------------------------------- */

interface DiveEls { home: HTMLElement | null; shaft: HTMLDivElement; streaks: HTMLDivElement[]; ug: HTMLDivElement; inner: HTMLDivElement; dot: HTMLDivElement }

/**
 * dir 1 goes down into the underground, -1 climbs back to the surface.
 * Depth D runs from 0 to LAND. It crouches, accelerates on a cubic (so the
 * speed keeps climbing), then a damped spring brings it to rest past the
 * target and back, which is the camera catching up.
 */
function dive(dir: 1 | -1, el: DiveEls, onLand: () => void) {
  const H = window.innerHeight
  const LAND = H * 6
  const TB = 1.05                                  // seconds of acceleration
  const DB = H * 4.2                               // depth covered while accelerating
  const crouch = 0.24
  const t0 = performance.now()
  let D = 0, v = 0, last = t0, phase: 'crouch' | 'fall' | 'land' = 'crouch', dark = 0, done = false
  const streaks = el.streaks.map((s, i) => ({ s, x: Math.random() * 100, y: Math.random() * (H + 400), par: 0.4 + (i % 5) * 0.22 }))
  el.shaft.style.display = 'block'
  el.dot.style.display = 'block'

  const frame = (now: number) => {
    const t = (now - t0) / 1000
    const dt = Math.min(0.034, (now - last) / 1000); last = now
    let crouchY = 0
    if (phase === 'crouch') {
      crouchY = Math.sin(clamp(t / crouch) * Math.PI) * 18      // a small dip before the drop
      if (t >= crouch) phase = 'fall'
    }
    if (phase === 'fall') {
      const u = clamp((t - crouch) / TB)
      const nD = DB * u * u * u
      v = (nD - D) / Math.max(dt, 0.001); D = nD
      if (u >= 1) { phase = 'land'; v = (3 * DB) / TB }
    } else if (phase === 'land') {
      // underdamped: it slides past the landing and the camera settles back onto it
      v += ((LAND - D) * 110 - v * 17) * dt
      D += v * dt
      if (Math.abs(LAND - D) < 1.2 && Math.abs(v) < 15) { D = LAND; v = 0; finish(); return }
    }
    const speed = Math.abs(v)
    dark = dir === 1 ? Math.max(dark, clamp(speed / 7000), phase === 'land' ? clamp((D - DB) / (LAND - DB)) : 0) : 1 - Math.max(1 - dark, clamp(speed / 7000), phase === 'land' ? clamp((D - DB) / (LAND - DB)) : 0)
    if (dir === -1 && t < 0.02) dark = 1
    const bg = mix(PAPER, INK, dark), fg = mix(INK, PAPER, dark)
    el.shaft.style.background = bg
    // the page you are leaving stretches backwards as it goes
    const stretch = Math.min(0.7, speed / 9000)
    const leave = dir === 1 ? el.home : el.ug
    const arrive = dir === 1 ? el.ug : el.home
    if (leave) {
      leave.style.transformOrigin = dir === 1 ? '50% 100%' : '50% 0%'
      leave.style.transform = `translateY(${dir * (-D) + crouchY}px) scaleY(${1 + stretch})`
    }
    if (arrive) {
      const lag = clamp(v * 0.03, -90, 90)                       // the content trails the camera
      arrive.style.transform = `translateY(${dir * (LAND - D)}px)`
      if (arrive === el.ug) el.inner.style.transform = `translateY(${lag}px)`
    }
    streaks.forEach((k) => {
      const len = 4 + speed * 0.035 * k.par
      const y = ((((k.y - dir * D * k.par) % (H + 400)) + (H + 400)) % (H + 400)) - 200
      k.s.style.transform = `translate(${k.x}vw, ${y}px) scaleY(${len})`
      k.s.style.background = fg
      k.s.style.opacity = String(clamp(speed / 2500) * 0.55)
    })
    // the dot falls with you, stretching into a streak
    const ds = Math.min(7, 1 + speed / 1700)
    el.dot.style.background = fg
    el.dot.style.transform = `translate(-50%, -50%) scale(${1 / Math.sqrt(ds)}, ${ds})`
    el.dot.style.opacity = phase === 'land' && dir === 1 ? String(clamp((LAND - D) / (H * 0.5))) : '1'
    raf = requestAnimationFrame(frame)
  }
  const finish = () => {
    if (done) return
    done = true
    el.shaft.style.display = 'none'
    el.dot.style.display = 'none'
    if (el.home) el.home.style.transform = dir === 1 ? `translateY(${-LAND}px)` : ''
    el.ug.style.transform = dir === 1 ? '' : `translateY(${LAND}px)`
    el.inner.style.transform = ''
    onLand()
  }
  let raf = requestAnimationFrame(frame)
  const safety = window.setTimeout(finish, 4200)
  return () => { cancelAnimationFrame(raf); clearTimeout(safety) }
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

/** letters that slam in from below with a little rotation, one after another */
function Slam({ text, on, className = '', delay = 0 }: { text: string; on: boolean; className?: string; delay?: number }) {
  return (
    <span className={`ug-slam ${on ? 'on' : ''} ${className}`} aria-label={text}>
      {text.split(' ').map((w, wi, ws) => {
        // letters animate one by one, but each word stays on one line
        const start = ws.slice(0, wi).reduce((n, x) => n + x.length + 1, 0)
        return (
          <Fragment key={wi}>{wi > 0 ? ' ' : ''}<span className="ug-word" aria-hidden="true">
            {[...w].map((c, j) => { const i = start + j; return <span key={j} style={{ '--i': i, '--d': `${delay}ms`, '--r': `${((i * 37) % 11) - 5}deg` } as V}>{c}</span> })}
          </span></Fragment>
        )
      })}
    </span>
  )
}

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
      if (r && s && tr) {
        const top = s.offsetTop - r.scrollTop
        const span = s.offsetHeight - r.clientHeight
        const p = clamp(-top / Math.max(1, span))
        const max = tr.scrollWidth - window.innerWidth + 80
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
    <section ref={sec} className="ug-work" style={{ height: `${list.length * 34 + 100}vh` }} data-ug="Work">
      <div className="ug-pin">
        <div ref={words} className="ug-bigword" aria-hidden="true">WORK WORK WORK WORK</div>
        <h2 className="ug-h">Work.</h2>
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
      </div>
    </section>
  )
}

/** The things Paul likes, as a pile that falls in and can be thrown. */
const LIKES = ['painting', 'music, loud', 'old Pokémon on a Game Boy', '2018 James Harden', 'designing clothes', 'logos in Figma', 'designs that feel special', 'clarity', 'snacks', 'Cambridge, MA']
function Likes({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.45)
  const box = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    if (!seen || !box.current) return
    const W = box.current.clientWidth, H = box.current.clientHeight
    const g = 2400
    const B = LIKES.map((t, i) => {
      const r = Math.max(54, Math.min(110, t.length * 6.4 + 26))
      return { r, x: r + ((i * 211) % Math.max(1, W - 2 * r)), y: -r - i * 90, vx: (Math.random() - 0.5) * 300, vy: 0, a: 0, va: (Math.random() - 0.5) * 3 }
    })
    let drag: { i: number; ox: number; oy: number; hist: { x: number; y: number; t: number }[] } | null = null
    const down = (e: PointerEvent) => {
      const rect = box.current!.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top
      const i = B.findIndex((b) => Math.hypot(b.x - x, b.y - y) < b.r)
      if (i < 0) return
      drag = { i, ox: B[i].x - x, oy: B[i].y - y, hist: [{ x, y, t: performance.now() }] }
      box.current!.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const rect = box.current!.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top
      const b = B[drag.i]; b.x = x + drag.ox; b.y = y + drag.oy; b.vx = b.vy = 0
      drag.hist.push({ x, y, t: performance.now() }); if (drag.hist.length > 5) drag.hist.shift()
    }
    const up = () => {
      if (!drag) return
      const h = drag.hist, a = h[0], z = h[h.length - 1], dt = Math.max(0.016, (z.t - a.t) / 1000)
      const b = B[drag.i]; b.vx = clamp((z.x - a.x) / dt, -3200, 3200); b.vy = clamp((z.y - a.y) / dt, -3200, 3200); b.va = b.vx * 0.004
      drag = null
    }
    const el = box.current
    el.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
    let raf = 0, last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000); last = now
      for (let s = 0; s < 3; s++) {
        const h = dt / 3
        B.forEach((b, i) => {
          if (drag?.i === i) return
          b.vy += g * h; b.x += b.vx * h; b.y += b.vy * h; b.a += b.va * h
          if (b.y > H - b.r) { b.y = H - b.r; if (b.vy > 0) b.vy *= -0.38; b.vx *= 0.96; b.va *= 0.9 }
          if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.6 }
          if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.6 }
        })
        for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
          const a = B[i], b = B[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, o = a.r + b.r - d
          if (o <= 0) continue
          const nx = dx / d, ny = dy / d
          // a held chip does not move; the other one takes the whole push
          const wa = drag?.i === i ? 0 : drag?.i === j ? 1 : 0.5, wb = 1 - wa
          a.x -= nx * o * wa; a.y -= ny * o * wa; b.x += nx * o * wb; b.y += ny * o * wb
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
          if (rv < 0) { const imp = -rv * 0.85; a.vx -= imp * nx * wa; a.vy -= imp * ny * wa; b.vx += imp * nx * wb; b.vy += imp * ny * wb }
        }
      }
      B.forEach((b, i) => { const c = chips.current[i]; if (c) c.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px) rotate(${b.a}rad)` })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [seen])
  return (
    <section ref={ref} className="ug-likes" data-ug="About">
      <h2 className="ug-h"><Slam text="Things I like." on={seen} /></h2>
      <p className="ug-p">I’m a senior at Harvard in computer science, with a secondary in Visual Studies. Grab one and throw it.</p>
      <div ref={box} className="ug-pile">
        {LIKES.map((t, i) => {
          const r = Math.max(54, Math.min(110, t.length * 6.4 + 26))
          return <button key={t} ref={(e) => { chips.current[i] = e }} className={`ug-chip c${i % 4}`} style={{ width: r * 2, height: r * 2 }}>{t}</button>
        })}
      </div>
    </section>
  )
}

/* -------- the dot as an interface: one shape becoming every button -------- */

const NPT = 96
function sampleShape(sdf: (x: number, y: number) => number) {
  const out = new Float32Array(NPT * 2)
  for (let i = 0; i < NPT; i++) {
    const a = -Math.PI / 2 + (i / NPT) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
    let lo = 0, hi = 500
    for (let k = 0; k < 26; k++) { const m = (lo + hi) / 2; if (sdf(c * m, s * m) > 0) hi = m; else lo = m }
    out[i * 2] = c * lo; out[i * 2 + 1] = s * lo
  }
  return out
}
const rr = (w: number, h: number, r: number) => (x: number, y: number) => { const qx = Math.abs(x) - w / 2 + r, qy = Math.abs(y) - h / 2 + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r }
const poly = (p: number[][], round: number) => (x: number, y: number) => { let d = -1e9; for (let i = 0; i < p.length; i++) { const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length], l = Math.hypot(bx - ax, by - ay); d = Math.max(d, ((x - ax) * (by - ay) - (y - ay) * (bx - ax)) / l) } return d - round }
const SHAPES = [
  { label: '', pts: sampleShape((x, y) => Math.hypot(x, y) - 18) },
  { label: 'Work', pts: sampleShape(rr(220, 84, 42)) },
  { label: 'About', pts: sampleShape((x, y) => Math.hypot(x, y) - 74) },
  { label: 'Résumé', pts: sampleShape(rr(150, 150, 30)) },
  { label: 'Contact', pts: sampleShape(poly([[-108, -30], [70, -30], [102, 0], [70, 30], [-108, 30]], 12)) },
  { label: 'Play', pts: sampleShape(poly([0, 1, 2].map((i) => [Math.cos(i * 2.094) * 82, Math.sin(i * 2.094) * 82]), 14)) },
]
function DotUI({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.4)
  const path = useRef<SVGPathElement>(null)
  const lab = useRef<HTMLSpanElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!seen) return
    let raf = 0, last = performance.now()
    let from = SHAPES[0].pts, to = SHAPES[0].pts, s = 1, sv = 0, idx = 0, hold = 0.6
    let y = -220, vy = 0, q = 0, qv = 0, landed = false, inv = false
    const floor = 0
    const tick = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000); last = now
      if (!landed) {
        vy += 3200 * dt; y += vy * dt
        if (y > floor) {
          y = floor
          if (vy > 160) {
            qv += vy * 0.0011; inv = !inv; stage.current?.classList.toggle('inv', inv); vy *= -0.55
          } else { vy = 0; landed = true }
        }
      } else {
        hold -= dt
        if (hold <= 0) {
          idx = (idx + 1) % SHAPES.length
          from = blend(from, to, s); to = SHAPES[idx].pts; s = 0; sv = 0; hold = idx === 0 ? 1.1 : 1.5
          if (idx === 0) { landed = false; y = floor; vy = -1500 }        // back to a dot, then another bounce
          qv += 0.5
        }
      }
      sv += ((1 - s) * 260 - sv * 14) * dt; s += sv * dt
      qv += (-q * 600 - qv * 15) * dt; q += qv * dt
      const pts = blend(from, to, s)
      let d = ''
      for (let i = 0; i < NPT; i++) d += (i ? 'L' : 'M') + pts[i * 2].toFixed(1) + ' ' + (pts[i * 2 + 1] + y).toFixed(1)
      if (path.current) {
        path.current.setAttribute('d', d + 'Z')
        path.current.setAttribute('transform', `translate(0 ${y}) scale(${1 + clamp(q, -0.3, 0.4)} ${1 - clamp(q, -0.3, 0.4)}) translate(0 ${-y})`)
      }
      if (lab.current) { lab.current.textContent = SHAPES[idx].label; lab.current.style.opacity = String(clamp((s - 0.55) / 0.45)); lab.current.style.transform = `translate(-50%, calc(-50% + ${y}px))` }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen])
  return (
    <section ref={ref} className="ug-dotui" data-ug="Ideas">
      <div className="ug-split">
        <div>
          <h2 className="ug-h"><Slam text="Using a dot to navigate." on={seen} /></h2>
          <p className="ug-p">On my site, the period in my name is the navigation. It falls, it bounces, and it turns into whatever button you need next.</p>
          <p className="ug-p ug-soft">A pill for work, a circle for about, a square for the résumé. The shape tells you where it leads before you read it.</p>
        </div>
        <div ref={stage} className="ug-stage">
          <svg viewBox="-260 -260 520 520"><path ref={path} /></svg>
          <span ref={lab} className="ug-stage-lab" />
        </div>
      </div>
    </section>
  )
}
function blend(a: Float32Array, b: Float32Array, s: number) { const o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] + (b[i] - a[i]) * s; return o }

/* -------- a product idea: the cursor as an agent -------- */

const STEPS = [
  { target: 'task', say: 'Book a room for Thursday at 3.', note: 'You say what you want.' },
  { target: 'date', type: 'Thursday, Oct 8', note: 'It opens the date field.' },
  { target: 'time', type: '3:00 PM', note: 'It fills in the time.' },
  { target: 'room', type: 'Room 4B, fits 6', note: 'It picks a room that fits.' },
  { target: 'book', note: 'It stops before the last click, so you approve it.' },
]
function Agent({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.4)
  const win = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(-1)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [booked, setBooked] = useState(false)
  useEffect(() => {
    if (!seen) return
    let raf = 0, last = performance.now(), x = 40, y = 40, vx = 0, vy = 0, tx = 40, ty = 40
    let i = -1, wait = 0.8, typing: { key: string; text: string; n: number } | null = null, clickT = 0
    const at = (key: string) => {
      const w = win.current, el = w?.querySelector<HTMLElement>(`[data-k="${key}"]`)
      if (!w || !el) return { x: 40, y: 40 }
      const a = w.getBoundingClientRect(), b = el.getBoundingClientRect()
      return { x: b.left - a.left + Math.min(46, b.width / 2), y: b.top - a.top + b.height / 2 }
    }
    const tick = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000); last = now
      // a spring that overshoots a touch, so it moves like a hand and not a tween
      vx += ((tx - x) * 120 - vx * 15) * dt; vy += ((ty - y) * 120 - vy * 15) * dt; x += vx * dt; y += vy * dt
      const sp = Math.hypot(vx, vy)
      if (typing) {
        typing.n += dt * 22
        const shown = typing.text.slice(0, Math.floor(typing.n))
        const k = typing.key
        setVals((v) => (v[k] === shown ? v : { ...v, [k]: shown }))
        if (typing.n >= typing.text.length) { typing = null; wait = 0.7 }
      } else {
        wait -= dt
        if (wait <= 0) {
          i++
          if (i >= STEPS.length) { i = -1; wait = 2.2; setStep(-1); setVals({}); setBooked(false); tx = 40; ty = 40 }
          else {
            const st = STEPS[i]; setStep(i)
            const p = at(st.target); tx = p.x; ty = p.y; clickT = 0.75
            wait = 99
            window.setTimeout(() => {
              if (st.say) typing = { key: 'task', text: st.say, n: 0 }
              else if (st.type) typing = { key: st.target, text: st.type, n: 0 }
              else { setBooked(true); wait = 1.6 }
            }, 650)
          }
        }
      }
      clickT = Math.max(0, clickT - dt)
      if (dot.current) {
        const st = Math.min(0.5, sp / 2600), ang = Math.atan2(vy, vx)
        const press = clickT > 0 && clickT < 0.12 ? 0.75 : 1
        dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${ang}rad) scale(${(1 + st) * press}, ${(1 - st * 0.5) * press})`
        dot.current.style.background = sp > 160 ? '#E02B1D' : '#FDFDFB'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen])
  return (
    <section ref={ref} className="ug-agent" data-ug="Agent">
      <h2 className="ug-h"><Slam text="An idea: the cursor as an agent." on={seen} /></h2>
      <p className="ug-p">You tell the dot what you want. It moves through the interface the way you would, so you can watch every step and stop it at any one.</p>
      <div className="ug-agent-row">
        <div ref={win} className="ug-win">
          <div className="ug-win-bar"><i /><i /><i /><span>Rooms</span></div>
          <div className="ug-field big" data-k="task"><span>Ask the dot</span><b>{vals.task ?? ''}</b></div>
          <div className="ug-grid">
            <div className="ug-field" data-k="date"><span>Date</span><b>{vals.date ?? ''}</b></div>
            <div className="ug-field" data-k="time"><span>Time</span><b>{vals.time ?? ''}</b></div>
            <div className="ug-field wide" data-k="room"><span>Room</span><b>{vals.room ?? ''}</b></div>
          </div>
          <button className={`ug-book ${booked ? 'on' : ''}`} data-k="book" tabIndex={-1}>{booked ? 'Waiting for your OK' : 'Book'}</button>
          <div ref={dot} className="ug-agent-dot" />
        </div>
        <ol className="ug-steps">
          {STEPS.map((s, i) => <li key={i} className={i === step ? 'on' : i < step ? 'done' : ''}>{s.note}</li>)}
        </ol>
      </div>
    </section>
  )
}

/** The résumé as a run of lines that slam in from alternating sides. */
const ROWS = [
  { when: 'Now', what: 'Lila Sciences', how: 'Enterprise GTM co-op. The account-intelligence system behind enterprise sales.' },
  { when: '2026', what: 'Onapsis', how: 'AI GTM intern. 13,000 contacts enriched into a scored pipeline.' },
  { when: 'Before', what: 'The Harvard Shop', how: 'Procurement and special projects. $1.3M of inventory, a 60% margin.' },
  { when: "’27", what: 'Harvard', how: 'Computer science, with a secondary in Visual Studies.' },
]
function Resume({ root }: { root: React.RefObject<HTMLDivElement> }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.3)
  return (
    <section ref={ref} className={`ug-resume ${seen ? 'on' : ''}`} data-ug="Résumé">
      <h2 className="ug-h"><Slam text="Résumé." on={seen} /></h2>
      <div className="ug-rows">
        {ROWS.map((r, i) => (
          <div key={r.what} className="ug-row" style={{ '--k': i, '--from': i % 2 ? '60vw' : '-60vw' } as V}>
            <b>{r.what}</b>
            <span className="ug-how">{r.how}</span>
          </div>
        ))}
      </div>
      <a className="ug-pdf" href={`${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`} target="_blank" rel="noreferrer" data-soon>Full résumé</a>
    </section>
  )
}

function Contact({ root, onUp }: { root: React.RefObject<HTMLDivElement>; onUp: () => void }) {
  const [ref, seen] = useSeen<HTMLDivElement>(root, 0.4)
  return (
    <section ref={ref} className="ug-contact" data-ug="Contact">
      <h2 className="ug-h"><Slam text="Get in touch." on={seen} /></h2>
      <a className="ug-mail" href={`mailto:${about.email}`}>{about.email}</a>
      <div className="ug-links">
        <a href="https://github.com/pjeon18" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/paul-j-jeon/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <button className="ug-up" onClick={onUp} aria-label="Back to the surface"><span className="ug-up-dot" /> Back to the surface</button>
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
  const dot = useRef<HTMLDivElement>(null)
  const period = useRef<HTMLSpanElement>(null)
  const [landed, setLanded] = useState(false)
  const [chapter, setChapter] = useState('')
  const scrollV = useRef(0)
  const busy = useRef(false)

  const els = (): DiveEls => ({ home: document.querySelector<HTMLElement>('.sh-page'), shaft: shaft.current!, streaks: streaks.current.filter(Boolean) as HTMLDivElement[], ug: ug.current!, inner: inner.current!, dot: dot.current! })

  // the way down
  useEffect(() => {
    busy.current = true
    document.body.classList.add('ug-open')
    try { history.pushState({ ug: 1 }, '', '#underground') } catch { /* no-op */ }
    if (REDUCED()) { const e = els(); if (e.home) e.home.style.visibility = 'hidden'; e.ug.style.transform = ''; busy.current = false; setLanded(true); return }
    ug.current!.style.transform = `translateY(${window.innerHeight * 6}px)`
    const stop = dive(1, els(), () => { busy.current = false; setLanded(true) })
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the way back up
  const up = useCallback(() => {
    if (busy.current) return
    busy.current = true
    const done = () => {
      const h = document.querySelector<HTMLElement>('.sh-page')
      if (h) { h.style.transform = ''; h.style.visibility = '' }
      document.body.classList.remove('ug-open')
      if (location.hash === '#underground') { try { history.replaceState(null, '', location.pathname + location.search) } catch { /* no-op */ } }
      onClosed()
    }
    if (REDUCED()) return done()
    ug.current!.scrollTo({ top: 0 })
    const h = document.querySelector<HTMLElement>('.sh-page')
    if (h) h.style.transform = `translateY(${-window.innerHeight * 6}px)`
    dive(-1, els(), done)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClosed])

  useEffect(() => {
    const pop = () => { if (location.hash !== '#underground') up() }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') up() }
    window.addEventListener('popstate', pop); window.addEventListener('keydown', key)
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('keydown', key) }
  }, [up])

  // scroll velocity (for the work cards) and the current chapter
  useEffect(() => {
    const r = ug.current
    if (!r) return
    let lastY = r.scrollTop, lastT = performance.now(), raf = 0
    const tick = (now: number) => {
      const dt = Math.max(1, now - lastT)
      const v = ((r.scrollTop - lastY) / dt) * 1000
      scrollV.current += (v - scrollV.current) * 0.2
      lastY = r.scrollTop; lastT = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setChapter((e.target as HTMLElement).dataset.ug ?? '') }), { root: r, threshold: 0.35 })
    r.querySelectorAll('[data-ug]').forEach((s) => io.observe(s))
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  return (
    <>
      <div ref={shaft} className="ug-shaft" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => <div key={i} ref={(e) => { streaks.current[i] = e }} className="ug-streak" />)}
      </div>
      <div ref={dot} className="ug-fall" aria-hidden="true" />
      <div ref={ug} className={`ug ${landed ? 'landed' : ''}`} role="dialog" aria-label="Underground">
        <div ref={inner}>
          <section className="ug-land" data-ug="Underground">
            <h1>Underground<span ref={period} className={`ug-period ${landed ? 'on' : ''}`} /></h1>
            <p className="ug-lede">This is the rest of my site: my work, the things I like, an idea I keep coming back to, my résumé, and how to reach me.</p>
          </section>
          <Work root={ug} scrollV={scrollV} />
          <Likes root={ug} />
          <DotUI root={ug} />
          <Agent root={ug} />
          <Resume root={ug} />
          <Contact root={ug} onUp={up} />
        </div>
      </div>
      {landed && (
        <div className="ug-hud">
          <button onClick={up} className="ug-hud-up" aria-label="Back to the surface">↑</button>
          <span>{chapter}</span>
        </div>
      )}
    </>
  )
}

export function UndergroundArrow({ onDive }: { onDive: () => void }): ReactNode {
  return (
    <button className="ug-arrow" onClick={onDive} aria-label="Go underground" data-say="Go underground">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  )
}
