/**
 * GoatCounter (joekang.goatcounter.com).
 *
 * `count.js` is loaded async from index.html with `no_onload` set. The site
 * routes on the hash, and GoatCounter's own auto-count fires once on load and
 * never again — every route after the first would go unrecorded. App counts
 * each route itself instead, the first one included.
 *
 * Two things this module handles that a bare `goatcounter.count()` would not:
 *
 *  · count.js is async, so calls made before it lands are queued and flushed
 *    on its load event. If it never lands — ad blocker, offline, the service
 *    down — the queue is simply dropped. Analytics is best-effort and must
 *    never throw into the render path.
 *  · a repeat of the path just counted is skipped, which absorbs StrictMode's
 *    double-invoked effects in dev (and any second caller added later).
 */

type Hit = { path: string; title?: string; event?: boolean };
type GoatCounter = { count?: (hit: Hit) => void };

/** Matches the `id` on the count.js tag in index.html. */
const SCRIPT_ID = 'goatcounter';

const pending: Hit[] = [];
let lastPath = '';

function api(): GoatCounter | undefined {
  return typeof window === 'undefined'
    ? undefined
    : (window as { goatcounter?: GoatCounter }).goatcounter;
}

function flush() {
  const gc = api();
  if (!gc?.count) return;
  while (pending.length) {
    try {
      gc.count(pending.shift()!);
    } catch {
      // A failed metric is not worth breaking a page over.
    }
  }
}

function send(hit: Hit) {
  pending.push(hit);
  if (api()?.count) {
    flush();
    return;
  }
  // Identical (type, listener, capture) triples are de-duplicated by the DOM,
  // so queueing N hits before load still registers exactly one listener.
  document.getElementById(SCRIPT_ID)?.addEventListener('load', flush, { once: true });
}

/**
 * Count the current route. The hash is included deliberately — here it *is*
 * the route (`#/about`, `#/case/alacarte`), and without it every page on the
 * site collapses into a single entry.
 */
export function trackPageview() {
  const path = location.pathname + location.search + location.hash;
  if (path === lastPath) return;
  lastPath = path;
  send({ path });
}

/** GoatCounter models events as hits with `event: true`, where `path` is the
 *  event name rather than a URL. */
export function trackEvent(name: string, title?: string) {
  send({ path: name, title, event: true });
}

/**
 * Résumé downloads, outbound links and mailto: clicks — on a portfolio these
 * say more than pageviews do. Delegated from the document so it covers links
 * in any component without each one having to opt in.
 */
export function initLinkTracking() {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (link.hasAttribute('download')) trackEvent('resume-download', 'Résumé download');
    else if (href.startsWith('mailto:')) trackEvent('email-click', 'Email click');
    else if (/^https?:/i.test(href) && link.hostname !== location.hostname)
      trackEvent(`outbound-${link.hostname}`, `Outbound: ${link.hostname}`);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
