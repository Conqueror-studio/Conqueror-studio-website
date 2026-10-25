import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = { wordmark: 'conqueror-studio.svg', mark: 'conqueror-mark.svg' };

/** Embed approved vector artwork; metadata image rendering never fetches remote assets. */
export async function brandImageDataUrl(kind = 'wordmark') {
  if (!Object.hasOwn(files, kind)) throw new RangeError('Unknown brand image');
  const svg = await readFile(join(process.cwd(), 'public', 'brand', files[kind]), 'utf8');
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}
