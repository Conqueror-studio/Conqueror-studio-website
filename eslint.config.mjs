import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import rootPolicy from './tooling/next-root-guard/policy.mjs';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { plugins: { 'conqueror-security': rootPolicy }, rules: { 'conqueror-security/default-next-root-only': 'error' } },
  globalIgnores(['.next/**', '.next-*/**', 'node_modules/**', 'next-env.d.ts']),
]);
