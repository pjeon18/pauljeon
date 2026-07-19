# pauljeon — personal portfolio

A gallery-white photo board floating above a live volumetric cloudscape.
Live at **https://pjeon18.github.io/pauljeon/**

## What's in it

- **The sky** — raymarched volumetric clouds in a WebGL fragment shader (no libraries).
  The palette follows the local clock: azure at midday, ember at sunset, blue-violet
  with twinkling stars at night. Mouse parallax, 30fps cap, adaptive resolution,
  graceful gradient fallback without WebGL. Pin a mode with `?sky=noon|sunset|night`.
- **Arc carousel** — project cards fanned on a wheel anchored below the fold.
  Click a side or any off-center card to rotate, drag to spin (snaps on release),
  ←/→ keys while in view, 3s auto-rotate that pauses on hover. Hover lifts a card
  and glides up a reveal panel. Edge cards dissolve by arc angle.
- **Cursor-glow headline** — always lit; a blurred glow copy behind a radial mask
  trails the pointer (the glow escapes the glyph box via an expanded-box mask).
- **About** — portrait card that flips on hover.
- **The playground** — masonry wall where every tile gets scribbled over with
  thick marker strokes on hover (one SVG path, `pathLength=1`, dash-offset draw),
  captions rise word-by-word, and "Read more" expands tiles in place.

## Updating content

Everything on the page renders from **`site/src/content/site.ts`** —
cards, tiles, bio, footer links, sky/carousel tuning. Add a project = add one
object. Images live in `site/src/assets/`.

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Deploy

Push to `main`. The GitHub Actions workflow builds with `BASE_PATH="/pauljeon/"`
and publishes `site/dist` to GitHub Pages.
