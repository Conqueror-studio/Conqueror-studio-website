# Figma Website Foundation Implementation Plan

## Execution update — closer Figma rebuild, 2026-10-16

The user subsequently requested a rebuild using the original Figma design as the
base. The initial checklist below is historical; its text-only logos and generic
concept-work presentation are superseded by the original Figma assets and named
project selector. Implemented work, verification evidence and remaining portfolio
artwork/font limitations are recorded in [the rebuild handoff](../../design/figma-rebuild.md).
The result is a local review preview, not a fully signed-off or published MVP.

> **For agentic workers:** REQUIRED SUB-SKILL: Use inline execution with review checkpoints for this local-only implementation.

**Goal:** Adapt the Conqueror Studio marketing website to the approved Figma visual direction while keeping the first-client conversion path clear and avoiding billing or non-essential product features.

**Architecture:** Keep the existing single-page Next.js App Router structure and local content model. Recompose the page into Figma-aligned sections—hero, stack strip, positioning, work, services, process, contact, and footer—using existing local assets and semantic anchors. Keep WhatsApp and email as the primary contact actions.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS modules-by-convention through `src/app/globals.css`, `next/image`, Node test runner.

**Spec:** Figma file `IWIWpN6P7Vhgn5etOCZwW6`, Conqueror, page `Page 2`, hero node `13:10`; business direction from CEO message in the task history.

## Global Constraints

- Work only in the local clone on branch `agent/upgrade-v1.1`.
- Do not push, open a PR, or publish until the latest MVP is complete and the user explicitly requests it.
- Do not implement subscription billing in this website pass.
- Use Conqueror-specific copy; do not carry over Figma template residue such as “Rise at Seven” or SEO/AEO editorial claims.
- Preserve local assets and avoid fabricated client outcomes or testimonials.
- Keep the page responsive, keyboard accessible, and usable at mobile width.

---

### Task 1: Reconcile content model with the Figma marketing scope

**Files:**
- Modify: `src/lib/content.ts`
- Test: `tests/smoke.test.mjs`

**Interfaces:**
- Produces the service, project, process, and update data consumed by `src/app/page.tsx`.

- [ ] Replace generic service labels with the Figma-aligned commercial services: `Website Design & Development`, `Workflow Automation`, and `Tool Integration`.
- [ ] Keep project entries as concept work and retain local asset paths.
- [ ] Keep updates as studio notes only; do not add SEO/AEO claims.
- [ ] Extend smoke assertions to require the three service labels and reject template residue.

### Task 2: Recompose the homepage around the Figma layout

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes content exports from `src/lib/content.ts`.
- Produces the stable anchors `hero`, `work`, `services`, `process`, and `contact` used by navigation and tests.

- [ ] Build a Figma-aligned header with Conqueror logo, About, Work, Services, Process, and Contact links plus a `Get in touch` action.
- [ ] Build the hero with the Renaissance artwork, `We Create Digital Masterpieces` copy, Sukabumi positioning, service subtitle, and conversion CTA.
- [ ] Add a compact stack strip using text labels rather than unsupported external logos.
- [ ] Add the positioning section with `Building Systems That Work` and the existing no-claims studio statement.
- [ ] Render selected work and services using local data and clear CTA links.
- [ ] Retain a concise process section and contact block with WhatsApp and email actions.
- [ ] Build a dark footer with local logo, core links, social/contact links, and copyright.
- [ ] Remove non-essential journal, industry, and newsletter presentation from the first pass unless needed to preserve existing tested anchors.

### Task 3: Match the Figma visual system and responsive behavior

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Styles the semantic sections and utility classes emitted by `src/app/page.tsx`.

- [ ] Set the Figma-inspired light canvas, black ink, rounded containers, thin rules, large sans display typography, and restrained mint/accent treatment.
- [ ] Make the hero a dark rounded visual panel with blurred/local artwork, centered headline, service line, and supporting microcopy.
- [ ] Style work cards, service rows, process columns, contact panel, and footer to match the observed Figma hierarchy.
- [ ] Preserve reduced-motion handling, focus-visible states, and no-horizontal-overflow behavior.
- [ ] Add mobile layouts for header, hero, cards, service rows, process, contact actions, and footer.

### Task 4: Verify the commercial website MVP

**Files:**
- Test: `tests/smoke.test.mjs`
- Inspect: `src/app/page.tsx`, `src/app/globals.css`, `src/lib/content.ts`

- [ ] Run `npm run test` and confirm all smoke tests pass.
- [ ] Run `npm run lint` and confirm exit code 0.
- [ ] Run `npm run build` and confirm the production build succeeds.
- [ ] Run `git diff --check` and confirm no whitespace errors.
- [ ] Start the local preview and inspect desktop and mobile viewport behavior, CTA links, image loading, and browser console output.
- [ ] Confirm no GitHub push or PR was performed.

## Self-review

- The plan covers the approved website visual foundation and the CEO's commercial focus.
- Billing, authentication, payments, and client subscription state are explicitly out of scope for this pass.
- Figma template residue is handled as content cleanup rather than copied into production.
- Verification includes tests, lint, build, diff hygiene, and browser QA.
