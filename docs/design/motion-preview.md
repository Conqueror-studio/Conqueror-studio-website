# Motion preview — 17 October 2026

Local continuation of the Figma website, not a replacement design or billing change.
Do not publish, push, or present this as CEO-approved imagery.

## Implemented

- Two supplied hero images alternate across reloads in the same browser session. Background and cameo share one selection. Blocked storage falls back to a random choice; SSR/no-JS starts with sculpture.
- Black / warm-white entrance with dotted percentage type and upward exit. Percentage represents image/font readiness, not network byte progress. A 3-second safety timeout releases the overlay; it never locks scroll or focus. Reduced-motion users bypass it.
- Tools loop with duplicated presentation-only track, pause checkbox, hover/focus pause and reduced-motion static layout.
- We are Conqueror: original angel grows from the central inset into a wide image on scroll.
- Featured Work: desktop pinned index and vertically moving cards; click, ArrowUp/ArrowDown, Home/End and Next remain available. Mobile/tablet use manual cards. No fabricated portfolio imagery or case-study results.
- Logic / Reality / Hybrid stack with supplied photographs; scroll-linked exit/rotation. Numbered step buttons removed following the user's screenshot revision. Original Reality copy retained. Missing Logic and Hybrid copy taken from supplemental handoff, with accidental duplicate leading Hybrid removed.
- Exact user title: “Ready to conqueror what's next ?”, scroll-linked horizontal letter movement, then working contact CTA before existing footer.
- Transparent flower logo remains unchanged.

## Asset provenance

| Local asset | User source | Status |
| --- | --- | --- |
| public/temporary/hero-sculpture.jpg | download (22).jpg | Temporary, awaiting CEO decision |
| public/temporary/hero-human-machine.jpg | A evolução não existe para apagar o passado, mas para continuar a história que ele começou_.jpg | Temporary, awaiting CEO decision |
| public/team/logic.jpg | WhatsApp Image 2026-09-10 at 00.07.07.jpeg | User mapped to Logic |
| public/team/hybrid.jpg | WhatsApp Image 2026-10-17 at 00.03.14.jpeg | User mapped to Hybrid |

Original download files and existing Figma assets were not overwritten. Confirm publication rights for final imagery before launch.

## Verification

- Thirteen Node tests passed, including transparent-logo rendering, asset presence, scroll math, wiring and existing commercial links.
- ESLint completed with no warnings; the final Next production build completed successfully (homepage first-load JS 113 kB). Diff whitespace check passed.
- Desktop browser confirmed reload variants 1 then 0 and matching background/cameo sources.
- Desktop confirmed forward/reverse team scroll, all three cards, work scroll selection and keyboard focus/selection synchronization.
- Tools pause reports paused; mobile menu opens/closes after navigation; closing CTA navigates to contact.
- Tested widths 320, 390, 768, 1280: no horizontal document overflow in sampled views; no broken completed images. Long team copy fits the card at the tested small sizes.
- Height 550 disables pinned stages and exposes all team cards in normal flow.
- Browser warning/error log empty during checks.
- Reduced-motion behavior verified in CSS/hook code; browser preference emulation unavailable in this session. No claim of pixel-identical replication of reference sites.

## Remaining review / launch gates

CEO-approved hero selection, actual project images and any real case-study destinations, image publication rights, user review of motion timing. No billing changes, commits, push or deployment in this task.
