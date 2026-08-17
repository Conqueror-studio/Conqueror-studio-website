import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Conqueror Studio — Digital Atelier', template: '%s — Conqueror Studio' },
  description: 'Timeless digital experiences and intelligent systems for modern brands.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Conqueror Studio — Digital Atelier',
    description: 'Timeless digital experiences and intelligent systems for modern brands.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
