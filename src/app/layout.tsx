import type { Metadata } from 'next';
import localFont from 'next/font/local';
import InitialAnchor from '../components/initial-anchor';
import { getSiteConfig } from '../lib/site-config.mjs';
import './globals.css';
import './motion.css';

const studio = localFont({ src: '../../public/fonts/42dot-sans-latin-medium.woff2', variable: '--font-studio', display: 'swap', weight: '500' });
const poppins = localFont({ src: '../../public/fonts/poppins-medium.ttf', variable: '--font-poppins', display: 'swap', weight: '500', preload: false });
const inter = localFont({ src: '../../public/fonts/inter-regular.ttf', variable: '--font-inter', display: 'swap', weight: '400', preload: false });
const site = getSiteConfig();

export const metadata: Metadata = {
  title: { default: 'Conqueror Studio — Digital Atelier', template: '%s — Conqueror Studio' },
  description: 'Timeless digital experiences and intelligent systems for modern brands.',
  metadataBase: new URL(site.url),
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: {
    title: 'Conqueror Studio — Digital Atelier',
    description: 'Timeless digital experiences and intelligent systems for modern brands.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={studio.variable + ' ' + poppins.variable + ' ' + inter.variable}><body>{children}<InitialAnchor /></body></html>;
}
