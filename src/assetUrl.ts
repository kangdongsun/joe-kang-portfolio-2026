/**
 * Prefixes a `public/`-folder asset path with Vite's configured base
 * (`import.meta.env.BASE_URL`) — `/` in dev, `/joe-kang-portfolio-2026/` in
 * the deployed GitHub Pages build (see `base` in vite.config.ts).
 *
 * A hardcoded `/assets/...` string ignores that subpath: the browser
 * resolves it against the domain root, not the app's root, so it 404s once
 * deployed even though the exact same string works locally (where the app
 * *is* served from the root). This was why every image/video on the live
 * site broke on first deploy — every asset reference must go through this.
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
