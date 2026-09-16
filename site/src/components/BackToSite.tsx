import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// The way out of every case page. Where the browser supports it, the hero
// and title morph back into the card they came from: the home page mounts
// with that card docked (see SplitHome), then lets it go.
export default function BackToSite() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <Link
      className="case-back"
      to="/"
      onClick={(e) => {
        const d = document as Document & { startViewTransition?: (cb: () => void) => void }
        if (!d.startViewTransition) { e.preventDefault(); navigate('/', { state: { from: pathname } }); return }
        e.preventDefault()
        d.startViewTransition(() => { flushSync(() => navigate('/', { state: { from: pathname } })) })
      }}
    >
      ← Back to site
    </Link>
  )
}
