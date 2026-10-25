'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import StudioNavigation from './studio-navigation';

// CEO-supplied artwork; videos use local posters for motion/data-saving fallback.
const heroMedia = [
  { type: 'image', src: '/hero/clouds.jpg', poster: '/hero/clouds.jpg' },
  { type: 'image', src: '/hero/starry-sky.jpg', poster: '/hero/starry-sky.jpg' },
  { type: 'video', src: '/hero/motion-01.mp4', poster: '/hero/motion-01-poster.jpg' },
  { type: 'image', src: '/hero/elephant.jpg', poster: '/hero/elephant.jpg' },
  { type: 'image', src: '/hero/portal.jpg', poster: '/hero/portal.jpg' },
  { type: 'video', src: '/hero/motion-02.mp4', poster: '/hero/motion-02-poster.jpg' },
];
const platforms = [
  { name: 'Google', asset: 'google.png', width: 67, height: 30 },
  { name: 'TikTok', asset: 'tiktok.png', width: 67, height: 30 },
  { name: 'Instagram', asset: 'instagram.png', width: 95, height: 31 },
  { name: 'ChatGPT', asset: 'chatgpt.png', width: 67, height: 30 },
  { name: 'Gemini', asset: 'gemini.png', width: 67, height: 30 },
];

export default function HeroExperience({ contactUrl }: { contactUrl: string }) {
  const [selected, setSelected] = useState(0);
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const hero = useRef<HTMLElement>(null);
  const currentMedia = heroMedia[selected];
  const [intro, setIntro] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [percent, setPercent] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const displayed = useRef(0);
  const ready = useRef(new Set<string>());
  const started = useRef(false);
  const markReady = useCallback((part: string) => {
    if (!started.current) return;
    ready.current.add(part);
    setPercent(Math.round(ready.current.size / 2 * 100));
  }, []);

  useEffect(() => {
    let alive = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let choice = Math.floor(Math.random() * heroMedia.length);
    try {
      const previous = sessionStorage.getItem('conqueror-hero-preview');
      const previousIndex = previous === null ? -1 : Number(previous);
      if (Number.isInteger(previousIndex) && previousIndex >= 0 && previousIndex < heroMedia.length) choice = (previousIndex + 1) % heroMedia.length;
      sessionStorage.setItem('conqueror-hero-preview', String(choice));
    } catch { /* Storage may be blocked; a random variant still works. */ }
    const frame = requestAnimationFrame(() => {
      started.current = true;
      ready.current.clear();
      setSelected(choice);
      setAllowVideo(!media.matches && !connection?.saveData);
      setIntro(!media.matches);
      setPercent(0);
      // If the initial image was already cached, load events may precede the effect.
      const probe = new window.Image();
      probe.onload = probe.onerror = () => { if (alive) markReady('image'); };
      probe.src = heroMedia[choice].poster;
      document.fonts.ready.then(() => { if (alive) markReady('fonts'); });
    });
    // Never lock the page or wait indefinitely for an asset/font/network failure.
    const safety = window.setTimeout(() => setIntro(false), 3000);
    const reduce = () => {
      setAllowVideo(!media.matches && !connection?.saveData);
      if (media.matches) setIntro(false);
    };
    media.addEventListener('change', reduce);
    return () => { alive = false; cancelAnimationFrame(frame); clearTimeout(safety); media.removeEventListener('change', reduce); };
  }, [markReady]);

  useEffect(() => {
    const element = video.current;
    if (!element || !allowVideo || videoFailed) return;
    let alive = true;
    let inView = true;
    const update = () => {
      if (document.hidden || !inView) {
        element.pause();
      } else {
        element.play().catch((error: unknown) => {
          if (!alive || (error instanceof DOMException && error.name === 'AbortError')) return;
          setVideoVisible(false);
          setVideoFailed(true);
        });
      }
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (hero.current) observer.observe(hero.current);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      alive = false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.pause();
    };
  }, [selected, allowVideo, videoFailed]);

  useEffect(() => {
    if (percent < 100 || !intro) return;
    const exit = window.setTimeout(() => setLeaving(true), 650);
    const finish = window.setTimeout(() => setIntro(false), 1200);
    return () => { clearTimeout(exit); clearTimeout(finish); };
  }, [percent, intro]);

  useEffect(() => {
    if (!intro) return;
    const from = displayed.current;
    const start = performance.now();
    let frame = 0;
    const draw = (time: number) => {
      const fraction = Math.min(1, (time - start) / 450);
      displayed.current = Math.round(from + (percent - from) * fraction);
      setDisplayPercent(displayed.current);
      if (fraction < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [percent, intro]);

  return (
    <>
      {intro && <div className={'studio-intro' + (leaving ? ' is-leaving' : '')} aria-hidden="true">
        <span className="intro-arrow">↘</span>
        <p className="intro-top">INDEPENDENT CREATIVE STUDIO<br />SUKABUMI, INDONESIA</p>
        <span className="intro-count">{String(displayPercent).padStart(3, '0')}<small>%</small></span>
        <p className="intro-bottom">IMAGINATION, MEET EXECUTION.<br />CONQUEROR STUDIO®</p>
        <span className="intro-email">conqueror.agency404@gmail.com</span>
      </div>}
      <StudioNavigation contactUrl={contactUrl} />
      <section ref={hero} id="hero" className="hero-panel" data-hero-variant={selected} aria-labelledby="hero-heading" data-figma-node="13:10">
          <div className="hero-visual" aria-hidden="true">
            <Image src={currentMedia.poster} alt="" fill priority sizes="100vw" onLoad={() => markReady('image')} onError={() => markReady('image')} />
            {currentMedia.type === 'video' && allowVideo && !videoFailed && <video ref={video} className={videoVisible ? 'is-playing' : ''} src={currentMedia.src} poster={currentMedia.poster} autoPlay muted loop playsInline preload="metadata" tabIndex={-1} onPlaying={() => setVideoVisible(true)} onError={() => { setVideoFailed(true); setVideoVisible(false); }} />}
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Image src="/figma/laurel-left.svg" alt="" width={25} height={34} />
              <p>Creative agency<br />Based in Sukabumi, Indonesia</p>
              <Image src="/figma/laurel-right.svg" alt="" width={25} height={34} />
            </div>
            <h1 id="hero-heading">
              <span className="hero-first-line">We Create</span>
              <span className="hero-second-line"><span>Digital</span><span className="hero-cameo"><Image src={currentMedia.poster} alt="" fill sizes="120px" priority /></span><span>Masterpieces</span></span>
            </h1>
            <p className="hero-subtitle">Website, Workflow, Integrasi</p>
            <ul className="platform-logos" aria-label="Platforms and tools">
              {platforms.map((platform) => <li key={platform.name}><Image src={'/figma/' + platform.asset} alt={platform.name} width={platform.width} height={platform.height} /></li>)}
            </ul>
          </div>
          <div className="hero-bottom">
            <p>Website Design &amp; Development, Workflow Automation, Tool Integration.<br /><span lang="id">Kami bangun, kami hubungkan, kamu fokus grow.</span></p>
            <p>Based in Sukabumi<br />Serving clients nationwide</p>
          </div>
        </section>
    </>
  );
}
