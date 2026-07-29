# Joe Kang — Portfolio 2026

Implementation of the **Home** page from the Figma file
[Joe Kang Portfolio 2026](https://www.figma.com/design/eMY8DtD0UWzrVmHbCuOzeE/Joe-Kang-Portfolio-2026?node-id=2023-5428)
(page "↳ 🚀 Final Design").

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS v3**, with the Figma design system encoded as the Tailwind
  theme in [`src/design-tokens.js`](src/design-tokens.js) — colors, the 10-step
  Cabin type ramp, radii, and the 4px spacing scale all come straight from
  `get_design_context` / the file's published styles, not eyeballing.
- Fonts: **Cabin** (all weights), loaded from Google Fonts. (A **Sedan** serif
  token still exists in `design-tokens.js` but is currently unused — the
  tagline's serif accent word was dropped in a later design update.)

There was no pre-existing web codebase to reuse — only the `../Portfolio 2026/`
assets and a `design.md` token analysis — so tokens are defined fresh here in
`design-tokens.js` as the single source of truth.

## Run it

```bash
cd portfolio-site
npm install
npm run dev
```

> ℹ️ This machine has no Node/npm installed, so the Vite app couldn't be built
> or run here. For review, a **zero-build preview** was verified instead:
> `public/preview.html` renders the exact same components, classes, and tokens
> via the Tailwind Play CDN + React UMD + Babel. Open it with any static server:
>
> ```bash
> cd portfolio-site/public && python3 -m http.server 4599
> # then open http://localhost:4599/preview.html
> ```
>
> `preview.html` is a **review harness only** — the real app is `src/`. Once
> Node is available, run the Vite commands above.

## Structure (components match the Figma frame/section names)

```
src/
  App.tsx                  Home — composes the page
  components/
    Preloader.tsx          Pre-loader — logo + progress bar, curtain-lifts on load
    Header.tsx             Header — desktop pill nav · mobile hamburger
    Hero.tsx               Hero — desktop overlay · mobile character-on-top
    SelectedProjects.tsx   "Selected Projects" section
    ProjectCard.tsx        Card component (Meta / Gusto variants)
    About.tsx              "Hey there!" intro block
    Footer.tsx             Footer
    icons.tsx              Logo / Mail / LinkedIn (exported from Figma)
    useReveal.ts           scroll-reveal hook
  data/projects.ts         case-study copy + per-brand accent
  design-tokens.js         the Figma design system as the Tailwind theme
```

## Responsive

Both Figma artboards were implemented exactly — **Desktop (1440)** and
**Mobile (390)** — with the switch at Tailwind's `lg` (1024px); tablet
(≥768) uses the mobile composition scaled up. Per the Figma mobile frame:

- **Header** — desktop = logo · nav pill · socials; mobile (<lg) = logo ·
  hamburger. Tapping the hamburger opens a dropdown (nav + socials); the *open*
  panel isn't in the file (see notes).
- **Hero** — desktop overlays the bio on the full-bleed video; mobile stacks
  the character on top (portrait crop of the same video, dissolving to canvas)
  with the bio **centred below** it (name H2/60px) and **no tagline** (the
  mobile frame has none).
- **Selected Projects** — desktop cards are a two-column media/content split
  (Meta → Gusto); mobile stacks them vertically (media on top) and, matching the
  Figma mobile frame, **reverses the order to Gusto → Meta**. Type steps down
  per the file (title 36→20px, eyebrow 16→12px, section head 48→24px).
- **About** — 24px → 16px; **backdrop** — `.hero-bg` is flat cream on
  mobile/tablet and the video-matched tan gradient on desktop.

## Motion / interactions

The Figma file has **no keyframe or Smart-Animate data** (`get_motion_context`
returned empty). The only interaction defined is the case-study card **Hover**
variant ("elevated / media plays"). Implemented:

- **Pre-loader** (Figma "Web / 1440 / Pre Loader" 2207:17600 + "Mobile / 390 /
  Pre Loader" 2207:17613, same layout on both — plain flex-centering, no
  breakpoint code needed): the logo mark scale+fades in, "Joe Kang" follows,
  then a 200px track fills — mirroring the reference "Preload Sample" clip's
  motion. The bar always eases toward 85% over a ~1.9s floor (never a
  jump-cut, even when the page had already finished loading before the
  component mounted — the common case for a small site) and only completes
  once that floor has elapsed **and** the page has actually finished loading.
  It then holds briefly and the whole panel lifts away like a curtain
  (`translateY(-100%)`, `650ms`) to reveal the page underneath, which is
  mounted the entire time — the lift just uncovers it. Runs once per browser
  session (an in-app hash-route change to a case study isn't a fresh page
  load, so it doesn't replay); body scroll is locked while it's up.
- **Hero starts the instant the curtain lifts — not once it's gone.**
  `Preloader` fires two separate callbacks: `onLiftStart` the moment the
  curtain *begins* lifting, `onDone` ~650ms later once that lift transition
  has actually finished (only used to unmount the Preloader / restore body
  scroll). `App` maps these to two states — `ready` from `onLiftStart`,
  `preloading` from `onDone` — so Hero's video and text reveal start
  immediately as the curtain begins clearing, rather than sitting frozen for
  the entire lift. (The Hero mounts hidden behind the preloader the whole
  time, so the lift reveals real content with no pop-in — but that same
  reason is why the video/reveal can't just start on mount: they'd already be
  finished by the time the user sees anything.) `Hero` takes a `ready` prop:
  both `<video>`s start with no `autoPlay`, only calling `.play()` once
  `ready`; every `Words` call passes `active={ready}` so the text sits in its
  pre-reveal state until then.
- Hero background **video** autoplays (muted, `playsInline`); it plays once,
  holds on the last frame ~3s, then replays.
- **One text reveal, everywhere** — the Hero copy, the "Selected Projects"
  section header, and the case-study cards (eyebrow/title/description) all
  share the same `Words` component (`components/Words.tsx`): each word rises
  up from below (`translateY(0.3em)→0`) and fades in, with a `blur(3px)→0`
  that clears, `0.6s` per word, staggered in reading order. Hero plays on
  mount (above the fold); the section header and cards are gated by
  `useReveal` (`active={shown}`) so they play once when scrolled into view.
  `runs` lets a styled phrase (the tagline's persimmon "mindful design", a
  card's matcha metric) continue the same stagger sequence instead of
  breaking into a separately-timed span. The card description tunes its
  stagger step down
  (`18ms` vs the default `55ms`) since it runs far more words than a hero
  line — same animation, timed to the amount of text.
- Every reveal — word-by-word text, the section-header block, the card image
  fade-up, the card hover — now shares **one easing token**, `--ease-out:
  cubic-bezier(0.16,1,0.3,1)` (`index.css`), and text/image reveals share one
  duration (`0.6s`). Previously the Hero used a hand-picked curve different
  from everything else; unifying it is what makes the motion read as one
  system instead of several competing ones.
- Card **hover** (desktop, from the Figma prototype) → the card background tints
  to its brand colour (**Meta `#DCE3E9`**, **Gusto `#F6D6C7`**) from the cream
  `#F8EDE0` default, and the framed device screenshot **lifts** (`translateY`)
  as its `drop-shadow` deepens. `0.3s` on the same `--ease-out`; gated to
  hover-capable pointers (`hoverOnlyWhenSupported`). The device images are
  transparent-background PNGs so the shadow is CSS `drop-shadow` (follows the
  device silhouette).
- **About "Hey there!"** → a scroll-pinned reveal: the section is a tall track
  with a sticky panel on the page's cream `#F8EDE0`; the intro fills
  word-by-word from dim → **ink** as you scroll and stays anchored until every
  word is filled, then releases. (An earlier pass used a dark espresso panel
  with a fill to white for contrast; removed per Joe's direction so the
  section matches the rest of the page.)
- All motion collapses to a plain, motionless end-state under
  `prefers-reduced-motion`.

## Notes to reviewer (design decisions)

1. **Tagline accent.** The hero tagline reads "Driving growth through trust.
   Building trust through **mindful design**" — "mindful design" set in Cabin
   SemiBold, persimmon `#f45d48` (updated from an earlier Figma pass where the
   accent word was "great" in the Sedan serif — that pass is gone from the
   file, so the serif token in `design-tokens.js` is currently unused).
2. **Social links.** ✅ Email → `kangdongsun@gmail.com`, LinkedIn →
   `https://www.linkedin.com/in/joe-kang/`. `Projects` / `Resume` nav
   destinations are still placeholders (`#projects` / `#resume`) — TBD.
3. **Metric highlight color.** Metric highlights (`+$95K/day`, `+8%`,
   `+6.5%`) use **Matcha 100 `#3fac91`** consistently across every card
   (`accent-matcha`), matching the Figma file. (An earlier pass used a
   per-card brand color — Meta blue / Gusto orange — per a since-reversed
   request; reverted to matcha per Joe's direction.) The blurred accent glow
   behind each device still uses the per-card brand color and is unaffected.
4. **Card hover "media plays".** The source cards play a screen-recording video
   on hover; the supplied card assets are static framed screenshots, so hover
   zooms the screenshot instead. Swap in the recordings if you have them.
5. **Footer typo.** The Figma copy reads "All Rights Reserverd" — corrected to
   "Reserved" here.
6. **Card media not clipped.** Figma clips the device inside a rounded frame;
   the exported PNGs already include the bezel + shadow, so they're shown whole
   (contained) rather than re-clipped.
7. **Mobile card order is reversed** (Gusto → Meta) — this is what the Figma
   mobile frame specifies, opposite to desktop (Meta → Gusto). Reproduced
   faithfully via `flex-col-reverse`; flag if that was unintentional in the file.
8. **Mobile menu panel is an addition.** The Figma mobile header only shows the
   hamburger icon (no open state). The dropdown it opens (nav + socials) was
   designed here to keep the icon functional.
9. **Mobile hero uses the same video** (portrait-cropped) rather than the
   separate still-image asset in the Figma mobile frame — the crop is visually
   identical to that render and avoids shipping a second large asset.
```
