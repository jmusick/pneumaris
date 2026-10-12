// Read-only HTTP inventory. Writes evidence only when an output path is supplied.
import { writeFile } from 'node:fs/promises';
const origin = 'https://pneumarisband.com';
const auditDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
const urls = ['/', '/music/', '/about/', '/extras/', '/contact/', '/privacy-policy/',
  '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', `/audit-missing-page-${auditDate}/`,
  '/music', '/about', '/extras', '/contact', '/privacy-policy'].map(path => origin + path);
urls.push('http://pneumarisband.com/music/', 'https://www.pneumarisband.com/music/', 'http://www.pneumarisband.com/music/');
const results = await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    const meta = name => html.match(new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`))?.[1];
    const headerNames = ['location', 'content-type', 'content-length', 'content-security-policy',
      'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'x-frame-options',
      'cross-origin-opener-policy', 'permissions-policy', 'cache-control', 'access-control-allow-origin'];
    return { url, status: response.status, headers: Object.fromEntries(headerNames
      .filter(name => response.headers.has(name)).map(name => [name, response.headers.get(name)])),
      title: html.match(/<title>(.*?)<\/title>/s)?.[1], description: meta('description'), robots: meta('robots'),
      canonical: html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1],
      h1: [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map(m => m[1]),
      structuredData: [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1])),
      content: /\.(txt|xml)$/.test(url) ? html : undefined,
      version: html.match(/footer-version[^>]*>v([^<]+)/)?.[1],
      bytes: Buffer.byteLength(html) };
  } catch (error) { return { url, error: error.message }; }
}));
const report = { auditDate, checkedAt: new Date().toISOString(), results };
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(results.map(({ url, status, headers, title, canonical, h1, content, version, error }) =>
  ({ url, status, location: headers?.location, title, canonical, h1, content, version, error })), null, 2));
