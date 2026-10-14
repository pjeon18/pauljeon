/* ISO, chromatic prototype.
   One file of screens (R = render, M = mount), one state object, Web Animations for every move.
   Motion rules: things that travel use ease-in-out; words fade up gently, one at a time;
   ambient light drifts on its own slow clock (CSS); nothing flashes. */

/* Three ways to run it: ?mode=try (default, you drive), ?mode=watch (it drives itself, see tour.js),
   ?film (bare phone inside the feature-film director, faster pacing) */
const Q = new URLSearchParams(location.search);
const FILM = Q.has('film');
const EMBED = Q.has('embed');   // bare phone inside another page (the case study), but watch/try run as usual
const MODE = FILM ? 'film' : (Q.get('mode') || 'try');
document.body.classList.add('m-' + MODE);
if (EMBED) document.body.classList.add('m-film', 'm-embed');
const SP = FILM ? .5 : 1;   // pacing of the app's own timers (partner typing, searching, reveal)

const PH = {
  you: 'assets/paul.jpg',
  maya: 'https://images.unsplash.com/photo-1662850886700-4ec19bd30d11',
  jordan: 'https://images.unsplash.com/photo-1625241152315-4a698f74ceb7',
};
const img = (k, w, h = w) => (PH[k].startsWith('http') ? `${PH[k]}?w=${w * 2}&h=${h * 2}&fit=crop&crop=faces&q=80&auto=format` : PH[k]);
const EASE = 'cubic-bezier(.65,0,.35,1)', OUT = 'cubic-bezier(.22,1,.36,1)';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const phone = $('#phone'), view = $('#view'), layer = $('#layer');

const I = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 6 9 12l6 6"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4h12l-3 4.5L18 13H6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 5 4.5 9-10"/></svg>',
};
const ring = (r = 9) => { const c = 2 * Math.PI * r; return `<svg viewBox="0 0 22 22"><circle class="trk" cx="11" cy="11" r="${r}" fill="none" stroke-width="2.2"/><circle class="arc" cx="11" cy="11" r="${r}" fill="none" stroke-width="2.2" stroke-dasharray="${c}" stroke-dashoffset="0"/></svg>`; };

/* ---------------- state ---------------- */
const ROOM = [
  ['them', 'Okay, tonight’s question. What’s the last thing that made you laugh out loud?'],
  ['me', 'You first.'],
  ['them', 'Honestly? My roommate trying to parallel park for eleven minutes.'],
  ['me', 'Eleven minutes is real commitment.'],
  ['them', 'The whole street clapped when she finally got it. She bowed.'],
  ['me', 'I’m crying. Did you clap too'],
  ['them', 'Obviously. Standing ovation.'],
];
const CHAT = [
  ['them', 'Okay update: she parallel parked on the first try today.'],
  ['me', 'Growth. Genuinely moved.'],
  ['them', 'Are you free Thursday? There’s a jazz night at the Lizard Lounge.'],
  ['me', 'I’m in. 8?'],
  ['them', '8. I’ll save you a seat.'],
];
const S = {
  night: 'live', convo: false, msgs: [], step: 0, chatStep: 0, chatStarted: false,
  held: [], takeaways: [], remind: false, count: 1284,
  stack: [], cur: null, timers: [], sheet: null, sel: null, scale: 1,
  cd: 2 * 3600 + 14 * 60 + 8, oc: 12, waiting: 180, feel: 3, battery: 32,
};
const CONVOS = {
  tonight: { date: 'Tonight', when: '9:00 – 9:14 PM', q: 'What’s the last thing that made you laugh out loud?', who: 'M.', meta: 'M.  ·  14 min  ·  you both kept talking', felt: 'Warm.', brought: 'Curiosity, humor.', took: '“I’m funnier when I’m not trying.”' },
  oct9: { date: 'Oct 9', when: '10:20 – 10:29 PM', q: 'What would you do with a free Tuesday?', who: 'S.', meta: 'S.  ·  9 min', felt: 'Fine.', brought: 'Patience.', took: '“Asking a second question changes everything.”' },
  oct7: { date: 'Oct 7', when: '11:02 – 11:24 PM', q: 'What’s a small thing you’re weirdly good at?', who: 'A.', meta: 'A.  ·  22 min', felt: 'Seen.', brought: 'Honesty.', took: '“It’s okay to end things kindly.”' },
  sept28: { date: 'Sept 28', when: '9:41 – 9:59 PM', q: 'Best meal you’ve had for under ten dollars?', who: 'J.', meta: 'J.  ·  18 min  ·  held for later', felt: 'Lit up.', brought: 'Curiosity.', took: '“I like curious people.”' },
};
const SEED_MOMENTS = [
  { id: 'm-oct7', convo: 'oct7', feelings: ['Seen'], note: 'Needed that during midterms.', time: 'Oct 7, 11:15 PM', range: '11:15 – 11:16 PM',
    msgs: [{ from: 'me', text: 'I never know what I want to do after this.' }, { from: 'them', text: 'You don’t have to have it figured out to be interesting.' }] },
];
const FEEL_LINE = { Laughed: 'It made you laugh.', Seen: 'It made you feel seen.', Calm: 'It calmed you down.', Curious: 'It made you curious.', Butterflies: 'It gave you butterflies.', Comforted: 'It comforted you.', Drained: 'It took a lot out of you.', Uneasy: 'It left you uneasy.' };

/* ---------------- timers ---------------- */
const later = (ms, fn) => { const id = setTimeout(fn, ms); S.timers.push(['t', id]); return id; };
const every = (ms, fn) => { const id = setInterval(fn, ms); S.timers.push(['i', id]); return id; };
const clearTimers = () => { S.timers.forEach(([k, id]) => (k === 't' ? clearTimeout(id) : clearInterval(id))); S.timers = []; };

/* ---------------- motion helpers ---------------- */
function splitWords(n) {
  if (n.dataset.split) return; n.dataset.split = 1;
  n.innerHTML = n.textContent.split(/(\s+)/).map(p => (/^\s+$/.test(p) ? p : `<span class="w">${p}</span>`)).join('');
}
function reveal(root, base = 200) {
  $$('[data-in]', root).forEach((n, i) => {
    const d = base + i * 75;
    if (n.hasAttribute('data-w')) {
      splitWords(n);
      $$('.w', n).forEach((w, j) => w.animate(
        [{ opacity: 0, transform: 'translateY(.34em)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 900, delay: d + j * 60, easing: OUT, fill: 'backwards' }));
    } else {
      n.animate([{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 820, delay: d, easing: OUT, fill: 'backwards' });
    }
  });
}
const settle = (a, el, style) => a.finished.then(() => { Object.assign(el.style, style); a.cancel(); }).catch(() => {});

/* ---------------- navigation ---------------- */
function go(name, o = {}) {
  const mode = o.mode || 'fade';
  clearTimers(); closeSheet(true); clearLayer();
  if ((mode === 'push' || mode === 'expand') && S.cur) S.stack.push({ name: S.cur.name, o: { ...S.cur.o, mode: undefined } });
  if (mode === 'fade') S.stack = [];
  const el = document.createElement('section');
  el.className = 'screen s-' + name;
  el.innerHTML = R[name](o);
  view.appendChild(el);
  const old = S.cur && S.cur.el;
  S.cur = { name, el, o };
  setClock(o); markPanel();

  if (old) {
    old.style.pointerEvents = 'none';
    if (mode === 'push') {
      el.style.zIndex = 2; el.style.boxShadow = '-30px 0 60px -30px rgba(17,17,18,.25)';
      el.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 620, easing: EASE });
      old.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-26%)', opacity: .6 }], { duration: 620, easing: EASE, fill: 'forwards' }).finished.then(() => old.remove());
    } else if (mode === 'pop') {
      old.style.zIndex = 2;
      el.animate([{ transform: 'translateX(-26%)', opacity: .6 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 560, easing: EASE });
      old.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], { duration: 560, easing: EASE, fill: 'forwards' }).finished.then(() => old.remove());
    } else if (mode === 'expand') {
      old.remove();
    } else {
      old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.995)' }], { duration: 420, easing: EASE, fill: 'forwards' }).finished.then(() => old.remove());
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 560, delay: 160, easing: EASE, fill: 'backwards' });
    }
  }
  if (M[name]) M[name](el, o);
  reveal(el, mode === 'fade' ? 260 : mode === 'expand' ? 140 : 240);
}
function back() {
  const p = S.stack.pop();
  if (!p) return go('home');
  const keep = S.stack.slice();
  go(p.name, { ...p.o, mode: 'pop' });
  S.stack = keep;
}
/* bento tile opens: the tile's own surface grows to fill the phone, then the page arrives inside it */
function expand(tile, name, o = {}) {
  const pr = phone.getBoundingClientRect(), r = tile.getBoundingClientRect(), s = S.scale;
  const ov = document.createElement('div');
  Object.assign(ov.style, { position: 'absolute', left: (r.left - pr.left) / s + 'px', top: (r.top - pr.top) / s + 'px', width: r.width / s + 'px', height: r.height / s + 'px', borderRadius: '28px', background: getComputedStyle(tile).backgroundColor, zIndex: 30, pointerEvents: 'none' });
  layer.appendChild(ov);
  tile.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EASE, fill: 'forwards' });
  ov.animate([
    { left: ov.style.left, top: ov.style.top, width: ov.style.width, height: ov.style.height, borderRadius: '28px', background: ov.style.background },
    { left: '0px', top: '0px', width: '393px', height: '852px', borderRadius: '56px', background: '#ffffff' },
  ], { duration: 640, easing: EASE, fill: 'forwards' }).finished.then(() => {
    go(name, { ...o, mode: 'expand' });
    layer.appendChild(ov);
    ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: EASE, fill: 'forwards' }).finished.then(() => ov.remove());
  });
}

/* ---------------- sheets + layer ---------------- */
function openSheet(html, { cls = '', mount, onClose } = {}) {
  closeSheet(true);
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  const sh = document.createElement('div'); sh.className = 'sheet ' + cls; sh.innerHTML = '<div class="grab"></div>' + html;
  layer.append(scrim, sh);
  settle(scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 460, easing: EASE }), scrim, { opacity: 1 });
  settle(sh.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { duration: 680, easing: OUT }), sh, { transform: 'translateY(0)' });
  scrim.addEventListener('click', () => closeSheet());
  S.sheet = { scrim, sh, onClose };
  dragToClose(sh);
  if (mount) mount(sh);
  reveal(sh, 280);
  return sh;
}
function closeSheet(instant) {
  const s = S.sheet; if (!s) return; S.sheet = null;
  if (instant) { s.scrim.remove(); s.sh.remove(); return; }
  s.scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: EASE, fill: 'forwards' });
  s.sh.animate([{ transform: s.sh.style.transform || 'translateY(0)' }, { transform: 'translateY(105%)' }], { duration: 520, easing: EASE, fill: 'forwards' })
    .finished.then(() => { s.scrim.remove(); s.sh.remove(); });
  if (s.onClose) s.onClose();
}
function dragToClose(sh) {
  let y0 = null, dy = 0;
  sh.addEventListener('pointerdown', e => { if (sh.scrollTop > 0 || e.target.closest('button,input,textarea,.battery')) return; y0 = e.clientY; dy = 0; sh.setPointerCapture(e.pointerId); });
  sh.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, (e.clientY - y0) / S.scale); sh.style.transform = `translateY(${dy}px)`; });
  sh.addEventListener('pointerup', () => {
    if (y0 === null) return; y0 = null;
    if (dy > 110) closeSheet();
    else settle(sh.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], { duration: 520, easing: OUT }), sh, { transform: 'translateY(0)' });
  });
}
function clearLayer() { $$('#layer > :not(.scrim):not(.sheet)').forEach(n => n.remove()); }
function toast(text) {
  const t = document.createElement('div');
  t.className = 'ghost-layer';
  t.innerHTML = `<div style="position:absolute;left:50%;bottom:120px;transform:translateX(-50%);padding:12px 18px;border-radius:99px;background:#111112;color:#fff;font-size:14px;font-weight:600;white-space:nowrap">${text}</div>`;
  layer.appendChild(t);
  const n = t.firstChild;
  n.animate([{ opacity: 0, transform: 'translate(-50%,10px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 560, easing: OUT, fill: 'forwards' });
  setTimeout(() => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: EASE, fill: 'forwards' }).finished.then(() => t.remove()), 2200);
}

/* ---------------- shared markup ---------------- */
let MARK = '<span style="font-weight:600;font-size:26px;letter-spacing:-.04em">iso</span>';
const fmt = n => n.toLocaleString('en-US');
const av = (k, s, cls = '') => `<img class="av ${cls}" src="${img(k, s)}" width="${s}" height="${s}" alt=""${k === 'you' ? ' style="object-position:50% 42%"' : ''}>`;
const btn = (label, cls = '', attrs = '') => `<button class="btn ${cls}" ${attrs}>${label}</button>`;
const liveBtn = (label, attrs) => `<div class="lw"><span class="lglow"></span>${btn(label, '', attrs)}</div>`;
const livecount = (n, tail = 'people here now') => `<div class="livecount" data-in><span class="dot"></span><span><span class="lc-n">${fmt(n)}</span> ${tail}</span></div>`;
const tile = o => {
  const t = `<button class="tile ${o.half ? 'half' : ''} ${o.go ? '' : 'static'}" ${o.go ? `data-go="${o.go}"` : ''} ${o.arg ? `data-arg="${o.arg}"` : ''} ${o.hl ? '' : 'data-in'}>
    <span class="eb">${o.eb}</span><span class="big ${o.size || ''}">${o.big}</span>${o.meta ? `<span class="meta">${o.meta}</span>` : ''}</button>`;
  return o.hl ? `<div class="hlw" data-in><span class="hlg"></span>${t}</div>` : t;
};
const hdr = (eb, title, size = 'xl') => `<button class="back" data-back>${I.back}</button>
  <div class="pg-hd"><div class="cap c3" data-in>${eb}</div><h1 class="${size}" data-in data-w>${title}</h1><div class="accent" data-in></div></div>`;
const peek = () => `<button class="peek" data-act="profile"><span class="grab"></span><span class="peek-row">${av('you', 44)}<span><b>Paul</b><span>Profile, Memories, ISO Live</span></span></span></button>`;
const topbar = () => `<div class="topbar" data-in><span class="mark">${MARK}</span><button class="avbtn" data-act="profile">${av('you', 32)}</button></div>`;
const pad2 = n => String(n).padStart(2, '0');
const hms = s => `${Math.floor(s / 3600)}:${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`;
const ms_ = s => `${Math.floor(s / 60)}:${pad2(s % 60)}`;

function setClock(o = {}) {
  const map = { before: '5:46', opening: '7:59', live: o.bloom ? '8:00' : '9:04', lastcall: '12:45', closed: '1:00' };
  $('#clock').textContent = map[S.night];
}
function markPanel() {
  $$('.panel [data-night]').forEach(b => b.classList.toggle('on', b.dataset.night === S.night));
}

/* ---------------- screens ---------------- */
const R = {}, M = {}, A = {};

/* onboarding */
R.splash = () => `<div class="glow" style="--o:.5;left:-60px;top:190px;width:520px;height:520px"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;z-index:2">
    <span class="mark bigmark" data-in>${MARK}</span><p class="body c2" data-in data-w>One conversation at a time.</p></div>
  <p class="cap c3 center" style="position:absolute;left:0;right:0;bottom:64px" data-in>Live tonight, 8 pm to 1 am</p>`;
M.splash = () => later(3200 * SP, () => go('welcome'));

R.welcome = () => `<div class="glow" style="--o:.4;left:-20px;top:40px;width:430px;height:430px"></div>
  <div style="position:absolute;left:0;right:0;top:214px;display:flex;justify-content:center;z-index:2"><span class="mark" data-in style="transform:scale(2.1)">${MARK}</span></div>
  <div class="pad" style="position:absolute;left:0;right:0;top:470px">
    <h1 class="l" data-in data-w>Meet one person. Really meet them.</h1>
    <p class="body c2" data-in style="margin-top:14px;max-width:320px">Live conversations with people at your school. One at a time, never a feed.</p></div>
  <div class="cta">${btn('Get started', '', 'data-go="email" data-mode="push"')}${btn('I already have an account', 'ghost', 'data-go="home"')}</div>`;

R.email = () => `<button class="back" data-back>${I.back}</button><div class="prog"><i style="width:11%"></i></div>
  <div class="pad" style="margin-top:36px"><h1 class="l" data-in data-w>What’s your school email?</h1>
  <p class="body c2" data-in style="margin-top:14px;max-width:320px">ISO is only for students. We’ll send a code to make sure it’s you.</p>
  <input class="field" id="email" type="email" inputmode="email" autocomplete="off" spellcheck="false" placeholder="you@college.harvard.edu" data-in style="margin-top:36px">
  <p class="cap c3" data-in style="margin-top:12px">Never shown on your profile.</p></div>
  <div class="cta">${btn('Send code', '', 'data-go="code" data-mode="push" disabled id="sendcode"')}</div>`;
M.email = el => {
  later(80, () => $('.prog i', el).style.width = '33%');
  const f = $('#email', el), b = $('#sendcode', el);
  f.addEventListener('input', () => { b.disabled = !/.+@.+\..+/.test(f.value); });
  f.addEventListener('keydown', e => { if (e.key === 'Enter' && !b.disabled) b.click(); });
};

R.code = () => `<button class="back" data-back>${I.back}</button><div class="prog"><i style="width:33%"></i></div>
  <div class="pad" style="margin-top:36px"><h1 class="l" data-in data-w>Check your inbox.</h1>
  <p class="body c2" data-in style="margin-top:14px;max-width:300px">We sent a six-digit code to paul.j@college.harvard.edu</p>
  <label class="otp" data-in>${'<div class="cell"></div>'.repeat(6)}<input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></label>
  <p class="cap c3" data-in style="margin-top:16px" id="resend">Resend in 0:24</p></div>
  <div class="cta">${btn('Verify', '', 'data-go="ready" disabled id="verify"')}</div>`;
M.code = el => {
  later(80, () => $('.prog i', el).style.width = '66%');
  const f = $('#otp', el), cells = $$('.cell', el); let r = 24, prev = 0;
  /* the six cells are a picture of one real input: type anywhere, the active cell carries the chromatic edge */
  const draw = () => {
    const v = f.value.replace(/\D/g, '').slice(0, 6); f.value = v;
    cells.forEach((c, j) => {
      c.classList.toggle('active', j === v.length && document.activeElement === f);
      c.innerHTML = v[j] || (j === v.length && document.activeElement === f ? '<span class="caret"></span>' : '');
      if (j < v.length && j >= prev) c.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: OUT });
    });
    prev = v.length; $('#verify', el).disabled = v.length < 6;
  };
  f.addEventListener('input', draw); f.addEventListener('focus', draw); f.addEventListener('blur', draw);
  f.addEventListener('keydown', e => { if (e.key === 'Enter' && f.value.length === 6) $('#verify', el).click(); });
  if (MODE === 'try') later(900, () => f.focus());
  every(1000, () => { r = Math.max(0, r - 1); $('#resend', el).textContent = `Resend in ${ms_(r)}`; });
};

R.ready = () => `<div class="glow" style="--o:.5;left:-90px;top:120px;width:580px;height:580px"></div>
  <div class="pad" style="position:absolute;left:0;right:0;top:300px">${livecount(S.count)}
  <h1 class="xl" data-in data-w style="margin-top:14px">You’re in.</h1>
  <p class="body c2" data-in style="margin-top:14px;max-width:300px">ISO is live tonight, 8 pm to 1 am. Come as you are.</p></div>
  <div class="cta">${liveBtn('Meet someone', 'data-go="home"')}</div>`;
M.ready = el => $('.prog') || null;

/* home: one page whose state follows the night */
R.home = o => {
  const n = S.night; let body = '', cta = '', glow = '';
  if (S.convo && (n === 'live' || n === 'lastcall')) {
    const last = S.msgs.filter(m => m.from).slice(-1)[0];
    body = `${livecount(S.count)}<h1 class="xl" data-in data-w style="margin-top:14px">You’re with Maya.</h1>
      <p class="body c2" data-in style="margin-top:18px;max-width:300px">The queue opens again when this conversation ends. That’s the whole idea.</p>
      <button class="convo-card" data-go="chat" data-in style="margin-top:34px">${av('maya', 64)}<span><b>Maya <span class="ydot"></span></b>
        <span class="body c2" style="display:block;font-size:15px;margin-top:2px">“${last ? last.text : 'I’m in. 8?'}”</span><span class="cap c3">Your conversation</span></span></button>`;
    cta = `${btn('Open chat', '', 'data-go="chat"')}${btn('Meet someone new', 'ghost', 'data-act="oneAtATime"')}`;
  } else if (n === 'before') {
    body = `<div class="state" data-in><span class="gdot"></span>Opens tonight at 8</div>
      <div class="count" data-in id="cd">${hms(S.cd)}</div><p class="title c2" data-in style="margin-top:4px">until ISO opens.</p>
      <div class="grid2" style="margin-top:40px">${tile({ half: 1, eb: 'Tonight', big: '8 pm – 1 am', meta: 'Everyone, at once' })}${tile({ half: 1, eb: 'Thursday', big: 'Late', size: 'l', meta: 'Open till 2 am', go: 'schedule' })}</div>`;
    cta = `${btn(S.remind ? `<span style="display:inline-flex;gap:8px;align-items:center">We’ll tap you at 8</span>` : 'Remind me at 8', 'secondary', 'data-act="remind" id="remind"')}<p class="cap c3 center">Nothing glows until someone’s here.</p>`;
  } else if (n === 'opening') {
    glow = `<div class="glow" id="rise" style="--o:.18;left:-60px;top:560px;width:520px;height:360px"></div>`;
    body = `<div class="state" data-in><span class="gdot"></span><span>Opening in <span id="oc">${ms_(S.oc)}</span></span></div>
      <div class="count huge" data-in id="wait">${S.waiting}</div><p class="title c2" data-in style="margin-top:4px;max-width:300px">people are waiting with you.</p>
      <p class="body c2" data-in style="margin-top:28px;max-width:300px">Doors open for everyone at the same moment, so your first match comes fast.</p>`;
    cta = btn('Opens at 8:00', '', 'disabled');
  } else if (n === 'lastcall') {
    body = `${livecount(318, 'people still here')}<h1 class="xl" data-in data-w style="margin-top:14px">Last call.</h1>
      <p class="body c2" data-in style="margin-top:18px;max-width:300px">Fifteen minutes left tonight. A conversation can keep going after close; the queue can’t.</p>
      <div data-in style="margin-top:40px"><div class="bar"><i id="lcbar"></i></div><div style="display:flex;justify-content:space-between;margin-top:10px" class="cap"><span class="c2">Closes at 1:00</span><span class="c3">15 min</span></div></div>`;
    cta = `${liveBtn('One more', 'data-go="searching"')}${btn('Call it a night', 'ghost', 'data-act="night" data-n="closed"')}`;
  } else if (n === 'closed') {
    body = `<div class="state" data-in><span class="gdot"></span>Closed</div><h1 class="xl" data-in data-w style="margin-top:14px">That’s tonight.</h1>
      <div class="grid2" style="margin-top:32px">${tile({ half: 1, eb: 'Tonight', big: '3', size: 'xl', meta: 'conversations' })}${tile({ half: 1, eb: 'Held', big: String(S.held.length + 1), size: 'xl', meta: S.held.length ? 'moments' : 'moment', go: 'memories' })}</div>
      <p class="title c2" data-in style="margin-top:28px">Back tomorrow at 8. Sleep well.</p>`;
    cta = btn('Open Memories', 'secondary', 'data-go="memories" data-mode="push"');
  } else {
    glow = `<div class="glow" id="homeglow" style="--o:.45;left:6px;top:${o.bloom ? 300 : 440}px;width:380px;height:${o.bloom ? 520 : 380}px"></div>`;
    body = `${livecount(S.count)}<h1 class="xl" data-in data-w style="margin-top:14px">${o.bloom ? 'ISO is live.' : 'Ready to meet someone?'}</h1>
      <p class="body c2" data-in style="margin-top:18px;max-width:300px">${o.bloom ? 'Everyone’s here at once. Find someone while it’s full.' : 'One person, live, right now. You talk until you both decide.'}</p>`;
    cta = `${liveBtn('Find someone', 'data-go="searching"')}<p class="cap c3 center">Tonight’s question is ready.</p>`;
  }
  return `${glow}${topbar()}<div class="pad" style="margin-top:62px">${body}</div><div class="cta home-cta" data-in>${cta}</div>${peek()}`;
};
M.home = (el, o) => {
  const pk = $('.peek', el);
  pk.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 900, delay: 420, easing: OUT, fill: 'backwards' });
  const tick = () => { S.count += Math.round(Math.random() * 11 - 3); const n = $('.lc-n', el); if (!n) return;
    n.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 260, easing: EASE }).finished.then(() => { n.textContent = fmt(S.count);
      n.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: OUT }); }); };
  if (S.night === 'live') every(3400, tick);
  if (S.night === 'before') every(1000, () => { S.cd = Math.max(0, S.cd - 1); const c = $('#cd', el); if (c) c.textContent = hms(S.cd); });
  if (S.night === 'opening') {
    const rise = $('#rise', el);
    rise.animate([{ opacity: .12, transform: 'translateY(60px)' }, { opacity: .32, transform: 'translateY(0)' }], { duration: S.oc * 1000, easing: 'linear', fill: 'forwards' });
    every(1000, () => {
      S.oc = Math.max(0, S.oc - 1); S.waiting += Math.round(2 + Math.random() * 4);
      $('#oc', el).textContent = ms_(S.oc); $('#wait', el).textContent = S.waiting;
      if (S.oc === 0) { clearTimers(); S.night = 'live'; S.oc = 12; S.waiting = 180; later(700, () => go('home', { bloom: true })); }
    });
  }
  if (S.night === 'lastcall') { const b = $('#lcbar', el); b.animate([{ width: '100%' }, { width: '0%' }], { duration: 900000, easing: 'linear', fill: 'forwards' }); }
  if (o.bloom) {
    const g = $('#homeglow', el);
    g.animate([{ opacity: 0, transform: 'scale(.5)' }, { opacity: .55, transform: 'scale(1)' }], { duration: 3200, easing: EASE, fill: 'backwards' });
  }
};

/* searching */
R.searching = () => `<div class="pad" style="padding-top:96px;text-align:center">${livecount(S.count)}
  <div class="orbit" data-in><div class="ripple"></div><div class="ripple"></div><div class="ripple"></div>
    <svg class="seek" viewBox="0 0 236 236"><circle cx="118" cy="118" r="116" fill="none" stroke="#E7E7EA" stroke-width="1.5"/><circle cx="118" cy="118" r="116" fill="none" stroke="url(#cg)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 116 * .62} 999"/></svg>
    <div class="glow coreglow"></div>${av('you', 96, 'core')}</div>
  <h2 class="title" data-in data-w style="margin-top:52px">Looking for someone who’s here.</h2>
  <p class="body c2" data-in style="margin-top:10px">Usually under a minute.</p></div>
  <div class="cta">${btn('Stop looking', 'ghost', 'data-go="home"')}</div>`;
M.searching = () => later(4200 * SP, () => go('match'));

/* match */
R.match = () => `<div class="pad"><div class="portrait" data-in><div class="glow pglow"></div><img src="${img('maya', 345, 404)}" alt="Maya">
    <div class="tag"><span class="dot"></span>Here now</div></div>
  <h1 class="l" data-in style="margin-top:22px">Maya</h1>
  <p class="body c2" data-in style="margin-top:2px">21  ·  Linguistics, Harvard ’27</p>
  <p class="cap c3" data-in style="margin-top:22px">You’ll both answer</p>
  <p class="voice" data-in data-w style="margin-top:4px">What’s the last thing that made you laugh out loud?</p></div>
  <div class="cta">${btn('Say hi', '', 'data-act="sayHi"')}</div>`;

/* conversation (live room + the one chat share one engine) */
const conv = mode => `<div class="conv ${mode}">
  <header class="conv-hd">
    <div class="who" data-in>${mode === 'chat' ? `<button class="back" data-act="chatBack">${I.back}</button>` : ''}${av('maya', 44)}
      <div><b>Maya</b><span class="st">${mode === 'room' ? '<span class="dot"></span>Here now' : '<span class="ydot" style="width:8px;height:8px"></span>Your conversation'}</span></div></div>
    <div class="hd-r" data-in>${mode === 'room' ? `<button class="pill" id="decide" data-act="decide">Ready to decide</button><button class="ic" data-act="report">${I.flag}</button>` : `<button class="pill" data-act="closeConvo">Close</button>`}</div>
    <div class="selbar"><button data-act="selCancel">Cancel</button><span style="width:auto">Hold a moment</span><span></span></div>
  </header>
  <div class="thread">${mode === 'room' ? `<div class="q" data-in><span class="cap c3">Tonight’s question</span><p>What’s the last thing that made you laugh out loud?</p></div>` : ''}
    <div class="msgs"><div class="wash"></div><div class="rail"></div><div class="handle h1"></div><div class="handle h2"></div><div class="mpill p1"><span class="dot"></span><span></span></div><div class="mpill p2"><span class="dot"></span><span></span></div></div></div>
  <div class="dock" data-in>${mode === 'room' ? `<div class="turn"><span class="ringwrap">${ring()}</span><b class="lbl" id="turnlbl">Maya’s turn</b><span class="lbl" id="turnsub">no rush</span></div>` : ''}
    <div class="composer"><input class="draft" id="draft" autocomplete="off" placeholder="Say something real"><button class="send" data-act="send">${I.up}</button></div></div>
  <p class="hint cap c3" id="hint">Long-press any message to hold it.</p>
  <div class="selpanel"><div class="sp-row" id="sprow"><span class="label">Now tap where it ends.</span></div><div id="spbtn"></div></div>
</div>`;
R.room = () => conv('room');
R.chat = () => conv('chat');

const scriptOf = () => (S.cur.name === 'room' ? ROOM : CHAT);
const stepKey = () => (S.cur.name === 'room' ? 'step' : 'chatStep');
function msgTime(i) { return `9:${pad2(Math.min(59, i))} PM`; }
function rowEl(m, i) {
  const r = document.createElement('div'); r.className = 'row ' + m.from; r.dataset.i = i;
  r.innerHTML = `<div class="bubble">${m.text}</div>`; return r;
}
function pushMsg(from, text) {
  const el = S.cur.el; const i = S.msgs.length;
  const m = { from, text, t: S.cur.name === 'room' ? msgTime(i * 1) : 'Wed ' + (6 + Math.floor(i / 10)) + ':' + pad2((i * 3) % 60) + ' PM' };
  S.msgs.push(m);
  const r = rowEl(m, i); $('.msgs', el).appendChild(r);
  r.firstChild.animate([{ opacity: 0, transform: `translateY(12px) scale(.97)`, transformOrigin: from === 'me' ? '100% 100%' : '0 100%' }, { opacity: 1, transform: 'none' }], { duration: 640, easing: OUT });
  scrollThread(el);
}
function scrollThread(el) { const t = $('.thread', el); t.scrollTo({ top: t.scrollHeight, behavior: 'smooth' }); }
function setTurn(who) {
  const el = S.cur.el, lbl = $('#turnlbl', el); if (!lbl) return;
  const arc = $('.turn .arc', el), C = 2 * Math.PI * 9;
  const set = (a, b) => { $$('.turn .lbl', el).forEach(n => n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: EASE })); lbl.textContent = a; $('#turnsub', el).textContent = b; };
  if (S._ringAnim) S._ringAnim.cancel();
  if (who === 'me') { set('Your turn', 'take your time'); S._ringAnim = arc.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: C * .72 }], { duration: 48000, easing: 'linear', fill: 'forwards' }); }
  else if (who === 'them') set('Maya’s turn', 'no rush');
  else set('Whenever you’re ready', '');
}
function typing(on) {
  const el = S.cur.el, box = $('.msgs', el); let t = $('.row.typingrow', el);
  if (on && !t) { t = document.createElement('div'); t.className = 'row them typingrow'; t.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>'; box.appendChild(t);
    t.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: OUT }); scrollThread(el); }
  if (!on && t) t.remove();
}
function advance() {
  const sc = scriptOf(), k = stepKey(), i = S[k], el = S.cur.el;
  const d = $('#draft', el);
  if (i >= sc.length) {
    setTurn('done'); d.value = ''; d.placeholder = 'Say something real'; $('.send', el).classList.remove('on');
    const dc = $('#decide', el); if (dc) dc.classList.add('ready');
    return;
  }
  const [from, text] = sc[i];
  if (from === 'them') {
    setTurn('them'); d.placeholder = 'Maya is typing'; $('.send', el).classList.remove('on');
    later(600 * SP, () => typing(true));
    later((1500 + text.length * 22) * SP, () => { typing(false); pushMsg('them', text); S[k]++; if (S[k] === 1) showHint(); later(500 * SP, advance); });
  } else {
    /* your turn: the script's line waits as a suggestion; type your own or just send it */
    setTurn('me'); d.placeholder = text; $('.send', el).classList.add('on');
  }
}
function myTurn() { const sc = scriptOf(), k = stepKey(); return sc[S[k]] && sc[S[k]][0] === 'me'; }
function showHint() {
  const h = $('#hint', S.cur.el); if (!h || S._hinted) return; S._hinted = true;
  h.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none', offset: .15 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 6000, easing: EASE });
}
function renderThread(el) {
  const box = $('.msgs', el);
  S.msgs.forEach((m, i) => { if (m.divider) { const d = document.createElement('div'); d.className = 'divider'; d.textContent = m.divider; box.appendChild(d); } else box.appendChild(rowEl(m, i)); });
  $('.thread', el).scrollTop = 1e6;
  wireBubbles(el);
}
M.room = el => {
  renderThread(el);
  if (S.step === 0 && !S.msgs.length) later(1300, advance); else later(300, advance);
};
M.chat = el => {
  if (!S.chatStarted) { S.chatStarted = true; S.msgs.push({ divider: 'You both said yes  ·  Wednesday' }); }
  renderThread(el); later(700, advance);
};
A.send = () => {
  const el = S.cur.el, d = $('#draft', el), sc = scriptOf(), k = stepKey();
  if (!myTurn()) return;
  clearTimers(); const text = d.value.trim() || sc[S[k]][1];
  d.value = ''; d.blur(); $('.send', el).classList.remove('on');
  pushMsg('me', text); S[k]++; later(700 * SP, advance);
};
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'draft') A.send(); });
A.sayHi = () => { S.msgs = []; S.step = 0; S.chatStep = 0; S.chatStarted = false; S._hinted = false; go('room'); };
A.chatBack = () => go('home');
A.report = () => toast('Report and block are one tap away here.');

/* long-press → hold a moment */
function wireBubbles(el) {
  const box = $('.msgs', el);
  let timer = null, pressed = null;
  box.addEventListener('pointerdown', e => {
    const b = e.target.closest('.bubble'); if (!b || el.querySelector('.conv.selecting')) return;
    pressed = b; b.classList.add('pressing');
    timer = setTimeout(() => { b.classList.remove('pressing'); liftMenu(+b.parentNode.dataset.i, b); pressed = null; }, 520);
  });
  const cancel = () => { clearTimeout(timer); if (pressed) pressed.classList.remove('pressing'); pressed = null; };
  box.addEventListener('pointerup', cancel); box.addEventListener('pointerleave', cancel); box.addEventListener('pointercancel', cancel);
  box.addEventListener('contextmenu', e => e.preventDefault());
  box.addEventListener('click', e => {
    const c = $('.conv', el); if (!c.classList.contains('selecting')) return;
    const r = e.target.closest('.row[data-i]'); if (!r) return;
    const i = +r.dataset.i;
    if (i < S.sel.start) { S.sel.start = i; } else S.sel.end = i;
    drawSel();
  });
}
function liftMenu(i, bubble) {
  const pr = phone.getBoundingClientRect(), r = bubble.getBoundingClientRect(), s = S.scale;
  const x = (r.left - pr.left) / s, y = (r.top - pr.top) / s, w = r.width / s, h = r.height / s;
  const wrap = document.createElement('div'); wrap.style.cssText = 'position:absolute;inset:0';
  wrap.innerHTML = `<div class="lp-dim"></div><div class="lp-glow" style="left:${x - 4}px;top:${y + 2}px;width:${w + 8}px;height:${h + 8}px"></div>
    <div class="lp-lift row ${S.msgs[i].from}" style="left:${x}px;top:${y}px;width:${w}px"><div class="bubble" style="width:${w}px">${S.msgs[i].text}</div></div>
    <div class="lp-menu" style="top:${Math.min(y + h + 12, 852 - 220)}px;${S.msgs[i].from === 'me' ? 'left:auto;right:24px;transform-origin:top right' : ''}">
      <button data-act="holdFrom" data-i="${i}">Hold a moment from here</button><button data-act="lpCopy">Copy</button><button data-act="lpReport">Report</button></div>`;
  layer.appendChild(wrap); S.lp = wrap;
  $('.lp-dim', wrap).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 460, easing: EASE, fill: 'forwards' });
  $('.lp-lift', wrap).animate([{ transform: 'scale(1)' }, { transform: 'translateY(-4px) scale(1.03)' }], { duration: 620, easing: OUT, fill: 'forwards' });
  $('.lp-glow', wrap).animate([{ opacity: 0 }, { opacity: .55 }], { duration: 900, easing: EASE, fill: 'forwards' });
  $('.lp-menu', wrap).animate([{ opacity: 0, transform: 'translateY(-6px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 90, easing: OUT, fill: 'forwards' });
  $('.lp-dim', wrap).addEventListener('click', closeLift);
}
function closeLift() {
  const w = S.lp; if (!w) return; S.lp = null;
  w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: EASE, fill: 'forwards' }).finished.then(() => w.remove());
}
A.lpCopy = () => { closeLift(); toast('Copied'); };
A.lpReport = () => { closeLift(); toast('Report opens a private sheet'); };
A.holdFrom = t => {
  closeLift(); const el = S.cur.el;
  S.sel = { start: +t.dataset.i, end: null };
  $('.conv', el).classList.add('selecting');
  $('#sprow', el).innerHTML = '<span class="label">Now tap where it ends.</span>'; $('#spbtn', el).innerHTML = '';
  drawSel();
};
A.selCancel = () => {
  const el = S.cur.el, c = $('.conv', el); c.classList.remove('selecting'); S.sel = null;
  $$('.row', el).forEach(r => r.classList.remove('dim'));
  $$('.rail,.wash,.handle,.mpill', el).forEach(n => n.style.opacity = 0);
};
function drawSel() {
  const el = S.cur.el, { start } = S.sel, end = S.sel.end ?? start;
  const rows = $$('.msgs .row[data-i]', el);
  rows.forEach(r => r.classList.toggle('dim', +r.dataset.i < start || (S.sel.end != null && +r.dataset.i > end)));
  const a = rows.find(r => +r.dataset.i === start), b = rows.find(r => +r.dataset.i === end);
  const top = a.offsetTop, bot = b.offsetTop + b.offsetHeight;
  const rail = $('.rail', el), wash = $('.wash', el), h1 = $('.h1', el), h2 = $('.h2', el), p1 = $('.p1', el), p2 = $('.p2', el);
  Object.assign(rail.style, { top: top + 'px', height: (bot - top) + 'px', opacity: S.sel.end != null ? 1 : 0 });
  Object.assign(wash.style, { top: (top - 10) + 'px', height: (bot - top + 20) + 'px', opacity: S.sel.end != null ? 1 : 0 });
  Object.assign(h1.style, { top: top + 'px', opacity: 1 }); Object.assign(h2.style, { top: bot + 'px', opacity: S.sel.end != null ? 1 : 0 });
  /* markers sit on the bubble's own side: the neighbouring row is usually the other speaker, so that side is free */
  const side = m => (m.from === 'me' ? { left: 'auto', right: '0px' } : { left: '0px', right: 'auto' });
  p1.lastChild.textContent = 'Starts  ' + S.msgs[start].t; Object.assign(p1.style, { top: (top - 30) + 'px', ...side(S.msgs[start]), opacity: 1 });
  if (S.sel.end != null) {
    p2.lastChild.textContent = 'Ends  ' + S.msgs[end].t;
    Object.assign(p2.style, { top: (bot + 8) + 'px', ...side(S.msgs[end]), opacity: 1 });
    const n = rows.filter(r => +r.dataset.i >= start && +r.dataset.i <= end).length;
    $('#sprow', el).innerHTML = `<span class="label">${n} message${n > 1 ? 's' : ''}  ·  ${S.msgs[start].t.replace(' PM', '')} – ${S.msgs[end].t}</span><span class="cap c3">Tap to adjust</span>`;
    if (!$('#spbtn .btn', el)) { $('#spbtn', el).innerHTML = btn('Keep this moment', '', 'data-act="keepMoment"'); $('#spbtn .btn', el).animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: OUT }); }
  } else p2.style.opacity = 0;
}
A.keepMoment = () => {
  const { start, end } = S.sel, list = S.msgs.slice(start, end + 1).filter(m => m.from);
  const first = list.find(m => m.from === 'them') || list[0], last = list[list.length - 1];
  const line = m => `<p><b>${m.from === 'them' ? 'M.' : 'You'}</b>${m.text}</p>`;
  openSheet(`<div class="excerpt" data-in>${line(first)}${last !== first ? line(last) : ''}<span class="cap c3">${list.length} messages  ·  ${S.msgs[start].t.replace(' PM', '')} – ${S.msgs[end].t}</span></div>
    <h2 class="title" data-in style="margin-top:24px">What did it make you feel?</h2>
    <div class="words" data-in>${['Laughed', 'Seen', 'Calm', 'Curious', 'Butterflies', 'Comforted', 'Drained', 'Uneasy'].map(w => `<button class="word" data-act="toggle">${w}</button>`).join('')}</div>
    <p class="cap c3" data-in style="margin-top:20px">Why it mattered</p>
    <input class="field" data-in style="margin-top:8px" placeholder="A line for future you" id="why">
    <p class="cap c3" data-in style="margin-top:12px">Their words stay; their name becomes an initial. If either of you blocks, this moment is removed.</p>
    <div data-in style="margin-top:14px">${btn('Hold it', '', 'data-act="holdIt"')}</div>`, {});
};
A.toggle = t => { t.classList.toggle('on'); };
A.holdIt = () => {
  const sh = S.sheet.sh, { start, end } = S.sel;
  const feelings = $$('.word.on', sh).map(w => w.textContent);
  const m = { id: 'm' + Date.now(), convo: S.cur.name === 'room' ? 'tonight' : 'tonight', feelings: feelings.length ? feelings : ['Laughed'], note: $('#why', sh).value || 'I laughed so hard I forgot to be nervous.',
    time: 'Tonight, ' + S.msgs[start].t, range: `${S.msgs[start].t.replace(' PM', '')} – ${S.msgs[end].t}`, msgs: S.msgs.slice(start, end + 1).filter(x => x.from).map(x => ({ from: x.from, text: x.text })), fresh: true };
  S.held.forEach(h => h.fresh = false); S.held.unshift(m);
  closeSheet(); A.selCancel();
  setTimeout(() => heldToast(m), 380);
};
function heldToast(m) {
  const q = m.msgs.find(x => x.from === 'them') || m.msgs[0];
  const t = document.createElement('div'); t.className = 'held';
  t.innerHTML = `<div class="hlw"><span class="hlg"></span><div class="tile static" style="gap:10px;padding:18px 20px">
    <div class="row2"><span class="label">Held.</span><button class="open" data-act="openMemories">Open Memories</button></div>
    <span class="big" style="font-size:20px;line-height:1.25">“${q.text}”</span><span class="meta">M.  ·  ${m.feelings.join(', ')}</span></div></div>`;
  layer.appendChild(t);
  t.animate([{ opacity: 0, transform: 'translateY(24px) scale(.98)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 760, easing: OUT, fill: 'forwards' });
  setTimeout(() => t.isConnected && t.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 900, easing: EASE, fill: 'forwards' }).finished.then(() => t.remove()), 4200);
}
A.openMemories = () => go('memories', { mode: 'push' });

/* keep talking */
R.decide = () => `<div class="pad" style="padding-top:96px">
  <div class="pair" data-in>${av('you', 44)}${av('maya', 44)}</div>
  <p class="cap c3" data-in style="margin-top:10px">14 minutes together</p>
  <h1 class="l" data-in data-w style="margin-top:40px">Keep talking?</h1>
  <p class="body c2" data-in style="margin-top:14px;max-width:310px">Choose privately. You’ll both see the answers at the same moment.</p>
  <div class="seals" data-in>
    <div class="seal you"><div class="inner"><div class="face f-front"><span class="cap">You</span><b id="yourpick">Not yet</b></div><div class="face f-back"><span class="cap">You</span><span><span class="ydot"></span><b style="display:block;margin-top:10px">Yes</b></span></div></div></div>
    <div class="seal her"><div class="glow sglow"></div><div class="inner"><div class="face f-front"><span class="cap">Maya</span><b>Sealed</b></div><div class="face f-back"><span class="cap">Maya</span><span><span class="ydot"></span><b style="display:block;margin-top:10px">Yes</b></span></div></div></div>
  </div>
  <p class="sealnote cap c2"><svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="#E7E7EA" stroke-width="2.2"/><circle cx="11" cy="11" r="9" fill="none" stroke="url(#cg)" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="20 999"/></svg>Sealed. Revealing together.</p></div>
  <div class="cta" id="decidecta">${btn('Keep talking', '', 'data-act="keep"')}${btn('Not this time', 'ghost', 'data-act="notThisTime"')}</div>`;
A.decide = () => go('decide');
A.keep = () => {
  const el = S.cur.el, you = $('.seal.you', el), pick = $('#yourpick', el);
  you.classList.add('chosen');
  pick.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: EASE }).finished.then(() => { pick.innerHTML = 'Keep<br>talking'; pick.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: OUT }); });
  const cta = $('#decidecta', el); cta.style.pointerEvents = 'none';
  cta.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 500, easing: EASE, fill: 'forwards' });
  $('.sealnote', el).animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 300, easing: OUT, fill: 'forwards' });
  later(3000 * SP, () => $('.seals', el).classList.add('flip'));
  later(5000 * SP, () => go('mutual'));
};
A.notThisTime = () => go('parted');
R.parted = () => `<div class="pad" style="padding-top:150px"><p class="cap c3" data-in>Keep talking?</p>
  <h1 class="xl" data-in data-w style="margin-top:8px">Not this time.</h1>
  <p class="body c2" data-in style="margin-top:18px;max-width:300px">It closes kindly for both of you. Maya sees a thank-you, never a no.</p></div>
  <div class="cta">${btn('Continue', '', 'data-act="toReflect"')}</div>`;

/* mutual */
R.mutual = () => `<div class="glow" style="--o:.32;left:-160px;top:-40px;width:720px;height:720px"></div><div class="yeshalo"></div>
  <div class="pad" style="text-align:center"><div class="pair mutual-pair" data-in>${av('you', 96)}${av('maya', 96)}<span class="ydot" id="ydot"></span></div>
  <h1 class="xl" data-in data-w style="margin-top:56px">You both said yes.</h1>
  <p class="body c2" data-in style="margin:18px auto 0;max-width:280px">Maya is in your chat now. No timer from here.</p></div>
  <div class="cta">${btn('Open chat', '', 'data-go="chat"')}</div>`;
M.mutual = el => {
  S.convo = true;
  $('.yeshalo', el).animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 2400, easing: OUT, fill: 'backwards', delay: 300 });
  $('#ydot', el).animate([{ transform: 'scale(0)' }, { transform: 'scale(1.12)', offset: .6 }, { transform: 'scale(1)' }], { duration: 900, delay: 900, easing: OUT, fill: 'backwards' });
};

/* close + one-at-a-time */
A.closeConvo = () => openSheet(`<h2 class="title" data-in>Close this conversation?</h2>
  <p class="body c2" data-in style="margin-top:10px">You’ll both go back to the queue. No one is left wondering.</p>
  <div class="notecard" data-in style="margin-top:20px"><p class="cap c3">What Maya sees</p><p class="body" style="margin-top:4px">Paul closed the conversation. Thanks for the time together.</p></div>
  <div data-in style="margin-top:18px">${btn('Close kindly', '', 'data-act="closeKindly"')}${btn('Stay', 'ghost', 'data-act="sheetClose"')}</div>`);
A.closeKindly = () => { S.convo = false; S.chatStarted = false; go('reflect1'); };
A.sheetClose = () => closeSheet();
A.oneAtATime = () => openSheet(`<div class="glow" style="--o:.35;left:-50px;top:-40px;width:220px;height:220px"></div>
  <h2 class="title" data-in style="position:relative">One conversation<br>at a time.</h2>
  <p class="body c2" data-in style="margin-top:12px;position:relative">You’re talking with Maya. To meet someone new, close this conversation first. She gets a kind note, never a silence.</p>
  <div data-in style="margin-top:22px">${btn('Stay with Maya', '', 'data-act="toChat"')}${btn('Close this conversation', 'ghost', 'data-act="closeConvo"')}</div>`);
A.toChat = () => go('chat');

/* profile sheet */
A.profile = () => openSheet(`<div style="display:flex;justify-content:space-between;align-items:flex-start" data-in>${av('you', 88)}<button class="pill">Edit</button></div>
  <h2 class="l" data-in style="margin-top:18px">Paul, 22</h2><p class="body c2" data-in>Harvard ’27  ·  Verified</p>
  <div class="tile static" data-in style="margin-top:22px;min-height:0"><span class="eb">This week</span><span class="big">4 conversations.<br>1 kept going.</span></div>
  <div class="rows" data-in>
    <button class="rowlink" data-act="toMemories">Memories<span>${S.held.length + 12}${I.chev}</span></button>
    <button class="rowlink" data-act="toSchedule">ISO Live this week<span>Thu Late${I.chev}</span></button>
    <button class="rowlink" data-act="toMaybe">Maybe we’ll meet again<span>1 held${I.chev}</span></button>
    <button class="rowlink" data-act="toSafety">Safety center<span>${I.chev}</span></button></div>
  <p class="cap c3 center" data-in style="margin-top:22px">ISO never ranks people. Only how the conversations felt.</p>`, { cls: 'tall' });
const fromSheet = name => () => { closeSheet(); setTimeout(() => go(name, { mode: 'push' }), 120); };
A.toMemories = fromSheet('memories'); A.toSchedule = fromSheet('schedule'); A.toMaybe = fromSheet('maybe'); A.toSafety = fromSheet('safety');

/* reflection, after a conversation */
const steps = n => `<div class="steps">${[1, 2, 3].map(i => `<i class="${i < n ? 'done' : i === n ? 'now' : ''}"></i>`).join('')}</div>`;
const rtop = (eb, n) => `<div class="pad" style="padding-top:96px;display:flex;justify-content:space-between;align-items:center"><span class="cap c3" data-in>${eb}</span><span data-in>${steps(n)}</span></div>`;
A.toReflect = () => go('reflect1');
R.reflect1 = () => `${rtop('After Maya  ·  14 minutes', 1)}<div class="pad"><h1 class="l" data-in data-w style="margin-top:12px">How did that feel?</h1>
  <div class="feel" data-in>${['Drained', 'Flat', 'Fine', 'Warm', 'Lit up'].map((w, i) => `<button data-act="feel" data-i="${i}" class="${i === S.feel ? 'on' : ''}"><span class="c" style="width:${22 + i * 7}px;height:${22 + i * 7}px"></span>${w}</button>`).join('')}</div>
  <p class="label" data-in style="margin-top:48px">What did you bring to it?</p>
  <div class="chips" data-in style="margin-top:14px">${['Curiosity', 'Humor', 'Honesty', 'Patience', 'Nerves', 'Half my attention'].map(c => `<button class="chip ${['Curiosity', 'Humor'].includes(c) ? 'on' : ''}" data-act="toggle">${c}</button>`).join('')}</div>
  <p class="cap c3" data-in style="margin-top:18px">About you and the conversation. Never a rating of Maya.</p></div>
  <div class="cta">${btn('Next', '', 'data-go="reflect2"')}${btn('Skip all', 'ghost', 'data-go="home"')}</div>`;
A.feel = t => { S.feel = +t.dataset.i; $$('.feel button', S.cur.el).forEach((b, i) => b.classList.toggle('on', i === S.feel)); };
R.reflect2 = () => `${rtop('A quick check-in', 2)}<div class="pad"><h1 class="l" data-in data-w style="margin-top:12px">And you, right now?</h1>
  <p class="cap c3" data-in style="margin-top:30px">Social battery</p>
  <div class="battery" data-in id="bat"><div class="lvl"></div><div class="knob"></div><div class="bl"></div></div>
  <div data-in style="display:flex;justify-content:space-between;margin-top:8px" class="cap c3"><span>Drained</span><span>Full</span></div>
  <p class="label" data-in style="margin-top:36px">What would help tonight?</p>
  <div class="chips" data-in style="margin-top:14px">${['A break', 'Water and sleep', 'Text a friend', 'Go outside', 'One more conversation'].map(c => `<button class="chip ${['A break', 'Water and sleep'].includes(c) ? 'on' : ''}" data-act="toggle">${c}</button>`).join('')}</div>
  <p class="cap c3" data-in style="margin-top:18px">This stays with you. It never changes who you’re matched with.</p></div>
  <div class="cta">${btn('Next', '', 'data-go="reflect3"')}${btn('Skip', 'ghost', 'data-go="home"')}</div>`;
M.reflect2 = el => {
  const bat = $('#bat', el);
  const draw = () => { const p = S.battery, w = 345 * p / 100; $('.lvl', bat).style.width = p + '%'; $('.knob', bat).style.left = Math.max(10, w - 2) + 'px'; const bl = $('.bl', bat); bl.textContent = p < 34 ? 'Running low' : p < 70 ? 'Steady' : 'Full'; bl.style.left = Math.min(Math.max(10, w) + 16, 345 - 120) + 'px'; };
  draw();
  const at = e => { const r = bat.getBoundingClientRect(); S.battery = Math.round(Math.min(100, Math.max(4, (e.clientX - r.left) / r.width * 100))); draw(); };
  bat.addEventListener('pointerdown', e => { bat.setPointerCapture(e.pointerId); bat.classList.add('dragging'); at(e); bat.onpointermove = at; });
  bat.addEventListener('pointerup', () => { bat.classList.remove('dragging'); bat.onpointermove = null; });
};
R.reflect3 = () => `${rtop('Something to keep', 3)}<div class="pad"><h1 class="l" data-in data-w style="margin-top:12px">One thing to carry forward?</h1>
  <input class="field" data-in id="takeaway" style="margin-top:32px" placeholder="In your words">
  <p class="cap c3" data-in style="margin-top:24px">Or borrow one</p>
  <div class="chips" data-in style="margin-top:12px">${['I’m funnier when I’m not trying', 'Asking a second question works', 'I can end things kindly'].map(c => `<button class="chip" data-act="borrow">${c}</button>`).join('')}</div></div>
  <div class="cta">${btn('Save to Memories', '', 'data-act="saveReflect"')}${btn('Skip', 'ghost', 'data-go="home"')}</div>`;
A.borrow = t => { const f = $('#takeaway', S.cur.el); f.value = t.textContent + '.'; f.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 500, easing: EASE }); };
A.saveReflect = () => { const v = $('#takeaway', S.cur.el).value.trim(); if (v) S.takeaways.unshift(v); go('home'); setTimeout(() => toast('Saved to Memories'), 600); };

/* memories */
R.memories = () => {
  const fresh = S.held.find(h => h.fresh);
  const heldTiles = [...S.held, ...SEED_MOMENTS].slice(0, 3).map(m => {
    const q = m.msgs.find(x => x.from === 'them') || m.msgs[0];
    return tile({ eb: `Held  ·  ${m.time}`, big: `“${q.text}”`, meta: `${CONVOS[m.convo].who}  ·  ${m.feelings.join(', ')}`, go: 'moment', arg: m.id, hl: m === fresh });
  }).join('');
  const c = CONVOS.tonight;
  return `${hdr('Private  ·  only you', 'Memories')}<div class="page"><div class="bento">
    ${tile({ eb: c.date, big: c.q, meta: `${c.meta.replace('you both ', '')}  ·  ${S.held.filter(h => h.convo === 'tonight').length || 1} held`, go: 'conversation', arg: 'tonight', hl: !fresh })}
    <div class="grid2">${tile({ half: 1, eb: 'This week', big: '4', size: 'xl', meta: 'conversations', go: 'felt' })}${tile({ half: 1, eb: 'Mostly', big: 'Laughed.', meta: 'How it’s felt', go: 'felt' })}</div>
    ${heldTiles}
    <div class="grid2">${tile({ half: 1, eb: 'Carrying', big: String(4 + S.takeaways.length), size: 'xl', meta: 'things, in your words', go: 'carrying' })}${tile({ half: 1, eb: 'Sunday', big: 'Your week', meta: 'Whenever you want it', go: 'week' })}</div>
    ${['oct9', 'oct7', 'sept28'].map(k => tile({ eb: CONVOS[k].date, big: CONVOS[k].q, meta: CONVOS[k].meta, go: 'conversation', arg: k })).join('')}
  </div></div>`;
};
R.conversation = o => {
  const c = CONVOS[o.arg || 'tonight'];
  const m = [...S.held, ...SEED_MOMENTS].find(h => h.convo === (o.arg || 'tonight')) || (o.arg === 'tonight' || !o.arg ? { id: 'demo', range: '9:04 – 9:07 PM', msgs: [{ from: 'them', text: 'The whole street clapped when she finally got it. She bowed.' }, { from: 'me', text: 'I’m crying. Did you clap too' }] } : null);
  const held = m ? `<button class="tile" data-go="moment" data-arg="${m.id}" data-in style="gap:10px"><span class="eb">Held  ·  ${m.range}</span>
      <span class="msgs" style="gap:8px">${m.msgs.slice(-2).map(x => `<span class="row ${x.from}"><span class="bubble" style="${x.from === 'them' ? 'background:#fff' : ''};font-size:15px">${x.text}</span></span>`).join('')}</span></button>` : '';
  return `${hdr(`${c.date}  ·  ${c.when}`, c.q, 'l')}<div class="page" style="margin-top:-12px"><p class="cap c2" data-in style="margin-bottom:22px">${c.meta}</p><div class="bento">${held}
    <div class="grid2">${tile({ half: 1, eb: 'Felt', big: c.felt, meta: 'After it ended' })}${tile({ half: 1, eb: 'You brought', big: c.brought, meta: 'Your words' })}</div>
    ${tile({ eb: 'You took away', big: c.took, meta: 'In Carrying', go: 'carrying' })}</div>
    <p class="label c2" data-in style="margin-top:28px">Remove from my Memories</p>
    <p class="cap c3" data-in style="margin-top:6px">Removes your copy only. If either of you blocks, it’s removed for both.</p></div>`;
};
R.moment = o => {
  const m = [...S.held, ...SEED_MOMENTS].find(h => h.id === o.arg) || { feelings: ['Laughed'], range: '9:04 – 9:07 PM', time: 'Tonight', note: 'I laughed so hard I forgot to be nervous.', convo: 'tonight', msgs: [{ from: 'them', text: 'The whole street clapped when she finally got it. She bowed.' }, { from: 'me', text: 'I’m crying. Did you clap too' }] };
  return `${hdr(`Held  ·  ${m.range}`, FEEL_LINE[m.feelings[0]] || 'You held this.', 'l')}<div class="page">
    <p class="cap c3" data-in>${CONVOS[m.convo].who}</p>
    <div class="msgs" data-in style="margin-top:8px">${m.msgs.map(x => `<div class="row ${x.from}"><div class="bubble">${x.text}</div></div>`).join('')}</div>
    <p class="title" data-in style="margin-top:36px">“${m.note}”</p><p class="cap c3" data-in style="margin-top:8px">Your note  ·  ${m.feelings.join(', ')}</p>
    <div data-in style="display:flex;gap:28px;margin-top:40px" class="label"><span class="c2">Edit note</span><span class="c3">Let it go</span></div></div>`;
};
R.felt = () => `${hdr('Last four weeks', 'How it’s felt')}<div class="page"><div class="bento">
  ${tile({ eb: 'Mostly', big: 'Laughter, then curiosity.', size: 'l', meta: 'Across 11 conversations' })}
  <div class="grid2">${tile({ half: 1, eb: 'Talked', big: '11', size: 'xl', meta: 'conversations' })}${tile({ half: 1, eb: 'Kept going', big: '3', size: 'xl', meta: 'both said yes' })}</div>
  <div class="grid2">${tile({ half: 1, eb: 'Met up', big: '1', size: 'xl', meta: 'real-life date' })}${tile({ half: 1, eb: 'Heavy', big: '2', size: 'xl', meta: 'nights, both late' })}</div>
  ${tile({ eb: 'Something you might notice', big: 'You felt most seen when it ran past fifteen minutes.', meta: 'From your reflections', hl: true })}
  ${tile({ eb: 'Something we noticed', big: 'Late nights have felt heavier.', meta: 'Open', go: 'noticed' })}</div>
  <p class="cap c3 center" data-in style="margin-top:24px">It can dip, but there’s no score to lose.</p></div>`;
R.noticed = () => `${hdr('Something we noticed', 'Late nights have felt heavier lately.', 'l')}<div class="page"><p class="body c2" data-in style="margin:-6px 0 22px">Worth noticing, not fixing.</p><div class="bento">
  <div class="grid2">${tile({ half: 1, eb: 'After midnight', big: '3 of 3', meta: 'felt drained' })}${tile({ half: 1, eb: 'Before 11 pm', big: '0 of 6', meta: 'felt drained' })}</div>
  ${tile({ eb: 'If you want', big: 'Soft stop at midnight.', meta: 'ISO quietly closes the queue for you. Turn it off anytime.', hl: true })}
  ${tile({ eb: 'Or', big: 'Take tomorrow off.', meta: 'The queue will be here.' })}
  ${tile({ eb: 'If it’s more than a rough night', big: 'Harvard CAMHS, 24/7. Or call or text 988.', meta: 'ISO isn’t therapy. These are people who can help.' })}</div></div>`;
R.carrying = () => `${hdr('Takeaways, in your words', 'Carrying')}<div class="page"><div class="bento">
  ${S.takeaways.map(t => tile({ eb: 'Tonight', big: t, size: 'l', meta: 'After a conversation with M.', hl: true })).join('')}
  ${tile({ eb: 'Thursday', big: 'I’m funnier when I’m not trying.', size: 'l', meta: 'After a conversation with M.', hl: !S.takeaways.length })}
  ${tile({ eb: 'Tuesday', big: 'Asking a second question changes everything.', meta: 'After a conversation with S.' })}
  <div class="grid2">${tile({ half: 1, eb: 'Oct 7', big: 'It’s okay to end things kindly.', meta: 'With A.' })}${tile({ half: 1, eb: 'Sept 28', big: 'I like curious people.', meta: 'With J.' })}</div></div></div>`;
R.week = () => `${hdr('Oct 9 – 15  ·  just for you', 'Your week')}<div class="page">
  <h2 class="l" data-in>You <span style="background:linear-gradient(90deg,#FF8A3D,#FF5BA8,#B86BFF);-webkit-background-clip:text;background-clip:text;color:transparent">laughed</span> in 3 of your 4 conversations.</h2>
  <div data-in style="margin-top:28px">${tile({ eb: 'Your favourite moment', big: '“The whole street clapped when she finally got it. She bowed.”', meta: 'Thursday, 9:04 PM', go: 'moment', arg: (S.held[0] || {}).id || 'x' })}</div>
  <h2 class="l" data-in style="margin-top:56px">You brought curiosity to every one of them.</h2>
  <div class="bento" style="margin-top:28px"><div class="grid2">${tile({ half: 1, eb: 'Longest', big: '31 min', meta: 'Tuesday' })}${tile({ half: 1, eb: 'Held', big: String(S.held.length + 2), size: 'xl', meta: 'moments' })}</div>
  ${tile({ eb: 'Something to try', big: 'Wrap up by midnight next week.', meta: 'Your late chats felt heavier.' })}</div>
  <p class="cap c3 center" data-in style="margin-top:28px">No streaks, no score. Skip any week.</p></div>`;
R.schedule = () => `${hdr('Same hours for everyone', 'This week')}<div class="page"><div class="bento">
  ${tile({ eb: 'Thursday', big: 'Thursday Late', size: 'l', meta: '8 pm – 2 am  ·  every question is about home', hl: true })}
  <div class="grid2">${tile({ half: 1, eb: 'Tonight', big: '8 – 1', size: 'l', meta: 'Tuesday' })}${tile({ half: 1, eb: 'Wednesday', big: '8 – 1', size: 'l', meta: 'Regular hours' })}</div>
  ${tile({ eb: 'Sunday', big: 'Slow Sunday', size: 'l', meta: '4 – 7 pm  ·  daylight, coffee first, shorter rooms' })}
  ${tile({ eb: 'Finals week', big: 'Coffee Hour', size: 'l', meta: '3 – 5 pm  ·  ten-minute conversations, then back to work' })}
  <div class="grid2">${tile({ half: 1, eb: 'Friday', big: 'Off', size: 'l', meta: 'Go out instead' })}${tile({ half: 1, eb: 'Saturday', big: 'Off', size: 'l', meta: 'Rest' })}</div></div>
  <p class="cap c3 center" data-in style="margin-top:24px">ISO Plus never buys early or extra hours.</p></div>`;
R.maybe = () => `${hdr('One slot', 'Maybe we’ll meet again.', 'l')}<div class="page">
  <p class="body c2" data-in style="margin:-6px 0 24px">Hold one past conversation. If they quietly hold you too, ISO may bring you back. If not, it fades on its own. No one is ever told.</p>
  <div class="hlw" data-in><span class="hlg"></span><div class="tile static"><span class="eb">Sept 28  ·  Best meal under ten dollars</span>
    <span style="display:flex;gap:14px;align-items:center">${av('jordan', 64)}<span class="big l">Jordan</span></span>
    <span><span class="bar" style="display:block"><i style="width:40%;animation:none;background:#A1A1A6"></i></span><span class="meta" style="display:block;margin-top:10px">Fades quietly in 9 days</span></span></div></div>
  <p class="cap c3" data-in style="margin-top:14px">Holding someone new releases Jordan.</p>
  <div data-in style="margin-top:28px">${btn('Release', 'secondary', 'data-back')}</div></div>`;
R.safety = () => `${hdr('Always one tap away', 'Safety.')}<div class="page"><div class="bento">
  ${tile({ eb: 'Blocks', big: 'Blocks are absolute.', meta: 'A blocked person can never match you, find you again, or keep a moment with you.', hl: true })}
  <div class="grid2">${tile({ half: 1, eb: 'Blocked', big: '2', size: 'xl', meta: 'people' })}${tile({ half: 1, eb: 'Your reports', big: '1', size: 'xl', meta: 'reviewed' })}</div>
  ${tile({ eb: 'In an emergency', big: 'Call 911. Harvard police: HUPD.', meta: 'Share your date plans with a friend from any chat.' })}</div></div>`;

/* ---------------- events ---------------- */
phone.addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-back],[data-act]'); if (!t || t.disabled) return;
  if (t.hasAttribute('data-back')) return back();
  if (t.dataset.act) { const f = A[t.dataset.act]; if (f) f(t, e); return; }
  if (t.dataset.go) {
    if (t.classList.contains('tile')) return expand(t, t.dataset.go, { arg: t.dataset.arg });
    go(t.dataset.go, { mode: t.dataset.mode || (['memories', 'schedule'].includes(t.dataset.go) && S.cur && S.cur.name !== 'home' ? 'push' : 'fade'), arg: t.dataset.arg });
  }
});
A.remind = t => { S.remind = !S.remind; t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EASE }).finished.then(() => { t.innerHTML = S.remind ? 'We’ll tap you at 8' : 'Remind me at 8'; t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 480, easing: EASE }); }); };
A.night = t => { S.night = t.dataset.n; go('home'); };

$$('.panel [data-night]').forEach(b => b.addEventListener('click', () => { S.night = b.dataset.night; if (S.night === 'opening') { S.oc = 12; S.waiting = 180; } if (S.night === 'before') S.cd = 2 * 3600 + 14 * 60 + 8; go('home'); }));
$$('.panel [data-jump]').forEach(b => b.addEventListener('click', () => {
  const j = b.dataset.jump; S.night = j === 'onboarding' ? S.night : 'live';
  const full = () => { S.msgs = ROOM.map(([from, text], i) => ({ from, text, t: msgTime(i) })); S.step = ROOM.length; };
  if (j === 'reset') return location.reload();
  if (j === 'onboarding') return go('splash');
  if (j === 'home') { S.convo = false; return go('home'); }
  if (j === 'room') { S.convo = false; return A.sayHi(); }
  if (j === 'hold') { S.convo = false; full(); S._hinted = false; go('room'); return later(900, showHint); }
  if (j === 'decide') { full(); return go('decide'); }
  if (j === 'chat') { full(); S.convo = true; S.chatStep = 0; S.chatStarted = false; return go('chat'); }
  if (j === 'reflect') return go('reflect1');
  if (j === 'memories') return go('memories');
}));

/* ---------------- fit + boot ---------------- */
function fit() {
  if (FILM || EMBED) { S.scale = 1; return; }
  const side = innerWidth > 1000 ? 600 : 40;
  S.scale = Math.min(1, (innerHeight - 56) / 852, (innerWidth - side) / 393);
  $('#scaler').style.transform = `scale(${S.scale})`;
}
addEventListener('resize', fit); fit();
fetch('mark.svg').then(r => (r.ok ? r : fetch('../mark.svg'))).then(r => r.text()).then(t => {
  const paths = t.match(/<path[^>]*\/>/g) || [];
  MARK = `<svg viewBox="414 692 122 66" aria-label="ISO">${paths.map(p => p.replace(/fill="#16130F"/, 'fill="currentColor"')).join('')}</svg>`;
}).catch(() => {}).finally(() => { window.APP_READY = true; if (MODE === 'try') go('splash'); else if (MODE === 'watch' && window.T) T.watch(); });

/* the film director (film-features.html) drives the app from the parent page */
window.APP = { S, go, A, back, myTurn: () => myTurn() };
