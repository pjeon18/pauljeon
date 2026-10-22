// The case-study story kit. Every long case study is one continuous page:
// beats at one size, in order, with dark and colored bands as breaks. Nothing
// pins and nothing changes over like a slide. One motion primitive (words fade
// and rise a little as they scroll into view) runs through all of it, and every
// timing pulls from the tokens at the top of story.css.
import React, {
  Children, Fragment, cloneElement, isValidElement, useEffect, useLayoutEffect,
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

/** true once the element has come into view (its top passes 88% of the
 *  window). Works for blocks taller than the screen, and inside the home
 *  page's iframe, since it only watches ordinary document scroll. */
function useInView<T extends Element>(_threshold?: number) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect() } }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
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
      {splitNodes(children, { i: 0 })}
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

/** the page used to carry a chapter rail and a "Part x/y" counter. It reads
 *  as one continuous page now, so there is no chrome to draw. Kept so pages
 *  that still render it need no change. */
export function StoryChrome() {
  return null
}

// ---------------------------------------------------------------------------
// 01 a sequence: its lines stacked with room between them, each arriving as it
// scrolls into view

export interface SeqLine { text: ReactNode; size?: Size; align?: Align; tone?: Tone; fx?: Fx }

export function Sequence({ lines }: { lines: SeqLine[] }) {
  return (
    <div className="st-seq">
      {lines.map((l, i) => <Say key={i} size={l.size} align={l.align} tone={l.tone} fx={l.fx}>{l.text}</Say>)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 02 the stats, each on its own color, laid out down the page

export interface Stat { pre?: string; to: number; decimals?: number; group?: boolean; text?: string; prefix?: string; suffix?: string; post: string; bg: string; fg: string; num: string; align?: 'left' | 'center' | 'right'; big?: boolean; dark?: boolean }

function StatRow({ s }: { s: Stat }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="st-stat-row" style={{ background: s.bg }}>
      <Rise
        className={cx('st-stat', `st-stat-${s.align ?? 'left'}`, s.big && 'is-big')}
        style={{ color: s.fg, '--num': s.num } as V}
        state={seen ? 'in' : 'hidden'}
      >
        {s.pre ? `${s.pre} ` : ''}{s.text ? <span className="st-num" data-unit>{s.text}</span> : <Count to={s.to} decimals={s.decimals} group={s.group} prefix={s.prefix} suffix={s.suffix} run={seen} delay={200} />} {s.post}
      </Rise>
    </div>
  )
}

export function StatScreens({ stats }: { stats: Stat[] }) {
  return <div className="st-stats">{stats.map((s, i) => <StatRow key={i} s={s} />)}</div>
}

// ---------------------------------------------------------------------------
// 03 a thesis whose words light up one after another once it is in view

export function LightUp({ text, accent }: { text: string; accent?: string }) {
  const [ref, seen] = useInView<HTMLParagraphElement>()
  const words = useRef<{ w: string; a: boolean }[]>([])
  if (!words.current.length) {
    const i = accent ? text.indexOf(accent) : -1
    const parts = i < 0 ? [[text, false]] as const : [[text.slice(0, i), false], [accent!, true], [text.slice(i + accent!.length), false]] as const
    parts.forEach(([t, a]) => t.split(/\s+/).filter(Boolean).forEach((w) => words.current.push({ w, a })))
  }
  return (
    <Band tone="night" className="st-light">
      <p className={cx('st-light-text', seen && 'go')} ref={ref}>
        {words.current.map((x, i) => {
          const nx = words.current[i + 1]
          const glued = nx && /^[.,!?;:]+$/.test(nx.w)
          return <Fragment key={i}><span className={cx('st-lw', x.a && 'a')} style={{ '--i': i } as V}>{x.w}</span>{nx && !glued ? ' ' : ''}</Fragment>
        })}
      </p>
    </Band>
  )
}

// ---------------------------------------------------------------------------
// 04 a chart told in beats. Children render the svg; elements opt in with
// data-beat="n" (appears at beat n) and data-dim="n" (recedes at beat n).
// The captions sit beside the chart in order; once the block is in view the
// chart steps through its beats on a gentle clock, each caption arriving with
// its beat.

const BEAT_MS = 1100

export function ChartBeats({ beats, children, wide }: { beats: string[]; children: ReactNode; wide?: boolean }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const art = useRef<HTMLDivElement>(null)
  const [beat, setBeat] = useState(-1)

  useEffect(() => {
    if (!seen) return
    if (reduced()) { setBeat(beats.length - 1); return }
    const ts = beats.map((_, i) => setTimeout(() => setBeat(i), 200 + i * BEAT_MS))
    return () => ts.forEach(clearTimeout)
  }, [seen, beats])

  useLayoutEffect(() => {
    art.current?.querySelectorAll<SVGElement>('[data-beat]').forEach((el) => el.classList.toggle('on', beat >= +(el.dataset.beat ?? 0)))
    art.current?.querySelectorAll<SVGElement>('[data-dim]').forEach((el) => el.classList.toggle('dim', beat >= +(el.dataset.dim ?? 99)))
  }, [beat])

  return (
    <div className={cx('st-chart', wide && 'is-wide')} ref={ref}>
      <div className="st-chart-cap">
        {beats.map((b, i) => <Say key={i} size="m" state={i <= beat ? 'in' : 'hidden'}>{b}</Say>)}
      </div>
      <div className="st-chart-art" ref={art}>{children}</div>
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
        <div className={cx('st-pbody', !p.img && 'no-img')}>
          <div className="st-plines">
            <Say key={`q${cur}`} size="xl" className="st-pq" fx={isQuote(p.quote) ? 'type' : 'drop'} state={st}>{p.quote}</Say>
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
// 06 the product, step by step: each step a line beside its screen, laid down
// the page and arriving as it scrolls into view

export interface PhoneStep { text: string; quiet?: string; img: string; alt?: string; glow?: boolean }

function PhoneRow({ s, i, frame }: { s: PhoneStep; i: number; frame: 'phone' | 'desktop' }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={cx('st-step', i % 2 === 1 && 'is-flip', s.glow && 'glow', seen && 'go')}>
      <Say size={frame === 'desktop' ? 'm' : 'l'} state={seen ? 'in' : 'hidden'}>{s.text}{s.quiet && <span className="st-quiet">{` ${s.quiet}`}</span>}</Say>
      <div className="st-step-fig">
        <div className="st-device"><div className="st-screen"><img src={s.img} alt={s.alt ?? ''} loading="lazy" /></div></div>
      </div>
    </div>
  )
}

export function PinnedPhone({ steps, frame = 'phone' }: { steps: PhoneStep[]; frame?: 'phone' | 'desktop' }) {
  return (
    <div className={cx('st-phone', frame === 'desktop' && 'is-desktop')}>
      {steps.map((s, i) => <PhoneRow key={i} s={s} i={i} frame={frame} />)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 07 cards laid one after another

export interface StackCard { n: string; title: string; body?: string; list?: string[]; bg: string; fg: string; num: string; variant?: 'big' | 'flip' }

function StackItem({ c }: { c: StackCard }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const st = seen ? 'in' : 'hidden'
  return (
    <div ref={ref} className={cx('st-card', c.variant && `is-${c.variant}`, seen && 'go')} style={{ background: c.bg, color: c.fg }}>
      <Rise className="st-card-n" state={st} style={{ color: c.num }}>{c.n}</Rise>
      <div>
        <Rise as="h3" state={st} delay={120}>{c.title}</Rise>
        {c.body && <Rise state={st} delay={260}>{c.body}</Rise>}
        {c.list && <ul>{c.list.map((x, k) => <li key={x} style={{ '--k': k } as V}>{x}</li>)}</ul>}
      </div>
    </div>
  )
}

export function StackCards({ cards }: { cards: StackCard[] }) {
  return <div className="st-stack">{cards.map((c, i) => <StackItem key={i} c={c} />)}</div>
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

/** a full-width image that never displays wider than its pixels allow,
 *  so it stays sharp (at least 1.8 source pixels per displayed pixel) */
export function WideImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <Reveal className={cx('st-fade st-figure st-wide-img', className)}>
      <img src={src} alt={alt} loading="lazy" onLoad={(e) => { const im = e.currentTarget; im.style.maxWidth = `${Math.round(im.naturalWidth / 1.8)}px` }} />
    </Reveal>
  )
}

// ---------------------------------------------------------------------------
// versions of a product, one at a time, the picture sliding with the choice

export interface Version { name: string; img: string; alt: string; lines: string[] }

export function VersionSwitch({ versions, start = 0 }: { versions: Version[]; start?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [pick, setPick] = useState(start)
  const [cur, phase] = useSwap(pick, 300)
  const prev = useRef(start)
  const dir = pick >= prev.current ? 1 : -1
  useEffect(() => { prev.current = pick }, [pick])
  const st = !seen ? 'hidden' : phase
  const v = versions[cur]
  return (
    <div ref={ref} className="st-versions">
      <div className="st-vtabs">
        {versions.map((x, i) => (
          <button key={x.name} className={cx(i === pick && 'on')} onClick={() => setPick(i)}>
            {x.name}
            {i === pick && <span className="st-vbar" />}
          </button>
        ))}
      </div>
      <div className="st-vbody">
        <div className="st-vshot">
          <img key={v.img} src={v.img} alt={v.alt} className={cx('st-vimg', st === 'out' && (dir > 0 ? 'out-l' : 'out-r'), st === 'hidden' && 'hide')} style={{ '--from': `${dir * 6}%` } as V} />
        </div>
        <div className="st-vlines">
          {v.lines.map((l, i) => <Say key={`${cur}-${i}`} size="m" tone={i === v.lines.length - 1 && i > 0 ? 'acc' : undefined} delay={180 + i * 200} state={st}>{l}</Say>)}
        </div>
      </div>
    </div>
  )
}
