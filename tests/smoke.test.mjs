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

test('manifest pins exact OS dependency versions', async () => {
  const manifest = await read('studio-manifest.yml');
  for (const dependency of ['csos', 'cds', 'starter', 'assets']) {
    assert.match(manifest, new RegExp(dependency + ": '1\\.1\\.0'"));
  }
});
