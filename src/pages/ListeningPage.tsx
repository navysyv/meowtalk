import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Loader2 } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { listeningTests } from "@/data/listeningTests";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";

const ListeningPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testIdx, setTestIdx] = useState(0);
  const test = listeningTests[testIdx];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; band: number; explanation: string; mistakes: { q: string; correct: string; given: string }[] } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-listening", {
        body: { testId: test.id, transcript: test.transcript, questions: test.questions, answers },
      });
      if (error) throw error;
      const r = { score: data.score, total: data.total, band: data.band_score, explanation: data.explanation, mistakes: data.mistakes || [] };
      setResult(r);
      await supabase.from("listening_attempts").insert({
        session_id: getSessionId(),
        test_id: test.id,
        score: r.score,
        total: r.total,
        band_score: r.band,
        answers,
        mistakes: r.mistakes,
        ai_explanation: r.explanation,
      });
    } catch (e: any) {
      toast({ title: "Failed to evaluate", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold font-display">Listening Practice</h1>
        </header>

        <div className="flex justify-center mb-4"><TalkieCat state={result ? "happy" : "idle"} size={80} /></div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {listeningTests.map((t, i) => (
            <button key={t.id} onClick={() => { setTestIdx(i); reset(); }} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${i === testIdx ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
              {t.title}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-medium space-y-4">
          <div>
            <h2 className="font-semibold font-display text-foreground mb-1">{test.title}</h2>
            <p className="text-sm text-muted-foreground">{test.description}</p>
          </div>

          <audio ref={audioRef} src={test.audioUrl} onEnded={() => setPlaying(false)} />
          <button onClick={togglePlay} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "Pause" : "Play audio"}
          </button>

          <div className="space-y-3">
            {test.questions.map((q, i) => (
              <div key={q.id}>
                <label className="text-sm font-medium text-foreground block mb-1">{i + 1}. {q.question}</label>
                <input
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  disabled={!!result}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                  placeholder="Your answer"
                />
              </div>
            ))}
          </div>

          {!result ? (
            <button onClick={submit} disabled={submitting} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Submit answers
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-3 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-3xl font-bold font-display text-primary">{result.score} / {result.total}</p>
                <p className="text-sm text-muted-foreground">Band ~ {result.band.toFixed(1)}</p>
              </div>
              <p className="text-sm text-foreground whitespace-pre-line">{result.explanation}</p>
              <button onClick={reset} className="w-full py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium">Try again</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;