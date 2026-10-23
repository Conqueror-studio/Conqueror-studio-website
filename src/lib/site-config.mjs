function publicOrigin(value, key) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${key} must be a public HTTPS origin.`); }
  const host = url.hostname;
  const privateHost = !host.includes('.') || host.endsWith('.localhost') || /^(?:0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host) || host.includes(':');
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || privateHost) {
    throw new Error(`${key} must be a public HTTPS origin without credentials, path, query or fragment.`);
  }
  return url.origin;
}

/** Explicit release URL opts into indexing; automatic Vercel/local previews never do. */
export function getSiteConfig(env = process.env) {
  const release = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (release) return { url: publicOrigin(release, 'NEXT_PUBLIC_SITE_URL'), indexable: true };
  const demo = env.VERCEL_URL?.trim();
  if (demo) return { url: publicOrigin(`https://${demo}`, 'VERCEL_URL'), indexable: false };
  if (env.VERCEL === '1') throw new Error('VERCEL_URL is required for a hosted demo without NEXT_PUBLIC_SITE_URL.');
  return { url: 'http://localhost:3000', indexable: false };
}
