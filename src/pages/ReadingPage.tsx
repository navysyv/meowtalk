import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Check, X, Zap } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { readingPassages } from "@/data/readingPassages";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";
import { isMockUrl, isMockActive, recordBand } from "@/lib/mockState";

const MOCK_PASSAGE_COUNT = 3;
function pickMockPassages() {
  const pool = [...readingPassages];
  const out: typeof readingPassages = [];
  for (let i = 0; i < MOCK_PASSAGE_COUNT && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

const ReadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const inMock = isMockUrl(location.search) && isMockActive();
  const [mockMode, setMockMode] = useState(inMock);
  const [idx, setIdx] = useState(0);
  const [mockSet, setMockSet] = useState<typeof readingPassages>(() => (inMock ? pickMockPassages() : []));
  const activeList = mockMode ? mockSet : readingPassages;
  const passage = activeList[idx] ?? readingPassages[0];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; band: number; explanation: string } | null>(null);
  const [mockBands, setMockBands] = useState<number[]>([]);

  useEffect(() => {
    if (inMock) { setMockMode(true); setIdx(0); setMockSet(pickMockPassages()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCorrect = (q: typeof passage.questions[number]) =>
    (answers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase();

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-reading", {
        body: { passageId: passage.id, passage: passage.body, questions: passage.questions, answers },
      });
      if (error) throw error;
      const r = { score: data.score, total: data.total, band: data.band_score, explanation: data.explanation };
      setResult(r);
      await supabase.from("reading_attempts").insert({
        session_id: getSessionId(),
        passage_id: passage.id,
        score: r.score, total: r.total, band_score: r.band,
        answers, mistakes: data.mistakes || [], ai_explanation: r.explanation,
      });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const reset = () => { setAnswers({}); setResult(null); };
  const startMock = () => { setMockMode(true); setIdx(0); reset(); };
  const nextMock = () => {
    if (idx < readingPassages.length - 1) { setIdx(idx + 1); reset(); }
    else {
      const all = [...mockBands, result?.band ?? 0].filter((b) => b > 0);
      const avg = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
      if (inMock) {
        recordBand("reading", Math.round(avg * 2) / 2, 3);
        navigate("/practice-writing?mock=1");
      } else {
        setMockMode(false);
        navigate("/history");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-4">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
            <h1 className="text-lg font-semibold font-display">Reading Practice</h1>
          </div>
          {!mockMode ? (
            <button onClick={startMock} className="text-xs font-medium text-primary flex items-center gap-1"><Zap size={14}/>Full mock</button>
          ) : (
            <span className="text-xs text-muted-foreground">Mock {idx + 1}/{readingPassages.length}</span>
          )}
        </header>

        <div className="flex justify-center mb-4"><TalkieCat state={result ? "happy" : "idle"} size={70} /></div>

        {!mockMode && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {readingPassages.map((p, i) => (
              <button key={p.id} onClick={() => { setIdx(i); reset(); }} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${i === idx ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{p.title}</button>
            ))}
          </div>
        )}

        <div className="bg-card rounded-3xl p-6 shadow-medium mb-4">
          <h2 className="font-semibold font-display text-foreground mb-3">{passage.title}</h2>
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{passage.body}</p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-medium space-y-4">
          <h3 className="font-semibold text-foreground">Questions</h3>
          {passage.questions.map((q, i) => {
            const correct = result ? isCorrect(q) : null;
            return (
              <div key={q.id}>
                <label className="text-sm font-medium block mb-1 flex items-center gap-2">
                  {result && (correct ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />)}
                  {i + 1}. {q.question}
                </label>
                {q.type === "tfng" ? (
                  <select value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} disabled={!!result} className={`w-full px-3 py-2 rounded-xl bg-background border text-sm ${result ? (correct ? "border-green-500" : "border-red-500") : "border-border"}`}>
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
                  <input value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} disabled={!!result} className={`w-full px-3 py-2 rounded-xl bg-background border text-sm ${result ? (correct ? "border-green-500" : "border-red-500") : "border-border"}`} placeholder="Your answer" />
                )}
                {result && !correct && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Correct: <span className="font-medium text-foreground">{q.answer}</span>
                    {q.explanation && <> — {q.explanation}</>}
                  </p>
                )}
                {result && correct && q.explanation && (
                  <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                )}
              </div>
            );
          })}

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
              {result.explanation && <p className="text-sm text-foreground whitespace-pre-line">{result.explanation}</p>}
              {mockMode ? (
                <button
                  onClick={() => {
                    if (result?.band) setMockBands((b) => [...b, result.band]);
                    nextMock();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  {idx < readingPassages.length - 1 ? "Next passage →" : "Finish mock"}
                </button>
              ) : (
                <button onClick={reset} className="w-full py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium">Try again</button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;
