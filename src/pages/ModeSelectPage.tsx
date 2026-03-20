import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Flame } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import DecorativeBackground from "@/components/DecorativeBackground";
import { playClick } from "@/lib/sounds";
import { useStreak } from "@/hooks/useStreak";

const modes = [
  {
    id: "ielts",
    title: "IELTS Practice",
    desc: "Full IELTS Speaking simulation with Parts 1–3, timed responses, and band scoring.",
    icon: GraduationCap,
    path: "/ielts",
  },
  {
    id: "growth",
    title: "English Growth",
    desc: "Daily speaking practice with AI feedback, vocabulary building, and grammar corrections.",
    icon: BookOpen,
    path: "/growth",
  },
];

const ModeSelectPage = () => {
  const navigate = useNavigate();
  const { streak, justIncreased } = useStreak();

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold font-display text-foreground tracking-tight">
            MeowTalk Practice
          </h2>
          {streak > 0 && (
            <motion.div
              animate={justIncreased ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1.5 text-sm font-bold bg-primary/15 text-primary px-3 py-1.5 rounded-full shadow-glow"
            >
              <Flame size={16} className="text-accent" />
              <span>{streak}</span>
            </motion.div>
          )}
        </header>

        <main className="max-w-2xl mx-auto px-6 py-[8vh] flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <TalkieCat state="idle" size={140} />
            <div className="mt-2">
              <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground mb-2 text-balance">
                What do you want today?
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto text-sm">
                Choose your practice mode. Speak, learn, and grow every day.
              </p>
            </div>
          </motion.div>

          <div className="w-full flex flex-col gap-4">
            {modes.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { playClick(); navigate(m.path); }}
                className="w-full bg-card rounded-3xl p-6 shadow-medium text-left flex items-start gap-4 group transition-all hover:shadow-glow"
              >
                <div className="w-12 h-12 rounded-2xl bg-lavender-soft flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <m.icon size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold font-display text-foreground mb-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeSelectPage;
