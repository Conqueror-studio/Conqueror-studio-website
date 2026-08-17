import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conqueror Studio — Digital Atelier',
  description: 'Timeless digital experiences and intelligent systems for modern brands.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang='en'><body>{children}</body></html>;
}
