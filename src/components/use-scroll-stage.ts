'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp, scrollProgress } from '../lib/motion-math.mjs';

// Progressive enhancement: no fixed heights/pinning until JS and motion support exist.
export function useScrollStage(minWidth = 0) {
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const media = window.matchMedia(`(prefers-reduced-motion: no-preference) and (min-width: ${minWidth}px) and (min-height: 600px)`);
    let frame = 0;
    let followUp = 0;
    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setProgress(media.matches ? scrollProgress(rect.top, rect.height, window.innerHeight) : 0);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const preference = () => {
      cancelAnimationFrame(followUp);
      followUp = requestAnimationFrame(() => { setEnabled(media.matches); schedule(); });
    };
    preference();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', preference);
    const observer = new ResizeObserver(schedule);
    if (ref.current) observer.observe(ref.current);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(followUp);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', preference);
    };
  }, [minWidth]);

  function scrollToProgress(value: number) {
    const element = ref.current;
    if (!element || !enabled) return;
    const rect = element.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top + clamp(value) * Math.max(1, rect.height - window.innerHeight), behavior: 'smooth' });
  }
  return { ref, enabled, progress, scrollToProgress };
}
