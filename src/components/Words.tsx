/**
 * The site's single "text appears" animation — used by the Hero, the Selected
 * Projects section header, and the case-study cards, so every piece of copy
 * reveals the same way instead of each section inventing its own.
 *
 * Each word rises up (`translateY(0.3em)→0`), fades in, and de-blurs, staggered
 * in reading order (see the `word-reveal` keyframe in tailwind.config.js, which
 * shares the site-wide `--ease-out` curve with every other UI animation).
 *
 * `active` gates playback: false renders the words invisible with no animation
 * — the pre-reveal state for anything below the fold, before `useReveal`'s
 * IntersectionObserver flips it true. Hero copy (above the fold) just leaves
 * `active` at its default `true` and plays on mount.
 */

export type WordRun = { text: string; className?: string };

/**
 * Sequences several `Words` blocks in one section without hand-computing each
 * delay. `next(text)` returns that block's start time (ms) and advances the
 * cursor past it (word count × step, plus a gap before the next block).
 * Pass the same string you're about to render — no separate word count to
 * keep in sync.
 *
 * Not a hook: it only derives numbers from arguments, holds no state across
 * renders, so it's safe (and cheap) to create fresh at the top of a render.
 */
export function createCascade(startAt = 0, defaults: { step?: number; gap?: number } = {}) {
  let cursor = startAt;
  return {
    next(text: string | number, overrides: { step?: number; gap?: number } = {}) {
      const step = overrides.step ?? defaults.step ?? 55;
      const gap = overrides.gap ?? defaults.gap ?? 120;
      const words = typeof text === 'number' ? text : text.split(/\s+/).filter(Boolean).length;
      const start = cursor;
      cursor = start + words * step + gap;
      return start;
    },
    /** Current cursor without advancing it — e.g. to time a non-text element
     * (an image fade-up) to start once the preceding text has cascaded past. */
    peek() {
      return cursor;
    },
  };
}

function tokenize(runs: WordRun[]): WordRun[] {
  const tokens: WordRun[] = [];
  for (const run of runs) {
    for (const word of run.text.split(/\s+/).filter(Boolean)) {
      tokens.push({ text: word, className: run.className });
    }
  }
  return tokens;
}

export function Words({
  text,
  runs,
  start = 0,
  step = 55,
  active = true,
  className,
  hoverLetters = false,
  block = false,
}: {
  /** Plain string to split on spaces. Use `runs` instead for mixed styling. */
  text?: string;
  /** Runs of text that each carry their own className (e.g. a highlighted
   * phrase) — tokenized into words that continue the same stagger sequence. */
  runs?: WordRun[];
  /** ms delay before the first word starts. */
  start?: number;
  /** ms delay added per subsequent word. */
  step?: number;
  /** false = held in the pre-reveal state (no animation) until flipped true. */
  active?: boolean;
  className?: string;
  /** Opt in to per-letter spans (`[data-letter]`) for `useHoverLetters` — the
   * word-level reveal stagger/timing is unaffected either way. Off by default
   * since most `Words` usages don't need the extra per-letter DOM nodes. */
  hoverLetters?: boolean;
  /** Render the wrapper as a block instead of an inline-block. Use inside
   * `<li>`: a block child pins the list marker to the item's first line in
   * every engine, whereas an inline-block leaves the marker on a line box
   * whose baseline is engine-dependent (WebKit puts it on the LAST line, so
   * wrapped items get their bullet at the bottom). */
  block?: boolean;
}) {
  const tokens = tokenize(runs ?? (text ? [{ text }] : []));

  // Outside the Hero, copy reveals a *block* at a time — the whole heading,
  // then the whole paragraph, then the image — rather than word by word. Only
  // the Hero (the one place that opts into `hoverLetters`) still staggers per
  // word, because that lettering is the page's opening statement and carries
  // the cursor-distortion effect that needs the per-glyph nodes anyway.
  //
  // `createCascade` still spaces the blocks apart, so sections keep arriving in
  // reading order; each block just resolves as one unit now instead of
  // rippling. Tokens are still joined with single spaces (rather than the runs
  // rendered raw) so the rendered text is byte-identical to the staggered
  // version — several call sites lean on that whitespace collapsing.
  if (!hoverLetters) {
    return (
      <span
        // Inside a list item, pass `block` (see the prop's note) — an
        // inline-block's baseline is its LAST line, which drags the marker to
        // the bottom of a wrapped item. `align-top` papers over that in Blink
        // but not in WebKit; a block child is unambiguous everywhere.
        className={[
          block ? 'block' : 'inline-block align-top',
          active ? 'animate-word-reveal' : 'opacity-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={active ? { animationDelay: `${start}ms` } : undefined}
      >
        {tokens.map((token, i) => (
          <span key={i} className={token.className}>
            {token.text}
            {i < tokens.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    );
  }

  return (
    <>
      {tokens.map((token, i) => (
        <span key={i}>
          <span
            className={[
              'inline-block',
              active ? 'animate-word-reveal' : 'opacity-0',
              className,
              token.className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={active ? { animationDelay: `${start + i * step}ms` } : undefined}
          >
            {hoverLetters
              ? // Array.from (not .split('')) — .split('') cuts by UTF-16 code
                // unit, which breaks any surrogate-pair character (e.g. the 📍
                // emoji) into two lone surrogates that each render as tofu.
                // Array.from iterates by code point, keeping it intact.
                Array.from(token.text).map((ch, ci) => (
                  <span key={ci} data-letter className="inline-block">
                    {ch}
                  </span>
                ))
              : token.text}
          </span>
          {i < tokens.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}
