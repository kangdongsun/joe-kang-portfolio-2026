import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { assetUrl } from '../assetUrl';

/**
 * About — "Web / 1440 / About" (Figma node 2409:5372) + "Mobile / 390 / About"
 * (2411:5555).
 *
 * Three sections, each a block of copy paired with a portrait video card. In
 * Figma they stack down the page; here (desktop) they're shown one at a time
 * inside a pinned stage, per the brief:
 *
 *  · The copy fills word-by-word as you scroll — Salt 40 → Salt 100, the same
 *    scroll-driven reveal the Home page's About block uses, except this one
 *    interpolates *colour* rather than opacity so "mindful design" can land on
 *    Persimmon 100 while the rest of the line goes to ink.
 *  · Once a section's copy is fully filled, the remaining scroll flips the card
 *    180° on its Y axis to hand off to the next section — a face only ever
 *    swaps its video while rotated away from the viewer, so the change is
 *    invisible. The card also slides to the opposite side, keeping Figma's
 *    alternating layout (§1 right, §2 left, §3 right).
 *
 * Below `lg`, and under `prefers-reduced-motion`, the pin is dropped entirely
 * and the sections stack exactly as the mobile Figma frame has them (copy above
 * video). A pinned, scroll-hijacked stage reads as jank on touch — the same
 * reasoning that turned off `useScrollBlur` below `lg`.
 *
 * Videos autoplay muted + looped everywhere; they're ambient, not content to
 * scrub, so they get no PlayableVideo controls.
 */

type Run = { text: string; accent?: boolean };

type AboutSection = {
  /** Each entry is one paragraph, split into runs so an accented phrase can
   *  carry its own fill colour. */
  paragraphs: Run[][];
  video: string;
  label: string;
};

const sections: AboutSection[] = [
  {
    video: assetUrl('/assets/about-1.mp4'),
    label: 'Joe walking past a red doorway',
    paragraphs: [
      [
        {
          text: 'Hey there! my name is Joe Kang, a product designer with 8+ years of experience in the monetization, ads, and growth space.',
        },
      ],
      [
        {
          text: 'recently, My adventure has landed me at Meta where I help advertisers optimize their messaging ads.',
        },
      ],
    ],
  },
  {
    video: assetUrl('/assets/about-2.mp4'),
    label: 'Joe eating at a restaurant',
    paragraphs: [
      [
        {
          text: 'Product growth happens when you can build trust. Building trust happens when we think about',
        },
        { text: 'mindful design.', accent: true },
      ],
      [
        {
          text: 'This is my core belief and what has helped me grow adoption across multiple products.',
        },
      ],
    ],
  },
  {
    video: assetUrl('/assets/about-3.mp4'),
    label: 'Portrait of Joe',
    paragraphs: [
      [
        {
          text: 'Outside of work, I’m a first-time father who loves staying active, experimenting with recipe, and eating... lots of eating.',
        },
      ],
      [
        {
          text: 'Lately I’ve been chasing a solid Coq Au Vin recipe, trying to master Korean salt bread in the oven,',
        },
      ],
    ],
  },
];

/* ---- experience ----------------------------------------------------------- */

/** Résumé PDF lives in `public/assets/`, so Vite copies it to the build root
 *  untouched. `download` forces a save rather than an in-tab PDF viewer. */
const RESUME_HREF = assetUrl('/assets/JoeKang_Resume.pdf');

type Role = {
  company: string;
  href: string;
  title: string;
  dates: string;
  bullets: string[];
};

const experience: Role[] = [
  {
    company: 'Meta',
    href: 'https://meta.com',
    title: 'Senior Product Designer, Ads',
    dates: 'Feb 2024 – July 2026',
    bullets: [
      'Led end-to-end strategy for Messaging Ad Product Growth; clarified the multi-destination messaging journey and turned ambiguity into a clear solution, unlocking $98K/day and $40M in annual revenue potential.',
      'Shipped 15+ features that shaped strategy across the advertiser platform; drove strategic partnerships across 10+ teams (researchers, engineers, product managers, legal, designers) to align on goals.',
      'Transitioned to CTX Multi-destination mid-H2; rapidly ramped on the space and led design for two high-impact experiments that exceeded iCTX targets (+$99.46K/day vs +$51K/day goal).',
      'Facilitated strategic roadmapping sessions that shaped 18+ P0 projects for 2026 roadmap across account linking and automation guidance initiatives, collaborating with XFN leadership to align on multi-half priorities. We launched 12 of those projects with revenue wins.',
      'Used Figma Make and Claude Code to quickly build and test MVPs, while keeping a clear roadmap for future improvements.',
    ],
  },
  {
    company: 'Gusto',
    href: 'https://gusto.com',
    title: 'Senior Product Designer, Growth',
    dates: 'May 2021 – Feb 2024',
    bullets: [
      'Co-led design for Gusto’s first end-of-year promotional campaign, driving a +22% YoY increase in account joins.',
      'Redesigned the plan selection experience, increasing upgrade click rate by +8.7% and reducing downgrade click rate by 3%.',
      'Championed a company-wide feature adoption initiative with Engineering and Product, shipping iterative experiments that improved adoption by +8.4%.',
      'Led product strategy and end-to-end design of an A La Carte pricing experiment, letting users purchase features as add-ons; drove a +10.6% increase in CVR.',
    ],
  },
  {
    company: 'Expedia Group (Hotwire)',
    href: 'https://expedia.com',
    title: 'Product Designer, Engagement',
    dates: 'Sep 2018 – May 2021',
    bullets: [
      'Led the end-to-end product strategy and design for Hotwire’s highest-converting email campaign (Car Rental and Hotel), achieving +15.6% CTR, +8.0% click-to-open rate, and +4.3% conversion lift.',
      'Improved mobile search conversion by redesigning the date picker and reducing unnecessary error messages, cutting user friction at critical touchpoints.',
      'Rebuilt loading animations across search, billing, and confirmation pages to educate users on Hot Rates; improved CVR +0.8%, GPPQ +0.2%, and Hot Rates share +0.5%.',
    ],
  },
];

/** "My Experience" — Figma node 2463:6489. Static (no scroll choreography), so
 *  it renders identically in the pinned and reduced-motion trees.
 *
 *  `py-20` (80px), not the 128px the pinned sections above use: this block sits
 *  between the About experience and the case-study pages, which run on 40px
 *  section padding, and 128px made the jump between the two page types obvious.
 *  80px splits the difference — closer to the site's rhythm while keeping the
 *  breathing room a résumé block wants. The 1028px column stays: at
 *  `max-w-content` these bullets would run ~180 characters a line. */
function Experience() {
  return (
    <section className="w-full bg-[#f0dfd0]">
      <div className="mx-auto flex max-w-[1028px] flex-col gap-10 px-6 py-20 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <h2 className="font-sans text-h3 font-bold text-ink">My Experience</h2>
          <a
            href={RESUME_HREF}
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-sm bg-accent-persimmon px-4 py-3 font-sans text-eyebrow-sm font-bold uppercase text-surface-card transition-colors duration-200 hover:bg-[#af4233] sm:self-auto"
          >
            Download resume
          </a>
        </div>

        <div className="flex flex-col gap-5">
          {experience.map((role) => (
            <div key={role.company} className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div className="flex flex-col">
                  <a
                    href={role.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-body-1 font-bold text-ink transition-colors duration-200 hover:text-accent-persimmon"
                  >
                    {role.company}
                  </a>
                  <p className="font-sans text-body-3 font-normal text-muted">{role.title}</p>
                </div>
                <p className="font-sans text-body-3 font-normal text-muted sm:whitespace-nowrap">
                  {role.dates}
                </p>
              </div>
              <ul className="flex list-disc flex-col gap-4 pl-6">
                {role.bullets.map((b) => (
                  <li key={b} className="font-sans text-body-2 font-normal text-ink">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const N = sections.length;

/** Share of a section's scroll spent filling the copy; the rest flips the card. */
const FILL = 0.62;

// Salt 40 → Salt 100, and Salt 40 → Persimmon 100 for the accented phrase.
const BASE: RGB = [164, 164, 164];
const INK: RGB = [62, 62, 62];
const PERSIMMON: RGB = [244, 93, 72];

type RGB = [number, number, number];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const mix = (a: RGB, b: RGB, t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(
    a[2] + (b[2] - a[2]) * t,
  )})`;

// easeInOutQuad — used for the card's slide across so it settles rather than
// arriving at constant speed.
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Viewer distance for the card flip. Its origin tracks the card each frame —
 *  see the transform assignment in the scroll loop. */
const PERSPECTIVE = 1600;

/** Flattens a section's paragraphs into one continuous word list so the fill
 *  runs across the paragraph break instead of restarting. */
function wordsOf(section: AboutSection) {
  const out: { text: string; accent: boolean; paragraph: number }[] = [];
  section.paragraphs.forEach((runs, p) => {
    for (const run of runs) {
      for (const w of run.text.split(/\s+/).filter(Boolean)) {
        out.push({ text: w, accent: !!run.accent, paragraph: p });
      }
    }
  });
  return out;
}

const sectionWords = sections.map(wordsOf);

/* ---- copy ----------------------------------------------------------------- */

/** One section's copy. `filled` is only used for the static (mobile / reduced
 *  motion) rendering — the pinned stage drives colour imperatively instead. */
function Copy({
  index,
  filled = false,
  innerRef,
}: {
  index: number;
  filled?: boolean;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const words = sectionWords[index];
  let cursor = 0;

  return (
    <div
      ref={innerRef}
      data-copy={index}
      className="flex flex-col gap-[20px] font-sans text-[14px] font-bold uppercase leading-[20px] tracking-[1.4px] md:text-eyebrow-md lg:gap-8 lg:text-eyebrow-lg"
    >
      {sections[index].paragraphs.map((_, p) => {
        const inParagraph = words.filter((w) => w.paragraph === p);
        return (
          <p key={p}>
            {inParagraph.map((w, j) => {
              const i = cursor++;
              return (
                <span
                  key={j}
                  data-word={i}
                  data-accent={w.accent ? '' : undefined}
                  style={{
                    color: filled
                      ? mix(BASE, w.accent ? PERSIMMON : INK, 1)
                      : mix(BASE, w.accent ? PERSIMMON : INK, 0),
                  }}
                >
                  {w.text}
                  {j < inParagraph.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

/** One side of the flipping card: a bare 24px-radius video, no frame. */
function CardFace({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
      {children}
    </div>
  );
}

function AboutVideo({ src, label }: { src: string; label: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/* ---- page ----------------------------------------------------------------- */

export default function AboutPage() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceARef = useRef<HTMLDivElement>(null);
  const faceBRef = useRef<HTMLDivElement>(null);

  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!track || !stage || !card) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    let travel = 0; // how far the card slides between the two columns

    const measure = () => {
      travel = Math.max(0, stage.clientWidth - card.offsetWidth);
    };

    // Cache each section's word spans once — re-querying every frame would
    // walk the DOM ~200 times a second.
    const spans = copyRefs.current.map((el) =>
      el ? Array.from(el.querySelectorAll<HTMLSpanElement>('span[data-word]')) : [],
    );

    const update = () => {
      raf = 0;
      const isDesktop = desktop.matches;
      const total = track.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp(-track.getBoundingClientRect().top / total, 0, 1) : 0;

      // Split the pinned scroll into N equal slots; each fills its copy, then
      // spends what's left flipping to the next section.
      const slot = Math.min(p * N, N - 1e-4);
      const s = Math.floor(slot);
      const local = slot - s;
      const revealed = clamp(local / FILL, 0, 1);
      const flip = s < N - 1 ? clamp((local - FILL) / (1 - FILL), 0, 1) : 0;

      for (let i = 0; i < N; i++) {
        // Sections already scrolled past stay fully filled, so scrolling back
        // up doesn't un-write them mid-flip.
        const amount = i < s ? 1 : i === s ? revealed : 0;
        const list = spans[i];
        for (let j = 0; j < list.length; j++) {
          const t = clamp(amount * list.length - j, 0, 1);
          const accent = list[j].dataset.accent !== undefined;
          list[j].style.color = mix(BASE, accent ? PERSIMMON : INK, t);
        }

        // Outgoing copy clears before the incoming copy arrives, so the two
        // never overlap mid-flip.
        const el = copyRefs.current[i];
        if (el) {
          const opacity =
            i === s
              ? 1 - clamp(flip / 0.45, 0, 1)
              : i === s + 1
                ? clamp((flip - 0.55) / 0.45, 0, 1)
                : 0;
          el.style.opacity = String(opacity);
          el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
        }
      }

      const rot = (s + flip) * 180;
      const from = s % 2 === 0 ? travel : 0; // §1 and §3 sit right, §2 left
      const to = (s + 1) % 2 === 0 ? travel : 0;
      const x = isDesktop ? from + (to - from) * easeInOut(flip) : 0;
      // The stage's vanishing point has to travel with the card. Left at its
      // default (the stage's centre) the card rotates up to ~230px off-axis
      // once it slides to a column, which shears it into a lopsided trapezoid
      // instead of a flip. Re-centring the perspective on the card each frame
      // keeps the projection symmetric wherever the card currently sits.
      // (Perspective stays on the stage rather than moving into the card's own
      // `transform` — as a transform function it composes into the card's
      // matrix and breaks the faces' backface-visibility culling, blanking the
      // card mid-flip.)
      if (isDesktop) stage.style.perspectiveOrigin = `${(x + card.offsetWidth / 2).toFixed(1)}px 50%`;
      else stage.style.perspectiveOrigin = '50% 50%';
      card.style.transform = isDesktop
        ? `translateX(${x.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg)`
        : `translateX(-50%) rotateY(${rot.toFixed(2)}deg)`;

      // Each face only swaps its clip while it's turned away from the viewer.
      const half = Math.floor(rot / 180);
      const aIdx = clamp(half % 2 === 0 ? half : half + 1, 0, N - 1);
      const bIdx = clamp(half % 2 === 0 ? half + 1 : half, 0, N - 1);
      for (const [face, want] of [
        [faceARef.current, aIdx],
        [faceBRef.current, bIdx],
      ] as const) {
        if (!face) continue;
        for (const v of face.querySelectorAll<HTMLVideoElement>('video')) {
          v.style.opacity = Number(v.dataset.index) === want ? '1' : '0';
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    desktop.addEventListener('change', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      desktop.removeEventListener('change', onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  /* ---- static fallback (reduced motion) ---- */
  if (reduced) {
    return (
      <div className="relative min-h-screen bg-canvas">
        <Header />
        <main>
          <section className="w-full bg-canvas">
            <div className="mx-auto flex max-w-[1028px] flex-col gap-20 px-6 py-32 md:px-8">
              {sections.map((sec, i) => (
                <div
                  key={i}
                  className={[
                    'flex flex-col gap-10 lg:items-center lg:gap-[60px]',
                    i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse',
                  ].join(' ')}
                >
                  <div className="lg:w-[500px] lg:shrink-0">
                    <Copy index={i} filled />
                  </div>
                  <div className="relative aspect-[468/735] w-full overflow-hidden rounded-2xl lg:w-[468px] lg:shrink-0">
                    <AboutVideo src={sec.video} label={sec.label} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Experience />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-canvas">
      <Header />

      <main>
        {/* Below lg the pin is dropped — sections stack per the mobile frame. */}
        <section className="w-full bg-canvas lg:hidden">
          <div className="mx-auto flex max-w-[1028px] flex-col gap-20 px-6 py-28 md:px-8">
            {sections.map((sec, i) => (
              <div key={i} className="flex flex-col gap-10">
                <Copy index={i} filled />
                <div className="relative aspect-[468/735] w-full max-w-[420px] self-center overflow-hidden rounded-2xl">
                  <AboutVideo src={sec.video} label={sec.label} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Desktop: one section at a time, pinned, with the card flipping
            between them. 140vh of scroll per section + one viewport for the
            pin to release. */}
        {/* No `overflow-hidden` here — it would make this a scroll container and
            silently break the sticky pin below. The card never overflows anyway:
            rotateY only ever narrows it. */}
        <section ref={trackRef} className="relative hidden w-full bg-canvas lg:block lg:h-[520vh]">
          <div className="sticky top-0 flex h-screen items-center px-6 md:px-8">
            <div
              ref={stageRef}
              className="relative mx-auto h-[min(735px,calc(100vh-200px))] w-full max-w-[1028px]"
              style={{ perspective: `${PERSPECTIVE}px` }}
            >
              {sections.map((_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    copyRefs.current[i] = el;
                  }}
                  className={[
                    'absolute top-1/2 w-[48.64%] -translate-y-1/2',
                    i % 2 === 0 ? 'left-0' : 'left-[51.36%]',
                  ].join(' ')}
                  style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
                >
                  <Copy index={i} />
                </div>
              ))}

              <div
                ref={cardRef}
                className="absolute left-0 top-0 aspect-[468/735] h-full [transform-style:preserve-3d]"
              >
                {/* Face A carries the even-numbered sections, face B the odd —
                    so consecutive sections always sit on opposite faces. */}
                <div ref={faceARef} className="absolute inset-0 [backface-visibility:hidden]">
                  <CardFace>
                    {sections.map((sec, i) =>
                      i % 2 === 0 ? (
                        <video
                          key={i}
                          data-index={i}
                          src={sec.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          aria-label={sec.label}
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ opacity: i === 0 ? 1 : 0 }}
                        />
                      ) : null,
                    )}
                  </CardFace>
                </div>
                <div
                  ref={faceBRef}
                  className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <CardFace>
                    {sections.map((sec, i) =>
                      i % 2 === 1 ? (
                        <video
                          key={i}
                          data-index={i}
                          src={sec.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          aria-label={sec.label}
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ opacity: 1 }}
                        />
                      ) : null,
                    )}
                  </CardFace>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Experience />
      </main>

      <Footer />
    </div>
  );
}
