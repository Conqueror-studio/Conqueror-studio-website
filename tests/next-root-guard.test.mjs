import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import globGuard from '../tooling/next-root-guard/index.cjs';
import policy from '../tooling/next-root-guard/policy.mjs';

const rule = policy.rules['default-next-root-only'];
test('both glob entry points reject benign inputs without processing them', () => {
  for (const fn of [globGuard.globSync, globGuard.sync]) {
    for (const args of [[], ['src'], ['src/*'], [['src/*']], [null]]) {
      assert.throws(() => fn(...args), { code: 'CONQUEROR_GLOB_UNSUPPORTED' });
    }
  }
  assert.ok(Object.isFrozen(globGuard));
});
test('default root policy leaves supported settings untouched', () => {
  for (const settings of [{}, { next: undefined }, { next: null }, { next: {} }]) {
    assert.deepEqual(rule.create({ settings }), {});
  }
});
test('policy rejects every explicit root including empty and undefined values', () => {
  for (const rootDir of ['src', 'src/*', ['src/*'], [], '', undefined, null, 1, false]) {
    assert.throws(() => rule.create({ settings: { next: { rootDir } } }), { code: 'CONQUEROR_NEXT_ROOT_POLICY' });
  }
});
test('policy rejects inherited roots and malformed settings', () => {
  assert.throws(() => rule.create({ settings: { next: Object.create({ rootDir: [] }) } }), { code: 'CONQUEROR_NEXT_ROOT_POLICY' });
  for (const next of ['', [], false, 1, () => {}]) {
    assert.throws(() => rule.create({ settings: { next } }), { code: 'CONQUEROR_NEXT_ROOT_POLICY' });
  }
});
import { ESLint } from 'eslint';
test('original lint families still detect real violations and accept a valid component', { timeout: 60000 }, async () => {
  const lint = new ESLint({ cwd: fileURLToPath(new URL('../', import.meta.url)) });
  const cases = [
    ['@next/next/no-html-link-for-pages', 'export default function Fixture(){return <a href="/">Home</a>}'],
    ['react/jsx-key', 'export default function Fixture(){return [1,2].map(n=><span>{n}</span>)}'],
    ['react-hooks/rules-of-hooks', 'import {useState} from "react";export default function Fixture({flag}){if(flag){useState(0)}return null}'],
    ['@typescript-eslint/no-explicit-any', 'export const value: any = 1;'],
    ['jsx-a11y/alt-text', 'export default function Fixture(){return <img src="/a.jpg" />}'],
  ];
  for (const [id, code] of cases) {
    const [result] = await lint.lintText(code, { filePath: 'src/app/sec01-fixture.tsx' });
    assert.ok(result.messages.some(m => m.ruleId === id), id + ': ' + JSON.stringify(result.messages));
  }
  const [valid] = await lint.lintText('export default function Fixture(){return <div>Ready</div>}', { filePath: 'src/app/sec01-fixture.tsx' });
  assert.equal(valid.errorCount, 0);
  assert.equal(valid.warningCount, 0);
});
test('actual ESLint registers root policy at error severity and rejects empty override', { timeout: 60000 }, async () => {
  const lint = new ESLint({ cwd: fileURLToPath(new URL('../', import.meta.url)) });
  const config = await lint.calculateConfigForFile('src/app/page.tsx');
  assert.equal(config.rules['conqueror-security/default-next-root-only']?.[0], 2);
  const overridden = new ESLint({ overrideConfig: { settings: { next: { rootDir: [] } } } });
  await assert.rejects(overridden.lintText('export default function Page(){return <div />}', { filePath: 'src/app/sec01-fixture.tsx' }), /CONQUEROR_NEXT_ROOT_POLICY/);
});
