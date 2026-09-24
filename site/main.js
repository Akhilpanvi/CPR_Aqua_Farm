// nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// fade images in once the bitmap is actually decoded, so the swap from the
// blurred placeholder never lands mid-frame
const settle = (img) => {
  const done = () => img.classList.add('ready');
  if (!img.complete) { img.addEventListener('load', () => settle(img), { once: true });
                       img.addEventListener('error', done, { once: true }); return; }
  (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
};
for (const img of document.querySelectorAll('img[data-fade]')) settle(img);

// reveal on scroll, stagger anything that arrives as a row
const reveal = new IntersectionObserver((entries) => {
  const arriving = entries.filter((e) => e.isIntersecting);
  const groups = new Map();
  for (const e of arriving) {
    const parent = e.target.parentElement;
    const n = groups.get(parent) ?? 0;
    groups.set(parent, n + 1);
    e.target.style.transitionDelay = n ? `${Math.min(n * 80, 320)}ms` : '';
    e.target.classList.add('in');
    reveal.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

for (const el of document.querySelectorAll('.rv')) reveal.observe(el);

// boot screen: hold until the hero image is decoded, then hand over to the page
const boot = document.getElementById('boot');
const markBooted = () => document.documentElement.classList.add('booted');

// the hero copy starts hidden and is revealed by .booted, so guarantee it lands
// even if the boot sequence below never completes
setTimeout(markBooted, 6500);
if (!boot) markBooted();

if (boot) {
  const startedAt = performance.now();
  const hero = document.querySelector('.hero-media img');

  const heroReady = !hero ? Promise.resolve()
    : hero.complete ? (hero.decode ? hero.decode().catch(() => {}) : Promise.resolve())
    : new Promise((r) => { hero.addEventListener('load', r, { once: true });
                           hero.addEventListener('error', r, { once: true }); });

  const capped = new Promise((r) => setTimeout(r, 2600));

  Promise.race([heroReady, capped]).then(() => {
    // a beat of minimum airtime, so a warm load does not just flash
    const hold = Math.max(0, 600 - (performance.now() - startedAt));
    setTimeout(() => {
      boot.classList.add('is-done');
      setTimeout(() => {
        boot.classList.add('is-gone');
        markBooted();
        setTimeout(() => boot.remove(), 700);
      }, 340);
    }, hold);
  });
}

document.getElementById('yr').textContent = new Date().getFullYear();

// founder quote: Telugu by default, English while hovered. Tapping the pill
// latches a language, so it also works on touch, where there is no hover.
const cprq = document.querySelector('.cprq');
if (cprq) {
  const te = cprq.querySelector('.cprq-te');
  const en = cprq.querySelector('.cprq-en');
  let latched = 'te';
  let hovering = false;

  const render = () => {
    const english = hovering || latched === 'en';
    en.classList.toggle('is-on', english);
    te.classList.toggle('is-on', !english);
  };

  // tapping latches a language, which is how this works where there is no hover
  cprq.addEventListener('click', () => {
    latched = latched === 'en' ? 'te' : 'en';
    hovering = false;
    render();
  });

  cprq.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    hovering = true; render();
  });
  cprq.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    hovering = false; render();
  });

  render();
}
