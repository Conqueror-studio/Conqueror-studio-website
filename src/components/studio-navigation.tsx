'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const links = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Team', '#team'],
  ['Services', '#services'],
  ['Pricing', '#pricing'],
  ['Contact', '#contact'],
] as const;

function backgroundIsDark(element: Element): boolean | null {
  const background = getComputedStyle(element).backgroundColor.match(/^rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)(?:[, /]+([\d.]+))?\)/);
  if (!background || Number(background[4] ?? 1) <= 0.85) return null;
  const [red, green, blue] = background.slice(1, 4).map(Number);
  return (red * 0.2126 + green * 0.7152 + blue * 0.0722) < 130;
}

function isDarkAt(x: number, y: number) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest('.site-header, .header-backdrop, .mobile-nav')) continue;
    const card = element.closest('.team-card, .work-card');
    if (card) return backgroundIsDark(card) ?? false;
    if (element.closest('.hero-panel, .work-stage, .closing-invitation, .site-footer, .studio-story-art')) return true;
    const dark = backgroundIsDark(element);
    if (dark !== null) return dark;
  }
  return false;
}

export default function StudioNavigation({ contactUrl }: { contactUrl: string }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const currentHeader = header.current;
      if (!currentHeader) return;
      const headerRect = currentHeader.getBoundingClientRect();
      const shouldHide = [...document.querySelectorAll<HTMLElement>('.closing-invitation, .site-footer')].some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < headerRect.bottom && rect.bottom > headerRect.top;
      });
      if (hiddenRef.current !== shouldHide) {
        hiddenRef.current = shouldHide;
        setHidden(shouldHide);
        if (shouldHide) setOpen(false);
      }
      if (shouldHide) return;
      currentHeader.querySelectorAll<HTMLElement>('.header-brand, .desktop-nav a, .header-contact, .menu-toggle').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const tone = isDarkAt(rect.left + rect.width / 2, rect.top + rect.height / 2) ? 'light' : 'dark';
        if (element.dataset.tone !== tone) element.dataset.tone = tone;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <>
    <div className="header-backdrop" data-hidden={hidden} aria-hidden="true" />
    <header ref={header} className="site-header" data-hidden={hidden} aria-hidden={hidden} inert={hidden} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <a className="header-brand" href="#hero" aria-label="Conqueror Studio home" onClick={() => setOpen(false)}>
        <Image src="/brand/conqueror-studio.svg" alt="Conqueror Studio" width={970} height={288} priority />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>{label}{label === 'Work' && <span aria-hidden="true"> +</span>}</a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="pill-link header-contact" href={contactUrl} target="_blank" rel="noreferrer">Get in touch <span aria-hidden="true">↗</span></a>
        <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
      </div>
    </header>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open} onKeyDown={(event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    }}>
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
    </nav>
  </>;
}
