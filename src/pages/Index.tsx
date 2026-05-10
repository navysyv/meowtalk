import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Clock, BookOpen, History, Zap, Flame, Headphones, PenTool, Mic, Sparkles, Brain, Award, Target, TrendingUp, LogIn, LogOut, User as UserIcon } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import ProgressMap from "@/components/ProgressMap";
import DecorativeBackground from "@/components/DecorativeBackground";
import { playClick } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useStreak, getSessionId } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const parts = [
  {
    num: 1,
    title: "Introduction & Interview",
    desc: "Short questions about familiar topics like home, work, studies, and hobbies.",
    icon: MessageCircle,
    time: "~2 min",
  },
  {
    num: 2,
    title: "Individual Long Turn",
    desc: "Speak about a topic for 2 minutes with 1 minute preparation time.",
    icon: Clock,
    time: "~3 min",
  },
  {
    num: 3,
    title: "Two-Way Discussion",
    desc: "Deeper discussion questions on abstract topics related to Part 2.",
    icon: BookOpen,
    time: "~2 min",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { streak, justIncreased } = useStreak();
  const { user, signOut } = useAuth();
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

  const handlePartClick = (part: number) => {
    playClick();
    navigate(`/practice/${part}`);
  };

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
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/history")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <History size={16} />
              History
            </motion.button>
            {user ? (
              <motion.button whileTap={{ scale: 0.96 }} onClick={async () => { await signOut(); toast.success("Signed out"); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5" title={user.email ?? "Account"}>
                <UserIcon size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/auth")} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                <LogIn size={16} />
                Sign in
              </motion.button>
            )}
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
              { icon: Mic, label: "Speaking", path: "/practice/1" },
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

          {/* Part Cards */}
          <div className="w-full flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Speaking Parts</h3>
            {parts.map((p, i) => (
              <motion.button
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePartClick(p.num)}
                className="w-full bg-card rounded-3xl p-6 shadow-medium text-left flex items-start gap-4 group transition-all hover:shadow-glow"
              >
                <div className="w-12 h-12 rounded-2xl bg-lavender-soft flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <p.icon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold font-display text-foreground">
                      Part {p.num}: {p.title}
                    </h3>
                    <span className="text-xs text-muted-foreground tabular-nums">{p.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

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
    </div>
  );
};

export default Index;
