// nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// fade images in once decoded, so the blurred placeholder never snaps
for (const img of document.querySelectorAll('img[data-fade]')) {
  if (img.complete) img.classList.add('ready');
  else img.addEventListener('load', () => img.classList.add('ready'), { once: true });
}

// reveal on scroll
const reveal = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    reveal.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -12% 0px' });

for (const el of document.querySelectorAll('.rv')) reveal.observe(el);

document.getElementById('yr').textContent = new Date().getFullYear();

// founder quote: Telugu by default, English while hovered. Tapping the pill
// latches a language, so it also works on touch, where there is no hover.
const cprq = document.querySelector('.cprq');
if (cprq) {
  const te = cprq.querySelector('.cprq-te');
  const en = cprq.querySelector('.cprq-en');
  const pill = cprq.querySelector('.cprq-lang');
  const pillText = cprq.querySelector('.cprq-lang-t');
  let latched = 'te';
  let hovering = false;

  const render = () => {
    const english = hovering || latched === 'en';
    en.classList.toggle('is-on', english);
    te.classList.toggle('is-on', !english);
    pillText.textContent = english ? 'తెలుగు' : 'English';
    pillText.lang = english ? 'te' : 'en';
    pill.setAttribute('aria-label', english ? 'Show the quote in Telugu' : 'Show the quote in English');
  };

  // a click anywhere on the quote — including the pill — latches the other language
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
