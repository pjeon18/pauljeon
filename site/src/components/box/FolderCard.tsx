import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Folder } from '../../content/site'
import { about, footer } from '../../content/site'
import CardArt from '../CardArt'

// ============================================================================
// FolderCard — the detail card a folder expands into. Lives in a fixed 2D
// overlay OUTSIDE the 3D scene (position:fixed breaks under transformed
// ancestors, and Safari flattens preserve-3d under opacity), so the morph is
// a FLIP: measure the risen folder's projected rect, animate the card from
// that rect to its natural centered layout via WAAPI, cross-fading the folder
// out underneath. Close reverses it. Reduced motion = plain fade.
// ============================================================================

const RISE_MS = 380 // matches the .is-up rise in box.css

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function flipKeyframes(from: DOMRect, to: DOMRect) {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  const sx = Math.max(0.05, from.width / to.width)
  const sy = Math.max(0.05, from.height / to.height)
  return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
}

export default function FolderCard({
  folder,
  originEl,
  onClosed,
}: {
  folder: Folder
  originEl: HTMLElement | null
  onClosed: () => void
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef(false)
  const [shown, setShown] = useState(false)

  const title =
    folder.kind === 'about' ? about.heading : folder.kind === 'resume' ? 'Résumé.' : folder.card!.title

  useEffect(() => {
    const prev = document.title
    document.title = `${folder.kind === 'project' ? folder.card!.title : folder.tab} — Paul Jeon`
    return () => {
      document.title = prev
    }
  }, [folder])

  // enter: wait for the folder to rise out of the box, then FLIP from it
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const skip = reduced()
    const t = window.setTimeout(
      () => {
        setShown(true)
        originEl?.classList.add('bx-hand-off')
        if (!skip && originEl) {
          const from = originEl.getBoundingClientRect()
          const to = card.getBoundingClientRect()
          if (from.width > 30 && to.width > 0) {
            // FLIP with a soft settle: land 1.2% over, then relax to rest
            card.animate(
              [
                { transform: flipKeyframes(from, to), opacity: 0.25 },
                { transform: 'scale(1.012)', opacity: 1, offset: 0.8 },
                { transform: 'none', opacity: 1 },
              ],
              { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
            )
          }
        } else {
          card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 })
        }
        closeBtnRef.current?.focus()
      },
      skip ? 0 : RISE_MS,
    )
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (closingRef.current) return
    closingRef.current = true
    const card = cardRef.current
    layerRef.current?.classList.add('bx-leaving')
    originEl?.classList.remove('bx-hand-off')
    // never gate the state transition on onfinish alone — throttled tabs can
    // freeze the animation timeline and would strand the card half-closed
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onClosed()
    }
    if (!reduced() && card && originEl) {
      const to = originEl.getBoundingClientRect()
      const from = card.getBoundingClientRect()
      if (to.width > 30 && from.width > 0) {
        const anim = card.animate(
          [
            { transform: 'none', opacity: 1 },
            { transform: flipKeyframes(to, from), opacity: 0 },
          ],
          { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.7, 1)', fill: 'forwards' },
        )
        anim.onfinish = finish
        window.setTimeout(finish, 460)
        return
      }
    }
    finish()
  }

  // Esc anywhere; simple focus trap inside the dialog
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const card = cardRef.current
      if (!card) return
      const items = Array.from(
        card.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !card.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bx-card-layer" ref={layerRef}>
      <div className="bx-scrim" onClick={close} />
      <div
        className={'bx-card' + (shown ? ' is-in' : '')}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bx-card-title"
        style={{ visibility: shown ? 'visible' : 'hidden' }}
      >
        <div className="bx-card-tab" aria-hidden="true">{folder.tab}</div>
        <button className="bx-card-close" ref={closeBtnRef} aria-label="Close folder" onClick={close}>
          ×
        </button>
        <div className="bx-card-in">
          {folder.kind === 'project' && <ProjectBody folder={folder} />}
          {folder.kind === 'about' && <AboutBody />}
          {folder.kind === 'resume' && <ResumeBody />}
        </div>
        {/* title id target lives inside the bodies */}
        <span hidden>{title}</span>
      </div>
    </div>
  )
}

function ProjectBody({ folder }: { folder: Folder }) {
  const c = folder.card!
  return (
    <>
      <div className={'bx-card-visual' + (c.icon ? ' is-icon' : '')}>
        <CardArt card={c} />
      </div>
      <div className="bx-card-meta">{c.meta}</div>
      <h2 className="bx-card-title" id="bx-card-title">{c.title}</h2>
      <p className="bx-card-blurb">{c.blurb}</p>
      <div className="bx-card-links">
        {c.slug && (
          <Link className="bx-link bx-link-primary" to={`/work/${c.slug}`}>
            Read the case study →
          </Link>
        )}
        {c.page && (
          <Link className="bx-link bx-link-primary" to={c.page}>
            {c.linkLabel ?? 'Open'} →
          </Link>
        )}
        {!c.slug && !c.page && c.href && (
          <a className="bx-link bx-link-primary" href={c.href} target="_blank" rel="noreferrer">
            {c.linkLabel ?? 'Open the project'} ↗
          </a>
        )}
        {c.demo && (
          <a className="bx-link" href={c.demo.href} target="_blank" rel="noreferrer">
            {c.demo.label} ↗
          </a>
        )}
      </div>
    </>
  )
}

function AboutBody() {
  return (
    <>
      <div className="bx-card-visual is-portrait">
        <img src={about.portraitFront} alt="Paul Jeon" />
      </div>
      <div className="bx-card-meta">{about.stats}</div>
      <h2 className="bx-card-title" id="bx-card-title">{about.heading}</h2>
      {about.paragraphs.map((p, i) => (
        <p key={i} className="bx-card-blurb" dangerouslySetInnerHTML={{ __html: p }} />
      ))}
      <div className="bx-card-links">
        <a className="bx-link bx-link-primary" href={`mailto:${about.email}`}>
          {about.email}
        </a>
      </div>
    </>
  )
}

function ResumeBody() {
  const pdf = `${import.meta.env.BASE_URL}Paul_Jeon-Resume.pdf`
  const external = footer.links.filter((l) => l.label === 'GitHub' || l.label === 'LinkedIn')
  return (
    <>
      <div className="bx-card-meta">One page · PDF</div>
      <h2 className="bx-card-title" id="bx-card-title">The whole story, on one page.</h2>
      <p className="bx-card-blurb">
        Education, roles, and projects — everything in this box, compressed for a hiring manager’s
        thirty seconds.
      </p>
      <div className="bx-card-links">
        <a className="bx-link bx-link-primary" href={pdf} target="_blank" rel="noreferrer">
          Open the résumé ↗
        </a>
        {external.map((l) => (
          <a key={l.label} className="bx-link" href={l.href} target="_blank" rel="noreferrer">
            {l.label} ↗
          </a>
        ))}
      </div>
    </>
  )
}
