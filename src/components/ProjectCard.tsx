import type { Project, ProjectAccent } from '../data/projects';
import { useReveal } from './useReveal';
import { Words, type WordRun } from './Words';
import { assetUrl } from '../assetUrl';

/**
 * Case-study "Card" (Figma node 2044:5910 / 5911).
 * Cream card, 40px radius, 8px padding. Desktop = media + content side by side;
 * mobile stacks media over content. Each card carries its company's accent glow
 * (Meta = sky, Gusto = persimmon) as a blurred ellipse behind the media.
 *
 * Hover state (the only interaction defined in the file — the "Hover" variant,
 * "media plays / elevated"): the card lifts and the media gently zooms. The
 * source design plays a screen-recording video on hover; here the framed
 * screenshot zooms in its place (see notes to reviewer).
 *
 * Text reveal: the eyebrow/title/description use the same word-by-word
 * `Words` reveal as the Hero and the section header — the site's one "text
 * appears" animation — gated by `useReveal` since cards sit below the fold.
 * The description's stagger step is tuned down (it runs many more words than
 * a hero line) so a long paragraph still resolves in well under a second.
 * The device image isn't text, so it gets the plain (non-staggered) fade-up.
 */

// Desktop hover background tint per card (Figma prototype): the card lifts out
// of the cream page into its brand-tinted panel.
const hoverTintByAccent: Record<ProjectAccent, string> = {
  sky: 'lg:hover:bg-[#f6d6c7]', // same peach as the other cards, not Meta's own blue
  persimmon: 'lg:hover:bg-[#f6d6c7]', // Gusto — peach
  error: 'lg:hover:bg-[#f6d6c7]',
};

// Metric highlights (+$98K/day, +6.5%, ...) use Matcha 100 (#3fac91) and bold
// weight (the rest of the description is regular) — consistent across every
// card, independent of that card's brand accent.
const highlightByAccent: Record<ProjectAccent, string> = {
  sky: 'font-bold text-accent-matcha',
  persimmon: 'font-bold text-accent-matcha',
  error: 'font-bold text-accent-matcha',
};

export default function ProjectCard({ project }: { project: Project }) {
  const { ref, shown } = useReveal<HTMLElement>();

  const descriptionRuns: WordRun[] = project.description.map((run) => ({
    text: run.text,
    className: run.highlight ? highlightByAccent[project.accent] : undefined,
  }));

  return (
    <article
      ref={ref}
      className={[
        'group relative w-full max-w-content rounded-md bg-canvas p-0 lg:rounded-card lg:p-2',
        // Desktop hover: the card background tints to the brand colour.
        'transition-colors duration-300 ease-[var(--ease-out)]',
        hoverTintByAccent[project.accent],
      ].join(' ')}
    >
      {/* Whole-card link to the case study (stretched over the content) */}
      {project.href && (
        <a
          href={project.href}
          aria-label={`${project.title} — case study`}
          className="absolute inset-0 z-20"
        />
      )}
      {/* lg:px-8 gives the device (left) and the text (right) equal insets */}
      <div className="flex flex-col gap-3 lg:h-[574px] lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        {/* Media — framed device sitting on an image-based soft shadow; on
            desktop hover the device lifts and the shadow shrinks a little
            (Figma prototype / Hover example). Not text, so it gets the plain
            fade-up rather than a word-by-word reveal.

            Figma's mobile "Card" variants (e.g. 2067:6012) show a persimmon
            fill here; swapped for Background 300 (#f0dfd0, no named token —
            same raw-hex convention as the Footer/CTA sections elsewhere in
            this codebase) — a persistent panel behind the device on mobile,
            `max-lg:` only. The desktop variant's own media wrapper carries no
            fill at all there; that card only tints (the whole card, on
            hover) via hoverTintByAccent above. */}
        <div
          className={[
            'relative flex min-h-[269px] w-full items-center justify-center py-6 max-lg:rounded-xl max-lg:bg-[#f0dfd0] sm:min-h-[320px] lg:h-full lg:min-h-0 lg:flex-1 lg:py-0',
            shown ? 'animate-fade-up' : 'opacity-0',
          ].join(' ')}
        >
          <div className="relative w-[86%] max-w-[760px] lg:w-full">
            <img
              src={assetUrl('/assets/device-shadow.png')}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[96%] -translate-x-1/2 translate-y-[34%] opacity-60 transition-transform duration-300 ease-[var(--ease-out)] lg:group-hover:scale-[0.88]"
            />
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              className="relative z-10 block w-full object-contain transition-transform duration-300 ease-[var(--ease-out)] lg:group-hover:-translate-y-2.5"
            />
          </div>
        </div>

        {/* Content — same word-by-word reveal as the Hero, cascading
            eyebrow → title → description. */}
        <div className="flex w-full flex-col gap-2 px-1 pb-5 pr-8 text-body lg:flex-1 lg:gap-3 lg:px-0 lg:pb-0">
          <div className="flex flex-col gap-1">
            <p className="font-sans text-eyebrow-sm font-bold uppercase text-body lg:text-eyebrow-md">
              <Words text={project.eyebrow} active={shown} />
            </p>
            <h3 className="font-sans text-[20px] font-bold leading-[28px] text-body md:text-[28px] md:leading-[36px] lg:text-h4">
              <Words text={project.title} start={110} active={shown} />
            </h3>
          </div>
          <p className="font-sans text-[14px] font-normal leading-[20px] text-body md:text-[16px] md:leading-[24px] lg:text-body-1">
            <Words runs={descriptionRuns} start={320} step={18} active={shown} />
          </p>
        </div>
      </div>
    </article>
  );
}
