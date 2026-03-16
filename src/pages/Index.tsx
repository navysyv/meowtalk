import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Clock, BookOpen, History } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import { playClick } from "@/lib/sounds";

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

  const handlePartClick = (part: number) => {
    playClick();
    navigate(`/practice/${part}`);
  };

  return (
    <div className="min-h-screen bg-background bg-dots">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold font-display text-foreground tracking-tight">
          Talkie IELTS
        </h2>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/history")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          <History size={16} />
          History
        </motion.button>
      </header>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 py-[8vh] flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <TalkieCat state="idle" size={160} />
          <div className="mt-2">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground mb-3 text-balance">
              Practice Speaking<br />with Talkie
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
              Take a deep breath. Talkie will guide you through your IELTS Speaking practice — one part at a time.
            </p>
          </div>
        </motion.div>

        {/* Part Cards */}
        <div className="w-full flex flex-col gap-4">
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

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground text-center max-w-sm"
        >
          100+ authentic IELTS-style questions per part. Questions won't repeat until you've seen them all.
        </motion.p>
      </main>
    </div>
  );
};

export default Index;
