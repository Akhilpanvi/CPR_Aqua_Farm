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

// founder quote: Telugu by default, English while pointed at, otherwise alternating
const cprq = document.querySelector('.cprq');
if (cprq) {
  const te = cprq.querySelector('.cprq-te');
  const en = cprq.querySelector('.cprq-en');
  let rotatedToEnglish = false;
  let held = false;

  const render = () => {
    const showEnglish = held || rotatedToEnglish;
    en.classList.toggle('is-on', showEnglish);
    te.classList.toggle('is-on', !showEnglish);
  };

  setInterval(() => { rotatedToEnglish = !rotatedToEnglish; render(); }, 10000);

  const hold = (on) => () => { held = on; render(); };
  cprq.addEventListener('pointerenter', hold(true));
  cprq.addEventListener('pointerleave', hold(false));
  cprq.addEventListener('focus', hold(true));
  cprq.addEventListener('blur', hold(false));
}
