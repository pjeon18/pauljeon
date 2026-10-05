// Springs as CSS easing. A damped spring's step response is sampled into a
// linear() curve, so ordinary transitions and keyframes get real spring motion
// (a quick rise and, at most, a small overshoot) without a JS animation loop.
// The curves are written onto :root once:
//   --sp-snap   fast, decisive, ~3% overshoot  (opens, slide-outs, zoom punches)
//   --sp-glide  slower, no visible overshoot   (camera moves, recedes)
//   --sp-pop    small things arriving, ~6%      (icons, badges, posters)

function stepResponse(zeta: number, omega: number, t: number) {
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta * omega / wd) * Math.sin(wd * t))
  }
  return 1 - Math.exp(-omega * t) * (1 + omega * t)
}

/** a linear() easing for a spring that settles within `dur` seconds */
export function springEasing(zeta: number, omega: number, dur: number, samples = 48) {
  const pts: string[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * dur
    pts.push((i === samples ? 1 : stepResponse(zeta, omega, t)).toFixed(4))
  }
  return `linear(${pts.join(', ')})`
}

export const SPRINGS = {
  snap: { css: springEasing(0.74, 14, 0.62), ms: 620 },
  glide: { css: springEasing(1, 9.5, 0.8), ms: 800 },
  pop: { css: springEasing(0.62, 17, 0.55), ms: 550 },
}

export function installSprings() {
  const root = document.documentElement.style
  root.setProperty('--sp-snap', SPRINGS.snap.css)
  root.setProperty('--sp-glide', SPRINGS.glide.css)
  root.setProperty('--sp-pop', SPRINGS.pop.css)
}
