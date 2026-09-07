import { useRef, useState } from 'react'
import portraitFront from '../../assets/portrait-front.jpg'
import harvardShop from '../../assets/harvard-shop.jpg'
import poster from '../../assets/poster-human-inventory.jpg'

// ============================================================================
// MediaFolder — the about-me corner of the home page. A closed macOS-style
// folder sits in a soft blue field; clicking it springs a handful of little
// titled windows out of it (photos + txt files). Windows are draggable and
// clicking one brings it to the front. Clicking the folder again files
// everything away.
// ============================================================================

interface Win {
  id: string
  title: string
  w: number
  x: number // open position, % of container
  y: number
  rot: number
  img?: string
  imgH?: number
  lines?: string[]
}

const WINDOWS: Win[] = [
  { id: 'me', title: 'Just Me.jpg', w: 172, x: 4, y: 2, rot: -2, img: portraitFront, imgH: 152 },
  { id: 'series', title: 'Film Series.png', w: 138, x: 40, y: 0, rot: 1.5, img: poster, imgH: 168 },
  { id: 'shop', title: 'The Shop.jpg', w: 188, x: 62, y: 10, rot: -1.5, img: harvardShop, imgH: 136 },
  { id: 'stats', title: 'Stats.txt', w: 186, x: 5, y: 58, rot: 1, lines: ["Harvard CS '27", 'Visual Studies', 'Cambridge, MA'] },
  { id: 'free', title: 'Free Time.txt', w: 210, x: 52, y: 62, rot: -1, lines: ['painting · music', 'Gameboy Pokémon', '2018 Harden highlights'] },
]

export default function MediaFolder() {
  const [open, setOpen] = useState(false)
  const [drag, setDrag] = useState<Record<string, { dx: number; dy: number }>>({})
  const zRef = useRef<Record<string, number>>({})
  const zTop = useRef(10)
  const fieldRef = useRef<HTMLDivElement>(null)

  const onWinDown = (id: string) => (e: React.PointerEvent) => {
    if (!open) return
    e.stopPropagation()
    e.preventDefault()
    zTop.current += 1
    zRef.current[id] = zTop.current
    const el = e.currentTarget as HTMLElement
    const rot = WINDOWS.find((w) => w.id === id)?.rot ?? 0
    const start = { x: e.clientX, y: e.clientY }
    const base = drag[id] ?? { dx: 0, dy: 0 }
    let last = base
    // transitions off + direct style writes while dragging — the open/close
    // spring transition otherwise fights the cursor and lags behind it
    el.classList.add('mf-dragging')
    el.style.zIndex = String(zTop.current)
    try { el.setPointerCapture(e.pointerId) } catch { /* no-op */ }
    const move = (ev: PointerEvent) => {
      last = { dx: base.dx + ev.clientX - start.x, dy: base.dy + ev.clientY - start.y }
      el.style.transform = `translate(${last.dx}px, ${last.dy}px) rotate(${rot}deg)`
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.classList.remove('mf-dragging')
      setDrag((d) => ({ ...d, [id]: last }))
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  return (
    <div className={'mf-field' + (open ? ' mf-open' : '')} ref={fieldRef}>
      {WINDOWS.map((w, i) => {
        const d = drag[w.id] ?? { dx: 0, dy: 0 }
        return (
          <div
            key={w.id}
            className="mf-win"
            style={{
              width: w.w,
              left: `${w.x}%`,
              top: `${w.y}%`,
              zIndex: zRef.current[w.id] ?? i + 2,
              transform: open
                ? `translate(${d.dx}px, ${d.dy}px) rotate(${w.rot}deg)`
                : undefined,
              transitionDelay: open ? `${i * 45}ms` : `${(WINDOWS.length - i) * 25}ms`,
            }}
            onPointerDown={onWinDown(w.id)}
          >
            <div className="mf-bar">
              <span className="mf-dot r" /><span className="mf-dot y" /><span className="mf-dot g" />
              <span className="mf-title">{w.title}</span>
            </div>
            {w.img && <img src={w.img} alt={w.title} style={{ height: w.imgH }} draggable={false} />}
            {w.lines && (
              <div className="mf-txt">
                {w.lines.map((l) => <div key={l}>{l}</div>)}
              </div>
            )}
          </div>
        )
      })}

      <button
        className="mf-folder"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close the About Paul folder' : 'Open the About Paul folder'}
      >
        <span className="mf-folder-icon">
          <span className="mf-folder-back" />
          <span className="mf-folder-front" />
        </span>
        <span className="mf-folder-label">About Paul</span>
      </button>
    </div>
  )
}
