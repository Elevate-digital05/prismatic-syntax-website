/* Shared by every page: the hero motion, the heading reveal, the FAQ, the glass header's
   tone, smooth scrolling, the back-to-top button and the analytics consent notice. */
/* Home hero: dark tiles dissolve off the glass (prism.js) on load and the glass
   drifts with the pointer. On a first visit they wait for the splash (home.css) to
   part, by --intro. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const intro = (parseFloat(getComputedStyle(root).getPropertyValue('--intro')) || 0) * 1000;
  // Off once every entrance has run, or /south-africa's home view would wait out the
  // splash again each time showPage() brings it back.
  if (intro) setTimeout(function () { root.classList.remove('splashing'); }, 3200);
  const start = function () {
    const tiles = document.querySelector('.hero-tiles');
    // the tiles only fade, so they run for reduced motion too; the zoom and drift do not
    if (tiles) {
      for (let i = 0; i < 81; i++) {
        const t = document.createElement('i');
        t.style.animationDelay = (intro + 150 + Math.random() * 950) + 'ms';
        if (Math.random() < 0.16) t.className = 'b';
        tiles.appendChild(t);
      }
      tiles.classList.add('is-ready');
      setTimeout(function () { tiles.remove(); }, intro + 2200);
    }
    root.classList.add('is-loaded');
  };
  // wait for the display face so the headline does not reflow mid-reveal, capped so slow fonts never block
  Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 800); })])
    .then(function () { requestAnimationFrame(function () { requestAnimationFrame(start); }); });

  const parallax = function (area, target) {
    if (reduced || !area || !target || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    area.addEventListener('pointermove', function (e) {
      const r = area.getBoundingClientRect();
      target.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      target.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    area.addEventListener('pointerleave', function () {
      target.style.setProperty('--px', 0);
      target.style.setProperty('--py', 0);
    });
  };
  parallax(document.querySelector('.hero'), document.querySelector('.hero-media'));
})();

/* Section headings sharpen out of a blur a letter at a time, the first time they come
   into view (theme.css). The letters are hidden from screen readers, which otherwise
   spell split text out, and the heading carries its words as its name instead. Left
   alone: a heading with a control in it (the FAQ toggle), and one already on screen when
   this runs, which would vanish and come back. A heading in a view /south-africa has
   not opened yet has no box, so it is split and waits for the view. */
(function () {
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.sec-h, .cta-inner > h2, #main h2').forEach(function (h) {
    if (h.querySelector('a, button, input, select, textarea')) return;
    if (h.getClientRects().length && h.getBoundingClientRect().top < innerHeight) return;
    h.setAttribute('aria-label', h.textContent.trim().replace(/\s+/g, ' '));
    const texts = [];
    const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) texts.push(walk.currentNode);
    let i = 0;
    texts.forEach(function (node) {
      const frag = document.createDocumentFragment();
      node.data.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(part); return; }
        const wd = document.createElement('span');
        wd.className = 'wd';
        wd.setAttribute('aria-hidden', 'true');
        for (const c of part) {
          const ch = document.createElement('span');
          ch.className = 'ch';
          ch.style.setProperty('--i', i++);
          ch.textContent = c;
          wd.append(ch);
        }
        frag.append(wd);
      });
      node.replaceWith(frag);
    });
    h.classList.add('is-split');
    io.observe(h);
  });
})();

/* The FAQ collapses under its heading. It opens from the heading, from any link
   to #faq, and when the page is opened at #faq; inert keeps the closed list out
   of the tab order. */
document.querySelectorAll('.faq-toggle').forEach(function (btn) {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const set = function (open) {
    btn.setAttribute('aria-expanded', open);
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
  };
  set(location.hash === '#faq');
  btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  document.querySelectorAll('a[href="#faq"]').forEach(function (a) {
    a.addEventListener('click', function () { set(true); });
  });
});

/* Back to top: a glass button in the bottom corner once the page is a screen down.
   It only works with a script, so the script adds it, and every page gets it from here.
   Focus goes back to the top too, to the first link in the nav, or a keyboard user's
   next Tab would carry them straight back down to the bottom of the page.
   Not where a WhatsApp button already floats in that corner: one floating control, not two. */
(function () {
  if (document.querySelector('.wa-btn, .wa-float')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btn.addEventListener('click', function () {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const first = document.querySelector('nav a[href], .site-head a[href]');
    if (first) first.focus({ preventScroll: true });
  });
  document.body.append(btn);
  const show = function () { btn.classList.toggle('is-shown', scrollY > innerHeight); };
  addEventListener('scroll', show, { passive: true });
  addEventListener('resize', show);
  show();
})();

/* The nav flips between dark and frosted-white glass with whatever is under it,
   the way iOS 27 flips its small glass controls, so it never turns into a grey
   smear over a white section. The back-to-top button flips with it. */
(function () {
  const controls = [document.querySelector('nav, .site-head'), document.querySelector('.to-top')].filter(Boolean);
  if (!controls.length) return;
  const DARK = '.hero, .band-ink, .cta-banner, .close-cta, footer, .site-foot, .foot-bottom, #page-contact, .mobile-menu';
  let queued = false;
  const update = function () {
    queued = false;
    // offset* rather than getBoundingClientRect: the bar slides in on load, and
    // mid-animation its box sits above the viewport, which read as "light".
    controls.forEach(function (el) {
      const under = document.elementsFromPoint(el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2)
        .find(function (u) { return !el.contains(u); });
      // While a page transition (theme.css) plays, its overlay is all there is to hit and
      // that reads as <html>: look again once it has gone, or the bar keeps the wrong tone.
      if (under === document.documentElement) { setTimeout(queue, 150); return; }
      el.classList.toggle('on-light', Boolean(under) && !under.closest(DARK));
    });
  };
  const queue = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('hashchange', queue);
  // showPage() and the menu change what sits under the bar without scrolling
  document.addEventListener('click', queue);
  update();
})();

/* Smooth scroll: every wheel and trackpad moves a target, and the page glides after it,
   heavier than the browser's own scrolling, so the whole site carries some weight the
   way the reference agency site does. A mouse wheel on a PC also stops jumping in 100px
   notches. It stays out of the way on touch screens, ctrl+wheel zoom, sideways swipes,
   anything that scrolls itself (a textarea, the mobile menu), while a menu has the page
   locked, and for anyone who has asked for reduced motion. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const EASE = 0.06; // share of the remaining distance covered per 60Hz frame
  let target = 0, running = false, last = 0;
  const scrollsItself = function (el, dy) {
    for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      const o = getComputedStyle(el).overflowY;
      if ((o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight &&
          (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight)) return true;
    }
    return false;
  };
  const frame = function (now) {
    if (!running) return;
    const y = scrollY, d = target - y;
    if (Math.abs(d) <= 1) { scrollTo({ top: target, behavior: 'instant' }); running = false; return; }
    // scaled by frame time, or a 120Hz screen would glide twice as fast as a 60Hz one
    // (clamped: the first frame can be stamped before the wheel event that started it)
    const k = 1 - Math.pow(1 - EASE, Math.min(Math.max(now - last, 8), 64) / (1000 / 60));
    last = now;
    // at least a pixel a frame, or rounding to device pixels can stall the last few
    scrollTo({ top: y + Math.sign(d) * Math.max(1, Math.abs(d) * k), behavior: 'instant' });
    requestAnimationFrame(frame);
  };
  addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    // an open menu locks the page (overflow on the homepage, a fixed body on /south-africa)
    if (document.body.style.overflow === 'hidden' || document.body.style.position === 'fixed') return;
    if (scrollsItself(e.target, e.deltaY)) return;
    e.preventDefault();
    if (!running) target = scrollY;
    const px = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + px));
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }, { passive: false });
  // keys, the scrollbar, links and page switches move the page themselves: let go
  ['keydown', 'pointerdown', 'hashchange'].forEach(function (type) { addEventListener(type, function () { running = false; }); });
})();

/* The client wall: one row however many businesses are added. A copy of the list goes
   beside it, hidden from screen readers so each name is announced once, and CSS slides
   the pair along. It stops while the pointer is over it, and the button stops it for
   good, which is what the guidelines ask of anything that moves on its own. */
(function () {
  const list = document.querySelector('.work-grid');
  if (!list) return;
  const strip = document.createElement('div');
  strip.className = 'work-marquee';
  list.before(strip);
  strip.append(list);
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
  strip.append(copy);
  // A set pace rather than a set lap time: a fixed lap would scroll faster with every
  // business added, since each lap gets longer. Half pace for reduced motion rather than
  // still, as with the glass: Windows reports reduced motion whenever "Animation effects"
  // is off, and a frozen strip would show only the first few logos.
  const speed = matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 60; // px a second
  const pace = function () {
    const lap = list.getBoundingClientRect().width + (parseFloat(getComputedStyle(strip).columnGap) || 16);
    strip.style.setProperty('--work-duration', (lap / speed).toFixed(1) + 's');
  };
  pace();
  new ResizeObserver(pace).observe(list);
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'work-pause';
  pause.textContent = 'Pause logos';
  pause.addEventListener('click', function () {
    const paused = strip.classList.toggle('is-paused');
    pause.textContent = paused ? 'Play logos' : 'Pause logos';
  });
  strip.after(pause);
})();

/* Clear glass: every card on a .glass-stage shows the prism still behind it (its
   .glass-wall). theme.css draws each card's copy; this lines the copy up with the real
   still, and again whenever the layout moves or a hidden page of /south-africa opens.
   Keep GLASS in step with the CLEAR GLASS block in theme.css. */
(function () {
  const GLASS = '.p-card, .m-card, .svc-card, .blog-card, .path-card, .team-row, .founder, .incl, .tier, .stat-box, .cta-box';
  document.querySelectorAll('.glass-stage').forEach(function (stage) {
    const wall = stage.querySelector(':scope > .glass-wall');
    if (!wall) return;
    const cards = stage.querySelectorAll(GLASS);
    const place = function () {
      const w = wall.getBoundingClientRect();
      if (!wall.naturalWidth || !w.width) return; // not loaded, or on a page not showing yet
      cards.forEach(function (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--wall', 'url("' + wall.currentSrc + '")');
        card.style.setProperty('--wx', (w.left - r.left - card.clientLeft) + 'px');
        card.style.setProperty('--wy', (w.top - r.top - card.clientTop) + 'px');
        card.style.setProperty('--ww', w.width + 'px');
        card.style.setProperty('--wh', w.height + 'px');
      });
    };
    wall.addEventListener('load', place);
    const watch = new ResizeObserver(place);
    watch.observe(stage);
    // A card holds its filtered copy only while it is near the screen. All of them at
    // once is more than an older phone's GPU will hold, and it drops what it cannot.
    const lit = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-lit', e.isIntersecting); });
    }, { rootMargin: '200px' });
    cards.forEach(function (card) { watch.observe(card); lit.observe(card); });
  });
})();

/* Visit analytics, only with consent. Whop's analytics is a third-party tracker, so
   nothing of Whop's loads until a visitor says yes: a small notice asks once, "No thanks"
   is as easy as "Allow", and the answer stays in this browser (localStorage, not a
   cookie). A browser sending Global Privacy Control has already said no, so it is never
   asked. The privacy page's [data-consent-reset] button asks again. No page may load Whop
   any other way (check-build.mjs). */
(function () {
  const KEY = 'ps-analytics';
  const read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = function (value) { try { localStorage.setItem(KEY, value); } catch (e) { /* asked again next page */ } };
  let loaded = false;
  const load = function () {
    if (loaded) return;
    loaded = true;
    // Whop's own snippet, as Whop gives it
    !function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");
    window.whop.setScope('biz_zaSHaZueOCQWsP');
    window.whop.track('page');
  };
  const ask = function (now) {
    if (document.querySelector('.consent')) return null;
    const box = document.createElement('div');
    box.className = 'consent' + (now ? ' is-now' : '');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Analytics choice');
    box.innerHTML = '<p>Can we count your visit? Whop analytics shows us which pages help, and only runs if you say yes. <a href="/privacy#tracking">Privacy policy</a></p>' +
      '<div class="consent-btns"><button type="button" data-choice="denied">No thanks</button><button type="button" data-choice="granted">Allow</button></div>';
    box.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-choice]');
      if (!btn) return;
      save(btn.dataset.choice);
      box.remove();
      if (btn.dataset.choice === 'granted') load();
    });
    document.body.append(box);
    return box;
  };
  const choice = read();
  if (choice === 'granted') load();
  else if (choice !== 'denied' && !navigator.globalPrivacyControl) ask(false);
  // asked for by name, so it appears at once and takes focus
  document.querySelectorAll('[data-consent-reset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* nothing stored */ }
      const box = ask(true) || document.querySelector('.consent');
      box.querySelector('button').focus();
    });
  });
})();
