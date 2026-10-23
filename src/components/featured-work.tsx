'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { useScrollStage } from './use-scroll-stage';
import { stageIndex } from '../lib/motion-math.mjs';

const projects = [
  { name: 'Historia Moments', category: 'Photography', tone: 'historia', url: 'https://historiamoment.vercel.app/', image: '/portfolio/historia-hero.jpeg', brand: 'Historia Moment', eyebrow: 'HISTORIA MOMENT PHOTOGRAPHY', title: 'Setiap Momen,', emphasis: 'Sebuah Cerita' },
  { name: 'IcaCilla Makeup', category: 'Makeup', tone: 'icacilla', url: 'https://icacilla-makeup-website.vercel.app/', image: '/portfolio/icacilla-hero.webp', brand: 'ICACILLA MAKEUP', eyebrow: 'MAKEUP ARTIST / WEDDING ORGANIZER', title: 'Hari besarmu,', emphasis: 'dirawat dengan sepenuh hati.' },
  { name: 'Basmara Crew', category: 'Wedding', tone: 'basmara', url: 'https://basmara-wedding.vercel.app/', image: '/portfolio/basmara-hero-01.jpg', brand: 'Basmara Wedding Crew', eyebrow: '', title: 'Make your wedding dream', emphasis: 'come true with us!' },
];

// Local hero assets come from the three linked project websites.
export default function FeaturedWork() {
  const [manualActive, setManualActive] = useState(0);
  const { ref, enabled, progress, scrollToProgress } = useScrollStage();
  const active = enabled ? stageIndex(progress, projects.length) : manualActive;
  function setActive(index: number) {
    setManualActive(index);
    if (enabled) {
      scrollToProgress(index / (projects.length - 1));
    } else {
      document.getElementById('project-panel-' + index)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!enabled || !keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + projects.length) % projects.length;
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section ref={ref} id="work" className={'work-section' + (enabled ? ' motion-enabled' : '')} aria-labelledby="work-heading">
      <div className="work-stage">
        <div className="work-index">
          <h2 id="work-heading" className="small-label">Featured Work</h2>
          <div className="work-tabs" role={enabled ? 'tablist' : undefined} aria-label={enabled ? 'Featured projects' : undefined} aria-orientation={enabled ? 'vertical' : undefined}>
            {projects.map((item, index) => (
              <button key={item.name} ref={(element) => { tabs.current[index] = element; }} type="button" role={enabled ? 'tab' : undefined} id={'project-tab-' + index} aria-selected={enabled ? active === index : undefined} aria-controls={'project-panel-' + index} tabIndex={enabled ? (active === index ? 0 : -1) : 0} onClick={() => setActive(index)} onKeyDown={(event) => handleKey(event, index)}>
                {item.name}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <p className="work-caption">Selected project directions. <br />Made with Conqueror.</p>
        </div>
        <div className="work-display">
          <div className="work-viewport"><div className="work-rail" style={enabled ? { transform: `translateY(${-progress * 200}%)` } : undefined}>
          {projects.map((project, index) => <article key={project.name} id={'project-panel-' + index} role={enabled ? 'tabpanel' : undefined} aria-labelledby={'project-tab-' + index} aria-hidden={enabled && active !== index ? true : undefined} inert={enabled && active !== index} tabIndex={enabled && active === index ? 0 : -1} className={'work-card work-card--' + project.tone}>
            <a className="work-card-preview" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={'Visit ' + project.name + ' website (opens in a new tab)'}>
              {project.tone !== 'basmara' && <Image className="work-card-preview-image" src={project.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />}
              <span className="work-card-preview-brand">{project.brand}</span>
              <div className="work-card-preview-copy">
                {project.eyebrow && <span className="work-card-preview-eyebrow">{project.eyebrow}</span>}
                <h3>{project.title}<br /><em>{project.emphasis}</em></h3>
                <span className="work-card-preview-cta">View live website <span aria-hidden="true">↗</span></span>
              </div>
              {project.tone === 'basmara' && <div className="work-card-preview-gallery" aria-hidden="true"><span><Image src={project.image} alt="" fill sizes="(max-width: 700px) 45vw, 25vw" /></span><span><Image src="/portfolio/basmara-hero-02.webp" alt="" fill sizes="(max-width: 700px) 45vw, 25vw" /></span></div>}
              <span className="work-card-preview-category">{project.category} <span aria-hidden="true">↗</span></span>
            </a>
          </article>)}
          </div></div>
        </div>
      </div>
      <div className="work-bottom"><a className="pill-link" href="#contact">Discuss your project <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}
