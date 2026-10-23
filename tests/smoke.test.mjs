import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import nextConfig from '../next.config.mjs';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const pageSources = async () => (await Promise.all([
  read('src/app/page.tsx'),
  read('src/components/studio-navigation.tsx'),
  read('src/components/featured-work.tsx'),
  read('src/components/hero-experience.tsx'),
  read('src/components/team-story.tsx'),
  read('src/components/studio-story.tsx'),
  read('src/components/closing-invitation.tsx'),
  read('src/components/pricing-section.tsx'),
  read('src/components/faq-section.tsx'),
])).join('\n');

test('homepage retains every navigation destination', async () => {
  const source = await pageSources();
  for (const section of ['hero', 'about', 'work', 'services', 'team', 'process', 'pricing', 'faq', 'contact']) {
    assert.match(source, new RegExp('id="' + section + '"'));
  }
  assert.match(source, /Skip to content/);
  assert.match(source, /aria-label="Primary navigation"/);
  assert.match(source, /aria-label="Mobile navigation"/);
});

test('FAQ scopes the nine exclusions to basic website pricing after Pricing and before the closing', async () => {
  const [page, faq] = await Promise.all([read('src/app/page.tsx'), read('src/components/faq-section.tsx')]);
  assert.ok(page.indexOf('<PricingSection') < page.indexOf('<FaqSection'));
  assert.ok(page.indexOf('<FaqSection') < page.indexOf('<ClosingInvitation'));
  assert.match(faq, /Apa saja yang tidak termasuk harga dasar pembuatan website\?/);
  assert.match(faq, /<details/);
  assert.match(faq, /<summary/);
  for (const item of [
    'Penulisan seluruh konten dan penyediaan foto profesional',
    'Revisi tanpa batas',
    'E-commerce, checkout, dan payment gateway',
    'Login pengguna atau dashboard administrasi khusus',
    'Integrasi API atau layanan pihak ketiga',
    'WhatsApp automation dan workflow AI',
    'SEO lanjutan atau jaminan peringkat pencarian',
    'Update konten rutin tanpa kuota dan biaya terpisah',
    'SLA, dukungan 24/7, serta jaminan hasil bisnis',
  ]) assert.ok(faq.includes(item), item);
  assert.doesNotMatch(faq, /Daftar pemeriksaan|centang item|type="checkbox"/);
});

test('FAQ adds the five approved general questions without replacing the existing scope answer', async () => {
  const source = await read('src/components/faq-section.tsx');
  assert.equal([...source.matchAll(/question: '/g)].length, 5);
  assert.equal([...source.matchAll(/answer: '/g)].length, 5);
  for (const question of [
    'Apa saja layanan Conqueror Studio?',
    'Berapa biaya pembuatan website? Apakah harus berlangganan?',
    'Berapa lama proses pengerjaannya?',
    'Bisa menghubungkan website dengan tools yang sudah saya gunakan?',
    'Bagaimana cara memulai dan apa yang perlu saya siapkan?',
  ]) assert.ok(source.includes(question), question);
  assert.match(source, /Landing page mulai dari Rp1\.999\.000 dan website company profile mulai dari Rp3\.499\.000/);
  assert.match(source, /biaya pembuatan sekali bayar/);
  assert.match(source, /scope dan penawaran terpisah dari harga dasar website/);
  assert.match(source, /generalFaqs\.map/);
  assert.match(source, /className=\{styles\.list\}/);
  assert.match(source, /exclusions\.map/);
});

test('commercial contact actions and the three services remain available', async () => {
  const [source, content] = await Promise.all([pageSources(), read('src/lib/content.ts')]);
  assert.match(source, /https:\/\/wa\.me\/6285177835232\?text=/);
  assert.doesNotMatch(source, /6281295919621/);
  assert.match(source, /mailto:conqueror\.agency404@gmail\.com/);
  assert.match(source, /Start on WhatsApp/);
  for (const service of ['Website Design & Development', 'Workflow Automation', 'Tool Integration']) {
    assert.ok(content.includes(service), service);
  }
  assert.doesNotMatch(source, /trusted by|increased revenue|award-winning|Rise at Seven|Dojo|newsletter/i);
  assert.match(source, /Featured Work/);
  assert.match(source, /View live website/);
});

test('Figma artwork and fonts are durable, non-empty local assets', async () => {
  const source = await pageSources();
  assert.doesNotMatch(source, /figma\.com\/api\/mcp\/asset|unsplash\.com/);
  const assets = [
    'angel.png', 'automating.png', 'chatgpt.png', 'conqueror-logo.svg',
    'designing.png', 'gemini.png', 'google.png', 'hero-art.png',
    'instagram.png', 'laurel-left.svg', 'laurel-right.svg', 'motion.svg',
    'nextjs.svg', 'shadcn.svg', 'tailwind.svg', 'team-impact.png',
    'thinker.png', 'tiktok.png', 'typescript.svg', 'vercel.svg',
  ];
  for (const asset of assets) {
    const file = await stat(new URL('public/figma/' + asset, root));
    assert.ok(file.size > 0, asset);
  }
  const layout = await read('src/app/layout.tsx');
  assert.match(layout, /next\/font\/local/);
  for (const match of layout.matchAll(/src: '([^']+)'/g)) {
    const file = await stat(new URL(match[1], new URL('src/app/layout.tsx', root)));
    assert.ok(file.size > 0, match[1]);
  }
});

test('interactive controls expose keyboard and reduced-motion support', async () => {
  const [nav, work, styles] = await Promise.all([
    read('src/components/studio-navigation.tsx'),
    read('src/components/featured-work.tsx'),
    read('src/app/globals.css'),
  ]);
  assert.match(nav, /aria-expanded=\{open\}/);
  assert.match(nav, /hidden=\{!open\}/);
  assert.match(nav, /Escape/);
  assert.match(work, /role=\{enabled \? 'tablist' : undefined\}/);
  assert.match(work, /role=\{enabled \? 'tabpanel' : undefined\}/);
  for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) assert.ok(work.includes(key));
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /:focus-visible/);
});

test('production builds cannot overwrite the running preview cache', () => {
  const development = nextConfig(PHASE_DEVELOPMENT_SERVER);
  const production = nextConfig(PHASE_PRODUCTION_BUILD);
  assert.equal(development.distDir, '.next-dev');
  assert.equal(production.distDir, '.next');
  assert.notEqual(development.distDir, production.distDir);
});

test('manifest pins exact OS dependency versions', async () => {
  const manifest = await read('studio-manifest.yml');
  for (const dependency of ['csos', 'cds', 'starter', 'assets']) {
    assert.ok(manifest.includes(dependency + ": '1.1.0'"));
  }
});
