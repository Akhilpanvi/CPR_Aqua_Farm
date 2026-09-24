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

// founder quote: Telugu, switching to English while the pointer or focus is on it
const cprq = document.querySelector('.cprq');
if (cprq) {
  const te = cprq.querySelector('.cprq-te');
  const en = cprq.querySelector('.cprq-en');

  const show = (english) => () => {
    en.classList.toggle('is-on', english);
    te.classList.toggle('is-on', !english);
  };

  cprq.addEventListener('pointerenter', show(true));
  cprq.addEventListener('pointerleave', show(false));
  cprq.addEventListener('focus', show(true));
  cprq.addEventListener('blur', show(false));
}
