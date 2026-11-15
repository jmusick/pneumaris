import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync(new URL('../dist/music/index.html', import.meta.url), 'utf8');

// Each release is an <article class="album-card">; the closing follow links sit after the last one.
const releases = html.split(/<article\b[^>]*class="[^"]*\balbum-card\b/).slice(1);
const listenLinks = (fragment) =>
  [...fragment.matchAll(/<a\b[^>]*class="([^"]*\blisten-link\b[^"]*)"[^>]*href="([^"]+)"/g)]
    .map(([, classes, href]) => ({ classes: classes.split(/\s+/), href }));
// Astro may print href before class; fall back to that attribute order too.
const links = (fragment) => {
  const found = listenLinks(fragment);
  if (found.length) return found;
  return [...fragment.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*class="([^"]*\blisten-link\b[^"]*)"/g)]
    .map(([, href, classes]) => ({ classes: classes.split(/\s+/), href }));
};

test('every release leads with Spotify or Apple Music when one is live', () => {
  assert.ok(releases.length > 0, 'Build the site before testing the music page');
  for (const release of releases) {
    const found = links(release.split(/<ol\b/)[0]);
    assert.ok(found.length > 0, 'each release has listen links');
    const stores = found.map(({ href }) => href);
    const hasStore = stores.some((href) => /open\.spotify\.com|music\.apple\.com/.test(href));
    if (hasStore) assert.doesNotMatch(stores[0], /soundcloud\.com/, 'SoundCloud never leads a release that is on a store');
    assert.ok(found[0].classes.includes('listen-link-lead'));
  }
});

test('only the newest release carries the filled primary action', () => {
  const primaries = links(html).filter(({ classes }) => classes.includes('listen-link-primary'));
  assert.equal(primaries.length, 1);
  assert.ok(links(releases[0]).some(({ classes }) => classes.includes('listen-link-primary')));
});

test('the closing follow links lead with Spotify and Apple Music', () => {
  const closing = releases.at(-1).split(/<\/article>/).slice(1).join('');
  const hrefs = links(closing).map(({ href }) => href);
  assert.equal(hrefs.length, 3);
  assert.match(hrefs[0], /open\.spotify\.com\/artist/);
  assert.match(hrefs[1], /music\.apple\.com/);
  assert.match(hrefs[2], /soundcloud\.com/);
});
