import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// Static Next hydration and scroll styles need inline allowances; this is baseline
// hardening, not a strict nonce/hash-based XSS policy. Keep dev HMR unrestricted.
const productionCsp = [
  "default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:", "font-src 'self'", "media-src 'self'", "connect-src 'self'",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "frame-src 'none'",
].join('; ');

/** Keep preview output separate so a production build cannot corrupt a running preview. */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      ...(phase === PHASE_DEVELOPMENT_SERVER ? [] : [{ key: 'Content-Security-Policy', value: productionCsp }]),
    ] }];
  },
});
export default nextConfig;
