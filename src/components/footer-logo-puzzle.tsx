'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isPuzzleSolved, PUZZLE_COLUMNS, PUZZLE_ROWS, shuffleTiles, solvedTiles, swapTiles } from '../lib/logo-puzzle.mjs';
import styles from './footer-logo-puzzle.module.css';

export default function FooterLogoPuzzle() {
  const root = useRef<HTMLDivElement>(null);
  const shuffleButton = useRef<HTMLButtonElement>(null);
  const started = useRef(false);
  const dragOrigin = useRef<number | null>(null);
  const [tiles, setTiles] = useState(solvedTiles);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const solved = active && isPuzzleSolved(tiles);

  const startGame = useCallback(() => {
    started.current = true;
    dragOrigin.current = null;
    setTiles(shuffleTiles());
    setActive(true);
    setSelected(null);
    setDragging(null);
    setDropTarget(null);
    setMoves(0);
    setAnnouncement('Logo diacak. Pilih dua potongan untuk menukar posisinya.');
  }, []);

  useEffect(() => {
    // Progressive enhancement: keep the intact logo without JS or automatic motion.
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!root.current || media.matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (entry.isIntersecting && !started.current) {
        timer = setTimeout(() => { if (!started.current && !media.matches) startGame(); }, 1100);
      }
    }, { threshold: .35 });
    observer.observe(root.current);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [startGame]);

  function swap(from: number, to: number) {
    setSelected(null);
    if (from === to) return;
    const next = swapTiles(tiles, from, to);
    const nextMoves = moves + 1;
    setTiles(next);
    setMoves(nextMoves);
    setAnnouncement(isPuzzleSolved(next) ? `Logo berhasil disusun dalam ${nextMoves} langkah.` : `Potongan ditukar. ${nextMoves} langkah.`);
  }

  function pick(slot: number) {
    if (selected === null) {
      setSelected(slot);
      setAnnouncement(`Posisi ${slot + 1} dipilih. Pilih potongan kedua, atau tekan Escape untuk membatalkan.`);
    } else {
      swap(selected, slot);
    }
  }

  function restoreLogo() {
    started.current = true;
    dragOrigin.current = null;
    setActive(false);
    setTiles(solvedTiles());
    setSelected(null);
    setDragging(null);
    setDropTarget(null);
    setMoves(0);
    setAnnouncement('Logo utuh ditampilkan.');
    shuffleButton.current?.focus();
  }

  return (
    <div ref={root} className={'footer-wordmark ' + styles.puzzle} lang="id">
      <div className={styles.topline}>
        <h3 id="footer-puzzle-heading">Piece it together.</h3>
        <span aria-hidden="true">{active ? (solved ? 'Tersusun ✓' : `${moves} langkah`) : 'Conqueror Studio'}</span>
      </div>
      {active ? (
        <div className={styles.board} role="group" aria-labelledby="footer-puzzle-heading" aria-describedby="footer-puzzle-help" data-solved={solved}>
          {solved && <Image className={styles.solvedImage} src="/brand/conqueror-studio.svg" alt="" aria-hidden="true" width={970} height={288} />}
          {tiles.map((piece, slot) => (
            <button key={piece} type="button" className={styles.tile} draggable
              aria-label={`Posisi ${slot + 1}, potongan ${piece + 1}`} aria-pressed={selected === slot}
              data-selected={selected === slot} data-dragging={dragging === slot} data-drop-target={dropTarget === slot}
              style={{ transform: `translate(${slot % PUZZLE_COLUMNS * 100}%, ${Math.floor(slot / PUZZLE_COLUMNS) * 100}%)` }}
              onClick={() => pick(slot)}
              onKeyDown={event => { if (event.key === 'Escape') { setSelected(null); setAnnouncement('Pilihan dibatalkan.'); } }}
              onDragStart={event => {
                dragOrigin.current = slot;
                setDragging(slot);
                setSelected(null);
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(slot));
              }}
              onDragOver={event => { if (dragOrigin.current !== null) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setDropTarget(slot); } }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={event => {
                if (dragOrigin.current === null) return;
                event.preventDefault();
                swap(dragOrigin.current, slot);
                dragOrigin.current = null;
                setDragging(null);
                setDropTarget(null);
              }}
              onDragEnd={() => { dragOrigin.current = null; setDragging(null); setDropTarget(null); }}>
              <span className={styles.fragment} aria-hidden="true" style={{ backgroundPosition: `${piece % PUZZLE_COLUMNS / (PUZZLE_COLUMNS - 1) * 100}% ${Math.floor(piece / PUZZLE_COLUMNS) / (PUZZLE_ROWS - 1) * 100}%` }} />
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.intact}><Image src="/brand/conqueror-studio.svg" alt="Conqueror Studio" width={970} height={288} /></div>
      )}
      <div className={styles.bottomline}>
        <p id="footer-puzzle-help">{!active ? 'Mainkan puzzle untuk menyusun logo Conqueror.' : solved ? 'Logo utuh lagi. Mau coba sekali lagi?' : 'Geser, atau pilih dua potongan untuk menukar posisi.'}{active && <span>Keyboard: Tab, lalu Enter atau Spasi. Escape untuk batal.</span>}</p>
        <div className={styles.controls}>
          <button ref={shuffleButton} type="button" onClick={startGame}>{active ? 'Acak lagi' : 'Mainkan puzzle'} <span aria-hidden="true">↻</span></button>
          {active && <button type="button" onClick={restoreLogo}>Logo utuh</button>}
          <a href="#hero" aria-label="Kembali ke atas">Ke atas <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
