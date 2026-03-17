import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, ArrowRight, Loader2 } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import QuestionCard from "@/components/QuestionCard";
import FeedbackCard from "@/components/FeedbackCard";
import DecorativeBackground from "@/components/DecorativeBackground";
import { part1Questions, part2Questions, part3Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart, playPurr } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Phase = "intro" | "prep" | "speaking" | "analyzing" | "feedback";

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

  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [talkieState, setTalkieState] = useState<"idle" | "listening" | "feedback" | "sleeping">("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const autoStartedRef = useRef(false);

  // Improved speech recognition - continuous, restarts on end
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let finalParts: string[] = [];

    recognition.onresult = (event: any) => {
      let interim = "";
      // Rebuild final parts from results
      finalParts = [];
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalParts.push(event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const full = finalParts.join(" ") + (interim ? " " + interim : "");
      transcriptRef.current = full.trim();
      setTranscript(full.trim());
    };

    recognition.onerror = (event: any) => {
      // Ignore no-speech errors, just keep going
      if (event.error === "no-speech" || event.error === "aborted") return;
      console.error("Speech recognition error:", event.error);
    };

    // Auto-restart if it ends unexpectedly (browser timeout)
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          // Already stopped intentionally
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    const ref = recognitionRef.current;
    recognitionRef.current = null; // Clear first to prevent auto-restart
    if (ref) {
      try { ref.stop(); } catch { /* ignore */ }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeechRecognition();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [stopSpeechRecognition]);

  const evaluateWithAI = useCallback(async (spokenText: string, questionText: string) => {
    if (!spokenText.trim()) {
      toast({ title: "No speech detected", description: "Please try again and speak clearly.", variant: "destructive" });
      setPhase("speaking");
      setTalkieState("idle");
      return;
    }

    setPhase("analyzing");
    setTalkieState("feedback");

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-speech", {
        body: { transcript: spokenText, questionText, part },
      });

      if (error) throw error;

      const aiFeedback = data as AIFeedback;
      setFeedback(aiFeedback);

      // Save to DB
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

      setPhase("feedback");
      playSuccess();
    } catch (e: any) {
      console.error("AI evaluation error:", e);
      toast({ title: "Evaluation failed", description: e.message || "Please try again.", variant: "destructive" });
      setPhase("speaking");
      setTalkieState("idle");
    }
  }, [part, toast]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
      setIsRecording(true);
      setTalkieState("listening");
      playPurr();
      startSpeechRecognition();
    } catch {
      toast({ title: "Microphone access denied", description: "Please allow microphone access.", variant: "destructive" });
    }
  }, [startSpeechRecognition, toast]);

  const stopRecordingAndEvaluate = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    stopSpeechRecognition();

    const spokenText = transcriptRef.current;
    evaluateWithAI(spokenText, question?.text || "");
  }, [stopSpeechRecognition, evaluateWithAI, question]);

  // Auto-start recording when speaking phase begins
  useEffect(() => {
    if (phase === "speaking" && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startRecording();
    }
    if (phase !== "speaking") {
      autoStartedRef.current = false;
    }
  }, [phase, startRecording]);

  const startPractice = useCallback(() => {
    playStart();
    const q = getShuffler(part).next();
    setQuestion(q);
    setTranscript("");
    transcriptRef.current = "";
    if (config.prep > 0) {
      setPhase("prep");
    } else {
      setPhase("speaking");
    }
  }, [part, config.prep]);

  const onPrepComplete = useCallback(() => {
    playClick();
    setPhase("speaking");
  }, []);

  const onSpeakingComplete = useCallback(() => {
    stopRecordingAndEvaluate();
  }, [stopRecordingAndEvaluate]);

  const repeatQuestion = useCallback(() => {
    stopSpeechRecognition();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setTranscript("");
    transcriptRef.current = "";
    setIsRecording(false);
    setTalkieState("idle");
    setFeedback(null);
    autoStartedRef.current = false;
    if (config.prep > 0) {
      setPhase("prep");
    } else {
      setPhase("speaking");
    }
  }, [config.prep, stopSpeechRecognition]);

  const exitToHome = useCallback(() => {
    stopSpeechRecognition();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    navigate("/");
  }, [navigate, stopSpeechRecognition]);

  const practiceAgain = useCallback(() => {
    setFeedback(null);
    setTranscript("");
    transcriptRef.current = "";
    setTalkieState("idle");
    setIsRecording(false);
    autoStartedRef.current = false;
    setPhase("intro");
  }, []);

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
                <TalkieCat state="idle" size={100} />
                <QuestionCard question={question} part={part} />
                <p className="text-sm text-muted-foreground">Preparation time — organize your ideas</p>
                <CircularTimer totalSeconds={config.prep} label="Preparation" onComplete={onPrepComplete} onExit={exitToHome} />
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
                <QuestionCard question={question} part={part} />
                <CircularTimer totalSeconds={config.speak} label="Speaking" onComplete={onSpeakingComplete} onExit={exitToHome} onRepeat={repeatQuestion} autoStart />

                {/* Single mic button to stop early */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={stopRecordingAndEvaluate}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow transition-all bg-destructive text-destructive-foreground hover:shadow-[0_8px_40px_-8px_hsla(25,90%,60%,0.4)]"
                >
                  <MicOff size={24} />
                </motion.button>
                <p className="text-xs text-muted-foreground">Tap to finish early</p>

                {transcript && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-secondary/30 rounded-2xl p-4 max-h-24 overflow-y-auto">
                    <p className="text-xs text-muted-foreground mb-1">Live transcript:</p>
                    <p className="text-sm text-foreground">{transcript}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {phase === "analyzing" && (
              <motion.div key="analyzing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6">
                <TalkieCat state="feedback" size={120} />
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <p className="text-sm font-medium">Transcribing & analyzing your speech...</p>
                </div>
              </motion.div>
            )}

            {phase === "feedback" && feedback && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6 w-full">
                <TalkieCat state="feedback" size={80} />
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
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PracticePage;
