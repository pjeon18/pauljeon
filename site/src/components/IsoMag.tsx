// The ISO case study. Told as a sequence of beats with the story kit
// (components/story), so each idea gets its own moment at one size instead
// of competing in a stack of headings, captions and labels.
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BackToSite from './BackToSite'
import Footer from './Footer'
import LiveEmbed from './LiveEmbed'
import { consumeArrival } from '../lib/arrival'
import '../styles/mag.css'
import {
  Band, Beats, BigList, Chapter, ChartBeats, Duo, LightUp, Ledger, Moments, More, PersonaSwitch,
  PinnedPhone, Reveal, Say, Sequence, Shots, StackCards, StatScreens, StoryChrome, TargetTicks,
} from './story/Story'

import isoIcon from '../assets/iso-icon.webp'
import logoTinder from '../assets/logo-tinder.webp'
import logoHinge from '../assets/logo-hinge.webp'
import logoBumble from '../assets/logo-bumble.webp'
import logoBeli from '../assets/logo-beli.webp'
import queue from '../assets/iso-queue.webp'
import searching from '../assets/iso-searching.webp'
import match from '../assets/iso-match.webp'
import roomTimer from '../assets/iso-room-timer.webp'
import keepAsk from '../assets/iso-keep-ask.webp'
import keepMutual from '../assets/iso-keep-mutual.webp'
import keepDeclined from '../assets/iso-keep-declined.webp'
import closedView from '../assets/iso-closed-view.webp'
import oneChat from '../assets/iso-onechat.webp'
import noMatch from '../assets/iso-no-match.webp'
import closeoutOutcome from '../assets/iso-closeout-outcome.webp'
import closeoutReflection from '../assets/iso-closeout-reflection.webp'
import maybeAgain from '../assets/iso-maybe-again.webp'
import memories from '../assets/iso-memories.webp'
import trend from '../assets/iso-trend.webp'
import paywall from '../assets/iso-paywall.webp'
import settings from '../assets/iso-settings.webp'
import obSignup from '../assets/iso-ob-1-signup.webp'
import obEdu from '../assets/iso-ob-2-edu.webp'
import obPhoto from '../assets/iso-ob-3-photo.webp'

// ---------------------------------------------------------------------------

function useArrival() {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const els = root.current?.querySelectorAll('.mg-rv') ?? []
    // Arriving through the card's shared-element transition: the hero and the
    // title must already be visible when the browser snapshots the new page.
    if (consumeArrival()) {
      let k = 0
      els.forEach((el) => {
        if ((el as HTMLElement).tagName === 'H1') el.classList.add('in')
        else (el as HTMLElement).style.transitionDelay = `${400 + k++ * 90}ms`
      })
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return root
}

// Chart 1, the market. Real-time on x, exclusive on y.
function MarketMap() {
  const apps = [
    { x: 128, y: 347, name: 'Tinder', sub: 'payers down 7% a year', icon: logoTinder },
    { x: 190, y: 252, name: 'Hinge', sub: 'revenue up 25%', icon: logoHinge },
    { x: 286, y: 300, name: 'Bumble', sub: '24-hour match timer', icon: logoBumble },
    { x: 190, y: 126, name: 'Beli', sub: 'ranks restaurants, not people', icon: logoBeli },
  ]
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="Market map. Every major dating app is asynchronous with many chats. ISO is live and one at a time.">
      <defs>
        <clipPath id="isoSq"><rect width="26" height="26" rx="7" /></clipPath>
        <clipPath id="isoSqL"><rect width="32" height="32" rx="8" /></clipPath>
      </defs>
      <rect className="cb-wipe" data-beat="2" x="340" y="20" width="270" height="190" fill="#FFE7CF" />
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#141210" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#141210" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#6E675D">asynchronous</text>
        <text x="608" y="428" fontSize="15" fill="#141210" textAnchor="end" fontWeight="700">live</text>
        <text x="54" y="398" fontSize="15" fill="#6E675D" transform="rotate(-90 54 398)">many chats</text>
        <text x="54" y="110" fontSize="15" fill="#141210" fontWeight="700" transform="rotate(-90 54 110)">one at a time</text>
      </g>
      {apps.map((a) => (
        <g key={a.name} className="cb-pop" data-beat="1" data-dim="2">
          <circle cx={a.x} cy={a.y} r="6" fill="#141210" />
          <g transform={`translate(${a.x + 14} ${a.y - 13})`}>
            <g className="cb-logo">
              <rect width="26" height="26" rx="7" fill="#fff" stroke="#E2DDD3" />
              <image href={a.icon} width="26" height="26" clipPath="url(#isoSq)" />
            </g>
          </g>
          <text x={a.x + 48} y={a.y + 1} fontSize="17" fontWeight="700" fill="#141210">{a.name}</text>
          <text x={a.x + 48} y={a.y + 18} fontSize="13.5" fill="#6E675D">{a.sub}</text>
        </g>
      ))}
      <g className="cb-drop" data-beat="3">
        <circle className="cb-ring" cx="540" cy="86" r="12" fill="none" stroke="#FF8000" strokeWidth="2" />
        <circle cx="540" cy="86" r="9" fill="#FF8000" />
        <g transform="translate(486 70)"><g className="cb-logo"><image href={isoIcon} width="32" height="32" clipPath="url(#isoSqL)" /></g></g>
        <text x="476" y="88" textAnchor="end" fontSize="22" fontWeight="700" fill="#141210">ISO</text>
        <text x="476" y="106" textAnchor="end" fontSize="13.5" fill="#C24E14">live, one at a time</text>
      </g>
    </svg>
  )
}

// Chart 2, every shipped surface graded on the two risks.
function AuditMap() {
  const dots: { x: number; y: number; label: string; risk?: boolean; end?: boolean }[] = [
    { x: 90, y: 88, label: 'one live conversation', end: true },
    { x: 84, y: 62, label: 'mutual keep-talking', end: true },
    { x: 70, y: 76, label: 'reply timer', end: true },
    { x: 62, y: 40, label: 'the no-match screen' },
    { x: 80, y: 24, label: 'burnout nudge', end: true },
    { x: 52, y: 92, label: '.edu verification', end: true },
    { x: 44, y: 60, label: 'outcome loop', end: true },
    { x: 33, y: 82, label: 'private reflection', end: true },
    { x: 40, y: 20, label: 'Memories', risk: true },
    { x: 24, y: 44, label: 'Maybe We’ll Meet Again', risk: true },
    { x: 20, y: 10, label: 'ISO+ tier', risk: true },
  ]
  const pos = (d: { x: number; y: number }) => [70 + (d.x / 100) * 540, 20 + ((100 - d.y) / 100) * 380]
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="ISO surfaces graded on whether they force intention and whether they could rebuild a roster">
      <line className="cb-ax" data-beat="0" x1="70" y1="210" x2="610" y2="210" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="340" y1="20" x2="340" y2="400" stroke="#E2DDD3" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="610" y2="400" stroke="#141210" strokeWidth="1.5" />
      <line className="cb-ax" data-beat="0" x1="70" y1="400" x2="70" y2="20" stroke="#141210" strokeWidth="1.5" />
      <g data-beat="0">
        <text x="72" y="428" fontSize="15" fill="#6E675D">weak signal of intent</text>
        <text x="608" y="428" fontSize="15" fill="#141210" textAnchor="end" fontWeight="700">forces intention</text>
        <text x="54" y="398" fontSize="15" fill="#6E675D" transform="rotate(-90 54 398)">could rebuild a roster</text>
        <text x="54" y="160" fontSize="15" fill="#141210" fontWeight="700" transform="rotate(-90 54 160)">structurally can’t</text>
      </g>
      {dots.map((d) => {
        const [cx, cy] = pos(d)
        return (
          <g key={d.label} className="cb-pop" data-beat={d.risk ? 2 : 1}>
            {d.risk
              ? <circle cx={cx} cy={cy} r="7" fill="#FDFDFB" stroke="#FF8000" strokeWidth="2.5" />
              : <circle cx={cx} cy={cy} r="7" fill="#141210" />}
            <text x={d.end ? cx - 15 : cx + 15} y={cy + 5} textAnchor={d.end ? 'end' : 'start'} fontSize="14.5" fontWeight="700" fill={d.risk ? '#C24E14' : '#141210'}>{d.label}</text>
          </g>
        )
      })}
      {dots.filter((d) => d.risk).map((d) => {
        const [cx, cy] = pos(d)
        return <circle key={`r${d.label}`} className="cb-pop" data-beat="3" cx={cx} cy={cy} r="17" fill="none" stroke="#FF8000" strokeWidth="1.5" strokeDasharray="3 4" />
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------

export default function IsoMag() {
  const root = useArrival()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="mag" ref={root} style={{ ['--acc' as string]: '#FF8000', ['--acc-deep' as string]: '#C24E14', ['--acc-tint' as string]: '#FFF3EC', ['--st-night' as string]: '#1c1209', ['--st-acc-dark' as string]: '#FFA640' }}>
      <StoryChrome />

      <nav className="case-nav mg-nav">
        <Link className="case-logo" to="/">Paul Jeon</Link>
        <BackToSite />
      </nav>

      <header className="mg-masthead">
        <img src={isoIcon} alt="ISO" width="76" height="76" style={{ borderRadius: 18, display: 'block', marginBottom: 24, viewTransitionName: 'case-hero' } as React.CSSProperties} />
        <div className="mg-kicker mg-rv">Product case study · interactive prototype · 2026</div>
        <h1 className="mg-rv" style={{ viewTransitionName: 'case-title' } as React.CSSProperties}>
          A dating app<br />built on a <em>refusal</em>
        </h1>
        <Say size="m" tone="soft">ISO matches you with one person, live. There is no inbox, so a second conversation has nowhere to go.</Say>
        <div className="mg-meta mg-rv">
          <span><b>Role</b> product, design, engineering, solo</span>
          <span><b>Stack</b> React · TypeScript · Zustand · Framer Motion</span>
          <span className="mg-meta-links">
            <a href="https://pjeon18.github.io/iso-prototype/" target="_blank" rel="noreferrer">Open the prototype ↗</a>
            <a href="https://pjeon18.github.io/iso-demo/?tour" target="_blank" rel="noreferrer">Guided tour ↗</a>
            <a href="https://pjeon18.github.io/iso-prototype/design-doc.html" target="_blank" rel="noreferrer">Design doc ↗</a>
          </span>
        </div>
      </header>

      {/* ---------------- the product, first ---------------- */}
      <Chapter n="00" title="The product, in one minute" name="Product" />
      <PinnedPhone steps={[
        { text: 'Home is one button.', quiet: 'The nearby count is the only number on screen.', img: queue, alt: 'The queue home screen' },
        { text: 'Waiting shows who is around.', quiet: 'The phrases rotate at reading pace.', img: searching, alt: 'Searching for a match' },
        { text: 'You are matched live with someone present.', quiet: 'Their face lands first, their name half a second later.', img: match, alt: 'A match found' },
        { text: 'A calm timer shows whose turn it is.', quiet: 'It never punishes you for being slow.', img: roomTimer, alt: 'The live room with the reply timer' },
        { text: 'Then you both answer keep talking, sealed.', quiet: 'Neither sees the other answer until both are in.', img: keepAsk, alt: 'The keep talking decision' },
        { text: 'Two yeses open your one chat.', quiet: 'It is the only moment the app turns green.', img: keepMutual, alt: 'A mutual keep talking result', glow: true },
        { text: 'Anything else closes kindly.', quiet: 'You go back to the queue owing nobody a reply.', img: closedView, alt: 'The polite close' },
      ]} />

      <div className="st-sp" />
      <Say size="xl">Try it yourself. This is the shipped build with the backend mocked.</Say>
      <div className="st-sp-s" />
      <LiveEmbed kind="phone" src="https://pjeon18.github.io/iso-prototype/" title="ISO prototype" poster={queue} />

      {/* ---------------- 01 research ---------------- */}
      <Chapter n="01" title="Why people are quitting the apps they are still on" name="Research" />
      <Sequence lines={[
        { text: 'Matches pile up into chats nobody wants to answer.', size: 'xl' },
        { text: '“I have five chats going and I’m not excited about any of them.”', align: 'indent', tone: 'acc' },
        { text: 'Revenue grows with time in the app, so the apps build more matches.' },
        { text: 'The talking stage is what those mechanics reward.', size: 'xl', align: 'right' },
      ]} />

      <StatScreens stats={[
        { to: 79, suffix: '%', post: 'of US college students are on no dating app at all.', bg: '#FF8000', fg: '#141210', num: '#FFFFFF' },
        { pre: 'More than', to: 50, suffix: '%', post: 'of Gen Z say dating apps have burned them out.', bg: '#1c1209', fg: '#F5F2EC', num: '#FF8000', align: 'center', big: true, dark: true },
        { pre: 'About', to: 90, suffix: '%', post: 'of Gen Z would rather meet someone offline.', bg: '#F6E7CF', fg: '#2A190B', num: '#FF8000', align: 'right' },
      ]} />

      <div className="st-sp" />
      <ChartBeats beats={[
        'Two questions place every dating app. Is it live, and can you hold more than one conversation at once?',
        'Every major app sits bottom left. Asynchronous, with a roster of parallel chats that keeps people opening it.',
        'The top right stays empty. Live and exclusive would cost these apps the revenue mechanic underneath.',
        'ISO is built for that corner. You are matched live with one present person, and only one.',
      ]}>
        <MarketMap />
      </ChartBeats>

      <LightUp text="Every app lets you hold a roster, because the roster keeps you opening the app. Nobody enforces one conversation at a time." accent="one conversation at a time" />

      {/* ---------------- 02 people ---------------- */}
      <Chapter n="02" title="Three kinds of user, and what each one needs" name="People" />
      <PersonaSwitch people={[
        { name: 'Burned out', quote: '“I have five chats going and I’m not excited about any of them.”', img: oneChat, alt: 'The one ongoing chat', lines: ['She is 21, a college junior, and has deleted Hinge twice.', 'Managing the roster became the work, and none of it led anywhere.', 'ISO holds one conversation or none, and after three rough ones it suggests she stop for the night.'] },
        { name: 'Intentional', quote: '“Something intentional. I’m not here to collect people.”', img: keepMutual, alt: 'A mutual keep talking result', lines: ['He is 24, working, and tired of small talk and ghosting.', 'Paid tiers that sell visibility make every app feel rigged to him.', 'ISO matches him live with someone who is present, and a chat continues only if both say yes.'] },
        { name: 'Safety first', quote: '“Verified humans only. The .edu thing is why I’m here.”', img: obEdu, alt: 'A non-.edu address refused at signup', lines: ['She is 20, a sophomore, and reads the settings before anything else.', 'Most apps treat safety as a toggle she has to go and find.', 'ISO verifies every student before a first match, and a block removes that person from her history.'] },
      ]} />
      <Shots items={[
        { img: obSignup, alt: 'Onboarding, create your account', cap: 'Verification comes first, at step one of ten.' },
        { img: obEdu, alt: 'Onboarding, a non-.edu address refused', cap: 'A non-.edu address is refused inline.' },
        { img: obPhoto, alt: 'Onboarding, photo verification', cap: 'The liveness photo is never shown on a profile.' },
      ]} />

      {/* ---------------- 03 the bet ---------------- */}
      <Chapter n="03" title="Defining the product by what it will not do" name="The bet" />
      <Say size="l">Each refusal answers a symptom from the research. Three of them are permanent, so a request to add them gets flagged instead of built.</Say>
      <div className="st-sp" />
      <StackCards cards={[
        { n: '1', title: 'One at a time, enforced', body: 'A second conversation is unreachable from any state the app can be in.', bg: '#FFE7CF', fg: '#141210', num: '#FF8000' },
        { n: '2', title: 'Mutual or finished', body: 'Every conversation becomes your one chat, or closes and returns you to the queue.', bg: '#FF8000', fg: '#141210', num: '#FFFFFF', variant: 'big' },
        { n: '3', title: 'Rank experiences, never people', body: 'Reflection is a private note about how something felt. No score and no list of humans.', bg: '#2A190B', fg: '#F6E7CF', num: '#FF8000', variant: 'flip' },
        { n: '4', title: 'Permanently out', list: ['Rankings of people', 'Paid visibility', 'A discovery feed', 'Time in app as a goal'], bg: '#1c1209', fg: '#FFFFFF', num: '#5a3e25' },
      ]} />

      {/* ---------------- 04 the timer ---------------- */}
      <Chapter n="04" title="Keeping a clock in a conversation calm" name="The timer" />
      <Duo img={roomTimer} alt="The reply timer running in the live room" lines={[
        { text: 'The timer took the most rewriting.', size: 'l' },
        { text: 'It runs only on your turn, and it softens as it drains instead of turning red.' },
        { text: 'At zero it says “no rush, whenever you’re ready” and nothing happens.', align: 'indent' },
        { text: 'Let it lapse twice and the app opens the keep-talking decision early. That is the whole penalty.' },
      ]} />
      <More summary="The three ways keep-talking fires">
        <ul>
          <li><b>Turns.</b> Twelve messages, then a beat. This catches conversations that are going well.</li>
          <li><b>Decide.</b> Either person can tap a quiet link after four messages, so nobody waits on a counter.</li>
          <li><b>Pause.</b> Two timer lapses in a row turn a conversation dying of silence into a clean ending.</li>
          <li>All three land in the same sealed reveal and write the same history record.</li>
        </ul>
      </More>
      <Shots items={[
        { img: keepDeclined, alt: 'A non-mutual reveal', cap: 'Both cards flip together, so nobody watches the other person decide.' },
        { img: oneChat, alt: 'The one ongoing chat', cap: 'The reward is one chat, labelled as the only one.' },
      ]} />

      {/* ---------------- 05 the invariant ---------------- */}
      <Band tone="night">
        <Chapter n="05" title="Where the rule actually lives" name="The invariant" />
        <Beats gap="l" lines={[
          { text: 'Hiding a button does not stop a second chat. Another screen could still open one.', size: 'xl' },
          { text: 'So the rule lives in the app’s data layer. A second chat is refused there, whichever screen asks.', align: 'indent' },
          { text: '“Disabled buttons are decoration. The invariant lives in the action.”', size: 'xl', align: 'right', tone: 'acc' },
          { text: 'So the queue button stays tappable during a chat. It answers with a sentence and points you back to the person you are already talking to.' },
        ]} />
        <More summary="How the store holds the line">
          <ul>
            <li>The active conversation is a <b>nullable singleton</b>. There is no collection of chats that could grow.</li>
            <li>Entering the queue returns early while a chat exists, and the matchmaker re-checks before it matches.</li>
            <li>Revival only appears when you are free. Forcing it mid-chat refuses with a message.</li>
            <li>A block clears the held flag, removes that person from history, and ends any conversation with them.</li>
            <li>Nothing in the matchmaker reads the subscription flag, so paying cannot buy reach.</li>
          </ul>
        </More>
      </Band>

      {/* ---------------- 06 refusals on screen ---------------- */}
      <Chapter n="06" title="Screens that argue against their own engagement" name="Refusals" />
      <Shots items={[
        { img: settings, alt: 'The settings screen', cap: 'Settings has no match manager and no read receipts to buy.' },
        { img: memories, alt: 'The memories screen', cap: 'Memories is read-only, with no reply box anywhere.' },
        { img: paywall, alt: 'The paywall', cap: 'The paid tier prints its own limit. It never buys matches.' },
      ]} />
      <Beats lines={[
        { text: 'After three rough conversations, the app offers to end your night.', size: 'xl' },
        { text: 'Pausing is the primary button, and the copy says “That’s on the night, not on you.”', align: 'indent' },
        { text: 'A product built for engagement could not ship this screen.', align: 'right', tone: 'acc' },
      ]} />
      <Duo side="right" img={noMatch} alt="The no-match screen" lines={[
        { text: 'Live matching needs density, so a quiet campus is a real flaw.', size: 'l' },
        { text: 'The no-match screen says so plainly. When you do match, the other person is really there.' },
      ]} />

      {/* ---------------- 07 reflection ---------------- */}
      <Chapter n="07" title="Measuring how it felt without grading anyone" name="Reflection" />
      <Beats lines={[
        { text: 'The first version asked you to rate every conversation. I cut it.', size: 'xl' },
        { text: 'Rating each one turns a human moment into homework, and quietly asks you to grade a person.', align: 'indent' },
      ]} />
      <Duo img={trend} alt="The trend and weekly recap screen" lines={[
        { text: 'Behavior carries the signal now. Keep-talking answers, reply speed, and whether you met.' },
        { text: 'The explicit check-in is batched into one calm weekly recap.' },
        { text: 'The trend line has a floor, so a slow week reads as resting.', tone: 'acc' },
      ]} />
      <Shots items={[
        { img: closeoutOutcome, alt: 'The outcome question after a chat closes', cap: 'The North Star comes from this one question.' },
        { img: closeoutReflection, alt: 'The private reflection step', cap: 'Private, about how it felt, and easy to skip.' },
      ]} />
      <Say size="l">Revival is the feature most likely to bring the roster back, so it shipped with four limits.</Say>
      <BigList items={[
        { head: 'One slot', line: 'Holding someone new releases whoever was there.' },
        { head: 'Blind', line: 'A one-sided hold is invisible, so nobody is rejected twice.' },
        { head: 'Fourteen days', line: 'Holds expire silently. Keeping someone on ice forever is its own unkindness.' },
        { head: 'Only when free', line: 'It never appears while you are in a conversation.' },
      ]} />
      <Duo side="right" img={maybeAgain} alt="Maybe we will meet again, the single revival slot" lines={[
        { text: 'The slot lives under Profile, with its expiry counting down in plain numbers.' },
        { text: 'Nothing about it is visible to the other person until both of you choose it.', tone: 'acc' },
      ]} />

      {/* ---------------- 08 motion ---------------- */}
      <Chapter n="08" title="How ISO uses animation" name="Motion" />
      <Beats lines={[
        { text: 'Most of ISO moves quietly. Screens slide and fade the same way everywhere, so the app feels like one product.', size: 'l' },
        { text: 'At five moments, the screen fills with color, spreading out from the spot you tapped.', align: 'indent' },
      ]} />
      <Moments items={[
        { color: '#FF8000', name: 'Joining the queue', tempo: 'You are waiting to be matched' },
        { color: '#FF8000', name: 'Getting a match', tempo: 'Someone is ready to talk' },
        { color: '#00FF77', name: 'Both saying yes', tempo: 'It becomes your one chat' },
        { color: '#00FF77', name: 'Saying you met', tempo: 'The date actually happened' },
        { color: '#F8BD62', name: 'A chat ending', tempo: 'It closes without blame' },
      ]} />
      <Beats lines={[
        { text: 'Keeping big animation rare is what makes these five moments feel important.' },
        { text: 'Green only appears when two people have chosen each other, so the color itself means something.', size: 'xl', align: 'right', tone: 'acc' },
      ]} />

      {/* ---------------- 09 audit ---------------- */}
      <Chapter n="09" title="Grading every surface against the two risks" name="Audit" />
      <ChartBeats wide beats={[
        'Two questions decide whether a feature belongs. Does it force intention, and could it rebuild a roster?',
        'The core loop sits top right. These held their ground through validation.',
        'Three features sit near the edge. Memories, revival, and the paid tier.',
        'Each stays on a short leash. Memories is read-only, and the matchmaker never reads the paid flag.',
      ]}>
        <AuditMap />
      </ChartBeats>
      <Say size="l">The same surfaces, sorted the way they were planned. The bottom right lists what the product said no to.</Say>
      <Reveal className="mg-matrix st-matrix">
        <div className="mg-matrix-y"><span>High value</span><span>Low value</span></div>
        <div className="mg-matrix-grid">
          <div className="mg-quad mg-q-blue">
            <div className="mg-quad-name">Shipped first</div>
            <div className="mg-quad-chips"><span>store-enforced rule</span><span>reply timer</span><span>polite close</span><span>three tabs</span><span>no-match screen</span></div>
          </div>
          <div className="mg-quad mg-q-green">
            <div className="mg-quad-name">The big bets</div>
            <div className="mg-quad-chips"><span>live matchmaking</span><span>sealed reveal</span><span>ten-step onboarding</span><span>outcome loop</span><span>motion system</span></div>
          </div>
          <div className="mg-quad mg-q-purple">
            <div className="mg-quad-name">Nice to have</div>
            <div className="mg-quad-chips"><span>weekly recap</span><span>date planner</span><span>custom icon set</span></div>
          </div>
          <div className="mg-quad mg-q-yellow">
            <div className="mg-quad-name">Declined or deferred</div>
            <div className="mg-quad-chips"><span>discovery feed, never</span><span>likes-you, never</span><span>paid visibility, never</span><span>two-tab live mode, later</span></div>
          </div>
        </div>
        <div className="mg-matrix-x"><span>Low effort</span><span>High effort</span></div>
      </Reveal>

      {/* ---------------- 10 what broke ---------------- */}
      <Chapter n="10" title="The bugs, and what each one taught" name="What broke" />
      <Say size="l">Each one came from running the app against its own acceptance criteria. The first is my favourite bug in anything I have built.</Say>
      <Ledger items={[
        { title: 'Two people choose each other, and the partner goes silent forever.', fix: 'The reply scheduler only ran during the live phase, so it went mute the moment a chat became mutual. It now pauses only on the decision screen.', lesson: 'When a state machine gains a new phase, the old behavior has to be allowed back in on purpose.' },
        { title: 'Onboarding stalls on step three.', fix: 'Each step waited for an exit animation that never finishes in a background tab. Steps now only animate in.', lesson: 'Animation should never be what moves a person forward.' },
        { title: 'The brand green is two different greens.', fix: 'Green changed from #20C55E to #00FF77 mid-build, and three inline copies of the old value survived.', lesson: 'Renaming a token only finds the places it was declared.' },
        { title: 'The design document argues against emoji while using them.', fix: 'Still open. The document predates the emoji purge and the nine-photo grid.', lesson: 'A document about the product goes stale the moment the product moves.' },
        { title: 'The logo is clipped at the bottom of the letters.', fix: 'Figma exported its shadow filters with regions cut tight to the glyphs. The regions were widened and the frame padded.', lesson: 'Exported SVG filters carry their own bounding boxes.' },
        { title: 'Sixty frames per second, but only on a laptop.', fix: 'Every reveal animates transform and opacity only and holds 60fps on a throttled CPU. No real mid-range phone was tested.', lesson: 'A throttled desktop is evidence, not proof.' },
      ]} />
      <div className="st-sp" />
      <Beats lines={[
        { text: 'Three things are still open.', size: 'xl' },
        { text: 'Two-tab live mode was never built. It was the stretch goal that would have shown presence best.' },
        { text: 'The chat-open morph approximates the one in the motion brief.', align: 'indent' },
        { text: 'The design document predates two shipped changes and needs regenerating.' },
      ]} />

      {/* ---------------- 11 metrics ---------------- */}
      <Chapter n="11" title="The one number, and the numbers that keep it honest" name="Metrics" />
      <Beats lines={[
        { text: <>The North Star is real-life dates <em>started</em>, per user per month.</>, size: 'xl' },
        { text: 'It counts one answer in the app, “yes, we met.” Mutual conversations are tracked beside it as the leading indicator.', align: 'right', tone: 'soft' },
      ]} />
      <TargetTicks rows={[
        { name: 'Seconds from queue to a live match', value: 60, label: '≤ 60s', why: 'At prime time. Past a minute, waiting stops feeling like other people are there.' },
        { name: 'Prime-time queues that reach a match', value: 80, why: 'Share of queue sessions that end in a live match.' },
        { name: 'Conversations that become mutual', value: 25, why: 'One in four turning mutual means the loop is working as designed.' },
        { name: 'Still active after a week', value: 30, why: 'Deliberately modest. A product built for fewer conversations should not retain like a game.' },
        { name: 'Students who finish verification', value: 60, why: 'Verification is the trust boundary, so people dropping out here is a product failure.' },
        { name: 'Revival attempts per person', value: 12, label: 'watch', watch: true, why: 'If this climbs, the held-flag feature is rebuilding a roster. It is watched and never grown.' },
      ]} />
      <div className="st-sp" />
      <Beats lines={[
        { text: 'If conversations rise and dates stay flat, the handoff to real life is broken.' },
        { text: 'If both stay flat, the loop itself is not landing.', align: 'indent' },
        { text: 'One metric cannot tell those apart. That is why there are two.', size: 'xl', align: 'right' },
      ]} />
      <More summary="Guardrails that must not regress">
        <ul>
          <li>Reports per thousand conversations</li>
          <li>Median reply time in the live room</li>
          <li>Dropped sessions, and people leaving mid-conversation</li>
          <li>Reflection completion against a <b>retention delta</b>, because a negative delta means reflection is causing fatigue</li>
          <li>Sessions ending through the burnout nudge versus a natural exit</li>
          <li>The blind-mutual rate on revival, kept as a diagnostic and <b>never a target</b></li>
        </ul>
      </More>

      {/* ---------------- takeaways ---------------- */}
      <Band tone="night">
        <Chapter n="12" title="What I would carry forward" name="Takeaways" />
        <Beats gap="l" lines={[
          { text: 'Enforce the core rule in the data layer, so no future screen can break it.', size: 'xl' },
          { text: 'Competitors cannot copy one conversation at a time without giving up the revenue that rosters bring in.', align: 'indent' },
          { text: 'Being honest about a quiet campus on the no-match screen was more convincing than hiding it.', size: 'xl', align: 'right' },
          { text: 'Count real dates, even though they are harder to measure than matches.', tone: 'acc' },
        ]} />
        <div className="st-sp" />
        <Say size="m" tone="soft">31 screens, three tabs and never an inbox, nine acceptance criteria traced, 22 custom icons, and a full PRD and design doc.</Say>
      </Band>

      <div className="mg-finale mg-band">
        <Say size="xxl" align="center" tone="light">Presence, not pressure.</Say>
        <a className="mg-finale-cta" href="https://pjeon18.github.io/iso-prototype/" target="_blank" rel="noreferrer">
          Open the prototype → pjeon18.github.io/iso-prototype
        </a>
      </div>

      <details className="mg-details mg-sources">
        <summary>Sources and notes</summary>
        <p className="mg-sources-p">
          Figures are as cited in the product requirements document. College non-adoption (Axios),
          Gen Z burnout (Forbes Health 2025), offline preference (Kinsey / DatingAdvice), and payer and
          revenue movement from public quarterly reporting. Personas are composites written from that
          research rather than interview subjects. All conversation partners in the prototype are
          fictional. App icons appear for identification and commentary, and all marks belong to their owners.
        </p>
      </details>

      <div className="case-next mg-next">
        <div className="case-kicker">Next up</div>
        <Link to="/work/prep-io" className="case-next-link">
          Prep.io. Office hours, made live. <span className="arr">→</span>
        </Link>
      </div>

      <Footer compact />
    </div>
  )
}
