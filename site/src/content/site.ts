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
import portraitBack from '../assets/portrait-back.jpg'

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
  blurb: string          // shown in the hover reveal (supports <b> via dangerouslySetInnerHTML-safe plain text)
  href?: string          // "Read more →" target; omit to show text only
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
    title: 'ISO — a dating app built around one conversation at a time',
    meta: 'Product · 31 screens · 2026',
    blurb: 'A dating app that refuses inboxes — one live conversation at a time, or nothing. PRD → design system → motion language → shipped interactive prototype.',
    href: 'https://pjeon18.github.io/iso-prototype/',
    linkLabel: 'Open the prototype',
    icon: isoIcon,
  },
  {
    id: 'org',
    cats: ['engineering'],
    title: 'Org Chart Explorer — org intelligence, fully in the browser',
    meta: 'Engineering · AWS · 699 employees',
    blurb: 'Spreadsheet → interactive reporting tree, fully client-side. React + TypeScript on S3 + CloudFront; personnel data never leaves the browser.',
    art: 'org',
  },
  {
    id: 'f1',
    cats: ['ml'],
    title: 'F1 Undercut Prediction — pit-wall strategy from live telemetry',
    meta: 'AI / ML · 0.71 AUC-ROC',
    blurb: 'Live race telemetry → pit-strategy calls. 761 hand-labeled undercut attempts; weighted logistic regression in a data-sparse, high-stakes setting.',
    image: f1,
  },
  {
    id: 'rl',
    cats: ['ml'],
    title: 'RL Agents from scratch — Q-learning, policy features, CNNs',
    meta: 'AI / ML · CS182',
    blurb: 'Bellman updates by hand, a scared-ghost hunter feature extractor (>70% win rate), CNNs to 80%+ on FashionMNIST.',
    art: 'rl',
  },
  {
    id: 'media',
    cats: ['engineering', 'ml'],
    title: "Media Analytics — how YouTube's formats are shifting",
    meta: 'Data · YouTube API · d3',
    blurb: 'Automated pipeline tracking content-format shifts (Shorts vs. long-form) across major channels, published as an interactive viz.',
    image: mediaGlobe,
  },
  {
    id: 'me',
    cats: ['all'],
    title: "Hi, it's me — the person pinning all of this up",
    meta: 'About · Cambridge, MA',
    blurb: 'CS + Visual Studies. I care about how software treats people — pace, honesty, restraint.',
    href: '#about',
    linkLabel: 'About me',
    usePortrait: true,
  },
  {
    id: 'now',
    cats: ['product', 'engineering'],
    title: 'Now — AI GTM Intern @ Onapsis, agentic prospecting',
    meta: 'Currently · Boston, MA',
    blurb: 'Agentic prospecting at Onapsis — GTM automation that enriched leads across 13,000 contacts for the BDR team.',
    image: onapsis,
  },
  {
    id: 'impostor',
    cats: ['all'],
    title: 'Play Impostor — a little game I made. No refunds.',
    meta: 'Off the clock',
    blurb: 'A social-deduction mini-game. Proof that not everything needs a North Star metric.',
  },
]

// ---------- about ----------
export const about = {
  kicker: 'About Me',
  heading: 'I love designs that feel special.',
  portraitFront,
  portraitBack,
  caption: 'usually building · occasionally inspecting pizza',
  stats: "Harvard CS '27 · Visual Studies · Cambridge, MA",
  email: 'pauljeon@college.harvard.edu',
  paragraphs: [
    "I'm a junior at Harvard studying computer science with a secondary in Visual Studies — the double lens behind <em>claircognizance</em>. I've shipped a dating app that values exclusivity and real connection (<b>ISO</b>), an organization reporting visualizer on AWS that never lets data leave the browser (<b>Org Chart Explorer</b>), and GTM automation that enriched leads across 13,000 contacts for the BDR team (<b>Onapsis</b>).",
    'Before that I ran procurement and projects at <b>The Harvard Shop</b> — real budgets, finding creative ways to maintain a 65% profit margin, real vendors, working closely with the e-commerce, stores, and stock team. In my free time, I love painting, listening to music, and watching 2018 Prime James Harden highlights.',
  ],
}

// ---------- playground masonry ----------
export interface Tile {
  id: string
  height: number
  title: string
  sub?: string
  expand?: string        // presence enables "Read more →" inline expansion
  image?: string
  art?: 'iso-brand' | 'wireframes' | 'clouds' | 'telemetry' | 'impostor' | 'deck' | 'type'
}

export const tiles: Tile[] = [
  {
    id: 'iso-motion', height: 240, image: isoSplash,
    title: 'ISO motion system',
    sub: 'Thirty-one screens of choreography — waves, springs, sealed reveals.',
    expand: 'The full choreography: <b>color waves</b> at five threshold moments, spring-based tab swipes, a sealed simultaneous reveal, and a reply timer that breathes. Built as a tokenized motion system — named springs, durations, easings — so every screen moves with one accent.',
  },
  { id: 'brand', height: 180, art: 'iso-brand', title: 'Brand explorations' },
  {
    id: 'wireframes', height: 300, art: 'wireframes',
    title: 'Wireframe kit — 27 screens',
    sub: 'The lo-fi blueprint every ISO screen grew from.',
    expand: '<b>27 lo-fi screens</b> defining the product spine before any pixels: queue, live room, keep-talking, reflection, revival. The kit became the contract every hi-fi screen was checked against.',
  },
  { id: 'clouds', height: 200, art: 'clouds', title: 'Cloud shader studies' },
  {
    id: 'shop', height: 230, image: harvardShop,
    title: 'The Harvard Shop',
    sub: 'Procurement & project management — real budgets, real deadlines.',
    expand: 'Procurement and project management across storefronts — vendor negotiation, PO pipelines, and creative ways to hold a <b>65% profit margin</b>, working closely with the e-commerce, stores, and stock teams.',
  },
  { id: 'telemetry', height: 260, art: 'telemetry', title: 'Telemetry sketches' },
  { id: 'impostor-sprites', height: 190, art: 'impostor', title: 'Impostor sprites' },
  {
    id: 'film', height: 280, image: lighthouse,
    title: 'Film + photo',
    sub: 'Visual Studies work — the eye behind the interfaces.',
  },
  { id: 'deck', height: 170, art: 'deck', title: 'Deck design' },
  { id: 'type', height: 220, art: 'type', title: 'Type studies' },
]

// ---------- footer ----------
export const footer = {
  kicker: 'Want to Learn More?',
  email: 'pauljeon@college.harvard.edu',
  links: [
    { label: 'GitHub', href: 'https://github.com/pjeon18' },
    { label: 'ISO prototype', href: 'https://pjeon18.github.io/iso-prototype/' },
  ],
  fine: '© 2026 Paul Jeon — designed & built by hand. React · TypeScript · WebGL. No templates.',
}
