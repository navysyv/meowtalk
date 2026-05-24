import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCredits } from "@/hooks/useCredits";

export function CreditBadge() {
  const navigate = useNavigate();
  const { balance, isPremium, loading } = useCredits();

  if (loading || balance === null) return null;

  const low = !isPremium && balance <= 3;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate("/pricing")}
      title={isPremium ? "Premium · 300 credits/day" : "Free · 10 credits/day. Tap to upgrade."}
      className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${
        low
          ? "bg-destructive/15 text-destructive"
          : "bg-lavender-soft text-primary hover:bg-primary/15"
      }`}
    >
      <Zap size={14} className="shrink-0" />
      <span>{balance}</span>
    </motion.button>
  );
}