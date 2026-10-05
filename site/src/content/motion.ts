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
  { card: 'media', src: `${F}media.mp4`, loop: `${F}media-loop.mp4`, poster: `${F}media.jpg`, title: 'Are videos getting shorter?', sub: 'Our CS171 data story, cut on the beat.' },
  { card: 'prepio', src: `${F}prepio.mp4`, loop: `${F}prepio-loop.mp4`, poster: `${F}prepio.jpg`, title: 'Prep.io', sub: 'Career office hours, live.' },
]
/** the first film for a card drives its focused loop */
export const filmFor = (cardId: string) => films.find(f => f.card === cardId)
