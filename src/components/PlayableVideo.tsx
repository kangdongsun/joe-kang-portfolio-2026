import { useRef, useState } from 'react';
import { PlayIcon, PauseIcon, SeekBackIcon, SeekForwardIcon } from './icons';

/**
 * A user-initiated video, styled like a minimal YouTube player: never
 * autoplays — it sits paused on its first frame with a center play button
 * until clicked — and on hover reveals play/pause plus ±5s seek. Shared by
 * every "watchable content" video across the case studies (device-mockup
 * demos, the CTA clips); the Home hero's full-bleed background loop is
 * intentionally exempt, since that one is ambient motion, not content to
 * watch or scrub.
 *
 * `className` lands on the outer (relatively-positioned, overflow-hidden)
 * wrapper — that's where border/radius/shadow framing belongs now, since the
 * control overlay needs to be clipped to the same rounded corners as the
 * video itself.
 */
export default function PlayableVideo({
  src,
  loop = false,
  className,
  ariaLabel,
}: {
  src: string;
  loop?: boolean;
  className?: string;
  ariaLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  // Looping videos need to *wrap* past the end (modulo), not clamp to it —
  // setting currentTime to exactly `duration` on a looping, playing video
  // makes the browser treat it as ended and snap back to 0 on its own, which
  // reads as the seek button being broken rather than the loop continuing.
  const seek = (deltaSeconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    const target = v.currentTime + deltaSeconds;
    const duration = v.duration;
    if (loop && Number.isFinite(duration) && duration > 0) {
      v.currentTime = ((target % duration) + duration) % duration;
    } else {
      v.currentTime = Math.max(0, Number.isFinite(duration) ? Math.min(target, duration) : target);
    }
  };

  // Controls stay visible whenever paused (so the initial "click to play"
  // affordance is never hidden) and otherwise only while hovering — matching
  // the ask ("hover over the video, they can play/pause, 5s back/forward").
  const controlsVisible = hovering || !playing;

  return (
    <div
      className={['relative overflow-hidden', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        muted
        playsInline
        aria-label={ariaLabel}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block w-full cursor-pointer"
      />
      <div
        className={[
          'absolute inset-0 flex items-center justify-center gap-6 bg-[rgba(0,0,0,0.25)] transition-opacity duration-200',
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => seek(-5)}
          aria-label="Back 5 seconds"
          className="flex size-9 items-center justify-center rounded-full bg-surface-card text-ink transition-transform duration-150 hover:scale-105"
        >
          <SeekBackIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="flex size-14 items-center justify-center rounded-full bg-surface-card text-ink transition-transform duration-150 hover:scale-105"
        >
          {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6 translate-x-[1px]" />}
        </button>
        <button
          type="button"
          onClick={() => seek(5)}
          aria-label="Forward 5 seconds"
          className="flex size-9 items-center justify-center rounded-full bg-surface-card text-ink transition-transform duration-150 hover:scale-105"
        >
          <SeekForwardIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
