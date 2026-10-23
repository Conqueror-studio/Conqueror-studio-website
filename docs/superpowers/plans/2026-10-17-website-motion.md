# Conqueror motion implementation plan

> Execute locally, in this session, preserving the dirty working tree. No commit, push or deployment.

**Goal:** Implement the previously discussed website motion with the two user-provided temporary hero images.
**Architecture:** Small client components progressively enhance server-rendered content. Native scroll, sticky positioning, requestAnimationFrame and CSS transforms; no animation dependency or scroll hijacking.
**Tech stack:** Existing Next 15 / React 19 / TypeScript / CSS.
**Spec:** User-approved conversation requirements and docs/design/figma-rebuild.md; supplemental handoff supplies missing team copy only.

## Global constraints

- Hero assets are temporary, not CEO-approved or licensed for publication by this task.
- Preserve transparent SVG, contact URLs, existing sections, original assets and billing separation.
- Portfolio imagery remains unavailable: keep Design showcase labels and do not invent case studies/results or dead detail links.
- Reduced motion and no-JavaScript layouts must expose all content; keyboard navigation must remain functional.
- Loader cannot trap scrolling or focus and must disappear on error/timeout; no fake network percentages.

## Tasks

- [x] Tests: add checks for two temporary assets, synchronized hero selectors, loader timeout, scroll math boundaries, motion controls and exact closing title. Run before implementation to demonstrate missing files fail.
- [x] Hero: create hero-experience.tsx with shared selected image state for blurred background and cameo; alternate sessionStorage index on full reload (random first entry, storage errors tolerated). Preserve SSR first image. Use a short black/warm-white intro with readiness percentage from selected image and fonts, a 3s safety release, and immediate reduced-motion bypass.
- [x] Motion foundation: create use-scroll-stage.ts with passive scroll/resize listeners, RAF batching and cleanup; enable sticky behavior only after client initialization, disable under reduced motion. Expose ref, progress, enabled and scrollToProgress(). Extract clamp/progress/stage math into lib/motion-math.mjs with Node tests.
- [x] Tools: create tools-marquee.tsx; two identical visual groups, duplicate hidden from assistive technology, explicit pause checkbox, pause on hover/focus and static wrapping under reduced motion.
- [x] Studio/team/closing: create studio-story.tsx, team-story.tsx, closing-invitation.tsx. Angel image grows from central inset to wide frame on scroll. Three original cards in verified Logic/Reality/Hybrid order, provided photos, scroll-linked stack with accessible step buttons. Closing text follows horizontal/staggered motion and retains a working contact CTA. Small viewports use appropriately sized sticky stages; short screens/reduced motion show static content.
- [x] Featured work: modify featured-work.tsx to scroll through a vertical card rail on desktop, synchronizing existing tabs. Tab click/keyboard/Next also move scroll position; reduced motion and mobile keep existing accessible manual tabs. Preserve temporary showcase content.
- [x] Integration: change page.tsx to compose the components without changing services/about/process/footer. Add motion.css imported after globals.css. Copy only the four explicitly supplied images to public/temporary and public/team with durable descriptive names.
- [x] Verification: npm test, npm run lint, npm run build, git diff --check; browser desktop/mobile screenshots, reload selection, forward/reverse scroll, pause, keyboard, final CTA, no overflow and browser error log. Record limitations and local review links.

## Verification commands

```powershell
node --test tests/motion.test.mjs
npm test
npm run lint
npm run build
git diff --check
```

## Behavioral formulas

```js
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const scrollProgress = (top, height, viewport) => clamp(-top / Math.max(1, height - viewport));
const stageIndex = (progress, count) => Math.round(clamp(progress) * (count - 1));
```

Every scroll component cleans up listeners/RAF on unmount and recomputes when layout changes. Card accessibility follows the active tab rather than announcing all hidden cards. Preview approval and original project images remain launch gates.
