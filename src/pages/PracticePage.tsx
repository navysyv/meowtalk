import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { MicOff, ArrowRight, Loader2 } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import QuestionCard from "@/components/QuestionCard";
import FeedbackCard from "@/components/FeedbackCard";
import ShareResultCard from "@/components/ShareResultCard";
import DecorativeBackground from "@/components/DecorativeBackground";
import { part1Questions, part2Questions, part3Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useStreak } from "@/hooks/useStreak";

type Phase = "intro" | "prep" | "speaking" | "processing" | "analyzing" | "feedback" | "followup" | "followup-speaking" | "followup-processing" | "followup-analyzing";

const questionsMap = { 1: part1Questions, 2: part2Questions, 3: part3Questions };
const timers = {
  1: { prep: 0, speak: 120 },
  2: { prep: 60, speak: 120 },
  3: { prep: 0, speak: 120 },
};

const partDescriptions = {
  1: "Part 1 is just a friendly chat about you.\nTake a deep breath and answer naturally.",
  2: "You'll have 1 minute to prepare, then 2 minutes to speak.\nUse the prep time to organize your ideas.",
  3: "Part 3 involves deeper discussion questions.\nExpress your opinions with examples.",
};

const shufflers: Record<number, ReturnType<typeof createQuestionShuffler>> = {};
function getShuffler(part: number) {
  if (!shufflers[part]) {
    shufflers[part] = createQuestionShuffler(questionsMap[part as keyof typeof questionsMap]);
  }
  return shufflers[part];
}

interface AIFeedback {
  band_score: number;
  fluency: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
  fluency_score?: number;
  vocabulary_score?: number;
  grammar_score?: number;
  pronunciation_score?: number;
  improved_answer?: string;
  improved_answer_mid?: string;
  improved_answer_high?: string;
  suggestions: string[];
  mistakes: { original: string; corrected: string; explanation: string }[];
}

const PracticePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { part: partStr } = useParams();
  const part = parseInt(partStr || "1");
  const config = timers[part as keyof typeof timers] || timers[1];
  const { recordPractice } = useStreak();

  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [talkieState, setTalkieState] = useState<"idle" | "listening" | "feedback" | "sleeping" | "thinking" | "happy" | "impressed">("idle");
  const autoStartedRef = useRef(false);
  const questionRef = useRef<Question | null>(null);

  // Follow-up state
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [currentFollowUp, setCurrentFollowUp] = useState(0);
  const [followUpTranscript, setFollowUpTranscript] = useState("");

  useEffect(() => { questionRef.current = question; }, [question]);

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    if (!text) {
      setPhase("intro");
      setTalkieState("idle");
      return;
    }
    evaluateWithAI(text, questionRef.current?.text || "");
  }, []);

  const handleFollowUpTranscript = useCallback((text: string) => {
    setFollowUpTranscript(text);
    if (!text) {
      setPhase("feedback");
      setTalkieState("happy");
      return;
    }
    // Just show they answered, go back to feedback
    setPhase("feedback");
    setTalkieState("happy");
    toast({ title: "Great follow-up answer! 🐱" });
  }, [toast]);

  const { isRecording, isProcessing, startRecording, stopAndTranscribe, reset: resetRecorder } = useVoiceRecorder({
    onTranscript: phase.startsWith("followup") ? handleFollowUpTranscript : handleTranscript,
  });

  useEffect(() => {
    if (isRecording) setTalkieState("listening");
    else if (isProcessing) setTalkieState("thinking");
  }, [isRecording, isProcessing]);

  useEffect(() => {
    if (isProcessing && phase === "speaking") setPhase("processing");
    if (isProcessing && phase === "followup-speaking") setPhase("followup-processing");
  }, [isProcessing, phase]);

  const generateFollowUps = useCallback(async (questionText: string, spokenText: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-followup", {
        body: { questionText, transcript: spokenText, part },
      });
      if (!error && data?.questions) {
        setFollowUpQuestions(data.questions);
      }
    } catch {
      // Follow-ups are optional, don't block
    }
  }, [part]);

  const evaluateWithAI = useCallback(async (spokenText: string, questionText: string) => {
    setPhase("analyzing");
    setTalkieState("thinking");

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-speech", {
        body: { transcript: spokenText, questionText, part },
      });

      if (error) throw error;

      const aiFeedback = data as AIFeedback;
      setFeedback(aiFeedback);

      await supabase.from("speaking_attempts").insert({
        part,
        question_text: questionText,
        transcript: spokenText,
        improved_answer: aiFeedback.improved_answer_mid || aiFeedback.improved_answer || "",
        band_score: aiFeedback.band_score,
        fluency_feedback: aiFeedback.fluency,
        vocabulary_feedback: aiFeedback.vocabulary,
        grammar_feedback: aiFeedback.grammar,
        pronunciation_feedback: aiFeedback.pronunciation,
        suggestions: aiFeedback.suggestions,
      });

      // Record practice for streak
      await recordPractice();

      // Generate follow-up questions in parallel
      generateFollowUps(questionText, spokenText);

      setPhase("feedback");
      setTalkieState(aiFeedback.band_score >= 7 ? "impressed" : aiFeedback.band_score >= 5.5 ? "happy" : "feedback");
      playSuccess();
    } catch (e: any) {
      console.error("AI evaluation error:", e);
      toast({ title: "Evaluation failed", description: e.message || "Please try again.", variant: "destructive" });
      setPhase("intro");
      setTalkieState("idle");
    }
  }, [part, toast, recordPractice, generateFollowUps]);

  // Auto-start recording when speaking phase begins
  useEffect(() => {
    if ((phase === "speaking" || phase === "followup-speaking") && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startRecording();
    }
    if (phase !== "speaking" && phase !== "followup-speaking") {
      autoStartedRef.current = false;
    }
  }, [phase, startRecording]);

  const startPractice = useCallback(() => {
    playStart();
    const q = getShuffler(part).next();
    setQuestion(q);
    setTranscript("");
    setFollowUpQuestions([]);
    setCurrentFollowUp(0);
    resetRecorder();
    if (config.prep > 0) {
      setPhase("prep");
    } else {
      setPhase("speaking");
    }
  }, [part, config.prep, resetRecorder]);

  const onPrepComplete = useCallback(() => {
    playClick();
    setPhase("speaking");
  }, []);

  const onSpeakingComplete = useCallback(() => {
    stopAndTranscribe();
  }, [stopAndTranscribe]);

  const startFollowUp = useCallback((index: number) => {
    setCurrentFollowUp(index);
    resetRecorder();
    setFollowUpTranscript("");
    setPhase("followup-speaking");
  }, [resetRecorder]);

  const repeatQuestion = useCallback(() => {
    resetRecorder();
    setTranscript("");
    setTalkieState("idle");
    setFeedback(null);
    setFollowUpQuestions([]);
    autoStartedRef.current = false;
    if (config.prep > 0) {
      setPhase("prep");
    } else {
      setPhase("speaking");
    }
  }, [config.prep, resetRecorder]);

  const exitToHome = useCallback(() => {
    resetRecorder();
    navigate("/");
  }, [navigate, resetRecorder]);

  const practiceAgain = useCallback(() => {
    setFeedback(null);
    setTranscript("");
    setFollowUpQuestions([]);
    resetRecorder();
    setTalkieState("idle");
    setPhase("intro");
  }, [resetRecorder]);

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <motion.button whileTap={{ scale: 0.96 }} onClick={exitToHome} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Home
          </motion.button>
          <span className="text-sm text-muted-foreground">Part {part} of 3</span>
        </header>

        <main className="max-w-2xl mx-auto px-6 flex flex-col items-center min-h-[80vh] justify-center gap-8">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8 text-center">
                <TalkieCat state="idle" size={140} />
                <div>
                  <h1 className="text-4xl font-semibold font-display tracking-tight text-foreground mb-3">Part {part}</h1>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-md">{partDescriptions[part as keyof typeof partDescriptions]}</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={startPractice} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow flex items-center gap-2">
                  Start Practice <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {phase === "prep" && (
              <motion.div key="prep" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
                <TalkieCat state="thinking" size={100} />
                <QuestionCard question={question} part={part} />
                <p className="text-sm text-muted-foreground">Preparation time — organize your ideas</p>
                <CircularTimer totalSeconds={config.prep} label="Preparation" onComplete={onPrepComplete} onExit={exitToHome} />
              </motion.div>
            )}

            {(phase === "speaking" || phase === "followup-speaking") && (
              <motion.div key="speaking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
                <TalkieCat state={isRecording ? "listening" : "idle"} size={100} />
                {isRecording && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    <p className="text-sm text-primary font-medium">Listening...</p>
                  </motion.div>
                )}
                {phase === "followup-speaking" && followUpQuestions[currentFollowUp] && (
                  <div className="bg-card rounded-2xl p-4 shadow-soft text-center max-w-md">
                    <p className="text-xs text-primary font-medium mb-1">Follow-up Question</p>
                    <p className="text-sm text-foreground font-medium">{followUpQuestions[currentFollowUp]}</p>
                  </div>
                )}
                {phase === "speaking" && <QuestionCard question={question} part={part} />}
                <CircularTimer
                  totalSeconds={phase === "followup-speaking" ? 60 : config.speak}
                  label={phase === "followup-speaking" ? "Follow-up" : "Speaking"}
                  onComplete={onSpeakingComplete}
                  onExit={exitToHome}
                  onRepeat={phase === "speaking" ? repeatQuestion : undefined}
                  autoStart
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => stopAndTranscribe()}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow transition-all bg-destructive text-destructive-foreground hover:shadow-[0_8px_40px_-8px_hsla(25,90%,60%,0.4)]"
                >
                  <MicOff size={24} />
                </motion.button>
                <p className="text-xs text-muted-foreground">Tap to finish early</p>
              </motion.div>
            )}

            {(phase === "processing" || phase === "followup-processing") && (
              <motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6">
                <TalkieCat state="thinking" size={120} />
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <p className="text-sm font-medium">Processing speech...</p>
                </div>
              </motion.div>
            )}

            {(phase === "analyzing" || phase === "followup-analyzing") && (
              <motion.div key="analyzing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6">
                <TalkieCat state="thinking" size={120} />
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <p className="text-sm font-medium">Analyzing your speech...</p>
                </div>
              </motion.div>
            )}

            {phase === "feedback" && feedback && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6 w-full">
                <TalkieCat state={feedback.band_score >= 7 ? "impressed" : "happy"} size={80} />
                <FeedbackCard
                  band={feedback.band_score}
                  fluency={feedback.fluency}
                  vocabulary={feedback.vocabulary}
                  grammar={feedback.grammar}
                  pronunciation={feedback.pronunciation}
                  suggestions={feedback.suggestions}
                  transcript={transcript}
                  improvedAnswerMid={feedback.improved_answer_mid}
                  improvedAnswerHigh={feedback.improved_answer_high}
                  improvedAnswer={feedback.improved_answer}
                  mistakes={feedback.mistakes}
                  onClose={exitToHome}
                  onPracticeAgain={practiceAgain}
                />

                {/* Share */}
                <ShareResultCard
                  bandScore={feedback.band_score}
                  fluencyScore={feedback.fluency_score}
                  vocabularyScore={feedback.vocabulary_score}
                  grammarScore={feedback.grammar_score}
                  pronunciationScore={feedback.pronunciation_score}
                />

                {/* Follow-up questions */}
                {followUpQuestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-card rounded-3xl p-5 shadow-soft space-y-3"
                  >
                    <p className="text-sm font-semibold font-display text-foreground">🎤 Follow-up Questions</p>
                    <p className="text-xs text-muted-foreground">Like a real IELTS examiner — answer to practice more!</p>
                    <div className="space-y-2">
                      {followUpQuestions.map((q, i) => (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => startFollowUp(i)}
                          className="w-full text-left p-3 rounded-2xl bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-colors flex items-center gap-2"
                        >
                          <span className="text-primary font-medium">{i + 1}.</span>
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PracticePage;
