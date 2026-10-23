import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import nextConfig from '../next.config.mjs';
import { getSiteConfig } from '../src/lib/site-config.mjs';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('explicit release origin is HTTPS and Vercel demo/local are never indexable by default', () => {
  assert.deepEqual(getSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://studio.example/' }), { url: 'https://studio.example', indexable: true });
  assert.deepEqual(getSiteConfig({ VERCEL: '1', VERCEL_URL: 'conqueror-demo.vercel.app' }), { url: 'https://conqueror-demo.vercel.app', indexable: false });
  assert.deepEqual(getSiteConfig({}), { url: 'http://localhost:3000', indexable: false });
  assert.deepEqual(getSiteConfig({ NEXT_PUBLIC_SITE_URL: '', VERCEL_URL: 'conqueror-demo.vercel.app' }), { url: 'https://conqueror-demo.vercel.app', indexable: false });
});

test('invalid release or hosted URL configuration fails closed instead of publishing localhost', () => {
  for (const url of ['http://studio.example', 'javascript:alert(1)', 'https://user:password@studio.example', 'https://studio.example/path', 'https://studio.example?x=1', 'https://studio.example#faq', 'https://localhost', 'https://127.0.0.1', 'https://[::1]', 'https://10.0.0.1', 'https://192.168.1.1', 'https://172.16.0.1']) {
    assert.throws(() => getSiteConfig({ NEXT_PUBLIC_SITE_URL: url }), /NEXT_PUBLIC_SITE_URL/, url);
  }
  assert.throws(() => getSiteConfig({ VERCEL: '1' }), /VERCEL_URL/);
  assert.throws(() => getSiteConfig({ VERCEL_URL: 'https://wrong.vercel.app/path' }), /VERCEL_URL/);
});

test('production headers harden framing, MIME, referrers and unused capabilities without development CSP breakage', async () => {
  for (const phase of [PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD]) {
    const config = nextConfig(phase);
    assert.equal(config.poweredByHeader, false);
    const rules = await config.headers();
    assert.equal(rules[0].source, '/:path*');
    const headers = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.match(headers['Permissions-Policy'], /camera=\(\)/);
    if (phase === PHASE_PRODUCTION_BUILD) {
      for (const directive of ["object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "media-src 'self'"]) assert.ok(headers['Content-Security-Policy'].includes(directive));
      assert.ok(!headers['Content-Security-Policy'].includes('unsafe-eval'));
    } else assert.equal(headers['Content-Security-Policy'], undefined);
  }
});

test('inactive enhanced portfolio panels are inert; initial anchor coordinator is mounted without visible UI', async () => {
  const [work, layout, anchor] = await Promise.all([read('src/components/featured-work.tsx'), read('src/app/layout.tsx'), read('src/components/initial-anchor.tsx')]);
  assert.match(work, /inert=\{enabled && active !== index\}/);
  assert.match(layout, /<InitialAnchor/);
  assert.match(anchor, /restoreInitialAnchor\(window, document\)/);
  assert.match(anchor, /return null/);
});

test('CI explicitly runs lockfile quality and security gates without exceptions or deployment', async () => {
  const [workflow, manifest, ignore] = await Promise.all([read('.github/workflows/quality.yml'), read('package.json'), read('.gitignore')]);
  for (const command of ['npm ci', 'npm test', 'npm run lint', 'npm run typecheck', 'npm run build', 'npm audit --omit=dev --audit-level=high', 'npm audit --audit-level=high']) assert.ok(workflow.includes(command), command);
  assert.doesNotMatch(workflow, /continue-on-error|npm audit fix|vercel deploy|npm install/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /agent\/\*\*/);
  assert.equal(JSON.parse(manifest).scripts.typecheck, 'tsc --noEmit --incremental false');
  assert.match(ignore, /\.env\*\r?\n!\.env\.example/);
});
