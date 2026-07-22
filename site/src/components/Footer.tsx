import { footer } from '../content/site'

export default function Footer() {
  return (
    <div className="foot">
      <div className="foot-kicker">{footer.kicker}</div>
      <h2 className="foot-big">
        Let's <span className="fa">Connect</span>!
      </h2>
      <a className="foot-mail" href={`mailto:${footer.email}`}>{footer.email}</a>
      <div className="foot-links">
        {footer.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
        ))}
      </div>
      <div className="foot-fine">{footer.fine}</div>
    </div>
  )
}
