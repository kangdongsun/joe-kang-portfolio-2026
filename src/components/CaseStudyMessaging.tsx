import { useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useReveal } from './useReveal';
import { useScrollBlur } from './useScrollBlur';
import { Words, createCascade } from './Words';
import { MailIcon, LinkedInIcon } from './icons';
import PlayableVideo from './PlayableVideo';
import NextProjectFloat from './NextProjectFloat';
import { assetUrl } from '../assetUrl';

/**
 * Case Study — "Messaging Multi-Destination Adoption"
 * (Figma node 2151:14529, "Web / 1440 / Case Study").
 *
 * Sections: title hero + device · Context (intro + single/multi comparison +
 * Role/Team/Duration overview card) · Overview (Problem/Hypothesis/Goal) ·
 * Before (Existing Design) · After (Launched Design, now a video) · Results
 * (3 stat cards) · Design Process (4-step timeline) · CTA (Let's talk first,
 * now a full-width video). Desktop matches the 1440 artboard; below lg the
 * two-column rows stack.
 *
 * Section backgrounds — Context/Before/Results on plain canvas (#f8ede0),
 * Overview/After/Design Process on a slightly deeper tan (#efe1d2), CTA on its
 * own warmer tone (#f0dfd0) — sampled directly from the Figma frame (none of
 * these are bound design-token variables there, just per-section raw fills).
 * Cards within a section use their own fill too: the Results stat cards sit
 * on the CTA's warm tone (#f0dfd0) regardless of the section's own
 * background, and the Design Process step cards sit on canvas — Figma treats
 * each card's fill independently rather than deriving it from the section.
 *
 * Text reveal: every piece of copy on this page — headings, body paragraphs,
 * stat values, the overview card's fields — uses the same `Words` word-by-word
 * reveal as the Home page (Hero / section header / case-study cards), so the
 * whole site shares one "text appears" animation instead of this page having
 * its own. Each section is gated by its own `useReveal` and sequences its
 * blocks with `createCascade` rather than hand-picked delays. Long paragraphs
 * use a smaller per-word step (~12–15ms vs the default 55ms) so they still
 * resolve in well under a second — same animation, timed to the amount of
 * text. Non-text media (device shots, comparison images) get the plain
 * (non-staggered) fade-up used for images elsewhere on the site.
 *
 * Scroll-blur (`useScrollBlur`) is scoped to the Hero only — it softens as
 * you scroll into Context, matching the Home hero's exit treatment. The rest
 * of the page is a content read, not a sequence of hero-style transitions, so
 * every other section scrolls normally.
 */

/* ---- shared bits ---------------------------------------------------------- */

function SectionHead({
  eyebrow,
  eyebrowStart,
  title,
  titleStart,
  active,
}: {
  eyebrow: string;
  eyebrowStart: number;
  title: string;
  titleStart: number;
  active: boolean;
}) {
  // Takes plain, already-computed start times (rather than a cascade to call
  // `.next()` on internally) — React doesn't run a child component until
  // after the parent's render function returns, so code in the parent can't
  // observe a cascade's cursor advancing from calls made *inside* a child.
  return (
    <div className="flex flex-col gap-1">
      <p className="font-sans text-eyebrow-md font-bold uppercase text-ink">
        <Words text={eyebrow} active={active} start={eyebrowStart} />
      </p>
      <h2 className="font-sans text-[28px] font-bold leading-[36px] tracking-[-1.12px] text-ink md:text-[36px] md:leading-[48px] md:tracking-[-1.44px] lg:text-[48px] lg:leading-[64px] lg:tracking-[-1.92px]">
        <Words text={title} active={active} start={titleStart} />
      </h2>
    </div>
  );
}

/** Framed device screenshot on the image-based soft shadow — not text, so it
 * gets the plain fade-up rather than a word reveal.
 *
 * Shadow placement: `bottom-0` anchors the shadow's bottom edge to the
 * device's bottom edge with no offset; `translate-y-[20%]` then nudges it
 * down just enough to read as sitting *under* the device rather than
 * overlapping it, without pushing it out into a detached-looking blob far
 * below (the Figma glow's own bounds are much bigger/softer than the device
 * itself, so anchoring it flush — 0% — read as pinched, but the literal
 * center-alignment this used to have, 50%, read as floating too far away). */
function DeviceShot({
  src,
  alt,
  active = true,
  delayMs = 0,
}: {
  src: string;
  alt: string;
  active?: boolean;
  delayMs?: number;
}) {
  return (
    <div
      className={['relative w-full', active ? 'animate-fade-up' : 'opacity-0'].join(' ')}
      style={active && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      <img
        src={assetUrl('/assets/device-shadow.png')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[90%] -translate-x-1/2 translate-y-[32%] opacity-55"
      />
      <img src={src} alt={alt} loading="lazy" className="relative z-10 block w-full object-contain" />
    </div>
  );
}

/** Launched Design's video is a raw screen recording with no frame baked in
 * (unlike the PNG device shots) — Figma has Joe adding an 8px salt-100 border,
 * a 16px radius, and a CSS drop-shadow directly on it, on top of the same
 * image-based soft shadow underneath as every other device shot. Requires a
 * click to start (see PlayableVideo) — loops once playing, since it's a UI
 * walkthrough rather than a one-shot message. */
function DeviceVideo({
  src,
  active = true,
  delayMs = 0,
}: {
  src: string;
  active?: boolean;
  delayMs?: number;
}) {
  return (
    <div
      className={['relative w-full', active ? 'animate-fade-up' : 'opacity-0'].join(' ')}
      style={active && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      <img
        src={assetUrl('/assets/device-shadow.png')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[90%] -translate-x-1/2 translate-y-[32%] opacity-55"
      />
      <PlayableVideo
        src={src}
        loop
        ariaLabel="Launched Design — screen recording"
        className="z-10 w-full rounded-xl border-8 border-ink shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]"
      />
    </div>
  );
}

const processSteps = [
  {
    step: 'Usability testing',
    body: 'To understand the advertiser’s pain point, we conducted a usability study in South East Asia',
  },
  {
    step: 'Product Direction Alignment',
    body: 'As a team, we discussed the product direction for multi-destination. I created fully functioning prototypes for us to build product alignment',
  },
  {
    step: 'Design Iteration',
    body: 'I came up with several design iterations for our team to discuss and debate',
  },
  {
    step: 'Design alignment',
    body: 'Drove design alignment across 6 different teams. This included Design Directors and XFN leadership',
  },
];

const stats = [
  { label: 'Multi-destination adoption', value: '+8.3%' },
  { label: 'Multi-destination revenue', value: '+$98K/day' },
  { label: 'Incremental revenue', value: '+0.005%' },
];

/* ---- page ----------------------------------------------------------------- */

export default function CaseStudyMessaging() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroBlur = useScrollBlur<HTMLElement>();

  // Above the fold — plays on mount, like the Home hero.
  const hero = createCascade(80);
  const heroTitle = 'Messaging Multi-Destination Adoption';
  const heroEyebrow = 'Growing adoption through education and simplified interaction';
  const heroTitleStart = hero.next(heroTitle);
  const heroEyebrowStart = hero.next(heroEyebrow, { gap: 60 });
  const heroImageDelay = hero.peek(); // once the eyebrow's cascade has passed

  // Every section blurs + dims as it scrolls up out of view (same treatment
  // as the Home hero/cards) — one ref per section, attached to its outer
  // <section> rather than the inner reveal-triggering div below.

  // Everything below the fold gets its own scroll trigger + cascade.
  const context = useReveal<HTMLDivElement>();
  const before = useReveal<HTMLDivElement>();
  const after = useReveal<HTMLDivElement>();
  const results = useReveal<HTMLDivElement>();
  const process = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  const contextHead = createCascade(0);
  const contextEyebrowStart = contextHead.next('Context');
  const contextTitleStart = contextHead.next('What is Multi-Destination?');
  const contextBody = createCascade(contextHead.peek(), { step: 14 });
  const contextP1 =
    'Messaging ads are ads that run on FB and IG that send potential customers directly into a 1:1 conversation with advertisers on Messenger, Instagram Direct, or WhatsApp. This project is about how I led my team to grow the Messaging Multi-Destination feature through product education and by simplifying the UI.';
  const contextP2 =
    'When creating a messaging ad campaign, the advertiser chooses which app they want to send their customers to. Whenever they’re selecting more than one app destination, then this becomes “Messaging Multi-Destination” (a.k.a. MD).';
  const contextP1Start = contextBody.next(contextP1);
  const contextP2Start = contextBody.next(contextP2, { gap: 200 });
  const contextImagesDelay = contextBody.peek();

  // Short reference lines (Role/Team/Duration) — tighter gap so the whole
  // card resolves quickly rather than crawling line by line.
  const roleCard = createCascade(0, { step: 30, gap: 60 });
  // The Team field is two side-by-side columns — each row (e.g. "Justin
  // Gavil - PM" | "Hanny Yang - PMM") gets one shared start time so the
  // columns reveal in parallel, left and right together.
  const teamRow1 = roleCard.next('Justin Gavil - PM');
  const teamRow2 = roleCard.next('Dale Ramsay - UXR');
  const teamRow3 = roleCard.next('Erika Raso - CD');

  // ---------- Overview (Problem / Hypothesis / Goal) ----------
  const overviewCascade = createCascade(0);
  const overviewTitleStart = overviewCascade.next('Overview');
  const overviewCardsBase = overviewCascade.peek();
  const overview = useReveal<HTMLDivElement>();
  const overviewCards = [
    {
      label: 'Problem',
      body: 'Advertisers were not using multi-destination because there was a comprehension and awareness issue. The lack of education was hurting the adoption of the feature.',
    },
    {
      label: 'Hypothesis',
      body: 'If we can educate advertisers on Multi-destination and simplify how we can enable MD, then we will help advertisers maximize their messaging ads and see higher adoption.',
    },
    {
      label: 'Goal',
      body: 'Increase “Messaging Multi-destination” adoption since it improves ad campaign performance.',
    },
  ];

  const beforeHead = createCascade(0);
  const beforeEyebrowStart = beforeHead.next('Before');
  const beforeTitleStart = beforeHead.next('Existing Design');
  const beforeBodyStart = beforeHead.peek();
  // Figma (2493:7868) splits this into three separate paragraphs rather than
  // one block, so each gets its own <p> and its own reveal beat.
  const beforeParas = [
    'The “Message Destination” section is where advertisers select their preferred messaging apps to chat with their customers.',
    'Although Multi-destination (selecting more than 1 option) is a special product feature, the current UI of “checkboxes” does not make it feel special.',
    'This, along with “the lack of education,” doesn’t give advertisers enough incentive to select more than 1 option.',
  ];
  const beforeBody = createCascade(beforeBodyStart, { step: 14 });
  const beforeParaStarts = beforeParas.map((p) => beforeBody.next(p));

  const afterHead = createCascade(0);
  const afterEyebrowStart = afterHead.next('After');
  const afterTitleStart = afterHead.next('Launched Design');
  const afterImageDelay = afterHead.peek();
  // Each row is a bold label + " - " + the rest, kept separate (rather than
  // one string with the label re-extracted) so nothing has to be re-parsed.
  const afterRows = [
    {
      label: 'Branding',
      rest: '- We first needed to brand Messaging Multi-Destination as Automatic Destination so that advertisers knew that this is a “Meta” feature to help them improve their messaging ad.',
    },
    {
      label: 'Simplify',
      rest: '- We also made “Messaging Multi-Destination” easier to enable by providing them radio buttons.',
    },
    {
      label: 'Education',
      rest: '- We did 2 things here. We leveraged the radio button UI to educate them about MD through Automatic vs. Manual. We also updated the content to best explain the benefits of Automatic Destination.',
    },
  ];
  const afterBody = createCascade(0, { step: 14 });
  const afterRowStarts = afterRows.map((row, i) =>
    afterBody.next(`${row.label} ${row.rest}`, i === 0 ? {} : { gap: 160 }),
  );

  const resultsCascade = createCascade(0);
  const resultsEyebrowStart = resultsCascade.next('Outcome');
  const resultsTitleStart = resultsCascade.next('Experiment Results');
  const statsBase = resultsCascade.peek();

  const processCascade = createCascade(0);
  const processEyebrowStart = processCascade.next('Design Process');
  const processTitleStart = processCascade.next('Steps to iterations and alignment');
  const processStart = processCascade.peek();

  const ctaHead = createCascade(0);
  const ctaEyebrowStart = ctaHead.next('Rest of the portfolio');
  const ctaTitleStart = ctaHead.next('Let’s talk first!');
  const ctaBodyStart = ctaHead.peek();
  const ctaBody =
    'Before diving into the rest of the work, let’s chat first! I would love to share all the iterations, the tests, and the journey in person.';

  // Let's Chat video: no play button — this one just autoplays once the user
  // scrolls to the CTA section, reusing the same reveal trigger as the rest
  // of the section's text rather than a second IntersectionObserver.
  const ctaVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (cta.shown) void ctaVideoRef.current?.play().catch(() => {});
  }, [cta.shown]);

  return (
    <div className="relative min-h-screen bg-canvas">
      <Header />

      <main>
        {/* ---------- Hero ---------- */}
        {/* Background is a radial (not linear) gradient in Figma: an ellipse
            centred at (50%, 74%) — matching the frame's own aspect ratio —
            from canvas at its centre out to a warmer peach at its edges, plus
            a separate 74px/9% bottom strip fading to flat canvas (mirrors the
            Home hero's "Rectangle 5" treatment). */}
        <section
          ref={heroBlur}
          className="relative w-full overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 68.8% 68.8% at 50% 74%, #f8ede0 0%, #ffefda 49%, #f7debe 100%)',
          }}
        >
          <div className="mx-auto flex max-w-content flex-col items-center px-6 pb-16 pt-28 md:px-8 md:pb-20 lg:pt-[120px]">
            <div className="flex max-w-[1000px] flex-col items-center gap-3 text-center">
              <h1 className="font-sans text-[34px] font-bold leading-[40px] tracking-[-1.36px] text-ink sm:text-[46px] sm:leading-[54px] lg:text-[60px] lg:leading-[72px] lg:tracking-[-2.4px]">
                <Words text={heroTitle} start={heroTitleStart} />
              </h1>
              <p className="font-sans text-eyebrow-sm font-bold uppercase text-ink md:text-eyebrow-md">
                <Words text={heroEyebrow} start={heroEyebrowStart} />
              </p>
            </div>
            <div className="mt-10 w-full max-w-[670px] lg:mt-12">
              <DeviceShot
                src={assetUrl('/assets/cs-hero.png')}
                alt="Meta Ads Manager — New Engagement Campaign with Automatic message destinations"
                delayMs={heroImageDelay}
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[9.1%] bg-[linear-gradient(to_bottom,rgba(248,237,224,0),#f8ede0_65%)]"
          />
        </section>

        {/* ---------- Context ---------- */}
        <section className="w-full bg-canvas">
          <div
            ref={context.ref}
            className="mx-auto max-w-content px-6 pb-10 pt-16 md:px-8 md:pb-10 md:pt-20"
          >
            <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-20">
              {/* left */}
              <div className="lg:flex-1">
                <SectionHead
                  eyebrow="Context"
                  eyebrowStart={contextEyebrowStart}
                  title="What is Multi-Destination?"
                  titleStart={contextTitleStart}
                  active={context.shown}
                />
                <div className="mt-3 flex flex-col gap-8 text-ink">
                  <p className="font-sans text-body-1 font-normal">
                    <Words text={contextP1} active={context.shown} start={contextP1Start} step={14} />
                  </p>
                  <p className="font-sans text-body-1 font-normal">
                    <Words text={contextP2} active={context.shown} start={contextP2Start} step={14} />
                  </p>
                </div>
                {/* single / multi comparison — each side gets its own
                    uppercase label (SINGLE-DESTINATION / MULTI-DESTINATION)
                    above the screenshot, per Figma. */}
                <div
                  className={[
                    'mt-8 grid max-w-[600px] grid-cols-1 items-start gap-8 sm:grid-cols-2',
                    context.shown ? 'animate-fade-up' : 'opacity-0',
                  ].join(' ')}
                  style={context.shown ? { animationDelay: `${contextImagesDelay}ms` } : undefined}
                >
                  <div className="flex flex-col items-center gap-5">
                    <p className="font-sans text-[17px] font-bold uppercase tracking-[2px] text-ink">
                      Single-Destination
                    </p>
                    <img
                      src={assetUrl('/assets/cs-single.png')}
                      alt="Single-destination ad preview — one messaging app selected"
                      loading="lazy"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <p className="font-sans text-[17px] font-bold uppercase tracking-[2px] text-ink">
                      Multi-Destination
                    </p>
                    <img
                      src={assetUrl('/assets/cs-multi.png')}
                      alt="Multi-destination ad preview — Messenger, Instagram and WhatsApp selected"
                      loading="lazy"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* right — overview card. Figma offsets this panel 100px below
                  the column top (not flush with "Context" like it was) — that
                  100px is exactly the left column's SectionHead height (88px)
                  plus its 12px gap before the body paragraph, so "Role" lines
                  up with the first line of body text, not the heading. */}
              <div className="flex flex-col gap-4 text-ink lg:w-[287px] lg:shrink-0 lg:mt-[100px]">
                <div className="flex flex-col">
                  <p className="font-sans text-eyebrow-md font-bold uppercase">
                    <Words text="Role" active={context.shown} start={roleCard.next('Role')} />
                  </p>
                  <p className="font-sans text-body-2 font-normal">
                    <Words
                      text="Senior Product Designer"
                      active={context.shown}
                      start={roleCard.next('Senior Product Designer')}
                    />
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-sans text-eyebrow-md font-bold uppercase">
                    <Words text="Team" active={context.shown} start={roleCard.next('Team')} />
                  </p>
                  <div className="flex gap-6 font-sans text-body-2 font-normal">
                    <div>
                      <p>
                        <Words text="Justin Gavil - PM" active={context.shown} start={teamRow1} />
                      </p>
                      <p>
                        <Words text="Dale Ramsay - UXR" active={context.shown} start={teamRow2} />
                      </p>
                      <p>
                        <Words text="Erika Raso - CD" active={context.shown} start={teamRow3} />
                      </p>
                    </div>
                    <div>
                      <p>
                        <Words text="Hanny Yang - PMM" active={context.shown} start={teamRow1} />
                      </p>
                      <p>
                        <Words text="Louis Li - EM" active={context.shown} start={teamRow2} />
                      </p>
                      <p>
                        <Words text="Huiqiong Gu - Eng" active={context.shown} start={teamRow3} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-sans text-eyebrow-md font-bold uppercase">
                    <Words text="Duration" active={context.shown} start={roleCard.next('Duration')} />
                  </p>
                  <div className="font-sans text-body-2 font-normal">
                    <p>
                      <Words
                        text="Build - 2.5 months"
                        active={context.shown}
                        start={roleCard.next('Build - 2.5 months')}
                      />
                    </p>
                    <p>
                      <Words
                        text="Experimentation - 4 months"
                        active={context.shown}
                        start={roleCard.next('Experimentation - 4 months')}
                      />
                    </p>
                    <p>
                      <Words
                        text="Status - 🚀 Launched 2026"
                        active={context.shown}
                        start={roleCard.next('Status - 🚀 Launched 2026')}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Overview (Problem / Hypothesis / Goal) ---------- */}
        <section className="w-full bg-[#efe1d2]">
          <div ref={overview.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <h2 className="font-sans text-[28px] font-bold leading-[36px] tracking-[-1.12px] text-ink md:text-[36px] md:leading-[48px] md:tracking-[-1.44px] lg:text-[48px] lg:leading-[64px] lg:tracking-[-1.92px]">
              <Words text="Overview" active={overview.shown} start={overviewTitleStart} />
            </h2>
            <div className="mt-8 flex flex-col gap-4 md:flex-row">
              {overviewCards.map((c, i) => (
                <div
                  key={c.label}
                  className="flex flex-1 flex-col justify-start gap-3 rounded-lg border border-[rgba(0,0,0,0.1)] bg-canvas p-8"
                >
                  <p className="font-sans text-eyebrow-md font-bold uppercase text-ink">
                    <Words text={c.label} active={overview.shown} start={overviewCardsBase + i * 90} />
                  </p>
                  <p className="font-sans text-body-1 font-normal text-body">
                    <Words
                      text={c.body}
                      active={overview.shown}
                      start={overviewCardsBase + i * 90 + 60}
                      step={14}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Before ---------- */}
        <section className="w-full bg-canvas">
          <div ref={before.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <div className="lg:max-w-[700px]">
              <SectionHead
                eyebrow="Before"
                eyebrowStart={beforeEyebrowStart}
                title="Existing Design"
                titleStart={beforeTitleStart}
                active={before.shown}
              />
            </div>
            <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
              <div className="lg:w-[700px] lg:shrink-0">
                <DeviceShot
                  src={assetUrl('/assets/cs-before.png')}
                  alt="Existing message-destinations design using checkboxes"
                  active={before.shown}
                  delayMs={beforeBodyStart}
                />
              </div>
              <div className="flex flex-col gap-6 font-sans text-body-1 font-normal text-ink lg:flex-1">
                {beforeParas.map((para, i) => (
                  <p key={i}>
                    <Words text={para} active={before.shown} start={beforeParaStarts[i]} step={14} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- After ---------- */}
        <section className="w-full bg-[#efe1d2]">
          <div ref={after.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <div className="lg:max-w-[700px]">
              <SectionHead
                eyebrow="After"
                eyebrowStart={afterEyebrowStart}
                title="Launched Design"
                titleStart={afterTitleStart}
                active={after.shown}
              />
            </div>
            <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
              <div className="lg:w-[700px] lg:shrink-0">
                <DeviceVideo
                  src={assetUrl('/assets/cs-after.mp4')}
                  active={after.shown}
                  delayMs={afterImageDelay}
                />
              </div>
              <div className="flex flex-col gap-6 font-sans text-body-1 font-normal text-ink lg:flex-1">
                {afterRows.map((row, i) => (
                  <p key={row.label}>
                    <Words
                      runs={[
                        { text: row.label, className: 'font-bold' },
                        { text: row.rest },
                      ]}
                      active={after.shown}
                      start={afterRowStarts[i]}
                      step={14}
                    />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Results ---------- */}
        <section className="w-full bg-canvas">
          <div ref={results.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <SectionHead
              eyebrow="Outcome"
              eyebrowStart={resultsEyebrowStart}
              title="Experiment Results"
              titleStart={resultsTitleStart}
              active={results.shown}
            />
            {/* Cards sit side by side — each column gets a small offset off
                the shared base, rather than cascading fully sequentially. */}
            <div className="mt-8 flex flex-col gap-4 md:flex-row">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-1 flex-col justify-center gap-3 rounded-md border border-[rgba(0,0,0,0.2)] bg-[#f0dfd0] p-8"
                >
                  <p className="font-sans text-eyebrow-md font-bold uppercase text-ink">
                    <Words text={s.label} active={results.shown} start={statsBase + i * 90} />
                  </p>
                  <p className="font-sans text-body-1 font-bold text-accent-matcha">
                    <Words text={s.value} active={results.shown} start={statsBase + i * 90 + 60} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Design Process ---------- */}
        <section className="w-full bg-[#f0dfd0]">
          <div ref={process.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <SectionHead
              eyebrow="Design Process"
              eyebrowStart={processEyebrowStart}
              title="Steps to iterations and alignment"
              titleStart={processTitleStart}
              active={process.shown}
            />
            <div className="mt-8">
              {/* Progress timeline (desktop) — hollow circles on a dashed
                  line, matching Figma exactly. The row shares the exact same
                  `grid-cols-4 gap-5` as the cards below, and each circle sits
                  at its own cell's start (justify-self-start), so a circle
                  always lands directly above its card's left edge — the
                  previous version used an even flex-1 split with no gap
                  awareness, so the circles drifted out of alignment with the
                  cards. Each non-last circle's dash extends `calc(100% +
                  20px)` — its own remaining cell width, plus the exact gap —
                  landing precisely on the next circle with no visible break
                  at the column boundary. The circle's own fill matches the
                  *section's* background (not canvas) so it still reads as a
                  hollow ring rather than a solid dot. */}
              <div
                className={[
                  'mb-[29px] hidden grid-cols-4 gap-5 lg:grid',
                  process.shown ? 'animate-fade-up' : 'opacity-0',
                ].join(' ')}
              >
                {processSteps.map((_, i) => (
                  <div key={i} className="relative flex h-4 items-center">
                    <span className="z-10 size-4 shrink-0 rounded-full border-2 border-ink bg-[#f0dfd0]" />
                    {i < processSteps.length - 1 && (
                      <span className="absolute left-4 top-1/2 h-0 w-[calc(100%+20px)] -translate-y-1/2 border-t-2 border-dashed border-ink" />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((s, i) => (
                  <div key={s.step} className="flex flex-col gap-5">
                    <p className="font-sans text-eyebrow-md font-bold uppercase text-ink">
                      <Words text={s.step} active={process.shown} start={processStart + i * 90} />
                    </p>
                    <div className="flex-1 rounded-md border border-[rgba(0,0,0,0.1)] bg-canvas p-4">
                      <p className="font-sans text-body-2 font-normal text-ink">
                        <Words text={s.body} active={process.shown} start={processStart + i * 90 + 60} step={16} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CTA — now centred, with social links below the copy and
            a full-width video (not a device shot) beneath everything. ---------- */}
        <section className="w-full bg-[#f0dfd0]">
          <div ref={cta.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <SectionHead
                eyebrow="Rest of the portfolio"
                eyebrowStart={ctaEyebrowStart}
                title="Let’s talk first!"
                titleStart={ctaTitleStart}
                active={cta.shown}
              />
              <p className="max-w-[1056px] font-sans text-body-1 font-normal text-ink">
                <Words text={ctaBody} active={cta.shown} start={ctaBodyStart} step={14} />
              </p>
              <div className="flex items-center gap-4">
                <a href="mailto:kangdongsun@gmail.com" aria-label="Email Joe Kang" className="flex size-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink">
                  <MailIcon className="h-5 w-6" />
                </a>
                <a href="https://www.linkedin.com/in/joe-kang/" aria-label="Joe Kang on LinkedIn" className="flex size-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink">
                  <LinkedInIcon className="size-5" />
                </a>
              </div>
            </div>
            {/* The video's own background is a near-match for the section's
                flat #f0dfd0, but not an exact one — on a perfectly flat
                surrounding color that small a delta still reads as a hard
                rectangle (simultaneous contrast). Feathering the edges with a
                mask (same technique as the Home hero's video) lets the
                section's own color show through at the border, so the seam
                disappears instead of needing pixel-exact color matching. No
                play button here (unlike the device-demo videos) — it just
                autoplays + loops once the section scrolls into view. */}
            <div className="mt-5">
              <video
                ref={ctaVideoRef}
                src={assetUrl('/assets/cs-cta.mp4')}
                muted
                loop
                playsInline
                aria-hidden="true"
                className="block w-full [-webkit-mask-composite:source-in] [mask-composite:intersect] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <NextProjectFloat nextHref="#/case/a-la-carte" />
    </div>
  );
}
