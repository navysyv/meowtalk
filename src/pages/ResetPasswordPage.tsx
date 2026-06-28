import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TalkieCat from "@/components/TalkieCat";
import DecorativeBackground from "@/components/DecorativeBackground";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // Supabase auto-parses the recovery token from the URL hash and
    // emits a PASSWORD_RECOVERY event. Treat any active session here
    // as "user is in a recovery flow and can set a new password".
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || password.length > 72) {
      toast.error("Password must be 8–72 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated — you're signed in");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Couldn't update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-md mx-auto px-6 py-6">
        <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 mb-6">
          <TalkieCat state="idle" size={96} />
          <h1 className="text-2xl font-bold font-display text-foreground">Set a new password</h1>
          <p className="text-sm text-muted-foreground text-center">
            {ready
              ? "Choose a strong password you'll remember."
              : "Open this page from the reset link in your email."}
          </p>
        </motion.div>

        <div className="bg-card rounded-3xl p-6 shadow-medium">
          {ready ? (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="password" required autoComplete="new-password" placeholder="New password (min. 8 chars)"
                value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72}
                className="w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <input
                type="password" required autoComplete="new-password" placeholder="Confirm new password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} maxLength={72}
                className="w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button type="submit" disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-3 text-sm font-semibold shadow-glow disabled:opacity-60">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Update password
              </button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Waiting for a valid reset link… If nothing happens, request a new email from the sign-in page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}