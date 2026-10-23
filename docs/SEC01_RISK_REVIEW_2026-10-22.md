# SEC-01 Risk Treatment Review — Conqueror Studio

> Follow-up, 22 October 2026: the user approved the bounded guard-test/CI-time-limit design below. It has now been implemented and verified locally; see [SEC-01 mitigation handoff](SEC01_MITIGATION_HANDOFF_2026-10-22.md). The remainder of this review is preserved as the historical pre-implementation record. Approval of these controls is NOT acceptance of the remaining high finding or permission to publish. SEC-01 remains OPEN.

## Current finding and scope

22 October 2026, Asia/Jakarta. Status **IN PROGRESS — technical mitigation proposed, not implemented or accepted**. User requested risk handling and asked what they can do. Read-only dependency/source/configuration investigation was performed; application source, lint configuration, workflow and dependencies were not changed. No staging/commit/push/deployment/hosting/database/Notion/CEO action.

Repository: `D:\File Syahdan\Area 666 Conqueror Studio\Web Conqueror\website-repo`; branch `agent/upgrade-v1.1`; HEAD `46554a03dbda44e507db76db0e310420e15fc8d6` unchanged, dirty working tree, empty index at inspection. Issue ID NOT VERIFIED; all evidence LOCAL ONLY.

Fresh audit results: production **0 findings / exit 0**; full audit **5 high / 0 critical / exit 1**. These are five affected package entries in one chain, not five independently established visitor-facing flaws:

`eslint-config-next@16.3.1 → @next/eslint-plugin-next@16.3.1 → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`.

The current lockfile marks each of these five entries `dev: true`; `npm ls` confirmed the chain. Evidence: [production audit](audit/2026-10-22-risk-review/npm-audit-production.json), [full audit](audit/2026-10-22-risk-review/npm-audit-all.json).

## Upstream recheck

The [official GitHub advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) still lists no patched version. Registry queries returned braces latest 3.0.3, eslint-config-next/latest Next ESLint plugin 16.4.2; that plugin still requires fast-glob 3.3.1. Latest fast-glob 3.3.3 still depends on micromatch ^4.0.8. A routine update therefore has not been established as remediation. No forced major downgrade, arbitrary override, fork or removal of lint rules was attempted.

## New bounded exposure evidence

Installed source `node_modules/@next/eslint-plugin-next/dist/utils/get-root-dirs.js` shows:

- With no `context.settings.next.rootDir`, the helper returns `context.cwd` as the default root without invoking fast-glob.
- A string or array `rootDir` setting calls the helper's fast-glob pattern expansion path.
- `dist/rules/no-html-link-for-pages.js` calls this root helper; the rule remains enabled at error severity in the observed effective configurations.

ESLint `calculateConfigForFile` on `src/app/page.tsx`, `src/components/featured-work.tsx`, and `tests/release-hardening.test.mjs` returned `nextSettings: null` and `@next/next/no-html-link-for-pages: [2]`.

**Interpretation:** in these three inspected effective configurations, that particular optional rootDir glob branch is not enabled. This is source/configuration evidence, not dynamic instrumentation of every lint file, not proof that every possible tooling path is unreachable, and not a patched package. Production audit zero is not proof of application security. No malicious recursion/DoS payload was run.

Graph context is still the two-node parent-folder index at generation 2026-10-04T09:06:45Z; graph search returned zero relevant symbols and coverage paths were not tracked. Exact installed-source/config/lockfile reads were used, not graph completeness claims.

## Proposed bounded technical design — requires approval

1. Add a toolchain regression test that checks the effective lint configuration across the actual linted files and detects unexpected use of the optional glob-expansion entry point. Keep all existing Next/React/TypeScript lint rules enabled. Use only benign patterns; do not execute a denial-of-service payload.
2. Add explicit CI job time limits to bound runaway work (proposed quality 15 minutes, security 5 minutes). Retain read-only permissions, non-persisted checkout credentials, production audit and full audit. Time limits limit resource consumption; they do not patch stack exhaustion.
3. Keep full audit FAIL and SEC-01 OPEN until an upstream fix/reviewed alternative or a separately approved, narrowly scoped owner risk decision exists. No continue-on-error, blanket allowlist or automatic acceptance.
4. After approval, test the guard red-before-green and rerun test/lint/typecheck/build/audits. CI configuration remains local/unverified remotely until a separately authorized push.

This changes only toolchain guard tests/workflow limits plus evidence; no UI redesign, billing feature, major toolchain migration or deployment. It is a compensating control proposal, not a promise to make npm audit green.

## Owner actions

- Approve or reject this specific technical mitigation design. General permission to handle risks is not recorded as acceptance of an unresolved high finding or approval to publish.
- Before any sharing/release decision, define the intended demo audience and have the authorized owner/CTO decide any residual-risk acceptance explicitly. If an exception is later proposed, require exact advisory/package/version scope, owner, expiry/review date and revocation conditions; do not suppress raw findings.
- Complete business acceptance separately: confirm WhatsApp/email receipt and review content, prices and asset rights. These cannot be established by a lint PASS.

There is no need for the user to edit code, provide passwords/API keys, disable lint or authorize billing expansion. No public demo or push is authorized by this review.

## CONQUEROR ENGINEERING CHECKPOINT

- Timestamp (Asia/Jakarta): 2026-10-22, risk-treatment review after browser QA.
- Project: Website Conqueror Studio.
- Milestone / Task: SEC-01 toolchain risk treatment design.
- Multica Issue ID: NOT VERIFIED.
- Repository / Branch / Commit / Working Tree: identity above; unchanged HEAD, dirty local checkout, empty index.
- Current Status: IN PROGRESS; scoped implementation awaits approval of the proposed design.
- Completed Work: upstream recheck, fresh production/full audits, dev-only lockfile identity, installed helper/rule inspection and three effective-config checks.
- Technical Evidence: this review, audit JSON, package/lockfile/config/workflow and exact installed helper/rule paths above.
- Verification Results: production audit PASS (0); full audit FAIL (5 high); config probes succeeded. Test/lint/build NOT RUN in this review because implementation/configuration was not changed; preceding browser-QA results remain historical evidence in BROWSER_QA_HANDOFF_2026-10-22.md.
- Blockers & Risks: upstream unpatched; specific design approval pending; optional rootDir exposure must not be generalized to all possible paths; no residual-risk acceptance/deployment verification.
- Decisions & Approvals: user authorized risk handling; technical design proposed; no risk waiver, Git/hosting mutation or CEO message authorized.
- Sprint Task Mapping: CEO security/release-evidence gate remains IN PROGRESS; exact Notion tasks/Multica issue NOT VERIFIED; no checklist updates.
- Exact Next Action: user reviews the bounded guard-test/CI-time-limit design before implementation; this review is not permission to share/publish a demo.
- Checkpoint Updated: local review/evidence saved. Official project_checkpoint_save FAILED HTTP 429 (MCP SSE probe); no successful readback, issue attachment or verified updates to 06_SESSION_HANDOFF.md / 07_CHECKPOINT_LOG.md. Evidence remains LOCAL ONLY.
- Ready for Notion Verification: NO — evidence local, external issue/task mapping unavailable, treatment not implemented/approved.

The brainstorming workflow requires approval of this specific mitigation design before changing configuration or adding the guard. That pause does not prevent the read-only evidence checks above and is not a declaration that remediation is complete.
