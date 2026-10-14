/* The tour: a finger that drives the real prototype (no faked screens).
   Watch mode (?mode=watch) runs T.watch() with captions beside the phone.
   The feature film (film-features.html) reuses the same primitives at a faster pace and points
   its camera at T.at, the spot the finger is heading for. */

const T = window.T = {
  speed: 1,        // multiplies every tour wait and finger move
  x: 196, y: 640,  // finger position, phone px
  at: { x: 196, y: 426 }, // where the finger is going (the film camera follows this)
  stopped: false,
  autoHide: false, // film: the finger only appears for each touch
};
const finger = document.createElement('div');
finger.id = 'finger'; finger.innerHTML = '<span class="rip"></span><span class="tip"></span>';
phone.appendChild(finger);
finger.style.transform = `translate(${T.x}px,${T.y}px)`;

const tick = ms => new Promise(r => setTimeout(r, ms));
T.wait = ms => tick(ms * T.speed);

T.local = el => {
  const pr = phone.getBoundingClientRect(), r = el.getBoundingClientRect(), s = S.scale || 1;
  return { x: (r.left - pr.left + r.width / 2) / s, y: (r.top - pr.top + r.height / 2) / s, h: r.height / s };
};
T.find = async (sel, timeout = 15000) => {
  const t0 = Date.now();
  for (;;) {
    const el = typeof sel === 'function' ? sel() : [...phone.querySelectorAll(sel)].filter(n => n.getBoundingClientRect().width > 0).pop();
    if (el) return el;
    if (Date.now() - t0 > timeout) throw new Error('tour: not found ' + sel);
    await tick(80);
  }
};
/* scroll the element's own scroller (screen, sheet or thread) until it sits comfortably on screen */
T.bring = async el => {
  const p = T.local(el); if (p.y > 120 && p.y < 800) return;
  /* nearest ancestor that really scrolls; fixed docks and panels never move the page */
  let sc = el.parentElement;
  while (sc && sc !== phone && !(sc.scrollHeight > sc.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
  if (!sc || sc === phone) return;
  const from = sc.scrollTop, to = Math.max(0, from + (p.y - 430)), dur = 700 * T.speed, t0 = performance.now();
  await new Promise(res => { const f = () => { const k = Math.min(1, (performance.now() - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; sc.scrollTop = from + (to - from) * e; k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
};
T.show = on => finger.animate([{ opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0 }], { duration: 400, easing: EASE, fill: 'forwards' });
T.moveTo = async (x, y, dur = 720) => {
  T.at = { x, y };
  if (getComputedStyle(finger).opacity === '0') { finger.style.transform = `translate(${x}px,${y + 60}px)`; T.x = x; T.y = y + 60; T.show(true); }
  const a = finger.animate([{ transform: `translate(${T.x}px,${T.y}px)` }, { transform: `translate(${x}px,${y}px)` }], { duration: dur * T.speed, easing: EASE, fill: 'forwards' });
  T.x = x; T.y = y; await a.finished;
};
T.move = async el => { await T.bring(el); const p = T.local(el); await T.moveTo(p.x, p.y); };
T.press = async (hold = 0) => {
  const tip = finger.querySelector('.tip'), rip = finger.querySelector('.rip');
  tip.animate([{ transform: 'scale(1)' }, { transform: 'scale(.78)' }], { duration: 160, easing: EASE, fill: 'forwards' });
  rip.animate([{ opacity: .9, transform: 'scale(.8)' }, { opacity: 0, transform: 'scale(2.4)' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
  if (hold) await tick(hold);
  await tick(150);
  tip.animate([{ transform: 'scale(.78)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.34,1.36,.64,1)', fill: 'forwards' });
};
T.tap = async (sel, after = 260) => {
  const el = await T.find(sel); await T.move(el);
  el.classList && el.classList.add('pressing');
  await T.press(); el.classList && el.classList.remove('pressing');
  el.focus && el.matches('input') ? el.focus({ preventScroll: true }) : el.click();
  if (T.autoHide && !el.matches('input')) T.show(false);
  await T.wait(after); return el;
};
T.hold = async (sel, ms = 900) => {
  const el = await T.find(sel); await T.move(el); const p = T.local(el);
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: p.x, clientY: p.y }));
  await T.press(ms);
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  if (T.autoHide) T.show(false);
  await T.wait(400); return el;
};
T.type = async (sel, text, cps = 18) => {
  const el = await T.tap(sel, 120);
  for (const ch of text) { el.value += ch; el.dispatchEvent(new Event('input', { bubbles: true })); await tick(1000 / cps * T.speed * (ch === ' ' ? 1.4 : 1)); }
  await T.wait(260); return el;
};
T.until = async (fn, timeout = 30000) => { const t0 = Date.now(); while (!fn()) { if (Date.now() - t0 > timeout) throw new Error('tour: timeout'); await tick(80); } };
T.reply = async (max = 1) => {   // play my turns: wait for it to be my turn, type the line, send
  for (let i = 0; i < max; i++) {
    await T.until(() => myTurn() && $('.send.on', S.cur.el));
    await T.wait(500);
    await T.type('#draft', scriptOf()[S[stepKey()]][1], 22);
    await T.tap('.send', 400);
  }
};

/* ---------- captions beside the phone (watch mode) ---------- */
const cap = $('#tourcap');
let stepN = 0;
T.cap = (title, body, total = 20) => {
  if (!cap || MODE !== 'watch') return;
  cap.hidden = false; stepN++;
  const html = `<div class="tc-step">Step ${stepN} of ${total}</div><div class="tc-title">${title}</div><div class="tc-body">${body}</div>`;
  const old = cap.firstElementChild;
  const box = document.createElement('div'); box.innerHTML = html;
  if (old) old.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 360, easing: EASE, fill: 'forwards' }).finished.then(() => old.remove());
  cap.appendChild(box);
  box.animate([{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 820, delay: old ? 300 : 0, easing: OUT, fill: 'backwards' });
};

/* ---------- the watch-mode script: the whole product, start to finish ---------- */
T.watch = async () => {
  $('#m-watch') && $('#m-watch').classList.add('on');
  S.night = 'live';
  T.cap('Welcome to ISO.', 'One promise: you talk to one person at a time. Sit back; this plays by itself.');
  go('splash'); await T.wait(4600);
  T.cap('Sign up with your school.', 'ISO is campus-only. Start with your school email.');
  await T.tap('[data-go="email"]', 900);
  await T.type('#email', 'paul.j@college.harvard.edu');
  await T.tap('#sendcode', 900);
  T.cap('Prove it’s you.', 'A six-digit code lands in your inbox. The active box carries the chromatic edge.');
  await T.type('#otp', '482915', 4);
  await T.tap('#verify', 1600);
  T.cap('You’re in.', 'ISO is live at set hours, so everyone looking is looking at once.');
  await T.wait(1800); await T.tap('.s-ready .btn', 1200);

  T.cap('Home is the queue.', 'The light means people are here right now. One button: meet someone.');
  await T.wait(2600); await T.tap('.s-home .lw .btn', 400);
  T.cap('Looking for someone present.', 'ISO only matches people who are online at this moment.');
  await T.find('.s-match'); await T.wait(600);
  T.cap('One person. Here now.', 'A photo, a name, and one question you’ll both answer. No feed, no list.');
  await T.wait(2600); await T.tap('[data-act="sayHi"]', 600);

  T.cap('The live room.', 'A gentle timer shows whose turn it is. Presence, not pressure.');
  await T.reply(2);
  T.cap('Hold a moment.', 'Long-press a message you want to keep. ISO never saves the conversation; you keep the moment.');
  await T.wait(800);
  await T.hold('.row[data-i="2"] .bubble');
  await T.tap('[data-act="holdFrom"]', 700);
  T.cap('Tap where it ends.', 'The chromatic line spans the stretch you’re holding.');
  await T.tap('.row[data-i="4"] .bubble', 900);
  await T.tap('[data-act="keepMoment"]', 900);
  T.cap('Name the feeling.', 'Big, simple words, and a line for future you. Their name becomes an initial.');
  await T.tap('.sheet .word:nth-child(1)', 300); await T.tap('.sheet .word:nth-child(5)', 300);
  await T.type('#why', 'I laughed so hard I forgot to be nervous.');
  await T.tap('[data-act="holdIt"]', 2800);

  T.cap('Keep talking?', 'When you’re ready, either of you can decide. Your answer stays sealed.');
  await T.reply(1);
  await T.until(() => $('#decide.ready', S.cur.el)); await T.wait(900);
  await T.tap('#decide', 1200);
  await T.tap('[data-act="keep"]', 300);
  T.cap('Revealed together.', 'Both answers flip at the same moment. Nobody watches the other decide.');
  await T.find('.s-mutual');
  T.cap('You both said yes.', 'Green appears only here, for the mutual yes.');
  await T.wait(2600); await T.tap('.s-mutual .btn', 800);

  T.cap('The one chat.', 'No timer now. This is your single ongoing conversation.');
  await T.reply(1); await T.wait(2400);
  await T.tap('[data-act="chatBack"]', 1400);
  T.cap('One conversation at a time.', 'While you’re talking with Maya, the queue stays closed. That’s the whole idea.');
  await T.tap('[data-act="oneAtATime"]', 2600);
  await T.tap('.scrim', 900);

  T.cap('Your profile.', 'Memories, this week’s ISO Live hours and safety all live in one sheet.');
  await T.tap('.s-home .avbtn', 1400);
  await T.tap('[data-act="toMemories"]', 1200);
  T.cap('Memories.', 'Not transcripts: the conversations you had, the moments you held, how they felt.');
  await T.wait(1800);
  await T.tap('.s-memories .hlw .tile', 2600);
  await T.tap('.s-moment [data-back]', 1000);
  await T.tap('.s-memories [data-go="felt"]', 2800);
  await T.tap('.s-felt [data-back]', 900);

  T.cap('ISO Live.', 'Before 8 it counts down. At 8 the light comes on for everyone at once.');
  T.show(false);
  S.night = 'opening'; S.oc = 6; S.waiting = 196; S.convo = false; go('home');
  await T.find('.s-home #homeglow'); await T.wait(4200);

  T.cap('That’s ISO.', 'One conversation at a time.');
  cap.insertAdjacentHTML('beforeend', '<div class="tc-acts"><button class="pri" onclick="location.reload()">Watch again</button><a href="?mode=try">Try it yourself</a></div>');
};

if (MODE === 'try') { const m = $('#m-try'); if (m) m.classList.add('on'); }
