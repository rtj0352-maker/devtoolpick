interface Tier { name: string; monthly: number; yearly?: number; note?: string }
interface Tool { id: string; name: string; tiers: Tier[] }
export function initCalc() {
  const root = document.querySelector<HTMLElement>('[data-calc]');
  const data = document.getElementById('tool-data');
  if (!root || !data || root.dataset.ready) return;
  root.dataset.ready = '1';
  const tools: Tool[] = JSON.parse(data.textContent || '[]');
  const seats = root.querySelector<HTMLInputElement>('input[name="seats"]')!;
  const note = root.querySelector<HTMLElement>('[data-note]')!;
  const fmt = (n: number) => (n === 0 ? '$0' : '$' + n.toLocaleString('en-US'));
  const animate = (el: HTMLElement, to: number) => {
    const from = Number(el.dataset.v || 0); el.dataset.v = String(to);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 350); el.textContent = fmt(Math.round(from + (to - from) * (1 - (1 - p) ** 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const run = () => {
    const n = Math.max(1, Math.min(500, Math.floor(Number(seats.value) || 1)));
    const year = (root.querySelector<HTMLInputElement>('input[name="period"]:checked')!).value === 'year';
    const vals = tools.map((t) => {
      const row = root.querySelector<HTMLElement>(`[data-tool="${t.id}"]`)!;
      const tier = t.tiers[Number(row.querySelector<HTMLSelectElement>('[data-tier]')!.value)];
      const v = n * (year ? (tier.yearly ?? tier.monthly * 12) : tier.monthly);
      return { row, v, tier };
    });
    const max = Math.max(1, ...vals.map((x) => x.v));
    vals.forEach(({ row, v, tier }) => {
      row.querySelector<HTMLElement>('[data-bar]')!.style.transform = `scaleX(${v / max})`;
      const out = row.querySelector<HTMLElement>('[data-out]')!;
      animate(out, v);
      out.title = year && tier.yearly ? 'Annual price cited in our article' : '';
      row.classList.toggle('cheapest', v === Math.min(...vals.map((x) => x.v)));
    });
    note.textContent = `${n} seat${n > 1 ? 's' : ''} · ${year ? 'per year' : 'per month'} · list prices, before tax`;
  };
  root.addEventListener('input', run); root.addEventListener('change', run);
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => b.addEventListener('click', () => {
    seats.value = String(Math.max(1, Math.min(500, (Number(seats.value) || 1) + Number(b.dataset.step)))); run();
  }));
  run();
}
