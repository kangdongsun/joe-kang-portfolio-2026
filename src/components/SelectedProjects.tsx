import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import { useReveal } from './useReveal';
import { useScrollBlur } from './useScrollBlur';
import { Words } from './Words';

/**
 * Selected Projects section (Figma node 2023:5438).
 * Section header ("Couple of my" eyebrow + "Selected Projects" H3) followed by
 * the case-study cards. 32px section gutter; 80px top padding before the header.
 *
 * The header text uses the same word-by-word `Words` reveal as the Hero and
 * the case-study cards, gated by `useReveal` since it's below the fold.
 *
 * Scroll transition: as this section scrolls up past the viewport (into
 * About), it blurs + dims over its last ~560px of visibility, mirroring the
 * same treatment on the Hero — see useScrollBlur.ts.
 */
export default function SelectedProjects() {
  const { ref, shown } = useReveal();
  const blurRef = useScrollBlur<HTMLElement>({ exitPx: 560 });

  return (
    <section id="projects" ref={blurRef} className="w-full bg-canvas px-2 py-8 md:px-8 lg:py-20">
      <div className="mx-auto max-w-content">
        {/* Section header — H5/24px on mobile, H3/48px on desktop */}
        <div ref={ref} className="flex flex-col gap-1 pr-8 pt-4 md:pt-12 lg:pt-0">
          <p className="font-sans text-eyebrow-sm font-bold uppercase text-body lg:text-eyebrow-md">
            <Words text="Couple of my" active={shown} />
          </p>
          <h2 className="font-sans text-[24px] font-bold leading-[32px] text-ink md:text-[36px] md:leading-[44px] lg:text-h3">
            <Words text="Selected Projects" start={90} active={shown} />
          </h2>
        </div>

        {/* Cards — same order (Meta, then Gusto) at every breakpoint, matching
            the Figma mobile frame. */}
        <div className="mt-10 flex flex-col gap-10 lg:mt-2.5 lg:gap-2.5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
