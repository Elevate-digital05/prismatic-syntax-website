// Prismatic Syntax: nav, reveals, hero intro, project showcase, contact hand-off.
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav ---------- */
const nav = $('.nav');
const toggle = $('.nav__toggle');
let lastY = scrollY;
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  nav.classList.toggle('is-hidden', y > 480 && y > lastY && !nav.classList.contains('is-open'));
  lastY = y;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const setMenu = open => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
  $('main').inert = open;
  $('.foot').inert = open;
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
$$('.nav__links a').forEach((a, i) => {
  a.style.setProperty('--i', i);
  a.addEventListener('click', () => setMenu(false));
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
});
matchMedia('(min-width: 900px)').addEventListener('change', e => e.matches && setMenu(false));

const links = $$('.nav__links a:not(.btn)');
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.hash === `#${e.target.id}` ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- reveals + hero intro ---------- */
$$('[data-split]').forEach(h => $$('.line', h).forEach((l, i) => l.style.setProperty('--i', i)));
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('is-in');
  io.unobserve(e.target);
}), { rootMargin: '0px 0px -10% 0px' });

const start = () => {
  const tiles = $('.hero__tiles');
  if (tiles && !reduced) {
    // dark tiles dissolve off the portrait, a few flash blue on the way out
    for (let i = 0; i < 81; i++) {
      const t = document.createElement('i');
      t.style.animationDelay = `${150 + Math.random() * 950}ms`;
      if (Math.random() < .16) t.className = 'b';
      tiles.append(t);
    }
    tiles.classList.add('is-ready');
    setTimeout(() => tiles.remove(), 2200);
  }
  document.documentElement.classList.add('is-loaded');
  $$('[data-reveal],[data-split]').forEach(el => io.observe(el));
};
// wait for the display face so headline lines don't reflow mid-reveal (capped so slow fonts don't block)
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))])
  .then(() => requestAnimationFrame(() => requestAnimationFrame(start)));

/* ---------- pointer parallax ---------- */
const parallax = (area, target) => {
  if (reduced || !area || !target || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  area.addEventListener('pointermove', e => {
    const r = area.getBoundingClientRect();
    target.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    target.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  });
  area.addEventListener('pointerleave', () => {
    target.style.setProperty('--px', 0);
    target.style.setProperty('--py', 0);
  });
};
parallax($('.hero'), $('.hero__media'));
parallax($('.about'), $('.art'));

/* ---------- word lists ---------- */
if (!reduced) $$('.words').forEach(list => {
  const items = $$('li', list);
  let i = 0;
  const tick = () => {
    items.forEach((li, j) => li.classList.toggle('is-on', j === i));
    list.style.setProperty('--w', i);
    i = (i + 1) % items.length;
  };
  list.classList.add('is-cycling');
  tick();
  setInterval(tick, 2200);
});

/* ---------- service / plan links prefill the enquiry ---------- */
const service = $('#f-service');
const budget = $('#f-budget');
$$('[data-service]').forEach(a => a.addEventListener('click', () => {
  service.value = a.dataset.service;
  if (a.dataset.budget) budget.value = a.dataset.budget;
}));

/* ---------- project showcase ---------- */
const show = $('.show');
if (show) {
  const slides = $$('.slide', show);
  const texts = $$('.show__text', show);
  const thumbs = $$('.thumb', show);
  const panel = $('.show__panel', show);
  let cur = 0;

  const go = (n, user) => {
    n = (n + slides.length) % slides.length;
    if (n === cur) return;
    panel.setAttribute('aria-live', user ? 'polite' : 'off');
    slides.forEach((s, i) => {
      s.classList.toggle('is-prev', i === cur);
      s.classList.toggle('is-active', i === n);
    });
    texts.forEach((t, i) => t.classList.toggle('is-active', i === n));
    thumbs.forEach((t, i) => {
      t.classList.toggle('is-active', i === n);
      i === n ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current');
    });
    cur = n;
  };

  thumbs.forEach((t, i) => {
    // thumbnails reuse the slide drawing; container units scale it down
    const clone = slides[i].firstElementChild.cloneNode(true);
    clone.removeAttribute('role');
    clone.removeAttribute('aria-label');
    if (clone.tagName === 'IMG') clone.alt = '';
    const box = document.createElement('span');
    box.className = 'thumb__art';
    box.setAttribute('aria-hidden', 'true');
    box.append(clone);
    t.append(box);
    t.addEventListener('click', () => go(i, true));
    // the progress bar is a CSS animation; when it finishes, advance
    t.addEventListener('animationend', e => e.animationName === 'progress' && i === cur && go(cur + 1));
  });

  $('.show__next', show).addEventListener('click', () => go(cur + 1, true));
  show.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(cur + 1, true);
    if (e.key === 'ArrowLeft') go(cur - 1, true);
  });

  const media = $('.show__media', show);
  let x0 = null;
  media.addEventListener('pointerdown', e => { x0 = e.clientX; });
  media.addEventListener('pointerup', e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 40) go(cur + (e.clientX < x0 ? 1 : -1), true);
    x0 = null;
  });

  if (!reduced) {
    show.classList.add('is-auto');
    new IntersectionObserver(([e]) => show.classList.toggle('in-view', e.isIntersecting)).observe(show);
    const pause = $('.show__pause', show);
    pause.addEventListener('click', () => pause.setAttribute('aria-pressed', show.classList.toggle('is-paused')));
  }
}

/* ---------- contact ---------- */
const form = $('.form');
if (form) {
  const check = f => {
    const bad = !f.checkValidity();
    f.setAttribute('aria-invalid', bad);
    $(`#${f.getAttribute('aria-describedby')}`).textContent = bad ? (f.validity.valueMissing ? f.dataset.missing : f.dataset.invalid) : '';
    return !bad;
  };
  form.addEventListener('input', e => e.target.getAttribute('aria-invalid') === 'true' && check(e.target));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const invalid = $$('[required]', form).filter(f => !check(f));
    if (invalid.length) return invalid[0].focus();
    const d = Object.fromEntries(new FormData(form));
    const body = [`Name: ${d.name}`, `Email: ${d.email}`, `Company: ${d.company || '-'}`, `Service: ${d.service}`, `Budget: ${d.budget}`, '', d.message].join('\n');
    // ponytail: mailto hand-off keeps the site static; POST to an /api/contact function once it's deployed.
    location.href = `mailto:hello@prismaticsyntax.com?subject=${encodeURIComponent(`Project enquiry: ${d.service}`)}&body=${encodeURIComponent(body)}`;
    $('.form__status', form).textContent = 'Your email app is opening with the enquiry filled in. If it doesn’t, email hello@prismaticsyntax.com.';
  });
}

$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
