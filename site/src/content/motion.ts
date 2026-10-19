// Motion-layer data, kept apart from site.ts: which cards can be used live on
// the page, and which have a product film.

/** live prototypes that open in the on-page stage (all allow framing) */
export const protos: Record<string, { url: string; host: string }> = {
  'the-dot': { url: 'https://pjeon18.github.io/dot-onboarding/', host: 'pjeon18.github.io/dot-onboarding' },
  studdy: { url: 'https://pjeon18.github.io/studdy/', host: 'pjeon18.github.io/studdy' },
  pokemaps: { url: 'https://pjeon18.github.io/pokemaps/', host: 'pjeon18.github.io/pokemaps' },
  'pocket-tactics': { url: 'https://pjeon18.github.io/pocket-tactics/', host: 'pjeon18.github.io/pocket-tactics' },
  prepio: { url: 'https://pjeon18.github.io/prep-io/', host: 'pjeon18.github.io/prep-io' },
  iso: { url: 'https://pjeon18.github.io/iso-prototype/', host: 'pjeon18.github.io/iso-prototype' },
  'iso-redesign': { url: `${import.meta.env.BASE_URL}iso-chromatic/index.html?mode=try`, host: 'pjeon18.github.io/pauljeon/iso-chromatic' },
  impostor: { url: `${import.meta.env.BASE_URL}impostor`, host: 'pjeon18.github.io/pauljeon/impostor' },
  media: { url: 'https://xiaoman21.github.io/CS171/', host: 'xiaoman21.github.io/CS171' },
  tracker: { url: 'https://pjeon18.github.io/tracker/', host: 'pjeon18.github.io/tracker' },
}

/** product films: a short muted loop for the focused card, the full cut for reels */
export interface Film {
  card: string          // card id it belongs to
  src: string           // full film, with sound
  loop: string          // ~8s muted loop shown on the focused card
  poster: string
  title: string
  sub: string
}
const F = `${import.meta.env.BASE_URL}films/`
export const films: Film[] = [
  { card: 'tracker', src: `${F}tracker.mp4`, loop: `${F}tracker-loop.mp4`, poster: `${F}tracker.jpg`, title: 'Tracker', sub: 'See where your sound goes.' },
  { card: 'tracker', src: `${F}tracker-desktop.mp4`, loop: `${F}tracker-desktop-loop.mp4`, poster: `${F}tracker-desktop.jpg`, title: 'Tracker, on the desktop', sub: 'The same menu, in context on a MacBook.' },
  { card: 'iso', src: `${F}iso-v1.mp4`, loop: `${F}iso-v1-loop.mp4`, poster: `${F}iso-v1.jpg`, title: 'ISO', sub: 'One conversation at a time.' },
  { card: 'iso', src: `${F}iso.mp4`, loop: `${F}iso-loop.mp4`, poster: `${F}iso.jpg`, title: 'ISO, redesigned', sub: 'The chromatic redesign, in progress.' },
  { card: 'iso-redesign', src: `${F}iso-features.mp4`, loop: `${F}iso-features-loop.mp4`, poster: `${F}iso-features.jpg`, title: 'ISO, every feature', sub: 'The redesign, filmed from inside the app.' },
  { card: 'iso-redesign', src: `${F}iso-hype.mp4`, loop: `${F}iso-hype-loop.mp4`, poster: `${F}iso-hype.jpg`, title: 'ISO in eighteen seconds', sub: 'The pitch, cut on the beat.' },
  { card: 'iso-redesign', src: `${F}iso-brand.mp4`, loop: `${F}iso-brand-loop.mp4`, poster: `${F}iso-brand.jpg`, title: 'ISO, the brand', sub: 'The mark builds itself.' },
  { card: 'pathways', src: `${F}pathways.mp4`, loop: `${F}pathways-loop.mp4`, poster: `${F}pathways.jpg`, title: 'Harvard Pathways', sub: 'The quiz, the reveal and the stamp card.' },
  { card: 'prepio', src: `${F}prepio.mp4`, loop: `${F}prepio-loop.mp4`, poster: `${F}prepio.jpg`, title: 'Prep.io', sub: 'Career office hours, live.' },
]
/** the first film for a card drives its focused loop */
export const filmFor = (cardId: string) => films.find(f => f.card === cardId)
