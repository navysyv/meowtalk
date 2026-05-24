import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic, Sparkles } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { getMockState, clearMock, type MockState } from "@/lib/mockState";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";

const sectionMeta = [
  { key: "listening" as const, label: "Listening", icon: Headphones },
  { key: "reading" as const, label: "Reading", icon: BookOpen },
  { key: "writing" as const, label: "Writing", icon: PenTool },
  { key: "speaking" as const, label: "Speaking", icon: Mic },
];

const roundHalf = (n: number) => Math.round(n * 2) / 2;

function buildAdvice(bands: MockState["bands"]) {
  const entries = sectionMeta
    .map((s) => ({ key: s.key, label: s.label, band: bands[s.key] ?? 0 }))
    .filter((e) => e.band > 0);
  if (entries.length === 0) return { strengths: [], weaknesses: [], tips: [] };

  const sorted = [...entries].sort((a, b) => b.band - a.band);
  const strengths = sorted.slice(0, 2).filter((e) => e.band >= 6.5).map((e) => e.label);
  const weaknesses = sorted.slice(-2).filter((e) => e.band < 6.5).map((e) => e.label);

  const tipMap: Record<string, string> = {
    Listening: "Practise note-completion daily and shadow native speakers for 10 minutes.",
    Reading: "Time yourself: 20 min per passage. Train True/False/Not Given with academic texts.",
    Writing: "Plan 5 minutes before writing, aim for 4 paragraphs, and review band-9 model essays.",
    Speaking: "Record 2-minute Part 2 answers daily and review your fluency and connectives.",
  };
  const tips = (weaknesses.length ? weaknesses : sorted.slice(-2).map((e) => e.label))
    .map((label) => tipMap[label])
    .filter(Boolean);

  return { strengths, weaknesses, tips };
}

const MockSummaryPage = () => {
  const navigate = useNavigate();
  const [state] = useState<MockState | null>(() => getMockState());
  const [saved, setSaved] = useState(false);

  const overall = useMemo(() => {
    if (!state) return 0;
    const vals = sectionMeta.map((s) => state.bands[s.key]).filter((v): v is number => typeof v === "number" && v > 0);
    if (vals.length === 0) return 0;
    return roundHalf(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [state]);

  const advice = useMemo(() => (state ? buildAdvice(state.bands) : { strengths: [], weaknesses: [], tips: [] }), [state]);

  useEffect(() => {
    if (!state || saved || overall === 0) return;
    setSaved(true);
    (async () => {
      const { getOwner } = await import("@/lib/owner");
      const { user_id, session_id } = await getOwner();
      await supabase.from("mock_results").insert({
        session_id, user_id,
        listening_band: state.bands.listening ?? null,
        reading_band: state.bands.reading ?? null,
        writing_band: state.bands.writing ?? null,
        speaking_band: state.bands.speaking ?? null,
        overall_band: overall,
        report: { strengths: advice.strengths, weaknesses: advice.weaknesses, tips: advice.tips },
      });
    })();
  }, [state, saved, overall, advice]);

  if (!state) {
    return (
      <div className="min-h-screen relative">
        <DecorativeBackground />
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-10 text-center">
          <TalkieCat state="idle" size={100} />
          <p className="mt-6 text-muted-foreground">No mock test in progress.</p>
          <button onClick={() => navigate("/mock-test")} className="mt-4 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">
            Start a Mock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold font-display">Mock Test Results</h1>
        </header>

        <div className="flex flex-col items-center gap-6">
          <TalkieCat state="impressed" size={120} />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-sm text-muted-foreground">Overall Band</p>
            <p className="text-6xl font-bold font-display text-primary">{overall.toFixed(1)}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {sectionMeta.map((s) => {
              const band = state.bands[s.key];
              return (
                <div key={s.key} className="bg-card rounded-2xl p-4 shadow-soft flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lavender-soft flex items-center justify-center">
                    <s.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold font-display text-foreground">{band ? band.toFixed(1) : "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {advice.strengths.length > 0 && (
            <div className="w-full bg-card rounded-2xl p-4 shadow-soft">
              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Sparkles size={14} className="text-primary" /> Strengths</p>
              <p className="text-sm text-foreground">{advice.strengths.join(", ")}</p>
            </div>
          )}

          {advice.weaknesses.length > 0 && (
            <div className="w-full bg-card rounded-2xl p-4 shadow-soft">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Areas to improve</p>
              <p className="text-sm text-foreground">{advice.weaknesses.join(", ")}</p>
            </div>
          )}

          {advice.tips.length > 0 && (
            <div className="w-full bg-card rounded-2xl p-4 shadow-soft">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Personalized tips</p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc list-inside">
                {advice.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={() => { clearMock(); navigate("/"); }} className="flex-1 py-3 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium">Home</button>
            <button onClick={() => { clearMock(); navigate("/mock-test"); }} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-glow">New Mock</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockSummaryPage;
