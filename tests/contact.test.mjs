import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
// Node strips the TypeScript types; the function has no runtime imports.
import { LIMITS, onRequest } from '../functions/api/contact.ts';

const ENV = {
  CLOUDFLARE_API_TOKEN: 'test-token',
  CLOUDFLARE_ACCOUNT_ID: 'account-id',
  EMAIL_FROM_CONTACT: 'contact@pneumarisband.com',
  CONTACT_TO_EMAIL: 'hello@pneumarisband.com',
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
};

const VALID = {
  name: 'Ada Visitor',
  email: 'ada@example.com',
  subject: 'Booking',
  message: 'Can you play <b>Friday</b>?',
  website: '',
  captchaToken: 'token-123',
};

const realFetch = globalThis.fetch;
let calls;
let logged;
const quiet = {};

beforeEach(() => {
  calls = [];
  logged = [];
  for (const level of ['log', 'warn', 'error']) {
    quiet[level] = console[level];
    console[level] = (...args) => logged.push(JSON.stringify(args));
  }
});

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const level of ['log', 'warn', 'error']) console[level] = quiet[level];
});

/** Answers Siteverify and Email Sending with the given results. */
function mockUpstream({ verify = { success: true }, send = { success: true }, sendStatus = 200 } = {}) {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('turnstile')) return Response.json(verify);
    return Response.json(send, { status: sendStatus });
  };
}

function post(body, env = ENV) {
  const request = new Request('https://pneumarisband.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return onRequest({ request, env });
}

test('sends a valid message from the verified domain with the visitor as reply-to', async () => {
  mockUpstream();
  const response = await post(VALID);
  assert.equal(response.status, 201);
  assert.ok(response.headers.get('X-Request-Id'));
  assert.equal(response.headers.get('Cache-Control'), 'no-store');

  assert.equal(calls.length, 2);
  const verifyBody = new URLSearchParams(calls[0].init.body);
  assert.equal(verifyBody.get('secret'), 'turnstile-secret');
  assert.equal(verifyBody.get('response'), 'token-123');

  assert.equal(calls[1].url, 'https://api.cloudflare.com/client/v4/accounts/account-id/email/sending/send');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer test-token');
  const mail = JSON.parse(calls[1].init.body);
  assert.equal(mail.from, 'contact@pneumarisband.com');
  assert.equal(mail.to, 'hello@pneumarisband.com');
  assert.equal(mail.reply_to, 'ada@example.com');
  assert.equal(mail.subject, '[pneumarisband.com] Booking — Ada Visitor');
  assert.match(mail.text, /Can you play <b>Friday<\/b>\?/);
  assert.match(mail.html, /Can you play &lt;b&gt;Friday&lt;\/b&gt;\?/);
  assert.doesNotMatch(mail.html, /<b>Friday/);
});

test('rejects blank, whitespace-only, malformed, and over-limit fields before any upstream call', async () => {
  mockUpstream();
  const cases = [
    [{ name: '   ' }, 'name'],
    [{ email: '' }, 'email'],
    [{ email: 'not-an-email' }, 'email'],
    [{ subject: '\n\t' }, 'subject'],
    [{ message: '    ' }, 'message'],
    [{ name: 'x'.repeat(LIMITS.name + 1) }, 'name'],
    [{ message: 'x'.repeat(LIMITS.message + 1) }, 'message'],
  ];
  for (const [override, field] of cases) {
    const response = await post({ ...VALID, ...override });
    assert.equal(response.status, 400, JSON.stringify(override).slice(0, 60));
    assert.equal((await response.json()).field, field);
  }
  assert.equal(calls.length, 0);
});

test('honeypot submissions look sent but send nothing', async () => {
  mockUpstream();
  const response = await post({ ...VALID, website: 'https://spam.example' });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 0);
});

test('a missing or rejected Turnstile token never sends mail', async () => {
  mockUpstream({ verify: { success: false, 'error-codes': ['invalid-input-response'] } });
  assert.equal((await post(VALID)).status, 400);
  assert.equal((await post({ ...VALID, captchaToken: '' })).status, 400);
  assert.equal(calls.filter((call) => call.url.includes('email/sending')).length, 0);
});

test('missing configuration answers 503 without disclosing values', async () => {
  mockUpstream();
  const noSecret = await post(VALID, { ...ENV, TURNSTILE_SECRET_KEY: undefined });
  assert.equal(noSecret.status, 503);
  assert.equal((await noSecret.json()).code, 'turnstile_unconfigured');

  const noToken = await post(VALID, { ...ENV, CLOUDFLARE_API_TOKEN: '' });
  assert.equal(noToken.status, 503);
  assert.deepEqual((await noToken.json()).missing, ['CLOUDFLARE_API_TOKEN']);
});

test('an Email Sending rejection is a 502 and logs only codes', async () => {
  mockUpstream({ send: { success: false, errors: [{ code: 10001, message: 'ada@example.com rejected' }] }, sendStatus: 400 });
  const response = await post(VALID);
  assert.equal(response.status, 502);
  const log = logged.join('\n');
  assert.match(log, /send_rejected/);
  assert.match(log, /10001/);
  assert.doesNotMatch(log, /ada@example\.com|Friday|token-123|test-token/);
});

test('rejects other methods, malformed JSON, and oversized bodies', async () => {
  mockUpstream();
  const get = await onRequest({ request: new Request('https://pneumarisband.com/api/contact'), env: ENV });
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST');
  assert.equal((await post('{nope')).status, 400);
  assert.equal((await post('[1,2]')).status, 400);
  assert.equal((await post({ ...VALID, name: 42 })).status, 400);
  assert.equal((await post({ ...VALID, message: 'x'.repeat(50 * 1024) })).status, 413);
  assert.equal(calls.length, 0);
});
