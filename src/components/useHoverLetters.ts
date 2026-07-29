import { useEffect, useRef } from 'react';

/**
 * Mouse-proximity letter distortion for the Hero's text (Joe Kang / subtitle
 * / tagline): letters near the cursor scale up, falling off with distance,
 * and ease back to normal as the cursor moves away or leaves.
 *
 * Targets `Words` spans rendered with `hoverLetters` (see Words.tsx), found
 * via `[data-letter]`. Values are written straight to each letter's DOM node
 * inside a rAF-throttled pointermove listener (no React re-render per frame —
 * same pattern as useScrollBlur / About's scroll-driven word fill).
 *
 * Purely decorative (Emil Kowalski's framework: valid for a rare, first-view
 * hero interaction) — so it's skipped entirely under `prefers-reduced-motion`,
 * and gated to hover-capable, fine pointers so a touch tap doesn't trigger it.
 */
const RADIUS = 70; // px — beyond this, a letter is unaffected
const MAX_SCALE = 0.26; // +26% at the cursor's center

export function useHoverLetters<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let pointer: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      const letters = el.querySelectorAll<HTMLElement>('[data-letter]');
      letters.forEach((letter) => {
        if (!pointer) {
          letter.style.transform = '';
          return;
        }
        const r = letter.getBoundingClientRect();
        const dx = pointer.x - (r.left + r.width / 2);
        const dy = pointer.y - (r.top + r.height / 2);
        const distance = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - distance / RADIUS);
        const eased = t * t; // concentrate the effect near the cursor
        if (eased < 0.005) {
          letter.style.transform = '';
        } else {
          letter.style.transform = `scale(${(1 + eased * MAX_SCALE).toFixed(3)})`;
        }
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      pointer = null;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
