import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SPRINGS } from '../../lib/spring'

// ============================================================================
// ProtoStage — the "Try it" pill grows into a browser window running the real
// prototype, on the page. One element morphs the whole way: the pill's box
// springs out to the window's box while its label blurs away and the window
// chrome arrives. The page behind steps back a little, like a camera pulling
// focus. The iframe only mounts once the window has landed, so nothing inside
// reflows mid-flight. Closing runs the same morph back into the pill.
// ============================================================================

interface Props {
  url: string
  host: string
  title: string
  from: DOMRect
  onClose: () => void
}

const finalBox = () => {
  const w = Math.min(1240, window.innerWidth * 0.88)
  const h = Math.min(800, window.innerHeight * 0.84)
  return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h }
}

export default function ProtoStage({ url, host, title, from, onClose }: Props) {
  const winRef = useRef<HTMLDivElement>(null)
  const [landed, setLanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const closing = useRef(false)

  const morph = (dir: 'in' | 'out') => {
    const el = winRef.current
    if (!el) return Promise.resolve()
    const to = finalBox()
    const pill = { left: from.left, top: from.top, width: from.width, height: from.height, borderRadius: from.height / 2 }
    const win = { ...to, borderRadius: 18 }
    const frames = (dir === 'in' ? [pill, win] : [win, pill]).map(b => ({
      left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px`, borderRadius: `${b.borderRadius}px`,
    }))
    const sp = dir === 'in' ? SPRINGS.snap : SPRINGS.glide
    return el.animate(frames, { duration: dir === 'in' ? sp.ms : 520, easing: dir === 'in' ? sp.css : 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }).finished
  }

  useLayoutEffect(() => {
    document.body.classList.add('ps-open')
    morph('in').then(() => setLanded(true))
    return () => document.body.classList.remove('ps-open')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = async () => {
    if (closing.current) return
    closing.current = true
    setLanded(false)
    setLoaded(false)
    document.body.classList.remove('ps-open')
    winRef.current?.classList.add('ps-leaving')
    await morph('out')
    onClose()
  }

  // Escape closes the stage only, not the card underneath it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); close() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div className="ps-root" role="dialog" aria-label={`${title}, live prototype`}>
      <div className="ps-backdrop" onClick={close} />
      <div className="ps-win" ref={winRef}>
        <div className="ps-pill-label" aria-hidden>Try it live</div>
        <div className="ps-chrome">
          <div className="ps-bar">
            <button className="ps-dot r" onClick={close} aria-label="Close prototype" />
            <i className="ps-dot y" /><i className="ps-dot g" />
            <div className="ps-url">{host}</div>
            <a className="ps-ext" href={url} target="_blank" rel="noreferrer">Open in a new tab ↗</a>
          </div>
          <div className="ps-body">
            {!loaded && <div className="ps-loading"><span /><span /><span /></div>}
            {landed && <iframe src={url} title={title} onLoad={() => setLoaded(true)} className={loaded ? 'in' : ''} allow="autoplay; fullscreen" />}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
