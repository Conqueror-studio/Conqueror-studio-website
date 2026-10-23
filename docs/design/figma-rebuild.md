# Figma rebuild — local preview handoff

Date: 2026-10-16. Branch: agent/upgrade-v1.1.
Reference: https://www.figma.com/design/IWIWpN6P7Vhgn5etOCZwW6/Conqueror?node-id=9-30

## Scope

Rebuild the marketing website from the user's Conqueror Figma, not the billing UI.
Local changes only. No deployment, push, PR, or changes to subscription/payment state.
Keep the direct WhatsApp and email inquiry paths, and defer blog/newsletter/testimonials.

## Implemented mapping

| Reference | Implementation |
| --- | --- |
| Hero 13:10 + header 13:1736 | Blurred original artwork, sharp cameo, exact logo/laurels/platform assets, overlay navigation, mobile menu |
| Tools 21:5024 | Six original tool icons and labels |
| Banner 21:5162 | Original angel asset, rotated through CSS to reproduce its upright Figma appearance |
| About 13:329 | Two-column Poppins layout, thinker asset and working service/process links |
| Work 13:400 | Dark two-column composition and keyboard-accessible project tabs; artwork still pending |
| Services 13:1038 | Large staggered service titles with native disclosure descriptions |
| Statement 13:1259 | Original two square assets, looping type, pause checkbox and reduced-motion CSS |
| Team 13:1368 | One visible mint rotated card and original photo; no invented team members |
| Footer 87:228 | Original SVG viewBox, three link columns and contact actions instead of a nonfunctional newsletter |

Assets: 20 local originals in public/figma. No expiring Figma URL is used at runtime.
Fonts: local 42dot Sans Medium (Latin WOFF2), Poppins Medium and Inter Regular,
with their upstream OFL notices in public/fonts. No new runtime dependency.
The 42dot Latin font is 10,276 bytes rather than the original 2.6 MB all-language file.

## Deliberate adaptations / remaining fidelity work

- Figma Starter MCP quota was exhausted while fetching the work/services detail.
  The extracted screenshots establish their composition, but original portfolio artwork
  is unavailable. Work cards are temporary text-led design showcases, not finished
  case-study images and not evidence of paid-client results.
- Replace the three work cards with the user's exported project artwork before
  declaring the portfolio visually complete or publishing this MVP.
- A Saans font file was not available; 42dot Sans is the local fallback for those
  parts of the Figma. Poppins and Inter are available and used.
- Large empty heights associated with the Figma scroll/animation containers were
  not copied as blank space. Mobile layouts are responsive adaptations.
- The concise process disclosure and direct-contact footer support the CEO's
  sales/delivery scope. No invented performance claims, testimonials or dead
  privacy/terms/newsletter submission links were added.

## Verification evidence

- Six Node smoke tests passed, including local assets, commercial anchors,
  keyboard-control declarations and separate preview/build cache directories.
- ESLint passed with no warnings; Next production build passed.
- Browser checked at requested widths 320, 390, 768, 1024 and 1440.
  The browser reported 1025 for the 1024 override; all reported zero horizontal overflow.
- No broken loaded images or missing local anchor targets; browser warning/error
  log was empty during the check.
- Mobile menu opens, closes on Escape and returns focus to its button, and closes
  after navigation. Project ArrowDown, End and Next controls selected the expected panels.
- Service and four-step process disclosures open; animation pause works and resumes
  after the pointer leaves (hover also pauses). Reduced-motion CSS disables animation.
- WhatsApp/email URLs were inspected. No message was sent and external delivery
  was not tested.
- Preview uses .next-dev; production builds use .next so running them cannot share
  the same generated files. One local preview runs on port 3001.
- Visual coverage is partial, not a claim of pixel-perfect completion.

## Next action

Review the local preview at http://localhost:3001/ and provide the three project
artwork exports (or resume Figma asset access when quota is available). Keep the
work local until the user approves the completed MVP.
