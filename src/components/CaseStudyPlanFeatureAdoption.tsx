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
 * Case Study — "Plan Feature Adoption" (Figma node 2327:2842, "Web / 1440 /
 * Case Study / Plan Feature Adoption").
 *
 * Sections: title hero (flat screenshot) · Context (Gusto's Plan Feature
 * Adoption Problem) · Overview (Problem/Hypothesis/Goal) · Before (Existing
 * Design, flat screenshot) · After (Launched Design, video) · Outcome (2 stat
 * cards) · Results Chart (full-width bar-chart image) · Design Process
 * (4-step timeline) · CTA (Let's talk first, shared video). Structurally
 * mirrors CaseStudyALaCarte.tsx / CaseStudyMessaging.tsx — same section
 * backgrounds and card treatments, since all three case studies share one
 * Figma template.
 *
 * Unlike A La Carte, the Hero and Before media here are flat screenshots (no
 * device video), so both use FramedImage rather than DeviceVideo — only the
 * After section has a real screen recording.
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

/** Framed video — border/radius/shadow applied directly, on top of the same
 * image-based soft shadow underneath every device shot on this page. Requires
 * a click to start (see PlayableVideo) and loops once playing. */
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
 * DeviceVideo. `radius` matches the per-node Figma value (Before uses 12px,
 * the Context screenshot uses 16px — not uniform across this file).
 * `topAnchored` matches Figma's crop, which anchors near the top of the
 * source screenshot (header/nav) rather than centering it. */
function FramedImage({
  src,
  alt,
  aspect,
  radius = 'rounded-xl',
  topAnchored = false,
  active = true,
  delayMs = 0,
}: {
  src: string;
  alt: string;
  aspect: string;
  radius?: string;
  topAnchored?: boolean;
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
        className={[
          'relative z-10 block w-full border-8 border-ink object-cover shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)]',
          aspect,
          radius,
          topAnchored ? 'object-top' : 'object-center',
        ].join(' ')}
      />
    </div>
  );
}

const overviewCards = [
  {
    label: 'Problem',
    body: 'For Plus plan users, there is a feature discovery problem. The lack of feature adoption is causing them to downgrade or churn from the platform.',
  },
  {
    label: 'Hypothesis',
    body: 'If we can get users to adopt at least 1 new feature and activate them into it, then we can increase feature adoption and see if it reduces churn.',
  },
  {
    label: 'Goal',
    body: 'Improve feature discovery to allow for more feature adoption, and then we will see less churn or downgrades.',
  },
];

const stats = [
  { label: 'Feature adoption', value: '+8.4%' },
  { label: 'Churn rate', value: '-2.4%' },
];

// Before's two callouts — bold label + " - " + the rest.
const beforeRows = [
  {
    label: 'Left nav problem',
    rest: '- When the user upgrades from the Simple plan (cheapest plan) or creates an account with the Plus plan, there is no onboarding or “introduction” to what this new plan can offer them',
  },
  {
    label: 'Getting started',
    rest: '- There’s a lot of information on the left, and it’s hard for a mom & pop shop to navigate what they need for their business.',
  },
];

// After's two callouts.
const afterRows = [
  {
    label: 'Feature Adoption Widget',
    rest: '- I created a widget on the top right corner to indicate that there are features to activate into and the progress of their feature setup',
  },
  {
    label: 'Feature Adoption Checklist',
    rest: '- I created a checklist page that showed our most used features. This checklist would take the user to their respective feature onboarding step.',
  },
];

// Design Process steps — three carry a bulleted list, the last is a single
// line of plain body copy (matches Figma exactly).
const processSteps: { step: string; items?: string[]; body?: string }[] = [
  {
    step: 'Define Problem',
    items: [
      'Identify the audience',
      'Audit current discovery flow',
      'Run a competitive audit on how other companies approach this problem',
    ],
  },
  {
    step: 'Define the MVP',
    items: ['Create MVP for design flow', 'Create design exploration'],
  },
  {
    step: 'Test the usability',
    items: [
      'Do users notice how to find the checklist?',
      'Is it easy for users to activate into each feature?',
      'Do users find the feature activation helpful?',
    ],
  },
  {
    step: 'Launch design',
    body: 'We then launched the experiment',
  },
];

/* ---- page ----------------------------------------------------------------- */

export default function CaseStudyPlanFeatureAdoption() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroBlur = useScrollBlur<HTMLElement>();

  // Above the fold — plays on mount, like the Home hero.
  const hero = createCascade(80);
  const heroTitle = 'Plan Feature Adoption';
  const heroEyebrow = 'Increasing feature adoption to reduce churn';
  const heroTitleStart = hero.next(heroTitle);
  const heroEyebrowStart = hero.next(heroEyebrow, { gap: 60 });
  const heroImageDelay = hero.peek();

  const context = useReveal<HTMLDivElement>();
  const overview = useReveal<HTMLDivElement>();
  const before = useReveal<HTMLDivElement>();
  const after = useReveal<HTMLDivElement>();
  const results = useReveal<HTMLDivElement>();
  const chart = useReveal<HTMLDivElement>();
  const process = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  const contextHead = createCascade(0);
  const contextEyebrowStart = contextHead.next('Context');
  const contextTitleStart = contextHead.next('Gusto’s Plan Feature Adoption Problem');
  const contextBody = createCascade(contextHead.peek(), { step: 14 });
  const contextP1 =
    'Users who use the Plus plan (middle plan) have a list of features that they can use; however, the majority of our users were only using 1-2 products out of the 20+ Plus plan features that Gusto provides. We believe that the lack of feature adoption is a discovery problem, and we also believe it’s causing users to either downgrade from their plan or churn from the platform completely.';
  const contextP1Start = contextBody.next(contextP1);
  const contextImageDelay = contextBody.peek();

  // Short reference lines (Role/Team/Duration).
  const roleCard = createCascade(0, { step: 30, gap: 60 });
  const teamRow1 = roleCard.next('Jordan Kong - PM');
  const teamRow2 = roleCard.next('Sarah Ang - CD');
  const teamRow3 = roleCard.next('Courtney B - UXR');

  const overviewCascade = createCascade(0);
  const overviewTitleStart = overviewCascade.next('Overview');
  const overviewCardsBase = overviewCascade.peek();

  const beforeHead = createCascade(0);
  const beforeEyebrowStart = beforeHead.next('Before');
  const beforeTitleStart = beforeHead.next('Existing Design');
  const beforeImageDelay = beforeHead.peek();
  const beforeBody = createCascade(0, { step: 14 });
  const beforeRowStarts = beforeRows.map((row, i) =>
    beforeBody.next(`${row.label} ${row.rest}`, i === 0 ? { gap: 80 } : { gap: 140 }),
  );

  const afterHead = createCascade(0);
  const afterEyebrowStart = afterHead.next('After');
  const afterTitleStart = afterHead.next('Launched Design');
  const afterVideoDelay = afterHead.peek();
  const afterIntro = 'What we created';
  const afterBody = createCascade(0, { step: 14 });
  const afterIntroStart = afterBody.next(afterIntro);
  const afterRowStarts = afterRows.map((row, i) =>
    afterBody.next(`${row.label} ${row.rest}`, i === 0 ? { gap: 80 } : { gap: 140 }),
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

  // Let's Chat video: no play button — autoplays once the user scrolls to the
  // CTA section, reusing the same reveal trigger as the rest of the section's
  // text rather than a second IntersectionObserver.
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
                src={assetUrl('/assets/pfa-hero.png')}
                alt="Gusto “Set up your account” screen showing the Feature Activation Checklist at 40% complete"
                aspect="aspect-[700/435]"
                radius="rounded-xl"
                topAnchored
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
              <div className="flex flex-col gap-8 lg:flex-1">
                <SectionHead
                  eyebrow="Context"
                  eyebrowStart={contextEyebrowStart}
                  title="Gusto’s Plan Feature Adoption Problem"
                  titleStart={contextTitleStart}
                  active={context.shown}
                />
                <p className="font-sans text-body-1 font-normal text-ink">
                  <Words text={contextP1} active={context.shown} start={contextP1Start} step={14} />
                </p>
                <div className="lg:max-w-[700px]">
                  <FramedImage
                    src={assetUrl('/assets/pfa-pricing-page.png')}
                    alt="Gusto “Choose a plan” screen showing Simple, Plus, and Premium plans"
                    aspect="aspect-[700/438]"
                    radius="rounded-xl"
                    topAnchored
                    active={context.shown}
                    delayMs={contextImageDelay}
                  />
                </div>
              </div>

              {/* right — role card, offset 100px to line up with body copy */}
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
                        <Words text="Courtney B - UXR" active={context.shown} start={teamRow3} />
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
                        text="Build - 1 month"
                        active={context.shown}
                        start={roleCard.next('Build - 1 month')}
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
                        text="Status - 🚀 Launched 2023"
                        active={context.shown}
                        start={roleCard.next('Status - 🚀 Launched 2023')}
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
            <div className="mt-3 flex flex-col gap-4 md:flex-row">
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
                <FramedImage
                  src={assetUrl('/assets/pfa-existing-design.png')}
                  alt="Gusto homepage — “Good morning, Ella” with Things to do list"
                  aspect="aspect-[700/438]"
                  radius="rounded-xl"
                  topAnchored
                  active={before.shown}
                  delayMs={beforeImageDelay}
                />
              </div>
              <div className="flex flex-col gap-3 font-sans text-body-1 font-normal text-ink lg:flex-1">
                {beforeRows.map((row, i) => (
                  <p key={row.label}>
                    <Words
                      runs={[
                        { text: row.label, className: 'font-bold' },
                        { text: ` ${row.rest}` },
                      ]}
                      active={before.shown}
                      start={beforeRowStarts[i]}
                      step={14}
                    />
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
                  src={assetUrl('/assets/pfa-after.mp4')}
                  ariaLabel="Plan Feature Adoption — launched design walkthrough"
                  active={after.shown}
                  delayMs={afterVideoDelay}
                />
              </div>
              <div className="flex flex-col gap-3 font-sans text-body-1 font-normal text-ink lg:flex-1">
                <p>
                  <Words text={afterIntro} active={after.shown} start={afterIntroStart} step={14} />
                </p>
                {afterRows.map((row, i) => (
                  <p key={row.label}>
                    <Words
                      runs={[
                        { text: row.label, className: 'font-bold' },
                        { text: ` ${row.rest}` },
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

        {/* ---------- Outcome (2 stat cards) ---------- */}
        <section className="w-full bg-canvas">
          <div ref={results.ref} className="mx-auto max-w-content px-6 py-10 md:px-8 md:py-10">
            <SectionHead
              eyebrow="Outcome"
              eyebrowStart={resultsEyebrowStart}
              title="Experiment Results"
              titleStart={resultsTitleStart}
              active={results.shown}
            />
            <div className="mt-3 flex flex-col gap-4 md:flex-row">
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

        {/* ---------- Results Chart (full-width bar chart) ---------- */}
        <section className="w-full bg-surface-card">
          <div ref={chart.ref} className="mx-auto max-w-content px-6 py-10 md:px-8">
            <img
              src={assetUrl('/assets/pfa-results-chart.png')}
              alt="Bar chart — New Features Adopted, Experiment: Feature activation (all features), control vs. variation across time_tracking, next-day payroll, medical, pto_policy, retirement, custom_docs, and admin_permissions"
              loading="lazy"
              className={[
                'block w-full rounded-xl',
                chart.shown ? 'animate-fade-up' : 'opacity-0',
              ].join(' ')}
            />
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
                  <div
                    key={s.step}
                    className="flex h-full flex-col gap-4 rounded-md border border-[rgba(0,0,0,0.1)] bg-canvas p-4"
                  >
                    <p className="font-sans text-eyebrow-md font-bold uppercase text-ink">
                      <Words text={s.step} active={process.shown} start={processStart + i * 90} />
                    </p>
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
            {/* Same shared "Let's Chat" clip as the other case studies' CTAs —
                Figma reuses this exact video across case studies. No play
                button — it just autoplays + loops once the section scrolls
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
      <NextProjectFloat nextHref="#/case/messaging" />
    </div>
  );
}
