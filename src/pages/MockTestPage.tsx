import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic, ArrowRight, Lock, Sparkles } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { startMock, clearMock, getMockState } from "@/lib/mockState";
import { useFreemium, FREE_MOCK_LIMIT_PER_WEEK } from "@/lib/freemium";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const sections = [
  { icon: Headphones, label: "1. Listening", time: "30 min" },
  { icon: BookOpen, label: "2. Reading", time: "60 min" },
  { icon: PenTool, label: "3. Writing", time: "60 min" },
  { icon: Mic, label: "4. Speaking", time: "11–14 min" },
];

const MockTestPage = () => {
  const navigate = useNavigate();
  const existing = getMockState();
  const { blocked, mocksThisWeek, remaining, loading } = useFreemium();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const begin = () => {
    if (blocked) { setPaywallOpen(true); return; }
    clearMock();
    startMock();
    navigate("/practice-listening?mock=1");
  };

  const resume = () => {
    if (!existing) return;
    const route = ["/practice-listening", "/practice-reading", "/practice-writing", "/full-test", "/mock-summary"][
      Math.max(0, existing.step - 1)
    ];
    navigate(`${route}${route === "/mock-summary" ? "" : "?mock=1"}`);
  };

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
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              The exam runs automatically: Listening → Reading → Writing → Speaking. You'll get an overall band at the end.
            </p>
          </div>

          <div className="w-full space-y-3">
            {sections.map((s) => (
              <motion.div
                key={s.label}
                className="w-full bg-card rounded-2xl p-4 shadow-soft flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-lavender-soft flex items-center justify-center">
                  <s.icon size={18} className="text-primary" />
                </div>
                <span className="font-medium text-foreground flex-1">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.time}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            {!loading && (
              <div className="w-full bg-card rounded-2xl px-4 py-3 shadow-soft flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Free plan · {mocksThisWeek}/{FREE_MOCK_LIMIT_PER_WEEK} mocks this week
                </span>
                <span className="text-primary font-medium">{remaining} left</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={begin}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {blocked ? <><Lock size={16} /> Weekly limit reached</> : <>{existing?.active ? "Restart Mock" : "Begin Mock"} <ArrowRight size={18} /></>}
            </motion.button>
            {existing?.active && existing.step < 5 && (
              <button onClick={resume} className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium">
                Resume from step {existing.step}
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-sm">Sections advance automatically once you submit each one.</p>
        </div>

        <Dialog open={paywallOpen} onOpenChange={setPaywallOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <div className="w-12 h-12 rounded-2xl bg-lavender-soft flex items-center justify-center mb-2">
                <Sparkles size={20} className="text-primary" />
              </div>
              <DialogTitle className="font-display">Talkie Premium</DialogTitle>
              <DialogDescription>
                You've used your {FREE_MOCK_LIMIT_PER_WEEK} free mock tests this week. Premium unlocks unlimited mocks and detailed examiner-style feedback.
              </DialogDescription>
            </DialogHeader>
            <ul className="text-sm text-foreground space-y-2 py-2">
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Unlimited full mock tests</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Advanced examiner feedback</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Priority AI evaluation</li>
            </ul>
            <DialogFooter>
              <Link
                to="/pricing"
                className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-glow text-center"
                onClick={() => setPaywallOpen(false)}
              >
                View plans from $4.99/month
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MockTestPage;