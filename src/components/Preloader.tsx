import { useEffect, useState } from 'react';
import { Logo } from './icons';

/**
 * Preloader (Figma "Web / 1440 / Pre Loader" 2207:17600 + "Mobile / 390 / Pre
 * Loader" 2207:17613 — identical layout on both, just centered).
 *
 * Black full-bleed overlay: the logo mark rises and sharpens out of a blur
 * while "Joe Kang" assembles a letter at a time just behind it, each glyph
 * flying up from below and resolving as it lands. The whole lockup drifts
 * steadily upward the entire time it's on screen, so nothing is ever fully
 * static — motion taken from the reference clip (fabrica® Studio).
 *
 * The curtain lifts the moment the last glyph lands (plus a short beat) rather
 * than after a fixed minimum, so the preloader is exactly as long as its own
 * animation. `REVEAL_DONE_MS` is derived from the letter constants, so
 * retiming the letters retimes the lift automatically.
 *
 * The progress track is gone — the updated Figma frame drops it, and the
 * reference holds the finished wordmark rather than showing a bar. The load
 * gate it used to visualise is still here (see `ready` below); it just isn't
 * drawn any more.
 *
 * Two separate callbacks, deliberately not one: `onLiftStart` fires the
 * instant the curtain *starts* lifting — that's when the page underneath
 * should spring to life (video playing, text revealing), so by the time the
 * curtain has actually cleared the screen there's already motion, not a
 * static frame. `onDone` fires once the lift has finished, and is only for
 * tearing the Preloader down (unmount, restore body scroll) — using it for
 * both would mean the page sits frozen for the entire lift.
 */

const LIFT_MS = 650;

// Letter choreography. The name now starts well before the mark has settled —
// they used to read as two separate beats.
const LOGO_MS = 620;
const LETTER_START_MS = 120;
const LETTER_STAGGER_MS = 70;
const LETTER_MS = 520;

const WORDMARK = 'Joe Kang';

/** The instant the last glyph finishes — what the curtain waits for. */
const REVEAL_DONE_MS =
  LETTER_START_MS + (WORDMARK.length - 1) * LETTER_STAGGER_MS + LETTER_MS;
const HOLD_AT_FULL_MS = 220;

// The lockup creeps upward for its whole time on screen. Linear, not eased —
// a steady drift reads as continuous motion; an eased one would visibly
// settle, which is the opposite of the intent.
const DRIFT_MS = REVEAL_DONE_MS + HOLD_AT_FULL_MS + LIFT_MS;
const DRIFT_FROM_PX = 14;
const DRIFT_TO_PX = -18;

export default function Preloader({
  onLiftStart,
  onDone,
}: {
  onLiftStart: () => void;
  onDone: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [done, setDone] = useState(false);

  // Entrance: flip on next frame so the initial (pre-animation) styles paint
  // first, then transition to their settled state.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    // requestAnimationFrame is paused while the tab is backgrounded, so on its
    // own it can leave the lockup stuck in its pre-animation state (invisible)
    // right up until the curtain lifts over it. The timer is the backstop.
    const t = window.setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  // The curtain may only lift once BOTH the page has finished loading and the
  // wordmark has fully assembled — the second condition is what stops it
  // becoming a jump-cut on a small site that was already loaded at mount.
  useEffect(() => {
    let loaded = document.readyState === 'complete';
    let revealed = false;
    const check = () => {
      if (loaded && revealed) setReady(true);
    };
    const onLoad = () => {
      loaded = true;
      check();
    };
    if (!loaded) window.addEventListener('load', onLoad);
    const timer = window.setTimeout(() => {
      revealed = true;
      check();
    }, REVEAL_DONE_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      setLifting(true);
      onLiftStart();
    }, HOLD_AT_FULL_MS);
    return () => clearTimeout(t);
  }, [ready]);

  // `onDone` is what unmounts the overlay AND restores body scroll, so it must
  // fire exactly once and can never be skipped: if it doesn't, the curtain has
  // already slid off-screen (the page looks normal) but `overflow: hidden` is
  // still on <body> — the page renders fine and simply refuses to scroll.
  // transitionend alone isn't a safe trigger for it: it doesn't fire when the
  // duration is ~0 (which the reduced-motion rule forces globally), nor if the
  // transition is interrupted. This timer is the guarantee; the event just
  // gets there sooner in the normal case.
  const finish = () => {
    if (done) return;
    setDone(true);
    onDone();
  };

  useEffect(() => {
    if (!lifting) return;
    const t = window.setTimeout(finish, LIFT_MS + 150);
    return () => clearTimeout(t);
  }, [lifting]);

  return (
    <div
      // #000000 is Figma's Salt 1000. It's a raw hex rather than a token
      // because this frame is the only surface on the site that uses it.
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#000000] transition-transform ease-[var(--ease-out)]"
      style={{
        transitionDuration: `${LIFT_MS}ms`,
        transform: lifting ? 'translateY(-100%)' : 'translateY(0)',
      }}
      onTransitionEnd={(e) => {
        // Every letter transitions `transform` too, and those bubble up here —
        // without the target check one of them landing after the lift began
        // would tear the curtain down mid-slide.
        if (e.target !== e.currentTarget) return;
        if (e.propertyName === 'transform' && lifting) finish();
      }}
      aria-hidden="true"
    >
      {/* Continuous upward drift of the whole lockup — see DRIFT_* above. */}
      <div
        className="flex flex-col items-center gap-[9px] transition-transform ease-linear"
        style={{
          transitionDuration: `${DRIFT_MS}ms`,
          transform: `translateY(${mounted ? DRIFT_TO_PX : DRIFT_FROM_PX}px)`,
        }}
      >
        <div
          className="transition-[opacity,transform,filter] ease-[var(--ease-out)]"
          style={{
            transitionDuration: `${LOGO_MS}ms`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(28px)',
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
          }}
        >
          <Logo className="h-[100px] w-auto text-on-dark" />
        </div>

        {/* Per-letter rise. Split on characters rather than words so each glyph
            carries its own delay, and animated with staggered transitions
            rather than a keyframe so the whole effect stays inside this file —
            no new entry needed in tailwind.config.js and its five hand-mirrored
            harness copies. `inline-block` is required for transform to apply,
            and the space is a non-breaking space so it survives the split. */}
        <p className="flex font-sans text-h5 font-bold text-on-dark">
          {WORDMARK.split('').map((ch, i) => (
            <span
              key={i}
              className="inline-block whitespace-pre transition-[opacity,transform,filter] ease-[var(--ease-out)]"
              style={{
                transitionDuration: `${LETTER_MS}ms`,
                transitionDelay: `${LETTER_START_MS + i * LETTER_STAGGER_MS}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(22px)',
                filter: mounted ? 'blur(0px)' : 'blur(7px)',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
