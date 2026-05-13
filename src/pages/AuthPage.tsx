import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import TalkieCat from "@/components/TalkieCat";
import DecorativeBackground from "@/components/DecorativeBackground";
import { toast } from "sonner";
import { playClick } from "@/lib/sounds";

export default function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  const google = async () => {
    playClick();
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-md mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to practice
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 mb-6">
          <TalkieCat state="idle" size={96} />
          <h1 className="text-2xl font-bold font-display text-foreground">Sign in to Talkie IELTS</h1>
          <p className="text-sm text-muted-foreground text-center">Sign in with Google to save your progress, streaks and mock results across devices.</p>
        </motion.div>

        <div className="bg-card rounded-3xl p-6 shadow-medium flex flex-col gap-4">
          <button type="button" onClick={google} disabled={busy} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow disabled:opacity-60">
            {busy ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" opacity="0.85" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
            )}
            Continue with Google
          </button>
          <p className="text-xs text-muted-foreground text-center px-2">
            By continuing, you agree to use Talkie IELTS for personal practice. We only store your name, email and progress.
          </p>
        </div>

        <button type="button" onClick={() => navigate("/")} className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground">
          Continue as guest
        </button>
      </div>
    </div>
  );
}