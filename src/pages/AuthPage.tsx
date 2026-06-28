import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import TalkieCat from "@/components/TalkieCat";
import DecorativeBackground from "@/components/DecorativeBackground";
import { toast } from "sonner";
import { playClick } from "@/lib/sounds";

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirect, { replace: true });
    });
  }, [navigate, redirect]);

  const google = async () => {
    playClick();
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}${redirect}` });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate(redirect);
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || cleanEmail.length > 255) { toast.error("Please enter a valid email"); return; }
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for a reset link");
        setMode("signin");
      } else if (mode === "signup") {
        if (password.length < 8 || password.length > 72) { toast.error("Password must be 8–72 characters"); setBusy(false); return; }
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirect}` },
        });
        if (error) throw error;
        toast.success("Account created — check your email to verify");
      } else {
        if (!password) { toast.error("Enter your password"); setBusy(false); return; }
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
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
          <p className="text-sm text-muted-foreground text-center">Save your progress, streaks and mock results across devices.</p>
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

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> or email <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submitEmail} className="flex flex-col gap-3">
            <input
              type="email" required autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
              className="w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {mode !== "forgot" && (
              <input
                type="password" required autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "Create a password (min. 8 chars)" : "Your password"}
                value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72}
                className="w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
            <button type="submit" disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-2xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              {mode === "signin" && "Sign in"}
              {mode === "signup" && "Create account"}
              {mode === "forgot" && "Send reset link"}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {mode !== "forgot" ? (
              <button type="button" onClick={() => setMode("forgot")} className="hover:text-foreground underline">
                Forgot password?
              </button>
            ) : (
              <button type="button" onClick={() => setMode("signin")} className="hover:text-foreground underline">
                Back to sign in
              </button>
            )}
            {mode === "signin" && (
              <button type="button" onClick={() => setMode("signup")} className="hover:text-foreground underline">
                Create account
              </button>
            )}
            {mode === "signup" && (
              <button type="button" onClick={() => setMode("signin")} className="hover:text-foreground underline">
                Have an account? Sign in
              </button>
            )}
          </div>

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