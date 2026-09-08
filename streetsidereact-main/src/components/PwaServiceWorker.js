import { useEffect } from "react";

/** Registers the marketplace runtime worker without taking over Firebase's SW. */
const PwaServiceWorker = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          if (registration.waiting)
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        })
        .catch((error) =>
          console.warn("Marketplace service worker registration failed", error)
        );
    };

    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(register, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(register, 1500);
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
};

export default PwaServiceWorker;
