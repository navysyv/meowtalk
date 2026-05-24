import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription } from "@/hooks/useSubscription";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { isActive, refresh } = useSubscription();

  useEffect(() => {
    if (isActive) return;
    const i = setInterval(refresh, 2000);
    const t = setTimeout(() => clearInterval(i), 30000);
    return () => { clearInterval(i); clearTimeout(t); };
  }, [isActive, refresh]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-card rounded-3xl p-8 shadow-glow text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-primary" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2">You're Premium! 🎉</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isActive
            ? "Unlimited mock tests, advanced feedback and priority AI are now unlocked."
            : "Activating your subscription… this usually takes a few seconds."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-glow"
        >
          <Sparkles size={16} /> Start practising
        </button>
        <Link to="/history" className="block text-xs text-muted-foreground mt-4 hover:text-foreground">
          View my progress
        </Link>
      </motion.div>
    </div>
  );
}