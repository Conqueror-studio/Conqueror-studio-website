# SEC-01 implementation evidence — 23 October 2026

Final current gates are in final/ and verification-summary.json. All evidence is LOCAL ONLY until an official checkpoint/readback succeeds. No commit, push or deployment was performed.

- source-before.json and before/ preserve the actual dirty working state before this task, not HEAD.
- source-after-check.json compares 83 files: 79 unchanged; only the four approved existing toolchain/config/test files changed. Six approved new implementation/fixture files and documentation were added.
- full-audit.json and production-audit.json are raw parsed JSON from the final commands; both exit0, total0. No advisory suppression or audit fix was used.
- final/guard-pilot-root-relative-ci-sequential.txt is the authoritative plain cold-install result. Followed sequentially by npm ls, ordinary npm install, npm ls/hash and41 passing tests.
- The portable canonical lock SHA256 is c571b4082fa18155fd93cab01ed106a135248a3bccd34ed9a21d8a02f95389d1.
- preview-desktop.png shows the unchanged local hero. HTTP200, contact hrefs and FAQ presence were checked. This is not mobile QA, message-delivery proof or Vercel deployment evidence.

## Failures and diagnostics retained, not waived

The original TDD module run failed before implementation (missing module); integration failed before policy registration (severity undefined). Both became green with implementation.

Initial npm link/lock writer attempts failed or resolved the wrong package path. An intermediate parent-relative URI installed the intended guard but npm ls correctly reported INVALID because dependency validation resolves override paths from the root. That URI was rejected. The final manifest uses the originally approved file:./tooling/next-root-guard and npm-generated canonical root link. No absolute path, force, legacy-peer-deps, install-links, npmrc, npm/runtime upgrade or modified vendor source is involved.

One exploratory install accidentally overlapped a still-running pilot ci, producing ENOENT/ENOTEMPTY warnings. Neither overlapping run is accepted as clean-install evidence. Both finished, then a separate sequential plain npm ci/install/ls/test cycle passed. Relevant raw output is retained in investigation/; partial captures in initial/ are historical, not final PASS evidence.

The initial full pilot test run failed39/41 due to a missing studio-manifest.yml in the disposable snapshot and a new anonymous-export lint warning. The unchanged manifest was copied; the export was named. A diagnostic test needed optional chaining for the CJS tooling file with no Next settings. Original lint rules were not disabled and snapshots were not rewritten to accept fewer checks.

Negative empty-root tests intentionally print the upstream Next “Pages directory cannot be found” diagnostic before rejection. Actual repository lint exits0 with no warnings/errors. Plain pilot ci warns that unrs-resolver postinstall is not approved under the existing npm script policy; no scripts were approved or machine settings changed. Pilot build warned about an unrelated outer C:/Users/HP/package-lock.json; main build has no such warning. Git diff --check succeeds with existing CRLF-conversion notices for unrelated source/config files.

Node22/Linux/remote CI, new mobile/reduced-motion/full keyboard regression, externally delivered contact messages, deployment and upstream universal-glob compatibility are NOT RUN / NOT VERIFIED. Do not present local audit0 as proof of complete website or billing security.

## Review and rollback

Read the implementation handoff in ../../SEC01_IMPLEMENTATION_HANDOFF_2026-10-23.md. Restore only task-owned hunks from before/ if rollback is authorized; never reset the dirty repository or erase history/evidence. The five original dev findings would be expected to return and must be re-audited. The temporary pilot remains at C:/Users/HP/AppData/Local/Temp/conqueror-sec01-pilot-0d727cecffd54ee19d30b8e58f771707; it is not the durable handoff source.
