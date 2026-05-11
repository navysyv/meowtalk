import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
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

// Safe check for required Supabase env vars. Don't crash on absence —
// surface a friendly fallback so the app shell still renders.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const envMissing = !SUPABASE_URL || !SUPABASE_KEY;
if (envMissing) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Lovable] Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Backend features will be disabled."
  );
}

function Fallback({ title, message }: { title: string; message: string }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif",
      background: "#F4F1FA", color: "#2A2440", textAlign: "center",
    }}>
      <div style={{ maxWidth: 420 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>{title}</h1>
        <p style={{ fontSize: 14, opacity: 0.75, margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("[Lovable] Root render error:", error);
  }
  render() {
    if (this.state.error) {
      return (
        <Fallback
          title="Something went wrong"
          message="The app failed to start. Please refresh the page. If the problem persists, contact support."
        />
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById("root")!;
if (envMissing) {
  createRoot(rootEl).render(
    <Fallback
      title="Backend not configured"
      message="Supabase environment variables are missing. The app cannot connect to its backend yet."
    />
  );
} else {
  try {
    createRoot(rootEl).render(
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[Lovable] Failed to mount app:", err);
    createRoot(rootEl).render(
      <Fallback
        title="Unable to load"
        message="The app failed to start. Please refresh the page."
      />
    );
  }
}
