import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

test('the development-only Zod lock and installation are patched for GHSA-mrhx-c7xc-m3w5', async () => {
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  const dependency = lock.packages['node_modules/zod'];
  assert.equal(dependency.dev, true, 'Tooling dependency must not become a production dependency');
  const [major, minor, patch] = dependency.version.split('.').map(Number);
  assert.equal(major, 4, 'Keep the existing compatible major version');
  assert.ok(minor > 6 || (minor === 6 && patch >= 6), 'Patched version is >=4.6.6');
  assert.equal(require('zod/package.json').version, dependency.version);
});
