/** One-time enhancement: wait for motion layout, but never override user input/history. */
export function restoreInitialAnchor(browserWindow, browserDocument) {
  const hash = browserWindow.location.hash;
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return () => {}; }
  if (!id || !browserDocument.getElementById(id) || browserWindow.performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return () => {};

  const deadline = browserWindow.performance.now() + 2000;
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange', 'pagehide'];
  let stopped = false;
  let frame = 0;
  let previous = '';
  let stable = 0;
  let timeout = 0;
  const stop = () => {
    stopped = true;
    browserWindow.cancelAnimationFrame(frame);
    browserWindow.clearTimeout(timeout);
    for (const event of events) browserWindow.removeEventListener(event, stop);
  };
  const sample = () => {
    if (stopped) return;
    const target = browserDocument.getElementById(id);
    if (!target || browserWindow.location.hash !== hash || browserWindow.performance.now() >= deadline) { stop(); return; }
    const position = `${browserDocument.body.scrollHeight}:${Math.round(target.getBoundingClientRect().top + browserWindow.scrollY)}`;
    stable = position === previous ? stable + 1 : 0;
    previous = position;
    if (stable >= 3) {
      stop();
      // Instant deliberately bypasses the page's smooth-scroll CSS on initial load only.
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    frame = browserWindow.requestAnimationFrame(sample);
  };
  timeout = browserWindow.setTimeout(stop, 2000);
  for (const event of events) browserWindow.addEventListener(event, stop, { passive: true });
  const schedule = () => { if (!stopped) frame = browserWindow.requestAnimationFrame(sample); };
  Promise.resolve(browserDocument.fonts?.ready).then(schedule, schedule);
  return stop;
}
