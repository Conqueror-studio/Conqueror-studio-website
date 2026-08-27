---
name: conqueror-studio-website
description: Use when implementing, redesigning, reviewing, or validating the Conqueror Studio Website Next.js project; preserve its luxury editorial visual language, CMS-ready fixture content, content-truth rules, accessibility, and required quality gates.
---

# Conqueror Studio Website

Deliver deliberate, editorial website changes without inventing marketing proof or eroding the project's Renaissance-meets-modern-technology direction.

## Establish context

Read these before editing:

- `.ai/agent-context.md` for non-negotiable implementation guardrails.
- `studio-manifest.yml` for the CSOS/CDS/starter/assets dependency contract.
- `docs/prd.md` and `docs/pds.md` for acceptance criteria and visual specifications.

Use the existing local fixtures and components. Do not introduce a CMS provider, production domain, fonts, logo export, or artwork licensing decision without human approval.

## Design and content contract

- Preserve the ivory `#F6F3EE`, ink `#111111`, and editorial-blue `#2046F2` palette.
- Use an elegant Cormorant Garamond-style display face with an Inter-style body face.
- Keep the experience calm: editorial whitespace, Renaissance composition, subtle hover lift, and reduced-motion support.
- Build semantic page structure, visible keyboard focus, meaningful artwork alt text, and `aria-hidden` decorative marks.
- Verify desktop 1440px, tablet 1024px, and mobile 390px layouts; keep mobile content single-column and links touch-friendly.
- Preserve the required homepage sequence: navigation, hero, manifesto, selected work, craft, updates, journal, contact CTA, footer.

## Content truth

- Never fabricate testimonials, client logos, metrics, awards, outcomes, or social proof.
- Label any speculative work as `Concept` or `Concept archive`.
- Treat hero artwork as a placeholder until an approved licensed or commissioned asset is supplied.
- Keep content fixture-driven and CMS-ready; make no unapproved public claim.

## Delivery

Keep changes focused, maintain Next.js and TypeScript conventions, and include evidence for review. Before handing off, run:

```powershell
npm run test
npm run lint
npm run build
```

If a command cannot run, report the exact blocker and do not claim the change is ready.
