import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreInitialAnchor } from '../src/lib/initial-anchor.mjs';

function fixture(hash = '#faq', navigationType = 'navigate') {
  let now = 0;
  let nextFrame = 0;
  let top = 6000;
  const frames = new Map();
  const timers = new Map();
  const listeners = new Map();
  const calls = [];
  const target = { getBoundingClientRect: () => ({ top }), scrollIntoView: (options) => calls.push(options) };
  const browserWindow = {
    location: { hash }, scrollY: 0,
    performance: { now: () => now, getEntriesByType: () => [{ type: navigationType }] },
    requestAnimationFrame: (fn) => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (fn, delay) => { timers.set(++nextFrame, { fn, at: now + delay }); return nextFrame; },
    clearTimeout: (id) => timers.delete(id),
    addEventListener: (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener: (name, fn) => listeners.get(name)?.delete(fn),
  };
  const browserDocument = { fonts: { ready: Promise.resolve() }, body: { scrollHeight: 10000 }, getElementById: (id) => id === 'faq' ? target : null };
  return {
    browserWindow, browserDocument, calls, frames,
    move: (value) => { top = value; },
    frame: (elapsed = 16) => {
      now += elapsed;
      for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn(); }
      const pending = [...frames.values()]; frames.clear(); for (const fn of pending) fn(now);
    },
    emit: (name) => { for (const fn of [...(listeners.get(name) ?? [])]) fn(); },
    listenerCount: () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0),
  };
}

const start = async (f) => { const cleanup = restoreInitialAnchor(f.browserWindow, f.browserDocument); await Promise.resolve(); return cleanup; };

test('initial anchor waits for stable enhanced layout, scrolls once, then removes all handlers', async () => {
  const f = fixture();
  await start(f);
  f.frame(); f.move(8000); f.frame(); f.frame();
  assert.equal(f.calls.length, 0);
  f.frame(); f.frame();
  assert.deepEqual(f.calls, [{ block: 'start', behavior: 'instant' }]);
  assert.equal(f.listenerCount(), 0);
  f.move(9000); f.frame();
  assert.equal(f.calls.length, 1);
});

test('empty, missing, malformed fragments and back-forward restoration do not override native scroll', async () => {
  for (const [hash, type] of [['', 'navigate'], ['#missing', 'navigate'], ['#%E0%A4%A', 'navigate'], ['#faq', 'back_forward']]) {
    const f = fixture(hash, type);
    await start(f); f.frame(); f.frame(); f.frame(); f.frame();
    assert.equal(f.calls.length, 0);
    assert.equal(f.listenerCount(), 0);
  }
});

test('user input, changed hash and unmount cancel pending initial alignment', async () => {
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange', 'pagehide', 'unmount']) {
    const f = fixture();
    const cleanup = await start(f);
    f.frame();
    if (event === 'unmount') cleanup(); else f.emit(event);
    f.frame(); f.frame(); f.frame();
    assert.equal(f.calls.length, 0, event);
    assert.equal(f.listenerCount(), 0, event);
    assert.equal(f.frames.size, 0, event);
  }
  const f = fixture();
  await start(f); f.browserWindow.location.hash = '#pricing';
  f.frame(); assert.equal(f.calls.length, 0);
});

test('late fonts and unstable layout cannot schedule a delayed scroll after the deadline or cleanup', async () => {
  const f = fixture();
  await start(f); f.frame(2100);
  assert.equal(f.calls.length, 0);
  assert.equal(f.listenerCount(), 0);
  const late = fixture();
  let ready;
  late.browserDocument.fonts.ready = new Promise((resolve) => { ready = resolve; });
  const cleanup = restoreInitialAnchor(late.browserWindow, late.browserDocument);
  cleanup(); ready(); await Promise.resolve(); late.frame();
  assert.equal(late.calls.length, 0);
  assert.equal(late.frames.size, 0);
  const stalled = fixture();
  stalled.browserDocument.fonts.ready = new Promise(() => {});
  restoreInitialAnchor(stalled.browserWindow, stalled.browserDocument);
  stalled.frame(2100);
  assert.equal(stalled.listenerCount(), 0, 'unresolved fonts must not retain listeners past the deadline');
  assert.equal(stalled.calls.length, 0);
});
