# Conqueror Next root guard

Private zero-dependency tooling owned by Conqueror engineering, approved by the CTO on 23 October 2026. Only the default Next root is supported. Not a fast-glob implementation or an upstream braces patch.

All globSync/sync calls throw; an active ESLint rule rejects explicit/inherited custom roots and malformed settings. Never return empty results or fall back to a parser. Keep all original Next/React/Hooks/TypeScript/a11y rules. Upgrade or removal requires CTO review and contract/behavior/clean-install/audit evidence. No runtime website or billing code belongs here.

The exact-parent override uses file:./tooling/next-root-guard from the repository root. Commit the generated canonical lockfile with node_modules/fast-glob linked to tooling/next-root-guard; do not replace this with a parent-relative or absolute path. Verify npm ci, ordinary npm install, npm ls, actual plugin resolution, contract tests and both raw audits after any lockfile change. An audit result alone is not an installation integrity check.
