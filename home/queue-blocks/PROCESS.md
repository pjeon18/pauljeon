# Queue Blocks: process, decisions and tradeoffs

A redesign of Spotify's queue for people whose listening changes through the day. Solo concept project, October 2026. The prototype is in `index.html` (watch mode, try mode, compare mode). The short case study is `case-study.html` and the demo film is `media/queue-blocks-demo.mp4`.

## 1. Problem

Spotify's queue is one list. Songs you queue sit in "Next in queue", ahead of whatever playlist or album you started from.

When your context changes (commute, then work, then gym), you have two options today:
- Clear the queue, which deletes the songs you hadn't heard.
- Keep adding on top, which buries what's left.

The common workaround is a throwaway playlist ("gym 3", "temp"). That turns a playlist, a permanent object, into a stand-in for a temporary queue.

**What isn't evidence yet:** how often people clear the queue, and how many temp playlists they keep. Both are assumptions until the survey in section 8 runs.

## 2. Who it's for

| | Context switcher (primary) | One-tap queuer (must not get worse) |
|---|---|---|
| Who | Listens across the day: commute, work, gym. Edits the queue weekly or more. Keeps temp playlists. | Taps "Add to queue" on a song now and then. Never manages the queue. |
| Wants | Go back to music they were in the middle of without rebuilding it | Add a song and have it play soon |
| Risk if we get it wrong | Too many verbs to learn | Being asked to "pick a block" every time they add a song |

Every decision below was checked against both columns.

## 3. The model

A **block** is a list of songs. It lives in the **Queue** (playing, then next in queue) or on the **Shelf** (held).
- A block shrinks as songs finish. Skips count too.
- Swapping a block out sends it to the shelf with whatever is left, in order.
- An album or playlist becomes a block in one tap.
- **Keep a copy** is offered on the last song, but only for blocks you built by hand.
- The queue remembers what played (**Played** and **Back**) and everything you queued in the last 24 hours.

## 4. How it got here

1. **Brief:** a block-based queue, with a gene-sequencing metaphor (blocks as codons) as the starting point. The metaphor was reduced to what it does for the user: units you assemble, take apart and use up.
2. **Four concepts, one model** (`concepts.html`):

   | Concept | What it was | Outcome |
   |---|---|---|
   | A. Rail & Shelf | The queue screen, with a shelf tray | **Chosen.** It lives where the queue already is and needs the fewest new ideas. |
   | B. Groups | Tab-group style list | Clear, but it hides the swap behind buttons |
   | C. Deck | Cards on Now Playing | Good glanceability, but it competes with the artwork |
   | D. Workbench | A sandbox in Your Library | The most expressive, and the furthest from where people queue |

3. **Thirteen design-review rounds.** Each is logged as issue → evidence → change in `DESIGN_LOG.md`.
4. **One PM critique pass**, which led to four refinements (section 6).
5. **Automated checks.** The full tour and touch gestures on an emulated iPhone (section 7).

## 5. Key decisions and their tradeoffs

| Decision | Why | Tradeoff accepted |
|---|---|---|
| Blocks live in the existing Queue screen, not a new tab | People already go to the queue to manage what plays next | Less room than a dedicated screen. The shelf is a tray, not a page. |
| "Rail" renamed to **Queue** | The designer's own term confused people. Spotify's vocabulary wins. | "Queue" now means the blocks in play, not every song you've ever queued |
| A gap opens where a dragged item will land | You can't predict a drop you can't see | More motion on screen. Kept snappy (~0.24s, slight overshoot). |
| Every drag has a tap path (menus, Move to…) | Drag alone is hard to discover and not accessible | Two ways to do the same thing |
| Touch: block headers and shelf cards drag after a 0.32s hold, song handles drag at once | A plain swipe has to keep scrolling the queue and the shelf | Blocks need a press-and-hold. Song handles stay instant because they are explicit grab targets. |
| Edge auto-scroll waits for a 0.25s rest | Passing through an edge lurched the list | Slightly slower to start scrolling on purpose |
| **Just add to queue** in the block picker | Protects the one-tap queuer | Creates a loose "Added songs" group that isn't a real block |
| Albums and playlists become blocks in one tap | Making blocks by hand was the biggest adoption barrier | Album-born blocks skip Keep a copy, since the original still exists |
| Action sheets are bento grids | Spotify's long lists make the main action as hard to find as the rarest one | Less room for labels. Rare actions get small tiles. |
| Played folds to one row | The queue's job is what's next, not history | History is one tap away instead of visible |
| "Last 24 hours" sits at the end of the shelf, plus a clock icon in the header | The shelf's first slots belong to blocks | The recovery list is less visible |
| Merge by dropping between songs | Combining two moods at an exact point came up in review | One more meaning for a drop, so the gap carries a label: "Merge N songs here" |

## 6. PM critique and refinements (this pass)

1. **Adoption cost.** Blocks only came from songs added one at a time. *Change:* Home albums open a bento with Play as a block / Add to shelf / Add to end.
2. **Vertical budget.** Played pushed Now playing down about 170px on every open. *Change:* Played folds to a single row.
3. **Shelf priority.** A recovery tool held the shelf's first slot. *Change:* it moved to the end. The clock icon stays.
4. **Interruptions.** "Keep a copy" appeared even when the original still exists. *Change:* only for hand-built blocks.
5. **Deliberately not added:** more verbs. Split, merge, duplicate and rename stay inside menus with no extra controls on screen.

**Prioritisation** (what would ship first):

| Must | Should | Could | Won't (v1) |
|---|---|---|---|
| Blocks, shelf, swap, shrink on play, block picker with Just add to queue, album → block | Insert gap, fold, Played + Back, Last 24 hours, Move to… | Split, merge, duplicate, rename, Keep a copy, shelf cleanup | Shuffle inside a block, Jam / shared queues, cross-device shelf sync, auto-generated blocks |

## 7. What was verified, and how

- **Full 19-step tour:** runs in headless Chromium (~140s) with no console errors. State was logged at every step.
- **Emulated iPhone 13, real touch events:**
  - Shelf swipe scrolls.
  - Queue swipe scrolls, whether it starts on a song or a header.
  - Press-and-hold swaps a block.
  - A song handle drag lands on an off-screen shelf block.
  - Tapping a song opens its menu.
  - Album → shelf works.
  - Played starts folded.
- **WebKit** renders the phone layout with no errors.
- **Not yet:** a physical phone, or anyone other than the designer. The review rounds are design critique, not usability testing.

## 8. How it would be measured (targets to test, not results)

- **North star:** listening sessions where a held block is resumed.
- **Problem signals, expected to fall:** queue clears per weekly active user, and new playlists deleted within 7 days (a proxy for temp playlists).
- **Adoption:** share of queue opens that touch the shelf, and albums turned into blocks.
- **Guardrails:** time from tapping "Add to queue" to done (must not rise for one-tap queuers), skip rate, and daily listening time.

**Next research:**
- A survey (n≈20–30) on queue clearing and temp playlists.
- Five moderated tests with the seven-task script in `DESIGN_LOG.md`. That includes "how is this different from a playlist?" after the swap task, which is the core-concept check.

## 9. Open questions

- Shuffle inside a block.
- What plays when the queue runs out (autoplay after the last block).
- How blocks behave in a shared Jam.
- Syncing the shelf across devices.
- Whether people grasp shelf vs playlist without being told.

## 10. Notes on the artifacts

- **Cover art:** comes from Apple's iTunes Search API and loads from Apple's CDN. Spotify's developer rules only allow Spotify-supplied artwork, so treat any public version with care.
- **Logo:** the Spotify icon appears only on the film's opening and end cards. It's unmodified, green on black (Spotify's primary colourway), and the subtitle says "A concept for the Spotify queue". The end card reads "A concept. Not affiliated with Spotify." The prototype itself has no logo.
- **Film** (`media/queue-blocks-demo.mp4`, ~45s, 1920×1080, silent) is built like the Pathways film:
  - `film2/clips.cjs` records the real interactions from the prototype as phone-screen clips (2×, all-intra so any frame can be sought).
  - `film2/index.html` is a pure function of time: `seek(t)` draws the iPhone frame, camera pushes, caption roll, colour irises, the album-art burst, the queue/shelf diagram and the opening/end cards.
  - `film2/render.mjs full` renders it at 120fps and blends 2:1 to 60fps for motion blur. `film2/render.mjs check t1 t2 …` writes review stills.
  - The earlier real-time recorder (`film/`) is kept for reference.
- **Screenshots** (`media/shots/`): captured by `film/shots.cjs` at 3× in the same iPhone frame, with transparent backgrounds.
