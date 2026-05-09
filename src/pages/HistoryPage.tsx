import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DecorativeBackground from "@/components/DecorativeBackground";
import { getSessionId } from "@/hooks/useStreak";

interface Attempt {
  id: string;
  part: number;
  question_text: string;
  transcript: string | null;
  improved_answer: string | null;
  band_score: number | null;
  fluency_feedback: string | null;
  vocabulary_feedback: string | null;
  grammar_feedback: string | null;
  pronunciation_feedback: string | null;
  suggestions: string[] | null;
  created_at: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selected, setSelected] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      const sid = getSessionId();
      const { data } = await supabase
        .from("speaking_attempts")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: false })
        .limit(50);
      setAttempts((data as Attempt[]) || []);
      setLoading(false);
    };
    fetchAttempts();
  }, []);

  const scores = attempts.filter(a => a.band_score).map(a => a.band_score!).reverse();
  const maxScore = Math.max(...scores, 9);
  const minScore = Math.min(...scores, 0);

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        <header className="flex items-center gap-4 px-6 py-4 max-w-3xl mx-auto">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </motion.button>
          <h1 className="text-lg font-semibold font-display text-foreground">Practice History</h1>
        </header>

        <main className="max-w-3xl mx-auto px-6 pb-12 space-y-8">
          {/* Progress chart */}
          {scores.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-6 shadow-medium">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary" />
                <h2 className="font-semibold font-display text-foreground">Band Score Progress</h2>
              </div>
              <div className="h-32 flex items-end gap-1">
                {scores.map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{score.toFixed(1)}</span>
                    <div
                      className="w-full bg-primary/80 rounded-t-lg transition-all"
                      style={{ height: `${((score - minScore + 1) / (maxScore - minScore + 1)) * 100}%`, minHeight: 8 }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Attempts list */}
          {loading ? (
            <p className="text-center text-muted-foreground text-sm">Loading...</p>
          ) : attempts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No practice sessions yet.</p>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/")} className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm shadow-glow">
                Start Practicing
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((a, i) => (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(selected?.id === a.id ? null : a)}
                  className="w-full bg-card rounded-2xl p-4 shadow-soft text-left hover:shadow-medium transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-primary">Part {a.part}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-foreground font-medium mb-1 line-clamp-1">{a.question_text}</p>
                  <div className="flex items-center gap-2">
                    {a.band_score && <span className="text-lg font-bold font-display text-primary">{a.band_score.toFixed(1)}</span>}
                  </div>

                  {selected?.id === a.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 space-y-3 border-t border-border pt-4">
                      {a.transcript && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Your Response</p>
                          <p className="text-sm text-foreground italic">"{a.transcript}"</p>
                        </div>
                      )}
                      {a.improved_answer && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Model Answer</p>
                          <p className="text-sm text-foreground">{a.improved_answer}</p>
                        </div>
                      )}
                      {a.fluency_feedback && (
                        <div className="grid grid-cols-2 gap-2">
                          <div><p className="text-xs font-semibold text-muted-foreground">Fluency</p><p className="text-xs text-foreground">{a.fluency_feedback}</p></div>
                          <div><p className="text-xs font-semibold text-muted-foreground">Vocabulary</p><p className="text-xs text-foreground">{a.vocabulary_feedback}</p></div>
                          <div><p className="text-xs font-semibold text-muted-foreground">Grammar</p><p className="text-xs text-foreground">{a.grammar_feedback}</p></div>
                          <div><p className="text-xs font-semibold text-muted-foreground">Pronunciation</p><p className="text-xs text-foreground">{a.pronunciation_feedback}</p></div>
                        </div>
                      )}
                      {a.suggestions && a.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Suggestions</p>
                          <ul className="space-y-1">
                            {a.suggestions.map((s, j) => (
                              <li key={j} className="text-xs text-muted-foreground flex gap-1"><span className="text-primary">•</span>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
