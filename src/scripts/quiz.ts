import { track } from './analytics';
interface Tier { name: string; monthly: number; yearly?: number; note?: string }
interface Tool { id: string; name: string; form: string; freeTier: boolean; tiers: Tier[]; bestFor: string; watch: string; review: string; official: string }
type A = Record<string, string>;

const W: Record<string, Record<string, number>> = {
  copilot: { 'ide:keep': 3, 'who:team': 2, 'job:daily': 3, 'job:review': 3, 'budget:0': 2, 'budget:10': 2 },
  cursor: { 'ide:open': 3, 'job:agent': 3, 'job:daily': 1, 'budget:10': 1, 'budget:30': 2, 'budget:100': 1 },
  devin: { 'ide:open': 2, 'job:agent': 2, 'budget:0': 1, 'budget:30': 1, 'budget:100': 1 },
  claude: { 'ide:terminal': 4, 'ide:keep': 1, 'job:refactor': 3, 'budget:30': 2, 'budget:100': 2, 'budget:0': -4 },
};
const WHY: Record<string, Record<string, string>> = {
  copilot: { 'ide:keep': 'Runs inside VS Code, JetBrains and other editors — no migration', 'who:team': 'Easiest team rollout for GitHub-standardised orgs (Business/Enterprise plans)', 'job:daily': 'Unlimited inline completions on paid plans', 'job:review': 'GitHub-native PR review and coding agents', 'budget:0': 'Has a Free tier (limited completions and chat)', 'budget:10': 'Pro is $10/mo' },
  cursor: { 'ide:open': 'The editor itself is built around agents', 'job:agent': 'Tight multi-file agent + editing loop', 'budget:10': 'Plus is $8/mo (Cursor models only)', 'budget:30': 'Premium ($30/mo) adds third-party models', 'budget:100': 'Super/Ultra tiers for heavy agent use' },
  devin: { 'ide:open': 'Agentic VS Code-fork editor (formerly Windsurf)', 'job:agent': 'Cascade-style multi-step agent flow', 'budget:0': 'Has a Free tier', 'budget:30': 'Pro is $20/mo', 'budget:100': 'Max ($200/mo) for heavy quota' },
  claude: { 'ide:terminal': 'Terminal-native agent that works in your repo', 'ide:keep': 'Runs alongside any editor', 'job:refactor': 'Strong at long, multi-step refactors', 'budget:30': 'Included with Claude Pro ($20/mo, $17/mo annual)', 'budget:100': 'Max plans ($100–$200/mo) for all-day agenting' },
};

function pickTier(t: Tool, budget: number): Tier {
  const fit = t.tiers.filter((x) => x.monthly <= budget);
  return (fit.length ? fit.sort((a, b) => b.monthly - a.monthly)[0] : t.tiers.slice().sort((a, b) => a.monthly - b.monthly)[0]);
}
const price = (n: number) => (n === 0 ? 'Free' : `$${n}/mo`);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function initQuiz() {
  const root = document.querySelector<HTMLElement>('[data-quiz]');
  const data = document.getElementById('tool-data');
  if (!root || !data || root.dataset.ready) return;
  root.dataset.ready = '1';
  const tools: Tool[] = JSON.parse(data.textContent || '[]');
  const base = root.dataset.base || '/';
  const qs = [...root.querySelectorAll<HTMLFieldSetElement>('[data-q]')];
  const bar = root.querySelector<HTMLElement>('[data-bar]')!;
  const step = root.querySelector<HTMLElement>('[data-step]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const answers: A = {};
  let i = 0;

  const show = (n: number) => {
    i = n;
    qs.forEach((q, k) => { q.hidden = k !== n; q.classList.toggle('enter', k === n); });
    result.hidden = n < qs.length;
    bar.style.transform = `scaleX(${n / qs.length})`;
    step.textContent = n < qs.length ? `Question ${n + 1} of ${qs.length}` : 'Your match';
    const btn = qs[n]?.querySelector<HTMLButtonElement>(answers[qs[n].dataset.q!] ? `.opt[data-value="${answers[qs[n].dataset.q!]}"]` : '.opt');
    if (n > 0 && btn) btn.focus({ preventScroll: true });
  };

  const render = () => {
    const scored = tools.map((t) => {
      const keys = Object.entries(answers).map(([k, v]) => `${k}:${v}`);
      const s = keys.reduce((a, k) => a + (W[t.id]?.[k] ?? 0), 0);
      const why = keys.map((k) => WHY[t.id]?.[k]).filter(Boolean) as string[];
      return { t, s, why };
    }).sort((a, b) => b.s - a.s);
    const [top, second] = scored;
    const budget = Number(answers.budget);
    const tier = pickTier(top.t, budget);
    const over = tier.monthly > budget;
    result.innerHTML = `
      <div class="result-card">
        <p class="kicker">Your best match</p>
        <h2 class="result-name">${esc(top.t.name)}</h2>
        <p class="result-sub mono">${esc(top.t.form)} · start with <b>${esc(tier.name)}</b> — ${price(tier.monthly)}${tier.note ? ` (${esc(tier.note)})` : ''}</p>
        ${over ? `<p class="result-warn">Heads-up: ${esc(top.t.name)} has no plan within $${budget}/mo — the cheapest is ${price(tier.monthly)}.</p>` : ''}
        <ul class="result-why">${top.why.slice(0, 4).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
        <p class="result-watch"><b>Watch out:</b> ${esc(top.t.watch)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${base}reviews/${top.t.review}/">Read our review <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-secondary" href="${top.t.official}" rel="noopener" target="_blank">Official site ↗</a>
        </div>
      </div>
      <div class="result-alt">
        <p class="kicker">Runner-up</p>
        <p><strong>${esc(second.t.name)}</strong> — ${esc(second.t.bestFor)}.</p>
        <p class="result-links mono"><a href="${base}tools/compare/?ids=${top.t.id},${second.t.id}">Compare side by side →</a> <a href="${base}tools/pricing/">Cost for your team →</a></p>
        <button type="button" class="link-btn mono" data-restart>↺ Start over</button>
      </div>`;
    show(qs.length);
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  };

  root.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    const opt = el.closest<HTMLButtonElement>('.opt');
    if (opt) {
      const q = opt.closest<HTMLElement>('[data-q]')!;
      answers[q.dataset.q!] = opt.dataset.value!;
      q.querySelectorAll('.opt').forEach((o) => o.classList.toggle('picked', o === opt));
      setTimeout(() => (i + 1 < qs.length ? show(i + 1) : (render(), track('quiz-complete/en', 'Finder quiz completed'))), 180);
    } else if (el.closest('[data-back]')) show(Math.max(0, i - 1));
    else if (el.closest('[data-restart]')) { for (const k in answers) delete answers[k]; root.querySelectorAll('.opt.picked').forEach((o) => o.classList.remove('picked')); show(0); }
  });
  show(0);
}
