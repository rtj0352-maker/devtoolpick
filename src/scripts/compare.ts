interface Tier { name: string; monthly: number; yearly?: number; note?: string }
interface Tool { id: string; name: string; form: string; freeTier: boolean; tiers: Tier[]; pricing: string; team: string; agent: boolean; prNative: string; terminal: string; models: string; bestFor: string; watch: string; review: string; official: string }
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function initCompare() {
  const root = document.querySelector<HTMLElement>('[data-compare]');
  const data = document.getElementById('tool-data');
  if (!root || !data || root.dataset.ready) return;
  root.dataset.ready = '1';
  const tools: Tool[] = JSON.parse(data.textContent || '[]');
  const rev = (root.dataset.base || "/") + "reviews/";
  const form = root.querySelector<HTMLFormElement>('[data-filters]')!;
  const tbody = root.querySelector('tbody')!;
  const rows = [...tbody.querySelectorAll<HTMLTableRowElement>('tr')];
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const side = root.querySelector<HTMLElement>('[data-side]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  let sortKey = 'entry', dir = 1;

  const apply = () => {
    const f = new FormData(form);
    const max = Number(f.get('max'));
    (form.elements.namedItem('maxOut') as HTMLOutputElement).value = `$${max}`;
    let shown = 0;
    rows.forEach((r) => {
      const d = r.dataset;
      const ok = (!f.get('free') || d.free === '1') && (!f.get('keep') || d.keep === '1') && (!f.get('cli') || d.cli === '1')
        && (!f.get('form') || d.form === f.get('form')) && Number(d.entry) <= max;
      r.hidden = !ok; if (ok) shown++;
    });
    count.textContent = `${shown} of ${rows.length} tools match`;
    empty.hidden = shown > 0;
    root.querySelector('.data-table')!.classList.toggle('is-empty', shown === 0);
  };
  const sort = () => {
    rows.sort((a, b) => {
      const x = a.dataset[sortKey]!, y = b.dataset[sortKey]!;
      const n = Number(x) - Number(y);
      return (Number.isNaN(n) ? x.localeCompare(y) : n) * dir;
    }).forEach((r) => tbody.appendChild(r));
    root.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((b) => {
      const on = b.dataset.sort === sortKey;
      b.closest('th')!.setAttribute('aria-sort', on ? (dir > 0 ? 'ascending' : 'descending') : 'none');
      b.classList.toggle('on', on);
    });
  };
  const renderSide = () => {
    const picked = [...root.querySelectorAll<HTMLInputElement>('[data-pick]:checked')].map((c) => c.value);
    hint.textContent = picked.length < 2 ? 'Tick 2–3 tools in the table to compare.' : `Comparing ${picked.length} tools`;
    root.querySelectorAll<HTMLInputElement>('[data-pick]').forEach((c) => (c.disabled = !c.checked && picked.length >= 3));
    side.innerHTML = picked.length < 2 ? '' : picked.map((id) => tools.find((t) => t.id === id)!).map((t) => `
      <article class="side-card">
        <p class="kicker">${esc(t.form)}</p>
        <h3>${esc(t.name)}</h3>
        <dl>
          <dt>Plans</dt><dd>${t.tiers.map((x) => `${esc(x.name)} ${x.monthly ? '$' + x.monthly : '$0'}`).join(' · ')}</dd>
          <dt>Pricing shape</dt><dd>${esc(t.pricing)}</dd>
          <dt>Free tier</dt><dd>${t.freeTier ? 'Yes' : 'No'}</dd>
          <dt>Models</dt><dd>${esc(t.models)}</dd>
          <dt>Teams</dt><dd>${esc(t.team)}</dd>
          <dt>Best for</dt><dd>${esc(t.bestFor)}</dd>
          <dt>Watch out</dt><dd>${esc(t.watch)}</dd>
        </dl>
        <a class="card-cta" data-review="${t.review}">Read review →</a>
      </article>`).join('');
    side.querySelectorAll<HTMLAnchorElement>('[data-review]').forEach((a) => (a.href = rev + a.dataset.review + '/'));
  };

  form.addEventListener('input', apply);
  form.addEventListener('reset', () => setTimeout(apply));
  root.querySelector('[data-clear]')!.addEventListener('click', () => { form.reset(); setTimeout(apply); });
  root.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((b) => b.addEventListener('click', () => {
    if (sortKey === b.dataset.sort) dir = -dir; else { sortKey = b.dataset.sort!; dir = 1; }
    sort();
  }));
  root.addEventListener('change', (e) => { if ((e.target as HTMLElement).matches('[data-pick]')) renderSide(); });
  const pre = new URLSearchParams(location.search).get('ids')?.split(',') ?? [];
  root.querySelectorAll<HTMLInputElement>('[data-pick]').forEach((c) => (c.checked = pre.includes(c.value)));
  sort(); apply(); renderSide();
}
