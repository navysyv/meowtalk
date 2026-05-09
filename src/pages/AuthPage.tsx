import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import TalkieCat from "@/components/TalkieCat";
import DecorativeBackground from "@/components/DecorativeBackground";
import { toast } from "sonner";
import { playClick } from "@/lib/sounds";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

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
          <h1 className="text-2xl font-bold font-display text-foreground">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground text-center">Save progress across devices. You can keep practicing as a guest too.</p>
        </motion.div>

        <div className="bg-card rounded-3xl p-6 shadow-medium flex flex-col gap-4">
          <button type="button" onClick={google} disabled={busy} className="w-full flex items-center justify-center gap-2 bg-background border border-border rounded-2xl py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" /></div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input type="text" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground rounded-2xl py-3 text-sm font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-60">
              {busy && <Loader2 size={16} className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>

        <button type="button" onClick={() => navigate("/")} className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground">
          Continue as guest
        </button>
      </div>
    </div>
  );
}