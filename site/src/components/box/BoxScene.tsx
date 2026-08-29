import type { RefObject } from 'react'
import Folders from './Folders'

// ============================================================================
// BoxScene — the CSS-3D cardboard box, hand-rolled (no libraries), following
// the Pamphlet.tsx precedent. Geometry constants live in box.css; this file
// only assembles the plane hierarchy:
//
//   .bx-world  (JS writes: translateZ dolly + rotateX elevation)
//     .bx-fit  (static CSS: framing nudge + mobile scale)
//       .bx-rig (JS writes: rotateY yaw)
//         shadow plane · box (5 outer faces, 4 inner walls, floor,
//         4 flap mounts) · hanging folders
//
// Safari discipline: no plane intersects another, coplanar pairs get ≥1px
// translateZ separation, and no preserve-3d ancestor ever carries opacity/
// overflow/filter — every fade happens on flat leaf overlays.
// ============================================================================

interface Props {
  worldRef: RefObject<HTMLDivElement>
  rigRef: RefObject<HTMLDivElement>
  open: boolean
  browsing: boolean
  focusedId: string | null
  registerTab: (id: string, el: HTMLButtonElement | null) => void
  onOpenFolder: (id: string) => void
}

export default function BoxScene({
  worldRef,
  rigRef,
  open,
  browsing,
  focusedId,
  registerTab,
  onOpenFolder,
}: Props) {
  return (
    <div className="bx-world" ref={worldRef}>
      <div className="bx-fit">
        <div className="bx-rig" ref={rigRef}>
          {/* ground: soft studio falloff + contact shadow, one plane */}
          <div className="bx-ground" aria-hidden="true" />

          {/* lift group: box + folders rise together on far-state hover —
              lifting the box alone leaves the sunken folder stack poking
              out underneath as a pixel sawtooth */}
          <div className="bx-lift">
          <div className="bx-box" aria-hidden="true">
            {/* outer walls */}
            <div className="bx-face bx-f-front">
              <div className="bx-tape-tail" />
              <div className="bx-label">
                <div className="bx-label-row"><span>From</span>Paul Jeon · Cambridge, MA 02138</div>
                <div className="bx-label-row"><span>To</span>You</div>
                <div className="bx-label-row"><span>Contents</span>Product · Engineering · ML</div>
                <div className="bx-label-foot">
                  <div className="bx-barcode" />
                  <div className="bx-label-qty">Qty 12</div>
                </div>
              </div>
              <div className="bx-sticker-b">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="bx-sox-top" d="M 7,50 A 43,43 0 0 1 93,50" />
                    {/* bottom arc runs left→right BELOW (sweep 0) so the glyphs sit
                        upright; baseline at r=48 keeps the text inside the red band */}
                    <path id="bx-sox-bot" d="M 2,50 A 48,48 0 0 0 98,50" />
                  </defs>
                  <circle cx="50" cy="50" r="49" fill="#FFFFFF" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#BD3039" strokeWidth="13" />
                  <text fill="#FFFFFF" fontSize="10.5" fontWeight="800" letterSpacing="2.4"
                    fontFamily="Inter, -apple-system, sans-serif" textAnchor="middle">
                    <textPath href="#bx-sox-top" startOffset="50%">BOSTON</textPath>
                  </text>
                  <text fill="#FFFFFF" fontSize="10.5" fontWeight="800" letterSpacing="2.4"
                    fontFamily="Inter, -apple-system, sans-serif" textAnchor="middle">
                    <textPath href="#bx-sox-bot" startOffset="50%">RED SOX</textPath>
                  </text>
                  {/* the real cap-B letterform (Wikimedia Commons, PD text logo) */}
                  <g transform="translate(17.5,17.5) scale(0.127)">
                    <path fill="#FFFFFF" d="m 386.27975,308.47329 c -4.21344,-12.33823 -5.65381,-36.06684 -29.33688,-52.46951 23.68307,-16.41094 25.12344,-40.13128 29.33688,-52.46949 6.83343,-20.02425 11.37386,-32.30453 25.93467,-40.95494 -51.87347,-30.03223 -26.83283,-57.3369 -69.83239,-100.328204 -37.14711,-37.13882 -95.51874,-40.081614 -136.01839,-8.828385 -11.56338,-13.03621 -28.16075,-20.489502 -45.58642,-20.47126 -33.6828,0 -60.991592,27.312947 -60.991592,60.991602 0,7.288697 1.278932,14.279387 3.613302,20.760987 5.81936,-12.04849 17.37945,-20.27259 30.69446,-20.27259 19.13851,0 34.6596,16.98213 34.6596,37.94178 v 69.36056 c 0,7.28042 -2.43786,39.59322 -43.99708,54.26994 41.55922,14.66845 43.99708,46.98952 43.99708,54.27822 v 69.36058 c 0,20.9431 -15.52109,37.9335 -34.6596,37.9335 -13.31501,0 -24.8751,-8.21582 -30.69446,-20.26433 -2.39962,6.65259 -3.622315,13.67227 -3.613302,20.74443 0,33.69107 27.312922,60.99161 60.991592,60.99161 18.12447,0 34.41125,-7.90954 45.58642,-20.46298 40.49551,31.24495 98.87128,28.29803 136.01839,-8.82839 42.99956,-42.99129 17.95892,-70.30424 69.83239,-100.33648 -14.56081,-8.64213 -19.10124,-20.93069 -25.93467,-40.94665 z" />
                    <path fill="#BD3039" d="m 370.72556,303.70171 c -2.40473,-9.5113 -11.92431,-34.54368 -32.45351,-47.70142 20.5292,-13.15772 30.04878,-38.19839 32.45351,-47.70142 0.8278,-3.25735 1.61006,-6.32432 2.58686,-9.19675 4.49489,-13.17429 8.59246,-25.14828 16.56823,-35.07348 -19.80076,-15.67008 -25.22277,-31.54296 -30.47923,-46.9647 -4.89227,-14.37044 -9.52788,-27.942062 -26.71696,-45.122854 -34.92447,-34.92448 -92.86568,-33.769713 -127.79015,1.158908 -7.49565,-16.278502 -25.05722,-26.452047 -44.11296,-26.452047 -23.09948,0 -42.38701,16.667563 -46.48455,38.587455 a 45.578144,45.578144 0 0 1 19.80073,-4.51146 c 26.66727,0 48.37193,23.157438 48.37193,51.641708 v 69.36056 c 0,12.05677 -4.61079,36.5097 -28.3725,54.26995 23.76171,17.76852 28.3725,42.2049 28.3725,54.27821 v 69.36058 c 0,28.47185 -21.70879,51.6417 -48.37193,51.6417 -7.04863,0 -13.76615,-1.61834 -19.80073,-4.52802 4.09754,21.94059 23.38093,38.59573 46.48455,38.59573 19.05574,0 36.61731,-10.16525 44.11296,-26.44376 34.92447,34.93275 92.86568,36.07926 127.79015,1.15476 17.18908,-17.18907 21.82469,-30.74413 26.71696,-45.12285 5.25646,-15.43001 10.67847,-31.28221 30.47923,-46.96468 -7.97577,-9.92523 -12.07334,-21.89922 -16.56823,-35.08178 -0.98093,-2.86 -1.75906,-5.93526 -2.58686,-9.18434 z m -46.43488,70.46983 c 0,26.93215 -24.74267,48.75684 -55.27158,48.75684 -21.14178,0 -39.51871,-10.47155 -48.80238,-25.84362 v -97.62131 c 9.28781,-15.3721 27.6606,-25.84363 48.80238,-25.84363 30.52891,0 55.27158,21.83297 55.27158,48.75685 0,9.52788 -3.08353,18.38937 -8.43934,25.90157 5.35581,7.50392 8.43934,16.37369 8.43934,25.8933 z m 0,-184.54762 c 0,26.92388 -24.74267,48.74858 -55.27158,48.74858 -21.14178,0 -39.51871,-10.46328 -48.80238,-25.83534 v -97.62961 c 9.28781,-15.37207 27.6606,-25.835339 48.80238,-25.835339 30.52891,0 55.27158,21.824689 55.27158,48.748579 0,9.51959 -3.08353,18.39764 -8.43934,25.90156 5.35581,7.50392 8.43934,16.38198 8.43934,25.90157 z" />
                    <path fill="#FFFFFF" d="m 310.59487,137.81842 c 0,-19.31235 -18.65838,-35.04037 -41.57577,-35.04037 -14.74294,0 -27.72685,6.50229 -35.10659,16.2785 v 89.33515 c 7.37974,9.7762 20.36365,16.26608 35.10659,16.26608 22.91739,0 41.57577,-15.70319 41.57577,-35.03209 0,-10.25633 -5.25646,-19.49447 -13.59645,-25.90157 8.33999,-6.41951 13.59645,-15.64524 13.59645,-25.9057 z m 0,184.55588 c 0,-19.3289 -18.65838,-35.04864 -41.57577,-35.04864 -14.74294,0 -27.72685,6.50229 -35.10659,16.28677 v 89.32688 c 7.37974,9.78448 20.36365,16.28264 35.10659,16.28264 22.91739,0 41.57577,-15.71974 41.57577,-35.04864 0,-10.24806 -5.25646,-19.48622 -13.59645,-25.8933 8.33999,-6.41953 13.59645,-15.64938 13.59645,-25.90571 z" />
                  </g>
                </svg>
              </div>
              <div className="bx-sticker">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="47" fill="#FFFFFF" />
                  <circle cx="50" cy="50" r="42.5" fill="#A51C30" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <text
                    x="50" y="60" textAnchor="middle" fill="#FFFFFF"
                    fontSize="33" fontWeight="700" fontFamily="Georgia, 'Times New Roman', serif"
                  >
                    H
                  </text>
                  <text
                    x="50" y="73.5" textAnchor="middle" fill="rgba(255,255,255,0.85)"
                    fontSize="6.6" fontWeight="600" letterSpacing="1.8"
                    fontFamily="Georgia, 'Times New Roman', serif"
                  >
                    VERITAS
                  </text>
                </svg>
              </div>
              <div className="bx-band">Portfolio</div>
              <div className="bx-shade bx-shade-front" />
            </div>
            <div className="bx-face bx-f-back">
              <div className="bx-tape-tail" />
              <div className="bx-recycle">
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path
                    d="M12 3.5 L15.4 9.2 L12.8 10.7 L11 7.6 L9.6 10 L7 8.6 Z M4.2 18.6 L2.6 12.9 L5.5 12.6 L6.3 15.6 L9 15.6 L9 18.6 Z M19.8 18.6 L14.6 18.6 L14.6 15.6 L17.6 15.6 L16.4 13 L19 11.6 L21.4 16.2 Z"
                    fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"
                  />
                </svg>
                <span>100% recycled pixels</span>
              </div>
              <div className="bx-shade bx-shade-back" />
            </div>
            {/* side faces stay plain kraft — any type here sits at a grazing
                angle and rasterizes into pixel dashes at the far distance */}
            <div className="bx-face bx-f-left">
              <div className="bx-shade bx-shade-left" />
            </div>
            <div className="bx-face bx-f-right">
              <div className="bx-shade bx-shade-right" />
            </div>
            <div className="bx-face bx-f-bottom" />

            {/* inner walls + floor (visible looking down into the open box) */}
            <div className="bx-inner bx-i-front" />
            <div className="bx-inner bx-i-back" />
            <div className="bx-inner bx-i-left"><div className="bx-rail" /></div>
            <div className="bx-inner bx-i-right"><div className="bx-rail" /></div>
            <div className="bx-inner bx-i-floor" />
            <div className="bx-deck" />
            {/* the tape-cut beat: a blade line slices along the seam before
                the taped flaps lift */}
            <div className="bx-cut" />

            {/* flaps — majors hinge on the side walls (tape seam runs
                front-to-back, like the reference); minors on front/back */}
            <div className="bx-flapmount bx-fm-left">
              <div className="bx-flap bx-flap-major"><div className="bx-tape-half" /><div className="bx-corrug" /></div>
            </div>
            <div className="bx-flapmount bx-fm-right">
              <div className="bx-flap bx-flap-major"><div className="bx-tape-half" /><div className="bx-corrug" /></div>
            </div>
            <div className="bx-flapmount bx-fm-back">
              <div className="bx-flap bx-flap-minor"><div className="bx-corrug" /></div>
            </div>
            <div className="bx-flapmount bx-fm-front">
              <div className="bx-flap bx-flap-minor">
                <div className="bx-corrug" />
                {/* the sharpie key lives on the flap's inner face — it hangs
                    toward the camera exactly when the box is open. Own
                    rotateY(180) layer so the writing isn't mirrored. */}
                <div className="bx-legend">
                  <div className="bx-legend-title">key:</div>
                  <div className="bx-legend-row"><span className="bx-legend-dot is-product" />product</div>
                  <div className="bx-legend-row"><span className="bx-legend-dot is-engineering" />engineering</div>
                  <div className="bx-legend-row"><span className="bx-legend-dot is-ml" />ml / data</div>
                </div>
              </div>
            </div>
          </div>

          <Folders
            hidden={!open}
            browsing={browsing}
            focusedId={focusedId}
            registerTab={registerTab}
            onOpen={onOpenFolder}
          />
          </div>
        </div>
      </div>
    </div>
  )
}
