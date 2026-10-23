// Command palette (Cmd/Ctrl-K) over a static JSON index, plus toast + share helpers. No external services.
type Doc = { t: string; d: string; u: string; k: string; l: string; g: string };
let docs: Doc[] | null = null;
let loading: Promise<Doc[]> | null = null;

export function toast(msg: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(Number(el.dataset.t || 0));
  el.dataset.t = String(window.setTimeout(() => el.classList.remove('show'), 2200));
}

const norm = (s: string) => s.toLowerCase().normalize('NFKC');
function score(doc: Doc, terms: string[], lang: string) {
  const t = norm(doc.t), d = norm(doc.d), g = norm(doc.g);
  let s = 0;
  for (const q of terms) {
    if (t.startsWith(q)) s += 12; else if (t.includes(q)) s += 8;
    else if (g.includes(q)) s += 5; else if (d.includes(q)) s += 3; else return 0;
  }
  if (doc.l === lang) s += 2;
  return s;
}

function dialog() { return document.querySelector<HTMLDialogElement>('[data-palette]'); }

async function load(dlg: HTMLDialogElement) {
  if (docs) return docs;
  loading ??= fetch(dlg.dataset.index!).then((r) => r.json()).then((j: Doc[]) => (docs = j));
  return loading;
}

let sel = 0;
function render(dlg: HTMLDialogElement) {
  const list = dlg.querySelector<HTMLUListElement>('[data-palette-list]')!;
  const input = dlg.querySelector<HTMLInputElement>('[data-palette-q]')!;
  const lang = dlg.dataset.lang || 'en';
  const ja = lang === 'ja';
  list.replaceChildren();
  if (!docs) {
    for (let i = 0; i < 4; i++) { const li = document.createElement('li'); li.className = 'palette-skel'; list.append(li); }
    return;
  }
  const terms = norm(input.value.trim()).split(/\s+/).filter(Boolean);
  const res = terms.length
    ? docs.map((d) => ({ d, s: score(d, terms, lang) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.d)
    : docs.filter((d) => d.l === lang).slice(0, 8);
  if (!res.length) {
    const li = document.createElement('li');
    li.className = 'palette-empty';
    li.textContent = ja ? `「${input.value}」に一致する記事はありません` : `No results for “${input.value}”. Try “pricing”, “Cursor” or “PHP”.`;
    list.append(li);
    return;
  }
  sel = Math.min(sel, res.length - 1);
  res.forEach((doc, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = `pal-${i}`;
    li.setAttribute('aria-selected', String(i === sel));
    const a = document.createElement('a');
    a.href = doc.u;
    const k = document.createElement('span'); k.className = 'pal-kind'; k.textContent = doc.k;
    const t = document.createElement('span'); t.className = 'pal-title'; t.textContent = doc.t;
    const d = document.createElement('span'); d.className = 'pal-desc'; d.textContent = doc.d;
    a.append(k, t, d);
    li.append(a);
    li.addEventListener('mousemove', () => { if (sel !== i) { sel = i; mark(list); } });
    list.append(li);
  });
  input.setAttribute('aria-activedescendant', `pal-${sel}`);
}
function mark(list: HTMLElement) {
  list.querySelectorAll('[role=option]').forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
  const cur = list.querySelector<HTMLElement>(`#pal-${sel}`);
  cur?.scrollIntoView({ block: 'nearest' });
  list.closest('dialog')?.querySelector('[data-palette-q]')?.setAttribute('aria-activedescendant', `pal-${sel}`);
}

export async function openPalette() {
  const dlg = dialog();
  if (!dlg || dlg.open) return;
  sel = 0;
  dlg.showModal();
  document.documentElement.classList.add('palette-open');
  const input = dlg.querySelector<HTMLInputElement>('[data-palette-q]')!;
  input.value = '';
  input.focus();
  render(dlg);
  await load(dlg).catch(() => null);
  render(dlg);
}
function close() { const dlg = dialog(); if (dlg?.open) dlg.close(); }

if (!(window as unknown as { __pal?: boolean }).__pal) {
  (window as unknown as { __pal?: boolean }).__pal = true;
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); const d = dialog(); if (d?.open) close(); else openPalette(); return; }
    if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && !dialog()?.open) { e.preventDefault(); openPalette(); return; }
    const dlg = dialog();
    if (!dlg?.open) return;
    const list = dlg.querySelector<HTMLElement>('[data-palette-list]')!;
    const n = list.querySelectorAll('[role=option]').length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); sel = (sel + 1) % n; mark(list); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); sel = (sel - 1 + n) % n; mark(list); }
    else if (e.key === 'Enter') { const a = list.querySelector<HTMLAnchorElement>(`#pal-${sel} a`); if (a) { e.preventDefault(); close(); a.click(); } }
  });
  document.addEventListener('input', (e) => { const dlg = dialog(); if (dlg && (e.target as Element).matches?.('[data-palette-q]')) { sel = 0; render(dlg); } });
  document.addEventListener('click', async (e) => {
    const el = e.target as Element;
    if (el.closest('[data-palette-open]')) { e.preventDefault(); openPalette(); return; }
    const dlg = dialog();
    if (dlg?.open && (el === dlg || el.closest('[data-palette-list] a'))) close();
    const share = el.closest<HTMLElement>('[data-share]');
    if (share) {
      const ja = document.documentElement.lang === 'ja';
      const url = location.href.split('#')[0];
      if (share.dataset.share === 'native' && navigator.share) { navigator.share({ title: document.title, url }).catch(() => {}); return; }
      try { await navigator.clipboard.writeText(url); toast(ja ? 'リンクをコピーしました' : 'Link copied'); }
      catch { toast(ja ? 'コピーできませんでした' : 'Copy failed'); }
    }
  });
  document.addEventListener('close', (e) => { if ((e.target as Element).matches?.('[data-palette]')) document.documentElement.classList.remove('palette-open'); }, true);
  document.addEventListener('astro:before-preparation', close);
}

// Hide native share button where unsupported.
document.addEventListener('astro:page-load', () => {
  if (!('share' in navigator)) document.querySelectorAll<HTMLElement>('[data-share="native"]').forEach((b) => (b.hidden = true));
});
