# Queue Blocks: design review log and test plan

## What this log is

Every round below came from Paul walking through the running prototype, in October 2026. He's the designer, so these are **design-review findings (a self-test)**, not results from outside participants.

They are written in usability-finding form (issue → evidence → change) so they can sit next to real test results later. In the case study, call them "design review rounds". Only call something "usability testing" once the sessions in the plan below have actually run.

## Rounds

| # | Issue found | Evidence (what happened in the walkthrough) | Change made |
|---|---|---|---|
| 1 | Four concepts, one model: unclear which surface fits how people already use the queue | Compared A Rail & Shelf, B Groups, C Deck, D Workbench side by side (`concepts.html`) | Chose A. It lives where the queue already is and needs the fewest new gestures. |
| 2 | Placeholder art made it feel like a wireframe | The prototype didn't read as Spotify | Real covers from the iTunes Search API; player colour pulled from the cover |
| 2 | "Rail" was jargon | The designer himself stumbled on the term | Renamed to **Queue**, with sections Now playing and Next in queue. Shelf stays. |
| 2 | Blocks didn't read as lists of songs | Nothing showed you could hide a block's songs | Every block folds and unfolds from its header, including the playing one |
| 2 | Drops felt blind: unclear where a block would land | No feedback until after the drop | A gap opens where it will land; neighbours slide apart on a snappy spring. The ghost floats above the finger so the gap stays visible. |
| 2 | The value wasn't obvious without a baseline | You had to imagine today's queue | Compare mode: today's queue next to blocks over one day |
| 3 | Couldn't combine blocks at a precise point | Expected to drop a block between two songs | Dropping between songs merges the block in, with a "Merge N songs here" gap |
| 4 | No way back, and the queue forgot | Expected Back to work, and to find songs queued earlier | Played history above Now playing; Back restarts or returns the last song (rebuilding a used-up block); rolling list of songs queued in the last 24 hours |
| 5 | Adding songs was a dump of lists | Wanted a short, relevant list, then search | Search, then Recommended (block mood), then Frequently queued. Outside a block it asks: a block, or **Just add to queue**. |
| 6 | Long action lists are hard to use (a Spotify-wide problem) | Play now, Add to queue, and the rest all read as one undifferentiated list | Bento grids with related actions grouped and the likely action as the big tile (block menu, song menu, block picker) |
| 7 | Search was buried under the lists | Expected search first | Search field moved to the top of the add sheet |
| 8 | Shelf blocks past the fourth were unreachable while dragging | The row only scrolls by hand, and your hand is busy dragging | Holding near the shelf's edge scrolls it, with an arrow hint |
| 9 | You couldn't see how far into the song you were from the queue | Only the Now Playing screen had progress | A thin green meter on the playing song's row |

| 10 | Moving a song between blocks was drag-only (accessibility gap) | Found in the open-risks review | Tap a song: bento with **Move to…** (block grid + New block), Play next, Remove |
| 11 | On touch, shelf cards and block headers blocked scrolling | Code review, confirmed with emulated iPhone touch gestures | Headers and cards drag on a short press-and-hold; song handles drag at once; plain swipes scroll |
| 12 | Edge auto-scroll fired while just passing through an edge (queue lurched, shelf slid) | Emulated touch drags dropped in the wrong place | Edge scrolling waits for a ~0.25s rest in the edge strip |
| 13 | Toasts blocked taps on the songs underneath for 3 seconds | Emulated taps hit the toast | Only the toast's own buttons catch taps |

### Automated checks (2026-10-20)
Headless Chromium + Playwright; scripts are in the session scratchpad, not the repo.
- **Full 18-step tour:** completes in ~129s with no console errors, and each step's state was logged.
- **Emulated iPhone 13, real touch events through Chromium's DevTools protocol:** shelf swipe scrolls; queue swipe from a song or a header scrolls; press-and-hold a shelf card onto the playing block swaps it; a song handle dragged to an off-screen shelf card lands there; tapping a song opens its menu.
- **WebKit (Safari engine):** renders the phone layout with no errors.
- **Not yet done:** a run on a physical phone.

## Open risks to test (not yet validated)

- **Shelf vs playlist.** Will people see why a block isn't just a playlist? The answer is that blocks are used up and keep their place, but that has to come across without explanation.
- **Too many new ideas at once.** Shelf, merge, split, Keep a copy, Played, Last 24 hours and cleanup. Some may not earn their place.
- **Drag discoverability.** Swap, insert and merge all start from a drag. Every one now has a menu equivalent, but people may never find the drags.
- **Accessibility.** Every drag has a tap path now. There's still no keyboard focus order or screen-reader labelling.
- **Not designed yet:** shuffle inside a block, what plays when the queue runs out (autoplay), Spotify Jam / shared queues, and syncing the shelf across devices.

## Usability test plan (5 participants, about 20 min each)

**Who:** people who edit their queue at least weekly (screener: "In the last week, did you clear or rearrange your queue, or make a temporary playlist?"). Mix of Spotify and Apple Music users.

**Setup:** `index.html` in **Try it** mode on a phone, or desktop at phone size. Don't show the tour first. Think-aloud.

**Tasks** (success = done without help):
1. You're on the train. Find what's playing next, then hide the commute songs you don't need to see. *(fold)*
2. You get to work. Switch to your Deep Work music without losing your place in the commute music. *(swap; does Commute keep 10 songs?)*
3. Line up the gym block for after work. *(insert with gap)*
4. Put the Sunday songs in the middle of Deep Work. *(merge between songs)*
5. You skipped a song by accident. Get it back. *(Back)*
6. Add Kendrick Lamar's "DNA." to your gym music. *(add sheet: search or recommended)*
7. Find a song you queued last night. *(Last 24 hours)*

**Measure:** task success, time on task, wrong first taps, and a one-line "how is this different from a playlist?" answer after task 2 (this tests the core concept). End with SUS or a 1–7 ease rating per task.

**Before the tests, back the problem with real data:** a short survey (n≈20–30) asking how often people clear their queue, how many "temp" or "gym 3" playlists they have, and what they lost the last time they cleared the queue. These numbers are the case study's opening.
