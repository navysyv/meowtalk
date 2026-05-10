import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";

const sections = [
  { icon: Mic, label: "1. Speaking", path: "/full-test" },
  { icon: BookOpen, label: "2. Reading", path: "/practice-reading?mock=1" },
  { icon: PenTool, label: "3. Writing", path: "/practice-writing?mock=1" },
  { icon: Headphones, label: "4. Listening", path: "/practice-listening?mock=1" },
];

const MockTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold font-display">Full Mock Test</h1>
        </header>

        <div className="flex flex-col items-center gap-6">
          <TalkieCat state="impressed" size={120} />
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display">Complete IELTS Simulation</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">Take all four sections in order. Your scores combine into an overall band prediction.</p>
          </div>

          <div className="w-full space-y-3">
            {sections.map((s, i) => (
              <motion.button
                key={s.label}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(s.path)}
                className="w-full bg-card rounded-2xl p-4 shadow-soft flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-lavender-soft flex items-center justify-center">
                  <s.icon size={18} className="text-primary" />
                </div>
                <span className="font-medium text-foreground flex-1">{s.label}</span>
                <span className="text-xs text-muted-foreground">Start →</span>
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-sm">Complete each module separately, then check your History for the combined band view.</p>
        </div>
      </div>
    </div>
  );
};

export default MockTestPage;