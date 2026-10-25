import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { brandImageDataUrl } from '../lib/brand-image.mjs';

export const runtime = 'nodejs';
export const alt = 'Conqueror Studio — Website, Workflow, Integrasi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [logo, inter, poppins] = await Promise.all([
    brandImageDataUrl('wordmark'),
    readFile(join(process.cwd(), 'public/fonts/inter-regular.ttf')),
    readFile(join(process.cwd(), 'public/fonts/poppins-medium.ttf')),
  ]);
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 64, background: '#111111', color: '#F5F5F0', fontFamily: 'Inter', borderBottom: '12px solid #3D5AFE' }}>
      {/* ImageResponse needs a native img; the approved artwork and fonts are embedded locally. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="Conqueror Studio" width={330} height={330 * 288 / 970} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Poppins', fontSize: 78, fontWeight: 500, lineHeight: 1.1, letterSpacing: -3 }}>
          <span>Website, Workflow,</span><span>Integrasi.</span>
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.85 }}>Kami bangun, kami hubungkan, kamu fokus grow.</div>
      </div>
      <div style={{ fontSize: 22, opacity: 0.7 }}>Sukabumi · Serving clients nationwide</div>
    </div>,
    { ...size, fonts: [
      { name: 'Inter', data: inter, weight: 400, style: 'normal' },
      { name: 'Poppins', data: poppins, weight: 500, style: 'normal' },
    ] },
  );
}
