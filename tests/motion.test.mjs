import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { clamp, scrollProgress, stageIndex } from '../src/lib/motion-math.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
test('scroll stages clamp safely before, within and after the pinned area', () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(scrollProgress(100, 2400, 800), 0);
  assert.equal(scrollProgress(-800, 2400, 800), 0.5);
  assert.equal(scrollProgress(-1600, 2400, 800), 1);
  assert.equal(scrollProgress(-2000, 2400, 800), 1);
  assert.equal(scrollProgress(0, 0, 800), 0);
  assert.deepEqual([0, 0.5, 1].map((p) => stageIndex(p, 3)), [0, 1, 2]);
});
test('CEO hero media, video posters and team references are available locally', async () => {
  for (const path of ['hero/clouds.jpg', 'hero/starry-sky.jpg', 'hero/elephant.jpg', 'hero/portal.jpg', 'hero/motion-01.mp4', 'hero/motion-02.mp4', 'hero/motion-01-poster.jpg', 'hero/motion-02-poster.jpg', 'team/logic.jpg', 'team/hybrid.jpg']) {
    assert.ok((await stat(new URL('public/' + path, root))).size > 0);
  }
});
test('hero selects once per visit and shares its poster between background and cameo', async () => {
  const source = await read('src/components/hero-experience.tsx');
  assert.equal([...source.matchAll(/src=\{currentMedia.poster\}/g)].length, 2);
  assert.match(source, /sessionStorage/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /3000/);
  assert.doesNotMatch(source, /setInterval/);
});

test('hero and studio running text omit manual pause controls while retaining motion safeguards', async () => {
  const [hero, page, css] = await Promise.all([
    read('src/components/hero-experience.tsx'),
    read('src/app/page.tsx'),
    read('src/app/globals.css'),
  ]);
  assert.doesNotMatch(hero, /hero-video-control|videoPaused|Pause hero video/);
  assert.match(hero, /autoPlay muted loop playsInline/);
  assert.match(hero, /document.hidden \|\| !inView/);
  assert.match(hero, /prefers-reduced-motion/);
  assert.match(hero, /connection\?\.saveData/);
  assert.doesNotMatch(page, /marquee-pause|Pause animation|\/figma\/(?:designing|automating)\.png/);
  assert.match(page, /src="\/team\/studio-marquee\.jpg"/);
  assert.match(page, /className="marquee-logo" src="\/brand\/conqueror-studio\.svg"/);
  assert.ok((await stat(new URL('public/team/studio-marquee.jpg', root))).size > 0);
  assert.doesNotMatch(css, /\.studio-marquee:hover|marquee-pause|hero-video-control/);
  assert.match(css, /\.marquee-group \.marquee-logo \{[^}]*object-fit: contain/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
test('scroll enhancements have cleanup, motion preference and manual alternatives', async () => {
  const hook = await read('src/components/use-scroll-stage.ts');
  assert.match(hook, /prefers-reduced-motion/);
  assert.match(hook, /cancelAnimationFrame/);
  assert.match(hook, /removeEventListener/);
  assert.match(await read('src/components/tools-marquee.tsx'), /Pause tools animation/);
  assert.match(await read('src/components/team-story.tsx'), /Logic or Architecture/);
  assert.match(await read('src/components/team-story.tsx'), /Hybrid or Engine/);
  assert.match(await read('src/components/closing-invitation.tsx'), /Ready to conqueror what's next \?/);
});

test('team retains scroll-driven cards without numbered navigation', async () => {
  const source = await read('src/components/team-story.tsx');
  assert.match(source, /useScrollStage/);
  assert.match(source, /progress \* 2/);
  assert.doesNotMatch(source, /team-steps|<button|scrollToProgress/);
});

test('featured work uses mobile scroll motion, clickable names, and no bottom controls', async () => {
  const source = await read('src/components/featured-work.tsx');
  const motion = await read('src/app/motion.css');
  assert.match(source, /useScrollStage\(\)/);
  assert.match(source, /onClick=\{\(\) => setActive\(index\)\}/);
  assert.match(source, /scrollToProgress\(index \/ \(projects\.length - 1\)\)/);
  assert.match(source, /scrollIntoView/);
  assert.doesNotMatch(source, /work-controls|Show next project|\shidden=\{/);
  assert.match(motion, /\.work-section:not\(\.motion-enabled\) \.work-rail \{ display: grid/);
  assert.match(motion, /\.work-section\.motion-enabled \{ height: 290svh; padding-bottom: 4\.5rem; \}/);
  assert.match(motion, /\.motion-enabled \.work-stage \{ grid-template-rows: auto minmax\(0, 1fr\)/);
});

test('featured projects link to their live sites using local hero assets', async () => {
  const source = await read('src/components/featured-work.tsx');
  for (const [name, url, image] of [
    ['Historia Moments', 'https://historiamoment.vercel.app/', 'historia-hero.jpeg'],
    ['IcaCilla Makeup', 'https://icacilla-makeup-website.vercel.app/', 'icacilla-hero.webp'],
    ['Basmara Crew', 'https://basmara-wedding.vercel.app/', 'basmara-hero-01.jpg'],
  ]) {
    assert.ok(source.includes(name));
    assert.ok(source.includes(url));
    assert.ok((await stat(new URL('public/portfolio/' + image, root))).size > 0);
  }
  assert.ok((await stat(new URL('public/portfolio/basmara-hero-02.webp', root))).size > 0);
  assert.match(source, /href=\{project\.url\}/);
  assert.match(source, /target="_blank" rel="noopener noreferrer"/);
});
