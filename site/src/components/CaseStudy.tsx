import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { caseOrder, caseStudies } from '../content/site'
import { OrgArt, RlArt } from './CardArt'
import Footer from './Footer'

export default function CaseStudy() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const study = slug ? caseStudies[slug] : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!study) navigate('/', { replace: true })
  }, [study, navigate])

  if (!study) return null

  const idx = caseOrder.indexOf(study.slug)
  const next = caseStudies[caseOrder[(idx + 1) % caseOrder.length]]

  return (
    <div className="case">
      <nav className="case-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <Link className="case-back" to="/#work">← All work</Link>
      </nav>

      <header className="case-head">
        <div className="case-kicker">{study.kicker}</div>
        <h1>{study.title}</h1>
        <p className="case-lead">{study.lead}</p>
        <div className="case-meta">
          <div>
            <h3>Role</h3>
            <p>{study.role}</p>
          </div>
          <div>
            <h3>Stack</h3>
            <p>{study.stack}</p>
          </div>
          {study.links && study.links.length > 0 && (
            <div>
              <h3>Links</h3>
              <p>
                {study.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
                ))}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className={'case-visual' + (study.icon ? ' is-icon' : '')}>
        {study.image && <img src={study.image} alt={study.title} />}
        {study.icon && <img className="cv-icon" src={study.icon} alt={study.title} />}
        {study.art === 'org' && <div className="cv-art"><OrgArt /></div>}
        {study.art === 'rl' && <div className="cv-art"><RlArt /></div>}
      </div>

      <div className="case-facts">
        {study.stats.map((s) => (
          <div key={s.label} className="case-fact">
            <span className="v">{s.value}</span>
            <span className="l">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="case-body">
        {study.sections.map((sec, i) => (
          <section key={i} className="case-sec">
            <div className="case-sec-in">
              <h2>{sec.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: sec.body }} />
            </div>
          </section>
        ))}
      </div>

      <div className="case-next">
        <div className="case-kicker">Next up</div>
        <Link to={`/work/${next.slug}`} className="case-next-link">
          {next.title} <span className="arr">→</span>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
