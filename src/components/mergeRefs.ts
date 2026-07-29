import type { Ref, RefCallback, MutableRefObject } from 'react';

/**
 * Combines multiple refs (object or callback) into one — so a single DOM
 * node can be shared by independent hooks that each expect their own ref
 * (e.g. Hero's section needs both `useScrollBlur` and `useHoverLetters`).
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as MutableRefObject<T | null>).current = node;
    }
  };
}
