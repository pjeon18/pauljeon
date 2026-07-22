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
import lighthouse from '../assets/lighthouse.jpg'
import portraitFront from '../assets/portrait-front.jpg'
import pokemaps from '../assets/pokemaps.jpg'
import portraitBack from '../assets/portrait-back.jpg'
import gBrand from '../assets/g-brand-sheet.jpg'
import gWireframes from '../assets/g-wireframes.jpg'
import gYtViz from '../assets/g-yt-viz.jpg'
import gPokemaps from '../assets/g-pokemaps.jpg'
import gImpostor from '../assets/g-impostor.jpg'
import gSky from '../assets/g-sky.jpg'
import gLiveroom from '../assets/g-liveroom.jpg'

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
    id: 'pokemaps',
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
    cats: ['ml'],
    title: 'Undercut, or stay out?',
    meta: 'AI / ML · F1 telemetry · 0.71 AUC-ROC',
    blurb: 'Given live race telemetry, should you pit now? 761 hand-labeled undercut attempts and a weighted logistic regression that calls it at 0.71 AUC-ROC.',
    slug: 'f1-undercut',
    demo: { label: 'GitHub', href: 'https://github.com/evanjiang943/cs1090a' },
    image: f1,
  },
  {
    id: 'rl',
    cats: ['ml'],
    title: 'Teaching Pac-Man to hunt',
    meta: 'AI / ML · CS182',
    blurb: 'Q-learning written from the Bellman equation up. The ghost-hunting feature extractor wins more than 70% of its games.',
    slug: 'rl-agents',
    art: 'rl',
  },
  {
    id: 'media',
    cats: ['engineering', 'ml'],
    title: 'Where YouTube is going',
    meta: 'Data · YouTube API · d3',
    blurb: 'An automated pipeline watching major channels shift between Shorts and long-form, published as an interactive visualization.',
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
    cats: ['all'],
    title: 'Play Impostor',
    meta: 'Off the clock · No refunds',
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
  art?: 'iso-brand' | 'wireframes' | 'clouds' | 'telemetry' | 'impostor' | 'deck' | 'type'
}

export const tiles: Tile[] = [
  {
    id: 'iso-motion', height: 330, image: isoSplash,
    title: 'ISO motion system',
    sub: 'Thirty-one screens of choreography.',
    expand: 'The full choreography: <b>color waves</b> at five threshold moments, spring-based tab swipes, a sealed simultaneous reveal, and a reply timer that breathes. Built as a tokenized motion system — named springs, durations, easings — so every screen moves with one accent.',
  },
  { id: 'brand', height: 240, image: gBrand, title: 'Brand explorations' },
  {
    id: 'wireframes', height: 400, image: gWireframes,
    title: 'The wireframe kit',
    sub: 'The lo-fi blueprint every ISO screen grew from.',
    expand: '<b>27 lo-fi screens</b> defining the product spine before any pixels: queue, live room, keep-talking, reflection, revival. The kit became the contract every hi-fi screen was checked against.',
  },
  { id: 'clouds', height: 270, image: gSky, title: 'Cloud shader studies' },
  {
    id: 'shop', height: 320, image: harvardShop,
    title: 'The Harvard Shop',
    sub: 'Procurement and project management, with real money on the line.',
    expand: 'Procurement and project management across storefronts — vendor negotiation, PO pipelines, and creative ways to hold a <b>65% profit margin</b>, working closely with the e-commerce, stores, and stock teams.',
    link: { label: 'theharvardshop.com ↗', href: 'https://www.theharvardshop.com/' },
  },
  { id: 'yt-viz', height: 340, image: gYtViz, title: 'The YouTube visualization' },
  { id: 'impostor-game', height: 250, image: gImpostor, title: 'The Impostor game' },
  {
    id: 'film', height: 390, image: lighthouse,
    title: 'Film + photo',
    sub: 'Visual Studies work. The eye behind the interfaces.',
  },
  { id: 'liveroom', height: 380, image: gLiveroom, title: 'The live room' },
  { id: 'pokemaps-tile', height: 290, image: gPokemaps, title: 'PokéMAPs' },
]

// ---------- footer ----------
export const footer = {
  kicker: 'Want to Learn More?',
  email: 'pauljeon@college.harvard.edu',
  links: [
    { label: 'GitHub', href: 'https://github.com/pjeon18' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paul-j-jeon' },
    { label: 'ISO prototype', href: 'https://pjeon18.github.io/iso-prototype/' },
  ],
  fine: '© 2026 Paul Jeon. Designed and built by hand.',
}

// ---------- case studies (/work/:slug) ----------
export interface CaseSection {
  heading: string
  body: string // HTML: <b>, <em>, <p> allowed
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

export const caseOrder = ['iso', 'org-chart-explorer', 'onapsis-gtm', 'f1-undercut', 'rl-agents', 'media-analytics']

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

  'org-chart-explorer': {
    slug: 'org-chart-explorer',
    kicker: 'Engineering Case Study · AWS',
    title: 'Org Chart Explorer: nothing leaves the browser.',
    lead: "A BDR team needed to find the right contacts inside target organizations — fast — without scrolling a 699-employee static org tree. I built them a client-side web app that turns a raw spreadsheet into an interactive, searchable reporting hierarchy.",
    role: 'Design + engineering — solo, shipped to an internal team',
    stack: 'React · TypeScript · Vite · SheetJS · PapaParse · AWS S3 · CloudFront · ACM · IAM',
    links: [{ label: 'GitHub repository', href: 'https://github.com/pjeon18/orgcharexplorer' }],
    art: 'org',
    stats: [
      { value: '699', label: 'employees in the real dataset it was built and validated against' },
      { value: '100%', label: 'client-side — uploaded files are never transmitted or persisted' },
      { value: '0', label: 'backend services to run, patch, or trust' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: '<p>Business development reps work reporting lines: who owns a division, who reports to whom, who is the right first call. The source of truth was a giant exported org chart that could only be navigated by scrolling and squinting — slow, error-prone, and useless under time pressure.</p>',
      },
      {
        heading: 'Privacy by design',
        body: '<p>Personnel data is sensitive, so the architecture makes the safe thing the only thing: the entire pipeline — parsing, validation, tree building, search — runs in the browser. <b>Uploaded files are never transmitted or persisted anywhere.</b> That wasn\'t a nice-to-have; it was the requirement that shaped everything else.</p>',
      },
      {
        heading: 'The data pipeline',
        body: '<p>Reps import CSV/XLSX exports as-is. The pipeline (SheetJS + PapaParse) normalizes inconsistent column names through header aliasing, validates the schema, models people as <b>id-keyed nodes</b> so duplicate names can\'t collide, resolves manager links into derived reporting paths with root detection, and produces a human-readable import report so a rep knows exactly what loaded and what didn\'t.</p>',
      },
      {
        heading: 'The product',
        body: '<p>Faceted exact-match filtering, fuzzy search by name, title, or division, level-based lazy expansion so huge trees stay fast, and a branch-navigation panel that preserves hierarchy context while you traverse up and down the org. Find any person in seconds; understand their reporting line in one glance.</p>',
      },
      {
        heading: 'Shipping it properly',
        body: '<p>I converted the working prototype to TypeScript with a strongly-typed domain model (person, import report, tree node), which eliminated a whole class of data-shape bugs at the parsing boundary. Deployed as a static site on AWS — S3 behind CloudFront with HTTPS via ACM — and handed off with deployment runbooks and least-privilege IAM policies for the internal IT team.</p>',
      },
    ],
  },

  'onapsis-gtm': {
    slug: 'onapsis-gtm',
    kicker: 'AI GTM · Internship · Now',
    title: 'Onapsis: prospecting with agents.',
    lead: 'My current role: building LLM-assisted GTM automation at Onapsis. The flagship project enriched leads across a 13,000-contact TAM and surfaced the qualified handful worth a rep\'s time.',
    role: 'AI GTM Intern — Boston, MA',
    stack: 'Python · LLM agents · ZoomInfo enrichment',
    links: [{ label: 'Org Chart Explorer on GitHub', href: 'https://github.com/pjeon18/orgcharexplorer' }],
    image: onapsis,
    stats: [
      { value: '13,000', label: 'contacts in the raw TAM' },
      { value: '74', label: 'qualified leads surfaced for the BDR team' },
      { value: '1', label: 'script replacing hours of manual enrichment' },
    ],
    sections: [
      {
        heading: 'The TAM problem',
        body: '<p>A 13,000-row contact list is not a pipeline — it\'s a haystack. Manually enriching and qualifying it burns exactly the hours BDRs should spend talking to people.</p>',
      },
      {
        heading: 'Agentic enrichment',
        body: '<p>I built automation that enriches contacts through ZoomInfo and applies LLM-assisted scoring against the ideal customer profile, turning the haystack into a ranked, reasoned shortlist — <b>74 qualified leads</b> delivered to the team, each with the context to open a conversation.</p>',
      },
      {
        heading: 'Why it rhymes with the rest of this portfolio',
        body: '<p>Same conviction as Org Chart Explorer, different altitude: sales teams don\'t need more data, they need <em>clarity</em> — the right person, the right reason, right now.</p>',
      },
    ],
  },

  'f1-undercut': {
    slug: 'f1-undercut',
    kicker: 'Machine Learning · Motorsport',
    title: 'Should we pit? Modeling the undercut.',
    lead: 'The undercut is Formula 1\'s highest-stakes timing decision: pit first, gain track position on fresh tires — or lose it all. I trained a model to predict whether an undercut attempt will succeed, from live race telemetry.',
    role: 'ML — independent project',
    stack: 'Python · weighted logistic regression · race telemetry',
    links: [{ label: 'GitHub repository', href: 'https://github.com/evanjiang943/cs1090a' }],
    image: f1,
    stats: [
      { value: '761', label: 'undercut attempts hand-labeled from race data' },
      { value: '0.71', label: 'AUC-ROC on held-out races' },
      { value: '1 lap', label: 'the decision window the model has to matter in' },
    ],
    sections: [
      {
        heading: 'The call',
        body: '<p>An undercut succeeds or fails on tire delta, gap, traffic, and timing — variables a strategist juggles in seconds. The question: can a model read the same telemetry and call it?</p>',
      },
      {
        heading: 'The data',
        body: '<p>There is no labeled undercut dataset, so I built one: <b>761 hand-labeled undercut attempts</b> extracted from race telemetry. Data-sparse and class-imbalanced — every design choice flowed from that constraint.</p>',
      },
      {
        heading: 'The model',
        body: '<p>Weighted logistic regression over engineered race-state features, reaching <b>0.71 AUC-ROC</b>. Deliberately interpretable: on a pit wall, a probability you can explain beats a black box you can\'t — and with hundreds (not millions) of examples, simpler models are also the honest choice.</p>',
      },
    ],
  },

  'rl-agents': {
    slug: 'rl-agents',
    kicker: 'Machine Learning · CS182',
    title: 'RL agents, from the equation up.',
    lead: 'Reinforcement learning built from the equations up: Bellman updates by hand, feature engineering that turns a losing agent into a winning one, and convolutional networks trained from scratch.',
    role: 'ML — Harvard CS182 coursework',
    stack: 'Python · NumPy · CNNs',
    art: 'rl',
    stats: [
      { value: '>70%', label: 'Pacman win rate with the engineered feature extractor' },
      { value: '80%+', label: 'FashionMNIST accuracy with a from-scratch CNN' },
      { value: '0', label: 'RL libraries — the updates are the point' },
    ],
    sections: [
      {
        heading: 'From equations to agents',
        body: '<p>Value iteration and Q-learning implemented directly — writing the Bellman updates yourself is the difference between knowing the formula and knowing why an agent behaves the way it does.</p>',
      },
      {
        heading: 'Feature engineering wins games',
        body: '<p>Raw Q-learning flails in Pacman\'s state space. The fix was a <b>scared-ghost hunter</b> feature extractor — encoding distances to food, active threats, and edible ghosts — which lifted the agent past a <b>70% win rate</b>. The lesson generalizes: representation beats brute force.</p>',
      },
      {
        heading: 'Then the deep end',
        body: '<p>Convolutional networks trained from scratch to <b>80%+ on FashionMNIST</b> — closing the arc from tabular RL to learned representations.</p>',
      },
    ],
  },

  'media-analytics': {
    slug: 'media-analytics',
    kicker: 'Data · Visualization',
    title: 'Watching video formats shift.',
    lead: 'An automated pipeline tracking how major channels\' output is shifting between Shorts and long-form — collected via the YouTube Data API and published as an interactive visualization.',
    role: 'Data + visualization',
    stack: 'Python · YouTube Data API · d3.js',
    links: [{ label: 'Live visualization', href: 'https://xiaoman21.github.io/CS171/' }],
    image: mediaGlobe,
    stats: [
      { value: 'API', label: 'automated collection — no manual pulls' },
      { value: '2', label: 'formats in tension: Shorts vs. long-form' },
      { value: 'd3', label: 'interactive, explorable output — not a static chart' },
    ],
    sections: [
      {
        heading: 'The question',
        body: '<p>Every creator feels the pull toward short-form. Is it visible in the data? Across major channels, how is the actual mix of uploads shifting?</p>',
      },
      {
        heading: 'The pipeline',
        body: '<p>Automated collection through the YouTube Data API across major channels — upload metadata normalized into a dataset that can answer format-mix questions over time without a single manual export.</p>',
      },
      {
        heading: 'The visualization',
        body: '<p>Published as an interactive d3 visualization — explorable by channel and time rather than frozen into one chart, because the interesting answers are in the comparisons.</p>',
      },
    ],
  },
}
