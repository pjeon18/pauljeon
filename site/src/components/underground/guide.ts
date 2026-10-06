// ============================================================================
// The guide dot. One physics loop drives the dot through the underground:
// free fall, bounces that invert the light, ballistic hops between targets,
// a spring morph into whatever button comes next, and a camera that follows
// it down. Ported from the dot sandbox and adapted to a scrolling layer.
//
// Coordinates: x is in viewport pixels (the layer never scrolls sideways),
// y is in content pixels (viewport y + the layer's scrollTop). Targets are
// re-measured every frame, so sticky headings and resizes are tracked.
// ============================================================================

export type Kind = 'dot' | 'pill' | 'circle' | 'square' | 'tag' | 'triangle' | 'caret'
type Tone = 'dark' | 'light' | 'red'
interface Shape { pts: Float32Array; w: number; h: number; dx: number; label: string }
interface Pt { x: number; y: number }

export const R = 12
const N = 120
const G = 2800, E = 0.62
const PAPER = '#F5F2EC', INK = '#0B0B0A', RED = '#E02B1D', GREEN = '#12A150'
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/* ---------------- shapes, sampled as rays from the center ---------------- */
const meas = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null
const textW = (t: string) => { if (!meas) return t.length * 10; meas.font = "700 19px Satoshi, system-ui, sans-serif"; return meas.measureText(t).width }
const sdfRR = (x: number, y: number, w: number, h: number, r: number) => { const qx = Math.abs(x) - w / 2 + r, qy = Math.abs(y) - h / 2 + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r }
const sdfPoly = (p: number[][], round: number) => (x: number, y: number) => { let d = -1e9; for (let i = 0; i < p.length; i++) { const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length], l = Math.hypot(bx - ax, by - ay); d = Math.max(d, ((x - ax) * (by - ay) - (y - ay) * (bx - ax)) / l) } return d - round }
function sample(sdf: (x: number, y: number) => number) {
  const out = new Float32Array(N * 2)
  for (let i = 0; i < N; i++) {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
    let lo = 0, hi = 600
    for (let k = 0; k < 28; k++) { const m = (lo + hi) / 2; if (sdf(c * m, s * m) > 0) hi = m; else lo = m }
    out[i * 2] = c * lo; out[i * 2 + 1] = s * lo
  }
  return out
}
const cache = new Map<string, Shape>()
export function shape(kind: Kind, label = '', r = R): Shape {
  const key = `${kind}|${label}|${r.toFixed(1)}`
  const hit = cache.get(key)
  if (hit) return hit
  const tw = textW(label)
  let sdf: (x: number, y: number) => number = (x, y) => Math.hypot(x, y) - r, w = 2 * r, h = 2 * r, dx = 0
  if (kind === 'caret') { w = 4; h = r; sdf = (x, y) => sdfRR(x, y, 4, r, 2) }
  if (kind === 'pill') { w = tw + 66; h = 62; sdf = (x, y) => sdfRR(x, y, w, h, 31) }
  if (kind === 'circle') { const c = Math.max(50, tw / 2 + 24); w = h = 2 * c; sdf = (x, y) => Math.hypot(x, y) - c }
  if (kind === 'square') { const s = Math.max(100, tw + 42); w = h = s; sdf = (x, y) => sdfRR(x, y, s, s, 24) }
  if (kind === 'tag') { w = tw + 96; h = 62; const hw = w / 2; sdf = sdfPoly([[-hw + 10, -21], [hw - 36, -21], [hw - 12, 0], [hw - 36, 21], [-hw + 10, 21]], 10); dx = -12 }
  if (kind === 'triangle') { const c = 70; const p = [0, 1, 2].map((i) => [Math.cos(i * 2 * Math.PI / 3) * c * 0.82, Math.sin(i * 2 * Math.PI / 3) * c * 0.82]); sdf = sdfPoly(p, 13); w = c * 1.5; h = c * 1.73; dx = -9 }
  const s = { pts: sample(sdf), w, h, dx, label }
  cache.set(key, s)
  return s
}
export const clearShapes = () => cache.clear()

/* ---------------- color inversion waves ---------------- */
interface WaveEl extends HTMLElement { _raf?: number }
export function wave(el: WaveEl, x: number, y: number, local: boolean, force?: boolean) {
  const on = force ?? el.dataset.on !== '1'
  el.dataset.on = on ? '1' : '0'
  const rect = local ? el.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight }
  const cx = x - rect.left, cy = y - rect.top
  const far = Math.hypot(Math.max(cx, rect.width - cx), Math.max(cy, rect.height - cy)) + 20
  const t0 = performance.now(), D = 640
  el.style.opacity = '1'
  cancelAnimationFrame(el._raf ?? 0)
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / D), r = (1 - Math.pow(1 - k, 4)) * far
    const m = on ? `radial-gradient(circle at ${cx}px ${cy}px, #000 ${r}px, transparent ${r + 1}px)` : `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, #000 ${r + 1}px)`
    el.style.webkitMaskImage = el.style.maskImage = m
    if (k < 1) el._raf = requestAnimationFrame(step)
    else { el.style.webkitMaskImage = el.style.maskImage = 'none'; el.style.opacity = on ? '1' : '0' }
  }
  el._raf = requestAnimationFrame(step)
}

/* ---------------- the guide ---------------- */
type Mode = 'off' | 'pin' | 'rest' | 'start' | 'free' | 'hop' | 'morph' | 'hidden' | 'drag' | 'spring' | 'type' | 'zoom' | 'charge'
export type Style = 'bounce' | 'one'
const NEON = ['#39FF14', '#FF2BD6', '#00E5FF', '#FFE600', '#FF5F1F']
const CHEERS = ['Hooray!', 'Nice!', 'Okay!', 'Yes!', 'Wow!']
interface Hop { x0: number; y0: number; vx: number; vy: number; T: number; t: number; to: () => Pt; tx: number; ty: number; after?: () => void }
interface Box { el: HTMLElement; inv: WaveEl }
export interface Els { root: HTMLDivElement; g: SVGGElement; path: SVGPathElement; fx: SVGGElement; label: HTMLDivElement; inv: WaveEl }

export class Guide {
  els: Els
  x = 0; y = 0; vx = 0; vy = 0; mode: Mode = 'off'
  floorY = 0; steerX: number | null = null; grounded = false; still = 0; onRest: (() => void) | null = null; follow = false
  hop: Hop | null = null
  at: HTMLElement | null = null           // the element the dot is resting on or morphed onto
  anchor: (() => Pt) | null = null        // where it is held while it rests
  next: string | null = null              // where clicking the morphed button goes
  from: Shape = shape('dot'); to: Shape = shape('dot'); s = 1; sv = 0; sT = 1
  q = 0; qv = 0; hover = false
  ghosts: Pt[] = []; parts: { x: number; y: number; vx: number; vy: number; t: number; r: number }[] = []; rings: { x: number; y: number; t: number; s: number }[] = []
  box: Box | null = null; boxStill = 0; onBoxIdle: (() => void) | null = null
  pinSpeed = 0
  style: Style = 'bounce'; hits = 0; pops = 0
  typing: { letters: HTMLElement[]; f: number; hold: number; slot: HTMLElement; after: () => void } | null = null
  zoom: { t: number; phase: 0 | 1; far: number; get: () => Pt; jump: () => void; after: () => void } | null = null
  zk = 1
  charging: { t: number; dur: number } | null = null
  boost = 0                                   // seconds of extra bounce left after a launch
  inward: { t: number }[] = []
  private get e() { return this.boost > 0 ? 0.85 : E }
  private lastWave = 0
  userScrolled = 0
  t = 0
  onClick: ((next: string) => void) | null = null
  private raf = 0; private last = 0; private acc = 0; private drag: { hist: { x: number; y: number; t: number }[] } | null = null
  private off: (() => void)[] = []
  focused: HTMLElement | null = null          // a pad or the start button, focused from the keyboard
  private sections: HTMLElement[] = []
  private toneCache: { n: number; tone: Tone } = { n: 0, tone: 'dark' }
  private drawn: { s: number; from: Shape | null; to: Shape | null; fx: boolean } = { s: -1, from: null, to: null, fx: true }

  constructor(els: Els) {
    this.els = els
    const root = els.root
    const scrolled = () => { this.userScrolled = performance.now() }
    root.addEventListener('wheel', scrolled, { passive: true }); root.addEventListener('touchmove', scrolled, { passive: true })
    const move = (e: PointerEvent) => {
      this.hover = this.over(e.clientX, e.clientY)
      document.body.classList.toggle('ug-hovering', this.hover)
      if (this.drag) this.dragMove(e)
    }
    const click = (e: MouseEvent) => { if (this.over(e.clientX, e.clientY) && this.next) { e.preventDefault(); e.stopPropagation(); this.onClick?.(this.next) } }
    const fin = (e: FocusEvent) => { this.focused = (e.target as HTMLElement).closest<HTMLElement>('.ug-pad, .ug-start') }
    const fout = () => { this.focused = null }
    root.addEventListener('focusin', fin); root.addEventListener('focusout', fout)
    this.off.push(() => { root.removeEventListener('focusin', fin); root.removeEventListener('focusout', fout) })
    const down = (e: PointerEvent) => this.dragStart(e)
    const up = () => this.dragEnd()
    window.addEventListener('pointermove', move); window.addEventListener('click', click, true)
    root.addEventListener('pointerdown', down); window.addEventListener('pointerup', up)
    this.off.push(() => { root.removeEventListener('wheel', scrolled); root.removeEventListener('touchmove', scrolled); window.removeEventListener('pointermove', move); window.removeEventListener('click', click, true); root.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); document.body.classList.remove('ug-hovering') })
    this.last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this.acc += dt
      while (this.acc >= 1 / 240) { this.step(1 / 240); this.acc -= 1 / 240 }
      this.camera(); this.draw()
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }
  destroy() { cancelAnimationFrame(this.raf); this.off.forEach((f) => f()) }

  /* ---- measuring ---- */
  get top() { return this.els.root.scrollTop }
  center(el: Element): Pt { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + this.top } }
  /** the period position after a heading: a zero-size box whose top is the baseline */
  slot(el: Element): Pt & { r: number } {
    const b = el.getBoundingClientRect(), fs = parseFloat(getComputedStyle(el.parentElement ?? el).fontSize) || 80
    const r = clamp(fs * 0.085, 10, 26)
    return { x: b.left + r + fs * 0.03, y: b.top - r + this.top, r }
  }
  private over(cx: number, cy: number) {
    if (this.mode === 'start') return Math.hypot(cx - this.x, cy - (this.y - this.top)) < Math.max(34, this.to.w)
    if (this.mode !== 'morph' || this.s < 0.6 || !this.next) return false
    const x = cx - this.x, y = cy - (this.y - this.top)
    return Math.abs(x) < this.to.w / 2 + 6 && Math.abs(y) < this.to.h / 2 + 6
  }

  /* ---- moves ---- */
  setShape(to: Shape, instant = false) { this.from = this.current(); this.to = to; this.s = instant ? 1 : 0; this.sv = 0; this.sT = 1; if (instant) this.from = to }
  current(): Shape {
    const pts = new Float32Array(N * 2), k = this.s
    for (let i = 0; i < N * 2; i++) pts[i] = this.from.pts[i] + (this.to.pts[i] - this.from.pts[i]) * k
    return { pts, w: this.from.w + (this.to.w - this.from.w) * k, h: this.from.h + (this.to.h - this.from.h) * k, dx: 0, label: '' }
  }
  private loose() { this.clearBoxInv(); this.at?.classList.remove('under'); this.at = null; this.anchor = null; this.next = null; this.box = null; if (this.to.label || this.to.w > 2 * R + 1) this.setShape(shape('dot')) }

  /** hold the dot somewhere in the viewport (used by the dive) */
  pin(x: number, y: number, speed = 0, r = R) {
    if (this.mode !== 'pin') { this.loose(); this.mode = 'pin' }
    this.x = x; this.y = y + this.top; this.pinSpeed = speed
    if (Math.abs(this.to.w / 2 - r) > 0.2) this.setShape(shape('dot', '', r), true)
  }
  hide() { this.loose(); this.mode = 'hidden' }
  showAt(xv: number, yv: number) { this.mode = 'rest'; this.x = xv; this.y = yv + this.top; this.vx = this.vy = 0; this.setShape(shape('dot'), true) }

  /** a ballistic hop that lands on a (possibly moving) point */
  hopTo(to: () => Pt, arc: number, after?: () => void) {
    this.loose()
    const p = to()
    const h = Math.max(0, this.y - p.y) + arc
    const vy = -Math.sqrt(2 * G * h)
    const T = (-vy + Math.sqrt(vy * vy + 2 * G * (p.y - this.y))) / G
    this.hop = { x0: this.x, y0: this.y, vx: (p.x - this.x) / T, vy, T, t: 0, to, tx: p.x, ty: p.y, after }
    this.mode = 'hop'; this.follow = false
  }
  /** hop onto a pad and become its button */
  onto(el: HTMLElement, kind: Kind, label: string, next: string) {
    this.hopTo(() => this.center(el), 90, () => {
      this.at = el; el.classList.add('under'); this.anchor = () => this.center(el); this.next = next
      this.setShape(shape(kind, label)); this.mode = 'morph'
    })
  }
  /** become the period after a heading */
  settle(el: HTMLElement) {
    const p = this.slot(el)
    this.at = el; this.anchor = () => this.slot(el)
    if (Math.abs(this.to.w / 2 - p.r) > 0.5) this.setShape(shape('dot', '', p.r))
  }
  /** throw the dot at a heading: it flies, falls in, bounces, and lands as the period */
  throwTo(el: HTMLElement, follow: boolean, after?: () => void, style: Style = 'bounce') {
    this.loose()
    const t = this.slot(el)
    const h = Math.max(0, this.y - t.y) + 160
    this.vy = -Math.sqrt(2 * G * h)
    const T = (-this.vy + Math.sqrt(this.vy * this.vy + 2 * G * (t.y - this.y))) / G
    this.vx = (t.x - this.x) / T
    this.free(() => this.slot(el), follow, () => { this.settle(el); after?.() }, style)
  }
  /** no motion: put the dot straight onto a pad as its button */
  ontoNow(el: HTMLElement, kind: Kind, label: string, next: string) {
    this.loose(); const p = this.center(el); this.x = p.x; this.y = p.y; this.vx = this.vy = 0
    this.at = el; el.classList.add('under'); this.anchor = () => this.center(el); this.next = next
    this.setShape(shape(kind, label), true); this.mode = 'morph'
  }
  /** no motion: put the dot straight onto a heading */
  placeOn(el: HTMLElement) { this.loose(); const p = this.slot(el); this.x = p.x; this.y = p.y; this.vx = this.vy = 0; this.mode = 'rest'; this.setShape(shape('dot', '', p.r), true); this.settle(el) }
  /** fall in from just above the viewport onto a heading or a pad */
  dropOnto(get: () => Pt, after: () => void) {
    this.loose()
    const p = get()
    this.x = p.x; this.y = this.top - 40; this.vx = 0; this.vy = 200
    this.setShape(shape('dot'), true)
    this.free(get, false, after, 'one')
  }
  /** momentum: a spring that leans back, then carries the dot over with a little overshoot */
  springTo(get: () => Pt, after: () => void, follow = true) {
    this.loose()
    const p = get(), d = Math.hypot(p.x - this.x, p.y - this.y) || 1
    this.vx = -(p.x - this.x) / d * 260; this.vy = -(p.y - this.y) / d * 260
    this.target = get; this.onRest = after; this.mode = 'spring'; this.follow = follow
  }
  /** the dot becomes a text cursor and the heading appears as it moves along the line */
  typeOn(letters: HTMLElement[], slot: HTMLElement, after: () => void) {
    if (!letters.length) { this.throwTo(slot, true, after, 'one'); return }
    const fs = parseFloat(getComputedStyle(letters[0]).fontSize) || 80
    this.springTo(() => this.edge(letters, -1), () => {
      this.setShape(shape('caret', '', fs * 0.78))
      this.typing = { letters, f: 0, hold: 0.32, slot, after }
      this.mode = 'type'; this.follow = true
    })
  }
  private edge(letters: HTMLElement[], k: number): Pt {
    const r = letters[Math.max(0, k)].getBoundingClientRect()
    return { x: k < 0 ? r.left - 5 : r.right + 4, y: r.top + r.height * 0.5 + this.top }
  }
  /** zoom: the dot swells until it is the whole screen, the camera cuts, and it shrinks onto the next heading */
  zoomTo(get: () => Pt, jump: () => void, after: () => void) {
    this.loose()
    const vx = this.x, vy = this.y - this.top
    const far = Math.max(Math.hypot(vx, vy), Math.hypot(innerWidth - vx, vy), Math.hypot(vx, innerHeight - vy), Math.hypot(innerWidth - vx, innerHeight - vy)) + 40
    this.setShape(shape('dot'), true)
    this.zoom = { t: 0, phase: 0, far, get, jump, after }; this.mode = 'zoom'; this.vx = this.vy = 0; this.follow = false
  }
  private target: (() => Pt) | null = null
  private free(get: () => Pt, follow: boolean, after: () => void, style: Style = 'one') {
    this.target = get; this.style = style; this.hits = 0
    this.mode = 'free'; this.grounded = false; this.still = 0; this.follow = follow; this.onRest = after
  }
  /** start mode: the period of the landing headline, pulsing until it is pressed */
  start(el: HTMLElement, next: string) { this.at = el; this.anchor = () => this.slot(el); this.next = next; this.mode = 'start' }
  /** the play box: walls, a floor and three shapes to bounce off */
  enterBox(el: HTMLElement, inv: WaveEl, onIdle: () => void, then?: () => void) {
    const b = el.getBoundingClientRect()
    // bring the whole box on screen first; the hop tracks it while the camera glides
    this.glideTo(this.top + b.top - Math.max(40, (innerHeight - b.height) / 2), 850)
    this.hopTo(() => ({ x: b.left + b.width * 0.3, y: el.getBoundingClientRect().bottom + this.top - R - 2 }), 140, () => {
      this.box = { el, inv }; this.onBoxIdle = onIdle; this.boxStill = 0
      this.mode = 'free'; this.target = null; this.onRest = null; this.vx = 300; this.vy = -900
      if (then) then()
    })
  }

  /** Launch: the dot gathers itself, then fires with extra bounce for a few seconds */
  launch(el: HTMLElement, inv: WaveEl, onIdle: () => void) {
    const charge = () => { this.mode = 'charge'; this.vx = this.vy = 0; this.charging = { t: 0, dur: 1.15 }; this.boxStill = 0; this.inward = [] }
    if (this.box && (this.mode === 'free' || this.mode === 'drag')) { this.drag = null; charge(); return }
    this.enterBox(el, inv, onIdle, charge)
  }

  /* ---- dragging, inside the play box ---- */
  private dragStart(e: PointerEvent) {
    if (!this.box) return
    if (Math.hypot(e.clientX - this.x, e.clientY - (this.y - this.top)) > 50) return
    e.preventDefault()
    this.drag = { hist: [{ x: e.clientX, y: e.clientY + this.top, t: performance.now() }] }
    this.mode = 'drag'; this.boxStill = 0
    try { this.els.root.setPointerCapture(e.pointerId) } catch { /* no-op */ }
  }
  private dragMove(e: PointerEvent) {
    if (!this.box || !this.drag) return
    const b = this.box.el.getBoundingClientRect()
    this.x = clamp(e.clientX, b.left + R, b.right - R); this.y = clamp(e.clientY, b.top + R, b.bottom - R) + this.top
    this.drag.hist.push({ x: this.x, y: this.y, t: performance.now() }); if (this.drag.hist.length > 6) this.drag.hist.shift()
  }
  private dragEnd() {
    if (!this.drag) return
    const h = this.drag.hist, a = h[0], z = h[h.length - 1], dt = Math.max(0.016, (z.t - a.t) / 1000)
    this.vx = clamp((z.x - a.x) / dt, -4000, 4000); this.vy = clamp((z.y - a.y) / dt, -4000, 4000)
    this.drag = null; this.mode = 'free'; this.grounded = false; this.still = 0; this.boxStill = 0
  }

  /* ---- impacts ---- */
  private impact(speed: number, x: number, y: number, quiet = false) {
    this.qv += Math.min(speed, 2600) * 0.0009
    if (speed > 520) this.rings.push({ x, y, t: 0, s: Math.min(1.6, speed / 1600) })
    if (speed > 1500) for (let i = 0; i < 7; i++) this.parts.push({ x, y: y - 2, vx: (Math.random() - 0.5) * 900, vy: -300 - Math.random() * 700, t: 0, r: 2.5 + Math.random() * 2 })
    if (quiet || speed < 380) return
    // never invert more than once every 0.4s, however fast it is hitting things
    const now = performance.now()
    if (now - this.lastWave < 400) return
    this.lastWave = now
    if (this.box) wave(this.box.inv, x, y - this.top, true)
    else wave(this.els.inv, x, y - this.top, false)
  }
  /** once it comes to rest, the light goes back to normal */
  private clearInv() { const inv = this.els.inv; if (inv.dataset.on === '1') wave(inv, this.x, this.y - this.top, false, false) }

  /* ---- the loop ---- */
  private step(dt: number) {
    this.t += dt
    this.sv += ((this.sT - this.s) * 340 - this.sv * 17) * dt; this.s += this.sv * dt
    this.qv += (-this.q * 700 - this.qv * 16) * dt; this.q += this.qv * dt

    if ((this.mode === 'rest' || this.mode === 'morph' || this.mode === 'start') && this.anchor) {
      const p = this.anchor(); this.x = p.x; this.y = p.y
    } else if (this.mode === 'hop' && this.hop) {
      const H = this.hop; H.t += dt
      const t = Math.min(H.t, H.T), k = t / H.T, p = H.to()
      // correct for a target that moved while the dot was in the air
      this.x = H.x0 + H.vx * t + (p.x - H.tx) * k; this.y = H.y0 + H.vy * t + 0.5 * G * t * t + (p.y - H.ty) * k
      this.vx = H.vx; this.vy = H.vy + G * t
      if (H.t >= H.T) { const sp = this.vy; this.vx = this.vy = 0; this.mode = 'rest'; this.hop = null; this.impact(sp * 0.6, this.x, this.y + R, true); H.after?.() }
    } else if (this.mode === 'spring' && this.target) {
      const p = this.target()
      this.vx += ((p.x - this.x) * 30 - this.vx * 8.4) * dt; this.vy += ((p.y - this.y) * 30 - this.vy * 8.4) * dt
      this.x += this.vx * dt; this.y += this.vy * dt
      if (Math.hypot(p.x - this.x, p.y - this.y) < 0.8 && Math.hypot(this.vx, this.vy) < 12) {
        this.x = p.x; this.y = p.y; this.vx = this.vy = 0; this.mode = 'rest'; this.follow = false; this.target = null
        const f = this.onRest; this.onRest = null; f?.()
      }
    } else if (this.mode === 'type' && this.typing) {
      const T = this.typing, n = T.letters.length
      if (T.hold > 0) T.hold -= dt
      else T.f = Math.min(n, T.f + dt * 15)
      const k = Math.floor(T.f)
      for (let i = 0; i < k; i++) T.letters[i].classList.add('t')
      const a = this.edge(T.letters, k - 1), b = this.edge(T.letters, Math.min(n - 1, k)), u = k >= n ? 0 : T.f - k
      // on a new line the cursor jumps back to the left, like a real one
      const sameLine = Math.abs(a.y - b.y) < 4
      this.x = sameLine ? a.x + (b.x - a.x) * u : a.x; this.y = sameLine ? a.y + (b.y - a.y) * u : a.y
      if (T.f >= n) {
        T.hold -= dt
        if (T.hold < -0.18) { this.typing = null; this.follow = false; this.mode = 'rest'; this.settle(T.slot); T.after() }
      }
    } else if (this.mode === 'zoom' && this.zoom) {
      const Z = this.zoom, ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
      Z.t += dt
      const big = Z.far / R
      if (Z.phase === 0) {
        this.zk = 1 + (big - 1) * Math.pow(clamp(Z.t / 0.55), 3)
        if (Z.t >= 0.55) { Z.jump(); Z.phase = 1; Z.t = 0; const p = Z.get(); this.x = p.x; this.y = p.y }
      } else {
        const p = Z.get(); this.x = p.x; this.y = p.y
        this.zk = 1 + (big - 1) * (1 - ease(clamp(Z.t / 0.7)))
        if (Z.t >= 0.7) { this.zk = 1; this.zoom = null; this.mode = 'rest'; Z.after() }
      }
    } else if (this.mode === 'charge' && this.charging) {
      const C = this.charging
      C.t += dt
      if (Math.floor((C.t - dt) / 0.11) !== Math.floor(C.t / 0.11)) this.inward.push({ t: 0 })
      if (C.t >= C.dur) {
        // release: up and across, hard enough to find every shape and wall
        this.charging = null; this.mode = 'free'; this.grounded = false; this.boost = 2.4
        const b = this.box?.el.getBoundingClientRect(), right = b ? this.x < b.left + b.width / 2 : true
        const a = -Math.PI / 2 + (right ? 0.62 : -0.62)
        this.vx = Math.cos(a) * 3000; this.vy = Math.sin(a) * 3000
        this.q = -0.4; this.qv = 0
        this.rings.push({ x: this.x, y: this.y, t: 0, s: 2.2 })
        for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; this.parts.push({ x: this.x, y: this.y, vx: Math.cos(t) * 900, vy: Math.sin(t) * 900 - 200, t: 0, r: 3 + Math.random() * 2 }) }
        if (this.box) wave(this.box.inv, this.x, this.y - this.top, true)
      }
    } else if (this.mode === 'free') {
      // a target that moves (a sticky heading while you scroll) carries a dot that is sitting on it
      if (this.target) { const p = this.target(); if (this.grounded) this.y += p.y - this.floorY; this.floorY = p.y; this.steerX = p.x } else this.steerX = null
      let walls: { l: number; r: number; t: number } | null = null
      if (this.box) { const b = this.box.el.getBoundingClientRect(); walls = { l: b.left + R, r: b.right - R, t: b.top + this.top + R }; this.floorY = b.bottom + this.top - R }
      this.vy += G * dt; this.x += this.vx * dt; this.y += this.vy * dt
      if (this.y >= this.floorY) {
        this.y = this.floorY
        const sp = this.vy
        this.hits++
        // 'bounce' keeps bouncing and inverts the light; 'one' gives a single soft bounce and stops
        if (sp > 70 && !(this.style === 'one' && !this.box && this.hits > 1)) {
          this.vy = -Math.min(sp * (this.style === 'one' && !this.box ? 0.3 : this.e), this.boost > 0 ? 4200 : 1700); this.impact(sp, this.x, this.y + R, !!this.box || this.style === 'one'); this.vx *= 0.9
        } else { if (sp > 70) this.impact(sp * 0.5, this.x, this.y + R, true); this.vy = 0; this.grounded = true }
      } else this.grounded = false
      if (this.steerX !== null && this.vy >= 0 && this.y > this.floorY - 30) this.vx += ((this.steerX - this.x) * 60 - this.vx * 11) * dt
      if (this.grounded && this.steerX === null) this.vx *= Math.pow(0.02, dt)
      if (walls) {
        if (this.x < walls.l) { this.x = walls.l; if (this.vx < 0) { this.impact(-this.vx, this.x - R, this.y, true); this.vx = -this.vx * this.e } }
        if (this.x > walls.r) { this.x = walls.r; if (this.vx > 0) { this.impact(this.vx, this.x + R, this.y, true); this.vx = -this.vx * this.e } }
        if (this.y < walls.t) { this.y = walls.t; if (this.vy < 0) { this.impact(-this.vy, this.x, this.y - R, true); this.vy = -this.vy * this.e } }
        this.box?.el.querySelectorAll<HTMLElement>('.ug-ob').forEach((o) => this.collide(o))
        if (this.grounded && Math.abs(this.vx) < 8 && this.boost <= 0) { this.boxStill += dt; if (this.boxStill > 2.2) { this.boxStill = 0; const f = this.onBoxIdle; this.clearBoxInv(); this.box = null; this.onBoxIdle = null; f?.() } }
        else this.boxStill = 0
      } else if (this.grounded && Math.abs(this.vx) < 6 && (this.steerX === null || Math.abs(this.x - this.steerX) < 1.5)) {
        this.still += dt
        if (this.still > 0.22) { this.mode = 'rest'; this.vx = 0; this.follow = false; this.target = null; this.clearInv(); const f = this.onRest; this.onRest = null; f?.() }
      } else this.still = 0
    }
    if (this.boost > 0) this.boost = Math.max(0, this.boost - dt)
    for (const r of this.inward) r.t += dt
    this.inward = this.inward.filter((r) => r.t < 0.45)
    for (const p of this.parts) { p.t += dt; p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt }
    this.parts = this.parts.filter((p) => p.t < 0.7)
    for (const r of this.rings) r.t += dt
    this.rings = this.rings.filter((r) => r.t < 0.55)
  }
  private clearBoxInv() { const b = this.box; if (b && b.inv.dataset.on === '1') wave(b.inv, this.x, this.y - this.top, true, false) }
  private collide(o: HTMLElement) {
    const r = o.getBoundingClientRect(), round = Math.min(parseFloat(getComputedStyle(o).borderTopLeftRadius) || 0, r.width / 2, r.height / 2)
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2 + this.top, px = this.x - cx, py = this.y - cy
    const d = sdfRR(px, py, r.width, r.height, round) - R
    if (d >= 0) return
    const e = 0.5, nx = sdfRR(px + e, py, r.width, r.height, round) - sdfRR(px - e, py, r.width, r.height, round), ny = sdfRR(px, py + e, r.width, r.height, round) - sdfRR(px, py - e, r.width, r.height, round)
    const l = Math.hypot(nx, ny) || 1, ux = nx / l, uy = ny / l
    this.x -= ux * d; this.y -= uy * d
    const vn = this.vx * ux + this.vy * uy
    if (vn < 0) {
      this.vx -= (1 + this.e) * vn * ux; this.vy -= (1 + this.e) * vn * uy
      this.impact(-vn, this.x - ux * R, this.y - uy * R, -vn < 380)
      if (-vn >= 380) {
        // the shape it hit lights up and cheers
        const n = this.pops++, lab = o.querySelector('span')
        o.style.setProperty('--neon', NEON[n % NEON.length])
        if (lab) lab.textContent = CHEERS[n % CHEERS.length]
        o.classList.remove('pop'); void o.offsetWidth; o.classList.add('pop')
        window.clearTimeout(Number(o.dataset.t)); o.dataset.t = String(window.setTimeout(() => o.classList.remove('pop'), 1100))
      } else { o.classList.add('hit'); window.setTimeout(() => o.classList.remove('hit'), 90) }
    }
  }

  /* ---- camera ---- */
  private camera() {
    if (!this.follow || performance.now() - this.userScrolled < 900) return
    const root = this.els.root, want = clamp(this.y - innerHeight * 0.45, 0, root.scrollHeight - root.clientHeight)
    if (Math.abs(want - root.scrollTop) > 0.5) root.scrollTop += (want - root.scrollTop) * 0.14
  }
  /** a glide with inertia: fast out, long settle */
  glideTo(y: number, D = 900) {
    const root = this.els.root, y0 = root.scrollTop, d = y - y0, t0 = performance.now()
    const f = (now: number) => { const k = Math.min(1, (now - t0) / D); root.scrollTop = y0 + d * (1 - Math.pow(1 - k, 4)); if (k < 1) requestAnimationFrame(f) }
    requestAnimationFrame(f)
  }

  /* ---- drawing ---- */
  /** which band the dot is over; measured every fourth frame, which is plenty */
  private tone(yv: number): Tone {
    if (this.toneCache.n-- > 0) return this.toneCache.tone
    if (!this.sections.length) this.sections = [...this.els.root.querySelectorAll<HTMLElement>('[data-tone]')]
    let tone: Tone = 'dark'
    for (const s of this.sections) { const r = s.getBoundingClientRect(); if (yv >= r.top && yv < r.bottom) { tone = s.dataset.tone as Tone; break } }
    this.toneCache = { n: 3, tone }
    return tone
  }
  private draw() {
    const { g, path, fx, label } = this.els
    if (this.mode === 'off' || this.mode === 'hidden') { g.style.opacity = '0'; label.style.opacity = '0'; fx.innerHTML = ''; return }
    g.style.opacity = '1'
    const sx = this.x, sy = this.y - this.top, k = this.s
    // the outline only changes while it morphs; a dot at rest skips the rebuild
    const D = this.drawn
    if (D.from !== this.from || D.to !== this.to || Math.abs(D.s - k) > 0.0005) {
      let d = ''
      for (let i = 0; i < N; i++) { const x = this.from.pts[i * 2] + (this.to.pts[i * 2] - this.from.pts[i * 2]) * k, y = this.from.pts[i * 2 + 1] + (this.to.pts[i * 2 + 1] - this.from.pts[i * 2 + 1]) * k; d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) }
      path.setAttribute('d', d + 'Z')
      D.from = this.from; D.to = this.to; D.s = k
    }
    const zooming = this.mode === 'zoom'
    const hh = zooming ? 0 : (this.from.h + (this.to.h - this.from.h) * k) / 2
    const pinned = this.mode === 'pin'
    const speed = pinned ? this.pinSpeed : Math.hypot(this.vx, this.vy)
    const flying = pinned || this.mode === 'hop' || this.mode === 'drag' || this.mode === 'spring' || (this.mode === 'free' && !this.grounded)
    const st = flying ? Math.min(pinned ? 2.4 : 0.32, speed / (pinned ? 2200 : 4200)) : 0
    const ang = pinned ? 90 : Math.atan2(this.vy, this.vx) * 180 / Math.PI
    let q = clamp(this.q, -0.35, 0.45), jx = 0, pulse = 1
    if (this.mode === 'start') {
      // the start button: it breathes, and every few seconds it shakes to be pressed
      const c = this.t % 3.2
      pulse = this.hover ? 1.3 : 1 + 0.1 * Math.sin(this.t * 5.2)
      if (c > 2.6 && !this.hover) jx = Math.sin(c * 70) * 5 * (3.2 - c) / 0.6
      if (c < 0.016) this.rings.push({ x: this.x, y: this.y, t: 0, s: 0.9 })
      q = 0
    }
    if (zooming) pulse = this.zk
    let jy = 0
    if (this.mode === 'charge' && this.charging) {
      const k = clamp(this.charging.t / this.charging.dur)
      jx = (Math.random() - 0.5) * 9 * k * k; jy = (Math.random() - 0.5) * 9 * k * k
      pulse = 1 - 0.3 * k + 0.05 * Math.sin(this.t * 60) * k
      q = -0.25 * k
    }
    if (this.mode === 'type' && this.typing && this.typing.hold > 0 && this.typing.f >= this.typing.letters.length) pulse = 1
    const sq = pinned || zooming ? 0 : q
    g.setAttribute('transform', `translate(${sx + jx} ${sy + hh + jy}) scale(${(1 + sq) * pulse} ${(1 - sq) * pulse}) translate(0 ${-hh}) rotate(${ang}) scale(${1 + st} ${1 / Math.sqrt(1 + st)}) rotate(${-ang})`)

    // colour: it contrasts with whatever is under it, red while it moves, green when you can go
    const inv = this.box ? this.box.inv.dataset.on === '1' : this.els.inv.dataset.on === '1'
    let tone: Tone = pinned ? 'light' : this.tone(sy)
    if (this.box) tone = 'dark'
    const light = (tone === 'light') !== inv
    const restFill = light ? INK : PAPER
    if (this.mode !== 'morph' && this.mode !== 'start') this.hover = false
    const moving = flying && !pinned && speed > 260
    // keyboard focus on the button the dot has become reads the same as a hover
    const focusHit = !!this.focused && ((this.mode === 'morph' && this.focused === this.at) || (this.mode === 'start' && this.focused.classList.contains('ug-start')))
    const hot = this.hover || focusHit
    const fill = hot ? GREEN : moving ? (tone === 'red' ? INK : RED) : restFill
    path.setAttribute('fill', zooming || this.mode === 'charge' || this.boost > 0 ? RED : fill)
    if (pinned) path.setAttribute('fill', this.pinColor)

    const lab = this.to.label
    if (label.textContent !== lab) label.textContent = lab
    const la = this.mode === 'morph' ? clamp((k - 0.55) / 0.45) : 0
    label.style.opacity = String(la)
    label.style.color = hot ? '#fff' : fill === INK ? PAPER : INK
    label.style.transform = `translate(${sx + (this.to.dx || 0) - label.offsetWidth / 2}px, ${sy - 13}px) scale(${0.85 + 0.15 * la})`

    if (speed > 1100 && flying && !pinned) this.ghosts.unshift({ x: this.x, y: this.y }); else this.ghosts.pop()
    this.ghosts.length = Math.min(this.ghosts.length, 6)
    let f = ''
    this.ghosts.forEach((p, i) => { if (i) f += `<circle cx="${p.x}" cy="${p.y - this.top}" r="${R * (1 - i * 0.11)}" fill="${RED}" opacity="${0.22 * (1 - i / 6)}"/>` })
    this.rings.forEach((r) => { const e = 1 - Math.pow(1 - r.t / 0.55, 3); f += `<ellipse cx="${r.x}" cy="${r.y - this.top}" rx="${(14 + 70 * e) * r.s}" ry="${(this.mode === 'start' ? 14 + 70 * e : 4 + 16 * e) * r.s}" fill="none" stroke="${restFill}" stroke-width="2" opacity="${0.5 * (1 - r.t / 0.55)}"/>` })
    // potential energy: rings drawn in toward the dot while it charges
    this.inward.forEach((r) => { const e = r.t / 0.45; f += `<circle cx="${this.x}" cy="${this.y - this.top}" r="${R + (1 - e) * 90}" fill="none" stroke="${RED}" stroke-width="${1 + e * 2.5}" opacity="${e * 0.8}"/>` })
    this.parts.forEach((p) => { f += `<circle cx="${p.x}" cy="${p.y - this.top}" r="${p.r * (1 - p.t / 0.7)}" fill="${RED}"/>` })
    if (f || D.fx) fx.innerHTML = f
    D.fx = !!f
  }
  /** the dive sets this as the light changes, so the dot always reads */
  pinColor = INK
}
