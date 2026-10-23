# Website Release Gate Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the approved local release-gate findings without redesigning the website or expanding billing.

**Architecture:** Keep the existing server-rendered page and progressive scroll enhancements. Add a small, cancellable initial-anchor coordinator, inert inactive portfolio panels, a shared server metadata configuration, and explicit non-deploying CI gates. Preserve the current lint dependency chain until a verified safe upstream remediation exists.

**Tech Stack:** Next.js 15.5.28, React 19.1.2, TypeScript 5.7.2, ESLint 9.39.5, Node test runner; no new dependencies.

**Spec:** `docs/PRE_PUSH_SECURITY_QA_AUDIT_2026-10-22.md`, sections 3, 6 and 7; user approval to proceed on 22 October 2026.

## Global Constraints

- No design, pricing, FAQ copy, hero assets or billing changes.
- No staging, commit, push, deployment, database/hosting changes, Notion checklist changes or CEO messages.
- Existing dirty branch `agent/upgrade-v1.1` is the authorized local implementation workspace. Preserve unrelated changes; do not move them into another worktree.
- User decision: demo on Vercel first; no final production domain yet. Derive demo URL from VERCEL_URL and keep it noindex. Only an explicit validated NEXT_PUBLIC_SITE_URL enables indexing.
- User decision: no additional motion control; record A11Y-01 as unresolved, not WCAG compliant.
- SEC-01 has no published patched braces version as checked today. No forced downgrade, weakened lint configuration, blanket exception or false full-audit PASS.
- Save local evidence and attempt official Multica checkpoint. If unavailable, report LOCAL ONLY and failed synchronization.
- Commit steps in the general execution workflow are intentionally omitted because authorization does not include Git mutations.

## File responsibilities

- `src/lib/initial-anchor.mjs`: bounded one-time layout stabilization, fragment decoding and user-cancellation; no scroll listeners that intercept normal scrolling.
- `src/components/initial-anchor.tsx`: mount/cleanup the coordinator once per document.
- `src/app/layout.tsx`: mount coordinator and use shared metadata settings.
- `src/components/featured-work.tsx`: inert inactive enhanced panels; leave non-enhanced cards accessible.
- `src/lib/site-config.mjs`: validate public origins, distinguish demo/local from an explicitly configured release URL.
- `src/app/robots.ts`, `src/app/sitemap.ts`: consume shared settings, prevent demo indexing.
- `next.config.mjs`: headers and disable framework disclosure, preserve separate build caches.
- `.gitignore`, `.env.example`: protect environment variants and document public URL behavior without secrets.
- `package.json`: explicit typecheck script; `.github/workflows/quality.yml`: reproducible install and independent quality/security checks, no deploy steps.
- `tests/initial-anchor.test.mjs`, `tests/release-hardening.test.mjs`: executable coordinator/config tests and targeted wiring regression assertions.

### Task 1: Initial deep-link and keyboard focus

**Interfaces:** `restoreInitialAnchor(browserWindow, browserDocument): () => void`; client wrapper returns null. Existing FeaturedWork interface unchanged.

- [ ] Add failing tests using a fake RAF queue and target: no fragment, malformed fragment, layout change resets stabilization, one instant scroll after three stable samples, wheel/key/pointer/hash cancellation, cleanup, expired deadline and back-forward history must not scroll.
- [ ] Run `node --test tests/initial-anchor.test.mjs`; confirm failure before implementation.
- [ ] Implement coordinator: decode `location.hash`; reject missing target/back_forward navigation; wait for `document.fonts.ready`; sample body height and absolute target top with RAF; scroll once using `{block:'start', behavior:'instant'}` after three stable samples, stop after two seconds; cancel/remove all handlers on user input, hash change or unmount. Check current hash on every sample.
- [ ] Mount the wrapper in the root body without any visible markup. Add `inert={enabled && active !== index}` to portfolio articles so inactive descendants are not keyboard targets; static/reduced-motion cards remain available.
- [ ] Add/run source-wiring test for inert; run full tests and lint.
- [ ] Runtime on fresh production desktop/mobile: open/reload #faq, #pricing, #contact; verify target position. Use actual Tab/arrow keys to confirm no inactive link receives focus; do not infer this from source assertions.

### Task 2: Response headers and safe site metadata

**Interfaces:** `getSiteConfig(env = process.env): {url: string, indexable: boolean}`. Use the same helper for Metadata, robots and sitemap.

- [ ] Add failing unit tests for explicit HTTPS release origin, Vercel demo URL, local fallback, invalid/scheme/credential/path/query/hash/loopback release URLs and missing VERCEL_URL on hosted builds.
- [ ] Run `node --test tests/release-hardening.test.mjs`; confirm failure.
- [ ] Implement strict origin validation. Explicit release URL must be public HTTPS, without credentials/path/query/fragment. Otherwise VERCEL_URL is an HTTPS demo origin; local fallback is localhost:3000 and noindex. Hosted builds without any valid origin fail instead of silently publishing localhost. Demo metadata uses `robots: {index:false,follow:false}`; robots disallows crawling; sitemap is empty until an explicit release URL exists.
- [ ] Configure headers for all paths: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy disabling unused camera/microphone/geolocation/payment. Set poweredByHeader false.
- [ ] Production-only CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'`. Keep inline allowances for static Next hydration/motion; explicitly document that this is not strict XSS protection. Do not enable HSTS on an unverified domain.
- [ ] Ignore `.env*` except `.env.example`; example URL stays empty with demo/release guidance. Do not edit hosting environment or real local secrets.
- [ ] Test header values programmatically and observe production HTTP/browser responses, loaded assets, video, console, FAQ and puzzle without CSP regressions.

### Task 3: Explicit CI gates and tooling-risk evidence

**Interfaces:** `npm run typecheck` runs `tsc --noEmit --incremental false`; workflow runs on PR and push to main/agent branches, read-only permissions, no credentials/deploy.

- [ ] Test workflow wiring for `npm ci`, test, lint, typecheck, build, production audit and full audit, and no `continue-on-error` security bypass.
- [ ] Preserve lockfile/dependencies. Add explicit typecheck script. Pin checkout/setup-node to reviewed official action SHAs; checkout credentials must not persist. Keep Node 22.
- [ ] Use separate quality and security jobs. Quality runs install/test/lint/typecheck/build; a reserved `.invalid` VERCEL_URL is only a noindex build fixture, not the release URL. Security runs production and full `npm audit --audit-level=high`; make both attempts even when the first fails. The known high tooling finding must make the security job red until remediation/approved policy is separately decided.
- [ ] Re-query braces and latest Next plugin dependencies; retain official advisory and npm audit evidence. If no safe upstream patch exists, mark SEC-01 BLOCKED rather than changing toolchain unsafely.
- [ ] Run all local checks; record actual exit codes, counts, versions and limitations. Remote CI/Linux Node 22/deployment remain NOT RUN.

### Task 4: Handoff and verification

- [ ] Capture test/lint/typecheck/build/audit outputs and production runtime evidence under `docs/audit/2026-10-22-hardening/`; preserve historical evidence.
- [ ] Review the exact turn diff and graph coverage for new evidence paths; read source where the stale graph is insufficient.
- [ ] Update this checklist honestly and write `docs/RELEASE_GATE_HARDENING_HANDOFF_2026-10-22.md` with local vs committed/deployed/runtime separation and CEO DoD mapping.
- [ ] Save official checkpoint, then read back session handoff/checkpoint log if successful. On 429 record failure, LOCAL ONLY and no verified issue ID.
- [ ] Stop temporary loopback QA server, preserve main preview, verify unchanged HEAD/no staged changes, and report remaining release gates.

## Plan review / execution choice

The user approved the bounded audit remediation package; execution continues inline in this session with checkpoints. No new visual design decision is required. Unpatched tooling risk, intentional motion-control omission, release acceptance and remote deployment verification remain open; this plan does not claim to close them.

## Execution checkpoint — 22 October 2026

- [x] Initial-anchor and inert-panel implementation with executable regression tests; failing-before-passing evidence recorded.
- [x] Shared origin configuration, demo noindex and baseline headers implemented; unit/source/HTTP assertions passed locally.
- [x] Explicit CI configuration and typecheck script added without dependency changes; official action tags verified.
- [x] Latest complete suite: 31/31, lint, typecheck and production build PASS; production audit 0; full audit FAIL (5 high).
- [x] Local handoff and raw logs saved; official checkpoint attempted, FAILED 429; no successful cross-session sync claimed.
- [x] Temporary loopback server stopped; development preview 3001 HTTP 200; HEAD unchanged and index empty at inspection.
- [ ] Browser acceptance steps in tasks 1/2/4: NOT RUN. Tool denies local browser access, including after user changed a setting; request screenshot to resolve.
- [ ] SEC-01 upstream remediation or explicit owner-approved treatment: BLOCKED on unpatched tooling/decision, not silently accepted.
- [ ] Hosted Vercel demo/CI/release acceptance: NOT RUN; no push or deployment authorized.

Detailed evidence and exact next action: `docs/RELEASE_GATE_HARDENING_HANDOFF_2026-10-22.md`. The unchecked detailed implementation steps above are the original execution checklist; this checkpoint supplies the verified progress and does not mark runtime acceptance complete.

### Browser follow-up — 22 October 2026, 23:30 Asia/Jakarta

- [x] Browser access is now effective; preview displayed, temporary viewport reset and production QA server stopped.
- [x] Desktop/mobile fragment reload, actual Tab focus isolation, project selection, FAQ/menu and puzzle checks have scoped local production runtime evidence.
- [x] Fresh 31/31 tests, lint, typecheck and build PASS; production audit zero; full audit FAIL with 5 high.
- [ ] Production hero video/reduced-motion/hosted Vercel checks and owner release acceptance remain outstanding; mobile screenshots could not be captured.
- [ ] SEC-01 remains open, no risk waiver, no push/deploy authorized.

See `docs/BROWSER_QA_HANDOFF_2026-10-22.md`; previous browser NOT RUN state above is historical for the cases now verified.
