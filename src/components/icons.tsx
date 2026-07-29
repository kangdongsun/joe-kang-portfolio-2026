/**
 * Icons exported directly from the Figma FOUNDATIONS pages (Logo / Social Icon).
 * Inlined as SVG so they inherit `currentColor` and stay crisp at any size,
 * rather than shipping remote <img> assets that expire.
 */

type IconProps = { className?: string };

// Logo mark ("Union") — 30.1 x 32 artwork centered in a 32px box
export function Logo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 30.1073 32.0005" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.5887 0C14.3214 7.84365e-05 14.9158 0.594406 14.9158 1.32715V7.46875L22.952 0L25.2332 2.4541C25.7193 2.97742 25.689 3.7959 25.1658 4.28223L19.7127 9.34961L23.6834 18.4434H28.8358C29.5381 18.4434 30.1073 19.0125 30.1073 19.7148V23.0869H25.7108L25.7137 23.0938H21.6336C21.1098 23.0936 20.6348 22.7852 20.4217 22.3066L16.1375 12.6855L14.9158 13.8135V21.7588H14.9139V24.5332C14.9136 30.2182 8.80549 33.8122 3.83577 31.0518C-0.602522 28.586 -1.33189 22.502 2.39729 19.0566L10.2713 11.7812V4.64355H4.90901C4.20666 4.64355 3.63753 4.07443 3.63753 3.37207V0H13.5887ZM5.54866 22.4678C4.14213 23.7674 4.41757 26.0622 6.09163 26.9922C7.96596 28.0326 10.269 26.6771 10.2694 24.5332V20.0215H10.2713V18.1035L5.54866 22.4678Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Hamburger / menu — 18 x 12.75 (three rounded bars), used in the mobile header
export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 12.75" fill="none" className={className} aria-hidden="true">
      <path
        d="M0 1.125C0 0.50368 0.50368 0 1.125 0H16.875C17.4963 0 18 0.50368 18 1.125C18 1.74632 17.4963 2.25 16.875 2.25H1.125C0.50368 2.25 0 1.74632 0 1.125Z"
        fill="currentColor"
      />
      <path
        d="M0 6.375C0 5.75368 0.50368 5.25 1.125 5.25H16.875C17.4963 5.25 18 5.75368 18 6.375C18 6.99632 17.4963 7.5 16.875 7.5H1.125C0.50368 7.5 0 6.99632 0 6.375Z"
        fill="currentColor"
      />
      <path
        d="M1.125 10.5C0.50368 10.5 0 11.0037 0 11.625C0 12.2463 0.50368 12.75 1.125 12.75H16.875C17.4963 12.75 18 12.2463 18 11.625C18 11.0037 17.4963 10.5 16.875 10.5H1.125Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Close (×) — the mobile menu button's open state. Drawn at 18 x 18 with the
// same 2.25 stroke + round caps as MenuIcon's bars so the two swap cleanly.
export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 2L16 16M16 2L2 16"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Mail / email — 24 x 20 glyph
export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 20" fill="none" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3.33333C0 1.49238 1.43269 0 3.2 0H20.8C22.5673 0 24 1.49238 24 3.33333V16.6667C24 18.5076 22.5673 20 20.8 20H3.2C1.43269 20 0 18.5076 0 16.6667V3.33333ZM3.2 2.5H20.8C21.2418 2.5 21.6 2.8731 21.6 3.33333V4.92946L12.9923 10.0531C12.3774 10.4191 11.6226 10.4191 11.0077 10.0531L2.4 4.92945V3.33333C2.4 2.8731 2.75817 2.5 3.2 2.5ZM2.4 7.80883V16.6667C2.4 17.1269 2.75817 17.5 3.2 17.5H20.8C21.2418 17.5 21.6 17.1269 21.6 16.6667V7.80884L14.183 12.2237C12.8303 13.0289 11.1697 13.0289 9.81699 12.2237L2.4 7.80883Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Play — solid triangle, 24 x 24
export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 5.5v13a1 1 0 0 0 1.523.852l10.5-6.5a1 1 0 0 0 0-1.704l-10.5-6.5A1 1 0 0 0 7 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Pause — two solid bars, 24 x 24
export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

// Seek back 5s — counter-clockwise ring arrow, 24 x 24
export function SeekBackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5V1L6.5 6L12 11V7c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6H4c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Seek forward 5s — clockwise ring arrow, 24 x 24
export function SeekForwardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 5V1l5.5 5-5.5 5V7c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6h2c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Home — solid roof-and-door glyph, 24 x 24 (Back Home float; Portfolio 2026/Hero/Home_Icon.svg)
export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.75 19.7561V9.53626C19.75 9.29846 19.6372 9.07475 19.4461 8.93332L11.9461 3.38485C11.681 3.18877 11.319 3.18877 11.0539 3.38485L3.55395 8.93332C3.36277 9.07475 3.25 9.29846 3.25 9.53626V19.7561H7.63462V14.6132C7.63462 13.1635 8.80987 11.9882 10.2596 11.9882H12.7404C14.1901 11.9882 15.3654 13.1635 15.3654 14.6132V19.7561H19.75ZM2.21579 7.1245C1.4511 7.69022 1 8.58506 1 9.53626V20.5061C1 21.3345 1.67157 22.0061 2.5 22.0061H8.38462C9.21304 22.0061 9.88462 21.3345 9.88462 20.5061V14.6132C9.88462 14.4061 10.0525 14.2382 10.2596 14.2382H12.7404C12.9475 14.2382 13.1154 14.4061 13.1154 14.6132V20.5061C13.1154 21.3345 13.787 22.0061 14.6154 22.0061H20.5C21.3284 22.0061 22 21.3345 22 20.5061V9.53626C22 8.58506 21.5489 7.69022 20.7842 7.1245L13.2842 1.57603C12.224 0.791713 10.776 0.791713 9.71579 1.57603L2.21579 7.1245Z"
        fill="currentColor"
      />
    </svg>
  );
}


// LinkedIn — 20 x 20 glyph
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8307 8.98226V8.95303C10.8247 8.96283 10.8164 8.97264 10.8113 8.98226H10.8307Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.33333 0C1.49238 0 0 1.49238 0 3.33333V16.6667C0 18.5076 1.49238 20 3.33333 20H16.6667C18.5076 20 20 18.5076 20 16.6667V3.33333C20 1.49238 18.5076 0 16.6667 0H3.33333ZM6.22075 16.6155H3.25345V7.68818H6.22075V16.6155ZM4.7371 6.46971H4.71749C3.72211 6.46971 3.07692 5.78396 3.07692 4.92681C3.07692 4.05086 3.74097 3.38453 4.75653 3.38453C5.77231 3.38453 6.39653 4.05086 6.41596 4.92681C6.41596 5.78396 5.77231 6.46971 4.7371 6.46971ZM16.9231 16.6155H13.955V11.8393C13.955 10.6397 13.5262 9.82088 12.4519 9.82088C11.6315 9.82088 11.144 10.3722 10.9292 10.9063C10.8512 11.0971 10.8308 11.3622 10.8308 11.6298V16.6155H7.86211C7.86211 16.6155 7.90189 8.52571 7.86211 7.68822H10.8308V8.95323C11.2252 8.34633 11.9291 7.47864 13.5058 7.47864C15.459 7.47864 16.9231 8.75424 16.9231 11.4961V16.6155Z"
        fill="currentColor"
      />
    </svg>
  );
}
