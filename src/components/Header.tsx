import { useState } from 'react';
import { Logo, LinkedInIcon, MenuIcon, CloseIcon } from './icons';
import { useHashRoute } from './useHashRoute';

/**
 * Header — Desktop (Figma component 97:496) + Mobile (2044:5835).
 * Transparent bar floating over the hero. Logo at the left.
 *  · lg+  : pill nav (Projects / About / Contact) + LinkedIn pushed right.
 *  · <lg  : a hamburger (Figma mobile only shows the icon); tapping it opens a
 *           dropdown with the same nav + socials. The open-menu panel itself is
 *           not in the Figma file — see notes to reviewer.
 *
 * Selected menu item = 10%-black wash (overlay-selected) + ink text.
 *
 * Which item reads as selected follows the route: the About page highlights
 * About, everything else highlights Projects — matching Figma, where the Home
 * frame and all three case-study frames all show Projects selected. Contact
 * is a mailto link, not a route, so it never takes the selected state.
 *
 * Figma dropped the separate mail icon from this header in favor of the
 * "Contact" text item doing that job, so LinkedIn is the only icon left here.
 */

const pages = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#/about' },
];

const CONTACT_HREF = 'mailto:kangdongsun@gmail.com';

// Unselected-nav-item styling — shared by the page links and the plain
// Contact/LinkedIn items so all of them fade from Salt 60 to Salt 100 on
// hover the same way, rather than each having its own hover treatment.
const unselectedItem = 'text-muted transition-colors duration-200 hover:text-ink';

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex size-10 items-center justify-center rounded-full ${unselectedItem}`}
    >
      {children}
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const hash = useHashRoute();
  const isSelected = (href: string) =>
    href === '#/about' ? hash.startsWith('#/about') : !hash.startsWith('#/about');

  return (
    // When the mobile menu is open the frost moves onto the <header> itself
    // and the panel below becomes a plain in-flow child, so the bar and the
    // rows are a single frosted surface. Two stacked elements each running
    // their own backdrop-filter would each sample their own backdrop and draw
    // a visible seam at the join. The lg: resets cover the case where the menu
    // was opened on mobile and the viewport is then widened past the
    // breakpoint — `bg-transparent` isn't available (the theme replaces the
    // colour palette wholesale), hence the raw rgba.
    <header
      className={[
        'absolute inset-x-0 top-0 z-20',
        open
          ? 'bg-canvas/60 backdrop-blur-2xl lg:bg-[rgba(0,0,0,0)] lg:backdrop-blur-none'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 16px gutters on mobile (Figma "Header / Mobile" 2044:5835), 40px from
          md up (Figma desktop header). It was a flat 40px, which on a 375px
          screen ate 21% of the width. The bar floats over the hero rather than
          sitting in the content column, so it tracks the frame edge rather
          than the 24px body gutter. */}
      <div className="mx-auto flex w-full max-w-frame items-center gap-2.5 px-4 py-4 md:px-10">
        <a href="#home" aria-label="Joe Kang — home" className="flex items-center">
          <Logo className="h-8 w-[30px] text-ink" />
        </a>

        {/* Desktop nav — pill + LinkedIn (lg+) */}
        <nav className="hidden flex-1 items-center justify-end lg:flex">
          <div className="flex items-center gap-2 rounded-full px-8 py-1">
            {pages.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-current={isSelected(item.href) ? 'page' : undefined}
                className={[
                  'rounded-sm px-4 py-2 font-sans text-body-2 font-semibold',
                  isSelected(item.href)
                    ? 'bg-[rgba(0,0,0,0.1)] text-ink transition-colors duration-200'
                    : unselectedItem,
                ].join(' ')}
              >
                {item.label}
              </a>
            ))}
            <a href={CONTACT_HREF} className={`rounded-sm px-4 py-2 font-sans text-body-2 font-semibold ${unselectedItem}`}>
              Contact
            </a>

            <SocialButton href="https://www.linkedin.com/in/joe-kang/" label="Joe Kang on LinkedIn">
              <LinkedInIcon className="size-[22px]" />
            </SocialButton>
          </div>
        </nav>

        {/* Mobile — hamburger, becoming × once open (below lg) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          // 44px hit area (the icon itself stays 18px); the negative right
          // margin absorbs the extra width so the glyph sits exactly where a
          // size-6 button put it. size-6 was a 24px target — the bare WCAG
          // 2.5.8 minimum, and well under the 44px everyone actually uses.
          className="-mr-2.5 ml-auto flex size-11 items-center justify-center text-ink lg:hidden"
        >
          {open ? <CloseIcon className="w-[18px]" /> : <MenuIcon className="w-[18px]" />}
        </button>
      </div>

      {/* Mobile dropdown — Figma ".menu item" (2490:7805). Full-bleed rows
          rather than the floating rounded card this used to be: each row is
          the full 390px width, 64px tall, with centred Body 2 *regular* (not
          semibold) copy. Selected takes a 10% black wash and goes to pure
          black; the rest sit at Salt 100. The row carries a transparent
          bottom border in the component, so the divider slot exists without
          drawing anything — kept as-is rather than inventing a rule Figma
          doesn't show.

          The frost lives on the <header> above (so the bar and these rows are
          one continuous surface) — this panel is a plain in-flow child and
          paints no background of its own. The selected row's 10%-black wash
          then reads as a wash on top of that shared frost.

          LinkedIn is a spelled-out row here rather than the desktop's icon
          button — on mobile it's one of four equal destinations, so it takes
          the same 64px row treatment as the rest. */}
      {open && (
        <div className="lg:hidden">
          <nav className="flex flex-col">
            {pages.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isSelected(item.href) ? 'page' : undefined}
                className={[
                  'flex h-16 items-center justify-center border-b border-[rgba(0,0,0,0)] px-4 py-2',
                  'font-sans text-body-2 font-normal transition-colors duration-200',
                  isSelected(item.href)
                    ? 'bg-[rgba(0,0,0,0.1)] text-[#000000]'
                    : 'text-ink hover:bg-[rgba(0,0,0,0.04)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            ))}
            <a
              href={CONTACT_HREF}
              onClick={() => setOpen(false)}
              className="flex h-16 items-center justify-center border-b border-[rgba(0,0,0,0)] px-4 py-2 font-sans text-body-2 font-normal text-ink transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)]"
            >
              Contact
            </a>
            <a
              href="https://www.linkedin.com/in/joe-kang/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex h-16 items-center justify-center border-b border-[rgba(0,0,0,0)] px-4 py-2 font-sans text-body-2 font-normal text-ink transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)]"
            >
              Linkedin
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
