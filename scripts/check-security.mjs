import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
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

async function checkPages(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await checkPages(path);
    } else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      // Inspect parsed final output: Astro can inline small bundles during builds.
      await walk(parse(html), async (node) => {
        if (node.type !== ELEMENT_NODE) return;
        for (const [attribute, value] of Object.entries(node.attributes)) {
          assert.ok(!/^on/i.test(attribute), `Inline event handler in ${path}`);
          if (attribute === 'href' || attribute === 'src') {
            assert.doesNotMatch(value, /^\s*javascript:/i, `JavaScript URL in ${path}`);
          }
        }
        if (node.name !== 'script') return;
        const body = node.children.map((child) => child.value || '').join('');
        if (node.attributes.type === 'application/ld+json') {
          JSON.parse(body);
          return;
        }
        const source = node.attributes.src;
        assert.ok(source && !body.trim(), `Executable scripts must be external: ${path}`);
        if (source.startsWith('/') && !source.startsWith('//')) {
          await readFile(join(dist, source));
        } else {
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
console.log(`Security build checks passed for ${pages} pages: external scripts, valid JSON-LD, enforced CSP.`);
