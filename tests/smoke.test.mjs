import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('homepage contains the required editorial sections', async () => {
  const page = await read('src/app/page.tsx');
  for (const section of ['hero', 'manifesto', 'work', 'craft', 'updates', 'journal', 'industries', 'process', 'contact']) {
    assert.match(page, new RegExp('id="' + section + '"'));
  }
});

test('content does not make fabricated client claims', async () => {
  const [page, content] = await Promise.all([read('src/app/page.tsx'), read('src/lib/content.ts')]);
  assert.doesNotMatch(page + content, /trusted by|increased revenue|award-winning|client logos/i);
  assert.match(content, /Concept/);
});

test('brand and project artwork use local assets', async () => {
  const [page, content, styles] = await Promise.all([
    read('src/app/page.tsx'),
    read('src/lib/content.ts'),
    read('src/app/globals.css'),
  ]);
  assert.match(page, /\/brand\/conqueror-logo\.svg/);
  assert.match(page, /\/hero-art\.jpg/);
  assert.doesNotMatch(page, /Placeholder study/);
  assert.doesNotMatch(page, /hero-visual-label/);
  assert.match(page, /Placeholder Renaissance-inspired/);
  assert.match(page, /ID \/ EN/);
  assert.match(page, /hero-index/);
  assert.match(styles, /\.hero-visual img \{[^}]*object-fit: cover/);
  assert.match(styles, /\.hero-shell \{[^}]*min-height: 100svh/);
  assert.match(styles, /\.hero-visual \{[^}]*position: absolute/);
  assert.doesNotMatch(styles, /\.hero-visual \{[^}]*position: relative/);
  assert.match(content, /\/assets\/projects\//);
  await read('public/hero-art.jpg');
  for (const asset of [
    'public/brand/conqueror-studio-logo.png',
    'public/assets/projects/kopi-senja.svg',
    'public/assets/projects/eternal-moments.svg',
    'public/assets/projects/aruna-studio.svg',
    'public/assets/projects/blue-hour-table.svg',
  ]) {
    await read(asset);
  }
});

test('manifest pins exact OS dependency versions', async () => {
  const manifest = await read('studio-manifest.yml');
  for (const dependency of ['csos', 'cds', 'starter', 'assets']) {
    assert.match(manifest, new RegExp(dependency + ": '1\\.1\\.0'"));
  }
});
