import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const assets = new URL('../dist/_astro/', import.meta.url);
const filename = readdirSync(assets).find((name) => name.startsWith('TrackPlayer.') && name.endsWith('.js'));
assert.ok(filename, 'Build the site before testing playback');
const script = readFileSync(new URL(filename, assets), 'utf8');
const settle = () => new Promise(setImmediate);

function listener() {
  const nodes = new Map();
  const timers = new Map();
  const widgets = [];
  let document;
  let nextTimer = 0;
  class Element {
    constructor(tag = 'div') {
      this.tag = tag;
      this.dataset = {};
      this.attributes = new Map();
      this.events = new Map();
      this.children = [];
      this.hidden = true;
      this.value = '0';
      this.textContent = '';
      this.classList = { add() {}, remove() {} };
    }
    setAttribute(name, value) { this.attributes.set(name, value); }
    addEventListener(name, callback) { this.events.set(name, callback); }
    fire(name) { this.events.get(name)?.({ target: this }); }
    appendChild(child) { this.children.push(child); }
    replaceChildren(...children) { this.children = children; }
    querySelector(selector) { return selector === 'iframe' ? this.children.find((child) => child.tag === 'iframe') : this.label; }
    remove() { document.head.children = document.head.children.filter((child) => child !== this); }
    focus() { document.activeElement = this; }
  }
  const buttons = ['First', 'Second', 'Other release'].map((title, index) => {
    const button = new Element('button');
    button.dataset = { trackTitle: title, trackUrl: `https://soundcloud.com/band/track-${index}`, trackAlbum: index < 2 ? 'Album A' : 'Album B', trackArtwork: '/art.webp' };
    button.label = new Element('span');
    return button;
  });
  document = {
    head: new Element('head'), body: new Element('body'), activeElement: null,
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); },
    querySelectorAll() { return buttons; },
    createElement(tag) { return new Element(tag); },
  };
  const window = {};
  const factory = () => {
    const handlers = new Map();
    const widget = {
      loads: [], plays: 0, seeks: [],
      bind(event, callback) { handlers.set(event, callback); },
      emit(event, payload) { handlers.get(event)?.(payload); },
      play() { this.plays++; this.emit('PLAY'); },
      pause() { this.emit('PAUSE'); },
      seekTo(position) { this.seeks.push(position); },
      getDuration(callback) { callback(120000); },
      load(url, options) { this.loads.push({ url, options }); },
    };
    widgets.push(widget);
    return widget;
  };
  factory.Events = Object.fromEntries(['READY', 'ERROR', 'PLAY', 'PAUSE', 'PLAY_PROGRESS', 'FINISH'].map((name) => [name, name]));
  runInNewContext(script, {
    document, window, URLSearchParams,
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  });
  return {
    nodes, document, buttons, widgets, timers,
    async click(index) { buttons[index].fire('click'); await settle(); },
    close() { nodes.get('player-close').fire('click'); },
    async api() { window.SC = { Widget: factory }; document.head.children.at(-1).fire('load'); await settle(); },
    async ready() { widgets.at(-1).emit('READY'); await settle(); },
    async load(index) { widgets[0].loads[index].options.callback(); await settle(); },
  };
}

test('SoundCloud loads only on Play and a blocked script can be retried', async () => {
  const page = listener();
  assert.equal(page.document.head.children.length, 0);
  assert.equal(page.nodes.get('player-embed').children.length, 0);
  await page.click(0);
  page.document.head.children[0].fire('error');
  await settle();
  assert.match(page.nodes.get('player-status').textContent, /Playback could not start/);
  assert.equal(page.nodes.get('player-toggle').disabled, false);
  page.nodes.get('player-native-toggle').fire('click');
  const fallback = page.nodes.get('player-embed').children[0];
  assert.equal(fallback.tag, 'iframe');
  assert.equal(fallback.attributes.get('aria-hidden'), 'false');
  await page.click(0);
  await page.api();
  await page.ready();
  assert.equal(page.nodes.get('track-player').dataset.playing, 'true');
  assert.equal(page.buttons[0].attributes.get('aria-pressed'), 'true');
});

test('closing while the API loads cannot create a stale player after reopening', async () => {
  const page = listener();
  await page.click(0);
  page.close();
  await page.click(1);
  await page.api();
  await page.ready();
  assert.equal(page.widgets.length, 1);
  assert.equal(page.nodes.get('player-title').textContent, 'Second');
  assert.equal(page.widgets[0].plays, 1);
  assert.equal(page.nodes.get('player-embed').children.length, 1);
  page.close();
  assert.equal(page.nodes.get('player-embed').children.length, 0);
  assert.equal(page.document.activeElement, page.buttons[1]);
});

test('rapid track changes ignore stale callbacks and preserve the newest timeout', async () => {
  const page = listener();
  await page.click(0); await page.api(); await page.ready();
  await page.click(1);
  await page.click(2);
  const timerCount = page.timers.size;
  await page.load(0);
  assert.equal(page.widgets[0].plays, 1);
  assert.equal(page.timers.size, timerCount);
  await page.load(1);
  assert.equal(page.widgets[0].plays, 2);
  assert.equal(page.nodes.get('player-title').textContent, 'Other release');
  assert.equal(page.buttons[2].attributes.get('aria-pressed'), 'true');
  assert.equal(page.nodes.get('player-embed').children.length, 1);
});

test('pause, seek, and automatic advance stay within the selected release', async () => {
  const page = listener();
  await page.click(0); await page.api(); await page.ready();
  page.nodes.get('player-toggle').fire('click');
  assert.equal(page.nodes.get('track-player').dataset.playing, 'false');
  const seek = page.nodes.get('player-seek');
  seek.fire('pointerdown');
  seek.value = '30000';
  seek.fire('input');
  page.document.activeElement = seek;
  page.widgets[0].emit('PLAY_PROGRESS', { currentPosition: 1000 });
  assert.equal(seek.value, '30000');
  seek.fire('change');
  assert.deepEqual(page.widgets[0].seeks, [30000]);
  page.widgets[0].emit('PLAY_PROGRESS', { currentPosition: 31000 });
  assert.equal(seek.value, '31000');
  page.widgets[0].emit('FINISH');
  await settle(); await page.load(0);
  assert.equal(page.nodes.get('player-title').textContent, 'Second');
  page.widgets[0].emit('FINISH');
  assert.equal(page.widgets[0].loads.length, 1);
  assert.equal(page.nodes.get('player-status').textContent, 'End of release.');
});
