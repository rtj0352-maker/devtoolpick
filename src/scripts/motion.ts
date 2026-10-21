// DevToolPick motion: tiny, dependency-free. Re-runs on every Astro page load (ClientRouter).
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let cleanups: Array<() => void> = [];

function reveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e, i) => { e.style.setProperty('--d', `${Math.min(i % 6, 5) * 60}ms`); io.observe(e); });
  cleanups.push(() => io.disconnect());
}

function tilt() {
  if (reduce() || !fine()) return;
  document.querySelectorAll<HTMLElement>('.review-card, .pick').forEach((el) => {
    let raf = 0;
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(0.5 - y) * 5}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
      });
    };
    const leave = () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
  });
}

function progress() {
  const bar = document.querySelector<HTMLElement>('.read-progress');
  const art = document.querySelector<HTMLElement>('.prose');
  if (!bar || !art) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = art.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    bar.style.transform = `scaleX(${p})`;
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(update); };
  update();
  window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
  cleanups.push(() => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); });
}

function tocSpy() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map<Element, HTMLAnchorElement>();
  links.forEach((a) => { const t = document.getElementById(decodeURIComponent(a.hash.slice(1))); if (t) map.set(t, a); });
  const visible = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    let current: Element | undefined;
    for (const el of map.keys()) {
      if (visible.has(el)) { current = el; break; }
      if (el.getBoundingClientRect().top < 120) current = el;
    }
    links.forEach((a) => a.classList.toggle('active', !!current && map.get(current) === a));
  }, { rootMargin: '-80px 0px -60% 0px' });
  map.forEach((_, el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

function init() {
  cleanups.forEach((c) => c()); cleanups = [];
  document.documentElement.classList.add('js');
  reveal(); tilt(); progress(); tocSpy();
}
document.addEventListener('astro:page-load', init);
