import { footer } from '../content/site'

// `compact` drops the contact call-out and keeps the links. Case studies use
// it, because each one already ends on its own closing band.
export default function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={'foot' + (compact ? ' foot-compact' : '')}>
      {!compact && (
        <>
          <div className="foot-kicker">{footer.kicker}</div>
          <h2 className="foot-big">
            Let's <span className="fa">Connect</span>!
          </h2>
          <a className="foot-mail" href={`mailto:${footer.email}`}>{footer.email}</a>
        </>
      )}
      <div className="foot-links">
        {footer.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" data-soon={l.soon || undefined}>{l.label}</a>
        ))}
      </div>
      <div className="foot-fine">{footer.fine}</div>
    </div>
  )
}
