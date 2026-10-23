'use client';

import Image from 'next/image';
import { clamp, stageIndex } from '../lib/motion-math.mjs';
import { useScrollStage } from './use-scroll-stage';

const members = [
  { title: 'Logic or Architecture', image: '/team/logic.jpg', tone: 'logic', description: 'We don’t build products just to look good; we build them because we actually understand the root of the problem. We engineer your business foundation from the ground up—from market positioning and web architecture to AI workflows. While other founders drown in messy systems, we make sure your front-end, back-end, and deployment run flawlessly.' },
  { title: 'Reality or Impact', image: '/figma/team-impact.png', tone: 'impact', description: 'Aesthetics without conversion is just noise. We bring your brand into the real world. From shooting authentic footage and capturing stories to building digital systems, we connect creative work with practical business needs.' },
  { title: 'Hybrid or Engine', image: '/team/hybrid.jpg', tone: 'hybrid', description: 'The future doesn’t wait for the slow. We act as your hybrid engine—bridging raw imagination with ruthless technical execution. On one side, we leverage AI to generate high-speed campaign assets and visual explorations. On the other, we get our hands dirty with server management, deployment, and debugging to make sure your digital infrastructure never breaks a sweat.' },
];

export default function TeamStory() {
  const { ref, enabled, progress } = useScrollStage();
  const active = stageIndex(progress, members.length);
  return <section ref={ref} id="team" className={'team-story' + (enabled ? ' motion-enabled' : '')} aria-labelledby="team-heading">
    <div className="team-story-stage">
      <h2 id="team-heading">Legacy In The Making</h2>
      <div className="team-deck">
        {members.map((member, index) => {
          const exit = clamp(progress * 2 - index);
          return <article key={member.title} className={'team-card ' + member.tone} aria-hidden={enabled && active !== index ? true : undefined} style={enabled ? { zIndex: 3 - index, transform: `translateY(${-exit * 140}%) rotate(${[0, 7, -5][index] - exit * 26}deg)`, opacity: 1 - clamp((exit - 0.65) / 0.35) } : undefined}>
            <Image src={member.image} alt={'Conqueror team — ' + member.title} width={192} height={192} sizes="(max-width: 700px) 100px, 150px" />
            <h3>{member.title}</h3><p>{member.description}</p>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
