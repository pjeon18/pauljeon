import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { films, protos } from '../../content/motion'
import { cards } from '../../content/site'
import { SPRINGS } from '../../lib/spring'
import ProtoStage from './ProtoStage'

// ============================================================================
// Product Demos — every product film, one per screen, swiped vertically. It opens by
// zooming out of whatever launched it (a card's art, or the Reels pill): the
// whole viewer starts clipped to that rect and springs open to full screen.
// Only the reel in view plays; the bars along the top are each film's
// progress, story style. Tap pauses, ↑/↓ or a swipe moves, Esc zooms back.
// ============================================================================

interface Props { start?: number; from: DOMRect; onClose: () => void }

const inset = (r: DOMRect, rad: number) =>
  `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round ${rad}px)`

export default function Reels({ start = 0, from, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const vids = useRef<(HTMLVideoElement | null)[]>([])
  const [cur, setCur] = useState(start)
  const [prog, setProg] = useState<number[]>(() => films.map(() => 0))
  const [dur, setDur] = useState<number[]>(() => films.map(() => 0))
  const scrubbing = useRef(false)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [stage, setStage] = useState<{ rect: DOMRect; card: string } | null>(null)
  const closing = useRef(false)

  // open: clipped to the launcher's rect, springing out to the viewport
  useLayoutEffect(() => {
    const el = rootRef.current, list = listRef.current
    if (!el || !list) return
    list.scrollTop = start * window.innerHeight
    document.body.classList.add('rl-open')
    el.animate([{ clipPath: inset(from, 14) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: SPRINGS.snap.ms + 80, easing: SPRINGS.snap.css, fill: 'forwards' })
    return () => document.body.classList.remove('rl-open')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = async () => {
    if (closing.current) return
    closing.current = true
    vids.current.forEach(v => v?.pause())
    document.body.classList.remove('rl-open')
    await rootRef.current?.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: inset(from, 14) }], { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }).finished
    onClose()
  }

  // whichever reel is in view plays from the top; the rest rest at frame 0
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return
      if (i === cur) { v.currentTime = 0; v.muted = muted; v.play().catch(() => {}) }
      else { v.pause(); v.currentTime = 0 }
    })
    setPaused(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur])
  useEffect(() => { const v = vids.current[cur]; if (v) v.muted = muted }, [muted, cur])

  const go = (i: number) => {
    const n = Math.max(0, Math.min(films.length - 1, i))
    listRef.current?.scrollTo({ top: n * window.innerHeight, behavior: 'smooth' })
  }
  const onScroll = () => {
    const l = listRef.current
    if (!l) return
    const i = Math.round(l.scrollTop / window.innerHeight)
    if (i !== cur) setCur(i)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage) return
      if (e.key === 'Escape') { e.stopImmediatePropagation(); close() }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); e.stopImmediatePropagation(); go(cur + (e.key === 'ArrowDown' ? 1 : -1)) }
      if (e.key === ' ') { e.preventDefault(); toggle() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopImmediatePropagation(); skip(e.key === 'ArrowRight' ? 5 : -5) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, stage])

  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
  const seekTo = (i: number, ratio: number) => {
    const v = vids.current[i]
    if (!v || !v.duration) return
    const r = Math.max(0, Math.min(1, ratio))
    v.currentTime = r * v.duration
    setProg(p => { const q = [...p]; q[i] = r; return q })
  }
  const skip = (secs: number) => {
    const v = vids.current[cur]
    if (v && v.duration) seekTo(cur, (v.currentTime + secs) / v.duration)
  }
  // press, drag and release on the track: the film follows the hand, then resumes
  const startScrub = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const track = e.currentTarget.querySelector('.rl-track') as HTMLElement
    const v = vids.current[i]
    if (!track || !v) return
    const wasPlaying = !v.paused
    v.pause()
    scrubbing.current = true
    e.currentTarget.classList.add('dragging')
    const at = (x: number) => { const r = track.getBoundingClientRect(); seekTo(i, (x - r.left) / r.width) }
    at(e.clientX)
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => at(ev.clientX)
    const up = () => {
      scrubbing.current = false
      el.classList.remove('dragging')
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      if (wasPlaying) { v.play().catch(() => {}); setPaused(false) }
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
  }

  const toggle = () => {
    const v = vids.current[cur]
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setPaused(false) } else { v.pause(); setPaused(true) }
  }

  return createPortal(
    <div className="rl-root" ref={rootRef} role="dialog" aria-label="Product demos">
      <div className="rl-bars" aria-hidden>
        {films.map((f, i) => (
          <i key={f.src}><b style={{ transform: `scaleX(${i < cur ? 1 : i === cur ? prog[i] : 0})` }} /></i>
        ))}
      </div>
      <div className="rl-list" ref={listRef} onScroll={onScroll}>
        {films.map((f, i) => {
          const card = cards.find(c => c.id === f.card)
          const proto = protos[f.card]
          return (
            <section key={f.src} className={'rl-slide' + (i === cur ? ' on' : '')}>
              <div className="rl-bg" style={{ backgroundImage: `url(${f.poster})` }} />
              <div className="rl-frame" onClick={toggle}>
                <video
                  ref={el => { vids.current[i] = el }}
                  src={f.src}
                  poster={f.poster}
                  playsInline
                  muted
                  preload={Math.abs(i - start) <= 1 ? 'auto' : 'metadata'}
                  onLoadedMetadata={e => { const d = e.currentTarget.duration; setDur(p => { const q = [...p]; q[i] = d; return q }) }}
                  onTimeUpdate={e => { if (scrubbing.current) return; const v = e.currentTarget; setProg(p => { const q = [...p]; q[i] = v.duration ? v.currentTime / v.duration : 0; return q }) }}
                  onEnded={() => (i < films.length - 1 ? go(i + 1) : undefined)}
                />
                <div className={'rl-paused' + (paused && i === cur ? ' show' : '')} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 22 22"><path d="M6 3.5 L18.5 11 L6 18.5 Z" fill="currentColor" /></svg>
                </div>
                <div className="rl-controls" onClick={e => e.stopPropagation()}>
                  <button className="rl-pp" onClick={toggle} aria-label={paused && i === cur ? 'Play' : 'Pause'}>
                    {paused && i === cur
                      ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor" /></svg>
                      : <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.4" y="1.6" width="2.6" height="8.8" rx="0.8" fill="currentColor" /><rect x="7" y="1.6" width="2.6" height="8.8" rx="0.8" fill="currentColor" /></svg>}
                  </button>
                  <span className="rl-time">{fmt(prog[i] * (dur[i] || 0))}</span>
                  <div className="rl-scrub" onPointerDown={startScrub(i)} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(dur[i] || 0)} aria-valuenow={Math.round(prog[i] * (dur[i] || 0))} tabIndex={0}>
                    <div className="rl-track">
                      <b style={{ transform: `scaleX(${prog[i]})` }} />
                      <i className="rl-knob" style={{ left: `${prog[i] * 100}%` }} />
                    </div>
                  </div>
                  <span className="rl-time">{fmt(dur[i] || 0)}</span>
                </div>
              </div>
              <div className="rl-copy">
                <div className="rl-kicker">{card?.meta}</div>
                <h2>{f.title}</h2>
                <p>{f.sub}</p>
                <div className="rl-actions">
                  {proto && (
                    <button className="rl-btn solid" onClick={e => { vids.current[cur]?.pause(); setStage({ rect: (e.currentTarget as HTMLElement).getBoundingClientRect(), card: f.card }) }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden><path d="M3 1.6 L10.4 6 L3 10.4 Z" fill="currentColor" /></svg>
                      Try it live
                    </button>
                  )}
                  {card?.slug && <Link className="rl-btn" to={`/work/${card.slug}`} onClick={() => document.body.classList.remove('rl-open')}>Read the case study</Link>}
                </div>
              </div>
            </section>
          )
        })}
      </div>
      <div className="rl-side">
        <button className="rl-round" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted
            ? <svg width="18" height="16" viewBox="0 0 18 16"><path d="M2 5.5 H5.2 L9.4 2 V14 L5.2 10.5 H2 Z" fill="currentColor" /><path d="M12.4 5.6 L16.2 9.4 M16.2 5.6 L12.4 9.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            : <svg width="18" height="16" viewBox="0 0 18 16"><path d="M2 5.5 H5.2 L9.4 2 V14 L5.2 10.5 H2 Z" fill="currentColor" /><path d="M12 5.2 C13.4 6.6 13.4 9.4 12 10.8 M14.4 3.2 C17.2 5.8 17.2 10.2 14.4 12.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
        </button>
        <button className="rl-round" onClick={() => go(cur - 1)} disabled={cur === 0} aria-label="Previous demo">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 9 L7 5 L11 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="rl-round" onClick={() => go(cur + 1)} disabled={cur === films.length - 1} aria-label="Next demo">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 5 L7 9 L11 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <button className="rl-close" onClick={close} aria-label="Close product demos">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      {stage && protos[stage.card] && (
        <ProtoStage url={protos[stage.card].url} host={protos[stage.card].host} title={cards.find(c => c.id === stage.card)?.title ?? ''} from={stage.rect}
          onClose={() => { setStage(null); vids.current[cur]?.play().catch(() => {}) }} />
      )}
    </div>,
    document.body,
  )
}
