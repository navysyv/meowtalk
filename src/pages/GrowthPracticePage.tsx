import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MicOff, ArrowRight, Loader2, BookOpen, Sparkles } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import DecorativeBackground from "@/components/DecorativeBackground";
import { part1Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useStreak } from "@/hooks/useStreak";

type Phase = "intro" | "speaking" | "processing" | "analyzing" | "results";

interface GrowthResult {
  transcript: string;
  improved_answer: string;
  vocabulary_words: { word: string; meaning: string; example: string }[];
  grammar_fix: { original: string; corrected: string; explanation: string };
  useful_phrase: { phrase: string; usage: string };
}

const shuffler = createQuestionShuffler(part1Questions);

const GrowthPracticePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recordPractice } = useStreak();

  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<GrowthResult | null>(null);
  const [talkieState, setTalkieState] = useState<"idle" | "listening" | "thinking" | "happy" | "impressed">("idle");
  const autoStartedRef = useRef(false);
  const questionRef = useRef<Question | null>(null);

  useEffect(() => { questionRef.current = question; }, [question]);

  const handleTranscript = useCallback(async (text: string) => {
    if (!text) {
      toast({ title: "No speech detected", variant: "destructive" });
      setPhase("intro");
      setTalkieState("idle");
      return;
    }

    setPhase("analyzing");
    setTalkieState("thinking");

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-growth", {
        body: { transcript: text, questionText: questionRef.current?.text || "" },
      });
      if (error) throw error;

      setResult({
        transcript: text,
        improved_answer: data.improved_answer || "",
        vocabulary_words: data.vocabulary_words || [],
        grammar_fix: data.grammar_fix || { original: "", corrected: "", explanation: "" },
        useful_phrase: data.useful_phrase || { phrase: "", usage: "" },
      });

      await supabase.from("speaking_attempts").insert({
        part: 0, // 0 = growth mode
        question_text: questionRef.current?.text || "",
        transcript: text,
        improved_answer: data.improved_answer || "",
        band_score: null,
        fluency_feedback: null,
        vocabulary_feedback: null,
        grammar_feedback: null,
        pronunciation_feedback: null,
        suggestions: [],
      });

      await recordPractice();
      setPhase("results");
      setTalkieState("happy");
      playSuccess();
    } catch (e: any) {
      console.error("Growth evaluation error:", e);
      toast({ title: "Evaluation failed", description: e.message, variant: "destructive" });
      setPhase("intro");
      setTalkieState("idle");
    }
  }, [toast, recordPractice]);

  const { isRecording, isProcessing, startRecording, stopAndTranscribe, reset: resetRecorder } = useVoiceRecorder({
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    if (isRecording) setTalkieState("listening");
    else if (isProcessing) setTalkieState("thinking");
  }, [isRecording, isProcessing]);

  useEffect(() => {
    if (isProcessing && phase === "speaking") setPhase("processing");
  }, [isProcessing, phase]);

  useEffect(() => {
    if (phase === "speaking" && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startRecording();
    }
    if (phase !== "speaking") autoStartedRef.current = false;
  }, [phase, startRecording]);

  const start = useCallback(() => {
    playStart();
    setQuestion(shuffler.next());
    resetRecorder();
    setResult(null);
    setPhase("speaking");
  }, [resetRecorder]);

  const exit = useCallback(() => { resetRecorder(); navigate("/"); }, [navigate, resetRecorder]);

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <motion.button whileTap={{ scale: 0.96 }} onClick={exit} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Home
          </motion.button>
          <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5"><BookOpen size={14} /> English Growth</span>
        </header>

        <main className="max-w-2xl mx-auto px-6 flex flex-col items-center min-h-[80vh] justify-center gap-8">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8 text-center">
                <TalkieCat state="idle" size={140} />
                <div>
                  <h1 className="text-3xl font-bold font-display tracking-tight text-foreground mb-3">Daily English Practice</h1>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    Answer a question for 1–2 minutes. MeowTalk will improve your answer and teach you new vocabulary and grammar.
                  </p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={start} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow transition-shadow flex items-center gap-2">
                  Start Speaking <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {phase === "speaking" && (
              <motion.div key="speaking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
                <TalkieCat state={isRecording ? "listening" : "idle"} size={100} />
                {isRecording && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    <p className="text-sm text-primary font-medium">Listening...</p>
                  </motion.div>
                )}
                <div className="bg-card rounded-2xl p-5 shadow-soft text-center max-w-md">
                  <p className="text-foreground font-medium">{question?.text}</p>
                </div>
                <CircularTimer totalSeconds={120} label="Speaking" onComplete={() => stopAndTranscribe()} onExit={exit} autoStart />
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => stopAndTranscribe()} className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow bg-destructive text-destructive-foreground">
                  <MicOff size={24} />
                </motion.button>
                <p className="text-xs text-muted-foreground">Tap to finish</p>
              </motion.div>
            )}

            {(phase === "processing" || phase === "analyzing") && (
              <motion.div key="proc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6">
                <TalkieCat state="thinking" size={120} />
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <p className="text-sm font-medium">{phase === "processing" ? "Processing speech..." : "Analyzing & preparing lessons..."}</p>
                </div>
              </motion.div>
            )}

            {phase === "results" && result && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-5 w-full">
                <TalkieCat state="happy" size={80} />

                {/* Original vs Improved */}
                <div className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-3">
                  <p className="text-sm font-semibold font-display text-foreground">Your Answer</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.transcript}</p>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-semibold font-display text-primary flex items-center gap-1.5"><Sparkles size={14} /> Improved Version</p>
                    <p className="text-sm text-foreground leading-relaxed mt-1">{result.improved_answer}</p>
                  </div>
                </div>

                {/* Vocabulary */}
                {result.vocabulary_words.length > 0 && (
                  <div className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-3">
                    <p className="text-sm font-semibold font-display text-foreground">📚 New Vocabulary</p>
                    <div className="space-y-2">
                      {result.vocabulary_words.map((v, i) => (
                        <div key={i} className="bg-secondary/50 rounded-2xl p-3">
                          <p className="text-sm font-semibold text-foreground">{v.word}</p>
                          <p className="text-xs text-muted-foreground">{v.meaning}</p>
                          <p className="text-xs text-primary mt-1 italic">"{v.example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grammar Fix */}
                {result.grammar_fix.original && (
                  <div className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-2">
                    <p className="text-sm font-semibold font-display text-foreground">✏️ Grammar Fix</p>
                    <p className="text-xs text-destructive line-through">{result.grammar_fix.original}</p>
                    <p className="text-xs text-green-600 font-medium">{result.grammar_fix.corrected}</p>
                    <p className="text-xs text-muted-foreground">{result.grammar_fix.explanation}</p>
                  </div>
                )}

                {/* Useful Phrase */}
                {result.useful_phrase.phrase && (
                  <div className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-2">
                    <p className="text-sm font-semibold font-display text-foreground">💡 Useful Phrase</p>
                    <p className="text-sm font-medium text-primary">"{result.useful_phrase.phrase}"</p>
                    <p className="text-xs text-muted-foreground">{result.useful_phrase.usage}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.96 }} onClick={exit} className="px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium text-sm">
                    Home
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={start} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-glow">
                    Practice Again
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default GrowthPracticePage;
