import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicBackendUrl = env.VITE_SUPABASE_URL || "https://wvlygkqtlrrhylrzcnci.supabase.co";
  const publicBackendKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bHlna3F0bHJyaHlscnpjbmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzA0MjUsImV4cCI6MjA4OTI0NjQyNX0.xSzr6CtdKn5UbGiUUhC6iGep8J0u9Bq5TtiUTxUsY0U";
  const publicProjectId = env.VITE_SUPABASE_PROJECT_ID || "wvlygkqtlrrhylrzcnci";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(publicBackendUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicBackendKey),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(publicBackendKey),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(publicProjectId),
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
