import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll-reveal: adds a fade-up when the element first enters the
 * viewport. There is no keyframe/Smart-Animate data in the Figma file, so this
 * is a restrained enhancement (not invented from the design) and is disabled
 * automatically for users who prefer reduced motion via the CSS in index.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}
