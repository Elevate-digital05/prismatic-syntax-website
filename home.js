/* Shared by the homepage (/) and /south-africa. */
/* Home hero: dark tiles dissolve off the portrait on load and the portrait
   drifts with the pointer. The hero is the only part of either page that moves. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = function () {
    const tiles = document.querySelector('.hero-tiles');
    if (tiles && !reduced) {
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
