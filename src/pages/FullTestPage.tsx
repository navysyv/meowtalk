import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, MicOff, ArrowRight } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import QuestionCard from "@/components/QuestionCard";
import DecorativeBackground from "@/components/DecorativeBackground";
import ProgressMap from "@/components/ProgressMap";
import { part1Questions, part2Questions, part3Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart, playPurr } from "@/lib/sounds";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const timers = {
  1: { prep: 0, speak: 120 },
  2: { prep: 60, speak: 120 },
  3: { prep: 0, speak: 120 },
};

const questionsMap = { 1: part1Questions, 2: part2Questions, 3: part3Questions };

interface PartResult {
  part: number;
  band_score: number;
  fluency: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
  fluency_score: number;
  vocabulary_score: number;
  grammar_score: number;
  pronunciation_score: number;
  transcript: string;
}

type Phase = "intro" | "prep" | "speaking" | "analyzing" | "transition" | "results";

const FullTestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPart, setCurrentPart] = useState(1);
  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<PartResult[]>([]);
  const [talkieState, setTalkieState] = useState<"idle" | "listening" | "feedback">("idle");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const autoStartedRef = useRef(false);

  const shufflerRefs = useRef<Record<number, ReturnType<typeof createQuestionShuffler>>>({});
  function getShuffler(part: number) {
    if (!shufflerRefs.current[part]) {
      shufflerRefs.current[part] = createQuestionShuffler(questionsMap[part as keyof typeof questionsMap]);
    }
    return shufflerRefs.current[part];
  }

  const config = timers[currentPart as keyof typeof timers];

  const startSpeechRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalParts: string[] = [];
    recognition.onresult = (event: any) => {
      let interim = "";
      finalParts = [];
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalParts.push(event.results[i][0].transcript);
        else interim += event.results[i][0].transcript;
      }
      const full = finalParts.join(" ") + (interim ? " " + interim : "");
      transcriptRef.current = full.trim();
      setTranscript(full.trim());
    };
    recognition.onerror = (e: any) => { if (e.error !== "no-speech" && e.error !== "aborted") console.error(e.error); };
    recognition.onend = () => { if (recognitionRef.current === recognition) try { recognition.start(); } catch {} };
    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    const ref = recognitionRef.current;
    recognitionRef.current = null;
    if (ref) try { ref.stop(); } catch {}
  }, []);

  useEffect(() => () => {
    stopSpeechRecognition();
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  }, [stopSpeechRecognition]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setTalkieState("listening");
      playPurr();
      startSpeechRecognition();
    } catch {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  }, [startSpeechRecognition, toast]);

  const stopRecordingAndEvaluate = useCallback(async () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    stopSpeechRecognition();

    const spokenText = transcriptRef.current;
    if (!spokenText.trim()) {
      toast({ title: "No speech detected", variant: "destructive" });
      setPhase("speaking");
      return;
    }

    setPhase("analyzing");
    setTalkieState("feedback");

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-speech", {
        body: { transcript: spokenText, questionText: question?.text || "", part: currentPart },
      });
      if (error) throw error;

      const partResult: PartResult = {
        part: currentPart,
        band_score: data.band_score,
        fluency: data.fluency,
        vocabulary: data.vocabulary,
        grammar: data.grammar,
        pronunciation: data.pronunciation,
        fluency_score: data.fluency_score || 60,
        vocabulary_score: data.vocabulary_score || 60,
        grammar_score: data.grammar_score || 60,
        pronunciation_score: data.pronunciation_score || 60,
        transcript: spokenText,
      };

      await supabase.from("speaking_attempts").insert({
        part: currentPart,
        question_text: question?.text || "",
        transcript: spokenText,
        improved_answer: data.improved_answer_mid || data.improved_answer || "",
        band_score: data.band_score,
        fluency_feedback: data.fluency,
        vocabulary_feedback: data.vocabulary,
        grammar_feedback: data.grammar,
        pronunciation_feedback: data.pronunciation,
        suggestions: data.suggestions,
      });

      const newResults = [...results, partResult];
      setResults(newResults);

      if (currentPart < 3) {
        setPhase("transition");
      } else {
        setPhase("results");
        playSuccess();
      }
    } catch (e: any) {
      toast({ title: "Evaluation failed", description: e.message, variant: "destructive" });
      setPhase("speaking");
      setTalkieState("idle");
    }
  }, [currentPart, question, results, stopSpeechRecognition, toast]);

  useEffect(() => {
    if (phase === "speaking" && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startRecording();
    }
    if (phase !== "speaking") autoStartedRef.current = false;
  }, [phase, startRecording]);

  const startPart = useCallback((part: number) => {
    setCurrentPart(part);
    const q = getShuffler(part).next();
    setQuestion(q);
    setTranscript("");
    transcriptRef.current = "";
    setTalkieState("idle");
    playStart();
    if (timers[part as keyof typeof timers].prep > 0) {
      setPhase("prep");
    } else {
      setPhase("speaking");
    }
  }, []);

  const begin = useCallback(() => startPart(1), [startPart]);

  const nextPart = useCallback(() => {
    playClick();
    startPart(currentPart + 1);
  }, [currentPart, startPart]);

  const overallBand = results.length > 0 ? results.reduce((s, r) => s + r.band_score, 0) / results.length : 0;
  const avgScores = results.length > 0 ? {
    fluency: Math.round(results.reduce((s, r) => s + r.fluency_score, 0) / results.length),
    vocabulary: Math.round(results.reduce((s, r) => s + r.vocabulary_score, 0) / results.length),
    grammar: Math.round(results.reduce((s, r) => s + r.grammar_score, 0) / results.length),
    pronunciation: Math.round(results.reduce((s, r) => s + r.pronunciation_score, 0) / results.length),
  } : { fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Home
          </motion.button>
          <span className="text-sm text-muted-foreground font-medium">Full IELTS Simulation</span>
        </header>

        <main className="max-w-2xl mx-auto px-6 flex flex-col items-center min-h-[80vh] justify-center gap-8">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8 text-center">
                <TalkieCat state="idle" size={140} />
                <div>
                  <h1 className="text-3xl font-bold font-display tracking-tight text-foreground mb-3">Full IELTS Speaking Test</h1>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    Complete all 3 parts in sequence. Microphone starts automatically. Get your overall band score at the end.
                  </p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={begin} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow flex items-center gap-2">
                  Begin Test <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {phase === "prep" && (
              <motion.div key="prep" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
                <TalkieCat state="idle" size={100} />
                <span className="text-xs font-medium text-primary bg-lavender-soft px-3 py-1 rounded-full">Part {currentPart} of 3</span>
                <QuestionCard question={question} part={currentPart} />
                <p className="text-sm text-muted-foreground">Preparation time</p>
                <CircularTimer totalSeconds={config.prep} label="Preparation" onComplete={() => { playClick(); setPhase("speaking"); }} onExit={() => navigate("/")} />
              </motion.div>
            )}

            {phase === "speaking" && (
              <motion.div key="speaking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
                <TalkieCat state={isRecording ? "listening" : "idle"} size={100} />
                {isRecording && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    <p className="text-sm text-primary font-medium">Listening... (Part {currentPart})</p>
                  </motion.div>
                )}
                <QuestionCard question={question} part={currentPart} />
                <CircularTimer totalSeconds={config.speak} label="Speaking" onComplete={stopRecordingAndEvaluate} onExit={() => navigate("/")} autoStart />
                <motion.button whileTap={{ scale: 0.96 }} onClick={stopRecordingAndEvaluate} className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow bg-destructive text-destructive-foreground">
                  <MicOff size={24} />
                </motion.button>
                <p className="text-xs text-muted-foreground">Tap to finish Part {currentPart}</p>
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
                  <p className="text-sm font-medium">Analyzing Part {currentPart}...</p>
                </div>
              </motion.div>
            )}

            {phase === "transition" && (
              <motion.div key="transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6 text-center">
                <TalkieCat state="idle" size={120} />
                <div>
                  <p className="text-lg font-semibold font-display text-foreground mb-1">Part {currentPart} Complete!</p>
                  <p className="text-sm text-muted-foreground">Band: {results[results.length - 1]?.band_score.toFixed(1)}</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={nextPart} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow flex items-center gap-2">
                  Continue to Part {currentPart + 1} <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-6 w-full">
                <TalkieCat state="feedback" size={100} />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Overall Band Score</p>
                  <p className={`text-6xl font-bold font-display ${overallBand >= 7 ? "text-green-600" : overallBand >= 6 ? "text-primary" : "text-orange-500"}`}>
                    {overallBand.toFixed(1)}
                  </p>
                </div>

                {/* Per-part scores */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {results.map(r => (
                    <div key={r.part} className="bg-card rounded-2xl p-4 text-center shadow-soft">
                      <p className="text-xs text-muted-foreground mb-1">Part {r.part}</p>
                      <p className="text-2xl font-bold font-display text-foreground">{r.band_score.toFixed(1)}</p>
                    </div>
                  ))}
                </div>

                <ProgressMap {...avgScores} />

                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/")} className="px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium text-sm">
                    Back to Home
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/history")} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-glow">
                    View History
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

export default FullTestPage;
