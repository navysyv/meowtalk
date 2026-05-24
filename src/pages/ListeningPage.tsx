import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Pause, Loader2, Check, X, Zap, Clock, RotateCcw, Volume2 } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { listeningTests } from "@/data/listeningTests";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";
import { isMockUrl, recordBand, isMockActive } from "@/lib/mockState";

// Cambridge IELTS Listening test = 30 minutes (+10 min transfer in paper test).
const LISTENING_DURATION_SEC = 30 * 60;
const MOCK_MAX_PLAYS = 1; // Real exam: audio plays once.

type Accent = "en-GB" | "en-US";

/** Pick the most natural-sounding voice for the requested accent. */
const pickVoice = (voices: SpeechSynthesisVoice[], accent: Accent): SpeechSynthesisVoice | null => {
  if (!voices.length) return null;
  const matchAccent = voices.filter((v) => v.lang?.toLowerCase().startsWith(accent.toLowerCase()));
  const pool = matchAccent.length ? matchAccent : voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  // Prefer high-quality neural voices by name hints.
  const priorityHints = [
    /natural/i, /neural/i, /premium/i, /enhanced/i,
    /google.*(uk|us|english)/i, /microsoft.*(aria|jenny|guy|libby|sonia|ryan|natasha)/i,
    /samantha/i, /daniel/i, /karen/i, /serena/i, /moira/i, /tessa/i,
  ];
  for (const re of priorityHints) {
    const v = pool.find((x) => re.test(x.name));
    if (v) return v;
  }
  // Avoid eSpeak / compact / "Microsoft David"-style robotic ones.
  const nonRobotic = pool.find((v) => !/espeak|compact|david\b/i.test(v.name));
  return nonRobotic || pool[0];
};

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
  const [playCount, setPlayCount] = useState(0);
  const [rate, setRate] = useState(1);
  const [accent, setAccent] = useState<Accent>("en-GB");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (inMock) { setMockMode(true); setTestIdx(0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load available voices (some browsers populate them async).
  useEffect(() => {
    if (!ttsSupported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [ttsSupported]);

  // Stop TTS on unmount or test change.
  useEffect(() => {
    return () => {
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  useEffect(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setPlaying(false);
  }, [testIdx, ttsSupported]);

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

  const speak = () => {
    if (!ttsSupported) {
      toast({ title: "Audio not supported", description: "Your browser doesn't support speech playback.", variant: "destructive" });
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(test.transcript);
    const v = pickVoice(voices.length ? voices : window.speechSynthesis.getVoices(), accent);
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    } else {
      u.lang = accent;
    }
    u.rate = mockMode ? 1 : rate;
    u.pitch = 1;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
    setPlayCount((c) => c + 1);
    if (mockMode && !timerActive && !result) setTimerActive(true);
  };

  const togglePlay = () => {
    if (!ttsSupported) return;
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
      return;
    }
    if (window.speechSynthesis.paused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setPlaying(true);
      return;
    }
    if (mockMode && playCount >= MOCK_MAX_PLAYS) {
      toast({ title: "Audio plays once", description: "In mock mode the recording plays only once, like the real exam." });
      return;
    }
    speak();
  };

  const replay = () => {
    if (!ttsSupported) return;
    if (mockMode) return;
    speak();
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
      const { getOwner } = await import("@/lib/owner");
      const owner = await getOwner();
      await supabase.from("listening_attempts").insert({
        session_id: owner.session_id, user_id: owner.user_id,
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
    setPlayCount(0);
    if (ttsSupported) window.speechSynthesis.cancel();
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

          <div className="bg-secondary/50 rounded-2xl px-3 py-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                disabled={mockMode && playCount >= MOCK_MAX_PLAYS && !playing}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? "Pause" : playCount === 0 ? "Play audio" : "Resume"}
              </button>
              {!mockMode && (
                <button
                  onClick={replay}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card text-foreground text-sm font-medium border border-border"
                  title="Replay from start"
                >
                  <RotateCcw size={14} /> Replay
                </button>
              )}
              <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                <Volume2 size={12} />
                {mockMode ? `Plays ${playCount}/${MOCK_MAX_PLAYS}` : `Plays: ${playCount}`}
              </span>
            </div>
            {!mockMode && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Speed</span>
                {[0.8, 1, 1.2].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`px-2 py-0.5 rounded-full ${rate === r ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Accent</span>
              {(["en-GB", "en-US"] as Accent[]).map((a) => (
                <button
                  key={a}
                  onClick={() => { setAccent(a); if (ttsSupported) window.speechSynthesis.cancel(); setPlaying(false); }}
                  className={`px-2 py-0.5 rounded-full ${accent === a ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
                >
                  {a === "en-GB" ? "🇬🇧 UK" : "🇺🇸 US"}
                </button>
              ))}
              {(() => {
                const v = pickVoice(voices, accent);
                return v ? <span className="ml-1 truncate max-w-[140px]">{v.name}</span> : <span className="ml-1 italic">default voice</span>;
              })()}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {mockMode
                ? "Mock mode: audio plays once, timer is strict — just like the real Cambridge IELTS exam."
                : "Practice mode: replay as many times as you like and adjust the speed."}
            </p>
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
