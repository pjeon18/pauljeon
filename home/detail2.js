// Project chapter, Apple-style. A card opens into a full-screen film with a
// small label and a two-line headline. Scrolling settles the film into a
// rounded card, then the short facts, the stats, and the case study in
// two-part headings follow. A slim local nav sticks to the top.
(function () {
  const CASE = { 'queue-blocks': 'queue-blocks/case-study.html', 'iso-redesign': 'iso-redesign', pathways: 'harvard-pathways', 'the-dot': 'the-dot', studdy: 'studdy', prepio: 'prep-io', iso: 'iso', onapsis: 'onapsis-gtm', f1: 'f1-undercut', media: 'media-analytics' }
  const FILM = { 'queue-blocks': 'm/queue-blocks.mp4', 'iso-redesign': 'm/iso-features.mp4', pathways: 'm/pathways.mp4', tracker: 'm/tracker.mp4', prepio: 'm/prepio.mp4', iso: 'm/iso-v1.mp4', media: 'm/media.mp4' }
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
  #ch .demo { position:relative; height:86vh; margin-top:10vh; border-radius:28px; overflow:hidden; background:var(--tint); box-shadow:0 30px 70px -45px rgba(0,0,0,.4); }
  #ch .demo iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }
  #ch .demo iframe, #ch .full iframe { opacity:0; transition:opacity .7s ease; }
  #ch .demo iframe.ready, #ch .full iframe.ready { opacity:1; }
  #ch .full { position:relative; height:100vh; margin:14vh -6vw 0; border-top:1px solid #e8e8ed; background:#fff; }
  #ch .full iframe { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; background:#fff; }
  #ch .body.framed { padding-bottom:0; }
  /* a copy of the card face, scaled with the hero, so opening grows out of the card and closing lands on it */
  #ch .ch-ghost { position:absolute !important; left:0; top:0; margin:0 !important; transform-origin:0 0; pointer-events:none; z-index:5; opacity:0; }
  #ch .next { margin-top:22vh; cursor:pointer; }
  #ch .next h2 { margin:0; font:700 clamp(48px, 7vw, 110px)/.95 Inter, sans-serif; letter-spacing:-.05em; color:#1d1d1f; }
  #ch .next h2 em { font-style:normal; color:#86868b; }`
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
  const root = document.createElement('div'); root.id = 'ch'
  root.innerHTML = '<div class="bg"></div><div class="scroller"></div><div class="hero"></div><div class="local"></div><div class="close">✕</div>'
  document.body.appendChild(root)
  const scroller = root.querySelector('.scroller'), hero = root.querySelector('.hero'), local = root.querySelector('.local'), closeB = root.querySelector('.close')
  let cur = null, hooks = null, film = null, y = 0, ty = 0, pull = 0, busy = false, maxY = 0, phase = 'idle', from = null
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
    // the working prototype, already loaded, before the long read (Queue Blocks and the ISO redesign carry theirs inside the case study)
    const demo = it.live && !['queue-blocks', 'iso-redesign'].includes(it.id) ? it.live : null
    if (demo) h += `<div class="demo"><iframe title="${esc(it.title)} prototype" data-src="${demo}" allow="autoplay; clipboard-write"></iframe></div>`
    if (c && c.stats.length) h += `<div class="stats">${c.stats.map((s, i) => `<div><b>${esc(s.value)}</b>${esc(beats && beats.stats && beats.stats[i] || s.label)}</div>`).join('')}</div>`
    if (!slug) h += `<div class="media"></div>`
    // after a minute: move on to the next card, or keep going into the whole story
    const opts = (nxt ? `<div class="go" data-act="next"><h3><em>Next</em>${esc(nxt.title)} →</h3></div>` : '') + (slug ? `<div class="go" data-act="deep"><h3><em>Keep scrolling</em>The full case study ↓</h3></div>` : '')
    if (opts) h += `<div class="fork">${opts}</div>`
    if (slug) h += `<div class="full"><iframe title="${esc(it.title)} case study" data-src="${slug.includes('/') ? slug : 'classic/work/' + slug}" loading="lazy"></iframe></div>`
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
  function wireFrame(frame) {
    frame.addEventListener('load', () => {
      let w; try { w = frame.contentWindow; w.document } catch (e) { return }
      w.addEventListener('wheel', e => {
        if (!cur) return
        const deck = w.isoDeck, docked = ty >= maxY - 2 && y >= maxY - 6, atTop = w.scrollY <= 0 && (!deck || deck.index() === 0)
        if (!docked || (atTop && e.deltaY < 0) || performance.now() - lastHere < 260) { e.preventDefault(); e.stopImmediatePropagation(); wheelHere(e.deltaY) }
      }, { passive: false, capture: true })
      w.addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close() })
    })
  }

  // over the prototype, the wheel still moves this page, unless it is scrolling a list inside the prototype
  function wireDemo(frame) {
    frame.addEventListener('load', () => {
      let w; try { w = frame.contentWindow; w.document } catch (e) { return }
      const canScroll = (el, dy) => { for (; el && el !== w.document.documentElement; el = el.parentElement) { const cs = w.getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) { if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true } } return false }
      w.addEventListener('wheel', e => { if (!cur) return; if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || canScroll(e.target, e.deltaY)) return; e.preventDefault(); e.stopImmediatePropagation(); wheelHere(e.deltaY) }, { passive: false, capture: true })
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
    hero.classList.toggle('still', !FILM[it.id] && !(it.tile && it.tile.endsWith('.mp4')))
    hero.innerHTML = heroInner(it) + `<div class="shade"></div><div class="over"><small>${esc(it.area)} · ${esc(it.year)}</small><h1>${esc(it.title)}.<br><span>${esc(it.short || it.head)}</span></h1></div>` + (FILM[it.id] ? `<div class="ctrl"><button class="pp">Pause</button><div class="bar"><i></i></div><button class="snd">Sound on</button></div>` : '')
    film = hero.querySelector('video.film')
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
    local.innerHTML = `<b>${esc(it.title)}</b><nav><span data-go="0">Overview</span>${CASE[it.id] ? '<span data-go="1">Full case study</span>' : ''}${it.live ? `<a href="${it.live}" target="_blank">Try it</a>` : ''}</nav>`
    local.querySelectorAll('[data-go]').forEach(n => n.onclick = () => { ty = n.dataset.go === '0' ? 0 : maxY })
    fillMedia(it)
    const F = full(), ov = hero.querySelector('.over')
    fromEl.style.visibility = 'hidden'
    root.classList.add('on'); hooks.onOpen && hooks.onOpen()
    // the headline rises while the picture is still settling, so the two arrive as one move
    const headline = delay => ov.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 760, delay, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
    const done = () => { place(F, 0); hero.getAnimations().forEach(x => x.cancel()); phase = 'open'; busy = false; measure() }
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
    const g = makeGhost(r)
    hero.animate([{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: rad, transform: `rotate(${rz})`, boxShadow: CARD_SHADOW }, { left: '0px', top: '0px', width: F.width + 'px', height: F.height + 'px', borderRadius: '0px', transform: 'rotate(0deg)', boxShadow: NO_SHADOW }], { duration: 820, easing: 'cubic-bezier(.22,.9,.22,1)', fill: 'forwards' }).onfinish = () => { dropGhost(); done() }
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
    // stop the headline mid-entrance and let it go quickly, so nothing is still arriving while the card shrinks away
    hero.querySelectorAll('.over,.ctrl,.shade').forEach(n => { const o = getComputedStyle(n).opacity; n.getAnimations().forEach(x => x.cancel()); n.style.opacity = 0; n.animate([{ opacity: o }, { opacity: 0 }], { duration: 160, easing: 'ease-out' }) })
    scroller.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' })
    const finish = () => {
      dropGhost(); hero.getAnimations().forEach(x => x.cancel()); scroller.getAnimations().forEach(x => x.cancel()); hero.innerHTML = ''; hero.style.width = '0px'; scroller.innerHTML = ''
      requestAnimationFrame(() => document.body.classList.remove('ch-busy'))
      cur = null; busy = false; phase = 'idle'; film = null; const hk = hooks; hooks = null
      hk && hk.onClosed && hk.onClosed(); after && after()
    }
    if (r0.bottom < innerHeight * 0.3) {
      hero.style.opacity = 0
      if (from) { from.style.visibility = ''; from.animate([{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 140, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }) }
      setTimeout(() => { hero.style.opacity = ''; finish() }, 780)
      return
    }
    const rad = hooks.targetRadius ? hooks.targetRadius() : '28px', rz = hooks.cardRotate ? hooks.cardRotate() : '0deg'
    const g = makeGhost(t)
    const a = hero.animate([{ left: r0.left + 'px', top: r0.top + 'px', width: r0.width + 'px', height: r0.height + 'px', borderRadius: getComputedStyle(hero).borderRadius, transform: 'rotate(0deg)', boxShadow: NO_SHADOW }, { left: t.left + 'px', top: t.top + 'px', width: t.width + 'px', height: t.height + 'px', borderRadius: rad, transform: `rotate(${rz})`, boxShadow: CARD_SHADOW }], { duration: 720, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
    if (g) g.animate([{ opacity: 0 }, { opacity: 0, offset: 0.3 }, { opacity: 1, offset: 0.78 }, { opacity: 1 }], { duration: 720, easing: 'linear', fill: 'forwards' })
    else hero.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 720, easing: 'ease-in', fill: 'forwards' })
    // the page is the card by the end, so the real one appears under it in the same place and nothing jumps
    a.onfinish = () => { if (from) from.style.visibility = ''; finish() }
  }
  addEventListener('wheel', e => {
    if (!cur || busy) return
    e.preventDefault()
    wheelHere(e.deltaY)
  }, { passive: false })
  addEventListener('keydown', e => { if (e.key === 'Escape' && cur) close() })
  closeB.onclick = () => close()
  addEventListener('resize', measure)
  ;(function loop() {
    if (cur && phase === 'open') {
      y += (ty - y) * 0.12
      scroller.style.transform = `translateY(${-y}px)`
      // the film settles from the full screen into its card as you scroll, then rides up with the page
      const k = ease(Math.min(1, y / SHRINK())), F = full(), C = card()
      const r = { left: lerp(F.left, C.left, k), top: lerp(F.top, C.top, k), width: lerp(F.width, C.width, k), height: lerp(F.height, C.height, k) }
      if (y > SHRINK()) r.top = C.top - (y - SHRINK())
      place(r, 28 * k)
      const over = hero.querySelector('.over'); if (over) over.style.opacity = 1 - Math.min(1, y / (SHRINK() * 0.3))
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
