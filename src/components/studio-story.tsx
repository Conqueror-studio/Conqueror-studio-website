'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useScrollStage } from './use-scroll-stage';

export default function StudioStory() {
  const { ref, enabled, progress } = useScrollStage();
  return <section ref={ref} className={'studio-story' + (enabled ? ' motion-enabled' : '')} aria-labelledby="studio-heading" style={{ '--story-progress': progress, '--story-ink': progress > 0.7 ? '#fff' : '#111212' } as CSSProperties}>
    <div className="studio-story-stage">
      <h2 id="studio-heading"><span>We are</span><span>Conqueror</span></h2>
      <div className="studio-story-art"><div className="angel-visual">
        <Image className="angel-image" src="/figma/angel.png" alt="Classical sculpture of a winged angel" fill sizes="100vw" />
      </div></div>
      <p className="studio-story-caption">Independent minds. One shared vision.</p>
    </div>
  </section>;
}
