// The Prep.io case study, told as a sequence of beats with the story kit.
// Structure still follows the project's decision log: the interesting story
// is eighteen dated decisions and the two that reversed.
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import Footer from './Footer'
import LiveEmbed from './LiveEmbed'
import { consumeArrival } from '../lib/arrival'
import '../styles/mag.css'
import { STORIES, Wireframes, HotSeatStates, PilotChart } from './prep/PrepSpec'
import {
  Band, Beats, BigList, Chapter, ChartBeats, Duo, LightUp, Ledger, Moments, More, PersonaSwitch,
  PinnedPhone, Reveal, Say, Sequence, Shots, StackCards, StatScreens, StoryChrome, TargetTicks,
} from './story/Story'

import mSplash from '../assets/prep-m-splash.webp'
import mFair from '../assets/prep-m-fair.webp'
import mRoom from '../assets/prep-m-room.webp'
import mRoomHand from '../assets/prep-m-room-hand.webp'
import mHotseat from '../assets/prep-m-room-hotseat.webp'
import mCommit from '../assets/prep-m-event-commit.webp'
import mVerify from '../assets/prep-m-verify.webp'
import mSettings from '../assets/prep-m-settings.webp'
import mGrace from '../assets/prep-m-profile-grace.webp'
import dFair from '../assets/prep-d-fair.webp'
import dExplore from '../assets/prep-d-explore.webp'
import dVod from '../assets/prep-d-vod.webp'
import dMaya from '../assets/prep-d-profile-maya.webp'
import dCampus from '../assets/prep-d-campus.webp'
import dCourse from '../assets/prep-d-course.webp'
import dSparse from '../assets/prep-d-section-sparse.webp'
import dLibrary from '../assets/prep-d-library.webp'

// ---------------------------------------------------------------------------

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
      <rect className="cb-wipe" data-beat="2" x="340" y="20" width="270" height="190" fill="#E5EFE9" />
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#141210" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#141210" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#6E675D">recorded or booked</text>
        <text x="608" y="428" fontSize="15" fill="#141210" textAnchor="end" fontWeight="700">live and drop-in</text>
        <text x="54" y="398" fontSize="15" fill="#6E675D" transform="rotate(-90 54 398)">anyone can claim it</text>
        <text x="54" y="170" fontSize="15" fill="#141210" fontWeight="700" transform="rotate(-90 54 170)">verified credentials</text>
      </g>
      {dots.map((d) => {
        const [cx, cy] = pos(d)
        const tx = d.end ? cx - 16 : cx + 16
        return (
          <g key={d.label} className="cb-pop" data-beat="1" data-dim="2">
            <circle cx={cx} cy={cy} r="6.5" fill="#141210" />
            <text x={tx} y={cy + 1} textAnchor={d.end ? 'end' : 'start'} fontSize="17" fontWeight="700" fill="#141210">{d.label}</text>
            <text x={tx} y={cy + 18} textAnchor={d.end ? 'end' : 'start'} fontSize="13.5" fill="#6E675D">{d.sub}</text>
          </g>
        )
      })}
      <g className="cb-drop" data-beat="3">
        <circle className="cb-ring" cx={hx} cy={hy} r="12" fill="none" stroke="#B0402D" strokeWidth="2" />
        <circle cx={hx} cy={hy} r="9" fill="#B0402D" />
        <text x={hx - 18} y={hy + 1} textAnchor="end" fontSize="22" fontWeight="700" fill="#141210">Prep.io</text>
        <text x={hx - 18} y={hy + 19} textAnchor="end" fontSize="13.5" fill="#1C5C41">live and vouched for</text>
      </g>
    </svg>
  )
}

const lower = (t: string) => (t.startsWith('I ') ? t : t.charAt(0).toLowerCase() + t.slice(1))
const STORY_LABELS = [
  'Watch without an account', 'Wander the floor by field', 'Ask once, see my place in line',
  'Go deeper right after', 'Know the host is real', 'Find someone two years ahead',
  'Give an hour, make nothing else', 'Choose who I call on', 'Office hours as one link',
]
const STORY_ITEMS = STORIES.map((s, i) => ({
  label: STORY_LABELS[i],
  title: s.story,
  fix: `Accepted when ${lower(s.accepted[0])}, and ${lower(s.accepted[1])}.`,
  lesson: s.status === 'shipped' ? `${s.who}. Shipped.` : `${s.who}. Shipped, with ${s.note} stubbed.`,
}))

// ---------------------------------------------------------------------------

export default function PrepMag() {
  const root = useArrival()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div
      className="mag"
      ref={root}
      style={{
        ['--acc' as string]: '#B0402D', ['--acc-deep' as string]: '#96311F', ['--acc-tint' as string]: '#F9EDE9',
        ['--st-band' as string]: '#133528', ['--st-band-ink' as string]: '#EAF2EC', ['--st-band-hi' as string]: '#9FD8B5',
        ['--st-cream' as string]: '#F4EEE6', ['--st-tint' as string]: '#F1F6F3',
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
        <Say size="m" tone="soft">A live streaming platform shaped like a college club fair. Verified professionals hold drop-in office hours, and anyone can walk in and listen.</Say>
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
        <img src={dFair} alt="The Prep.io fair floor" style={{ viewTransitionName: 'case-hero' } as React.CSSProperties} />
      </figure>

      {/* ---------------- product first ---------------- */}
      <Chapter n="00" title="The product, in one minute" name="Product" />
      <PinnedPhone steps={[
        { text: 'Two doors, and watching needs no account.', quiet: 'You can be in a room in two taps.', img: mSplash, alt: 'The splash screen' },
        { text: 'The floor is a fair, sorted by career.', quiet: 'Live rooms first, then events, then eight booths.', img: mFair, alt: 'The fair floor on mobile' },
        { text: 'Walk into a room and listen.', quiet: 'The stage says plainly that the camera is mocked.', img: mRoom, alt: 'A live room on mobile' },
        { text: 'Raise a hand with a written question.', quiet: 'It joins a visible queue, with your place in line.', img: mRoomHand, alt: 'A raised hand in the queue' },
        { text: 'The host calls on you, in front of the room.', quiet: 'Two hundred people learn from your one question.', img: mHotseat, alt: 'The hot seat moment' },
      ]} />
      <div className="st-sp" />
      <Say size="xl">Try it yourself. Walk the fair floor. Watching a room needs no account.</Say>
      <div className="st-sp-s" />
      <LiveEmbed kind="browser" src="https://pjeon18.github.io/prep-io/" title="Prep.io prototype" poster={dFair} />

      {/* ---------------- 01 the gap ---------------- */}
      <Chapter n="01" title="Career advice is stuck at two extremes" name="The gap" />
      <Sequence lines={[
        { text: 'Recorded advice is passive, and anyone can claim to be a Goldman analyst.', size: 'xl' },
        { text: 'Booked mentorship is good, and one hour helps exactly one person.', align: 'indent' },
        { text: 'A sophomore who cannot name the jobs yet cannot form the question either one requires.' },
        { text: 'They need to wander and overhear.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <StatScreens stats={[
        { to: 40, suffix: 'k+', post: 'verified mentors on ADPList already give advice for free.', bg: '#B0402D', fg: '#FFFFFF', num: '#141210' },
        { to: 300, suffix: 'k+', post: 'people watch live talk on Twitch at any given moment.', bg: '#111110', fg: '#F5F2EC', num: '#E9806A', align: 'center', big: true, dark: true },
        { pre: 'About', to: 19, suffix: 'M', post: 'US college students, before counting anyone switching careers.', bg: '#F4EEE6', fg: '#141210', num: '#B0402D', align: 'right' },
      ]} />
      <div className="st-sp" />
      <ChartBeats beats={[
        'Two questions decide this market. Does it happen live, and can you trust who is talking?',
        'Every player owns one side. Recorded content is public, mentors are private, and Twitch is live without any career context.',
        'The top right needs both at once, which is why it stays empty.',
        'Prep.io is built for that corner. Live, drop-in rooms with hosts whose credentials were checked.',
      ]}>
        <MarketMap />
      </ChartBeats>
      <LightUp text="Mentorship is scheduled and private. Content is recorded and public. The professor's office hours has no online home." accent="no online home" />

      {/* ---------------- 02 people ---------------- */}
      <Chapter n="02" title="A marketplace with two sides and three kinds of demand" name="People" />
      <PersonaSwitch people={[
        { name: 'The explorer', quote: '“I don’t know what these jobs actually are.”', img: mRoom, alt: 'Lurking in a live room', lines: ['A sophomore who browses, lurks, and leaves without committing to anything.', 'Every platform demands a specific question before it will show them anything.', 'Prep.io lets them watch any public room with no account, and their name appears nowhere until they raise a hand.'] },
        { name: 'The prepper', quote: '“I have a superday next week.”', img: mRoomHand, alt: 'A raised hand in the queue', lines: ['A junior who needs targeted help this week, and will pay to go deeper.', 'Booking a mentor takes longer than the deadline they are racing.', 'Prep.io puts a live expert in front of them tonight, with a breakout one tap away after the answer.'] },
        { name: 'The switcher', quote: '“I want what it’s really like, not a coach.”', img: mVerify, alt: 'Choosing how to verify a host', lines: ['A consultant of 27 eyeing product management, who wants candor from someone two years ahead.', 'The honest version of this conversation only happens off the record.', 'Prep.io shows a badge on every host, and marks the unverified ones instead of hiding them.'] },
      ]} />
      <div className="st-sp" />
      <Say size="l">And the people on the other side of the room.</Say>
      <BigList items={[
        { head: 'Young professionals', line: 'An hour of talking and nothing else. No editing, no thumbnails, no posting schedule.' },
        { head: 'Domain personalities', line: 'The hot seat is an honest funnel. Public answers build the case for a private session.' },
        { head: 'Institutions', line: 'A career center brings both sides of the market on the same afternoon.' },
      ]} />

      {/* ---------------- 03 stories ---------------- */}
      <Chapter n="03" title="Nine stories, and the check that decides each one" name="Stories" />
      <Say size="l">Each persona asks the product for something specific. Every story carries the condition that counts as done.</Say>
      <Ledger tone="cream" items={STORY_ITEMS} />

      {/* ---------------- 04 funnel ---------------- */}
      <Chapter n="04" title="One shape, four steps, consent at every gate" name="Funnel" />
      <StackCards cards={[
        { n: '1', title: 'Lurk in the crowd', body: 'Free and anonymous forever, because the explorer leaves at a signup wall.', bg: '#F4EEE6', fg: '#141210', num: '#B0402D' },
        { n: '2', title: 'Raise a hand', body: 'A written question in a public queue. The first time your name appears anywhere.', bg: '#E5EFE9', fg: '#141210', num: '#1C5C41', variant: 'big' },
        { n: '3', title: 'The hot seat', body: 'Answered in front of the room, so one minute of the host’s time teaches everyone.', bg: '#B0402D', fg: '#FFFFFF', num: '#141210', variant: 'flip' },
        { n: '4', title: 'Breakout', body: 'Private and paid, and only if both of you accept. Payment is a separate third step.', bg: '#111110', fg: '#FFFFFF', num: '#E9806A' },
      ]} />

      {/* ---------------- 05 the hot seat, specified ---------------- */}
      <Chapter n="05" title="Four screens, one state machine, nine rules" name="Spec" />
      <Say size="l">The prototype went from the written spec straight to code. The spec’s screens sit above what shipped, so the two can be read against each other.</Say>
      <Reveal className="st-fade"><Wireframes shots={{ fair: mFair, room: mRoom, sheet: mRoomHand, hotseat: mHotseat }} /></Reveal>
      <div className="st-sp" />
      <Say size="l" align="indent">Every exit is labeled. The dashed paths return you to the crowd with nothing lost, which keeps raising a hand cheap.</Say>
      <Reveal className="st-fade mg-scrollfig st-figure"><HotSeatStates /></Reveal>
      <More summary="The nine rules, and where each one lives">
        <ul>
          <li><b>Only a queued hand can be promoted.</b> Otherwise the promote action returns false.</li>
          <li><b>One hot seat at a time.</b> A second promotion is refused while the seat is taken.</li>
          <li><b>Your hand goes up once.</b> A second raise shows a toast.</li>
          <li><b>No empty questions.</b> The sheet cannot submit.</li>
          <li><b>Hand raise can be off for a session.</b> The button explains itself instead of failing silently.</li>
          <li><b>The simulated queue caps at four.</b> Simulated askers wait their turn.</li>
          <li><b>Boosts sort the host’s view only.</b> The stage still needs the host’s click.</li>
          <li><b>Lowering your hand is immediate.</b> You leave the queue on the next render.</li>
          <li><b>An interrupted hot seat still counts.</b> The recap credits it and a chapter is minted.</li>
        </ul>
      </More>
      <More summary="Edge cases the spec had to answer">
        <ul>
          <li><b>The host ends the session mid hot seat.</b> The question is credited and the chapter is minted.</li>
          <li><b>You attach a boost you cannot afford.</b> The hand still goes up without it, and a toast says so.</li>
          <li><b>You reload mid session.</b> The room is gone, because live state is never saved.</li>
          <li><b>Two rooms want you at once.</b> You are in one room at a time, and a second join returns early.</li>
        </ul>
      </More>

      {/* ---------------- 06 money ---------------- */}
      <Chapter n="06" title="Where money is allowed to touch the product" name="Money" />
      <Beats lines={[
        { text: 'Monetize the host’s time and tools. Never viewer visibility, and never placement.', size: 'xl' },
        { text: 'It sells breakouts at the host’s own rate, boosts inside the host’s view, a study subscription, and ticketed events.', align: 'indent' },
        { text: 'It refuses promoted placement, paid discovery, paywalls on public rooms, and any route to the stage that skips the host.', tone: 'soft' },
      ]} />
      <Sequence lines={[
        { text: 'The obvious paid question is a super chat. Pay more, get answered.', size: 'xl' },
        { text: 'It funds the host, and it breaks the one thing being sold, a fair queue.', align: 'indent' },
        { text: 'What shipped pins a boosted question higher in the host’s view and pays the points to the host.' },
        { text: 'Paying never gets you on stage. The host still chooses.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />
      <More summary="The invariants the store actually holds">
        <ul>
          <li><b>One room at a time.</b> Joining a second room returns early.</li>
          <li><b>Archives can never fake liveness.</b> A recording refuses to open as a live session.</li>
          <li><b>The consent gate.</b> No code path puts a person on stage without a hand they raised.</li>
          <li><b>Breakouts need two consents,</b> and payment is a third separate step.</li>
          <li><b>Live state is never persisted,</b> so a reload cannot bring back a fake room.</li>
          <li><b>There is no direct-message shape in the store at all.</b> The absence is the feature.</li>
        </ul>
      </More>

      {/* ---------------- 07 trust ---------------- */}
      <Band tone="night">
        <Chapter n="07" title="The badge, and the absence of one" name="Trust" />
        <Duo img={mGrace} alt="An unverified host profile" lines={[
          { text: 'If recorded advice is unverifiable, verification is the product.', size: 'l' },
          { text: 'The badge has three states and one rule. The marking never lies in either direction.' },
          { text: 'Unverified hosts are never hidden. They carry a gray shield everywhere they appear.' },
          { text: '“Verification pending, treat my takes accordingly.”', tone: 'warm' },
        ]} />
        <Say size="l" align="right">A trust system you only ever see passing teaches nobody what the badge means.</Say>
      </Band>
      <Shots items={[
        { img: mVerify, alt: 'The verification screen', cap: 'Choose how your identity gets confirmed.' },
        { img: mSettings, alt: 'Privacy settings', cap: 'Your name appears only when you raise a hand.' },
        { img: mGrace, alt: 'An unverified host', cap: 'Self-reported, and labeled that way.' },
      ]} />

      {/* ---------------- 08 honest liveness ---------------- */}
      <Chapter n="08" title="Simulating a crowd without lying about one" name="Liveness" />
      <Beats lines={[
        { text: 'No number on screen is a constant.', size: 'xxl' },
        { text: 'Counts move because simulated people arrive and leave every two to four seconds.', align: 'indent' },
        { text: 'Twelve personas carry a style. Lurkers stay quiet, and askers raise a hand every fourteen to twenty-six seconds.' },
        { text: 'On the host side, boosted questions sort higher, and promoting one is still a deliberate click.', align: 'right', tone: 'soft' },
      ]} />

      <Beats lines={[
        { text: 'Real video was out of scope, so the stage is a breathing portrait over a waveform.', size: 'l' },
        { text: 'The label says camera mocked, because a screenshot should never claim something untrue.', align: 'right', tone: 'acc' },
      ]} />
      <More summary="What the simulation still approximates">
        <ul>
          <li>The room clock ticks on chained timeouts, so under heavy animation it can drift a few percent.</li>
          <li>Scheduled sessions are display labels rather than a real calendar.</li>
          <li>The hot-seat overlay is not announced to screen readers, though the persistent banner carries the state.</li>
          <li>The optional language model that drives chat falls back to scripted lines with no key.</li>
        </ul>
      </More>

      {/* ---------------- 09 design system ---------------- */}
      <Chapter n="09" title="One token set, two worlds, three colors" name="System" />
      <Say size="l">Every color has one job. Seeing it anywhere means the same thing.</Say>
      <Moments items={[
        { color: '#141210', name: 'Action', tempo: 'Every primary button' },
        { color: '#B0402D', name: 'Live', tempo: 'On air, and nothing else' },
        { color: '#1C5C41', name: 'Verified', tempo: 'A credential was checked' },
        { color: '#3A3733', name: 'Theater', tempo: 'Rooms play with the lights down' },
      ]} />
      <Beats lines={[
        { text: 'The reskin that fixed a generic-looking first build took an afternoon, because color, type and spacing were tokens from the start.', align: 'indent' },
        { text: 'Dark mode is neutral graphite, so it never fights the thumbnails.', size: 'xl', align: 'right' },
      ]} />
      <Shots frame="desktop" items={[
        { img: dVod, alt: 'A recording with chapters', cap: 'Each chapter is a question someone asked.' },
        { img: dLibrary, alt: 'The library', cap: 'History, tickets and playlists. No feed anywhere.' },
      ]} />
      <Shots frame="desktop" items={[
        { img: dMaya, alt: 'A verified host profile', cap: 'A verified host. Memberships buy time and tools, never reach.' },
        { img: dExplore, alt: 'The explore page', cap: 'Explore, with shelves built from goals you state.' },
      ]} />

      {/* ---------------- 10 tradeoffs ---------------- */}
      <Chapter n="10" title="Seven calls, what was chosen and what it cost" name="Tradeoffs" />
      <Duo frame="desktop" side="right" img={dExplore} alt="The goal-driven explore page" lines={[
        { text: 'Partway through I asked for a recommendations page. The spec bans feeds outright.', size: 'l' },
        { text: 'What shipped is shelves matched to goals you state. Nothing is inferred from what you watched, and nothing scrolls forever.' },
        { text: 'Writing the rule down early is what made the conflict visible.', tone: 'acc' },
      ]} />
      <Ledger tone="cream" items={[
        { label: 'Launch shape', title: 'Scheduled events first, instead of rooms that are always on.', fix: 'Spontaneity has to wait, so the calendar sits beside live.', lesson: 'Clubhouse died of empty rooms.' },
        { label: 'Paid questions', title: 'Boosts pin a question higher in the host’s view, instead of a super chat.', fix: 'Less revenue up front.', lesson: 'The queue stays fair, which is the thing being sold.' },
        { label: 'Discovery', title: 'Shelves matched to goals you state, instead of a behavioral feed.', fix: 'Less time on site, by design.', lesson: 'Nothing about you is inferred.' },
        { label: 'The stage', title: 'A breathing portrait and a waveform, instead of real video.', fix: 'Nothing streams, and the stage label says so.', lesson: 'The prototype argues product, not plumbing.' },
        { label: 'Recordings', title: 'Premium by default with live always free, instead of every recording free.', fix: 'It reversed an earlier call, and the free archive grows slower.', lesson: 'The reversal is written down.' },
        { label: 'Demo content', title: 'One booth stocked and seven thin, instead of eight busy ones.', fix: 'The demo looks thinner.', lesson: 'It also looks like a real cold start.' },
        { label: 'Follow-ups', title: 'Scheduled sessions and breakouts, instead of direct messages.', fix: 'A familiar retention lever is gone.', lesson: 'Harassment has no private channel to happen in.' },
      ]} />
      <div className="st-sp" />
      <Duo img={mCommit} alt="The one dollar commitment" lines={[
        { text: 'Free events charge a one dollar commitment, refunded when you attend.', size: 'l' },
        { text: 'It is a bot filter and an attendance stake, so the forty people in the room meant to be there.' },
        { text: 'Watching live stays free for everyone.', tone: 'acc' },
      ]} />
      <Say size="l">The same surfaces, sorted the way they were planned. The bottom right lists what the product said no to.</Say>
      <Reveal className="mg-matrix st-matrix">
        <div className="mg-matrix-y"><span>High value</span><span>Low value</span></div>
        <div className="mg-matrix-grid">
          <div className="mg-quad mg-q-blue">
            <div className="mg-quad-name">Shipped first</div>
            <div className="mg-quad-chips"><span>consent gate</span><span>badge and its absence</span><span>no signup wall</span><span>archive labels</span><span>$1 commitment</span></div>
          </div>
          <div className="mg-quad mg-q-green">
            <div className="mg-quad-name">The big bets</div>
            <div className="mg-quad-chips"><span>crowd simulation</span><span>hot-seat moment</span><span>chaptered recordings</span><span>desktop shell</span><span>campus mode</span></div>
          </div>
          <div className="mg-quad mg-q-purple">
            <div className="mg-quad-name">Nice to have</div>
            <div className="mg-quad-chips"><span>shorts</span><span>playlists</span><span>transcripts</span><span>theme toggle</span></div>
          </div>
          <div className="mg-quad mg-q-yellow">
            <div className="mg-quad-name">Declined or deferred</div>
            <div className="mg-quad-chips"><span>feed, never</span><span>direct messages, never</span><span>paid placement, never</span><span>real video, later</span><span>moderation tools, later</span></div>
          </div>
        </div>
        <div className="mg-matrix-x"><span>Low effort</span><span>High effort</span></div>
      </Reveal>

      {/* ---------------- 11 second audience ---------------- */}
      <Chapter n="11" title="The same machinery, pointed at a lecture hall" name="Campus" />
      <Duo frame="desktop" img={dCourse} alt="A course channel" lines={[
        { text: 'A course today is four tools that do not know about each other. Here it is one channel.', size: 'l' },
        { text: 'The consent gate needed no changes. Raise your hand and get called on is what office hours already are.' },
      ]} />
      <Duo frame="desktop" side="right" img={dCampus} alt="Campus home" lines={[
        { text: 'The largest seeded course has 903 students, the case that makes office hours a scaling problem.' },
        { text: 'Campus is a separate data island, so course content never leaks into careers discovery.', tone: 'acc' },
      ]} />

      {/* ---------------- 12 what broke ---------------- */}
      <Chapter n="12" title="The critique log, including the one that cost a rebuild" name="What broke" />
      <Say size="l">Each entry came from looking at the running product and writing down what was wrong. The first is the most expensive note I have written to myself.</Say>
      <Ledger items={[
        { title: 'The whole thing reads as generated and generic.', fix: 'The first build was navy and amber and dark everywhere. It was rebuilt around paper and ink, with one dark scope for live rooms and three color roles.', lesson: 'A palette that could belong to any product belongs to none.' },
        { title: 'Color behind the thumbnails looks like smudges.', fix: 'The ambient gradient sat at 0.16 alpha in dark mode. It now sits at 0.05.', lesson: 'On a video platform the thumbnails are the content.' },
        { title: 'Course chips read CS5, STA and EC1.', fix: 'Truncation cut mid-token. Chips now show letters only.', lesson: 'Truncating an identifier produces a different identifier.' },
        { title: 'A campus link opens inside careers navigation.', fix: 'Mode was saved instead of read from the route. It now follows the URL.', lesson: 'Anything a link can contradict belongs in the URL.' },
        { title: 'A campus room is full of recruiting chatter.', fix: 'The crowd drew from one line pool everywhere. Campus now has its own pool and its own search index.', lesson: 'Two audiences on one platform need separate data.' },
        { title: 'A wrapped line can start with a floating dot.', fix: 'Separators are now placed between items instead of appended to them.', lesson: 'This is the detail that decides whether a page reads as crafted.' },
      ]} />
      <div className="st-sp" />
      <Duo frame="desktop" img={dSparse} alt="An honestly empty booth" lines={[
        { text: 'One booth is stocked and seven are thin, on purpose.', size: 'l' },
        { text: 'A demo where every category is equally busy has never met a cold start.' },
        { text: 'So it launches with scheduled events, and uses campuses to put both sides in one place at one time.', tone: 'acc' },
      ]} />

      {/* ---------------- 13 metrics ---------------- */}
      <Chapter n="13" title="One number that catches both sides" name="Metrics" />
      <Beats lines={[
        { text: <>The North Star is questions <em>answered live</em>, per week.</>, size: 'xl' },
        { text: 'It cannot rise unless viewers raise hands and hosts call on them. It is also the event that mints a recording chapter.', align: 'right', tone: 'soft' },
      ]} />
      <div className="st-sp" />
      <Say size="l" tone="acc">Nothing below has been measured. These are the lines a twelve-week campus pilot would have to clear.</Say>
      <TargetTicks rows={[
        { name: 'Questions answered live, weekly, by week six', value: 60, label: '60', why: 'At twelve sessions that is five a session, the pace of a real office hour. Under 25 ends the pilot.' },
        { name: 'Hosts still hosting after four weeks', value: 75, why: 'Supply is the side that dies first, and it dies quietly. Under half ends the pilot.' },
        { name: 'Raised hands that reach the hot seat', value: 60, why: 'A long queue nobody reaches teaches people not to raise a hand.' },
        { name: 'Sessions with at least one hot seat', value: 90, why: 'A session with no question answered is a webinar.' },
        { name: 'Answered questions that lead to a breakout', value: 5, why: 'The revenue check, set low on purpose. Discovery is not allowed to help it.' },
      ]} />
      <Reveal className="st-fade st-figure"><PilotChart /></Reveal>
      <Say size="m" tone="soft">A model of the North Star across one recruiting season. It peaks in week eight with superday season and falls toward Thanksgiving.</Say>

      {/* ---------------- takeaways ---------------- */}
      <Band tone="night">
        <Chapter n="14" title="What I would carry forward" name="Takeaways" />
        <Beats gap="l" lines={[
          { text: 'Write the decision down, with the date. Eighteen entries meant every argument started from what was settled.', size: 'xl' },
          { text: 'When boosts needed the money rule to bend, I rewrote the rule openly instead of making an exception.', align: 'indent' },
          { text: 'Colors and type lived in one file, so the full reskin took an afternoon.', size: 'xl', align: 'right' },
          { text: 'Mocking the video was fine. Faking the viewer count would not have been.', tone: 'acc' },
        ]} />
        <div className="st-sp" />
        <Say size="m" tone="soft">27 routes, mobile and desktop layouts, light, dark and theater modes, careers and campus, and 143 kB of gzipped JavaScript.</Say>
      </Band>

      <div className="mg-finale mg-band">
        <Say size="xxl" align="center" tone="light">Paying never gets you on stage. The host still chooses.</Say>
        <a className="mg-finale-cta" href="https://pjeon18.github.io/prep-io/" target="_blank" rel="noreferrer">
          Open the prototype → pjeon18.github.io/prep-io
        </a>
      </div>

      <details className="mg-details mg-sources">
        <summary>Sources and notes</summary>
        <p className="mg-sources-p">
          Market comparables are as cited in the project's requirements document and decision log.
          Mentor supply (ADPList), pricing at the top of the market (Intro.co), and concurrent-viewer
          scale for live talk (Twitch). All hosts, courses, viewers and chat in the prototype are
          fictional seed data. Company names appear for identification and commentary, and all marks
          belong to their owners.
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
