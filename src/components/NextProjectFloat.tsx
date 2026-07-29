import { useEffect, useState } from 'react';
import { PlayIcon, HomeIcon } from './icons';

/**
 * Floating "Next Project" / "Back Home" pair that rises into the bottom-right
 * corner once the reader nears the end of a case study — matches Figma's
 * "Button group / Default" component (node 2473:6946): both buttons stretch
 * to the width of the wider one, a solid persimmon pill on top (`PlayIcon`
 * reused as the right-pointing chevron) over a "Back Home" pill below that's
 * transparent at rest and only picks up a Salt 100 @ 10% wash on hover.
 *
 * Visibility is driven by raw scroll position (last ~1000px of the page)
 * rather than an IntersectionObserver on the CTA section — it needs to keep
 * toggling on/off as the reader scrolls back up past it, unlike `useReveal`'s
 * one-shot reveal, and staying decoupled from the CTA section means it works
 * the same way regardless of that section's height across the three studies.
 */
export default function NextProjectFloat({ nextHref }: { nextHref: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const fromBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setVisible(fromBottom < 1000);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={[
        'fixed bottom-5 right-5 z-40 flex flex-col gap-2 transition-all duration-500 ease-[var(--ease-out)] md:bottom-8 md:right-8',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    >
      <a
        href={nextHref}
        className="flex items-center justify-center gap-1 rounded-sm bg-accent-persimmon px-4 py-3 font-sans text-eyebrow-sm font-bold uppercase text-surface-card transition-colors duration-200 hover:bg-[#af4233]"
      >
        Next Project
        <PlayIcon className="size-4" />
      </a>
      <a
        href="#home"
        className="flex items-center justify-center gap-2.5 rounded-sm px-4 py-3 font-sans text-eyebrow-sm font-bold uppercase text-body transition-colors duration-200 hover:bg-ink/10"
      >
        Back Home
        <HomeIcon className="size-4 text-ink" />
      </a>
    </div>
  );
}
