const { theme } = require('./src/design-tokens.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Only apply hover: styles on devices that actually support hover, so touch
  // taps don't trigger the card-lift (which would otherwise stick after a tap).
  future: { hoverOnlyWhenSupported: true },
  theme: {
    // Replace Tailwind's defaults with the Figma system so only design-token
    // classes are available (bg-canvas, text-ink, text-hero, rounded-card, ...).
    colors: theme.colors,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    borderRadius: theme.borderRadius,
    extend: {
      spacing: theme.spacing,
      maxWidth: {
        frame: '1440px', //  desktop artboard width
        content: '1376px', //  1440 - 32px gutters
      },
      boxShadow: {
        // Soft blue-tinted card glow used on banner / case-study containers
        card: '0 0 20px rgba(8,105,225,0.2)',
      },
      keyframes: {
        // Non-text entrances (images, whole blocks) — same rise + fade as
        // word-reveal below, just without the per-word stagger.
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // The site's one text reveal (Hero, section headers, case-study
        // cards): each word rises up from below and fades in, with a small
        // blur that clears, staggered in reading order.
        'word-reveal': {
          '0%': { opacity: '0', filter: 'blur(3px)', transform: 'translateY(0.3em)' },
          '55%': { filter: 'blur(0)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
      },
      animation: {
        // Both share --ease-out and the same 0.6s duration — one motion
        // system, not two competing ones.
        'fade-up': 'fade-up 0.6s var(--ease-out) both',
        'word-reveal': 'word-reveal 0.6s var(--ease-out) both',
      },
    },
  },
  plugins: [],
};
