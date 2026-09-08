// ============================================================================
// site.ts — the single source of truth for everything on the page.
// Add a project = add one object. No layout code needs to change.
// ============================================================================

import isoIcon from '../assets/iso-icon.png'
import isoSplash from '../assets/iso-splash.jpg'
import f1 from '../assets/f1.jpg'
import mediaGlobe from '../assets/media-globe.jpg'
import onapsis from '../assets/onapsis.jpg'
import harvardShop from '../assets/harvard-shop.jpg'
import portraitFront from '../assets/portrait-front.jpg'
import pokemaps from '../assets/pokemaps.jpg'
import pocketTactics from '../assets/pocket-tactics.jpg'
import portraitBack from '../assets/portrait-back.jpg'
import gYtViz from '../assets/g-yt-viz.jpg'
import gPokemaps from '../assets/g-pokemaps.jpg'
import gImpostor from '../assets/g-impostor.jpg'
import posterHumanInventory from '../assets/poster-human-inventory.jpg'
import pokemapsMark from '../assets/pokemaps-mark.svg'
import gPrepioRoom from '../assets/g-prepio-room.jpg'
import gDearData from '../assets/g-dear-data.jpg'
import prepioCard from '../assets/prepio.jpg'
import studdyHero from '../assets/studdy-hero.jpg'
import studdyLoop from '../assets/studdy-loop.jpg'
import studdySalon from '../assets/studdy-salon.jpg'
import studdyShop from '../assets/studdy-shop.jpg'
import studdyCard from '../assets/studdy-card.jpg'
import studdyTile from '../assets/studdy-tile.jpg'
import org01 from '../assets/org-01-upload.png'
import org02 from '../assets/org-02-imported.png'
import org03 from '../assets/org-03-expanded.png'
import org04 from '../assets/org-04-filtered.png'
import org06 from '../assets/org-06-detail.png'
import ytOverview from '../assets/yt-overview.png'
import ytDrilldown from '../assets/yt-drilldown.png'
import ytShortVLong from '../assets/yt-shortvlong.png'
import ytBubbles from '../assets/yt-bubbles.png'
import ytShorter from '../assets/yt-shorter.png'

export type Category = 'product' | 'engineering' | 'ml' | 'all'

// ---------- sky ----------
export const SKY = {
  speed: 1.0,          // cloud drift multiplier
  maxFPS: 30,          // shader frame cap (the carousel stays at 60)
  renderScale: 0.45,   // internal resolution vs. CSS pixels
  mouseStrength: 0.5,  // 0 = static sky, 1 = full lean
}

// ---------- arc carousel ----------
export const ARC = {
  radius: 780,   // wheel size — bigger = flatter fan
  step: 14,      // degrees between cards — spacing control
  anchorY: 1165, // wheel center offset; shift to raise/lower the fan
  autoMs: 3000,  // auto-rotate cadence (0 = off)
}

// ---------- carousel cards (up to 10) ----------
export interface Card {
  id: string
  cats: Category[]
  title: string
  meta: string
  blurb: string          // shown in the hover reveal
  slug?: string          // links "Read the case study →" to /work/:slug
  page?: string          // internal page route (e.g. /impostor)
  demo?: { label: string; href: string }  // external site/demo/repo for the project
  href?: string          // external or #anchor target; used when there's no slug
  linkLabel?: string
  image?: string         // photographic card
  icon?: string          // small mark centered on a warm field (ISO app icon treatment)
  // clean brand-card thumbnail (the Onapsis treatment): a tinted field with a
  // centered mark image or a typeset wordmark. Takes precedence over image.
  logo?: {
    bg: string           // field color/gradient
    img?: string         // mark image, centered
    imgW?: string        // mark width (CSS), default 46%
    text?: string        // wordmark
    accent?: string      // trailing accent glyph in ember
    color?: string       // wordmark color
    serif?: boolean      // Sentient italic wordmark
    play?: boolean       // red play badge (the video project)
  }
  art?: 'org' | 'rl'     // remaining hand-drawn placeholder art
  usePortrait?: boolean  // reuse the About portrait
}

export const cards: Card[] = [
  {
    id: 'iso',
    cats: ['product'],
    title: 'ISO',
    meta: 'Product · 31 screens · 2026',
    blurb: 'A dating app that refuses inboxes. One live conversation at a time, or nothing. I wrote the PRD, built the design system, and shipped the working prototype.',
    slug: 'iso',
    demo: { label: 'Live demo', href: 'https://pjeon18.github.io/' },
    icon: isoIcon,
  },
  {
    id: 'studdy',
    logo: { bg: 'linear-gradient(165deg, #EAF1FB, #D8E6F6)', text: 'Studdy', color: '#2A3E5C' },
    cats: ['product', 'engineering'],
    title: 'Studdy',
    meta: 'Product · live multiplayer · 2026',
    blurb: 'A multiplayer study café. Real people, one shared 25/5 clock, and a room you furnish with focused minutes. Shipped with real auth, live presence, and a server-verified economy — then field-tested until it was honest.',
    slug: 'studdy',
    demo: { label: 'Open the café', href: 'https://pjeon18.github.io/studdy/' },
    image: studdyCard,
  },
  {
    id: 'prepio',
    logo: { bg: 'linear-gradient(165deg, #FBF9F4, #F3EFE6)', text: 'prep.io', serif: true, color: '#1C1A17' },
    cats: ['product', 'engineering'],
    title: 'Prep.io',
    meta: 'Product · live office hours · 2026',
    blurb: 'Office hours, live — Twitch for breaking into a career. Verified pros go live, the crowd lurks free, and anyone can raise a hand for the hot seat. I took it from PRD to a shipped prototype: the fair, the funnel, honest liveness.',
    slug: 'prep-io',
    demo: { label: 'Open the prototype', href: 'https://pjeon18.github.io/prep-io/' },
    image: prepioCard,
  },
  {
    id: 'pocket-tactics',
    logo: { bg: 'linear-gradient(165deg, #E9F3EB, #DCEDE1)', text: 'Pocket Tactics', color: '#1E3A2A' },
    cats: ['product', 'engineering'],
    title: 'Pocket Tactics',
    meta: 'Game · 60 units · Online rooms',
    blurb: 'A turn-based tactics game: draft a Mythical champion and a team, then assassinate the enemy champion on a living grid. Type synergies, seasonal fields, and private WebRTC rooms — a headless engine with no server.',
    href: 'https://pjeon18.github.io/pocket-tactics/',
    linkLabel: 'Play a match',
    demo: { label: 'GitHub', href: 'https://github.com/pjeon18/pocket-tactics' },
    image: pocketTactics,
  },
  {
    id: 'pokemaps',
    logo: { bg: 'linear-gradient(165deg, #F6F8EC, #EDF3DE)', img: pokemapsMark, imgW: '44%' },
    cats: ['product', 'engineering'],
    title: 'PokéMAPs',
    meta: 'Product · 373 locations · Live daily',
    blurb: 'Guess the Pokemon In-Game location from a series of clues!',
    href: 'https://pjeon18.github.io/pokemaps/',
    linkLabel: 'Play today\'s puzzle',
    demo: { label: 'GitHub', href: 'https://github.com/pjeon18/pokemaps' },
    image: pokemaps,
  },
  {
    id: 'org',
    cats: ['engineering'],
    title: 'Org Chart Explorer',
    meta: 'Engineering · AWS · 699 employees',
    blurb: 'Upload an org spreadsheet, get an explorable reporting tree. Runs entirely in the browser, so personnel data never touches a server.',
    slug: 'org-chart-explorer',
    demo: { label: 'GitHub', href: 'https://github.com/pjeon18/orgcharexplorer' },
    art: 'org',
  },
  {
    id: 'f1',
    logo: { bg: 'linear-gradient(165deg, #1B1C22, #2A1210)', text: 'Undercut?', color: '#FDFDFB' },
    cats: ['ml'],
    title: 'Undercut, or stay out?',
    meta: 'AI / ML · 761 attempts · 0.71 AUC-ROC',
    blurb: 'Should you pit now? We built the dataset ourselves, 761 undercut attempts across eleven seasons, and found that the gap to your rival barely predicts anything. The circuit does.',
    slug: 'f1-undercut',
    demo: { label: 'GitHub', href: 'https://github.com/evanjiang943/cs1090a' },
    image: f1,
  },
  {
    id: 'rl',
    cats: ['ml'],
    title: 'Reinforcement learning by hand',
    meta: 'AI / ML · CS182',
    blurb: 'Value functions derived on paper, then policy iteration in NumPy on a three-state MDP. Change the discount factor and the optimal policy reverses.',
    slug: 'rl-agents',
    art: 'rl',
  },
  {
    id: 'media',
    logo: { bg: 'linear-gradient(165deg, #FFF6F4, #FDEAE6)', play: true },
    cats: ['engineering', 'ml'],
    title: 'Are videos getting shorter?',
    meta: 'Data viz · 62k videos · d3',
    blurb: 'A scrolling data story on 62,000 videos we collected ourselves. On seven major media channels, Shorts were half the uploads and three quarters of the views.',
    slug: 'media-analytics',
    demo: { label: 'Live visualization', href: 'https://xiaoman21.github.io/CS171/' },
    image: mediaGlobe,
  },

  {
    id: 'now',
    cats: ['product', 'engineering'],
    title: 'Currently: Onapsis',
    meta: 'AI GTM Intern · Boston, MA',
    blurb: 'Enriching 13,000 contacts into qualified pipeline for the BDR team, with agents doing the grunt work.',
    slug: 'onapsis-gtm',
    demo: { label: 'GitHub', href: 'https://github.com/pjeon18/orgcharexplorer' },
    image: onapsis,
  },
  {
    id: 'impostor',
    logo: { bg: 'linear-gradient(165deg, #F7F5EF, #EFEBE1)', text: 'impostor', accent: '.', color: '#121110' },
    cats: ['all'],
    title: 'Play Impostor',
    meta: 'Party game · 3–12 players · pass-and-play',
    blurb: "Everyone gets the secret word. One of you doesn't. Good luck.",
    page: '/impostor',
    linkLabel: 'Play',
    image: gImpostor,
  },
]

// ---------- about ----------
export const about = {
  kicker: 'About Me',
  heading: 'I love designs that feel special.',
  portraitFront,
  portraitBack,
  caption: 'usually designing, sometimes snacking',
  stats: "Harvard CS '27 · Visual Studies · Cambridge, MA",
  email: 'pauljeon@college.harvard.edu',
  paragraphs: [
    "I'm a rising senior at Harvard studying computer science with a secondary in Visual Studies. My favorite projects have been a dating app that fosters real connection, an organization reporting chart run on AWS for the sales team, and GTM automation that enriched leads across 13,000 contacts for the BDR team.",
    'Before that, I ran procurement and special projects at <b>The Harvard Shop</b> — working with real inventory ($1.3M), finding creative ways to maintain a 60% profit margin, meeting real vendors, and working closely with the e-commerce, stores, and stock team. In my free time, I love painting, listening to music, playing old Pokemon games on the Gameboy and watching 2018 Prime James Harden highlights.',
  ],
}

// ---------- playground masonry ----------
export interface Tile {
  id: string
  height: number
  title: string
  sub?: string
  expand?: string        // presence enables "Read more →" inline expansion
  link?: { label: string; href: string }  // external link shown in the expansion
  image?: string
  gradient?: string   // CSS gradient filler while real art is pending
  to?: string          // internal route — clicking the tile navigates there
  art?: 'iso-brand' | 'wireframes' | 'clouds' | 'telemetry' | 'impostor' | 'deck' | 'type'
}

export const tiles: Tile[] = [
  {
    id: 'human-inventory', height: 655, image: posterHumanInventory,
    title: 'The Human Inventory',
    sub: 'A film-series pamphlet & poster. Tap to hold it.',
    to: '/human-inventory',
  },
  {
    id: 'iso-motion', height: 330, image: isoSplash,
    title: 'ISO motion system',
    sub: 'Thirty-one screens of choreography.',
    expand: 'The full choreography: <b>color waves</b> at five threshold moments, spring-based tab swipes, a sealed simultaneous reveal, and a reply timer that breathes. Built as a tokenized motion system — named springs, durations, easings — so every screen moves with one accent.',
  },
  {
    id: 'shop', height: 320, image: harvardShop,
    title: 'The Harvard Shop',
    sub: 'Procurement and project management, with real money on the line.',
    expand: 'Procurement and project management across storefronts — vendor negotiation, PO pipelines, and creative ways to hold a <b>65% profit margin</b>, working closely with the e-commerce, stores, and stock teams.',
    link: { label: 'theharvardshop.com ↗', href: 'https://www.theharvardshop.com/' },
  },
  { id: 'yt-viz', height: 340, image: gYtViz, title: 'The YouTube visualization' },
  { id: 'studdy-room', height: 400, image: studdyTile, title: 'Studdy — a study spot that never closes', sub: 'A café you furnish with focused minutes', to: '/work/studdy' },
  { id: 'impostor-game', height: 250, image: gImpostor, title: 'The Impostor game' },
  {
    id: 'liveroom', height: 380, image: gPrepioRoom,
    title: 'The live room',
    sub: 'Prep.io — office hours, live. Raise a hand for the hot seat.',
  },
  {
    id: 'dear-data-qr', height: 340, image: gDearData,
    title: '扫一扫 — a Dear Data postcard',
    sub: 'A month of QR-code life, extruded into a QR code that still scans.',
    expand: 'Twenty-nine days in Shenzhen, tallied hourly: payments, train gates, menus, logins, doors. Each dark module of a <b>real QR code</b> holds one hour, raised to that hour’s count — seen from above, the record becomes the thing it measures. Point a camera at it and it resolves.',
    link: { label: 'Open the sculpture ↗', href: 'https://pjeon18.github.io/dear-data-qr/' },
  },
  { id: 'pokemaps-tile', height: 290, image: gPokemaps, title: 'PokéMAPs' },
]

// ---------- footer ----------
export const footer = {
  kicker: 'Want to Learn More?',
  email: 'pauljeon@college.harvard.edu',
  links: [
    { label: 'Résumé', href: 'https://pjeon18.github.io/pauljeon/Paul_Jeon-Resume.pdf' },
    { label: 'GitHub', href: 'https://github.com/pjeon18' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paul-j-jeon' },
    { label: 'ISO prototype', href: 'https://pjeon18.github.io/iso-prototype/' },
  ],
  fine: '© 2026 Paul Jeon. Designed and built by hand.',
}

// ---------- the box (homepage) ----------
// Folders hang front-to-back in the order below; the first entry is the
// front-most file. `tab` is the short label that fits on the plastic tab.
export interface Folder {
  id: string
  tab: string
  kind: 'project' | 'about' | 'resume'
  card?: Card
}

const TAB_LABELS: Record<string, string> = {
  about: 'About Me',
  iso: 'ISO',
  prepio: 'Prep.io',
  'pocket-tactics': 'Pocket Tactics',
  pokemaps: 'PokéMAPs',
  org: 'Org Chart',
  f1: 'F1 Undercut',
  rl: 'RL Agents',
  media: 'YouTube Data',
  now: 'Onapsis',
  impostor: 'Impostor',
}

export const folders: Folder[] = [
  { id: 'about', tab: TAB_LABELS.about, kind: 'about' },
  ...cards.map((c) => ({
    id: c.id,
    tab: TAB_LABELS[c.id] ?? c.title,
    kind: 'project' as const,
    card: c,
  })),
  { id: 'resume', tab: 'Résumé', kind: 'resume' },
]

// ---------- case studies (/work/:slug) ----------
export interface CaseSection {
  heading: string
  body: string // HTML: <b>, <em>, <p> allowed
  image?: string
  imageCaption?: string
}

export interface CaseStudy {
  slug: string
  kicker: string
  title: string
  lead: string
  role: string
  stack: string
  links?: { label: string; href: string }[]
  image?: string
  icon?: string
  art?: 'org' | 'rl'
  stats: { value: string; label: string }[]
  sections: CaseSection[]
}

export const caseOrder = ['iso', 'studdy', 'prep-io', 'org-chart-explorer', 'onapsis-gtm', 'f1-undercut', 'rl-agents', 'media-analytics']

export const caseStudies: Record<string, CaseStudy> = {
  iso: {
    slug: 'iso',
    kicker: 'Product Case Study · 2026',
    title: 'ISO. One conversation at a time.',
    lead: 'A dating app whose entire premise is a refusal: no inbox, no roster, no feed. You queue, you meet one present person in a live room, and the conversation either becomes mutual or ends cleanly. I took it from PRD to a shipped, fully interactive prototype.',
    role: 'Product · design · engineering — solo',
    stack: 'React · TypeScript · Vite · Zustand · Framer Motion · WebGL-free, mocks only',
    links: [
      { label: 'Open the live prototype', href: 'https://pjeon18.github.io/iso-prototype/' },
      { label: 'Guided demo (auto-tour)', href: 'https://pjeon18.github.io/iso-demo/?tour' },
      { label: 'Design document', href: 'https://pjeon18.github.io/iso-prototype/design-doc.html' },
    ],
    icon: isoIcon,
    stats: [
      { value: '31', label: 'screens shipped' },
      { value: '1', label: 'conversation at a time — enforced in the store, not the UI' },
      { value: '3', label: 'tabs. Never an inbox.' },
    ],
    sections: [
      {
        heading: 'The premise',
        body: '<p>Dating apps optimize for parallel conversations, which quietly optimizes for none of them mattering. ISO (<em>Intimate Setting Online</em>) inverts that: you wait in a queue, get matched live with one present person, and talk in a room with a gentle reply timer. You only continue if <b>both</b> people opt in. Nothing rots in an inbox because there is no inbox.</p>',
      },
      {
        heading: 'Product decisions with a spine',
        body: '<p>The principles are enforced where they can\'t be faked. One-conversation-at-a-time lives in the state store — a user with an active chat literally cannot queue again; disabled buttons are just decoration on top. Conversations become mutual or end cleanly back to the queue (<b>no dead chats</b>). The app ranks experiences, never people. Revival ("Maybe We\'ll Meet Again") is blind, single-slot, and expires silently. Monetization touches convenience and expression only — nothing in the matchmaker ever reads a subscription flag.</p>',
      },
      {
        heading: 'Design & motion',
        body: '<p>Warm cream and amber with one confident orange; green reserved exclusively for <em>real, mutual, present</em>. The motion system follows a loud-thresholds, calm-baseline rule: color waves bloom from your tap at five threshold moments only, everything else stays quiet. A custom stroke icon set replaces emoji entirely. All motion runs through named tokens — springs, durations, easings — so 31 screens move like one product.</p>',
      },
      {
        heading: 'What shipped',
        body: '<p>A fully interactive prototype: the complete core loop (queue → live room → keep-talking → reflection), onboarding, revival, safety flows, and a subscription tier — with matchmaking simulated and an optional LLM-driven conversation partner behind a dev proxy. Plus the artifacts around it: a full PRD, a self-contained design document annotating every screen, and a narrated guided demo that drives the real store through the whole loop.</p>',
      },
    ],
  },

  studdy: {
    slug: 'studdy',
    kicker: 'Product Case Study · 2026',
    title: 'Studdy. A study spot that never closes.',
    lead: 'Everyone already studies with strangers — they just can\'t see each other. Studdy is a multiplayer study café that makes the company mutual: tiny pixel people, real humans inside them, one 25/5 clock shared by every room in the world. You earn only by focusing, spend only on expression, and keep each other company without saying a word.',
    role: 'Product · design · engineering — solo',
    stack: 'three.js voxel renderer · TypeScript · Supabase (auth, realtime presence, Postgres RLS) · installable PWA',
    links: [
      { label: 'Open the café', href: 'https://pjeon18.github.io/studdy/' },
      { label: 'GitHub repository', href: 'https://github.com/pjeon18/studdy' },
      { label: 'The economy doc', href: 'https://github.com/pjeon18/studdy/blob/main/docs/ECONOMY.md' },
    ],
    image: studdyHero,
    stats: [
      { value: '25/5', label: 'one sprint clock, shared by every café in the world' },
      { value: '1:1', label: 'one focused minute, one bean — there is no other way to earn' },
      { value: '2', label: 'field testers — every break they found shipped a fix the same day' },
    ],
    sections: [
      {
        heading: 'Everyone already studies with strangers',
        body: '<p>Watch how people actually study now: a "study with me" video of a stranger writing in silence, lofi radio with ten thousand listeners, a Discord voice channel where twenty people sit muted for three hours. Nobody talks. Nobody wants to talk. <b>The company is the product</b> — and every current version of it is one-way glass. The streamer doesn\'t know you exist; the muted channel is a black window.</p><p>That observation — from watching how my friends and I actually get work done, not from a survey — became the bet: keep the company, lose the glass, and never ask anyone to perform. In Studdy your presence is the whole contribution. A body in a chair, a napkin note saying what you\'re working on, headphones on when you\'d rather not be greeted. Not a productivity app with friends bolted on. A <em>place</em>.</p>',
      },
      {
        heading: 'One clock',
        body: '<p>Every café on Earth runs the same 25-minute sprint and the same 5-minute break, on one communal clock. Sit down anywhere, any hour, and you\'re mid-sprint with everyone else who\'s studying right now. Synchrony is what makes strangers feel like company — it\'s the quiet engine of the study-with-me format — so instead of shipping it as a feature, Studdy made it the physics of the world.</p><p>The clock also enforces the etiquette so moderation doesn\'t have to. Chat opens at breaks. Join mid-sprint and the room says <em>settle in quietly — chat opens at break ♪</em>. Even the lofi radio obeys: each café is a station whose track and position are computed from the wall clock, so two people in the same room always hear the same song at the same moment.</p>',
        image: studdyLoop,
        imageCaption: 'The loop: seated, on the clock, earning 2.2 beans a focused minute. The napkin is your status; headphones mean do-not-disturb.',
      },
      {
        heading: 'The line between honor and proof',
        body: '<p>Focused minutes are the only currency, and the first question anyone asks is: what stops me from cheating? The answer is a line I drew early and kept redrawing until it held. <b>Anything private runs on honor.</b> Your beans are yours; if you want to lie to a pixel cat, that\'s between you and the cat. <b>Anything other people see is witnessed.</b> Leaderboard XP and café ratings are granted by the server, which hears a heartbeat from your session about once a minute and will not credit time faster than a wall clock ticks. A devtools user can inflate their own save; they can never inflate their rank.</p><p>Week one of field testing proved the line mattered: a player closed her laptop mid-session and woke up rich. The fix wasn\'t a ban screen. The clock now only counts while the app is actually awake, and if you\'re gone half an hour the game stands you up gently — <em>you drifted off — we tucked your chair in ♪</em> — and pays you for what you actually did. Anti-cheat, written in the voice of a friend.</p>',
      },
      {
        heading: 'Retention that respects your worst day',
        body: '<p>Every retention mechanic passed one test before shipping: does it still respect the user on their worst day? Streaks <b>pause</b> when you miss a day — the count keeps, quietly — and only reset after two. There is no streak-loss modal, no guilt copy, no red number. Self-set goals are honor-system but claimable only the <em>next</em> day, which kills impulse-claiming without policing anyone. The "a friend is studying right now" banner is one tap to join and one tap to snooze for half an hour. The weekly recap renders as a postcard you might actually share, not a report card.</p>',
      },
      {
        heading: 'An economy priced in hours',
        body: '<p>One focused minute earns one bean, scaled gently by level. Every price in the game is set against that anchor and written down in a one-page economy doc: impulse buys cost minutes, statement furniture costs a session, the animated endgame pieces cost up to a week of steady study. <b>Sinks are expression, never power</b> — nothing purchasable earns faster or ranks higher, and identity is never priced: skin tones, hair, and the shape of your room are free forever.</p><p>Two decisions carried most of the weight. The first was a reversal: I shipped escalating prices for resizing your room, watched how it read — charging for something that had been free feels like bait-and-switch — and unshipped it, then wrote the principle down so it stays unshipped: structure is identity, and identity is never priced. The second was the endgame. The first player to finish everything — level 21, 1,800 beans banked, every goal cleared — told me she had nothing left to want. Bigger numbers would have been the lazy patch. What shipped instead was the atelier — a café cat that breathes and flicks its tail, a fireplace that lights the room — and a wardrobe of hats and name-tag charms that travel with you to every café. Things worth saving for because <em>other people see them</em>.</p>',
        image: studdyShop,
        imageCaption: 'The atelier tab: endgame pieces priced against the earn rate. The café cat costs about a week of steady sessions.',
      },
      {
        heading: 'Two users kept breaking it',
        body: '<p>Studdy\'s real QA team was two people studying in it daily, and they found what no spec would. Reloading a page left a ghost of you haunting the room for a minute (stale presence keys — fixed by deduplicating people by identity, not connection). A security migration I was proud of silently broke café publishing for everyone (Postgres column grants versus upsert semantics — the kind of bug where every layer works and the product doesn\'t). Two laptops ran hot because an idle café was rendering like an action game — now it requests the low-power GPU and drops to 30fps whenever your hands leave the keys.</p><p>Each fix shipped within the day. The economy doc, the trust line, the kindness rules — all of them got sharper because two honest users kept colliding with the product as built, not the product as imagined.</p>',
      },
      {
        heading: 'Open late',
        body: '<p>Studdy is live and installable, and it keeps growing the way a café would: wall décor to hang, five-seat study clubs with a shared clubhouse and a pooled treasury, a quiet report-and-block safety layer, an app you can put on a phone that holds the screen awake through a session. The roadmap is more of the same idea — window views, a room extension, seasonal pieces — because the idea hasn\'t changed since the first sketch: <b>time you actually spent, made visible in a place you actually like.</b></p>',
        image: studdySalon,
        imageCaption: 'The mirror: base identity — skin, hair, glasses — free forever. Hats and tag charms are priced in study-hours, and owned pieces lose their price tags.',
      },
    ],
  },

  'prep-io': {
    slug: 'prep-io',
    kicker: 'Product Case Study · 2026',
    title: 'Prep.io. Office hours, made live.',
    lead: 'A live-streaming platform shaped like a college club fair: verified professionals hold drop-in office hours, and you move from lurking in the crowd, to the hot seat, to a one-on-one. I took it from a one-page pitch to a deployed prototype — the product thinking, the design system, and the code.',
    role: 'Product · design · engineering — solo',
    stack: 'React · TypeScript · Vite · Zustand · Framer Motion · a simulated real-time crowd (scripted or LLM-driven)',
    links: [
      { label: 'Open the prototype', href: 'https://pjeon18.github.io/prep-io/' },
      { label: 'GitHub repository', href: 'https://github.com/pjeon18/prep-io' },
    ],
    image: prepioCard,
    stats: [
      { value: '2', label: 'full layouts — a Twitch-style desktop and a native-feeling mobile app — on one design system' },
      { value: '30+', label: 'screens: the fair, live rooms, search, explore, a premium tier, creator tools' },
      { value: '1', label: 'rule enforced in code: a paid boost buys attention, never a spot on stage' },
    ],
    sections: [
      {
        heading: 'The gap',
        body: '<p>Career advice online is stuck at two extremes. Recorded content is passive and unverifiable — anyone can claim to be a Goldman analyst. Booked 1:1 mentorship is real but doesn’t scale, and you have to already know what to ask. Nobody owns the format that actually works in person: <b>the professor’s office hours</b> — one expert, whoever shows up, everyone learning from everyone’s questions. Prep.io is that, online: live, drop-in, many-to-one.</p>',
      },
      {
        heading: 'The funnel',
        body: '<p>The whole product is one funnel, and every step is a mutual opt-in. You <b>lurk in the crowd</b> for free — no signup wall. You <b>raise a hand</b> with a written question. The host pulls you into the <b>hot seat</b>, where it’s answered in front of the room, so everyone learns from it. From there, the host can offer a private <b>breakout</b>. The consent gate lives in the state store, not the UI — which is what let me add paid "boosts" honestly: points can raise a question’s visibility to the host, but nothing can buy a spot on stage.</p>',
      },
      {
        heading: 'The design system',
        body: '<p>One token set drives two very different skins, and I built it that way on purpose. When the first look read as <em>too editorial</em>, I reskinned the entire product — from warm paper to a clean streaming UI — by changing tokens (color, type, spacing), not by touching individual screens. Later I added a full desktop layout the same way. Underneath: named motion presets so 30+ screens move as one product, a custom stroke icon set instead of emoji, strict semantic color (one accent; green reserved only for <b>verified</b>), and a "theater" scope that flips the live rooms dark without a single new component.</p>',
      },
      {
        heading: 'Honest liveness',
        body: '<p>The technical heart is a simulated crowd engine. Scripted personas — or LLM-driven ones behind a dev proxy — arrive, chat, and raise hands, so the viewer count and the room genuinely move. <b>Nothing is a hardcoded fake number.</b> A room that isn’t live is an archive, and it’s labeled as one. That honesty is a product value, and it’s enforced in the store: the count can only change through the simulation.</p>',
      },
      {
        heading: 'What shipped',
        body: '<p>A deployed, clickable prototype of the full surface: a browsable fair of live rooms, the raise-hand-to-hot-seat beat, company and people search, a goal-driven explore page, watch history, channel subscriptions with paid tiers, ticketed events (including a refundable <b>$1 "commitment"</b> that filters out no-shows), a points economy, video and shorts, and a premium tier with AI transcripts and playlist "mini-courses." Two breakpoints, one system, no backend.</p>',
      },
    ],
  },

  'org-chart-explorer': {
    slug: 'org-chart-explorer',
    kicker: 'Engineering Case Study · Onapsis · 2026',
    title: 'Org Chart Explorer: nothing leaves the browser.',
    lead: "A business development team was working reporting lines out of a 699-row org export, navigable only by scrolling and squinting. I built them a tool that turns any messy spreadsheet into a searchable reporting tree, with an architecture chosen so that personnel data never needs a security review: there is no server to send it to.",
    role: 'Design and engineering — solo, built for the BDR team I sat with and handed to IT',
    stack: 'React · JavaScript · Vite · SheetJS · PapaParse · Tailwind · S3 + CloudFront',
    links: [{ label: 'GitHub repository', href: 'https://github.com/pjeon18/orgcharexplorer' }],
    image: org02,
    stats: [
      { value: '699', label: 'rows in the real export it was built and validated against' },
      { value: '0', label: 'bytes transmitted — parsing, search and the tree all run in the tab' },
      { value: '190 kB', label: 'gzipped, the entire application' },
    ],
    sections: [
      {
        heading: 'The job to be done',
        body: "<p>A rep does not want an org chart. A rep wants <b>one person, in context, fast</b>: who owns this division, who do they report to, who is the right first call. That sentence became the guiding principle in the repo, and it has a sharp consequence for the design. The tree is scaffolding around a found person. It is not the product.</p><p>What existed before was a single exported chart of a 699-person organization. Every question required scrolling to the right region of a very large image and reading small text, which is slow on a good day and useless between calls.</p>",
        image: org01,
        imageCaption: 'The upload screen. The privacy promise is made to the user here, not buried in a policy: your file is read in your browser and never uploaded to a server.',
      },
      {
        heading: 'Privacy as the constraining requirement',
        body: "<p>The input is a complete personnel roster: every name, title, manager and division in a company. Uploading that anywhere creates a retention question, a vendor-review question and a breach surface, and it would need sign-off before a rep could use it once.</p><p>So the architecture removes the question instead of answering it. Files are read through the browser file API, parsed in the page, and held in memory. <b>No fetch, no storage, no analytics, no third-party calls at runtime.</b> Nothing to review, because nothing moves.</p><p>That choice has costs, and they were accepted deliberately. There is no persistence, so a reload loses the file. There is no server-side pagination, so all 699 rows are indexed in the tab on every keystroke, which is what forced the lazy-expansion design. And because the app cannot authenticate anyone, access control had to move entirely into infrastructure.</p>",
      },
      {
        heading: 'Making a messy export usable',
        body: "<p>Real exports are inconsistent, so the parser is built to bend. A <b>header aliasing</b> layer maps whatever the file calls a column onto eight canonical fields, so <em>Manager</em>, <em>Reports To</em> and <em>Supervisor</em> all land in the same place. For a multi-sheet workbook it picks the sheet with the most rows, so a legend tab never wins. Only a name column is strictly required. Everything else degrades rather than failing.</p><p>The part I would keep in any future version is the <b>import report</b>. Rather than silently doing its best, the app tells you what it just did: how many people loaded, how many manager links pointed at somebody who is not in the file, and how many duplicate names it found. Node identity is the row index rather than the name, so a duplicate cannot corrupt the tree structure. The reporting edge for a duplicate is still a guess, and the banner says so.</p>",
        image: org02,
        imageCaption: 'A 227-row synthetic file, deliberately dirty. One manager link points at somebody absent and one name appears twice, and the banner surfaces both instead of hiding them.',
      },
      {
        heading: 'Filtering that keeps the hierarchy',
        body: "<p>Filtering a tree normally forces a bad trade: you either get a flat list of matches with the structure gone, or the whole tree with nothing actually filtered. This does neither. Selecting a division shows the matches <b>plus every ancestor above them</b>, with those ancestors dimmed and labelled as context, so a filtered result still hangs off the real reporting line.</p><p>Facet counts are computed by evaluating every filter except the one being counted, which is what makes them true counts rather than decoration, so a rep never clicks into an empty result. Search stays deliberately separate and fuzzy, falling back to subsequence matching, because a rep half-remembers a name or heard a title once. The facets stay exact-match on purpose: silently merging two spellings of a division would hide a data-quality problem the rep should see.</p>",
        image: org04,
        imageCaption: 'One division selected. Faded rows are the manager chain, kept so the match has somewhere to hang, and the depth toolbar controls how much tree comes with it.',
      },
      {
        heading: 'The output is a sentence, not a screenshot',
        body: "<p>Selecting somebody opens a branch navigator: the full trail from the top down to them as clickable pills, their division, their level, how many people report to them directly and in total, and their siblings as a scrolling strip.</p><p>The trail has one behavior I am still pleased with. Walking back <em>up</em> the chain moves your position without truncating the trail, so the branch below stays remembered and renders as ahead of you. Exploring an org is an up-and-down motion, and losing your place on every click is exactly what made the static chart useless.</p><p>The two buttons at the bottom are the actual deliverable. <b>Copy intro path</b> yields the whole chain as a single line, which is what a rep pastes into an email to ask for a warm introduction. The tool's job finishes in another application.</p>",
        image: org06,
        imageCaption: 'The branch navigator. The trail, the sibling strip, the direct and total report counts, and the two copy actions that turn a lookup into a sendable sentence.',
      },
      {
        heading: 'Handing it to IT',
        body: "<p>This shipped to a team rather than to a portfolio, so the handoff artifact mattered as much as the app. It went out with a deployment runbook covering the recommended shape (a private bucket behind a CDN with origin access control, a certificate in the region the CDN requires, and explicit cache rules that treat hashed assets as immutable and the entry document as no-cache), a deploy IAM policy scoped to <b>four actions</b> and nothing else, a rollback procedure, and a browser-support and sizing note.</p><p>Two things in there I would do again. First, a written <b>security-advisory disposition table</b>, so their review was not surprised: the spreadsheet parser had a known high-severity advisory and ships in the browser, so it was moved off the frozen package registry build onto the vendor's current release, while a dev-server-only advisory was documented as accepted with the reason. Second, access control was raised as an open decision rather than assumed, because the app has no authentication of its own and the right answer depended on how broadly they wanted to roll it out.</p>",
        image: org03,
        imageCaption: 'Expanded two levels deep. The default is fully collapsed, because opening 699 rows at once is not a starting point anybody wants.',
      },
      {
        heading: 'What it does not do',
        body: "<p><b>It is JavaScript, not TypeScript.</b> The plan was always to type the domain model, and the roadmap names the right risk site: the function where arbitrary spreadsheet cells become application objects, which is where every shape assumption lives. It was deliberately deferred so the artifact could reach IT first, and the internship ended before the follow-up. I would rather say that than claim a migration that did not happen.</p><p>Other honest gaps: there is no routing, so nothing is deep-linkable and a reload loses your file. Three parsed fields are carried through the pipeline and never used, one of which means the copy-contact action has no email in it. Duplicate-name reporting edges resolve to whichever row came first, disclosed rather than solved. Fuzzy search has no relevance ranking, so very short queries match almost everything. The two copy buttons do not render below the small breakpoint. There is a latent cycle risk in the descendant walk that the real data never triggered. And there are no tests.</p>",
      },
    ],
  },

  'onapsis-gtm': {
    slug: 'onapsis-gtm',
    kicker: 'AI GTM · Onapsis · Summer 2026',
    title: 'Prospecting with agents, and knowing when not to trust them.',
    lead: "Onapsis sells SAP security to large enterprises, where the buying decision splits between the security org and the SAP team. The BDR team was prospecting into a 13,000-contact market with no structured way to rank it, so outreach was spread flat across every account. I built the pipeline that ranked it, and then the guardrail that made the ranking trustworthy.",
    role: 'AI GTM Intern — Boston, reporting into business development',
    stack: 'Google Apps Script · ZoomInfo API · Gemini API · Google Sheets',
    image: onapsis,
    stats: [
      { value: '13,000', label: 'contacts in the addressable market, unranked' },
      { value: '300+', label: 'scored, sales-ready leads delivered across 70+ target accounts' },
      { value: 'High/Med/Low', label: 'confidence on every score, because the model was confident and wrong on odd titles' },
    ],
    sections: [
      {
        heading: 'The problem was prioritization, not data',
        body: "<p>A 13,000-row contact list is not a pipeline. The team already had the rows. What they did not have was any structured way to say which accounts deserved a rep's morning, so effort landed evenly across accounts that were not evenly worth it.</p><p>This is harder than it sounds for this product specifically. Onapsis sits across two buying centers, so the ideal customer profile is not one job family: it spans security leadership and the SAP and IT side. The target personas were <b>CISO, CIO, VP Security and SAP Basis</b>, which is a list no keyword filter handles well.</p>",
      },
      {
        heading: 'The pipeline',
        body: "<p>A multi-step pipeline in Google Apps Script, sitting where the team already worked, calling the ZoomInfo API to search, enrich and consolidate security-leadership and SAP-technical contacts across target accounts. Output went to CRM-ready Sheets, so the deliverable was a ranked list a rep could act on that morning rather than a database somebody had to be taught.</p><p>On top of that sits a Gemini layer doing the part a filter cannot: <b>parsing unstructured job titles</b> and scoring each contact against the ideal customer profile. Titles are free text, and the interesting failures are all in the middle, where a title is technically senior but functionally irrelevant, or vice versa.</p>",
      },
      {
        heading: 'The guardrail is the actual contribution',
        body: "<p>The model was <b>confident and wrong</b> on unusual titles often enough to matter. A scoring system that is right most of the time and gives no indication of when it is guessing is worse than no scoring system, because a rep learns to distrust all of it after being burned twice.</p><p>So every score carries a confidence rating. High-confidence leads route straight to the BDR team. Low-confidence leads route to human review. The output tells you which of its own answers to trust.</p><p>That is the working philosophy I would bring to any AI-in-the-loop tool: <b>agents do retrieval and structuring at scale, humans keep the judgment, and the system says which is which.</b> The first automated batch produced 74 qualified contacts from 47 accounts, and by the end of the internship the cumulative figure was over 300 scored leads across more than 70 accounts, in production with the team.</p>",
      },
      {
        heading: 'What I would want to measure next',
        body: "<p>Being straight about the limits: <b>300 leads is an output count, not an outcome.</b> The things that would actually prove the pipeline worked are the things I did not have time to instrument: acceptance rate on routed leads, meetings booked per hundred, and precision against a hand-checked sample. There is also no measured baseline for the manual process it replaced, only the team's description of it.</p><p>If I picked this up again, the first work would be an eval set of a few hundred hand-labelled titles, so the confidence thresholds could be calibrated against something rather than chosen. The guardrail is the right idea, and right now its cut points are a judgment call.</p>",
      },
    ],
  },

  'f1-undercut': {
    slug: 'f1-undercut',
    kicker: 'Machine Learning · Harvard CS1090A · group project',
    title: 'Should we pit? Modeling the undercut.',
    lead: "The undercut is Formula 1's highest-stakes timing bet: pit before your rival, run fresh tires, and try to come out ahead. We asked whether a model could call it from race conditions. It can, weakly, and the interesting part is what the model reveals about where the advantage actually comes from.",
    role: 'Machine learning — a three-person course final project, and my work sat in the modeling and write-up rounds',
    stack: 'Python · pandas · scikit-learn · statsmodels · Ergast historical race data',
    links: [{ label: 'GitHub repository', href: 'https://github.com/evanjiang943/cs1090a' }],
    image: f1,
    stats: [
      { value: '761', label: 'undercut attempts extracted from eleven seasons' },
      { value: '10.1%', label: 'of them succeeded, which is the modeling problem in one number' },
      { value: '0.713', label: 'test AUC-ROC on the baseline, against 0.900 on train' },
    ],
    sections: [
      {
        heading: 'Building the dataset, because there is not one',
        body: "<p>No labelled undercut dataset exists, so the first job was defining the event. Working from historical lap timing and pit-stop tables across the hybrid era (2014 onward), we found every pit stop where a rival pitted within the next five laps, then labelled the attempt a success if the attacker came out ahead once both had stopped.</p><p>Two decisions did most of the work. First, a rolling three-lap pace average, <b>shifted so it never includes the lap being predicted</b>, which is the difference between a model and a leak. Second, a filter keeping only attempts where the gap was under two seconds, on the grounds that a five-second gap is not a strategic undercut. That filter moves the success rate from roughly 6% to 10.1% and leaves <b>761 attempts</b>, of which only 77 are successes.</p>",
      },
      {
        heading: 'A rare-event problem wearing a classification costume',
        body: "<p>With 77 positives, accuracy is a useless metric: predicting failure every time scores about 90%. The baseline was a class-weighted logistic regression over race-state features, deliberately interpretable, because on a pit wall a probability you can explain beats a black box you cannot.</p><p>It reaches <b>0.713 AUC-ROC on the test split against 0.900 on train</b>, which is visible overfitting and worth stating plainly. Four imbalance strategies were compared head to head. Moving the decision threshold to 0.47 gave the best F1 at 0.34, and random undersampling made everything worse. Precision peaked around 0.23, meaning <b>four in five predicted successes were wrong</b>. For a decision tool that matters more than the AUC does.</p>",
      },
      {
        heading: 'What the model actually learned',
        body: "<p>The finding that reframed the project: <b>every linear correlation with the outcome is under 0.15.</b> The gap to the rival, the pace differential, the attacker's tire age — all effectively uncorrelated on their own. The headline variable everyone would name first carries almost no linear signal.</p><p>What does carry signal is the circuit. Thirteen of the top fifteen baseline coefficients are circuit indicators, and the spread is large: some tracks convert undercuts at two and a half to three and a half times the 10.1% average. After circuit, the strongest non-track effect is <b>pit-lane execution</b>, the stop time itself. So the honest summary of the baseline is that it mostly learns which track it is at, and then how well the crew works.</p>",
      },
      {
        heading: 'The final model traded accuracy for structure',
        body: "<p>Circuit indicators dominating is a warning sign, not a result, because some circuits have only five to ten attempts and the model was fitting noise per track. The final version is a hierarchical logistic regression with <b>partially pooled circuit effects</b>, shrinking each track's estimate toward the global mean in proportion to how little data supports it.</p><p>It scores <b>0.683 AUC on fifteen features</b>, against 0.713 on roughly forty-eight. Slightly worse on the metric, substantially more trustworthy, and a two-thirds reduction in parameters. Choosing it was the right call and it is the version I would defend.</p>",
      },
      {
        heading: 'What I would fix',
        body: "<p><b>The split is random over attempts rather than grouped by race</b>, so two attempts from the same afternoon can land on opposite sides of it. Given how much of the signal is circuit and conditions, that is a genuine leakage path and it likely flatters the test number. Grouping by race is the first thing I would change.</p><p>Beyond that: no sensitivity analysis on either of the two judgment calls that define the dataset, the two-second gap and the five-lap window, both of which move the label distribution. Twenty positive examples in the test set is too few to be confident about any of these numbers. And there is no calibration curve, which for a tool meant to output a probability is the measurement that actually matters.</p>",
      },
    ],
  },

  'rl-agents': {
    slug: 'rl-agents',
    kicker: 'Machine Learning · Harvard CS182',
    title: 'Reinforcement learning, from the equation up.',
    lead: "Coursework where the point was doing the arithmetic yourself: deriving value functions by hand, implementing policy iteration on a small Markov decision process in NumPy, and watching the optimal policy flip when you change how much the agent cares about the future.",
    role: 'Coursework — Harvard CS182, individual problem sets',
    stack: 'Python · NumPy · PyTorch',
    art: 'rl',
    stats: [
      { value: '3', label: 'states, 2 actions, and a policy that reverses on one parameter' },
      { value: '46.92', label: 'optimal value of the good state at a 0.9 discount' },
      { value: '0', label: 'RL libraries in the tabular work — the updates are the exercise' },
    ],
    sections: [
      {
        heading: 'A tiny MDP with a real dilemma',
        body: "<p>The setup is deliberately small enough to solve by hand and still be interesting: three states (good standing, academic probation, expelled as terminal) and two actions (work, or watch YouTube). Working pays a little. YouTube pays four times as much immediately and raises your probability of sliding toward the absorbing state you can never leave.</p><p>I derived the closed-form value functions for both fixed policies before writing any code, which is the part that makes the rest legible. Always-YouTube has a clean geometric form. Always-work resolves to a simple expression in the discount factor. Comparing them symbolically tells you where the crossover has to be before a single iteration runs.</p>",
      },
      {
        heading: 'Policy iteration, written out',
        body: "<p>Implemented directly in NumPy: nested policy evaluation sweeping to a convergence threshold, then policy improvement taking the greedy action over Q-values, with the terminal state skipped rather than special-cased. The Bellman update is written as one line of arithmetic over the transition tensor, because typing it is the exercise.</p><p>At a 0.9 discount the optimal policy is <b>YouTube in good standing, work on probation</b>, with optimal values of about 46.92 and 42.03. That asymmetry is the whole lesson: when you are safe, the immediate payoff is worth taking, and when you are one bad outcome from an absorbing state, it is not. The agent is not risk-averse. It is doing arithmetic about how much future is left.</p>",
      },
      {
        heading: 'Then change one number',
        body: "<p>Drop the discount to 0.5 and the policy flips to YouTube in both states. Nothing about the rewards or the transitions changed. The agent simply weights the future less, so avoiding expulsion stops being worth the cost of working.</p><p>This is the most useful intuition I took from the course, and it generalizes well past gridworlds: <b>a lot of behavior that looks like a preference is actually a discount rate.</b> An agent that appears reckless may just have a short horizon, and the fix is in the objective rather than the policy.</p>",
      },
      {
        heading: 'The neural network half',
        body: "<p>Separately, a convolutional classifier for FashionMNIST written as a module from scratch: three convolution blocks stepping 32, 64 and 128 channels, each with ReLU and max pooling, spatial dropout at 0.25 after the last block, then a 512-unit fully connected layer with dropout at 0.5 before the ten-way output. Adam at a 0.001 learning rate, cross-entropy, five epochs, batches of 64.</p><p>One detail I would keep: the training loop carries its own <b>time budget check</b> and returns early rather than being killed by the grader's five-minute limit. Writing the network myself means defining the architecture and the loop, not implementing backpropagation, and the assignment's own accuracy bar was 0.85.</p>",
      },
    ],
  },

  'media-analytics': {
    slug: 'media-analytics',
    kicker: 'Data Visualization · Harvard CS171 · 2026',
    title: 'Are videos getting shorter?',
    lead: "A scrolling data story about short-form video taking over media, built on about 62,000 videos we collected ourselves from the YouTube API. The finding that carried it: across seven major media channels, Shorts were half the uploads and three quarters of the views, and for four of the seven a single Short now out-earns a single long upload.",
    role: 'Data collection, pipeline and front-end — I wrote 74 of the project’s 102 commits on a three-person team',
    stack: 'Python · YouTube Data API v3 · d3.js v7 · React · Recharts',
    links: [
      { label: 'Open the story', href: 'https://xiaoman21.github.io/CS171/' },
      { label: 'GitHub repository', href: 'https://github.com/xiaoman21/CS171' },
    ],
    image: ytOverview,
    stats: [
      { value: '~62,500', label: 'videos collected across two channel sets and two years' },
      { value: '74%', label: 'of 2024 views on seven media channels came from Shorts, on 51% of uploads' },
      { value: '14', label: 'chapters in the story, driven by a scrubber built like a video player' },
    ],
    sections: [
      {
        heading: 'The question, and the eleven we did not pick',
        body: "<p>We started from eleven candidate questions: whether duration is falling, whether the share of very short videos is rising, whether engagement differs by format, whether views decay faster, whether there is a structural break after Shorts launched, and so on. Narrowing them was the actual design work, because each one implies a different dataset.</p><p>What we settled on is a question with a visible answer and a real tension underneath: <b>the balance between short and long form shows how platforms trade quick reach for lasting connection.</b> The data supports both halves of that, which is what made it worth building rather than just asserting.</p>",
      },
      {
        heading: 'Collecting it, and the classifier that made it honest',
        body: "<p>No existing dataset answers this, so the pipeline resolves each channel through the API, walks its entire uploads playlist, and pulls statistics and content details per video. Two channel sets: five of the largest global creators, and seven media brands, each across 2024 and 2025 to date. Roughly 62,500 video rows, plus derived per-video columns for engagement rates, upload timing and video age.</p><p>The piece I am most pleased with is the Shorts classifier, because the obvious version is wrong. A fixed duration cutoff misclassifies everything after YouTube <b>raised its own Shorts limit from 60 seconds to 3 minutes</b> in late 2024. So the threshold is <em>date-aware</em>: it applies 61 seconds before the policy change and 181 seconds after, with a hashtag check as a fallback. Classifying a decade of video against today's rule would have manufactured a trend that was really a definition change.</p>",
        image: ytShorter,
        imageCaption: 'The finding stated up front: average length trending down while upload counts climb. Two curves that only make sense together.',
      },
      {
        heading: 'What the numbers say',
        body: "<p>For the seven media channels in 2024: <b>13,833 uploads, 51% of them Shorts, and 7.01 billion views of which 74% came from Shorts.</b> Short-form was already claiming a disproportionate share of attention relative to its share of output.</p><p>The individual pivots are sharper than the aggregate. One national newspaper's channel went from Shorts being 14% of its uploads in 2024 to <b>93% in 2025 to date</b>. Two channels moved the other way, which matters, because it means this is a strategy choice rather than a tide.</p><p>The engagement split is the part that supports the thesis rather than just the headline: Shorts earn several times the likes per thousand views and roughly a ninth of the comments. <b>Reach without conversation</b>, measured rather than asserted.</p>",
        image: ytShortVLong,
        imageCaption: 'The multiplier on a log scale with a 1x reference line. Four of seven channels sit right of it, and the single outlier at 42.6x is why the median is reported alongside.',
      },
      {
        heading: 'Building the story',
        body: "<p>The story runs as fourteen chapters behind a scrubber built like a video player, with click-to-jump and a progress rail. Six substantive visualizations carry it, all hand-built in d3 rather than charted from a library: an orthographic globe you can drag and spin for regional short-video reach, a force-directed bubble chart where clicking a channel morphs its circle into a Shorts-versus-long donut, an animated multi-series line chart where channel avatars ride their own lines, an annotated single-creator chart with promo markers, and a scroll-triggered sequence that lights up each platform's name in the prose as its line draws.</p><p>A dashboard section built in React sits inside the story for the numbers that need comparison rather than narrative, including a scatter of upload share against view share with a reference line, so a channel above it is over-delivering on short-form relative to how much it posts.</p>",
        image: ytBubbles,
        imageCaption: 'Circle area is upload volume, and clicking a channel opens its format split. Real channel art, so a viewer recognizes who they are looking at.',
      },
      {
        heading: 'Where the argument is weaker than it looks',
        body: "<p>The story claims Shorts function like trailers, warming an audience so the next long upload lands bigger. That is operationalized as a flag for months where a channel posted both formats and the following month's views rose. It is <b>correlation, and it is presented more confidently on the page than the evidence supports</b>: no lag regression, no control, and obvious confounds in seasonality and news cycles. Naming it here is more useful than defending it.</p><p>Other honest limits. The multiplier finding is four of seven channels, not most, and one outlier at 42.6x drags any average. The engagement metric is a proxy, because the API exposes no share counts. API quota meant sampling periods rather than collecting the full population. Coverage has gaps: two channels are missing several months. And the shipped dashboard hardcodes 2024, so half of what we collected has no path to the screen, which is a real unfinished edge rather than a scoping decision.</p>",
        image: ytDrilldown,
        imageCaption: 'Per-channel drilldown. Monthly series for uploads and views by format, which is where the aggregate story either holds up per channel or does not.',
      },
    ],
  },
}
