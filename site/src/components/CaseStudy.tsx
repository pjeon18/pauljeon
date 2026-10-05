import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { consumeArrival } from '../lib/arrival'
import { caseOrder, caseStudies } from '../content/site'
import { caseBeats } from '../content/caseBeats'
import { OrgArt, RlArt } from './CardArt'
import BackToSite from './BackToSite'
import Footer from './Footer'
import LiveEmbed from './LiveEmbed'
import { Band, Beats, Chapter, Duo, LightUp, Say, WideImg, StatScreens, StoryChrome, type SeqLine, type Stat } from './story/Story'

// "190 kB" -> a count-up to 190 with " kB"; "High/Med/Low" stays text
function toStat(value: string, post: string, i: number, accent: string, onDark: string): Stat {
  const looks = [
    { bg: accent, fg: '#FFFFFF', num: '#141210', align: 'left' as const },
    { bg: '#111110', fg: '#F5F2EC', num: onDark, align: 'center' as const, big: true, dark: true },
    { bg: '#F4F1EA', fg: '#141210', num: accent, align: 'right' as const },
  ][i % 3]
  const sentence = /[.!?]$/.test(post) ? post : `${post}.`
  const m = value.match(/^([~$]?)(\d[\d,]*\.?\d*)(.*)$/)
  if (!m) return { to: 0, text: value, post: sentence, ...looks }
  const digits = m[2]
  return {
    to: parseFloat(digits.replace(/,/g, '')),
    decimals: (digits.split('.')[1] ?? '').length,
    group: digits.includes(','),
    prefix: m[1],
    suffix: m[3],
    post: sentence,
    ...looks,
  }
}

// the order of beats inside a section: a large opener, then lines that
// alternate edges, closing on the right in the accent
function shape(beats: string[], i: number): SeqLine[] {
  return beats.map((text, k) => {
    const last = k === beats.length - 1 && beats.length > 2
    if (k === 0) return { text, size: i % 2 ? 'l' : 'xl' }
    if (last) return { text, align: 'right', tone: 'acc' }
    return { text, align: k % 2 ? 'indent' : 'left' }
  })
}

export default function CaseStudy() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const study = slug ? caseStudies[slug] : undefined
  const layer = slug ? caseBeats[slug] : undefined
  // set by the arc when it opened this page through the shared-element transition
  const [arrived] = useState(() => consumeArrival())

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!study) navigate('/', { replace: true })
  }, [study, navigate])

  if (!study) return null

  const idx = caseOrder.indexOf(study.slug)
  const next = caseStudies[caseOrder[(idx + 1) % caseOrder.length]]
  const accent = layer?.accent ?? '#E05C1F'

  return (
    <div className={'case' + (arrived ? ' case-arrive' : '')} style={{ ['--acc' as string]: accent, ['--st-acc-dark' as string]: layer?.accentDark ?? accent } as React.CSSProperties}>
      {layer && <StoryChrome />}

      <nav className="case-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <BackToSite />
      </nav>

      <header className="case-head">
        <div className="case-kicker">{study.kicker}</div>
        <h1 style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>{study.title}</h1>
        {layer ? <Say size="m" tone="soft" className="case-lead-say">{study.lead}</Say> : <p className="case-lead">{study.lead}</p>}
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
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" data-soon={l.soon || undefined}>{l.label} ↗</a>
                ))}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className={'case-visual' + (study.icon ? ' is-icon' : '')}>
        {study.image && <img src={study.image} alt={study.title} style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />}
        {study.icon && <img className="cv-icon" src={study.icon} alt={study.title} style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />}
        {study.art === 'org' && <div className="cv-art"><OrgArt /></div>}
        {study.art === 'rl' && <div className="cv-art"><RlArt /></div>}
      </div>

      {layer ? (
        <div className="case-story">
          <StatScreens stats={study.stats.map((s, i) => toStat(s.value, layer.stats?.[i] ?? s.label, i, accent, layer.accentDark ?? accent))} />

          {layer.embed && (
            <>
              <div className="st-sp" />
              <Say size="xl">Try it yourself. This is the deployed build.</Say>
              <div className="st-sp-s" />
              <LiveEmbed kind="browser" src={layer.embed.src} title={layer.embed.title} />
            </>
          )}

          {study.sections.map((sec, i) => {
            const beats = layer.sections[i]?.beats
            const dark = layer.sections[i]?.dark
            const n = String(i + 1).padStart(2, '0')
            const lines = beats ? shape(beats, i) : []
            const asDuo = sec.image && beats && i % 2 === 1 && !dark
            const inner = (
              <>
                <Chapter n={n} title={sec.heading} name={sec.heading} />
                {!beats && <div className="case-sec-in" dangerouslySetInnerHTML={{ __html: sec.body }} />}
                {asDuo ? (
                  <Duo frame="desktop" side={i % 4 === 1 ? 'left' : 'right'} img={sec.image!} alt={sec.imageCaption ?? sec.heading} lines={lines} />
                ) : (
                  <>
                    {beats && <Beats lines={lines} />}
                    {sec.image && (
                      <>
                        <WideImg src={sec.image} alt={sec.imageCaption ?? sec.heading} />
                        {(layer.sections[i]?.cap ?? sec.imageCaption) && <Say size="m" tone="soft" className="st-cap">{layer.sections[i]?.cap ?? sec.imageCaption}</Say>}
                      </>
                    )}
                  </>
                )}
              </>
            )
            return (
              <React.Fragment key={i}>
                {dark ? <Band tone="night">{inner}</Band> : inner}
                {layer.thesis && layer.thesis.after === i && <LightUp text={layer.thesis.text} accent={layer.thesis.accent} />}
              </React.Fragment>
            )
          })}
        </div>
      ) : (
        <>
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
                  {sec.image && (
                    <figure className="case-fig">
                      <img src={sec.image} alt={sec.imageCaption ?? sec.heading} loading="lazy" />
                      {sec.imageCaption && <figcaption>{sec.imageCaption}</figcaption>}
                    </figure>
                  )}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <div className="case-next">
        <div className="case-kicker">Next up</div>
        <Link to={`/work/${next.slug}`} className="case-next-link">
          {next.title} <span className="arr">→</span>
        </Link>
      </div>

      <Footer compact />
    </div>
  )
}
