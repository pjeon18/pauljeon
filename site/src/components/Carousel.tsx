import { useEffect, useRef } from 'react'
import { ARC, cards } from '../content/site'
import type { Category } from '../content/site'
import CardArt from './CardArt'

// The arc carousel: cards hang on a wheel anchored below the fold.
// Click a side or an off-center card to rotate, drag to spin (snaps on
// release), ←/→ while in view, auto-rotate every ARC.autoMs (paused on
// hover). Edge cards fade out by arc angle instead of clipping.

export default function Carousel({ filter }: { filter: Category }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef(filter)
  const layoutRef = useRef<() => void>(() => {})

  useEffect(() => {
    filterRef.current = filter
    layoutRef.current()
  }, [filter])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const els = Array.from(stage.querySelectorAll<HTMLElement>('.acard'))
    const N = els.length
    let active = 0
    let spin = 0
    const prevOff: number[] = new Array(N)

    const wrapOffset = (i: number) => {
      let off = (i - active) % N
      if (off < -N / 2) off += N
      if (off >= N / 2) off -= N
      return off
    }

    function layout() {
      els.forEach((el, i) => {
        const off = wrapOffset(i)
        if (prevOff[i] !== undefined && Math.abs(off - prevOff[i]) > N / 2 - 0.5) {
          el.classList.add('jump')
        } else {
          el.classList.remove('jump')
        }
        prevOff[i] = off
        const theta = off * ARC.step + spin
        el.style.transform = `translate(-50%, -50%) rotate(${theta}deg) translateY(-${ARC.radius}px)`
        el.style.zIndex = String(100 - Math.round(Math.abs(theta)))
        // dissolve toward the fan edges instead of flat-clipping
        const fade = Math.max(0, Math.min(1, 1 - (Math.abs(theta) - 32) / 14))
        const cats = (el.getAttribute('data-cat') || '').split(' ')
        const f = filterRef.current
        const dim = !(f === 'all' || cats.includes('all') || cats.includes(f))
        el.classList.toggle('dim', dim)
        el.style.opacity = String(dim ? Math.min(0.12, fade) : fade)
      })
    }
    layoutRef.current = layout

    const advance = (d: number) => {
      active = (((active + d) % N) + N) % N
      layout()
    }

    // entrance: stacked at center, then fan out
    if (!reduced) {
      stage.classList.add('no-anim')
      els.forEach((el) => {
        el.style.transform = `translate(-50%, -50%) rotate(0deg) translateY(-${ARC.radius}px)`
      })
      void stage.offsetWidth
      requestAnimationFrame(() => {
        stage.classList.remove('no-anim')
        layout()
      })
    } else {
      layout()
    }

    // auto-rotate, paused on hover
    let paused = false
    const timer = !reduced && ARC.autoMs > 0
      ? setInterval(() => { if (!paused && !document.hidden) advance(1) }, ARC.autoMs)
      : undefined
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false }
    stage.addEventListener('mouseenter', onEnter)
    stage.addEventListener('mouseleave', onLeave)

    // keyboard: arrows spin the wheel while it's in view
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const r = stage.getBoundingClientRect()
      if (r.top > window.innerHeight * 0.8 || r.bottom < window.innerHeight * 0.2) return
      e.preventDefault()
      advance(e.key === 'ArrowRight' ? 1 : -1)
    }
    document.addEventListener('keydown', onKey)

    // drag to spin + click to rotate
    const onDown = (e: PointerEvent) => {
      const startX = e.clientX
      let moved = false
      try { stage.setPointerCapture(e.pointerId) } catch { /* no-op */ }
      stage.classList.add('dragging')

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX
        if (Math.abs(dx) > 6) {
          moved = true
          stage.classList.add('no-anim')
        }
        spin = (dx / stage.clientWidth) * 52
        if (moved) layout()
      }
      const up = (ev: PointerEvent) => {
        try { stage.releasePointerCapture(ev.pointerId) } catch { /* no-op */ }
        stage.classList.remove('dragging')
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerup', up)
        stage.removeEventListener('pointercancel', up)

        if (moved) {
          const steps = Math.round(spin / ARC.step)
          spin = 0
          stage.classList.remove('no-anim')
          advance(-steps)
        } else {
          spin = 0
          const target = ev.target as HTMLElement
          if (target.closest('a')) return // let real links click through
          const card = target.closest<HTMLElement>('.acard')
          if (card) {
            const off = wrapOffset(els.indexOf(card))
            if (off !== 0) advance(off)
          } else {
            const rect = stage.getBoundingClientRect()
            const fx = (ev.clientX - rect.left) / rect.width
            if (fx < 0.45) advance(-1)
            else if (fx > 0.55) advance(1)
          }
        }
      }
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerup', up)
      stage.addEventListener('pointercancel', up)
    }
    stage.addEventListener('pointerdown', onDown)

    return () => {
      if (timer) clearInterval(timer)
      document.removeEventListener('keydown', onKey)
      stage.removeEventListener('mouseenter', onEnter)
      stage.removeEventListener('mouseleave', onLeave)
      stage.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div className="arc-stage" ref={stageRef}>
      {cards.map((card) => (
        <div key={card.id} className="acard" data-cat={card.cats.join(' ')}>
          <div className="cardbody">
            <div className="face">
              <div className="photo"><CardArt card={card} /></div>
              <div className="caption">
                <div className="t">{card.title}</div>
                <div className="m">{card.meta}</div>
              </div>
              <div className="reveal">
                <div className="cat">{card.meta.split('·')[0].trim()}</div>
                <div className="blurb">{card.blurb}</div>
                {card.href && (
                  <a className="more" href={card.href} target={card.href.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
                    {card.linkLabel || 'Read more'} <span className="arr">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
