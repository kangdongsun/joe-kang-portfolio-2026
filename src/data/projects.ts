/**
 * Case-study content, matching the Figma "Card" component variants
 * (Property 1 = Meta / Gusto). Copy is verbatim from the design.
 *
 * `accent` is the per-company brand glow the design system assigns to each
 * card (Meta = sky, Gusto = persimmon). `highlights` are the phrases the
 * design renders in matcha-green inside the description.
 */

export type ProjectAccent = 'sky' | 'persimmon' | 'error';

export interface Project {
  id: string;
  eyebrow: string;
  title: string;
  /** Description split into runs; `highlight: true` renders in matcha-green. */
  description: { text: string; highlight?: boolean }[];
  image: string;
  imageAlt: string;
  accent: ProjectAccent;
  /** Case-study route (hash) — makes the card a link when present. */
  href?: string;
}

export const projects: Project[] = [
  {
    id: 'meta',
    eyebrow: 'Meta',
    title: 'Messaging Multi-Destination Adoption',
    description: [
      {
        text: 'Increased feature adoption through product education and simplifying the UI. This specific project led to ',
      },
      { text: '+$98K/day', highlight: true },
      { text: ' and ' },
      { text: '+8%', highlight: true },
      { text: ' in Product Adoption' },
    ],
    image: '/assets/meta-card.png',
    imageAlt:
      'Meta Ads Manager campaign screen showing message-destination settings and a campaign score of 100',
    accent: 'sky',
    href: '#/case/messaging',
  },
  {
    id: 'gusto',
    eyebrow: 'Gusto',
    title: 'A La Carte Pricing Plan',
    description: [
      {
        text: 'With a 3 pricing plan model, introduce an “A La Carte” plan that allows users on the cheapest plan to add product feature as an add-on. This project increased ARR by ',
      },
      { text: '+6.5%', highlight: true },
    ],
    image: '/assets/gusto-card.png',
    imageAlt: 'Gusto plans and pricing screen showing featured add-ons in an add-on store',
    accent: 'persimmon',
    href: '#/case/a-la-carte',
  },
  {
    id: 'gusto-feature-activation',
    eyebrow: 'Gusto',
    title: 'Plan Feature Adoption',
    description: [
      {
        text: 'Users on the middle plan were churning because they weren’t using all the features that the plan offered. Introduced the Feature Activation Checklist to reduce churn that resulted in ',
      },
      { text: '+8.4%', highlight: true },
      { text: ' in new feature adoption and ' },
      { text: '-2.4%', highlight: true },
      { text: ' in churn rate' },
    ],
    image: '/assets/gusto-feature-card.png',
    imageAlt: 'Gusto "Set up your account" screen showing the Feature Activation Checklist at 40% complete',
    accent: 'persimmon',
    href: '#/case/plan-feature-adoption',
  },
];
