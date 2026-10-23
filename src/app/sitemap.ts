import type { MetadataRoute } from 'next';
import { getSiteConfig } from '../lib/site-config.mjs';
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  return site.indexable ? [{ url: site.url, lastModified: new Date() }] : [];
}
