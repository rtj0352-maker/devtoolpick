// Tool facts used by the interactive pages. Every number here is copied from an article
// that cites the vendor page and the check date. Do not add numbers that no article cites.
export interface Tier { name: string; monthly: number; yearly?: number; note?: string }
export interface Tool {
  id: string; name: string; form: 'IDE extension' | 'AI-native editor' | 'Terminal agent';
  keepsIde: boolean; freeTier: boolean; checked: string;
  tiers: Tier[]; pricing: string; team: string;
  agent: boolean; prNative: string; terminal: string; models: string;
  bestFor: string; watch: string; review: string; official: string;
}
export const EN_CHECKED = 'Oct 15, 2026 (JST)';
export const tools: Tool[] = [
  {
    id: 'copilot', name: 'GitHub Copilot', form: 'IDE extension', keepsIde: true, freeTier: true, checked: EN_CHECKED,
    tiers: [{ name: 'Free', monthly: 0 }, { name: 'Pro', monthly: 10 }, { name: 'Pro+', monthly: 39 }, { name: 'Max', monthly: 100 }],
    pricing: 'Seat + GitHub AI Credits', team: 'Business / Enterprise plans (see GitHub)',
    agent: true, prNative: 'Excellent', terminal: 'Copilot CLI', models: 'Broad catalog via GitHub',
    bestFor: 'Teams on GitHub who don’t want to switch editors', watch: 'Chat and agent use is metered in AI Credits',
    review: 'github-copilot-pricing-explained-2026', official: 'https://github.com/features/copilot',
  },
  {
    id: 'cursor', name: 'Cursor', form: 'AI-native editor', keepsIde: false, freeTier: true, checked: EN_CHECKED,
    tiers: [{ name: 'Free', monthly: 0 }, { name: 'Plus', monthly: 8 }, { name: 'Premium', monthly: 30 }, { name: 'Super', monthly: 100 }, { name: 'Ultra', monthly: 200 }],
    pricing: 'Weekly usage pool', team: 'Teams / Enterprise (see Cursor)',
    agent: true, prNative: 'Good via git', terminal: 'Inside the editor', models: 'Cursor models; 3rd-party on Premium+',
    bestFor: 'Developers who want an agent-first editor', watch: 'Third-party models need Premium+ and prepaid credit',
    review: 'cursor-vs-copilot-vs-devin-desktop-vs-claude-code', official: 'https://cursor.com',
  },
  {
    id: 'devin', name: 'Devin Desktop', form: 'AI-native editor', keepsIde: false, freeTier: true, checked: EN_CHECKED,
    tiers: [{ name: 'Free', monthly: 0 }, { name: 'Pro', monthly: 20 }, { name: 'Max', monthly: 200 }],
    pricing: 'Daily / weekly quota', team: 'Teams from ~$80/mo minimum',
    agent: true, prNative: 'Good via git', terminal: 'Separate Devin CLI', models: 'Multi-model on paid quotas',
    bestFor: 'Fans of Cascade-style (ex-Windsurf) multi-step agents', watch: 'Frontier models burn quota; overage at API rates',
    review: 'best-ai-coding-assistants-2026', official: 'https://devin.ai',
  },
  {
    id: 'claude', name: 'Claude Code', form: 'Terminal agent', keepsIde: true, freeTier: false, checked: EN_CHECKED,
    tiers: [{ name: 'Claude Pro', monthly: 20, yearly: 200, note: '$17/mo billed annually' }, { name: 'Claude Max 5x', monthly: 100 }, { name: 'Claude Max 20x', monthly: 200 }],
    pricing: 'Shared Claude session / weekly limits', team: 'Team / Enterprise or API (see Anthropic)',
    agent: true, prNative: 'Strong via CLI', terminal: 'Native', models: 'Anthropic models',
    bestFor: 'Engineers doing deep, multi-file refactors', watch: 'Limits are shared with Claude chat apps',
    review: 'claude-code-review-2026', official: 'https://claude.com/product/claude-code',
  },
];

export interface JaTool {
  id: string; name: string; task: string; free: string; plans: Tier[]; checked: string; review: string;
  a8: { href: string; pixel: string; label: string }; good: string; watch: string;
}
export const jaTools: JaTool[] = [
  { id: 'notta', name: 'Notta', task: '会議の議事録・文字起こし', free: '月120分（1回3分まで）・AI要約10回/月', checked: '2026年10月15日',
    plans: [{ name: 'プレミアム', monthly: 1980, yearly: 14220 }, { name: 'ビジネス（1アカウント）', monthly: 4180, yearly: 30096 }],
    review: 'notta-review-2026', good: '文字起こし＋AI要約で議事録の下書きまで完成。Zoom・Teams・Meet・Webex対応', watch: '無料は1回3分まで。精度は録音環境しだい',
    a8: { href: 'https://px.a8.net/svt/ejp?a8mat=4BEH56+BJKL0Y+5988+5YJRM', pixel: 'https://www11.a8.net/0.gif?a8mat=4BEH56+BJKL0Y+5988+5YJRM', label: 'Nottaを無料で試す' } },
  { id: 'irusiru', name: 'イルシル', task: '提案書・社内資料のスライド', free: 'AIデザイン生成3枚/月・資料3個まで（出力不可）', checked: '2026年10月15日',
    plans: [{ name: 'パーソナル', monthly: 1848, yearly: 17160 }, { name: 'パーソナルプラス（年契約のみ）', monthly: 5500, yearly: 66000, note: '年契約のみ・月あたり換算' }],
    review: 'ai-slide-tools-comparison-2026-irusiru', good: '日本語の見出しや表が崩れにくい国産スライドAI', watch: '無料プランはPowerPoint・PDF出力不可',
    a8: { href: 'https://px.a8.net/svt/ejp?a8mat=4BEH56+BFEJSI+5UMS+5YJRM', pixel: 'https://www10.a8.net/0.gif?a8mat=4BEH56+BFEJSI+5UMS+5YJRM', label: 'イルシルを無料で試す' } },
  { id: 'catchy', name: 'Catchy', task: '広告コピー・メール文面', free: '毎月10クレジット・全生成ツール利用可', checked: '2026年10月21日',
    plans: [{ name: 'Starter（100クレジット）', monthly: 3000 }, { name: 'Pro', monthly: 9800 }],
    review: 'catchy-review-2026', good: '100種類以上の生成ツールで短い文章の案を量産', watch: '料金表に税込・税別の明記なし',
    a8: { href: 'https://px.a8.net/svt/ejp?a8mat=4BEH56+BLCVUA+52IU+5YJRM', pixel: 'https://www18.a8.net/0.gif?a8mat=4BEH56+BLCVUA+52IU+5YJRM', label: 'Catchyを無料で試す' } },
  { id: 'valueai', name: 'Value AI Writer', task: 'SEOブログ記事の作成', free: 'フリー0円（初回は3記事まで）', checked: '2026年10月16日',
    plans: [{ name: 'エントリー（6記事）', monthly: 840 }, { name: 'ベーシック（20記事）', monthly: 2800 }, { name: 'プロ（100記事）', monthly: 10780 }],
    review: 'value-ai-writer-review-2026', good: 'キーワードから見出し・本文まで生成、WordPress連携', watch: '見出し生成の時点で1記事としてカウント',
    a8: { href: 'https://px.a8.net/svt/ejp?a8mat=4BEH56+BE7OKY+1JUK+1HL85U', pixel: 'https://www10.a8.net/0.gif?a8mat=4BEH56+BE7OKY+1JUK+1HL85U', label: 'Value AI Writerを無料で試す' } },
  { id: 'conoha', name: 'ConoHa AI Canvas', task: '画像生成（Stable Diffusion系）', free: '無料プランなし（各プランに無料WebUI時間付き）', checked: '2026年10月16日',
    plans: [{ name: 'エントリー（無料10時間）', monthly: 1100 }, { name: 'スタンダード（無料50時間）', monthly: 4378 }, { name: 'アドバンス（無料100時間）', monthly: 9878 }],
    review: 'conoha-ai-canvas-review-2026', good: 'GPU不要、ブラウザでAUTOMATIC1111やComfyUI', watch: '無料時間超過後は税込6.6円/分の従量課金',
    a8: { href: 'https://px.a8.net/svt/ejp?a8mat=4BEH56+BDM8Z6+50+7RTY1E', pixel: 'https://www10.a8.net/0.gif?a8mat=4BEH56+BDM8Z6+50+7RTY1E', label: 'ConoHa AI Canvasを公式サイトで見る' } },
];
