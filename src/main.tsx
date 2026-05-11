import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import "./index.css";

// One-shot cleanup of any legacy service workers / caches left from
// previous PWA shells. Storage access itself can throw in restricted
// browsers/incognito, so all reads/writes must stay guarded.
const swAlreadyCleaned = (() => {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem("__sw_cleaned") === "1";
  } catch {
    return false;
  }
})();

if (typeof window !== "undefined" && !swAlreadyCleaned) {
  try {
    sessionStorage.setItem("__sw_cleaned", "1");
  } catch {
    // ignore storage write failures
  }

  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          regs.forEach((r) => r.unregister().catch(() => {}));
        })
        .catch(() => {});
    }
    if (typeof caches !== "undefined") {
      caches
        .keys()
        .then((keys) => {
          keys.forEach((k) => caches.delete(k).catch(() => {}));
        })
        .catch(() => {});
    }
  } catch {
    // never block app boot
  }
}

// Safe check for required Supabase env vars. Don't crash on absence —
// surface a friendly fallback so the app shell still renders.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_PUBLISHABLE_KEY && SUPABASE_ANON_KEY) {
  try {
    (import.meta.env as Record<string, string | boolean | undefined>).VITE_SUPABASE_PUBLISHABLE_KEY = SUPABASE_ANON_KEY;
    // eslint-disable-next-line no-console
    console.warn(
      "[Lovable] VITE_SUPABASE_PUBLISHABLE_KEY is missing. Falling back to VITE_SUPABASE_ANON_KEY for compatibility."
    );
  } catch {
    // never block app boot
  }
}

const envMissing = !SUPABASE_URL || !SUPABASE_KEY;
if (envMissing) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Lovable] Missing Supabase env vars (VITE_SUPABASE_URL and either VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY). Backend features will be disabled."
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

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("[Lovable] Root element #root was not found.");
}

const root = createRoot(rootEl);

async function bootstrap() {
  if (envMissing) {
    root.render(
      <Fallback
        title="Backend not configured"
        message="Supabase environment variables are missing. The app cannot connect to its backend yet."
      />
    );
    return;
  }

  try {
    const { default: App } = await import("./App.tsx");

    root.render(
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[Lovable] Failed to mount app:", err);
    root.render(
      <Fallback
        title="Unable to load"
        message="The app failed to start. Please refresh the page."
      />
    );
  }
}

void bootstrap();
