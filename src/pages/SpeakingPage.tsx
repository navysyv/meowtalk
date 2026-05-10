import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Clock, BookOpen, Zap } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { playClick } from "@/lib/sounds";

const parts = [
  { num: 1, title: "Introduction & Interview", desc: "Short questions about familiar topics like home, work, studies, and hobbies.", icon: MessageCircle, time: "~2 min" },
  { num: 2, title: "Individual Long Turn", desc: "Speak about a topic for 2 minutes with 1 minute preparation time.", icon: Clock, time: "~3 min" },
  { num: 3, title: "Two-Way Discussion", desc: "Deeper discussion questions on abstract topics related to Part 2.", icon: BookOpen, time: "~2 min" },
];

const SpeakingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-4">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
            <h1 className="text-lg font-semibold font-display">Speaking</h1>
          </div>
          <button onClick={() => { playClick(); navigate("/full-test"); }} className="text-xs font-medium text-primary flex items-center gap-1">
            <Zap size={14} /> Full Speaking mock
          </button>
        </header>

        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <TalkieCat state="idle" size={110} />
          <p className="text-sm text-muted-foreground max-w-sm">Pick any part to practice individually, or take the full Speaking mock to simulate the real exam flow.</p>
        </div>

        <div className="flex flex-col gap-4">
          {parts.map((p, i) => (
            <motion.button
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { playClick(); navigate(`/practice/${p.num}`); }}
              className="w-full bg-card rounded-3xl p-5 shadow-medium text-left flex items-start gap-4 hover:shadow-glow transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-lavender-soft flex items-center justify-center shrink-0">
                <p.icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold font-display text-foreground">Part {p.num}: {p.title}</h3>
                  <span className="text-xs text-muted-foreground tabular-nums">{p.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
