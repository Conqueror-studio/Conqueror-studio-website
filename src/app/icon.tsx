/* eslint @next/next/no-img-element: off -- ImageResponse requires native img markup; metadata-route detection differs across OS paths. */
import { ImageResponse } from 'next/og';
import { brandImageDataUrl } from '../lib/brand-image.mjs';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const mark = await brandImageDataUrl('mark');
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111111', borderRadius: 6 }}>
      {/* ImageResponse renders native image elements, not the browser's Next/Image component. */}
      <img src={mark} alt="Conqueror Studio" width={28} height={28 * 272 / 276} />
    </div>,
    size,
  );
}
