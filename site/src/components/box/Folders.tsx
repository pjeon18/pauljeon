import type { CSSProperties } from 'react'
import { folders } from '../../content/site'

// ============================================================================
// Folders — the hanging files inside the box. Real DOM buttons in 3D space:
// each <li> is a plane hung along the box depth (front-most file first),
// with a white plastic tab in one of three lanes so every label stays
// readable from the arrival camera. The <li> owns the big movements
// (settle-in rise, focus rise); the <button> owns the hover/focus lift.
// ============================================================================

const N = folders.length
const SPREAD = 292 // total depth the files occupy (px)

export default function Folders({
  hidden,
  browsing,
  focusedId,
  registerTab,
  onOpen,
}: {
  hidden: boolean
  browsing: boolean
  focusedId: string | null
  registerTab: (id: string, el: HTMLButtonElement | null) => void
  onOpen: (id: string) => void
}) {
  return (
    <nav className="bx-folders" aria-label="Inside the box" aria-hidden={hidden || undefined}>
      <ul>
        {folders.map((f, i) => {
          const z = SPREAD / 2 - (i * SPREAD) / (N - 1)
          const lane = i % 3
          // category dot on the tab, matching the sharpie key on the front flap
          const cat = f.kind === 'project' && f.card && f.card.cats[0] !== 'all' ? f.card.cats[0] : null
          const style = {
            '--z': `${z}px`,
            '--rise-d': `${1350 + i * 45}ms`,
            '--dim': `${(0.05 + (i / (N - 1)) * 0.2).toFixed(3)}`,
            '--tabx': `${16 + lane * 124}px`,
          } as CSSProperties
          return (
            <li key={f.id} className={'bx-slot' + (focusedId === f.id ? ' is-up' : '')} style={style}>
              <button
                type="button"
                className="bx-folder"
                aria-label={`Open folder: ${f.tab}`}
                ref={(el) => registerTab(f.id, el)}
                tabIndex={browsing ? 0 : -1}
                onClick={() => browsing && onOpen(f.id)}
              >
                <span className="bx-folder-back" aria-hidden="true" />
                <span className="bx-folder-body" aria-hidden="true" />
                <span className="bx-folder-tab">
                  {cat && <span className={`bx-tab-dot is-${cat}`} aria-hidden="true" />}
                  {f.tab}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
