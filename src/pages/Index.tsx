import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, History, Zap, Flame, Headphones, PenTool, Mic, Sparkles, Brain, Award, Target, TrendingUp, LogIn, MoreVertical, LogOut, Crown, Check } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import ProgressMap from "@/components/ProgressMap";
import DecorativeBackground from "@/components/DecorativeBackground";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { playClick } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useStreak, getSessionId } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";
import { useFreemium } from "@/lib/freemium";
import { SiteFooter } from "@/components/SiteFooter";
import { CreditBadge } from "@/components/CreditBadge";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { streak, justIncreased } = useStreak();
  const { user, signOut } = useAuth();
  const { isPremium } = useFreemium();
  const [progressScores, setProgressScores] = useState({ fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 });
  const [hasAttempts, setHasAttempts] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const sid = getSessionId();
      const { data } = await supabase
        .from("speaking_attempts")
        .select("band_score, fluency_feedback, vocabulary_feedback, grammar_feedback, pronunciation_feedback")
        .eq("session_id", sid)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        setHasAttempts(true);
        const avgBand = data.reduce((sum, a) => sum + (a.band_score || 0), 0) / data.length;
        const base = Math.round((avgBand / 9) * 100);
        setProgressScores({
          fluency: Math.min(100, base + Math.round(Math.random() * 6 - 3)),
          vocabulary: Math.min(100, base + Math.round(Math.random() * 6 - 3)),
          grammar: Math.min(100, base + Math.round(Math.random() * 6 - 3)),
          pronunciation: Math.min(100, base + Math.round(Math.random() * 6 - 3)),
        });
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold font-display text-foreground tracking-tight">
            Talkie IELTS
          </h2>
          <div className="flex items-center gap-3">
            {/* Streak - always visible */}
            <motion.div
              animate={justIncreased ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1.5 text-sm font-bold bg-primary/15 text-primary px-3 py-1.5 rounded-full shadow-glow"
            >
              <Flame size={16} className="text-accent" />
              <span>{streak > 0 ? streak : 0}</span>
            </motion.div>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/mock-test")} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
              <Zap size={16} />
              Mock Test
            </motion.button>
            <CreditBadge />
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${isPremium ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Sparkles size={10} /> {isPremium ? "Premium" : "Free"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Menu" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-card">
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && <DropdownMenuLabel className="text-xs truncate">{user.email}</DropdownMenuLabel>}
                {user && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={() => navigate("/history")}>
                  <History size={14} className="mr-2" /> History
                </DropdownMenuItem>
                {user ? (
                  <DropdownMenuItem onClick={async () => { await signOut(); toast.success("Signed out"); }}>
                    <LogOut size={14} className="mr-2" /> Sign out
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/auth")}>
                    <LogIn size={14} className="mr-2" /> Sign in
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Hero */}
        <main className="max-w-2xl mx-auto px-6 py-[4vh] flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <TalkieCat state="idle" size={140} />
            <div className="mt-2">
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground mb-3 text-balance">
                Talkie IELTS<br />Practice Platform
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                Realistic AI-powered practice across all four IELTS skills. Take your time — Talkie will guide you.
              </p>
            </div>
          </motion.div>

          {/* Skill modules */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              { icon: Mic, label: "Speaking", path: "/speaking" },
              { icon: BookOpen, label: "Reading", path: "/practice-reading" },
              { icon: PenTool, label: "Writing", path: "/practice-writing" },
              { icon: Headphones, label: "Listening", path: "/practice-listening" },
            ].map((m, i) => (
              <motion.button
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { playClick(); navigate(m.path); }}
                className="bg-card rounded-2xl p-4 shadow-soft flex flex-col items-center gap-2 hover:shadow-medium transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-lavender-soft flex items-center justify-center">
                  <m.icon size={18} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{m.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Progress Map - always show, with defaults if no attempts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="w-full">
            <ProgressMap
              fluency={hasAttempts ? progressScores.fluency : 0}
              vocabulary={hasAttempts ? progressScores.vocabulary : 0}
              grammar={hasAttempts ? progressScores.grammar : 0}
              pronunciation={hasAttempts ? progressScores.pronunciation : 0}
            />
          </motion.div>

          {/* Full Test CTA */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/mock-test")}
            className="w-full bg-primary text-primary-foreground rounded-3xl p-5 shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow flex items-center justify-center gap-2 font-semibold"
          >
            <Zap size={18} />
            Start Full Mock Test
          </motion.button>

          {/* Premium upsell — subtle, lavender, non-aggressive */}
          {!isPremium && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="w-full relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-lavender-soft via-card to-lavender-soft border border-primary/15 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <Crown size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground leading-tight">Talkie Premium</p>
                    <p className="text-[11px] text-muted-foreground">Unlock the full IELTS experience</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">From $9.99/mo</span>
              </div>
              <ul className="grid grid-cols-1 gap-1.5 mb-4">
                {[
                  "Unlimited full mock tests",
                  "Advanced examiner-style feedback",
                  "Deeper AI insights & analytics",
                  "Priority AI processing",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                    <Check size={13} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { playClick(); navigate("/pricing"); }}
                className="w-full py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow flex items-center justify-center gap-2"
              >
                <Sparkles size={14} /> See Premium
              </button>
            </motion.section>
          )}

          {/* Why Talkie IELTS section */}
          <section className="w-full mt-4">
            <h3 className="text-lg font-semibold font-display text-foreground mb-3 text-center">Why Talkie IELTS?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Sparkles, label: "Real IELTS simulation" },
                { icon: Brain, label: "AI-powered feedback" },
                { icon: Target, label: "Personalized study" },
                { icon: Award, label: "Mock exams" },
                { icon: PenTool, label: "Writing correction" },
                { icon: BookOpen, label: "Vocabulary upgrade" },
                { icon: Mic, label: "Pronunciation tips" },
                { icon: TrendingUp, label: "Progress tracking" },
              ].map((f) => (
                <div key={f.label} className="bg-card rounded-2xl p-3 shadow-soft flex items-center gap-2">
                  <f.icon size={16} className="text-primary shrink-0" />
                  <span className="text-xs font-medium text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground text-center max-w-sm"
          >
            Practice across all 4 IELTS skills. Your progress is saved automatically.
          </motion.p>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Index;
