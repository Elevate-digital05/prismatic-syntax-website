/* Shared by every page: the hero motion, the FAQ, and the glass header's tone. */
/* Home hero: dark tiles dissolve off the glass (prism.js) on load and the glass
   drifts with the pointer. The hero is the only part of either page that moves. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = function () {
    const tiles = document.querySelector('.hero-tiles');
    // the tiles only fade, so they run for reduced motion too; the zoom and drift do not
    if (tiles) {
      for (let i = 0; i < 81; i++) {
        const t = document.createElement('i');
        t.style.animationDelay = (150 + Math.random() * 950) + 'ms';
        if (Math.random() < 0.16) t.className = 'b';
        tiles.appendChild(t);
      }
      tiles.classList.add('is-ready');
      setTimeout(function () { tiles.remove(); }, 2200);
    }
    document.documentElement.classList.add('is-loaded');
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

/* The nav flips between dark and frosted-white glass with whatever is under it,
   the way iOS 27 flips its small glass controls, so it never turns into a grey
   smear over a white section. */
(function () {
  const nav = document.querySelector('nav, .site-head');
  if (!nav) return;
  const DARK = '.hero, .band-ink, .cta-banner, .close-cta, footer, .site-foot, .foot-bottom, #page-contact, .mobile-menu';
  let queued = false;
  const update = function () {
    queued = false;
    // offset* rather than getBoundingClientRect: the bar slides in on load, and
    // mid-animation its box sits above the viewport, which read as "light".
    const under = document.elementsFromPoint(nav.offsetLeft + nav.offsetWidth / 2, nav.offsetTop + nav.offsetHeight / 2)
      .find(function (el) { return !nav.contains(el); });
    nav.classList.toggle('on-light', Boolean(under) && !under.closest(DARK));
  };
  const queue = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('hashchange', queue);
  // showPage() and the menu change what sits under the bar without scrolling
  document.addEventListener('click', queue);
  update();
})();

/* A mouse wheel on a PC jumps the page in 100px notches where a Mac trackpad glides,
   which is most of why the site felt choppy on Windows. This eases wheel scrolling
   toward where the notches point. It stays out of the way on Apple devices, touch
   screens, precision touchpads (small deltas that already glide), ctrl+wheel zoom,
   anything that scrolls itself (a textarea, the mobile menu), and for anyone who has
   asked for reduced motion. */
(function () {
  const platform = navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform;
  // case-insensitive: Chrome on a Mac reports "macOS", Safari "MacIntel"
  if (/mac|iphone|ipad|ipod/i.test(platform) || !matchMedia('(hover: hover) and (pointer: fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let target = 0, running = false, gestureUntil = 0;
  const scrollsItself = function (el, dy) {
    for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      const o = getComputedStyle(el).overflowY;
      if ((o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight &&
          (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight)) return true;
    }
    return false;
  };
  const frame = function () {
    if (!running) return;
    const y = scrollY, d = target - y;
    if (Math.abs(d) <= 1) { scrollTo({ top: target, behavior: 'instant' }); running = false; return; }
    // at least a pixel a frame, or rounding to device pixels can stall the last few
    scrollTo({ top: y + Math.sign(d) * Math.max(1, Math.abs(d) * 0.16), behavior: 'instant' });
    requestAnimationFrame(frame);
  };
  addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const now = performance.now();
    if (e.deltaMode === 0 && Math.abs(e.deltaY) < 50 && now > gestureUntil) return;
    if (scrollsItself(e.target, e.deltaY)) return;
    e.preventDefault();
    gestureUntil = now + 250;
    if (!running) target = scrollY;
    const px = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + px));
    if (!running) { running = true; requestAnimationFrame(frame); }
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
    cards.forEach(function (card) { watch.observe(card); });
  });
})();
