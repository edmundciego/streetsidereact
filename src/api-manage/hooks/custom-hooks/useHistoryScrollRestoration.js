import { useEffect } from "react";
import { useRouter } from "next/router";

// Pages with client-rendered lists can finish mounting after Next restores
// history scroll. Restore once the list is tall enough, without fighting input.
const useHistoryScrollRestoration = () => {
  const { events } = useRouter();

  useEffect(() => {
    const positions = new Map();
    const getKey = () => window.history.state?.key || window.location.href;
    let currentKey = getKey();
    let pending = null;
    let cancelRestore = () => {};
    const inputs = ["pointerdown", "touchstart", "wheel", "keydown"];
    const interrupt = () => {
      pending = null;
      cancelRestore();
    };

    const save = () => {
      positions.set(currentKey, { x: window.scrollX, y: window.scrollY });
      if (positions.size > 100) positions.delete(positions.keys().next().value);
    };
    const start = () => {
      cancelRestore();
      // Next can await middleware before emitting routeChangeStart, so a
      // popstate target may already be waiting. Preserve it for this entry.
      if (!pending || pending.key !== getKey()) {
        pending = null;
        save();
      }
    };
    const pop = () => {
      cancelRestore();
      save();
      const key = getKey();
      const position = positions.get(key);
      pending = position ? { ...position, key } : null;
    };
    const complete = () => {
      currentKey = getKey();
      if (!pending || pending.key !== currentKey) {
        pending = null;
        return;
      }
      const target = pending;
      pending = null;
      let frame;
      let observer;
      let timeout;
      const stop = () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timeout);
        observer?.disconnect();
      };
      const restore = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          if (
            document.documentElement.scrollHeight - window.innerHeight <
            target.y
          )
            return;
          window.scrollTo({ left: target.x, top: target.y, behavior: "auto" });
        });
      };
      cancelRestore = stop;
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(restore);
        observer.observe(document.body);
      }
      // Allow mount effects to settle before the first restoration attempt.
      frame = window.requestAnimationFrame(restore);
      timeout = window.setTimeout(() => {
        window.scrollTo({ left: target.x, top: target.y, behavior: "auto" });
        stop();
      }, 2000);
    };
    const error = () => {
      pending = null;
      cancelRestore();
    };

    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", complete);
    events.on("routeChangeError", error);
    window.addEventListener("popstate", pop);
    inputs.forEach((type) =>
      window.addEventListener(type, interrupt, { passive: true })
    );
    return () => {
      cancelRestore();
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", complete);
      events.off("routeChangeError", error);
      window.removeEventListener("popstate", pop);
      inputs.forEach((type) => window.removeEventListener(type, interrupt));
    };
  }, [events]);
};

export default useHistoryScrollRestoration;
