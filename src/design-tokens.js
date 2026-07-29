/**
 * Design tokens pulled directly from the Figma file
 * "Joe Kang Portfolio 2026" (page "↳ 🚀 Final Design").
 *
 * This is the single source of truth for the Tailwind theme. It is imported
 * by tailwind.config.js (the real build) AND inlined into public/preview.html
 * (the zero-build preview) so both render from identical values.
 *
 * Nothing here is eyeballed — every value comes from get_design_context /
 * get_variable_defs on the Figma nodes, or the file's published text styles.
 */

const colors = {
  // Text (Salt ramp)
  ink: '#3e3e3e', //  Salt 100 — headlines, names, primary body
  body: '#494949', //  Salt 80  — secondary emphasis, card copy
  muted: '#777777', //  Salt 60  — unselected nav
  'muted-soft': '#a4a4a4', //  Salt 40  — About block caps text
  hairline: '#d2d2d2',
  'hairline-soft': '#e8e8e8',

  // Surfaces
  canvas: '#f8ede0', //  warm cream page floor (everywhere)
  'canvas-strong': '#ebd7bd', //  deeper tan
  'surface-neutral': '#faf6f2',
  'surface-card': '#ffffff', //  glass inner panel only, never the page
  espresso: '#26211d', //  dark warm panel — About scroll-to-white section
  'on-dark': '#ffffff', //  white type on the espresso panel

  // Brand / case-study accents
  'accent-sky': '#29aaee', //  Meta glow
  'accent-persimmon': '#f45d48', //  Gusto glow + tagline accent ("mindful design")
  'accent-error': '#ac3f3f', //  Expedia/Hotwire glow
  'accent-ube': '#9c3fac',
  'accent-matcha': '#3fac91', //  metric highlights (+$95K/day, +6.5%)

  // Semantic
  success: '#3fac91',
  warning: '#d3b153',
  error: '#ac3f3f',
};

// fontSize: [size, { lineHeight, letterSpacing }]
const fontSize = {
  hero: ['96px', { lineHeight: '112px', letterSpacing: '-3.84px' }], //  -4%
  h1: ['72px', { lineHeight: '88px', letterSpacing: '-2.88px' }], //  -4%
  h2: ['60px', { lineHeight: '72px', letterSpacing: '-2.4px' }], //  -4%
  h3: ['48px', { lineHeight: '64px', letterSpacing: '-1.92px' }], //  -4%
  h4: ['36px', { lineHeight: '48px', letterSpacing: '-1.44px' }], //  -4%
  h5: ['24px', { lineHeight: '32px', letterSpacing: '0px' }],
  'body-1': ['20px', { lineHeight: '28px', letterSpacing: '0px' }],
  'body-2': ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
  'body-3': ['14px', { lineHeight: '20px', letterSpacing: '0px' }],
  'body-4': ['12px', { lineHeight: '16px', letterSpacing: '0px' }],
  // Eyebrows are Cabin Bold, uppercase, +10 tracking (letterSpacing scales with size)
  'eyebrow-lg': ['24px', { lineHeight: '32px', letterSpacing: '2.4px' }],
  'eyebrow-md': ['16px', { lineHeight: '24px', letterSpacing: '1.6px' }],
  'eyebrow-sm': ['12px', { lineHeight: '16px', letterSpacing: '1.2px' }],
};

const borderRadius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  card: '40px', //  signature soft case-study / banner card
  full: '9999px',
};

// 4px base spacing scale from the file
const spacing = {
  0: '0px', 0.5: '2px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
  5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px',
  20: '80px', 24: '96px', 32: '128px', 60: '240px',
};

const theme = {
  colors,
  fontFamily: {
    sans: ['Cabin', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    // Nothing uses font-serif — the tagline dropped its serif accent word and
    // is now Cabin Italic. Sedan is no longer downloaded, so this falls back to
    // Georgia if anything ever reaches for it.
    serif: ['Georgia', 'serif'],
  },
  fontSize,
  borderRadius,
  spacing,
};

// Support both CommonJS (tailwind.config.js) and browser <script> (preview.html)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { theme, colors, fontSize, borderRadius, spacing };
}
if (typeof window !== 'undefined') {
  window.__DESIGN_TOKENS__ = { theme, colors, fontSize, borderRadius, spacing };
}
