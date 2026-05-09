import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister the PWA service worker inside Lovable preview/iframe to prevent stale shells.
// PWA still works in production for end users.
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname.includes("lovableproject-dev.com");
if (isInIframe || isPreviewHost) {
  navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  caches?.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
}

createRoot(document.getElementById("root")!).render(<App />);
