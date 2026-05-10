import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Kill-switch: remove any previously-registered service worker and clear
// caches so old PWA shells stop hijacking the preview. If we actually
// found something to clean up, reload once automatically (no manual hard
// refresh needed). A sessionStorage flag prevents reload loops.
(async () => {
  try {
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
    if (didCleanup && !sessionStorage.getItem("__sw_cleaned")) {
      sessionStorage.setItem("__sw_cleaned", "1");
      location.reload();
    }
  } catch {
    // ignore — never block app boot
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
