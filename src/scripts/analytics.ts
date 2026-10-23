// Cookieless GoatCounter events: affiliate clicks and quiz completions. No-ops if GoatCounter is absent/blocked.
type GC = { count?: (o: { path: string; title?: string; event?: boolean }) => void };

export function track(path: string, title?: string) {
  const gc = (window as unknown as { goatcounter?: GC }).goatcounter;
  if (gc?.count) gc.count({ path, title: title ?? path, event: true });
}

if (!(window as unknown as { __gcClicks?: boolean }).__gcClicks) {
  (window as unknown as { __gcClicks?: boolean }).__gcClicks = true;
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[rel~="sponsored"]') as HTMLAnchorElement | null;
      if (!a) return;
      let host = 'link';
      try { host = new URL(a.href).hostname; } catch { /* ignore */ }
      const label = (a.textContent || '').trim().slice(0, 60);
      track(`affiliate-click/${host}${location.pathname}`, `Affiliate: ${label}`);
    },
    { capture: true },
  );
}

// Count client-side (view transition) navigations; the first page view is counted by count.js itself.
document.addEventListener('astro:after-swap', () => {
  const gc = (window as unknown as { goatcounter?: GC }).goatcounter;
  if (gc?.count) gc.count({ path: location.pathname + location.search, title: document.title });
});
