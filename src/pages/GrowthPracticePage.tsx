import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MicOff, ArrowRight, Loader2, BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import DecorativeBackground from "@/components/DecorativeBackground";
import { part1Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart, playMeow } from "@/lib/sounds";
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

interface Flashcard {
  front: string;
  back: string;
  type: "grammar" | "vocabulary" | "phrase";
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
  const [retryCount, setRetryCount] = useState(0);

  // Flashcard state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => { questionRef.current = question; }, [question]);

  const buildFlashcards = useCallback((data: GrowthResult): Flashcard[] => {
    const cards: Flashcard[] = [];
    if (data.grammar_fix?.original) {
      cards.push({
        front: `❌ "${data.grammar_fix.original}"`,
        back: `✅ "${data.grammar_fix.corrected}"\n\n${data.grammar_fix.explanation}`,
        type: "grammar",
      });
    }
    data.vocabulary_words?.forEach((v) => {
      cards.push({
        front: `📚 ${v.word}`,
        back: `${v.meaning}\n\nExample: "${v.example}"`,
        type: "vocabulary",
      });
    });
    if (data.useful_phrase?.phrase) {
      cards.push({
        front: `💡 "${data.useful_phrase.phrase}"`,
        back: data.useful_phrase.usage,
        type: "phrase",
      });
    }
    return cards;
  }, []);

  const evaluateGrowth = useCallback(async (text: string, attempt = 0) => {
    setPhase("analyzing");
    setTalkieState("thinking");

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-growth", {
        body: { transcript: text, questionText: questionRef.current?.text || "" },
      });

      if (error) {
        // Retry once automatically
        if (attempt < 1) {
          console.warn("Growth evaluation failed, retrying...", error);
          setRetryCount(attempt + 1);
          return evaluateGrowth(text, attempt + 1);
        }
        throw error;
      }

      const growthResult: GrowthResult = {
        transcript: text,
        improved_answer: data.improved_answer || text,
        vocabulary_words: data.vocabulary_words || [],
        grammar_fix: data.grammar_fix || { original: "", corrected: "", explanation: "" },
        useful_phrase: data.useful_phrase || { phrase: "", usage: "" },
      };

      setResult(growthResult);
      setFlashcards(buildFlashcards(growthResult));
      setCurrentCard(0);
      setCardFlipped(false);

      await supabase.from("speaking_attempts").insert({
        part: 0,
        question_text: questionRef.current?.text || "",
        transcript: text,
        improved_answer: growthResult.improved_answer,
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
      // Still show results with just the transcript
      const fallbackResult: GrowthResult = {
        transcript: text,
        improved_answer: text,
        vocabulary_words: [],
        grammar_fix: { original: "", corrected: "", explanation: "" },
        useful_phrase: { phrase: "", usage: "" },
      };
      setResult(fallbackResult);
      setFlashcards([]);
      setPhase("results");
      setTalkieState("happy");
      toast({ title: "AI analysis unavailable", description: "Your speech was captured. Try again for detailed feedback.", variant: "destructive" });
    }
  }, [toast, recordPractice, buildFlashcards]);

  const handleTranscript = useCallback(async (text: string) => {
    if (!text) {
      // Don't show "no speech detected" toast for very short attempts, just retry
      toast({ title: "Try again", description: "Speak a bit louder or closer to your microphone.", variant: "destructive" });
      setPhase("intro");
      setTalkieState("idle");
      return;
    }
    evaluateGrowth(text);
  }, [toast, evaluateGrowth]);

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
    setFlashcards([]);
    setRetryCount(0);
    setPhase("speaking");
  }, [resetRecorder]);

  const exit = useCallback(() => { resetRecorder(); navigate("/"); }, [navigate, resetRecorder]);

  const nextCard = () => {
    playClick();
    setCardFlipped(false);
    setCurrentCard((c) => Math.min(c + 1, flashcards.length - 1));
  };

  const prevCard = () => {
    playClick();
    setCardFlipped(false);
    setCurrentCard((c) => Math.max(c - 1, 0));
  };

  const flipCard = () => {
    playClick();
    setCardFlipped(!cardFlipped);
  };

  const cardTypeColor: Record<string, string> = {
    grammar: "bg-destructive/10 text-destructive",
    vocabulary: "bg-primary/10 text-primary",
    phrase: "bg-accent/20 text-accent-foreground",
  };

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
                  {result.improved_answer && result.improved_answer !== result.transcript && (
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-semibold font-display text-primary flex items-center gap-1.5"><Sparkles size={14} /> Improved Version</p>
                      <p className="text-sm text-foreground leading-relaxed mt-1">{result.improved_answer}</p>
                    </div>
                  )}
                </div>

                {/* Key Corrections */}
                {result.grammar_fix?.original && (
                  <div className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-2">
                    <p className="text-sm font-semibold font-display text-foreground">✏️ Key Correction</p>
                    <p className="text-xs text-destructive line-through">{result.grammar_fix.original}</p>
                    <p className="text-xs text-primary font-medium">{result.grammar_fix.corrected}</p>
                    <p className="text-xs text-muted-foreground">{result.grammar_fix.explanation}</p>
                  </div>
                )}

                {/* Flashcards */}
                {flashcards.length > 0 && (
                  <div className="w-full space-y-3">
                    <p className="text-sm font-semibold font-display text-foreground px-1">🃏 Flashcards</p>
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={flipCard}
                        className="w-full bg-card rounded-3xl p-6 shadow-medium min-h-[160px] flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden"
                      >
                        {/* Card type badge */}
                        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cardTypeColor[flashcards[currentCard]?.type] || ""}`}>
                          {flashcards[currentCard]?.type}
                        </span>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${currentCard}-${cardFlipped}`}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">
                              {cardFlipped ? flashcards[currentCard]?.back : flashcards[currentCard]?.front}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                        <p className="text-[10px] text-muted-foreground mt-4">
                          {cardFlipped ? "Tap to see front" : "Tap to reveal"}
                        </p>
                      </motion.button>

                      {/* Navigation */}
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={prevCard}
                          disabled={currentCard === 0}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronLeft size={16} className="text-secondary-foreground" />
                        </motion.button>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {currentCard + 1} / {flashcards.length}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={nextCard}
                          disabled={currentCard === flashcards.length - 1}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30"
                        >
                          <ChevronRight size={16} className="text-secondary-foreground" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vocabulary list (compact) */}
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

                {/* Useful Phrase */}
                {result.useful_phrase?.phrase && (
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
