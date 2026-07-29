import { useEffect, useRef } from 'react';

/**
 * Softens a section as it scrolls up out of view — the "outgoing" half of a
 * scroll transition into the next section (Hero → Selected Projects → About).
 * Not the sticky-stacked-panel technique (each section held in place while
 * the next visibly slides over it); sections keep their normal scroll flow
 * and height. Instead, a section blurs + dims over the last `exitPx` of its
 * own visibility, as its bottom edge approaches the top of the viewport, so
 * it's already softened by the time it scrolls away instead of cutting hard.
 *
 * Writes `filter`/`opacity` straight to the DOM node inside a rAF-throttled
 * scroll listener (no React re-render per scroll frame) — the same
 * performance pattern already used for About's scroll-driven word fill.
 *
 * Also watches for layout shifts unrelated to scrolling — e.g. a section
 * whose height depends on an async-loading image/video (like the case-study
 * hero) is often shorter than final on the very first computation, which
 * bakes in a wrong blur/opacity that then never corrects itself since no
 * scroll or window-resize event follows. A `ResizeObserver` on the element
 * re-runs the same computation whenever its actual size changes, catching
 * image/video/font-driven reflows too, not just scroll/viewport-resize.
 *
 * Desktop-only (`lg` and up, matching this project's own mobile/desktop
 * split — see Hero.tsx) — on mobile, sections scroll past each other too
 * quickly for "soften as it exits" to read as intentional; it just looks
 * like flicker, so it's disabled below `lg` rather than tuned down.
 */
export function useScrollBlur<T extends HTMLElement = HTMLDivElement>({
  maxBlur = 14,
  exitPx = 480,
}: { maxBlur?: number; exitPx?: number } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!desktopQuery.matches) {
        el.style.filter = '';
        el.style.opacity = '';
        return;
      }
      const bottom = el.getBoundingClientRect().bottom;
      const progress = Math.min(1, Math.max(0, 1 - bottom / exitPx));
      el.style.filter = progress > 0.01 ? `blur(${(progress * maxBlur).toFixed(1)}px)` : '';
      el.style.opacity = String(1 - progress * 0.35);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    desktopQuery.addEventListener('change', update);

    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(el);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktopQuery.removeEventListener('change', update);
      resizeObserver.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxBlur, exitPx]);

  return ref;
}
