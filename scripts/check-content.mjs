#!/usr/bin/env node
// Post-build guardrail for DevToolPick. Run via `npm run check` (which builds first).
// Inspects the rendered site in dist/ plus the Markdown sources and exits 1 on any error.
//
// Errors:
//   - Amazon link not exactly https://www.amazon.co.jp/dp/<ASIN>?tag=<amazonTag>
//   - A8 link/pixel whose a8mat is not in scripts/affiliate-programs.json
//   - affiliate <a> missing rel="nofollow sponsored"
//   - page with affiliate links but no visible disclosure (aside.disclosure);
//     Amazon links additionally need the Amazon Associates statement on the page
//   - internal link/asset that does not resolve to a file in dist/ (respects BASE_PATH)
// Warnings:
//   - A8_AFFILIATE_LINK / AFFILIATE_LINK placeholders still present in sources

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const cfg = JSON.parse(readFileSync(join(root, 'scripts/affiliate-programs.json'), 'utf8'));
let base = process.env.BASE_PATH || '/devtoolpick/';
if (!base.endsWith('/')) base += '/';
const siteOrigin = new URL(process.env.SITE_URL || 'https://rtj0352-maker.github.io/devtoolpick').origin;

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#x26;/gi, '&').replace(/&#38;/g, '&').replace(/&quot;/g, '"');

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return out;
}

function host(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

const isAmazon = (h) => /(^|\.)amazon\.[a-z.]+$/.test(h) || h === 'amzn.to' || h === 'amzn.asia';
const isA8 = (h) => h === 'a8.net' || h.endsWith('.a8.net');
const amazonRe = new RegExp(`^https://www\\.amazon\\.co\\.jp/dp/[A-Z0-9]{10}\\?tag=${cfg.amazonTag}$`);
const a8LinkRe = /^https:\/\/px\.a8\.net\/svt\/ejp\?a8mat=([A-Z0-9+]+)$/;
const a8PixelRe = /^https:\/\/www\d*\.a8\.net\/0\.gif\?a8mat=([A-Z0-9+]+)$/;

// ---- 1. Rendered pages ----------------------------------------------------
if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first (or just `npm run check`).');
  process.exit(1);
}

function resolveInternal(pageFile, url) {
  // Returns null if external; otherwise the dist-relative path it must resolve to (or an error string).
  let path;
  if (/^(mailto:|tel:|javascript:|data:)/i.test(url) || url.startsWith('#') || url === '') return null;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) {
    const u = new URL(url, siteOrigin);
    if (u.origin !== siteOrigin || !u.pathname.startsWith(base)) return null; // external
    path = u.pathname;
  } else if (url.startsWith('/')) {
    path = url.split(/[?#]/)[0];
    if (!path.startsWith(base)) return { bad: `root-relative link "${url}" is missing base ${base}` };
  } else {
    const pageUrl = base + relative(dist, dirname(pageFile)).split('\\').join('/') + '/';
    path = posix.normalize(posix.join(pageUrl, url.split(/[?#]/)[0]));
  }
  path = decodeURIComponent(path.split(/[?#]/)[0]);
  const rel = path.slice(base.length);
  const candidates = rel === '' || rel.endsWith('/') ? [join(dist, rel, 'index.html')] : [join(dist, rel), join(dist, rel, 'index.html')];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile()) ? null : { bad: `internal link "${url}" does not resolve to a built page` };
}

const pages = walk(dist, '.html');
let affiliateLinkCount = 0;
for (const file of pages) {
  const name = relative(root, file);
  const html = readFileSync(file, 'utf8');
  let hasAffiliate = false;
  let hasAmazon = false;

  for (const m of html.matchAll(/<(a|link|img|script|source)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase();
    const a = attrs(m[0]);
    const url = tag === 'a' || tag === 'link' ? a.href : a.src;
    if (url == null) continue;
    const h = host(url);

    if (isAmazon(h)) {
      hasAffiliate = hasAmazon = true;
      if (tag === 'a') affiliateLinkCount++;
      if (!amazonRe.test(url)) err(name, `Amazon link must be https://www.amazon.co.jp/dp/<ASIN>?tag=${cfg.amazonTag}, got ${url}`);
    } else if (isA8(h)) {
      hasAffiliate = true;
      const re = tag === 'img' ? a8PixelRe : a8LinkRe;
      const mm = url.match(re);
      if (!mm) err(name, `A8 ${tag === 'img' ? 'pixel' : 'link'} has unexpected format: ${url}`);
      else if (!(mm[1] in cfg.a8)) err(name, `A8 a8mat "${mm[1]}" is not an approved program (scripts/affiliate-programs.json)`);
      if (tag === 'a') affiliateLinkCount++;
    } else {
      const r = resolveInternal(file, url);
      if (r?.bad) err(name, r.bad);
      continue;
    }

    if (tag === 'a') {
      const rel = (a.rel || '').toLowerCase().split(/\s+/);
      if (!rel.includes('nofollow') || !rel.includes('sponsored')) {
        err(name, `affiliate link missing rel="nofollow sponsored": ${url}`);
      }
    }
  }

  if (hasAffiliate && !/<aside[^>]*class="[^"]*\bdisclosure\b/.test(html)) {
    err(name, 'page has affiliate links but no visible disclosure (<aside class="disclosure">)');
  }
  if (hasAmazon && !/Amazon Associate|Amazonアソシエイト|アマゾンアソシエイト/.test(html)) {
    err(name, 'page has Amazon links but no Amazon Associates statement ("As an Amazon Associate we earn from qualifying purchases.")');
  }
}

// ---- 2. Sources: placeholders + Markdown-syntax affiliate links -----------
const sources = walk(join(root, 'src/content'), '.md').concat(walk(join(root, 'src/content'), '.mdx'));
for (const file of sources) {
  const name = relative(root, file);
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/<!--\s*(A8_)?AFFILIATE_LINK:?\s*([^>]*?)\s*-->/g)) {
    warn(name, `affiliate placeholder still pending: ${m[0]}`);
  }
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    const h = host(m[1]);
    if (isAmazon(h) || isA8(h)) err(name, `affiliate link written as Markdown [..](..) can't carry rel; use <a href=".." rel="nofollow sponsored noopener">: ${m[1]}`);
  }
}

// ---- Report ---------------------------------------------------------------
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(
  `\ncheck-content: ${pages.length} pages, ${affiliateLinkCount} affiliate links, ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length ? 1 : 0);
