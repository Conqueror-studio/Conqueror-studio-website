'use client';

import { useEffect } from 'react';
import { restoreInitialAnchor } from '../lib/initial-anchor.mjs';

export default function InitialAnchor() {
  useEffect(() => restoreInitialAnchor(window, document), []);
  return null;
}
