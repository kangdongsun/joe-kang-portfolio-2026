/**
 * Hero — Desktop (Figma 2044:5852) + Mobile (Figma 2044:5878).
 *
 * · lg+  : full-bleed autoplay video (the character lives in the video) with the
 *          "Bio" block overlaid left-of-centre, vertically centred (name
 *          Hero/96px, right-aligned), and a bold italic tagline mid-right
 *          ("mindful design." in persimmon). The video is capped at the
 *          1440 artboard and centred; its edges are
 *          masked and it fades to canvas at the bottom so beyond 1440 the
 *          video-matched tan side-panels read as one continuous background.
 *
 * · <lg  : the Figma mobile frame — the character sits on top (portrait crop of
 *          the same video, dissolving to canvas at its base) and the bio is
 *          centred *below* it (name Hero/96px, same literal size as desktop —
 *          the mobile frame doesn't scale it down). No tagline on mobile.
 *
 * Reveal: the hero copy uses `Words` — the site's shared word-by-word text
 * reveal (see Words.tsx). `.hero-bg` supplies flat canvas on mobile / the tan
 * gradient on lg.
 *
 * Start gate: the text reveal and video playback don't start on mount — they
 * wait for `ready` (App only flips this once the Preloader's curtain has
 * fully lifted). Hero is mounted the whole time the Preloader is up so the
 * lift reveals real content with no pop-in, but without this gate the reveal
 * would finish (and the video would already be well underway) before the
 * user ever sees it, since it'd all be playing out hidden behind the curtain.
 *
 * Scroll transition: as the Hero scrolls up past the viewport (into Selected
 * Projects), it blurs + dims over its last ~560px of visibility — see
 * useScrollBlur.ts.
 *
 * Letter hover: on hover-capable pointers, letters near the cursor scale up
 * and blur, falling off with distance — see useHoverLetters.ts. Scoped to the
 * Hero's copy only (`hoverLetters` on each `Words` call below).
 */
import { useEffect, useRef } from 'react';
import { Words } from './Words';
import { useScrollBlur } from './useScrollBlur';
import { useHoverLetters } from './useHoverLetters';
import { mergeRefs } from './mergeRefs';
import { assetUrl } from '../assetUrl';

export default function Hero({ ready }: { ready: boolean }) {
  const blurRef = useScrollBlur<HTMLElement>({ exitPx: 560 });
  const hoverRef = useHoverLetters<HTMLElement>();
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Videos start muted+paused; only play once the preloader curtain lifts.
  useEffect(() => {
    if (!ready) return;
    void desktopVideoRef.current?.play().catch(() => {});
    void mobileVideoRef.current?.play().catch(() => {});
  }, [ready]);

  // Play once, hold on the last frame for 3s, then replay (instead of `loop`).
  const replayAfterPause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    window.setTimeout(() => {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }, 3000);
  };

  return (
    <section id="home" ref={mergeRefs(blurRef, hoverRef)} className="hero-bg relative w-full">
      {/* ===================== Desktop / lg+ ===================== */}
      <div className="relative mx-auto hidden max-w-frame overflow-hidden lg:block">
        {/* Capped video; edges masked into the tan side-panels beyond 1440 */}
        <video
          ref={desktopVideoRef}
          className="absolute inset-0 h-full w-full object-cover object-center min-[1441px]:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_11%,#000_86%,transparent)] min-[1441px]:[mask-image:linear-gradient(to_right,transparent,#000_11%,#000_86%,transparent)]"
          src={assetUrl('/assets/hero-video.mp4')}
          muted
          playsInline
          onEnded={replayAfterPause}
          aria-hidden="true"
        />

        {/* Content layer — 810px artboard */}
        <div className="relative h-[810px] w-full">
          {/* Bio — centred on x = 50% − 373px, y = 50% (vertically centred)
              so the right-aligned name always lands left of the character. */}
          <div className="absolute left-[calc(50%-373px)] top-1/2 flex w-[406px] -translate-x-1/2 -translate-y-1/2 flex-col items-end">
            <h1 className="whitespace-nowrap font-sans text-hero font-bold tracking-[-3.84px] text-ink">
              <Words text="Joe Kang" start={150} active={ready} hoverLetters />
            </h1>
            <p className="text-right font-sans text-h5 font-semibold leading-[32px] text-ink">
              <Words text="Senior Product Designer" start={270} active={ready} hoverLetters />
            </p>
            {/* Figma sets this line as the literal 📍 character rather than an
                icon, so it ships as text. It sits outside <Words> on purpose:
                kept inside, the per-letter hover distortion would warp the
                emoji, and screen readers would announce "round pushpin" before
                the location. aria-hidden leaves just "SF Bay Area" to AT.
                Note the glyph is drawn by the OS emoji font, so it looks
                different on Apple vs Windows/Android and can't take text-ink. */}
            <div className="flex items-center justify-end gap-1">
              <span aria-hidden="true" className="shrink-0 text-h5 leading-[32px]">
                📍
              </span>
              <p className="text-right font-sans text-h5 font-semibold leading-[32px] text-ink">
                <Words text="SF Bay Area" start={450} active={ready} hoverLetters />
              </p>
            </div>
          </div>

          {/* Tagline — top-anchored at x = 50% + 205px, y = 50% + 24px, which
              lines its top up with "Senior Product Designer"'s top (the bio
              block is vertically centred at 50%, 176px tall — 112px name +
              32px subtitle + 32px location — so the subtitle line starts at
              50% − 88px + 112px = 50% + 24px). One bold italic sentence in
              ink, "mindful design." picked out in persimmon (font-bold
              italic inherit from the <p> via CSS inheritance, so only color
              needs to be overridden per-run). The trailing period is folded
              into the persimmon run rather than styled separately — Figma has
              it non-italic/body-colored, but splitting a single punctuation
              mark into its own token isn't worth the complexity `Words`
              would need to support it, and the visual difference is
              imperceptible.

              Forced to exactly 2 lines via an explicit <br/> (rather than
              leaving it to wrap naturally at `w-[294px]`) — a `Words` call
              per line, `whitespace-nowrap` so neither line can additionally
              wrap on its own. The second line's word delays are hand-picked
              to continue the exact same per-word cadence the original
              single-block version had (no extra gap at the line break). */}
          <p className="absolute left-[calc(50%+205px)] top-[calc(50%+24px)] w-[294px] whitespace-nowrap text-left font-sans text-[24px] italic leading-[32px] text-ink">
            <Words text="Driving growth and building" start={780} active={ready} hoverLetters />
            <br />
            <Words
              start={1000}
              active={ready}
              hoverLetters
              runs={[
                { text: 'trust through' },
                { text: 'mindful design.', className: 'text-accent-persimmon' },
              ]}
            />
          </p>
        </div>
      </div>

      {/* Desktop bottom blend — full-width (over the video AND the tan
          side-panels alike), so the "video dissolves onto a cream floor" fade
          is continuous across the whole width and doesn't break at the 1440
          stage edges. Mirrors the Figma "Rectangle 5". */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[13%] bg-[linear-gradient(to_bottom,rgba(248,237,224,0),#f8ede0_65%)] lg:block"
      />

      {/* ===================== Mobile / tablet (<lg) ===================== */}
      <div className="lg:hidden">
        {/* Character — portrait crop of the video, dissolving to canvas at its
            base. aspect-[390/643] reproduces the Figma mobile frame's exact
            crop (390×643 at the 390px artboard) instead of a guessed fixed
            height, so it scales correctly across mobile/tablet widths and
            keeps consistent headroom above the character. */}
        <div className="relative aspect-[390/643] w-full overflow-hidden">
          <video
            ref={mobileVideoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={assetUrl('/assets/hero-video.mp4')}
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(to_bottom,rgba(248,237,224,0),#f8ede0_78%)]"
          />
        </div>

        {/* Bio — centred below the character (slightly overlapping its tail,
            per Figma: text top sits 20px before the character box ends),
            words fade in one after another */}
        <div className="flex flex-col items-center px-3 pb-14 -mt-5 text-center">
          <h1 className="whitespace-nowrap font-sans text-hero font-bold tracking-[-3.84px] text-ink">
            <Words text="Joe Kang" start={120} step={55} active={ready} hoverLetters />
          </h1>
          <p className="mt-1 font-sans text-[20px] font-bold leading-[28px] text-ink">
            <Words text="Senior Product Designer" start={230} step={55} active={ready} hoverLetters />
          </p>
          <div className="flex items-center justify-center gap-1">
            <span aria-hidden="true" className="shrink-0 text-[20px] leading-[28px]">
              📍
            </span>
            <p className="font-sans text-[20px] font-bold leading-[28px] text-ink">
              <Words text="SF Bay Area" start={395} step={55} active={ready} hoverLetters />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
