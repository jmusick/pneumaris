import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

// Cloudflare Pages serves a top-level 404.html with HTTP 404 for unknown routes.
const dist = new URL('../dist/', import.meta.url);

test('build emits a noindex 404 page', () => {
  assert.ok(existsSync(new URL('404.html', dist)), 'Build must emit dist/404.html');
  const html = readFileSync(new URL('404.html', dist), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,nofollow"/);
  assert.match(html, /<main[^>]* id="main"/);
  assert.match(html, /href="\/"/);
});

test('sitemap excludes the 404 page', () => {
  const index = readFileSync(new URL('sitemap-index.xml', dist), 'utf8');
  const file = index.match(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/)?.[1];
  assert.ok(file, 'Sitemap index must reference a sitemap');
  const sitemap = readFileSync(new URL(file, dist), 'utf8');
  assert.doesNotMatch(sitemap, /404/);
});
