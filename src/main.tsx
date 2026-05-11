import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare const __BUILD_VERSION__: string;

// Build version is stamped at build time by Vite. When it changes between
// visits we run a "strict cleanup": unregister any service workers, drop
// every Cache Storage entry, and auto-reload once so the user always sees
// the freshest build without a manual hard refresh.
const BUILD_VERSION: string =
  (typeof __BUILD_VERSION__ !== "undefined" && __BUILD_VERSION__) ||
  import.meta.env.VITE_BUILD_VERSION ||
  String(import.meta.env.MODE === "development" ? Date.now() : "dev");

const VERSION_KEY = "__app_build_version";
const RELOAD_GUARD = "__app_build_reloaded";

async function strictCleanup(): Promise<boolean> {
  let didCleanup = false;
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length) {
      await Promise.all(regs.map((r) => r.unregister()));
      didCleanup = true;
    }
  }
  if (typeof caches !== "undefined") {
    const keys = await caches.keys();
    if (keys.length) {
      await Promise.all(keys.map((k) => caches.delete(k)));
      didCleanup = true;
    }
  }
  return didCleanup;
}

(async () => {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    const versionChanged = stored !== null && stored !== BUILD_VERSION;

    // Always sweep stale SWs/caches on first load of a new version
    // (or if anything is lingering from previous PWA shells).
    const didCleanup = await strictCleanup();

    localStorage.setItem(VERSION_KEY, BUILD_VERSION);

    const shouldReload =
      (versionChanged || didCleanup) &&
      !sessionStorage.getItem(RELOAD_GUARD);

    if (shouldReload) {
      sessionStorage.setItem(RELOAD_GUARD, "1");
      location.reload();
      return;
    }

    // Same version booted cleanly — clear the guard for next change.
    sessionStorage.removeItem(RELOAD_GUARD);
  } catch {
    // never block app boot
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
