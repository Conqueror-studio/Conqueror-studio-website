import assert from 'node:assert/strict';
import test from 'node:test';
import { isPuzzleSolved, shuffleTiles, solvedTiles, swapTiles } from '../src/lib/logo-puzzle.mjs';

test('a shuffled logo contains each original piece exactly once and is not already solved', () => {
  for (let seed = 1; seed <= 50; seed++) {
    let state = seed;
    const tiles = shuffleTiles(() => { state = (state * 1664525 + 1013904223) >>> 0; return state / 2 ** 32; });
    assert.deepEqual([...tiles].sort((a, b) => a - b), solvedTiles());
    assert.equal(isPuzzleSolved(tiles), false);
    // Any swap-based shuffle must be completable with no empty/missing pieces.
    let progress = tiles;
    for (let slot = 0; slot < progress.length; slot++) progress = swapTiles(progress, slot, progress.indexOf(slot));
    assert.equal(isPuzzleSolved(progress), true);
  }
});

test('identity shuffle still produces a playable board', () => {
  assert.equal(isPuzzleSolved(shuffleTiles(() => .999999)), false);
});

test('swapping is immutable, reversible, and rejects invalid slot indices', () => {
  const original = solvedTiles();
  const changed = swapTiles(original, 0, 7);
  assert.deepEqual(original, solvedTiles());
  assert.equal(changed[0], 7);
  assert.equal(changed[7], 0);
  assert.equal(isPuzzleSolved(changed), false);
  assert.deepEqual(swapTiles(changed, 7, 0), original);
  for (const invalid of [-1, 8, .5, NaN]) assert.deepEqual(swapTiles(original, invalid, 0), original);
  assert.equal(isPuzzleSolved([]), false);
});
