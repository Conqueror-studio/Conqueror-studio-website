import type { MetadataRoute } from 'next';
import { getSiteConfig } from '../lib/site-config.mjs';
export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  return site.indexable
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: site.url + '/sitemap.xml' }
    : { rules: { userAgent: '*', disallow: '/' } };
}
