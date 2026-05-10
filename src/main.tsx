import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Kill-switch: aggressively remove any previously-registered service worker
// and clear caches so old PWA shells stop hijacking the preview.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
}
if (typeof caches !== "undefined") {
  caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
}

createRoot(document.getElementById("root")!).render(<App />);
