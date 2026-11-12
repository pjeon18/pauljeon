// Project chapter, Apple-style. A card opens into a full-screen film with a
// small label and a two-line headline. Scrolling settles the film into a
// rounded card, then the short facts, the stats, and the case study in
// two-part headings follow. A slim local nav sticks to the top.
(function () {
  const CASE = { 'queue-blocks': 'queue-blocks/case-study.html', 'iso-redesign': 'iso-redesign', pathways: 'harvard-pathways', 'the-dot': 'the-dot', studdy: 'studdy', prepio: 'prep-io', iso: 'iso', onapsis: 'onapsis-gtm', f1: 'f1-undercut', media: 'media-analytics' }
  // films scored with royalty-free tracks, each credited at the foot of the page
  const MOTIVATE = ['Motivate Me by Mixaund', 'https://mixaund.bandcamp.com', 'mixaund.bandcamp.com']
  const MUSIC = { 'event-countdowns': MOTIVATE, 'order-dial': MOTIVATE, 'core-zone': ['Journey Ahead (Loop) by Corporate Music Zone', 'https://corporate-music-zone.bandcamp.com', 'corporate-music-zone.bandcamp.com'] }
  const FILM = { 'core-zone': 'm/core-zone.mp4', 'order-dial': 'm/order-dial.mp4', 'event-countdowns': 'm/event-countdowns.mp4', 'queue-blocks': 'm/queue-blocks.mp4', 'iso-redesign': 'm/iso-features.mp4', pathways: 'm/pathways.mp4', tracker: 'm/tracker.mp4', prepio: 'm/prepio.mp4', iso: 'm/iso-v1.mp4', media: 'm/media.mp4' }
  const css = `
  #ch { position:fixed; inset:0; z-index:50; pointer-events:none; }
  #ch.on { pointer-events:auto; }
  #ch .bg { position:absolute; inset:0; background:#fff; opacity:0; transition:opacity .45s ease; }
  #ch.on .bg { opacity:1; }
  #ch .scroller { position:absolute; left:0; top:0; width:100%; will-change:transform; }
  /* every chapter: the project's tint, the headline at the top, the work presented below it */
  #ch .hero { position:fixed; overflow:hidden; background:var(--tint); z-index:3; will-change:left,top,width,height; }
  #ch .hero .pane { position:absolute; left:0; right:0; top:33%; bottom:7%; display:flex; align-items:center; justify-content:center; }
  #ch .hero .pane img, #ch .hero .pane video { max-height:100%; max-width:78%; border-radius:18px; box-shadow:0 40px 80px -40px rgba(0,0,0,.4); display:block; background:#fff; }
  #ch .hero .pane img.phone { border-radius:9%/4.2%; background:none; }
  #ch .hero .pane img.logo { max-width:22%; box-shadow:none; background:none; }
  #ch .shade { display:none; }
  #ch .over { position:absolute; left:0; right:0; top:9%; text-align:center; color:#1d1d1f; pointer-events:none; }
  #ch .over small { display:block; font:600 15px/1 Inter, sans-serif; margin-bottom:16px; color:var(--acc); }
  #ch .over h1 { margin:0 auto; max-width:1200px; font:700 clamp(34px, 4vw, 64px)/1.06 Inter, sans-serif; letter-spacing:-.035em; }
  #ch .over h1 span { color:#86868b; }
  #ch .ctrl { position:absolute; left:50%; bottom:2.2%; transform:translateX(-50%); display:flex; gap:8px; align-items:center; padding:6px; border-radius:99px; background:rgba(255,255,255,.6); -webkit-backdrop-filter:blur(20px) saturate(180%); backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,.7); box-shadow:0 10px 26px -14px rgba(0,0,0,.25); z-index:4; }
  #ch .ctrl button { all:unset; cursor:pointer; color:#1d1d1f; font:600 12px Inter, sans-serif; padding:7px 12px; border-radius:99px; background:rgba(0,0,0,.06); }
  #ch .ctrl .bar { width:120px; height:3px; border-radius:3px; background:rgba(0,0,0,.12); overflow:hidden; margin:0 6px; }
  #ch .ctrl .bar i { display:block; height:100%; width:0; background:var(--acc); }
  /* sticky local nav, Apple's */
  #ch .local { position:fixed; left:0; right:0; top:0; height:52px; z-index:6; display:flex; align-items:center; justify-content:space-between; padding:0 76px 0 3vw; background:rgba(255,255,255,.78); -webkit-backdrop-filter:blur(20px) saturate(180%); backdrop-filter:blur(20px) saturate(180%); border-bottom:1px solid rgba(0,0,0,.06); transform:translateY(-100%); transition:transform .45s cubic-bezier(.2,.8,.2,1); }
  #ch .local.show { transform:none; }
  #ch .local b { font:600 19px Inter, sans-serif; letter-spacing:-.02em; }
  #ch .local nav { display:flex; align-items:center; gap:22px; font:500 12.5px Inter, sans-serif; color:#333; }
  #ch .local nav span { cursor:pointer; }
  #ch .local nav a { color:#fff; background:var(--acc); padding:7px 14px; border-radius:99px; text-decoration:none; font-weight:600; }
  #ch .close { position:fixed; right:22px; top:16px; z-index:7; width:34px; height:34px; border-radius:50%; display:grid; place-items:center; cursor:pointer; color:#fff; background:rgba(0,0,0,.35); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); font:500 18px/1 Inter; transition:background .3s, color .3s; }
  #ch .close.light { background:rgba(0,0,0,.06); color:#111; }
  #ch:not(.on) .close { display:none; }
  /* a screenshot hero: the headline sits above the work in dark type, not on top of it */
  #ch .hero.still .over { top:10%; color:#1d1d1f; }
  #ch .hero.still .over h1 { text-shadow:none; }
  #ch .hero.still .over small { color:var(--acc); }
  #ch .hero.still .pane { top:36%; align-items:flex-start; }
  #ch .hero.still .pane img { max-height:92%; }
  #ch .hero.still .shade { display:none; }
  /* the page under the film */
  #ch .body { position:absolute; left:0; right:0; padding:0 6vw 16vh; }
  #ch .facts { display:grid; grid-template-columns:1.6fr 1fr 1fr .5fr; gap:24px; font:500 13px/1.4 Inter, sans-serif; color:#86868b; }
  #ch .facts b { color:#1d1d1f; font-weight:600; }
  #ch .facts span:last-child { text-align:right; }
  #ch .lead { margin:7vh 0 0; max-width:980px; font:600 clamp(26px, 2.6vw, 40px)/1.18 Inter, sans-serif; letter-spacing:-.025em; color:#1d1d1f; }
  #ch .lead em { font-style:normal; color:var(--acc); }
  #ch .stats { display:grid; grid-template-columns:repeat(3, 1fr); gap:3vw; margin:12vh 0 0; }
  #ch .stats div { font:500 15px/1.45 Inter, sans-serif; color:#1d1d1f; }
  #ch .stats div b { display:block; font:700 clamp(54px, 6vw, 92px)/1 Inter, sans-serif; letter-spacing:-.05em; color:var(--acc); margin-bottom:12px; }
  #ch .meta2 { display:grid; grid-template-columns:repeat(3, 1fr); gap:3vw; margin-top:10vh; padding-top:18px; border-top:1px solid #e8e8ed; font:500 14px/1.55 Inter, sans-serif; color:#424245; }
  #ch .meta2 b { display:block; font:600 12px Inter, sans-serif; color:#86868b; margin-bottom:8px; }
  #ch .meta2 a { display:block; width:max-content; color:var(--acc); text-decoration:none; font-weight:600; margin-bottom:6px; }
  #ch .sec { margin-top:18vh; }
  #ch .sec h2 { margin:0; max-width:1100px; font:700 clamp(36px, 4.6vw, 72px)/1.04 Inter, sans-serif; letter-spacing:-.04em; color:#1d1d1f; }
  #ch .sec h2 em { font-style:normal; color:var(--acc); }
  #ch .sec .tx { margin-top:5vh; columns:2; column-gap:4vw; max-width:1100px; }
  #ch .sec .tx p { margin:0 0 1em; font:500 17px/1.55 Inter, sans-serif; color:#424245; break-inside:avoid; }
  #ch .panel { margin-top:7vh; background:var(--tint); border-radius:28px; display:flex; align-items:center; justify-content:center; gap:3vw; padding:8vh 5vw; overflow:hidden; }
  #ch .panel img { max-width:100%; max-height:74vh; border-radius:14px; display:block; box-shadow:0 30px 60px -40px rgba(0,0,0,.35); }
  #ch .panel.phones img { max-height:72vh; border-radius:28px; }
  #ch .panel + figcaption { font:500 13px/1.45 Inter, sans-serif; color:#86868b; margin-top:14px; max-width:620px; }
  /* the brief: about a minute of reading, one idea per line, then a choice */
  #ch .brief { max-width:880px; margin-top:6vh; }
  #ch .brief p { margin:0 0 1.1em; font:500 clamp(19px, 1.55vw, 24px)/1.5 Inter, sans-serif; letter-spacing:-.012em; color:#424245; }
  #ch .fork { display:grid; grid-template-columns:1fr 1fr; gap:2vw; margin-top:12vh; }
  #ch .fork .go { cursor:pointer; padding:5vh 3vw; border-radius:24px; background:#f5f5f7; transition:background .35s, transform .5s cubic-bezier(.2,.8,.2,1); }
  #ch .fork .go:hover { background:var(--tint); transform:translateY(-4px); }
  #ch .fork .go h3 { margin:0; font:700 clamp(28px, 3vw, 48px)/1.02 Inter, sans-serif; letter-spacing:-.04em; color:#1d1d1f; }
  #ch .fork .go h3 em { font-style:normal; color:#86868b; display:block; }
  #ch .fork .go:only-child { grid-column:1 / -1; }
  #ch .credit { margin:9vh 0 0; font:500 14px/1.7 Inter, sans-serif; color:#86868b; }
  #ch .credit a { color:inherit; text-decoration:underline; text-underline-offset:3px; }
  /* story: the logo big, then beats of two full-size sentences beside the Figma screens they describe */
  #ch .st-logo { margin-top:12vh; display:flex; align-items:center; justify-content:center; gap:4vw; padding:10vh 5vw; border-radius:28px; background:var(--tint); }
  #ch .st-logo img { width:min(34vw, 340px); height:auto; display:block; filter:drop-shadow(0 30px 50px rgba(43,75,255,.35)); }
  #ch .st-logo b { font:700 clamp(56px, 7vw, 120px)/1 Inter, sans-serif; letter-spacing:-.045em; color:#1d1d1f; }
  #ch .st-beat { margin-top:16vh; }
  #ch .st-beat p { max-width:900px; margin:0 0 .7em; font:600 clamp(26px, 2.4vw, 38px)/1.2 Inter, sans-serif; letter-spacing:-.025em; color:#1d1d1f; }
  #ch .st-beat p + p { font-weight:500; color:#1d1d1f; }
  #ch .st-shots { margin-top:6vh; display:flex; justify-content:center; gap:3vw; padding:7vh 4vw; border-radius:28px; background:var(--tint); }
  #ch .st-shots img { width:min(26vw, 270px); height:auto; display:block; border-radius:34px; box-shadow:0 0 0 1px rgba(0,0,0,.05), 0 30px 60px -30px rgba(20,30,90,.35); background:#fff; }
  #ch .st-wide { margin-top:6vh; display:grid; gap:4vh; }
  #ch .st-wide img { width:100%; height:auto; display:block; border-radius:24px; box-shadow:0 0 0 1px rgba(0,0,0,.05); }
  #ch .st-cap { margin:16vh 0 0; font:600 clamp(26px, 2.4vw, 38px)/1.2 Inter, sans-serif; letter-spacing:-.025em; color:#1d1d1f; }
  #ch .st-cap + .moments { margin-top:6vh; }
  @media (max-width:820px) {
    #ch .st-logo { flex-direction:column; gap:3vh; padding:7vh 6vw; }
    #ch .st-logo img { width:46vw; }
    #ch .st-shots { overflow-x:auto; justify-content:flex-start; gap:16px; padding:5vh 6vw; scroll-snap-type:x mandatory; }
    #ch .st-shots img { width:62vw; flex:none; scroll-snap-align:center; border-radius:28px; }
  }
  #ch .moments { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:9vh 3vw; margin-top:12vh; }
  #ch .moments figure { margin:0; display:grid; justify-items:center; gap:22px; }
  #ch .moments .mph { width:min(100%, 300px); aspect-ratio:422 / 876; box-sizing:border-box; padding:4.8%; border-radius:16.5% / 8%; background:#050505; box-shadow:0 0 0 1px #2a2a2c, 0 0 0 2px #77777c, 0 0 0 3px #2c2c2e, 0 40px 70px -40px rgba(0,0,0,.45); }
  #ch .moments .scr { position:relative; width:100%; height:100%; border-radius:13.5% / 6.3%; overflow:hidden; background:#2B4BFF; }
  #ch .moments video { display:block; width:100%; height:100%; object-fit:cover; }
  #ch .moments .isl { position:absolute; top:1.7%; left:50%; width:33%; height:3.6%; transform:translateX(-50%); border-radius:99px; background:#000; }
  #ch .moments figcaption { font:600 clamp(17px, 1.3vw, 21px)/1.3 Inter, sans-serif; letter-spacing:-.015em; color:#1d1d1f; text-align:center; }
  @media (max-width:820px) {
    #ch .moments { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    #ch .demo { height:78vh; margin-left:-2vw; margin-right:-2vw; border-radius:22px; }
    #ch .body { padding-left:5vw; padding-right:5vw; }
  }
  #ch .demo { position:relative; height:86vh; margin-top:10vh; border-radius:28px; overflow:hidden; background:var(--tint); box-shadow:0 30px 70px -45px rgba(0,0,0,.4); }
  #ch .demo iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }
  #ch .demo iframe, #ch .full iframe { opacity:0; transition:opacity .7s ease; }
  #ch .demo iframe.ready, #ch .full iframe.ready { opacity:1; }
  /* a slow, soft shimmer stands in for a frame that is still booting */
  #ch .demo:has(iframe:not(.ready))::before, #ch .full:has(iframe:not(.ready))::before { content:''; position:absolute; inset:0; background:linear-gradient(100deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.035) 50%, rgba(0,0,0,0) 70%); background-size:220% 100%; animation:ch-shimmer 2.6s ease-in-out infinite; pointer-events:none; }
  @keyframes ch-shimmer { from { background-position:120% 0; } to { background-position:-120% 0; } }
  /* until a frame's own touch and wheel handling is attached, touches go to the page, so nothing scrolls inside it unseen */
  #ch .demo iframe:not(.wired), #ch .full iframe:not(.wired) { pointer-events:none; }
  #ch .full { position:relative; height:100vh; margin:14vh -6vw 0; border-top:1px solid #e8e8ed; background:#fff; }
  #ch .full iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; background:#fff; }
  #ch .body.framed { padding-bottom:0; }
  /* a copy of the card face, scaled with the hero, so opening grows out of the card and closing lands on it */
  #ch .ch-ghost { position:absolute !important; left:0; top:0; margin:0 !important; transform-origin:0 0; pointer-events:none; z-index:5; opacity:0; }
  /* tile projects: the hero IS the tile (same light, same device), so opening is the tile growing */
  #ch .hero.tile { background:#eee; }
  #ch .hero .hero-tile { position:absolute !important; inset:0; margin:0 !important; container-type:size; }
  #ch .hero .hero-tile .slot { display:none; }
  #ch .hero .hero-tile video.full { position:absolute; inset:0; width:100%; height:100%; margin:0; border:0; object-fit:cover; }   /* not the case study's .full frame */
  #ch .hero .hero-tile .dev.lifted { transform:translateX(-50%) translateY(-10px); }
  #ch .hero .hero-tile .dev.icon.lifted, #ch .hero .hero-tile .dev.pic.lifted { transform:translate(-50%, -50%) translateY(-8px); }
  #ch .hero.tile .over { left:4vw; right:auto; top:9%; text-align:left; max-width:26vw; z-index:2; }
  #ch .hero.tile .over small { color:#1d1d1f; opacity:.55; }
  #ch .hero.tile .over h1 { font-size:clamp(26px, 2.5vw, 40px); }
  #ch .hero.tile .over h1 span { color:#fff; text-shadow:0 1px 20px rgba(60,30,10,.14); }
  /* where the headline would land on the work, it gets a band of its own: the work sits in a stage below it and,
     being sized to the stage, shrinks to fit. The stage slides down as the page opens, so the tile still grows into the hero. */
  #ch .hero .hero-tile .stage { position:absolute; left:0; right:0; top:0; bottom:0; container-type:size; transition:top .9s cubic-bezier(.2,.8,.2,1); }
  #ch .hero.roomy .hero-tile .stage { top:calc(var(--tt, 0px) * var(--band, 1)); }   /* --band closes the band as the hero shrinks on scroll */
  #ch .hero.settled .hero-tile .stage, #ch .hero.settled .hero-tile .stage .dev { transition:none; }   /* once open, it follows the scroll exactly */
  #ch .hero.roomy-t .over { max-width:none; width:min(52vw, 760px); }
  /* under the band, a window or panel sits near the top and fits whole (on the tile they rise from the bottom edge) */
  #ch .hero .hero-tile .stage .dev { transition:transform .9s cubic-bezier(.2,.8,.2,1), top .9s cubic-bezier(.2,.8,.2,1), width .9s cubic-bezier(.2,.8,.2,1), height .9s cubic-bezier(.2,.8,.2,1); }
  /* --band blends from this layout (1, open) back to the tile's own (0, shrunk on scroll) */
  #ch .hero.roomy .hero-tile .stage .dev.win { top:calc(21cqh - 18cqh * var(--band, 1)); width:min(calc(84cqw + 6cqw * var(--band, 1)), calc(128cqh + 20cqh * var(--band, 1))); }
  #ch .hero.roomy .hero-tile .stage .dev.panel { top:calc(9cqh - 6cqh * var(--band, 1)); height:calc(84cqh + 6cqh * var(--band, 1)); }
  #ch .hero .hero-tile .dev.panel { margin:0; padding:0; background:none; border-radius:0; display:block; overflow:visible; }   /* not the gallery's .panel box */
  @media (max-width:820px) { #ch .hero.tile .over { max-width:none; width:92vw; } }
  #ch .filmp { margin-top:10vh; border-radius:20px; overflow:hidden; background:#111; }
  #ch .filmp video { display:block; width:100%; height:auto; }
  #ch .next { margin-top:22vh; cursor:pointer; }
  #ch .next h2 { margin:0; font:700 clamp(48px, 7vw, 110px)/.95 Inter, sans-serif; letter-spacing:-.05em; color:#1d1d1f; }
  #ch .next h2 em { font-style:normal; color:#86868b; }`
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
  const root = document.createElement('div'); root.id = 'ch'
  root.innerHTML = '<div class="bg"></div><div class="scroller"></div><div class="hero"></div><div class="local"></div><div class="close">✕</div>'
  document.body.appendChild(root)
  const scroller = root.querySelector('.scroller'), hero = root.querySelector('.hero'), local = root.querySelector('.local'), closeB = root.querySelector('.close')
  let cur = null, hooks = null, film = null, y = 0, ty = 0, pull = 0, busy = false, maxY = 0, phase = 'idle', from = null
  // while the card is flying back (and for the inertia that follows), wheel and touch go nowhere: the page under it must not move
  let swallowUntil = 0
  const esc = s => String(s || '').replace(/</g, '&lt;')
  const lerp = (a, b, k) => a + (b - a) * k
  const ease = k => 1 - Math.pow(1 - k, 3)
  // where the film settles: a rounded card near the top of the page
  const card = () => ({ left: innerWidth * 0.06, top: innerHeight * 0.1, width: innerWidth * 0.88, height: innerHeight * 0.62 })
  const full = () => ({ left: 0, top: 0, width: innerWidth, height: innerHeight })
  const SHRINK = () => innerHeight * 0.9          // scroll it takes to settle the film
  const place = (r, rad) => { hero.style.left = r.left + 'px'; hero.style.top = r.top + 'px'; hero.style.width = r.width + 'px'; hero.style.height = r.height + 'px'; hero.style.borderRadius = rad + 'px' }

  function heroInner(it) {
    if (FILM[it.id]) return `<div class="pane"><video class="film" src="${FILM[it.id]}" playsinline poster="${it.cover}"></video></div>`
    if (it.tile && it.tile.endsWith('.mp4')) return `<div class="pane"><video src="${it.tile}" muted loop autoplay playsinline></video></div>`
    return `<div class="pane"><img class="${it.kind === 'phone' ? 'phone' : it.kind === 'logo' ? 'logo' : ''}" src="${it.tile || it.cover}" alt=""></div>`
  }
  // "The premise." in colour, then the first line of the story: Apple's two-part heading
  function twoPart(head, first) { return `<em>${esc(head.replace(/\.$/, ''))}.</em> ${esc(first)}` }
  function bodyHTML(it) {
    const slug = CASE[it.id], c = slug && window.CS && CS.caseStudies[slug], beats = slug && CS.caseBeats[slug]
    const nxt = hooks.nextItem ? hooks.nextItem() : null
    let h = `<div class="facts"><span><b>${esc(it.title)}</b></span><span>${esc(it.area)}</span><span>${esc(it.disc)}</span><span>${esc(it.year)}</span></div>
      <p class="lead"><em>${esc(it.title)}.</em> ${esc(it.head)}</p>`
    h += `<div class="brief">${(it.brief || [it.body]).map(t => `<p>${esc(t)}</p>`).join('')}</div>`
    if (hooks.heroArt && FILM[it.id]) h += `<div class="filmp"><video class="film2" src="${FILM[it.id]}" playsinline controls preload="metadata"></video></div>`
    // the working prototype, already loaded, before the long read (Queue Blocks and the ISO redesign carry theirs inside the case study)
    // moments: one phone per moment of the product, each a short loop of the real prototype, in place of the embedded prototype
    const beat = b => `<div class="st-beat">${b.say.map(t => `<p>${esc(t)}</p>`).join('')}</div>` +
      (b.shots && b.shots.length ? `<div class="st-shots">${b.shots.map(s => `<img src="${s}" alt="" >`).join('')}</div>` : '') +
      (b.wide ? `<div class="st-wide">${b.wide.map(s => `<img src="${s}" alt="" >`).join('')}</div>` : '')
    const st = it.story
    if (st) h += `<div class="st-logo"><img src="${st.logo}" alt="${esc(it.title)} app icon"><b>${esc(it.title)}</b></div>` + st.before.map(beat).join('') + (st.moments && it.moments ? `<p class="st-cap">${esc(st.moments)}</p>` : '')
    if (it.moments) h += `<div class="moments">${it.moments.map(([label, src]) => `<figure><div class="mph"><div class="scr"><video src="${src}.mp4" poster="${src}.webp" muted loop autoplay playsinline preload="metadata"></video><i class="isl"></i></div></div><figcaption>${esc(label)}</figcaption></figure>`).join('')}</div>`
    if (st && st.after) h += st.after.map(beat).join('')
    const demo = it.live && !it.moments && !['queue-blocks', 'iso-redesign'].includes(it.id) ? it.live : null
    if (demo) h += `<div class="demo"><iframe title="${esc(it.title)} prototype" data-src="${demo}" allow="autoplay; clipboard-write"></iframe></div>`
    if (c && c.stats.length) h += `<div class="stats">${c.stats.map((s, i) => `<div><b>${esc(s.value)}</b>${esc(beats && beats.stats && beats.stats[i] || s.label)}</div>`).join('')}</div>`
    if (!slug) h += `<div class="media"></div>`
    // after a minute: move on to the next card, or keep going into the whole story
    const opts = (nxt ? `<div class="go" data-act="next"><h3><em>Next</em>${esc(nxt.title)} →</h3></div>` : '') + (slug ? `<div class="go" data-act="deep"><h3><em>Keep scrolling</em>The full case study ↓</h3></div>` : '')
    if (opts) h += `<div class="fork">${opts}</div>`
    if (MUSIC[it.id]) { const [song, url, host] = MUSIC[it.id]; h += `<p class="credit">Music: ${song} | <a href="${url}" target="_blank" rel="noopener">${host}</a><br>Royalty Free Music by <a href="https://www.free-stock-music.com" target="_blank" rel="noopener">free-stock-music.com</a></p>` }
    if (slug) h += `<div class="full"><iframe title="${esc(it.title)} case study" data-src="${slug.includes('/') ? slug : 'classic/work/' + slug}" ></iframe></div>`
    return h
  }
  async function fillMedia(it) {
    const box = scroller.querySelector('.media'); if (!box) return measure()
    const imgs = await Promise.all(it.m.map(src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src })))
    const tall = imgs.filter(i => i && i.naturalHeight / i.naturalWidth > 1.5).map(i => i.src), wide = imgs.filter(i => i && i.naturalHeight / i.naturalWidth <= 1.5).map(i => i.src)
    box.innerHTML = (tall.length ? `<div class="panel phones">${tall.map(s => `<img src="${s}">`).join('')}</div>` : '') + wide.map(s => `<div class="panel"><img src="${s}"></div>`).join('')
    box.querySelectorAll('img').forEach(i => i.onload = measure); measure()
  }
  function measure() { maxY = Math.max(0, scroller.scrollHeight - innerHeight) }
  // the prototype and the case study are whole apps; they boot during the first seconds of reading, one after the other,
  // so the boot never lands in the middle of a scroll
  function preloadFrames(it) {
    const start = f => { if (f && !f.src && cur === it) f.src = f.dataset.src }
    setTimeout(() => start(scroller.querySelector('.demo iframe')), 700)
    setTimeout(() => start(scroller.querySelector('.full iframe')), 1800)
  }
  // the case study scrolls itself once it fills the screen; until then (and when you scroll
  // back up past its top) the wheel moves this page instead
  // the last time this page took a wheel event: a gesture that docks the case study never spills into it
  let lastHere = 0
  function wheelHere(dy) {
    lastHere = performance.now()
    ty += dy
    if (ty < 0) { pull += -ty; ty = 0; if (pull > 200) close() } else pull = Math.max(0, pull - Math.abs(dy))
    ty = Math.min(ty, maxY)
  }
  // touch: the page follows the finger 1:1, then coasts. A drag that starts sideways is left to the
  // element under it (the swipeable screen rows). Pulling down past the top closes, like the wheel.
  let touchMode = false, coastRaf = 0
  function stopCoast() { cancelAnimationFrame(coastRaf); coastRaf = 0 }
  function coast(v) {
    stopCoast()
    const step = () => {
      v *= 0.95
      if (Math.abs(v) < 0.4 || !cur) { touchMode = false; return }
      ty = Math.max(0, Math.min(maxY, ty + v))
      if (ty <= 0 || ty >= maxY) { touchMode = false; return }
      coastRaf = requestAnimationFrame(step)
    }
    coastRaf = requestAnimationFrame(step)
  }
  // canTake(target, dy): true when something under the finger should scroll natively instead of the page
  function touchDriver(win, canTake) {
    let lastY = null, lastX = 0, axis = null, v = 0, lastT = 0, native = false
    win.addEventListener('touchstart', e => {
      if (!cur || busy) return
      stopCoast(); touchMode = true
      lastY = e.touches[0].clientY; lastX = e.touches[0].clientX; axis = null; v = 0; lastT = performance.now(); native = false
    }, { passive: true, capture: true })
    win.addEventListener('touchmove', e => {
      if ((cur && busy) || (!cur && performance.now() < swallowUntil)) { e.preventDefault(); return }
      if (!cur || busy || lastY == null) return
      const yy = e.touches[0].clientY, xx = e.touches[0].clientX, dy = lastY - yy
      // decide on the very first move: if that move isn't claimed, the browser starts scrolling whatever is under the finger
      if (!axis) axis = Math.abs(xx - lastX) > Math.abs(yy - lastY) ? 'x' : 'y'
      if (axis === 'x') return
      native = canTake ? canTake(e.target, dy) : false
      lastY = yy
      if (native) return
      e.preventDefault(); e.stopImmediatePropagation()
      const now = performance.now(), dt = Math.max(1, now - lastT); lastT = now
      v = v * 0.4 + (dy / dt) * 16 * 0.6
      wheelHere(dy)
    }, { passive: false, capture: true })
    win.addEventListener('touchend', () => {
      if (lastY == null) return
      lastY = null
      if (!native && axis === 'y' && performance.now() - lastT < 90 && Math.abs(v) > 1) coast(v)
      else touchMode = false
    }, { passive: true, capture: true })
  }

  function wireFrame(frame) {
    frame.addEventListener('load', () => {
      let w; try { w = frame.contentWindow; w.document } catch (e) { return }
      w.addEventListener('wheel', e => {
        if (!cur) return
        const deck = w.isoDeck, docked = ty >= maxY - 2 && y >= maxY - 6, atTop = w.scrollY <= 0 && (!deck || deck.index() === 0)
        if (!docked || (atTop && e.deltaY < 0) || performance.now() - lastHere < 260) { e.preventDefault(); e.stopImmediatePropagation(); wheelHere(e.deltaY) }
      }, { passive: false, capture: true })
      w.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close() })
      frame.classList.add('wired')
      touchDriver(w, (t, dy) => {
        const deck = w.isoDeck, docked = ty >= maxY - 2 && y >= maxY - 6, atTop = w.scrollY <= 0 && (!deck || deck.index() === 0)
        return docked && !(atTop && dy < 0)
      })
    })
  }

  // over the prototype, the wheel still moves this page, unless it is scrolling something inside the prototype:
  // a list, or (once the frame is fully in view) the prototype's own page, until it reaches its top or bottom
  function wireDemo(frame) {
    frame.addEventListener('load', () => {
      let w; try { w = frame.contentWindow; w.document } catch (e) { return }
      const inView = () => { const r = frame.getBoundingClientRect(); return r.top >= -4 && r.bottom <= innerHeight + 4 }
      const canScroll = (el, dy) => {
        if (!inView()) return false   // until the whole prototype is on screen, a swipe or wheel over it moves the page
        for (; el && el !== w.document.documentElement; el = el.parentElement) { const cs = w.getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) { if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true } }
        const se = w.document.scrollingElement
        if (inView() && se && se.scrollHeight > w.innerHeight + 1) return dy > 0 ? w.scrollY + w.innerHeight < se.scrollHeight - 1 : w.scrollY > 0
        return false
      }
      w.addEventListener('wheel', e => { if (!cur) return; if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || canScroll(e.target, e.deltaY)) return; e.preventDefault(); e.stopImmediatePropagation(); wheelHere(e.deltaY) }, { passive: false, capture: true })
      touchDriver(w, (t, dy) => canScroll(t, dy))
      frame.classList.add('wired')
      w.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close() })
      measure()
    })
  }
  const CARD_SHADOW = '0 1px 2px rgba(0,0,0,.11), 0 7px 16px rgba(0,0,0,.11), 0 22px 46px rgba(0,0,0,.10)', NO_SHADOW = '0 1px 2px rgba(0,0,0,0), 0 7px 16px rgba(0,0,0,0), 0 22px 46px rgba(0,0,0,0)'
  let ghost = null, ghostSize = null, ghostRaf = 0
  function makeGhost(r) {
    dropGhost()
    const face = hooks.cardFace && hooks.cardFace(); if (!face) return null
    const g = document.createElement('div'); g.className = 'card ch-ghost'
    const f = face.cloneNode(true); f.querySelectorAll('video').forEach(v => v.remove())
    g.appendChild(f); g.style.width = r.width + 'px'; g.style.height = r.height + 'px'
    hero.appendChild(g); ghost = g; ghostSize = { w: r.width, h: r.height }
    // scaled evenly (never stretched) to cover the hero, centred; at the card's own size this is exactly the card
    const sync = () => { if (!ghost) return; const W = hero.offsetWidth, H = hero.offsetHeight, k = Math.max(W / ghostSize.w, H / ghostSize.h); ghost.style.transform = `translate(${(W - ghostSize.w * k) / 2}px, ${(H - ghostSize.h * k) / 2}px) scale(${k})`; ghostRaf = requestAnimationFrame(sync) }
    sync(); return g
  }
  function dropGhost() { cancelAnimationFrame(ghostRaf); if (ghost) ghost.remove(); ghost = null }
  function open(it, fromEl, h) {
    if (busy || cur) return
    build(it, fromEl, h, 'morph')
  }
  // mode 'morph': the card grows into the page. mode 'swap': the page is already open and the next
  // project fades up in place, so moving between projects never closes and reopens a window.
  function build(it, fromEl, h, mode) {
    busy = true; cur = it; hooks = h || {}; y = ty = 0; pull = 0; from = fromEl
    scroller.style.transform = 'translateY(0px)'
    root.style.setProperty('--acc', it.acc); root.style.setProperty('--tint', it.tint)
    const art = hooks.heroArt && hooks.heroArt()
    hero.classList.remove('roomy', 'roomy-t', 'settled')
    hero.classList.toggle('tile', !!art)
    hero.classList.toggle('still', !art && !FILM[it.id] && !(it.tile && it.tile.endsWith('.mp4')))
    if (art) {
      hero.innerHTML = `<div class="card hero-tile"></div><div class="over"><small>${esc(it.area)} · ${esc(it.year)}</small><h1>${esc(it.title)}.<br><span>${esc(it.short || it.head)}</span></h1></div>`
      const cl = art.cloneNode(true); hero.firstChild.appendChild(cl)
      const stage = document.createElement('div'); stage.className = 'stage'; stage.append(...cl.childNodes); cl.appendChild(stage)
      // the headline needs its own band wherever it would sit on the work: always on a phone, and on a wide screen
      // for the screenshots that span the page (a phone or an icon stands clear of it there)
      const dev = stage.querySelector('.dev'), kind = dev && ['win', 'winv', 'panel', 'pic', 'phone', 'phonev', 'icon', 'logo'].find(c => dev.classList.contains(c))
      const wide = innerWidth > 820 && innerWidth > innerHeight
      if (kind && (!wide || ['win', 'winv', 'panel', 'pic'].includes(kind))) {
        hero.classList.add('roomy-t')
        const ovEl = hero.querySelector('.over')
        hero.style.setProperty('--tt', Math.round(innerHeight * 0.09 + ovEl.offsetHeight + Math.max(24, innerHeight * 0.035)) + 'px')
        hero.style.setProperty('--band', 1)
        stage.addEventListener('transitionend', e => { if (e.target === stage && hero.classList.contains('roomy')) hero.classList.add('settled') })
        if (mode === 'swap') hero.classList.add('roomy', 'settled'); else requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('roomy')))
      }
      cl.querySelectorAll('video').forEach((v, k) => { const o = art.querySelectorAll('video')[k]; v.muted = true; if (o) v.currentTime = o.currentTime; v.play().catch(() => {}) })
      if (hooks.wasLifted && hooks.wasLifted()) { const d = cl.querySelector('.dev'); if (d) { d.classList.add('lifted'); requestAnimationFrame(() => requestAnimationFrame(() => d.classList.remove('lifted'))) } }
    } else hero.innerHTML = heroInner(it) + `<div class="shade"></div><div class="over"><small>${esc(it.area)} · ${esc(it.year)}</small><h1>${esc(it.title)}.<br><span>${esc(it.short || it.head)}</span></h1></div>` + (FILM[it.id] ? `<div class="ctrl"><button class="pp">Pause</button><div class="bar"><i></i></div><button class="snd">Sound on</button></div>` : '')
    film = hero.querySelector('video.film')
    setTimeout(() => { const f2 = scroller.querySelector('video.film2'); if (!f2) return
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { f2.volume = 0.3; f2.play().catch(() => { f2.muted = true; f2.play().catch(() => {}) }) } else f2.pause() }), { threshold: 0.5 }); io.observe(f2); f2._io = io }, 0)
    if (film) {
      film.volume = 0.3; film.muted = false; film.play().catch(() => { film.muted = true; film.play().catch(() => {}) })
      const pp = hero.querySelector('.pp'), snd = hero.querySelector('.snd'), bar = hero.querySelector('.bar i')
      pp.onclick = e => { e.stopPropagation(); film.paused ? film.play() : film.pause(); pp.textContent = film.paused ? 'Play' : 'Pause' }
      const lab = () => snd.textContent = film.muted ? 'Sound off' : 'Sound on'
      snd.onclick = e => { e.stopPropagation(); film.muted = !film.muted; lab() }; film.addEventListener('volumechange', lab); lab()
      film.ontimeupdate = () => bar.style.width = (film.currentTime / (film.duration || 1) * 100) + '%'
    }
    const C = card()
    scroller.innerHTML = `<div class="body" style="top:${SHRINK() + C.top + C.height + 56}px">${bodyHTML(it)}</div>`
    const nxt = hooks.nextItem ? hooks.nextItem() : null
    const body = scroller.querySelector('.body'), frame = scroller.querySelector('.full iframe')
    if (frame) body.classList.add('framed')
    scroller.querySelectorAll('.fork .go').forEach(g => g.onclick = () => {
      if (g.dataset.act === 'next' && nxt) { if (hooks.next) hooks.next(nxt); else { const hk = hooks; close(() => hk.next && hk.next(nxt)) } }
      else ty = maxY   // glide down until the case study fills the screen
    })
    if (frame) wireFrame(frame)
    const demoF = scroller.querySelector('.demo iframe'); if (demoF) wireDemo(demoF)
    scroller.querySelectorAll('iframe').forEach(f => f.addEventListener('load', () => f.classList.add('ready')))
    // story images arrive after the page is measured; re-measure as each one lands so the page can scroll to its end
    scroller.querySelectorAll('.st-logo img, .st-shots img, .st-wide img').forEach(i => { if (!i.complete) i.addEventListener('load', measure) })
    local.innerHTML = `<b>${esc(it.title)}</b><nav><span data-go="0">Overview</span>${CASE[it.id] ? '<span data-go="1">Full case study</span>' : ''}${it.live ? `<a href="${it.live}" target="_blank">Try it</a>` : ''}</nav>`
    local.querySelectorAll('[data-go]').forEach(n => n.onclick = () => { ty = n.dataset.go === '0' ? 0 : maxY })
    fillMedia(it)
    const F = full(), ov = hero.querySelector('.over')
    fromEl.style.visibility = 'hidden'
    root.classList.add('on'); hooks.onOpen && hooks.onOpen()
    // the headline rises while the picture is still settling, so the two arrive as one move
    const headline = delay => ov.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 760, delay, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
    const done = () => { place(F, 0); hero.getAnimations().forEach(x => x.cancel()); phase = 'open'; busy = false; measure(); preloadFrames(it) }
    if (mode === 'swap') {
      place(F, 0); phase = 'open'
      hero.animate([{ opacity: 0, transform: 'scale(1.035)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = done
      scroller.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 300, easing: 'ease-out', fill: 'backwards' })
      headline(260)
      return
    }
    // the card opens to the full screen
    document.body.classList.add('ch-busy')
    const r = hooks.fromRect ? hooks.fromRect() : fromEl.getBoundingClientRect()
    const rad = hooks.targetRadius ? hooks.targetRadius() : '28px', rz = hooks.cardRotate ? hooks.cardRotate() : '0deg'
    place(r, 0)
    const g = hooks.heroArt ? null : makeGhost(r)
    hero.animate([{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad, transform: `rotate(${rz})`, boxShadow: (hooks.flat ? NO_SHADOW : CARD_SHADOW) }, { left: '0px', top: '0px', width: F.width + 'px', height: F.height + 'px', borderRadius: '0px', transform: 'rotate(0deg)', boxShadow: NO_SHADOW }], { duration: 820, easing: 'cubic-bezier(.22,.9,.22,1)', fill: 'forwards' }).onfinish = () => { dropGhost(); done() }
    if (g) g.animate([{ opacity: 1 }, { opacity: 1, offset: 0.12 }, { opacity: 0, offset: 0.45 }, { opacity: 0 }], { duration: 820, easing: 'linear', fill: 'forwards' })
    headline(420)
  }
  // to the next project without leaving the page: this one dissolves, the next one fades up in its place
  function swap(it, fromEl, h) {
    if (busy || !cur) return
    busy = true; phase = 'swapping'
    if (film) { film.pause(); film.muted = true }
    local.classList.remove('show')
    const old = hooks, oldFrom = from
    const out = { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
    scroller.animate([{ opacity: 1 }, { opacity: 0 }], out)
    hero.animate([{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(10px)' }], out).onfinish = () => {
      hero.getAnimations().forEach(x => x.cancel()); scroller.getAnimations().forEach(x => x.cancel())
      old && old.onClose && old.onClose(); if (oldFrom) oldFrom.style.visibility = ''
      build(it, fromEl, h, 'swap')
    }
  }
  function close(after) {
    if (busy || !cur) return
    busy = true; phase = 'closing'
    if (film) { film.pause(); film.muted = true }
    const r0 = hero.getBoundingClientRect(), t = hooks.targetRect ? hooks.targetRect() : r0
    local.classList.remove('show'); root.classList.remove('on'); hooks.onClose && hooks.onClose()
    hero.classList.remove('settled', 'roomy')   // the work slides back to its place on the tile as the hero shrinks onto it
    // stop the headline mid-entrance and let it go quickly, so nothing is still arriving while the card shrinks away
    hero.querySelectorAll('.over,.ctrl,.shade').forEach(n => { const o = getComputedStyle(n).opacity; n.getAnimations().forEach(x => x.cancel()); n.style.opacity = 0; n.animate([{ opacity: o }, { opacity: 0 }], { duration: 160, easing: 'ease-out' }) })
    scroller.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' })
    const finish = () => {
      dropGhost(); hero.getAnimations().forEach(x => x.cancel()); scroller.getAnimations().forEach(x => x.cancel()); hero.innerHTML = ''; hero.style.width = '0px'; scroller.innerHTML = ''
      requestAnimationFrame(() => document.body.classList.remove('ch-busy'))
      cur = null; busy = false; phase = 'idle'; film = null; const hk = hooks; hooks = null; swallowUntil = performance.now() + 800
      hk && hk.onClosed && hk.onClosed(); after && after()
    }
    if (r0.bottom < innerHeight * 0.3) {
      hero.style.opacity = 0
      if (from) { from.style.visibility = ''; from.animate([{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 140, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) }
      setTimeout(() => { hero.style.opacity = ''; finish() }, 780)
      return
    }
    const rad = hooks.targetRadius ? hooks.targetRadius() : '28px', rz = hooks.cardRotate ? hooks.cardRotate() : '0deg'
    const g = hooks.heroArt ? null : makeGhost(t)
    const a = hero.animate([{ left: r0.left + 'px', top: r0.top + 'px', width: r0.width + 'px', height: r0.height + 'px', borderRadius: getComputedStyle(hero).borderRadius, transform: 'rotate(0deg)', boxShadow: NO_SHADOW }, { left: t.left + 'px', top: t.top + 'px', width: t.width + 'px', height: t.height + 'px', borderRadius: rad, transform: `rotate(${rz})`, boxShadow: (hooks.flat ? NO_SHADOW : CARD_SHADOW) }], { duration: 720, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
    if (g) g.animate([{ opacity: 0 }, { opacity: 0, offset: 0.3 }, { opacity: 1, offset: 0.78 }, { opacity: 1 }], { duration: 720, easing: 'linear', fill: 'forwards' })
    else if (!hooks.heroArt) hero.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 720, easing: 'ease-in', fill: 'forwards' })
    // the page is the card by the end, so the real one appears under it in the same place and nothing jumps
    a.onfinish = () => { if (from) from.style.visibility = ''; finish() }
  }
  addEventListener('wheel', e => {
    if (!cur && performance.now() > swallowUntil) return
    e.preventDefault()
    if (!cur || busy) return
    wheelHere(e.deltaY)
  }, { passive: false })
  touchDriver(window, (t) => !!(t.closest && t.closest('.ctrl, .local, .close')))
  addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close() })
  closeB.onclick = () => close()
  addEventListener('resize', measure)
  ;(function loop() {
    if (cur && phase === 'open') {
      y += (ty - y) * (touchMode ? 0.55 : 0.18)
      scroller.style.transform = `translateY(${-y}px)`
      // the film settles from the full screen into its card as you scroll, then rides up with the page
      const k = ease(Math.min(1, y / SHRINK())), F = full(), C = card()
      const r = { left: lerp(F.left, C.left, k), top: lerp(F.top, C.top, k), width: lerp(F.width, C.width, k), height: lerp(F.height, C.height, k) }
      if (y > SHRINK()) r.top = C.top - (y - SHRINK())
      place(r, 28 * k)
      const over = hero.querySelector('.over'); if (over) over.style.opacity = 1 - Math.min(1, y / (SHRINK() * 0.3))
      hero.style.setProperty('--band', (1 - k).toFixed(4))
      const ctrl = hero.querySelector('.ctrl'); if (ctrl) ctrl.style.opacity = 1 - Math.min(1, y / (SHRINK() * 0.5))
      const shade = hero.querySelector('.shade'); if (shade) shade.style.opacity = 1 - k
      const fr = scroller.querySelector('.full iframe')
      if (fr && !fr.src && y > SHRINK() * 0.4) fr.src = fr.dataset.src
      const dm = scroller.querySelector('.demo iframe')
      if (dm && !dm.src && y > SHRINK() * 0.2) dm.src = dm.dataset.src
      const inFrame = fr && y > maxY - innerHeight * 0.5
      local.classList.toggle('show', y > SHRINK() * 0.85 && !inFrame)
      closeB.classList.toggle('light', y > SHRINK() * 0.6)
      closeB.style.top = y > SHRINK() * 0.85 ? '9px' : '16px'
    }
    requestAnimationFrame(loop)
  })()
  window.Chapter = { open, close, swap, isOpen: () => !!cur }
})()
