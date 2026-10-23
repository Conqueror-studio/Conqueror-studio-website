import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ESLint } from 'eslint';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const fromConfig = createRequire(require.resolve('eslint-config-next/core-web-vitals'));
const fromPlugin = createRequire(fromConfig.resolve('@next/eslint-plugin-next/package.json'));
const guard = fromPlugin('fast-glob');
const { getRootDirs } = fromPlugin('./dist/utils/get-root-dirs.js');
const policyId = 'conqueror-security/default-next-root-only';
const fixture = JSON.parse(await readFile(new URL('./fixtures/sec01-lint-contract.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('SEC-01 installed leaf is the private guard and default roots retain cwd', () => {
  assert.deepEqual(manifest.overrides, { next: { postcss: '8.5.23' }, '@next/eslint-plugin-next@16.3.1': { 'fast-glob': 'file:./tooling/next-root-guard' } });
  const pkg = fromPlugin('fast-glob/package.json');
  assert.equal(pkg.name, '@conqueror/next-root-guard');
  assert.equal(pkg.version, '0.1.0');
  assert.equal(pkg.private, true);
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.scripts, undefined);
  assert.equal(fromPlugin('@next/eslint-plugin-next/package.json').version, '16.3.1');
  assert.equal(fromPlugin.resolve('fast-glob'), path.join(root, 'tooling', 'next-root-guard', 'index.cjs'));
  assert.deepEqual(getRootDirs({ cwd: root, settings: {} }), [root]);
  for (const fn of [guard.globSync, guard.sync]) assert.throws(() => fn('src/*'), { code: 'CONQUEROR_GLOB_UNSUPPORTED' });
});
test('SEC-01 actual lint rejects custom roots instead of skipping Next rules', { timeout: 60000 }, async () => {
  for (const rootDir of ['src/*', ['src/*'], [], '', null, 1]) {
    const lint = new ESLint({ cwd: root, overrideConfig: { settings: { next: { rootDir } } } });
    await assert.rejects(lint.lintText('export default function Fixture(){return <div />}', { filePath: 'src/app/sec01-fixture.tsx' }), /CONQUEROR_(GLOB_UNSUPPORTED|NEXT_ROOT_POLICY)/);
  }
});
test('all actual files keep every original rule and metadata plus the root policy', { timeout: 60000 }, async (t) => {
  const lint = new ESLint({ cwd: root });
  const results = await lint.lintFiles(['.']);
  const files = new Map(results.map(r => [path.relative(root, r.filePath).split(path.sep).join('/'), r]));
  for (const original of fixture.contract.files) {
    assert.ok(files.has(original.path), 'Retain original file ' + original.path);
    const config = await lint.calculateConfigForFile(files.get(original.path).filePath);
    const expected = fixture.contract.profiles.find(p => p.id === original.profile);
    for (const [rule, value] of Object.entries(expected.rules)) assert.deepEqual(config.rules[rule], value, original.path + ': ' + rule);
    assert.deepEqual(Object.keys(config.rules).filter(r => !Object.hasOwn(expected.rules, r)), [policyId]);
    assert.equal(Object.keys(config.rules).filter(r => r.startsWith('@next/') && config.rules[r][0] !== 0).length, 22);
  }
  for (const result of results) {
    const config = await lint.calculateConfigForFile(result.filePath);
    assert.equal(config.rules[policyId]?.[0], 2, result.filePath);
    assert.equal(Object.hasOwn(config.settings?.next ?? {}, 'rootDir'), false);
    assert.equal(result.errorCount, 0, result.filePath + ': errors');
    assert.equal(result.warningCount, 0, result.filePath + ': warnings');
  }
  for (const original of fixture.metadata.files) {
    const config = (await lint.calculateConfigForFile(original.file)).toJSON();
    const { globals, ...languageOptions } = config.languageOptions;
    assert.deepEqual(languageOptions, original.languageOptions);
    assert.equal(createHash('sha256').update(JSON.stringify(globals)).digest('hex'), original.globalsHash);
    assert.deepEqual(config.settings, original.settings);
    assert.deepEqual(config.linterOptions, original.linterOptions);
    assert.deepEqual(config.plugins.filter(p => !p.startsWith('conqueror-security')), original.plugins);
  }
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  for (const [name, value] of Object.entries(lock.packages)) {
    assert.ok(!/node_modules\/(braces|micromatch)$/.test(name), 'No vulnerable parser chain ' + name);
    if (/node_modules\/fast-glob$/.test(name)) {
      assert.equal(value.link, true);
      assert.equal(value.resolved, 'tooling/next-root-guard');
    }
  }
  t.diagnostic(results.length + ' files linted; all 31 original files/rules retained; no warnings/errors');
});
test('CI keeps time limits and both raw audit gates', async () => {
  const workflow = await readFile(new URL('../.github/workflows/quality.yml', import.meta.url), 'utf8');
  const lines = workflow.split(/\r?\n/);
  const q = lines.indexOf('  quality:'), s = lines.indexOf('  security:');
  assert.ok(q >= 0 && s > q);
  assert.match(lines.slice(q, s).join('\n'), /^    timeout-minutes: 15$/m);
  assert.match(lines.slice(s).join('\n'), /^    timeout-minutes: 5$/m);
  assert.ok(workflow.includes('npm audit --omit=dev --audit-level=high'));
  assert.ok(workflow.includes('npm audit --audit-level=high'));
  assert.doesNotMatch(workflow, /continue-on-error|npm audit fix/);
});
