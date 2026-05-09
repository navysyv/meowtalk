import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { readingPassages } from "@/data/readingPassages";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";

const ReadingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idx, setIdx] = useState(0);
  const passage = readingPassages[idx];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; band: number; explanation: string; mistakes: any[] } | null>(null);

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-reading", {
        body: { passageId: passage.id, passage: passage.body, questions: passage.questions, answers },
      });
      if (error) throw error;
      const r = { score: data.score, total: data.total, band: data.band_score, explanation: data.explanation, mistakes: data.mistakes || [] };
      setResult(r);
      await supabase.from("reading_attempts").insert({
        session_id: getSessionId(),
        passage_id: passage.id,
        score: r.score, total: r.total, band_score: r.band,
        answers, mistakes: r.mistakes, ai_explanation: r.explanation,
      });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const reset = () => { setAnswers({}); setResult(null); };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold font-display">Reading Practice</h1>
        </header>

        <div className="flex justify-center mb-4"><TalkieCat state={result ? "happy" : "idle"} size={70} /></div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {readingPassages.map((p, i) => (
            <button key={p.id} onClick={() => { setIdx(i); reset(); }} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${i === idx ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{p.title}</button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-medium mb-4">
          <h2 className="font-semibold font-display text-foreground mb-3">{passage.title}</h2>
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{passage.body}</p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-medium space-y-4">
          <h3 className="font-semibold text-foreground">Questions</h3>
          {passage.questions.map((q, i) => (
            <div key={q.id}>
              <label className="text-sm font-medium block mb-1">{i + 1}. {q.question}</label>
              {q.type === "tfng" ? (
                <select value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} disabled={!!result} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm">
                  <option value="">Select...</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                  <option value="Not Given">Not Given</option>
                </select>
              ) : q.type === "mcq" && q.options ? (
                <div className="space-y-1">
                  {q.options.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm">
                      <input type="radio" name={q.id} value={o} checked={answers[q.id] === o} onChange={() => setAnswers({ ...answers, [q.id]: o })} disabled={!!result} />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <input value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} disabled={!!result} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm" placeholder="Your answer" />
              )}
            </div>
          ))}

          {!result ? (
            <button onClick={submit} disabled={submitting} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2">
              {submitting && <Loader2 size={16} className="animate-spin" />} Submit
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

export default ReadingPage;