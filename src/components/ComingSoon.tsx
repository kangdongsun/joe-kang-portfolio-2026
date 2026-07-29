import { useReveal } from './useReveal';
import { Words } from './Words';

/**
 * "More Projects — Coming Soon!" banner (Figma node 2416:5942, Mobile 2416:5946).
 * Replaces the old scroll-pinned About bio block that used to sit here — that
 * content now lives on its own page (see AboutPage.tsx), and Home's bottom
 * section is just this short teaser between Selected Projects and the Footer.
 */
export default function ComingSoon() {
  const { ref, shown } = useReveal();

  return (
    // #f0dfd0, not Figma's #efe1d2: the Footer was later restyled to #f0dfd0,
    // and the two creams differ by ~1/255 per channel — just enough to draw a
    // faint seam above the footer. Every case study already runs its last
    // section into the footer on #f0dfd0; Home now matches.
    <section className="w-full bg-[#f0dfd0] px-6 py-20 md:px-8 lg:pb-20 lg:pt-40">
      <div
        ref={ref}
        className="mx-auto flex max-w-content flex-col items-center gap-1 text-center"
      >
        <p className="font-sans text-eyebrow-sm font-bold uppercase text-body lg:text-eyebrow-md">
          <Words text="More Projects" active={shown} />
        </p>
        <h2 className="font-sans text-[24px] font-bold leading-[32px] text-ink md:text-[36px] md:leading-[44px] lg:text-h3">
          <Words text="Coming Soon!" start={90} active={shown} />
        </h2>
      </div>
    </section>
  );
}
