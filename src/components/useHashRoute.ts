import { useEffect, useState } from 'react';

/**
 * Current `window.location.hash`, kept in sync with `hashchange`.
 *
 * Lives in its own module rather than inside App so the Header can read the
 * route too (importing it from App would be circular — App renders Header).
 */
export function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return hash;
}
