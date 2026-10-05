// The case-study story kit. Every long case study is told as a sequence of
// beats at one size, revealed in order, with dark and colored bands as breaks.
// One motion primitive (words rising out of a mask) runs through all of it,
// and every timing pulls from the tokens at the top of story.css.
import React, {
  Children, Fragment, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect,
  useRef, useState,
  type CSSProperties, type ReactElement, type ReactNode,
} from 'react'
import '../../styles/story.css'

type V = CSSProperties & Record<`--${string}`, string | number>
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ')
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------------------------------------------------------------------------
// scroll plumbing

function useScroll(cb: () => void, deps: unknown[] = []) {
  const saved = useRef(cb)
  saved.current = cb
  useEffect(() => {
    let raf = 0
    const run = () => { raf = 0; saved.current() }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    run()
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** progress 0..1 through a tall track whose child is sticky */
function trackProgress(el: HTMLElement | null) {
  if (!el) return { p: 0, top: Infinity }
  const r = el.getBoundingClientRect()
  return { p: clamp(-r.top / Math.max(1, r.height - window.innerHeight)), top: r.top }
}

function scrollToTrack(el: HTMLElement | null, p: number) {
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY + p * (el.offsetHeight - window.innerHeight) + 2
  window.scrollTo({ top, behavior: 'smooth' })
}

function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen] as const
}

/** two animation frames, so a freshly mounted element paints hidden before it transitions in */
function useArmed() {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    let a = 0, b = 0
    a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setArmed(true)) })
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b) }
  }, [])
  return armed
}

/** hold the old value while it animates out, then hand over the new one */
export function useSwap<T>(value: T, outMs = 320) {
  const [shown, setShown] = useState(value)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  useEffect(() => {
    if (value === shown) return
    setPhase('out')
    const t = setTimeout(() => { setShown(value); setPhase('in') }, reduced() ? 0 : outMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return [shown, phase] as const
}

// ---------------------------------------------------------------------------
// the motion primitive

/** counts up to `to` once `run` turns true */
export function Count({ to, suffix = '', prefix = '', run, delay = 0, ms = 1300, decimals = 0, group = false }: { to: number; suffix?: string; prefix?: string; run: boolean; delay?: number; ms?: number; decimals?: number; group?: boolean }) {
  const [v, setV] = useState(reduced() ? to : 0)
  useEffect(() => {
    if (!run) { setV(reduced() ? to : 0); return }
    if (reduced()) { setV(to); return }
    let raf = 0
    const t = setTimeout(() => {
      const t0 = performance.now()
      const f = (now: number) => {
        const p = clamp((now - t0) / ms)
        setV(to * (1 - Math.pow(1 - p, 4)))
        if (p < 1) raf = requestAnimationFrame(f)
      }
      raf = requestAnimationFrame(f)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [run, to, delay, ms])
  const shown = group ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : v.toFixed(decimals)
  return <span className="st-num">{prefix}{shown}{suffix}</span>
}

function splitNodes(node: ReactNode, c: { i: number; chars?: boolean }): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).split(/(\s+)/).map((p, k) => {
      if (!p) return null
      if (/^\s+$/.test(p)) return ' '
      // per-character mode keeps each word in one unbreakable span
      if (c.chars) return <span className="st-wd" key={k}>{[...p].map((ch, j) => <span key={j} className="st-wi" style={{ '--i': c.i++ } as V}>{ch}</span>)}</span>
      return <span className="st-wd" key={k}><span className="st-wi" style={{ '--i': c.i++ } as V}>{p}</span></span>
    })
  }
  if (Array.isArray(node)) return node.map((n, k) => <Fragment key={k}>{splitNodes(n, c)}</Fragment>)
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; 'data-unit'?: boolean }>
    if (el.type === 'br') return el
    if (el.type === Count || el.props['data-unit']) {
      return <span className="st-wd"><span className="st-wi" style={{ '--i': c.i++ } as V}>{el}</span></span>
    }
    return cloneElement(el, undefined, splitNodes(el.props.children, c))
  }
  return node
}

/** the ways a line can arrive. Each beat picks one from what it is, so no
 *  two neighbours enter the same way */
export type Fx = 'rise' | 'drop' | 'slide' | 'slide-r' | 'blur' | 'pop' | 'type' | 'wipe'

type RiseState = 'hidden' | 'in' | 'out'
interface RiseProps {
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  children: ReactNode
  /** controlled state. Omit to reveal once on scroll into view. */
  state?: RiseState
  delay?: number
  fx?: Fx
}

/** text whose words rise out of a mask, one after another */
export function Rise({ as = 'p', className, style, children, state, delay = 0, fx = 'rise' }: RiseProps) {
  const [ref, seen] = useInView<HTMLElement>(0.25)
  const armed = useArmed()
  const st: RiseState = state ?? (seen ? 'in' : 'hidden')
  const Tag = as as React.ElementType
  return (
    <Tag
      ref={ref}
      className={cx('st-rise', `st-fx-${fx}`, className, armed && st === 'in' && 'go', st === 'out' && 'out')}
      style={{ ...style, '--d': `${delay}ms` } as V}
    >
      {splitNodes(children, { i: 0, chars: fx === 'type' })}
    </Tag>
  )
}

type Size = 'm' | 'l' | 'xl' | 'xxl'
type Align = 'left' | 'right' | 'center' | 'indent'
type Tone = 'ink' | 'soft' | 'acc' | 'light' | 'warm'

/** one beat of the story, set large */
const isQuote = (n: ReactNode) => typeof n === 'string' && /^[“"]/.test(n)

function pickFx(children: ReactNode, size: Size, align: Align, tone?: Tone): Fx {
  if (isQuote(children)) return 'type'
  if (tone === 'acc' || tone === 'warm') return 'pop'
  if (align === 'right') return 'slide-r'
  if (align === 'indent') return 'slide'
  if (align === 'center') return 'blur'
  if (tone === 'soft' || size === 'm') return 'blur'
  return size === 'xxl' ? 'drop' : 'rise'
}

export function Say({ children, size = 'l', align = 'left', tone, delay, as = 'p', className, state, fx }: { children: ReactNode; size?: Size; align?: Align; tone?: Tone; delay?: number; as?: keyof React.JSX.IntrinsicElements; className?: string; state?: RiseState; fx?: Fx }) {
  return <Rise as={as} delay={delay} state={state} fx={fx ?? pickFx(children, size, align, tone)} className={cx('st-say', `st-${size}`, `st-a-${align}`, tone && `st-t-${tone}`, className)}>{children}</Rise>
}

/** a run of beats that each rise as they scroll in */
export function Beats({ lines, gap = 'm' }: { lines: { text: ReactNode; size?: Size; align?: Align; tone?: Tone; fx?: Fx }[]; gap?: 's' | 'm' | 'l' }) {
  return (
    <div className={cx('st-beats', `st-gap-${gap}`)}>
      {lines.map((l, i) => <Say key={i} size={l.size} align={l.align} tone={l.tone} fx={l.fx}>{l.text}</Say>)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// page furniture

/** section opener. `name` feeds the chapter rail */
export function Chapter({ n, title, name, id }: { n: string; title: string; name?: string; id?: string }) {
  return (
    <header className="st-chapter" data-chapter={name ?? title} id={id}>
      <Rise as="h2" fx="wipe" className="st-chapter-h"><span className="st-chapter-n" data-unit>{n}</span> {title}</Rise>
    </header>
  )
}

type BandTone = 'night' | 'band' | 'acc' | 'cream' | 'tint' | 'paper'
const DARK: BandTone[] = ['night', 'band']

/** full-bleed color band. Dark tones flip the chrome to light */
export function Band({ tone, children, className, style }: { tone: BandTone; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={cx('st-band', `st-band-${tone}`, className)} data-dark={DARK.includes(tone) ? '1' : undefined} style={style}>
      {children}
    </section>
  )
}

/** progress hairline, chapter rail, and which part you are in */
export function StoryChrome() {
  const bar = useRef<HTMLDivElement>(null)
  const [chapters, setChapters] = useState<{ el: HTMLElement; name: string }[]>([])
  const [cur, setCur] = useState(0)
  const [started, setStarted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setChapters([...document.querySelectorAll<HTMLElement>('[data-chapter]')].map((el) => ({ el, name: el.dataset.chapter ?? '' }))), 50)
    return () => clearTimeout(t)
  }, [])

  useScroll(() => {
    const h = document.documentElement
    const p = clamp(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    let c = 0
    chapters.forEach((ch, i) => { if (ch.el.getBoundingClientRect().top < window.innerHeight * 0.5) c = i })
    setCur(c)
    setStarted(!!chapters[0] && chapters[0].el.getBoundingClientRect().top < window.innerHeight * 0.5)
    const mid = window.innerHeight / 2
    setDark([...document.querySelectorAll<HTMLElement>('[data-dark="1"]')].some((el) => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid }))
  }, [chapters])

  return (
    <>
      <div className="st-prog" ref={bar} />
      <nav className={cx('st-rail', dark && 'is-dark')} aria-label="Chapters">
        {chapters.map((ch, i) => (
          <button key={i} className={cx(i === cur && 'on', i < cur && 'done')} title={ch.name} aria-label={ch.name}
            onClick={() => window.scrollTo({ top: ch.el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' })} />
        ))}
      </nav>
      <div className={cx('st-left', dark && 'is-dark', started && chapters.length > 0 && 'on')} aria-hidden="true">
        Part <span className="st-num">{cur + 1}</span>/{chapters.length}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// 01 a pinned sequence

export interface SeqLine { text: ReactNode; size?: Size; align?: Align; tone?: Tone; fx?: Fx }

export function Sequence({ lines }: { lines: SeqLine[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(-1)
  useScroll(() => {
    const { p, top } = trackProgress(track.current)
    setK(top > window.innerHeight * 0.35 ? -1 : Math.min(lines.length - 1, Math.floor(p * (lines.length + 0.4))))
  }, [lines.length])
  return (
    <div className="st-seq" ref={track} style={{ height: `${lines.length * 62 + 70}vh` }}>
      <div className="st-seq-stick">
        {lines.map((l, i) => (
          <Say key={i} size={l.size} align={l.align} tone={l.tone} fx={l.fx} state={i <= k ? 'in' : 'hidden'} className={cx(i < k && 'is-past')}>{l.text}</Say>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 02 one stat per screen, colors wiping out from the dots

export interface Stat { pre?: string; to: number; decimals?: number; group?: boolean; text?: string; prefix?: string; suffix?: string; post: string; bg: string; fg: string; num: string; align?: 'left' | 'center' | 'right'; big?: boolean; dark?: boolean }

export function StatScreens({ stats }: { stats: Stat[] }) {
  const track = useRef<HTMLDivElement>(null)
  const stick = useRef<HTMLDivElement>(null)
  const dots = useRef<(HTMLButtonElement | null)[]>([])
  const [si, setSi] = useState(-1)
  const [shown, setShown] = useState(-1)
  const [base, setBase] = useState(stats[0].bg)
  const [wipe, setWipe] = useState<{ bg: string; x: number; y: number; run: boolean } | null>(null)

  useScroll(() => {
    const { p, top } = trackProgress(track.current)
    if (top > window.innerHeight * 0.5) return
    setSi(Math.min(stats.length - 1, Math.floor(p * stats.length)))
  }, [stats.length])

  useEffect(() => {
    if (si < 0) return
    const first = shown < 0
    const t1 = setTimeout(() => setShown(si), first || reduced() ? 0 : 420)
    if (first || reduced()) { setBase(stats[si].bg); return () => clearTimeout(t1) }
    const d = dots.current[si]?.getBoundingClientRect()
    const s = stick.current?.querySelector('.st-stat-bg')?.getBoundingClientRect()
    const x = d && s ? d.left + d.width / 2 - s.left : 0
    const y = d && s ? d.top + d.height / 2 - s.top : 0
    setWipe({ bg: stats[si].bg, x, y, run: false })
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setWipe((w) => w && { ...w, run: true })))
    const t2 = setTimeout(() => { setBase(stats[si].bg); setWipe(null) }, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); cancelAnimationFrame(r) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [si])

  const everShown = useRef(new Set<number>())
  if (shown >= 0) everShown.current.add(shown)
  const cur = stats[Math.max(0, si)]
  return (
    <div className="st-stats" ref={track} style={{ height: `${stats.length * 100 + 40}vh` }}>
      <div className="st-stats-stick" ref={stick} data-dark={cur.dark ? '1' : undefined}>
        <div className="st-stat-bg" style={{ background: base }} />
        {wipe && <div className={cx('st-stat-bg st-stat-wipe', wipe.run && 'run')} style={{ background: wipe.bg, '--wx': `${wipe.x}px`, '--wy': `${wipe.y}px` } as V} />}
        {stats.map((s, i) => (
          <Rise
            key={i}
            fx={s.align === 'center' ? 'pop' : s.align === 'right' ? 'slide-r' : 'rise'}
            className={cx('st-stat', `st-stat-${s.align ?? 'left'}`, s.big && 'is-big')}
            style={{ color: s.fg, '--num': s.num } as V}
            state={i === shown ? 'in' : everShown.current.has(i) ? 'out' : 'hidden'}
          >
            {s.pre ? `${s.pre} ` : ''}{s.text ? <span className="st-num" data-unit>{s.text}</span> : <Count to={s.to} decimals={s.decimals} group={s.group} prefix={s.prefix} suffix={s.suffix} run={i === shown} delay={260} />} {s.post}
          </Rise>
        ))}
        <div className="st-stat-dots" style={{ color: cur.fg }}>
          {stats.map((_, i) => (
            <button key={i} ref={(el) => { dots.current[i] = el }} className={cx(i === si && 'on')} aria-label={`Stat ${i + 1}`}
              onClick={() => scrollToTrack(track.current, (i + 0.5) / stats.length)} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 03 a thesis that lights up word by word

export function LightUp({ text, accent }: { text: string; accent?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const words = useRef<{ w: string; a: boolean }[]>([])
  if (!words.current.length) {
    const i = accent ? text.indexOf(accent) : -1
    const parts = i < 0 ? [[text, false]] as const : [[text.slice(0, i), false], [accent!, true], [text.slice(i + accent!.length), false]] as const
    parts.forEach(([t, a]) => t.split(/\s+/).filter(Boolean).forEach((w) => words.current.push({ w, a })))
  }
  useScroll(() => {
    const { p } = trackProgress(track.current)
    setN(Math.round(p * 1.3 * words.current.length))
  })
  return (
    <Band tone="night" className="st-light">
      <div className="st-light-track" ref={track}>
        <div className="st-light-stick">
          <p className="st-light-text">
            {words.current.map((x, i) => {
              const nx = words.current[i + 1]
              const glued = nx && /^[.,!?;:]+$/.test(nx.w)
              return <Fragment key={i}><span className={cx('st-lw', x.a && 'a', i < n && 'lit')}>{x.w}</span>{nx && !glued ? ' ' : ''}</Fragment>
            })}
          </p>
        </div>
      </div>
    </Band>
  )
}

// ---------------------------------------------------------------------------
// 04 a chart told in beats. Children render the svg; elements opt in with
// data-beat="n" (appears at beat n) and data-dim="n" (recedes at beat n).

export function ChartBeats({ beats, children, wide }: { beats: string[]; children: ReactNode; wide?: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(-1)
  const [cap, phase] = useSwap(Math.max(0, beat))

  useScroll(() => {
    const { p, top } = trackProgress(track.current)
    setBeat(top > window.innerHeight * 0.45 ? -1 : Math.min(beats.length - 1, Math.floor(p * beats.length)))
  }, [beats.length])

  useLayoutEffect(() => {
    art.current?.querySelectorAll<SVGElement>('[data-beat]').forEach((el) => el.classList.toggle('on', beat >= +(el.dataset.beat ?? 0)))
    art.current?.querySelectorAll<SVGElement>('[data-dim]').forEach((el) => el.classList.toggle('dim', beat >= +(el.dataset.dim ?? 99)))
  }, [beat])

  const onMove = useCallback((e: React.PointerEvent) => {
    if (reduced() || !art.current) return
    const r = art.current.getBoundingClientRect()
    art.current.style.setProperty('--ty', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`)
    art.current.style.setProperty('--tx', `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`)
  }, [])
  const onLeave = useCallback(() => { art.current?.style.setProperty('--ty', '0deg'); art.current?.style.setProperty('--tx', '0deg') }, [])

  return (
    <div className="st-chart" ref={track} style={{ height: `${beats.length * 70 + 40}vh` }}>
      <div className={cx('st-chart-stick', wide && 'is-wide')}>
        <div className="st-chart-cap">
          <Say key={cap} size="m" fx={(['rise', 'blur', 'slide', 'pop'] as Fx[])[cap % 4]} state={beat < 0 ? 'hidden' : phase}>{beats[cap]}</Say>
          <div className="st-dots">
            {beats.map((_, i) => (
              <button key={i} className={cx(i === Math.max(0, beat) && 'on')} aria-label={`Step ${i + 1}`} onClick={() => scrollToTrack(track.current, (i + 0.5) / beats.length)} />
            ))}
          </div>
        </div>
        <div className="st-chart-art" ref={art} onPointerMove={onMove} onPointerLeave={onLeave}>{children}</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 05 one persona at a time

export interface Persona { name: string; quote: string; lines: string[]; img?: string; alt?: string }

function PShot({ src, alt, state }: { src: string; alt: string; state: RiseState }) {
  const armed = useArmed()
  return <img className={cx('st-pshot', (!armed || state === 'hidden') && 'enter', state === 'out' && 'leave')} src={src} alt={alt} loading="lazy" />
}

export function PersonaSwitch({ people, tone = 'band', art = 'phone' }: { people: Persona[]; tone?: BandTone; art?: 'phone' | 'figure' }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [pick, setPick] = useState(0)
  const [cur, phase] = useSwap(pick, 340)
  const names = useRef<(HTMLButtonElement | null)[]>([])
  const [bar, setBar] = useState({ x: 0, w: 0 })
  const shot = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const b = names.current[pick]
    if (b) setBar({ x: b.offsetLeft, w: b.offsetWidth })
  }, [pick])
  const st = !seen ? 'hidden' : phase
  const p = people[cur]
  return (
    <Band tone={tone} className={cx('st-persona', art === 'figure' && 'is-figure')}>
      <div ref={ref} onPointerMove={(e) => { if (reduced() || !shot.current) return; shot.current.style.setProperty('--mx', `${(e.clientX / window.innerWidth - 0.5) * 24}px`); shot.current.style.setProperty('--my', `${(e.clientY / window.innerHeight - 0.5) * 18}px`) }}>
        <div className="st-pnames">
          {people.map((x, i) => (
            <button key={x.name} ref={(el) => { names.current[i] = el }} className={cx(i === pick && 'on')} onClick={() => setPick(i)}>{x.name}</button>
          ))}
          <span className="st-pbar" style={{ width: bar.w, transform: `translateX(${bar.x}px)` }} />
        </div>
        <Say key={`q${cur}`} size="xl" className="st-pq" fx={isQuote(p.quote) ? 'type' : 'drop'} state={st}>{p.quote}</Say>
        <div className={cx('st-pbody', !p.img && 'no-img')}>
          <div className="st-plines">
            {p.lines.map((l, i) => (
              <Say key={`${cur}-${i}`} size="m" align={i === 1 ? 'indent' : 'left'} fx={(['slide', 'blur', 'rise'] as Fx[])[i % 3]} delay={250 + i * 220} state={st}>{l}</Say>
            ))}
          </div>
          {p.img && <div className="st-pshot-wrap" ref={shot}><PShot key={p.img} src={p.img} alt={p.alt ?? ''} state={st} /></div>}
        </div>
      </div>
    </Band>
  )
}

// ---------------------------------------------------------------------------
// 06 a pinned phone walking through the product

export interface PhoneStep { text: string; quiet?: string; img: string; alt?: string; glow?: boolean }

export function PinnedPhone({ steps, frame = 'phone' }: { steps: PhoneStep[]; frame?: 'phone' | 'desktop' }) {
  const list = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const [seen, setSeen] = useState<number[]>([])
  const TILT = [[-10, 4], [8, 3], [-6, -2], [10, 5], [0, 0], [-8, 3], [6, 2], [-4, 4]]
  useScroll(() => {
    const els = list.current?.querySelectorAll<HTMLElement>('.st-step')
    if (!els) return
    let c = 0
    els.forEach((el, i) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.48) c = i })
    setCur(c)
    if (els[0] && els[0].getBoundingClientRect().top < window.innerHeight * 0.8) setSeen((s) => (s.includes(c) ? s : [...s, c]))
  }, [steps.length])
  const [ry, rx] = frame === 'desktop' ? [TILT[cur % TILT.length][0] * 0.4, TILT[cur % TILT.length][1] * 0.5] : TILT[cur % TILT.length]
  return (
    <div className={cx('st-phone', frame === 'desktop' && 'is-desktop')}>
      <div className="st-steps" ref={list}>
        {steps.map((s, i) => (
          <div key={i} className={cx('st-step', i === cur && 'on')}>
            <Say size="l" fx={(['rise', 'slide', 'blur', 'drop'] as Fx[])[i % 4]} state={seen.includes(i) ? 'in' : 'hidden'}>{s.text}{s.quiet && <span className="st-quiet">{` ${s.quiet}`}</span>}</Say>
            <img className="st-step-img" src={s.img} alt={s.alt ?? ''} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="st-phone-col">
        <div className={cx('st-phone-stick', steps[cur]?.glow && 'glow')}>
          <div className="st-device" style={{ '--ry': `${ry}deg`, '--rx': `${rx}deg` } as V}>
            <div className="st-screen">
              {steps.map((s, i) => <img key={i} src={s.img} alt={i === cur ? s.alt ?? '' : ''} className={cx(i === cur && 'on', i < cur && 'prev')} loading={i < 2 ? 'eager' : 'lazy'} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 07 cards that stack as you scroll

export interface StackCard { n: string; title: string; body?: string; list?: string[]; bg: string; fg: string; num: string; variant?: 'big' | 'flip' }

function StackItem({ c, i, total, register }: { c: StackCard; i: number; total: number; register: (el: HTMLDivElement | null, i: number) => void }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.5)
  const st = seen ? 'in' : 'hidden'
  return (
    <div
      ref={(el) => { (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; register(el, i) }}
      className={cx('st-card', c.variant && `is-${c.variant}`, seen && 'go')}
      style={{ background: c.bg, color: c.fg, top: 56 + i * 20, zIndex: i + 1, marginBottom: i === total - 1 ? 0 : 48 }}
    >
      <Rise className="st-card-n" state={st} style={{ color: c.num }}>{c.n}</Rise>
      <div>
        <Rise as="h3" state={st}>{c.title}</Rise>
        {c.body && <Rise state={st} delay={250}>{c.body}</Rise>}
        {c.list && <ul>{c.list.map((x, k) => <li key={x} style={{ '--k': k } as V}>{x}</li>)}</ul>}
      </div>
    </div>
  )
}

export function StackCards({ cards }: { cards: StackCard[] }) {
  const els = useRef<(HTMLDivElement | null)[]>([])
  const register = useCallback((el: HTMLDivElement | null, i: number) => { els.current[i] = el }, [])
  useScroll(() => {
    const cs = els.current
    cs.forEach((c, i) => {
      const nx = cs[i + 1]
      if (!c || !nx) return
      const d = nx.getBoundingClientRect().top - c.getBoundingClientRect().top
      const q = clamp(1 - d / 420)
      c.style.transform = `scale(${1 - q * 0.05})`
      c.style.filter = `brightness(${1 - q * 0.12})`
    })
  }, [cards.length])
  return <div className="st-stack">{cards.map((c, i) => <StackItem key={i} c={c} i={i} total={cards.length} register={register} />)}</div>
}

// ---------------------------------------------------------------------------
// 08 a ledger you click through

export interface LedgerItem { title: string; fix: string; lesson: string; label?: string }

export function Ledger({ items, tone = 'night' }: { items: LedgerItem[]; tone?: BandTone }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [pick, setPick] = useState(0)
  const [cur, phase] = useSwap(pick, 320)
  const btns = useRef<(HTMLButtonElement | null)[]>([])
  const [bar, setBar] = useState({ top: 0, h: 0 })
  useLayoutEffect(() => {
    const b = btns.current[pick]
    if (b) setBar({ top: b.offsetTop + 14, h: b.offsetHeight - 28 })
  }, [pick])
  const st = !seen ? 'hidden' : phase
  const it = items[cur]
  return (
    <Band tone={tone} className={cx('st-ledger-band', !DARK.includes(tone) && 'is-light')}>
      <div className="st-ledger" ref={ref}>
        <div className="st-lq">
          <span className="st-lbar" style={{ top: bar.top, height: bar.h }} />
          {items.map((x, i) => (
            <button key={i} ref={(el) => { btns.current[i] = el }} className={cx(i === pick && 'on')} onClick={() => setPick(i)}>
              <i>{String(i + 1).padStart(2, '0')}</i>{x.label ?? x.title}
            </button>
          ))}
        </div>
        <div className="st-lpane">
          <Rise key={`g${cur}`} fx="drop" className="st-lghost" state={st}>{String(cur + 1).padStart(2, '0')}</Rise>
          <Say key={`b${cur}`} size="l" fx="drop" className="st-lbug" state={st} delay={120}>{it.title}</Say>
          <Say key={`f${cur}`} size="m" align="indent" fx="blur" className="st-lfix" state={st} delay={380}>{it.fix}</Say>
          <Say key={`l${cur}`} size="l" align="right" fx="pop" className="st-llesson" state={st} delay={640}>{it.lesson}</Say>
        </div>
      </div>
    </Band>
  )
}

// ---------------------------------------------------------------------------
// 09 targets drawn as a hundred ticks

export interface Target { name: string; value: number; label?: string; why: string; watch?: boolean }

function TargetRow({ t }: { t: Target }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.6)
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(0)
  const [lit, setLit] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduced()) { setUp(100); setLit(t.value); return }
    const t0 = performance.now()
    let raf = 0
    const f = (now: number) => {
      const e = now - t0
      setUp(Math.min(100, Math.floor(e / 6)))
      setLit(clamp(Math.floor((e - 450) / 16) + 1, 0, t.value))
      if (e < 450 + t.value * 16 + 50 || e < 650) raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [seen, t.value])
  return (
    <div ref={ref} className={cx('st-tg', t.watch && 'is-watch', open && 'open', lit >= t.value && seen && 'done')} onClick={() => setOpen((o) => !o)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }} aria-expanded={open}>
      <div className="st-tg-head">
        <span className="st-tg-name"><span className="st-plus">+</span>{t.name}</span>
        <span className="st-tg-val">{t.label ?? `${lit}%`}</span>
      </div>
      <div className="st-ticks">
        {Array.from({ length: 100 }, (_, i) => <i key={i} className={cx(i < up && 'up', i < lit && 'lit')} />)}
      </div>
      <p className="st-tg-why">{t.why}</p>
    </div>
  )
}

export function TargetTicks({ rows }: { rows: Target[] }) {
  return <div className="st-targets">{rows.map((t) => <TargetRow key={t.name} t={t} />)}</div>
}

// ---------------------------------------------------------------------------
// supporting pieces

/** image beside a few beats that rise in order */
export function Duo({ img, alt, lines, side = 'left', frame = 'phone' }: { img: string; alt: string; lines: SeqLine[]; side?: 'left' | 'right'; frame?: 'phone' | 'desktop' | 'none' }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  return (
    <div ref={ref} className={cx('st-duo', `st-duo-${side}`, `st-duo-${frame}`, seen && 'go')}>
      <figure className="st-duo-fig"><img src={img} alt={alt} loading="lazy" /></figure>
      <div className="st-duo-text">
        {lines.map((l, i) => <Say key={i} size={frame === 'desktop' && (l.size === 'l' || l.size === 'xl') ? 'm' : l.size ?? 'm'} align={l.align} tone={l.tone} fx={l.fx ?? (l.tone || l.align ? undefined : (['rise', 'slide', 'blur'] as Fx[])[i % 3])} delay={i * 220} state={seen ? 'in' : 'hidden'}>{l.text}</Say>)}
      </div>
    </div>
  )
}

/** screenshots that rise in a staggered row, each with a short caption */
export function Shots({ items, frame = 'phone' }: { items: { img: string; alt: string; cap: string }[]; frame?: 'phone' | 'desktop' }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className={cx('st-shots', `st-shots-${frame}`, `st-shots-${items.length}`, seen && 'go')}>
      {items.map((s, i) => (
        <figure key={i} style={{ '--k': i } as V}>
          <img src={s.img} alt={s.alt} loading="lazy" />
          <Rise as="figcaption" fx="blur" state={seen ? 'in' : 'hidden'} delay={300 + i * 140}>{s.cap}</Rise>
        </figure>
      ))}
    </div>
  )
}

/** a short list of big heads, each with a line beside it */
export function BigList({ items }: { items: { head: string; line: string }[] }) {
  return (
    <div className="st-biglist">
      {items.map((x, i) => (
        <div key={i} className="st-bl">
          <Say size="xl" className="st-bl-h" fx={i % 2 ? 'slide' : 'drop'}>{x.head}</Say>
          <Say size="m" tone="soft" delay={200}>{x.line}</Say>
        </div>
      ))}
    </div>
  )
}

/** colored moments that bloom in order as the row scrolls into view */
export function Moments({ items }: { items: { color: string; name: string; tempo: string }[] }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className={cx('st-moments', seen && 'go')} style={{ '--n': items.length } as V}>
      {items.map((m, i) => (
        <div key={i} className="st-moment" style={{ '--c': m.color, '--k': i } as V}>
          <span className="st-bloom"><i /></span>
          <Rise as="b" fx="pop" state={seen ? 'in' : 'hidden'} delay={300 + i * 260}>{m.name}</Rise>
          <Rise as="span" fx="blur" state={seen ? 'in' : 'hidden'} delay={420 + i * 260}>{m.tempo}</Rise>
        </div>
      ))}
    </div>
  )
}

/** a collapsible with readable type */
export function More({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="st-more">
      <summary><span className="st-plus">+</span>{summary}</summary>
      <div className="st-more-body">{children}</div>
    </details>
  )
}

/** count of children, used by pages that size tracks from content */
export const countOf = (n: ReactNode) => Children.count(n)

/** a plain wrapper that gains .go once it scrolls into view */
export function Reveal({ className, children, threshold = 0.25 }: { className?: string; children: ReactNode; threshold?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>(threshold)
  return <div ref={ref} className={cx('st-reveal', className, seen && 'go')}>{children}</div>
}
