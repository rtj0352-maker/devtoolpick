interface Tier { name: string; monthly: number; yearly?: number; note?: string }
const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`;
export function initJaQuiz() {
  const root = document.querySelector<HTMLElement>('[data-jaquiz]');
  const data = document.getElementById('ja-tool-data');
  if (!root || !data || root.dataset.ready) return;
  root.dataset.ready = '1';
  const tools: { id: string; plans: Tier[] }[] = JSON.parse(data.textContent || '[]');
  const qs = [...root.querySelectorAll<HTMLFieldSetElement>('[data-q]')];
  const bar = root.querySelector<HTMLElement>('[data-bar]')!;
  const step = root.querySelector<HTMLElement>('[data-step]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const a: Record<string, string> = {};
  let i = 0;
  const show = (n: number) => {
    i = n;
    qs.forEach((q, k) => { q.hidden = k !== n; q.classList.toggle('enter', k === n); });
    result.hidden = n < qs.length;
    bar.style.transform = `scaleX(${n / qs.length})`;
    step.textContent = n < qs.length ? `質問 ${n + 1} / ${qs.length}` : '診断結果';
  };
  const render = () => {
    const budget = Number(a.budget), year = a.pay === 'year';
    result.querySelectorAll<HTMLElement>('[data-tool]').forEach((card) => {
      const on = card.dataset.tool === a.task; card.hidden = !on;
      if (!on) return;
      const plans = tools.find((t) => t.id === a.task)!.plans;
      const hasFree = card.dataset.free === '1';
      const warn = card.querySelector<HTMLElement>('[data-warn]')!;
      const plan = card.querySelector<HTMLElement>('[data-plan]')!;
      warn.hidden = true;
      if (budget === 0 && hasFree) { plan.textContent = 'まずは無料プランから → 足りなくなったら有料へ'; return; }
      const eff = (p: Tier) => (year && p.yearly ? p.yearly / 12 : p.monthly);
      const fit = plans.filter((p) => eff(p) <= budget).sort((x, y) => eff(y) - eff(x))[0];
      const p = fit ?? plans[0];
      const cost = year && p.yearly ? `年払い ${yen(p.yearly)}（月あたり約${yen(Math.round(p.yearly / 12))}）` : `月額 ${yen(p.monthly)}`;
      plan.textContent = `おすすめプラン：${p.name} — ${cost}${p.note ? `（${p.note}）` : ''}`;
      if (year && p.yearly && p.yearly < p.monthly * 12) plan.textContent += ` ・月払いより年${yen(p.monthly * 12 - p.yearly)}おトク`;
      if (year && !p.yearly) plan.textContent += '（記事で確認した年払い価格はありません）';
      if (!fit) { warn.hidden = false; warn.textContent = budget === 0 ? 'このツールには無料プランがありません。最安プランを表示しています。' : `ご予算内のプランがありません。最安は${yen(plans[0].monthly)}/月です。`; }
    });
    show(qs.length);
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  };
  root.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    const opt = el.closest<HTMLButtonElement>('.opt');
    if (opt) {
      const q = opt.closest<HTMLElement>('[data-q]')!;
      a[q.dataset.q!] = opt.dataset.value!;
      q.querySelectorAll('.opt').forEach((o) => o.classList.toggle('picked', o === opt));
      setTimeout(() => (i + 1 < qs.length ? show(i + 1) : render()), 180);
    } else if (el.closest('[data-back]')) show(Math.max(0, i - 1));
    else if (el.closest('[data-restart]')) { root.querySelectorAll('.opt.picked').forEach((o) => o.classList.remove('picked')); show(0); }
  });
  show(0);
}
