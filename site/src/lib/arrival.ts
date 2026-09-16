// A one-shot flag set by the arc just before it opens a case study through
// the shared-element transition. The case page reads it once on mount and
// staggers its masthead in after the hero has landed, instead of revealing
// everything the instant the route changes.
let pending = false
export const markArrival = () => { pending = true }
export const consumeArrival = () => { const p = pending; pending = false; return p }
