import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SelectedProjects from './components/SelectedProjects';
import ComingSoon from './components/ComingSoon';
import Footer from './components/Footer';
import CaseStudyMessaging from './components/CaseStudyMessaging';
import CaseStudyALaCarte from './components/CaseStudyALaCarte';
import CaseStudyPlanFeatureAdoption from './components/CaseStudyPlanFeatureAdoption';
import AboutPage from './components/AboutPage';
import Preloader from './components/Preloader';
import { useHashRoute } from './components/useHashRoute';
import { initLinkTracking, trackPageview } from './analytics';

/**
 * Home — "Web / 1440 / Home" (Figma node 2023:5429).
 * Header floats over the Hero; the rest of the page flows on the cream canvas.
 *
 * `ready` gates the Hero's video playback + text reveal — see Hero.tsx.
 */
function Home({ ready }: { ready: boolean }) {
  return (
    <div className="relative min-h-screen bg-canvas">
      <Header />
      <main>
        <Hero ready={ready} />
        <SelectedProjects />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
}

// Curtain should only ever play once per browser session — sessionStorage
// (not localStorage) so a genuinely new visit later still gets it, but
// reloading or re-entering Home within the same session doesn't replay it.
const PRELOAD_SEEN_KEY = 'jk:preloaded';

function hasPreloaded() {
  try {
    return sessionStorage.getItem(PRELOAD_SEEN_KEY) === '1';
  } catch {
    return false; // storage blocked (private mode, etc.) — degrade to replaying every load
  }
}

export default function App() {
  const hash = useHashRoute();
  const firstRoute = useRef(true);
  const [preloading, setPreloading] = useState(() => !hasPreloaded());
  // Flips true the instant the curtain *starts* lifting (not once it's fully
  // gone) — see Preloader.tsx — so Hero's video/reveal are already moving by
  // the time the curtain clears, instead of the page sitting static for the
  // whole ~650ms lift. Already true if the curtain isn't playing this load.
  const [ready, setReady] = useState(() => hasPreloaded());

  useEffect(() => {
    if (!preloading) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [preloading]);

  // Restore scroll on every route change. The browser only honours a hash the
  // moment it changes, and at that instant the *outgoing* page is still
  // mounted — so `#projects` finds nothing and `#/about` isn't an anchor at
  // all. Without this, leaving a case study you were 6000px deep in drops you
  // 6000px deep into the next page. Runs after render, when the new route's
  // DOM (and its anchors) actually exist.
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false; // let the browser restore scroll on reload
      return;
    }
    const id = hash.startsWith('#/') ? '' : hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    // `behavior: 'instant'` overrides the global `scroll-behavior: smooth`:
    // smooth-scrolling a whole page height on a route swap reads as a glitch.
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [hash]);

  // Analytics. This lives here rather than inside `useHashRoute` because
  // Header calls that hook too — counting there would double every pageview.
  // App is the one place the route is observed exactly once.
  useEffect(() => {
    trackPageview();
  }, [hash]);

  useEffect(() => initLinkTracking(), []);

  const finishPreload = () => {
    setPreloading(false);
    try {
      sessionStorage.setItem(PRELOAD_SEEN_KEY, '1');
    } catch {
      // storage blocked — next load just replays the curtain again
    }
  };

  return (
    <>
      {preloading && <Preloader onLiftStart={() => setReady(true)} onDone={finishPreload} />}
      {hash.startsWith('#/case/messaging') ? (
        <CaseStudyMessaging />
      ) : hash.startsWith('#/case/a-la-carte') ? (
        <CaseStudyALaCarte />
      ) : hash.startsWith('#/case/plan-feature-adoption') ? (
        <CaseStudyPlanFeatureAdoption />
      ) : hash.startsWith('#/about') ? (
        <AboutPage />
      ) : (
        <Home ready={ready} />
      )}
    </>
  );
}
