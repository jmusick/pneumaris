import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, walk, ELEMENT_NODE } from 'ultrahtml';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const headers = await readFile(join(dist, '_headers'), 'utf8');
for (const line of headers.split(/\r?\n/)) {
  assert.ok(line.length <= 2000, 'Cloudflare _headers lines must fit the 2,000-character limit');
}
const policy = headers.match(/^\s+Content-Security-Policy:\s*(.+)$/m)?.[1];
assert.ok(policy, 'The build must ship an enforced CSP');
const scriptSources = policy.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1].split(/\s+/);
assert.ok(scriptSources?.includes("'self'"), 'Allow same-origin application scripts');
assert.ok(!scriptSources.includes("'unsafe-inline'"), 'Do not allow arbitrary inline scripts');
assert.match(policy, /(?:^|;)\s*script-src-attr\s+'none'(?:;|$)/, 'Block inline event handlers');

// The site origin, taken from the homepage canonical so it can't drift from SITE_URL.
const canonical = (await readFile(join(dist, 'index.html'), 'utf8')).match(/<link rel="canonical" href="([^"]+)"/)?.[1];
assert.ok(canonical, 'The homepage must declare a canonical URL');
const site = new URL(canonical).origin;

/** Every same-site URL the pages reference, checked against dist/ after the walk. */
const links = [];
const collectJsonLd = (value, page) => {
  if (typeof value === 'string') {
    if (value.startsWith(site)) links.push({ page, value });
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) collectJsonLd(child, page);
  }
};

async function checkPages(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await checkPages(path);
    } else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      const page = new URL('/' + relative(dist, path).split(sep).join('/').replace(/(^|\/)index\.html$/, '$1'), site);
      // Inspect parsed final output: Astro can inline small bundles during builds.
      await walk(parse(html), async (node) => {
        if (node.type !== ELEMENT_NODE) return;
        for (const [attribute, value] of Object.entries(node.attributes)) {
          assert.ok(!/^on/i.test(attribute), `Inline event handler in ${path}`);
          if (attribute === 'href' || attribute === 'src') {
            assert.doesNotMatch(value, /^\s*javascript:/i, `JavaScript URL in ${path}`);
            links.push({ page, value });
          }
        }
        // Social preview images and similar absolute URLs live in meta content.
        if (node.name === 'meta' && node.attributes.content?.startsWith(site)) {
          links.push({ page, value: node.attributes.content });
        }
        if (node.name !== 'script') return;
        const body = node.children.map((child) => child.value || '').join('');
        if (node.attributes.type === 'application/ld+json') {
          collectJsonLd(JSON.parse(body), page);
          return;
        }
        const source = node.attributes.src;
        assert.ok(source && !body.trim(), `Executable scripts must be external: ${path}`);
        if (!source.startsWith('/') || source.startsWith('//')) {
          assert.ok(scriptSources.includes(new URL(source).origin), `CSP must permit ${source}`);
        }
      });
      count++;
    }
  }
  return count;
}

const pages = await checkPages(dist);
assert.ok(pages > 0, 'Build pages before checking security');

// Every same-site link, image, script, and social/JSON-LD URL must exist in the
// build. Page links need the trailing slash Cloudflare Pages would redirect to.
let checked = 0;
for (const { page, value } of links) {
  const target = new URL(value, page);
  if (target.origin !== site) continue;
  let file = decodeURIComponent(target.pathname);
  if (file.endsWith('/')) {
    file += 'index.html';
  } else {
    assert.match(file, /\.[a-z0-9]+$/i, `Internal link needs a trailing slash: ${value} on ${page.pathname}`);
  }
  await access(join(dist, file)).catch(() => assert.fail(`Broken link: ${value} on ${page.pathname}`));
  checked++;
}

console.log(
  `Build checks passed for ${pages} pages: external scripts, valid JSON-LD, enforced CSP, ${checked} same-site links resolve.`,
);
