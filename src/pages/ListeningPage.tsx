import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Pause, Loader2, Check, X, Zap, Clock } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { listeningTests } from "@/data/listeningTests";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";
import { isMockUrl, recordBand, isMockActive } from "@/lib/mockState";

// Cambridge IELTS Listening test = 30 minutes (+10 min transfer in paper test).
const LISTENING_DURATION_SEC = 30 * 60;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const ListeningPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const inMock = isMockUrl(location.search) && isMockActive();
  const [mockMode, setMockMode] = useState(inMock);
  const [testIdx, setTestIdx] = useState(0);
  const test = listeningTests[testIdx];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; band: number; explanation: string } | null>(null);
  const [mockBands, setMockBands] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(LISTENING_DURATION_SEC);
  const [timerActive, setTimerActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (inMock) { setMockMode(true); setTestIdx(0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer — Cambridge IELTS exam style.
  useEffect(() => {
    if (!timerActive || result) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      toast({ title: "Time's up", description: "Auto-submitting your answers." });
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, timeLeft, result]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (!timerActive && !result) setTimerActive(true);
    }
    setPlaying(!playing);
  };

  const isCorrect = (q: typeof test.questions[number]) =>
    (answers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase();

  const submit = async () => {
    setTimerActive(false);
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-listening", {
        body: { testId: test.id, transcript: test.transcript, questions: test.questions, answers },
      });
      if (error) throw error;
      const r = { score: data.score, total: data.total, band: data.band_score, explanation: data.explanation };
      setResult(r);
      await supabase.from("listening_attempts").insert({
        session_id: getSessionId(),
        test_id: test.id,
        score: r.score,
        total: r.total,
        band_score: r.band,
        answers,
        mistakes: data.mistakes || [],
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
    setTimeLeft(LISTENING_DURATION_SEC);
    setTimerActive(false);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startMock = () => {
    setMockMode(true);
    setTestIdx(0);
    reset();
  };

  const nextMockSection = () => {
    if (testIdx < listeningTests.length - 1) {
      setTestIdx(testIdx + 1);
      reset();
    } else {
      // End of listening — record average band and advance to Reading.
      const all = [...mockBands, result?.band ?? 0].filter((b) => b > 0);
      const avg = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
      if (inMock) {
        recordBand("listening", Math.round(avg * 2) / 2, 2);
        navigate("/practice-reading?mock=1");
      } else {
        setMockMode(false);
        navigate("/history");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-4">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
            <h1 className="text-lg font-semibold font-display">Listening Practice</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${timeLeft < 60 ? "bg-red-500/10 text-red-500" : "bg-secondary text-foreground"}`}>
              <Clock size={12} />
              {formatTime(timeLeft)}
            </div>
            {!mockMode ? (
              <button onClick={startMock} className="text-xs font-medium text-primary flex items-center gap-1"><Zap size={14}/>Full mock</button>
            ) : (
              <span className="text-xs text-muted-foreground">Mock {testIdx + 1}/{listeningTests.length}</span>
            )}
          </div>
        </header>

        <div className="flex justify-center mb-4"><TalkieCat state={result ? "happy" : "idle"} size={80} /></div>

        {!mockMode && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {listeningTests.map((t, i) => (
              <button key={t.id} onClick={() => { setTestIdx(i); reset(); }} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${i === testIdx ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                {t.title}
              </button>
            ))}
          </div>
        )}

        <div className="bg-card rounded-3xl p-6 shadow-medium space-y-4">
          <div className="border-b border-border pb-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">IELTS Listening</p>
            <h2 className="font-semibold font-display text-foreground">{test.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Questions 1–{test.questions.length} • Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
            </p>
          </div>

          <audio ref={audioRef} src={test.audioUrl} onEnded={() => setPlaying(false)} />
          <div className="flex items-center justify-between bg-secondary/50 rounded-2xl px-3 py-2">
            <button onClick={togglePlay} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? "Pause" : "Play audio"}
            </button>
            <span className="text-xs text-muted-foreground pr-2">Audio plays once in real exam</span>
          </div>

          <div className="space-y-3">
            {test.questions.map((q, i) => {
              const correct = result ? isCorrect(q) : null;
              return (
                <div key={q.id}>
                  <label className="text-sm font-medium text-foreground block mb-1 flex items-center gap-2">
                    {result && (correct ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />)}
                    <span className="font-mono text-primary mr-1">{i + 1}.</span> {q.question}
                  </label>
                  {q.type === "mcq" && q.options ? (
                    <div className="space-y-1">
                      {q.options.map((o) => (
                        <label key={o} className="flex items-center gap-2 text-sm">
                          <input type="radio" name={q.id} value={o} checked={answers[q.id] === o} onChange={() => setAnswers({ ...answers, [q.id]: o })} disabled={!!result} />
                          {o}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      disabled={!!result}
                      className={`w-full px-3 py-2 rounded-xl bg-background border text-sm ${result ? (correct ? "border-green-500" : "border-red-500") : "border-border"}`}
                      placeholder="Your answer"
                    />
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
              {result.explanation && <p className="text-sm text-foreground whitespace-pre-line">{result.explanation}</p>}
              {mockMode ? (
                <button
                  onClick={() => {
                    if (result?.band) setMockBands((b) => [...b, result.band]);
                    nextMockSection();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  {testIdx < listeningTests.length - 1 ? "Next test →" : "Finish mock"}
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

export default ListeningPage;
