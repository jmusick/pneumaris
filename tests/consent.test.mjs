import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

// Exercise the actual deployable consent bundle after npm test builds it.
const assets = new URL('../dist/_astro/', import.meta.url);
const filename = readdirSync(assets).find((name) => name.startsWith('CookieConsent.') && name.endsWith('.js'));
assert.ok(filename, 'Build the site before testing consent');
const script = readFileSync(new URL(filename, assets), 'utf8');

function visitor({ stored = null, measurementId = 'G-TEST', storageBlocked = false } = {}) {
  const requests = [];
  const cookieWrites = [];
  const listeners = {};
  const state = { stored, reloads: 0, focused: false };
  class Element {
    constructor(choice) { this.choice = choice; }
    closest(selector) {
      return selector === '[data-consent]' && this.choice ? this : null;
    }
    getAttribute() { return this.choice; }
  }
  const banner = {
    hidden: true,
    dataset: { measurementId },
    addEventListener(name, callback) { listeners[`banner:${name}`] = callback; },
    querySelector() { return { focus() { state.focused = true; } }; },
  };
  const document = {
    getElementById() { return banner; },
    addEventListener(name, callback) { listeners[`document:${name}`] = callback; },
    createElement() { return {}; },
    head: { appendChild(element) { requests.push(element.src); } },
    get cookie() { return '_ga=one; _ga_TEST=two; unrelated=keep'; },
    set cookie(value) { cookieWrites.push(value); },
  };
  const window = {};
  runInNewContext(script, {
    document, window, Element,
    location: { hostname: 'pneumarisband.com', reload() { state.reloads++; } },
    localStorage: {
      getItem() { if (storageBlocked) throw new Error('blocked'); return state.stored; },
      setItem(key, value) { if (storageBlocked) throw new Error('blocked'); state.stored = value; },
    },
  });
  return {
    banner, state, requests, cookieWrites, window,
    choose(choice) { listeners['banner:click']({ target: new Element(choice) }); },
    reopen() {
      const trigger = new Element();
      trigger.closest = () => trigger;
      listeners['document:click']({ target: trigger, preventDefault() {} });
    },
  };
}

test('fresh and declined visitors make no analytics requests', () => {
  const fresh = visitor();
  assert.equal(fresh.banner.hidden, false);
  assert.deepEqual(fresh.requests, []);
  fresh.choose('denied');
  assert.equal(fresh.state.stored, 'denied');
  assert.equal(fresh.banner.hidden, true);
  assert.deepEqual(fresh.requests, []);
  const declined = visitor({ stored: 'denied' });
  assert.equal(declined.banner.hidden, true);
  assert.deepEqual(declined.requests, []);
});

test('accept loads exactly one tag and sets denied advertising consent before analytics config', () => {
  const page = visitor();
  page.choose('granted');
  page.choose('granted');
  assert.deepEqual(page.requests, ['https://www.googletagmanager.com/gtag/js?id=G-TEST']);
  const commands = JSON.parse(JSON.stringify(page.window.dataLayer.map((args) => Array.from(args))));
  assert.deepEqual(commands[0], ['consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  }]);
  assert.deepEqual(commands[1], ['consent', 'update', { analytics_storage: 'granted' }]);
  assert.deepEqual(commands.at(-1), ['config', 'G-TEST']);
  assert.equal(visitor({ stored: 'granted' }).requests.length, 1);
});

test('reopening and withdrawing consent clears only analytics cookies and reloads', () => {
  const page = visitor({ stored: 'granted' });
  page.reopen();
  assert.equal(page.banner.hidden, false);
  assert.equal(page.state.focused, true);
  page.choose('denied');
  assert.equal(page.state.stored, 'denied');
  assert.equal(page.state.reloads, 1);
  assert.equal(page.cookieWrites.length, 6);
  assert.ok(page.cookieWrites.every((value) => value.startsWith('_ga') && value.includes('Max-Age=0')));
});

test('blocked storage and development without a measurement ID fail safely', () => {
  const blocked = visitor({ storageBlocked: true });
  assert.equal(blocked.banner.hidden, false);
  assert.deepEqual(blocked.requests, []);
  blocked.choose('denied');
  assert.deepEqual(blocked.requests, []);
  blocked.choose('granted');
  assert.equal(blocked.requests.length, 1);
  const development = visitor({ measurementId: '' });
  development.choose('granted');
  assert.deepEqual(development.requests, []);
});
