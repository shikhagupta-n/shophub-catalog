export function ensureObservabilityGlobals() {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag !== 'function') window.gtag = () => {};
}

