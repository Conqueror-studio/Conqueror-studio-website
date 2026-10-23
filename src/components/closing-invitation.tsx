'use client';

import { useScrollStage } from './use-scroll-stage';

const title = "Ready to conqueror what's next ?";

export default function ClosingInvitation() {
  const { ref, enabled, progress } = useScrollStage();
  return <section ref={ref} className={'closing-invitation' + (enabled ? ' motion-enabled' : '')} aria-labelledby="closing-heading">
    <div className="closing-stage">
      <p className="small-label">YOUR NEXT CHAPTER STARTS HERE</p>
      <h2 id="closing-heading" aria-label={title}>
        <span className="closing-track" aria-hidden="true" style={enabled ? { transform: `translateX(calc(${-progress * 100}% + ${progress} * var(--closing-width)))` } : undefined}>
          {title.split(' ').map((word, wi) => <span className="closing-word" key={wi}>{[...word].map((char, ci) => <span key={ci} style={enabled ? { transform: `translateY(${Math.sin(progress * Math.PI * 2 + (ci + wi) * 0.48) * 0.13}em) rotate(${Math.sin(progress * Math.PI * 2 + (ci + wi) * 0.4) * 7}deg)` } : undefined}>{char}</span>)}</span>)}
        </span>
      </h2>
      <a className="pill-link closing-contact" href="#contact">Let’s make it happen <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
