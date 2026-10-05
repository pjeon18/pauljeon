// The Prep.io case study. Themed in the product's own forest green, so it
// reads as its own piece rather than another page from the same template.
// It follows the shipped V6 app, and tells the versions it took to get there.
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import Footer from './Footer'
import LiveEmbed from './LiveEmbed'
import { consumeArrival } from '../lib/arrival'
import '../styles/mag.css'
import { PilotChart } from './prep/PrepSpec'
import {
  Band, Beats, BigList, Chapter, ChartBeats, Duo, LightUp, Ledger, Moments, More, PersonaSwitch,
  PinnedPhone, Reveal, Say, Sequence, Shots, StackCards, StatScreens, StoryChrome, TargetTicks, VersionSwitch,
} from './story/Story'

import mHome from '../assets/prep-v6m-home.webp'
import mRoom from '../assets/prep-v6m-room.webp'
import mSchedule from '../assets/prep-v6m-schedule.webp'
import mGoLive from '../assets/prep-v6m-golive.webp'
import dHome from '../assets/prep-v6-home.webp'
import dHomeLive from '../assets/prep-v6-home-live.webp'
import dRoom from '../assets/prep-v6-room.webp'
import dAsked from '../assets/prep-v6-room-asked.webp'
import dRecording from '../assets/prep-v6-recording.webp'
import dUpcoming from '../assets/prep-v6-upcoming.webp'
import dSchedule from '../assets/prep-v6-schedule.webp'
import dCompany from '../assets/prep-v6-company.webp'
import dSearch from '../assets/prep-v6-search.webp'
import dGoLive from '../assets/prep-v6-golive.webp'
import dCountdown from '../assets/prep-v6-countdown.webp'
import dConsole from '../assets/prep-v6-console.webp'
import dSummary from '../assets/prep-v6-summary.webp'
import v3Fair from '../assets/prep-d-fair.webp'
import v5Home from '../assets/prep-v5-home.webp'

// the product's palette, used everywhere on this page
const FOREST = '#0f5c3b'
const DEEP = '#0c2219'
const MINT = '#9fd8b5'
const PAGE = '#f7f5ee'

function useArrival() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const els = root.current?.querySelectorAll('.mg-rv') ?? []
    // Arriving through the card's shared-element transition: the hero and
    // title must already be visible when the browser snapshots the page.
    if (consumeArrival()) {
      let k = 0
      els.forEach((el) => {
        const h = el as HTMLElement
        if (h.tagName === 'H1' || h.classList.contains('mg-bleed')) h.classList.add('in')
        else h.style.transitionDelay = `${400 + k++ * 90}ms`
      })
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return root
}

// The market, on the two axes that decide it.
function MarketMap() {
  const dots: { x: number; y: number; label: string; sub: string; end?: boolean }[] = [
    { x: 12, y: 10, label: 'Recorded content', sub: 'YouTube, TikTok, unverifiable' },
    { x: 20, y: 76, label: 'ADPList', sub: '40k+ mentors, all unpaid' },
    { x: 36, y: 88, label: 'Intro.co', sub: '$100 to $2,000 an hour' },
    { x: 44, y: 40, label: 'Career centers', sub: 'their events are webinars' },
    { x: 92, y: 34, label: 'Twitch', sub: 'live rooms, no career map', end: true },
  ]
  const pos = (d: { x: number; y: number }) => [70 + (d.x / 100) * 540, 20 + ((100 - d.y) / 100) * 380]
  const [hx, hy] = pos({ x: 88, y: 70 })
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="Market map. Live and verified is the empty corner, where Prep.io sits.">
      <rect className="cb-wipe" data-beat="2" x="340" y="20" width="270" height="190" fill="#dcefe3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#0e1c15" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#0e1c15" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#5f6b64">recorded or booked</text>
        <text x="608" y="428" fontSize="15" fill="#0e1c15" textAnchor="end" fontWeight="700">live and drop-in</text>
        <text x="54" y="398" fontSize="15" fill="#5f6b64" transform="rotate(-90 54 398)">anyone can claim it</text>
        <text x="54" y="170" fontSize="15" fill="#0e1c15" fontWeight="700" transform="rotate(-90 54 170)">verified credentials</text>
      </g>
      {dots.map((d) => {
        const [cx, cy] = pos(d)
        const tx = d.end ? cx - 16 : cx + 16
        return (
          <g key={d.label} className="cb-pop" data-beat="1" data-dim="2">
            <circle cx={cx} cy={cy} r="6.5" fill="#0e1c15" />
            <text x={tx} y={cy + 1} textAnchor={d.end ? 'end' : 'start'} fontSize="17" fontWeight="700" fill="#0e1c15">{d.label}</text>
            <text x={tx} y={cy + 18} textAnchor={d.end ? 'end' : 'start'} fontSize="13.5" fill="#5f6b64">{d.sub}</text>
          </g>
        )
      })}
      <g className="cb-drop" data-beat="3">
        <circle className="cb-ring" cx={hx} cy={hy} r="12" fill="none" stroke={FOREST} strokeWidth="2" />
        <circle cx={hx} cy={hy} r="9" fill={FOREST} />
        <text x={hx - 18} y={hy + 1} textAnchor="end" fontSize="22" fontWeight="700" fill="#0e1c15">Prep.io</text>
        <text x={hx - 18} y={hy + 19} textAnchor="end" fontSize="13.5" fill={FOREST}>live, with checked credentials</text>
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------

export default function PrepMag() {
  const root = useArrival()
  useEffect(() => {
    window.scrollTo(0, 0)
    // the page takes the product's warm white while this case study is open
    const prev = document.body.style.background
    document.body.style.background = PAGE
    return () => { document.body.style.background = prev }
  }, [])

  return (
    <div
      className="mag prep-mag"
      ref={root}
      style={{
        ['--acc' as string]: FOREST, ['--acc-deep' as string]: '#0a4a2f', ['--acc-tint' as string]: '#e6f1ea',
        ['--st-acc-text' as string]: FOREST, ['--st-acc-dark' as string]: MINT,
        ['--st-night' as string]: DEEP, ['--st-band' as string]: '#133528', ['--st-band-ink' as string]: '#eaf2ec', ['--st-band-hi' as string]: MINT,
        ['--st-cream' as string]: '#eef3ea', ['--st-tint' as string]: '#e6f1ea', ['--st-ink' as string]: '#0e1c15', ['--st-soft' as string]: '#5f6b64',
      }}
    >
      <StoryChrome />

      <nav className="case-nav mg-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <BackToSite />
      </nav>

      <header className="mg-masthead">
        <div className="mg-kicker mg-rv">Product case study · shipped prototype · 2026</div>
        <h1 className="mg-rv" style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
          Office hours,<br /><em>made live</em>
        </h1>
        <Say size="m" tone="soft">Recruiters and people who do the job go live. Anyone job hunting can walk in, listen, and ask the question they actually have.</Say>
        <div className="mg-meta mg-rv">
          <span><b>Role</b> product, design, engineering, solo</span>
          <span><b>Stack</b> React · TypeScript · Zustand · Framer Motion</span>
          <span className="mg-meta-links">
            <a href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">Open the prototype ↗</a>
            <a href="https://github.com/pjeon18/prep-io" target="_blank" rel="noreferrer">GitHub ↗</a>
          </span>
        </div>
      </header>

      <figure className="mg-bleed mg-rv">
        <img src={dHome} alt="The Prep.io home page with one live room in front" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
      </figure>

      {/* ---------------- product first ---------------- */}
      <Chapter n="00" title="The product, in one minute" name="Product" />
      <PinnedPhone steps={[
        { text: 'One live room in front of you.', quiet: 'Swipe for the next one. They change on their own if you just watch.', img: mHome, alt: 'The home page on a phone' },
        { text: 'Walk in and the conversation is right there.', quiet: 'Questions first, sorted by upvotes.', img: mRoom, alt: 'A live room on a phone', glow: true },
        { text: 'Everything coming up, with a reminder one tap away.', quiet: 'You hear when the room opens.', img: mSchedule, alt: 'The schedule on a phone' },
        { text: 'Anyone with a verified job can go live.', quiet: 'The title is the first thing you write.', img: mGoLive, alt: 'Setting up a session on a phone' },
      ]} />
      <div className="st-sp" />
      <Say size="xl">Try it yourself. Join a room and ask something.</Say>
      <div className="st-sp-s" />
      <LiveEmbed kind="browser" src="https://pjeon18.github.io/prep-io/" title="Prep.io prototype" poster={dHome} />

      {/* ---------------- 01 the gap ---------------- */}
      <Chapter n="01" title="Career advice is stuck at two extremes" name="The gap" />
      <Sequence lines={[
        { text: 'Recorded advice is passive, and anyone can claim to be a Goldman analyst.', size: 'xl' },
        { text: 'Booked mentorship is good, and one hour helps exactly one person.', align: 'indent' },
        { text: 'A sophomore who cannot name the jobs yet does not know what to ask, and both of these start with a question.' },
        { text: 'They need to wander in and overhear.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <StatScreens stats={[
        { to: 40, suffix: 'k+', post: 'verified mentors on ADPList already give advice for free.', bg: FOREST, fg: '#ffffff', num: MINT },
        { to: 300, suffix: 'k+', post: 'people watch live talk on Twitch at any given moment.', bg: DEEP, fg: '#eaf2ec', num: MINT, align: 'center', big: true, dark: true },
        { pre: 'About', to: 19, suffix: 'M', post: 'US college students, before counting anyone switching careers.', bg: '#e6f1ea', fg: '#0e1c15', num: FOREST, align: 'right' },
      ]} />
      <div className="st-sp" />
      <ChartBeats beats={[
        'Two questions decide this market. Does it happen live, and can you trust who is talking?',
        'Every player owns one side. Recorded content is public, mentors are private, and Twitch is live without any career context.',
        'The top right needs both at once, which is why it stays empty.',
        'Prep.io is built for that corner. Live rooms, hosted by people whose jobs were checked.',
      ]}>
        <MarketMap />
      </ChartBeats>
      <LightUp text="Mentorship is scheduled and private. Content is recorded and public. The professor's office hours has no online home." accent="no online home" />

      {/* ---------------- 02 people ---------------- */}
      <Chapter n="02" title="Three people looking for work, and who they hear from" name="People" />
      <PersonaSwitch people={[
        { name: 'The explorer', quote: '“I don’t know what these jobs actually are.”', img: mHome, alt: 'The home page on a phone', lines: ['A sophomore who browses, listens, and leaves without committing to anything.', 'Every platform wants a specific question before it shows them anything.', 'Prep.io opens on a room that is already talking. Watching asks for nothing.'] },
        { name: 'The prepper', quote: '“I have a superday next week.”', img: mRoom, alt: 'A live room on a phone', lines: ['A junior who needs a specific answer this week.', 'Booking a mentor takes longer than the deadline they are racing.', 'In a room, their question goes into a list everyone can upvote, and the host answers the top ones out loud.'] },
        { name: 'The switcher', quote: '“I want what it’s really like, not a coach.”', img: mSchedule, alt: 'The schedule on a phone', lines: ['A consultant of 27 eyeing product management, who wants candor from someone two years ahead.', 'The honest version of this conversation usually happens off the record.', 'Half the rooms are hosted by people doing the job, not recruiters, and every host shows whether their employer was checked.'] },
      ]} />
      <div className="st-sp" />
      <Say size="l">And the people on the other side of the room.</Say>
      <BigList items={[
        { head: 'Recruiters', line: 'One hour answers the questions they would otherwise get in a hundred emails.' },
        { head: 'People in the job', line: 'They talk about their work for an hour. No editing and no posting schedule.' },
        { head: 'Companies', line: 'A page with every session, recording and open role in one place.' },
      ]} />

      {/* ---------------- 03 watching ---------------- */}
      <Chapter n="03" title="What happens in a room" name="Watching" />
      <PinnedPhone frame="desktop" steps={[
        { text: 'Click a room and its picture grows into the stage.', quiet: 'The page you came from fades away underneath it.', img: dHomeLive, alt: 'Live rooms on the home page' },
        { text: 'The host takes the most upvoted question and answers it.', quiet: 'It stays pinned while they talk, with who asked it.', img: dRoom, alt: 'The question being answered, pinned above the list' },
        { text: 'Ask your own and it joins the list.', quiet: 'Enter sends it. Other people can upvote it.', img: dAsked, alt: 'A viewer question added to the list' },
        { text: 'Afterwards, the recording is split by question.', quiet: 'You can jump straight to the one you care about.', img: dRecording, alt: 'A recording with its questions listed' },
        { text: 'Rooms that have not started count down to the second.', quiet: 'Remind me flips to Reminder set.', img: dUpcoming, alt: 'An upcoming session counting down' },
      ]} />

      {/* ---------------- 04 hosting ---------------- */}
      <Chapter n="04" title="Going live" name="Hosting" />
      <Duo frame="desktop" img={dGoLive} alt="Setting up a session, with a live preview" lines={[
        { text: 'The title is typed at headline size, and the preview updates as you type.', size: 'l' },
        { text: 'Recruiters pick which open roles to show viewers.' },
      ]} />
      <Duo frame="desktop" side="right" img={dCountdown} alt="The three-second countdown before going live" lines={[
        { text: 'Going live is a three-second countdown on a full green screen.', size: 'l' },
        { text: 'It gives the host a breath before people are watching.', tone: 'acc' },
      ]} />
      <Duo frame="desktop" img={dConsole} alt="The host's live console" lines={[
        { text: 'While live, the host picks a question and it appears on the stage.', size: 'l' },
        { text: 'Done marks it answered, and that answer becomes a chapter in the recording.' },
      ]} />
      <Duo frame="desktop" side="right" img={dSummary} alt="The summary after a session ends" lines={[
        { text: 'The summary counts minutes live, the most people at once, and questions answered.', size: 'l' },
        { text: 'The numbers count up instead of appearing all at once.' },
      ]} />

      {/* ---------------- 05 rules ---------------- */}
      <Chapter n="05" title="Four rules the app keeps" name="Rules" />
      <StackCards cards={[
        { n: '1', title: 'Every live number is simulated, never typed in', body: 'Viewers, chat, questions and votes all come from one simulation file.', bg: '#e6f1ea', fg: '#0e1c15', num: FOREST },
        { n: '2', title: 'Verified means checked', body: 'A green badge for hosts whose employer was confirmed, and a plain note for those not yet confirmed.', bg: FOREST, fg: '#ffffff', num: MINT, variant: 'big' },
        { n: '3', title: 'No feed, no ranking of people', body: 'Home is finite and ends. Companies are listed alphabetically.', bg: '#133528', fg: '#eaf2ec', num: MINT, variant: 'flip' },
        { n: '4', title: 'Not in the app', list: ['Direct messages', 'Paying to be answered', 'An endless feed', 'Anything for sale'], bg: DEEP, fg: '#ffffff', num: '#2f5a45' },
      ]} />

      {/* ---------------- 06 honest liveness ---------------- */}
      <Chapter n="06" title="Simulating a crowd without lying about one" name="Liveness" />
      <Beats lines={[
        { text: 'No number on screen is a constant.', size: 'xxl' },
        { text: 'Viewer counts drift every second and a half, and roll to the new value instead of jumping.', align: 'indent' },
        { text: 'Chat never repeats a line from the last dozen messages. The host checks the questions every ten to sixteen seconds.' },
        { text: 'The stage is an illustrated room, labeled as such. A screenshot should never pretend to be real video.', align: 'right', tone: 'acc' },
      ]} />

      {/* ---------------- 07 versions ---------------- */}
      <Band tone="cream">
        <Chapter n="07" title="Six versions, and what each one taught" name="Versions" />
        <VersionSwitch start={2} versions={[
          { name: 'V3', img: v3Fair, alt: 'Version 3, the club fair floor', lines: ['V3 was a club fair, with booths by career, a hot seat, paid boosts and a campus mode.', 'It had every feature and no focus. Each new idea added a screen.'] },
          { name: 'V5', img: v5Home, alt: 'Version 5, a LinkedIn-style home page', lines: ['V5 kept only the core and copied LinkedIn: grey page, white cards, one blue.', 'It was clean, and it looked like every other app.'] },
          { name: 'V6', img: dHome, alt: 'Version 6, the current home page', lines: ['V6 is the same product with one room in front, big type and forest green.', 'Motion carries you between screens instead of reloading them.'] },
        ]} />
      </Band>
      <Ledger items={[
        { label: 'V1, navy and amber', title: 'The first build was dark navy and amber everywhere.', fix: 'It was rebuilt in black and white, with three colors that each mean one thing.', lesson: 'A palette that could belong to any product belongs to none.' },
        { label: 'V2, twelve features', title: 'V2 added search, premium, boosts, events, shorts and playlists in one go.', fix: 'Most of them were cut later.', lesson: 'Adding a feature is easy. Each one makes the core harder to find.' },
        { label: 'V3, the club fair', title: 'V3 shipped Liquid Glass, a dark theme and a second audience for courses.', fix: 'It became the live prototype for two months.', lesson: 'A second audience needs its own data, or one leaks into the other.' },
        { label: 'V4, on air', title: 'V4 was a black broadcast studio with a red tally light and slogans.', fix: 'Rejected in one look and scrapped the same day.', lesson: 'Dark and dramatic is not the same as professional.' },
        { label: 'V5, LinkedIn', title: 'V5 went light, friendly and familiar, and replaced the hot seat with plain Q&A.', fix: 'The product was right. The interface was boxes inside boxes.', lesson: 'Familiar layouts are a starting point, not a design.' },
        { label: 'V6, one room', title: 'V6 put one room in front, raised every text size, and added transitions between screens.', fix: 'It is the version live now.', lesson: 'Size and space can do the job that borders and labels were doing.' },
      ]} />

      {/* ---------------- 08 design system ---------------- */}
      <Chapter n="08" title="One green, one red, and a lot of space" name="System" />
      <Say size="l">Every color has one job, so seeing it anywhere means the same thing.</Say>
      <Moments items={[
        { color: FOREST, name: 'Forest', tempo: 'Actions, selection, verified' },
        { color: '#e5484d', name: 'Red', tempo: 'Live, and nothing else' },
        { color: MINT, name: 'Mint', tempo: 'Who asked the question on stage' },
        { color: '#0e1c15', name: 'Ink', tempo: 'Text, at 15px or larger' },
      ]} />
      <Beats lines={[
        { text: 'Headings go up to 84px and body text sits at 17 to 18px. Nothing on screen is smaller than 15px.', align: 'indent' },
        { text: 'There are no boxes around content. Size and spacing make the hierarchy.', size: 'xl', align: 'right' },
      ]} />
      <Shots frame="desktop" items={[
        { img: dSearch, alt: 'The search panel', cap: 'Search opens with ⌘K or /, and works from the keyboard.' },
        { img: dCompany, alt: 'A company page', cap: 'A company page in its own color, washed soft.' },
      ]} />
      <Shots frame="desktop" items={[
        { img: dSchedule, alt: 'The schedule', cap: 'The schedule leads with the time, at headline size.' },
        { img: dHomeLive, alt: 'Live rooms on the home page', cap: 'Hover a live room and the host starts talking.' },
      ]} />
      <More summary="How the motion works">
        <ul>
          <li><b>Picture to stage.</b> Opening a room uses View Transitions, so the clicked thumbnail morphs into the room’s stage.</li>
          <li><b>Springs for what you cause.</b> Buttons press in and spring back, tabs and toggles slide, and Follow flips its label.</li>
          <li><b>Rolling numbers.</b> Viewer counts, votes and the summary animate between values on a spring.</li>
          <li><b>The featured room.</b> It advances every nine seconds, pauses while you hover, and can be swiped or moved with the arrow keys.</li>
          <li><b>Reduced motion.</b> All of it turns off for people who ask their system for less motion.</li>
        </ul>
      </More>

      {/* ---------------- 09 metrics ---------------- */}
      <Chapter n="09" title="One number that catches both sides" name="Metrics" />
      <Beats lines={[
        { text: <>The North Star is questions <em>answered live</em>, per week.</>, size: 'xl' },
        { text: 'It only rises when viewers ask and hosts answer. Each answered question also becomes a chapter in the recording.', align: 'right', tone: 'soft' },
      ]} />
      <div className="st-sp" />
      <Say size="l" tone="acc">Nothing below has been measured. These are the lines a twelve-week campus pilot would have to clear.</Say>
      <TargetTicks rows={[
        { name: 'Questions answered live, weekly, by week six', value: 60, label: '60', why: 'At twelve sessions that is five a session, the pace of a real office hour. Under 25 ends the pilot.' },
        { name: 'Hosts still hosting after four weeks', value: 75, why: 'Hosts are the side that quits first, and they quit quietly. Under half ends the pilot.' },
        { name: 'Questions asked that get answered', value: 60, why: 'A long list nobody reaches teaches people not to ask.' },
        { name: 'Sessions with at least one answer', value: 90, why: 'A session with no question answered is a webinar.' },
      ]} />
      <Reveal className="st-fade st-figure"><PilotChart /></Reveal>
      <Say size="m" tone="soft">A model of the North Star across one recruiting season. It peaks in week eight with superday season and falls toward Thanksgiving.</Say>

      {/* ---------------- takeaways ---------------- */}
      <Band tone="night">
        <Chapter n="10" title="What I would carry forward" name="Takeaways" />
        <Beats gap="l" lines={[
          { text: 'Cut to the core idea before polishing anything.', size: 'xl' },
          { text: 'A familiar layout gets you started. It does not make the product feel like anything.', align: 'indent' },
          { text: 'Big type and empty space did more than any border or label.', size: 'xl', align: 'right' },
          { text: 'Mocking the video was fine. Faking the viewer count would not have been.', tone: 'acc' },
        ]} />
      </Band>

      <div className="mg-finale mg-band prep-finale">
        <Say size="xxl" align="center" tone="light">Walk in, listen, and ask.</Say>
        <a className="mg-finale-cta" href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">
          Open the prototype → pjeon18.github.io/prep-io
        </a>
      </div>

      <details className="mg-details mg-sources">
        <summary>Sources and notes</summary>
        <p className="mg-sources-p">
          Market comparables are as cited in the project's requirements document and decision log.
          Mentor supply (ADPList), pricing at the top of the market (Intro.co), and concurrent-viewer
          scale for live talk (Twitch). All hosts, viewers and chat in the prototype are fictional seed
          data. Company names appear for identification and commentary, and all marks belong to their owners.
        </p>
      </details>

      <div className="case-next mg-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/studdy" className="case-next-link">
          Studdy. A study spot that never closes. <span className="arr">→</span>
        </Link>
      </div>

      <Footer compact />
    </div>
  )
}
