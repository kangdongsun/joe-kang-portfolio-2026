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
 * Case Study — "A La Carte Pricing Plan" (Figma node 2292:4475,
 * "Web / 1440 / Case Study / A La Carte Pricing").
 *
 * Sections: title hero (flat screenshot) · Context (Who is Gusto? — two
 * framed screenshots interleaved with copy) · Overview (Problem/Hypothesis/
 * Goal) · Before (Existing Design, video) · After (Launched Design, video,
 * numbered-list copy) · Results (3 stat cards) · Design Process (4-step
 * timeline, some steps bulleted) · CTA (Let's talk first, shared video).
 * Desktop matches the 1440 artboard; below lg the two-column rows stack.
 * Structurally this mirrors CaseStudyMessaging.tsx — same section backgrounds
 * (canvas / #efe1d2 / #f0dfd0), same card treatments — since both case
 * studies share one Figma template.
 *
 * The Hero and Context screenshots (Who is Gusto, Pricing Page) are all flat,
 * unframed browser captures — no baked-in device chrome — so `FramedImage`
 * applies the same border/radius/shadow treatment in CSS that `DeviceVideo`
 * already uses for videos, rather than relying on the asset. Every framed
 * device/video on this page is capped at 700px wide so they all read as the
 * same size regardless of section.
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

/** Framed video — border/radius/shadow applied directly (no baked-in frame),
 * on top of the same image-based soft shadow underneath every device shot on
 * this page. Shared by Hero, Before, and After. Requires a click to start
 * (see PlayableVideo) and loops once playing — these are UI walkthroughs, not
 * one-shot messages. */
function DeviceVideo({
  src,
  ariaLabel,
  active = true,
  delayMs = 0,
}: {
  src: string;
  ariaLabel: string;
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
        ariaLabel={ariaLabel}
        className="z-10 w-full rounded-xl border-8 border-ink shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]"
      />
    </div>
  );
}

/** Framed flat screenshot — same border/radius/shadow treatment as
 * DeviceVideo, since these Context screenshots have no device chrome baked
 * in either (plain full-bleed browser captures). */
function FramedImage({
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
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="relative z-10 block aspect-[700/435] w-full rounded-xl border-8 border-ink object-cover shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]"
      />
    </div>
  );
}

const overviewCards = [
  {
    label: 'Problem',
    body: 'With our current plan structure, we are forcing some users to upgrade to a fully new plan when they only need 1 feature. This results in us losing potential revenue when we gate features and risking churn from our platform.',
  },
  {
    label: 'Hypothesis',
    body: '“If we run an A/B test that allows our Simple users to purchase 6 of our most popular Plus plan features as an add-on, then we will see an increase in ARR and validate that add-ons for plans work for Gusto.”',
  },
  {
    label: 'Goal',
    body: 'Reduce churn by allowing Simple Plan users to adopt add-on features',
  },
];

const stats = [
  { label: 'CVR (Total conversion)', value: '+10.6%' },
  { label: 'Annual recurring revenue', value: '6.5% | +$80K' },
  { label: 'Reduce Churn', value: '-4.8%' },
];

// After's numbered list — bold label + " - " + the rest, kept separate
// (rather than one string with the label re-extracted) so nothing has to be
// re-parsed.
const afterRows = [
  {
    label: 'Add-on store',
    rest: '- In our “upgrade” flow, I added an add-on store that allows users to choose the feature they want in their plan.',
  },
  {
    label: 'Product card',
    rest: '- I worked with the design systems team to introduce a product card that could also show a default state and “in-cart” state',
  },
  {
    label: 'Add-on “more info” page',
    rest: '- I used a side modal to help users learn more about an add-on before they decide on their plan.',
  },
];

// Design Process steps — three carry a bulleted list, the last is a single
// line of plain body copy (matches Figma exactly rather than forcing every
// card into the same shape).
const processSteps: { step: string; items?: string[]; body?: string }[] = [
  {
    step: 'Define pricing',
    items: [
      'Identify the audience',
      'Find the feature users would want as an add-on feature',
      'Find the right pricing point for each add-on',
    ],
  },
  {
    step: 'Define the MVP',
    items: [
      'What does the flow look like to add an add-on feature?',
      'How can we show the value of each add-on to our users?',
    ],
  },
  {
    step: 'Validate the design',
    items: ['Run a usability test to see if users can properly use this experience.'],
  },
  {
    step: 'Launch design',
    body: 'We then launched the experiment',
  },
];

/* ---- page ----------------------------------------------------------------- */

export default function CaseStudyALaCarte() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroBlur = useScrollBlur<HTMLElement>();

  // Above the fold — plays on mount, like the Home hero.
  const hero = createCascade(80);
  const heroTitle = 'A La Carte Pricing Plan';
  const heroEyebrow = 'Reducing churn through feature add-ons';
  const heroTitleStart = hero.next(heroTitle);
  const heroEyebrowStart = hero.next(heroEyebrow, { gap: 60 });
  const heroVideoDelay = hero.peek();

  const context = useReveal<HTMLDivElement>();
  const overview = useReveal<HTMLDivElement>();
  const before = useReveal<HTMLDivElement>();
  const after = useReveal<HTMLDivElement>();
  const results = useReveal<HTMLDivElement>();
  const process = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  const contextHead = createCascade(0);
  const contextEyebrowStart = contextHead.next('Context');
  const contextTitleStart = contextHead.next('Who is Gusto?');
  const contextBody = createCascade(contextHead.peek(), { step: 14 });
  const contextP1 =
    'Gusto, Inc. is a SaaS company that provides payroll, benefits, and human resource management software for small businesses. In short, Gusto helps restaurant owners, tech startups, and mom & pop shops hire employees, manage their team’s benefits, and make sure their team is paid on time.';
  const contextP1Start = contextBody.next(contextP1);
  const contextImage1Delay = contextBody.peek();

  // The trailing period is folded into the bold run rather than styled
  // separately (matches the Hero tagline's same trick) — Words always inserts
  // a space between runs, so a punctuation-only run right after would read as
  // "plan . We've" instead of "plan. We've".
  const contextP2Runs = [
    { text: 'Gusto’s pricing model consists of 3 subscription plans: ' },
    { text: 'Simple plan, Plus plan, and the Premium plan.', className: 'font-bold' },
    {
      text: ' We’ve run a couple of pricing experiments in the past, and we’ve learned that a big group of Simple plan users, who needed advanced features from the Plus plan, couldn’t afford to jump to the next plan. This was causing users to churn from the platform.',
    },
  ];
  const contextBody2 = createCascade(contextImage1Delay, { step: 12 });
  const contextP2Start = contextBody2.next(
    contextP2Runs.reduce((n, r) => n + r.text.split(/\s+/).filter(Boolean).length, 0),
    { gap: 200 },
  );
  const contextImage2Delay = contextBody2.peek();

  // Short reference lines (Role/Team/Duration).
  const roleCard = createCascade(0, { step: 30, gap: 60 });
  const teamRow1 = roleCard.next('Jordan Kong - PM');
  const teamRow2 = roleCard.next('Sarah Ang - CD');
  const teamRow3 = roleCard.next('Erik Gorin - Pricing');

  const overviewCascade = createCascade(0);
  const overviewTitleStart = overviewCascade.next('Overview');
  const overviewCardsBase = overviewCascade.peek();

  const beforeHead = createCascade(0);
  const beforeEyebrowStart = beforeHead.next('Before');
  const beforeTitleStart = beforeHead.next('Existing Design');
  const beforeBodyStart = beforeHead.peek();
  const beforeBody =
    'Gusto’s current pricing structure is based on a 3-plan subscription model. The only way to get new features is to upgrade your plan. The flow in this video is showing the only way a user can upgrade their plan:';

  const afterHead = createCascade(0);
  const afterEyebrowStart = afterHead.next('After');
  const afterTitleStart = afterHead.next('Launched Design');
  const afterVideoDelay = afterHead.peek();
  const afterIntro =
    'Within the upgrade flow, we added an add-on store for users to be able to add any add-ons they want to their plan';
  const afterBody = createCascade(0, { step: 14 });
  const afterIntroStart = afterBody.next(afterIntro);
  const afterRowStarts = afterRows.map((row, i) =>
    afterBody.next(`${row.label} ${row.rest}`, i === 0 ? { gap: 80 } : { gap: 140 }),
  );

  const resultsCascade = createCascade(0);
  const resultsEyebrowStart = resultsCascade.next('After');
  const resultsTitleStart = resultsCascade.next('Results');
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
              <FramedImage
                src={assetUrl('/assets/alc-hero.png')}
                alt="Gusto “Plans and pricing” Add-on store screen"
                delayMs={heroVideoDelay}
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
              {/* left — two 32px-internal groups separated by an 80px gap
                  (title+p1+image1, then p2+image2), matching Figma's two
                  distinct "Frame 316122805/806" blocks rather than one flat
                  32px rhythm throughout */}
              <div className="flex flex-col gap-20 lg:flex-1">
                <div className="flex flex-col gap-8">
                  <div>
                    <SectionHead
                      eyebrow="Context"
                      eyebrowStart={contextEyebrowStart}
                      title="Who is Gusto?"
                      titleStart={contextTitleStart}
                      active={context.shown}
                    />
                    <p className="mt-3 font-sans text-body-1 font-normal text-ink">
                      <Words text={contextP1} active={context.shown} start={contextP1Start} step={14} />
                    </p>
                  </div>
                  <div className="lg:max-w-[700px]">
                    <FramedImage
                      src={assetUrl('/assets/alc-who-is-gusto.png')}
                      alt="Gusto marketing homepage — “Payroll, HR, Benefits. Simplified.”"
                      active={context.shown}
                      delayMs={contextImage1Delay}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <p className="font-sans text-body-1 font-normal text-ink">
                    <Words
                      runs={contextP2Runs}
                      active={context.shown}
                      start={contextP2Start}
                      step={12}
                    />
                  </p>
                  <div className="lg:max-w-[700px]">
                    <FramedImage
                      src={assetUrl('/assets/alc-pricing-page.png')}
                      alt="Gusto “Choose a plan” screen showing Simple, Plus, and Premium plans"
                      active={context.shown}
                      delayMs={contextImage2Delay}
                    />
                  </div>
                </div>
              </div>

              {/* right — overview card, offset 100px to line up with body copy */}
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
                        <Words text="Jordan Kong - PM" active={context.shown} start={teamRow1} />
                      </p>
                      <p>
                        <Words text="Sarah Ang - CD" active={context.shown} start={teamRow2} />
                      </p>
                      <p>
                        <Words text="Erik Gorin - Pricing" active={context.shown} start={teamRow3} />
                      </p>
                    </div>
                    <div>
                      <p>
                        <Words text="Bryan Berend - DS" active={context.shown} start={teamRow1} />
                      </p>
                      <p>
                        <Words text="Tim Vaca - Eng" active={context.shown} start={teamRow2} />
                      </p>
                      <p>
                        <Words text="Annie Kuramoto - Eng" active={context.shown} start={teamRow3} />
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
                        text="Experimentation - 3 months"
                        active={context.shown}
                        start={roleCard.next('Experimentation - 3 months')}
                      />
                    </p>
                    <p>
                      <Words
                        text="Status - 🚀 Launched 2024"
                        active={context.shown}
                        start={roleCard.next('Status - 🚀 Launched 2024')}
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
                <DeviceVideo
                  src={assetUrl('/assets/alc-before.mp4')}
                  ariaLabel="Existing design — pricing upgrade flow walkthrough"
                  active={before.shown}
                  delayMs={beforeBodyStart}
                />
              </div>
              <p className="font-sans text-body-1 font-normal text-ink lg:flex-1">
                <Words text={beforeBody} active={before.shown} start={beforeBodyStart} step={14} />
              </p>
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
                  src={assetUrl('/assets/alc-after.mp4')}
                  ariaLabel="A La Carte Pricing Plan — launched design walkthrough"
                  active={after.shown}
                  delayMs={afterVideoDelay}
                />
              </div>
              <div className="flex flex-col gap-3 font-sans text-body-1 font-normal text-ink lg:flex-1">
                <p>
                  <Words text={afterIntro} active={after.shown} start={afterIntroStart} step={14} />
                </p>
                <ol className="flex flex-col gap-3 list-decimal pl-5">
                  {afterRows.map((row, i) => (
                    <li key={row.label}>
                      <Words
                        block
                        runs={[
                          { text: row.label, className: 'font-bold' },
                          { text: ` ${row.rest}` },
                        ]}
                        active={after.shown}
                        start={afterRowStarts[i]}
                        step={14}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Results ---------- */}
        <section className="w-full bg-canvas">
          <div ref={results.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <SectionHead
              eyebrow="After"
              eyebrowStart={resultsEyebrowStart}
              title="Results"
              titleStart={resultsTitleStart}
              active={results.shown}
            />
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
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
                      {s.items ? (
                        <ul className="list-disc pl-4 font-sans text-body-2 font-normal text-ink">
                          {s.items.map((item, j) => (
                            <li key={j}>
                              <Words
                                block
                                text={item}
                                active={process.shown}
                                start={processStart + i * 90 + 60 + j * 40}
                                step={16}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-sans text-body-2 font-normal text-ink">
                          <Words
                            text={s.body ?? ''}
                            active={process.shown}
                            start={processStart + i * 90 + 60}
                            step={16}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
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
              <p className="max-w-[900px] font-sans text-body-1 font-normal text-ink">
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
            {/* Same shared "Let's Chat" clip as the Messaging case study's CTA
                — Figma reuses this exact video across case studies, so no new
                asset is needed here. No play button (unlike the device-demo
                videos) — it just autoplays + loops once the section scrolls
                into view.

                Mobile crops rather than shrinks: Figma's mobile "Alignment
                section" (e.g. 2292:4472) renders this same clip at its full
                native width (2.33:1) and lets it overflow the 390px frame
                equally on both sides, showing only the centred 390×576
                slice — same object-cover-on-a-fixed-box technique as the
                Home hero's mobile video. Desktop is untouched: Figma's
                desktop frame shows the clip at its native ratio, uncropped. */}
            <div className="relative mt-5 max-lg:aspect-[390/576] max-lg:overflow-hidden">
              <video
                ref={ctaVideoRef}
                src={assetUrl('/assets/cs-cta.mp4')}
                muted
                loop
                playsInline
                aria-hidden="true"
                className="block w-full max-lg:absolute max-lg:inset-0 max-lg:h-full max-lg:object-cover max-lg:object-center [-webkit-mask-composite:source-in] [mask-composite:intersect] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <NextProjectFloat nextHref="#/case/plan-feature-adoption" />
    </div>
  );
}
