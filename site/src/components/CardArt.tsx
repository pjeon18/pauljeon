import type { Card } from '../content/site'
import { about } from '../content/site'

// Hand-drawn placeholder art for cards that don't have real imagery yet.
export function OrgArt() {
  return (
    <svg viewBox="0 0 204 224" width="100%" height="100%" aria-hidden="true">
      <g stroke="#9DBDD8" strokeWidth="1.5" fill="none">
        <path d="M102 58 V86 M102 86 H56 M102 86 H148 M56 86 V120 M148 86 V120 M102 86 V138 M56 140 V164 M148 140 V164" />
      </g>
      <g fill="#3D7BAB">
        <circle cx="102" cy="48" r="10" /><circle cx="56" cy="130" r="10" /><circle cx="148" cy="130" r="10" />
        <circle cx="102" cy="148" r="8" opacity="0.8" />
        <circle cx="56" cy="174" r="6" opacity="0.55" /><circle cx="148" cy="174" r="6" opacity="0.55" />
      </g>
    </svg>
  )
}

export function RlArt() {
  return (
    <svg viewBox="0 0 204 224" width="100%" height="100%" aria-hidden="true">
      <g fill="none" stroke="#B9BEE8" strokeWidth="2.4">
        <path d="M28 48 H176 M28 48 V176 M176 48 V176 M28 176 H176 M76 48 V112 M76 112 H132 M132 112 V176" />
      </g>
      <circle cx="52" cy="144" r="11" fill="#F0B429" />
      <path d="M52 144 L67 135 L67 153 Z" fill="#EFF0FA" />
      <g fill="#7C82C9" opacity="0.85">
        <circle cx="104" cy="78" r="3.6" /><circle cx="132" cy="78" r="3.6" /><circle cx="156" cy="78" r="3.6" />
        <circle cx="104" cy="144" r="3.6" />
      </g>
      <rect x="144" y="132" width="18" height="18" rx="5" fill="#E06565" />
    </svg>
  )
}

export default function CardArt({ card }: { card: Card }) {
  if (card.usePortrait) return <img className="art" src={about.portraitFront} alt="Paul Jeon" />
  if (card.icon) {
    return (
      <div className="art art-iso-icon">
        <img src={card.icon} alt={card.title} />
      </div>
    )
  }
  if (card.image) return <img className="art" src={card.image} alt={card.title} />
  if (card.art === 'org') return <div className="art ph-org"><OrgArt /></div>
  if (card.art === 'rl') return <div className="art ph-rl"><RlArt /></div>
  // impostor fallback
  return (
    <div className="art ph-imp">
      <div className="blob" />
      <div className="visor" />
    </div>
  )
}
