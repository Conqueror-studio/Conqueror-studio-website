# SEC-01 Default-Root Guard Implementation Plan

> **For agentic workers:** Use executing-plans inline for this tightly coupled pilot/integration sequence. User forbids commits, push and deployment; those steps are intentionally excluded.

**Goal:** Remove the vulnerable glob chain from the installed lint toolchain while retaining existing checks under the CTO-approved default-root-only contract.
**Architecture:** A zero-dependency local package rejects glob calls. An extra ESLint policy rejects custom/malformed Next roots. All original rule values, versions, source and assets are retained.
**Tech Stack:** Node24.18.0/npm11.16.0 local, ESLint9.39.5/config-next16.3.1; configured CI Node22.
**Spec:** ../specs/2026-10-23-sec01-default-root-guard-design.md

## Execution outcome — 23 October 2026

Local implementation gates PASSED:41/41 tests, lint/typecheck/build, both audits0, scoped npm ls0, sequential plain pilot ci and ordinary install. Canonical lock retained; final URI is the original approved file:./tooling/next-root-guard. Intermediate invalid parent-relative URI was rejected, not waived.79 non-toolchain baseline hashes unchanged. No Git writes/deployment.

The checked items below mean the local work/verification or required attempt was performed, NOT that remote CI/mobile/release or official checkpoint succeeded. Node22/Linux and new mobile/full QA are NOT RUN; Multica interim429 failed; issue mapping/readback NOT VERIFIED. See ../../SEC01_IMPLEMENTATION_HANDOFF_2026-10-23.md and ../../audit/2026-10-23-sec01-implementation/README.md for outcomes, failed attempts, warnings and remaining gates.

## Global Constraints

- Approval: human CTO said “ya kerjakan” after optionA/default-root-only design.
- No src/public/billing/runtime/framework changes, Git writes, hosting/database/Notion/CEO mutation.
- Exact-parent override only: @next/eslint-plugin-next@16.3.1 -> fast-glob file:./tooling/next-root-guard.
- Preserve PostCSS override, pinned package versions, ESLint presets/ignore set, 15/5minute CI limits and raw audit.
- Stop adoption if standard install/ci needs new flags/config, breaks rule coverage, or findings remain. No force/legacy-peer-deps/install-links workaround.
- Pilot is a disposable copy of explicitly whitelisted current files, not a clean Git checkout: existing dirty work must be preserved.
- Snapshot83 existing source/toolchain/workflow/public paths before modifying main; preserve the four existing files changed by this task separately.
- Candidate implementation can be accepted locally only after install/audit/contracts pass; remote CI/deployment remain separately unverified/unauthorized.

## Task1: Isolated installation gate and module/policy contract

**Files:** pilot-only package.json, tooling/next-root-guard/{package.json,index.cjs,policy.mjs,README.md}, tests/next-root-guard.test.mjs.
**Consumes:** approved spec and current dirty repository snapshots.
**Produces:** globSync/sync always throw CONQUEROR_GLOB_UNSUPPORTED; policy.rules["default-next-root-only"].create(context) throws CONQUEROR_NEXT_ROOT_POLICY for unsupported roots.

- [x] Save failing module/policy tests before creating implementation. Run node --test tests/next-root-guard.test.mjs; expected missing-module FAIL.
- [x] Implement package private:true/name:@conqueror/next-root-guard/version:0.1.0/main:index.cjs, no dependencies/scripts.
- [x] Module exports frozen {globSync:reject,sync:reject}; reject creates Error("CONQUEROR_GLOB_UNSUPPORTED: custom Next roots require security review"), code CONQUEROR_GLOB_UNSUPPORTED, then throws. No arguments processed, no side effects/fallback.
- [x] Policy default export has one rule. create checks settings.next; undefined/null means empty. Reject non-object/arrays or Reflect.has(next,"rootDir"); error prefix/code CONQUEROR_NEXT_ROOT_POLICY. Return {} for supported settings.
- [x] Unit assertions: no args/literal/glob/array reject for both module functions; supported settings {}, next:null/{} pass; rootDir string,array,empty-array,empty-string,undefined,null,number and inherited value reject; malformed next string,array,boolean,function reject.
- [x] Copy current whitelisted project tree to pilot without .git/.env secrets/node_modules/build output. Add exact-parent override; run standard npm install --ignore-scripts --no-fund --no-audit, then npm ci --ignore-scripts --no-fund --no-audit. Verify local package resolution/identity and raw full audit. If gate fails, preserve evidence and STOP before main edits.
- [x] Save local checkpoint/evidence. No commit.

## Task2: Preserve lint behavior and integrate only approved files

**Files:** package.json/lock, eslint.config.mjs; tooling package; tests/toolchain-security.test.mjs, tests/next-root-guard.test.mjs, tests/fixtures/sec01-lint-contract.json.
**Consumes:** successful Task1 default-flag install/resolution, baseline docs/audit/2026-10-23-sec01-design/current-lint-contract.json and current-config-metadata.json.
**Produces:** actual lint fail-closed outside contract, same original rule/config values and enabled negative fixtures.

- [x] Capture red integration tests before adding policy registration: new policy severity must be2 and unsupported rootDir[] must reject; original root/config/CI tests retain intended coverage.
- [x] Keep existing imports/presets/ignores and append {plugins:{"conqueror-security":policy},rules:{"conqueror-security/default-next-root-only":"error"}}.
- [x] Adapt prior test-only sentinel to assert actual installed guard identity, direct rejection and helper default cwd. Never return []/skip Next rules.
- [x] Contract test uses all actual linted files, ensures every baseline file still present and each old rule value identical; extra security rule2 allowed. Compare parsers/globals/settings/language/plugin identities with captured metadata; original Next22 remain enabled.
- [x] Actual ESLint fixtures at src/app/sec01-fixture.tsx must detect rule IDs for anchor href=/, missing jsx key, conditional useState, explicit any, img missing alt. Valid div fixture has0errors/warnings. Configure inherited/malformed direct-policy cases separately where ESLint validator rejects them first.
- [x] Integrity test checks exact parent version, package name/version/path and no scripts/dependencies, lockfile absence of original braces/micromatch/fast-glob identities, local policy severity; CI audit/timeouts remain.
- [x] Pilot targeted tests/lint/audit must pass before promoting scoped files to main. Copy only approved implementation files with apply_patch; generate lockfile through npm. Main production dependencies and src/public hashes must match baseline.
- [x] Review exact diff and run all verification. No commit.

## Task3: Full verification and evidence handoff

**Files:** docs/audit/2026-10-23-sec01-implementation/*; docs/SEC01_IMPLEMENTATION_HANDOFF_2026-10-23.md; prior design/history follow-up.
**Consumes:** adopted scoped implementation or failed isolated gate.
**Produces:** evidence-backed outcome, NOT RUN limits, official checkpoint attempt/readback.

- [x] Run npm test, npm run lint, npm run typecheck, npm run build with process-only VERCEL=1/VERCEL_URL=conqueror-quality-check.invalid; capture actual exit codes.
- [x] Run npm audit --omit=dev --audit-level=high --json and npm audit --audit-level=high --json; retain raw output whetherPASS/FAIL.
- [x] Inspect npm ls/resolved package path and lockfile; clean install already required in isolated full-tree pilot. No absolute machine-only lockfile paths.
- [x] Verify src/public/runtime manifests unchanged except scoped override; compare all baseline hashes; git diff --check, HEAD/index unchanged.
- [x] Local preview HTTP/browser smoke if available; no contact message. Remote Node22/Linux CI remains NOT RUN without push; never label Windows as CI.
- [x] Self-review critical boundaries and publish local evidence packet; checkpoint with official Multica save and verify06/07 only if successful. Report HTTP429 failure as LOCALONLY.
- [x] Mark only achieved local gates complete; do not claim releaseGO, deployment, billing completeness or risk waiver.

## Preflight review / rulings

| Interface | Checked result |
|---|---|
| Task1 module -> Task2 Next helper | Only globSync is used by inspected pinned helper; unknown use fails closed. |
| Task1 policy -> Task2 config | One extra rule, no original severity/options changes. |
| Task2 -> Task3 adoption | Default-flag install, contract and audit failures prevent main adoption. |
| Task1/2 shared files | Execute sequentially; pilot remains isolated until gates pass. |
| Task3 source hashes | Compare to dirty before-task snapshot, not HEAD; never reset unrelated work. |

Ruling: execute directly in this session because tasks share the install/config/lock contract and are tightly coupled. Disposable pilot supplies isolation without a Git mutation or losing uncommitted website work. No skill-requested commits or branch finishing actions override user prohibition.

