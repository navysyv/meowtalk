import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// One-shot cleanup of any legacy service workers / caches left from
// previous PWA shells. Guarded by sessionStorage so it never loops.
if (typeof window !== "undefined" && !sessionStorage.getItem("__sw_cleaned")) {
  sessionStorage.setItem("__sw_cleaned", "1");
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}));
      }).catch(() => {});
    }
    if (typeof caches !== "undefined") {
      caches.keys().then((keys) => {
        keys.forEach((k) => caches.delete(k).catch(() => {}));
      }).catch(() => {});
    }
  } catch {
    // never block app boot
  }
}

createRoot(document.getElementById("root")!).render(<App />);
