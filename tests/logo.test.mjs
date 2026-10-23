import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const asset = 'public/brand/conqueror-studio.svg';

test('brand SVG retains its natural ratio and contains no background or external content', async () => {
  const svg = await read(asset);
  assert.match(svg, /viewBox="0 0 970 288"/);
  assert.match(svg, /preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(svg, /<(?:rect|image|script|foreignObject)\b|\bhref=|\\n/);
});

test('rendered logo has transparent letter counters and a flower cutout within the white badge', async () => {
  const { data, info } = await sharp(Buffer.from(await read(asset)))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 970);
  assert.equal(info.height, 288);
  const pixel = (x, y) => [...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4)];
  for (const [x, y] of [[0, 0], [200, 280], [141, 102], [587, 102], [621, 229], [508, 229], [686, 17]]) {
    assert.equal(pixel(x, y)[3], 0, `Transparent background/counter at ${x},${y}`);
  }
  assert.deepEqual(pixel(950, 100), [255, 255, 255, 255]);
  assert.equal(pixel(800, 80)[3], 0, 'Flower reveals the background');
  assert.deepEqual(pixel(825, 149), [255, 255, 255, 255]);
});

test('header and footer use the same proportionate SVG with responsive image sizing', async () => {
  for (const file of ['src/components/studio-navigation.tsx', 'src/components/footer-logo-puzzle.tsx']) {
    assert.match(await read(file), /src="\/brand\/conqueror-studio\.svg"[^>]*width=\{970\} height=\{288\}/);
  }
  const css = await read('src/app/globals.css');
  for (const selector of ['header-brand', 'footer-wordmark']) {
    assert.match(css, new RegExp('\\.' + selector + ' img \\{[^}]*width: 100%;[^}]*height: auto;'));
  }
});
