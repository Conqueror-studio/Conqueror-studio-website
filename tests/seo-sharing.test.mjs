import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { getSiteConfig } from '../src/lib/site-config.mjs';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('hero eyebrow removes the stray markdown hash without changing the approved headline', async () => {
  const source = await read('src/components/hero-experience.tsx');
  assert.doesNotMatch(source, /# Creative agency/);
  assert.match(source, /<p>Creative agency<br/);
  assert.match(source, /We Create/);
  assert.match(source, /Masterpieces/);
});

test('a production demo uses its public production domain for sharing but remains noindex', () => {
  assert.deepEqual(getSiteConfig({
    VERCEL: '1', VERCEL_ENV: 'production',
    VERCEL_URL: 'protected-build.vercel.app',
    VERCEL_PROJECT_PRODUCTION_URL: 'public-demo.vercel.app',
  }), { url: 'https://public-demo.vercel.app', indexable: false });
});

test('a preview cannot opt into indexing through a leaked Production release variable', () => {
  assert.deepEqual(getSiteConfig({
    VERCEL: '1', VERCEL_ENV: 'preview',
    NEXT_PUBLIC_SITE_URL: 'https://studio.example',
    VERCEL_URL: 'branch-preview.vercel.app',
    VERCEL_PROJECT_PRODUCTION_URL: 'public-demo.vercel.app',
  }), { url: 'https://branch-preview.vercel.app', indexable: false });
});

test('development stays noindex while an explicitly approved production release remains indexable', () => {
  assert.deepEqual(getSiteConfig({ VERCEL_ENV: 'development', NEXT_PUBLIC_SITE_URL: 'https://studio.example' }), { url: 'http://localhost:3000', indexable: false });
  assert.deepEqual(getSiteConfig({ VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://studio.example', VERCEL_PROJECT_PRODUCTION_URL: 'public-demo.vercel.app' }), { url: 'https://studio.example', indexable: true });
});

test('production sharing origins fail closed instead of silently falling back to a protected build', () => {
  assert.throws(() => getSiteConfig({ VERCEL: '1', VERCEL_ENV: 'production', VERCEL_URL: 'protected-build.vercel.app' }), /VERCEL_PROJECT_PRODUCTION_URL/);
  for (const domain of ['localhost', '127.0.0.1', 'user:password@site.example', 'site.example/path', 'https://site.example']) {
    assert.throws(() => getSiteConfig({ VERCEL: '1', VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: domain, VERCEL_URL: 'protected-build.vercel.app' }), /VERCEL_PROJECT_PRODUCTION_URL/);
  }
});

test('favicon artwork preserves the three exact approved emblem contours and transparent flower', async () => {
  const [logo, mark] = await Promise.all([read('public/brand/conqueror-studio.svg'), read('public/brand/conqueror-mark.svg')]);
  assert.match(mark, /viewBox="689 11 276 272"/);
  assert.doesNotMatch(mark, /<(?:text|image|script|foreignObject)\b|href=/);
  const originalPath = logo.match(/\bd="([^"]+)"/s)[1];
  const markPath = mark.match(/\bd="([^"]+)"/s)[1];
  const contours = markPath.trim().split(/\s*(?=M )/).filter(Boolean);
  assert.equal(contours.length, 3);
  for (const contour of contours) assert.ok(originalPath.includes(contour), 'No emblem contour redrawn');
  const image = await sharp(Buffer.from(mark)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(image.info.width, 276);
  assert.equal(image.info.height, 272);
  const alpha = (x, y) => image.data[(y * image.info.width + x) * 4 + 3];
  assert.equal(alpha(800 - 689, 80 - 11), 0, 'Approved flower cutout is transparent');
  assert.equal(alpha(950 - 689, 100 - 11), 255, 'Approved white badge remains opaque');
});

test('metadata images embed approved local SVG data without external image/font requests', async () => {
  const { brandImageDataUrl } = await import('../src/lib/brand-image.mjs');
  for (const [kind, filename] of [['wordmark', 'conqueror-studio.svg'], ['mark', 'conqueror-mark.svg']]) {
    const uri = await brandImageDataUrl(kind);
    assert.ok(uri.startsWith('data:image/svg+xml;base64,'));
    assert.equal(Buffer.from(uri.split(',')[1], 'base64').toString('utf8'), await read('public/brand/' + filename));
  }
  await assert.rejects(brandImageDataUrl('../outside'), /Unknown brand image/);
});

test('OG and favicon routes use ImageResponse, actual branding and explicit image dimensions', async () => {
  const [og, icon, layout] = await Promise.all([read('src/app/opengraph-image.tsx'), read('src/app/icon.tsx'), read('src/app/layout.tsx')]);
  for (const source of [og, icon]) {
    assert.match(source, /ImageResponse/);
    assert.match(source, /contentType = 'image\/png'/);
    assert.match(source, /brandImageDataUrl/);
    assert.doesNotMatch(source, />C<|https?:\/\//);
  }
  assert.match(og, /width: 1200, height: 630/);
  assert.match(og, /Website, Workflow, Integrasi/);
  assert.match(icon, /width: 32, height: 32/);
  assert.match(icon, /brandImageDataUrl\('mark'\)/);
  assert.match(layout, /summary_large_image/);
});
