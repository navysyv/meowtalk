import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, ArrowRight } from "lucide-react";
import TalkieCat from "@/components/TalkieCat";
import CircularTimer from "@/components/CircularTimer";
import QuestionCard from "@/components/QuestionCard";
import FeedbackCard from "@/components/FeedbackCard";
import { part1Questions, part2Questions, part3Questions, createQuestionShuffler, type Question } from "@/data/questions";
import { playClick, playSuccess, playStart, playPurr } from "@/lib/sounds";

type Phase = "intro" | "prep" | "speaking" | "feedback";

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

// Mock feedback generator
function generateMockFeedback() {
  const bands = [5.5, 6.0, 6.5, 7.0, 7.5];
  const band = bands[Math.floor(Math.random() * bands.length)];
  return {
    band,
    fluency: band >= 7 ? "Your speech was fluent with natural pace and minimal hesitation." : "Mostly smooth but with some pauses and repetition.",
    vocabulary: band >= 7 ? "Good range of vocabulary with some less common items." : "Adequate vocabulary for the topic. Try using more topic-specific words.",
    grammar: band >= 7 ? "Good variety of complex structures with few errors." : "Mostly correct sentences with some grammatical mistakes.",
    pronunciation: band >= 7 ? "Clear and easy to understand throughout." : "Generally clear, with occasional unclear words.",
    suggestions: [
      "Use linking words more often (however, moreover, for example).",
      "Try to expand your answers with personal examples.",
      "Practice using a wider range of tenses in your responses.",
      band < 7 ? "Work on reducing hesitation by practising with a timer." : "Try incorporating more idiomatic expressions.",
    ],
  };
}

const PracticePage = () => {
  const navigate = useNavigate();
  const { part: partStr } = useParams();
  const part = parseInt(partStr || "1");
  const config = timers[part as keyof typeof timers] || timers[1];

  const [phase, setPhase] = useState<Phase>("intro");
  const [question, setQuestion] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof generateMockFeedback> | null>(null);
  const [talkieState, setTalkieState] = useState<"idle" | "listening" | "feedback" | "sleeping">("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startPractice = useCallback(() => {
    playStart();
    const q = getShuffler(part).next();
    setQuestion(q);
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

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setTalkieState("feedback");
      playSuccess();
      // Show feedback after short delay
      setTimeout(() => {
        setFeedback(generateMockFeedback());
        setPhase("feedback");
      }, 800);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setTalkieState("listening");
        playPurr();
      } catch {
        console.error("Microphone access denied");
      }
    }
  }, [isRecording]);

  const onSpeakingComplete = useCallback(() => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
    setTalkieState("feedback");
    playSuccess();
    setTimeout(() => {
      setFeedback(generateMockFeedback());
      setPhase("feedback");
    }, 800);
  }, [isRecording]);

  const exitToHome = useCallback(() => {
    // Clean up recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    navigate("/");
  }, [navigate, isRecording]);

  const practiceAgain = useCallback(() => {
    setFeedback(null);
    setTalkieState("idle");
    setIsRecording(false);
    setPhase("intro");
  }, []);

  return (
    <div className="min-h-screen bg-background bg-dots">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={exitToHome}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Home
        </motion.button>
        <span className="text-sm text-muted-foreground">Part {part} of 3</span>
      </header>

      {/* Stage */}
      <main className="max-w-2xl mx-auto px-6 flex flex-col items-center min-h-[80vh] justify-center gap-8">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <TalkieCat state="idle" size={140} />
              <div>
                <h1 className="text-4xl font-semibold font-display tracking-tight text-foreground mb-3">
                  Part {part}
                </h1>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-md">
                  {partDescriptions[part as keyof typeof partDescriptions]}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={startPractice}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-glow flex items-center gap-2"
              >
                Start Practice
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {phase === "prep" && (
            <motion.div
              key="prep"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8"
            >
              <TalkieCat state="idle" size={100} />
              <QuestionCard question={question} part={part} />
              <p className="text-sm text-muted-foreground">Preparation time — organize your ideas</p>
              <CircularTimer
                totalSeconds={config.prep}
                label="Preparation"
                onComplete={onPrepComplete}
                onExit={exitToHome}
              />
            </motion.div>
          )}

          {phase === "speaking" && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8"
            >
              <TalkieCat state={isRecording ? "listening" : "idle"} size={100} />

              {isRecording && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary font-medium"
                >
                  Talkie is listening...
                </motion.p>
              )}

              <QuestionCard question={question} part={part} />

              <CircularTimer
                totalSeconds={config.speak}
                label="Speaking"
                onComplete={onSpeakingComplete}
                onExit={exitToHome}
              />

              {/* Mic button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-glow transition-colors ${
                  isRecording
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </motion.button>
              <p className="text-xs text-muted-foreground">
                {isRecording ? "Tap to stop recording" : "Tap to start recording your answer"}
              </p>
            </motion.div>
          )}

          {phase === "feedback" && feedback && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <TalkieCat state="feedback" size={80} />
              <FeedbackCard
                {...feedback}
                onClose={exitToHome}
                onPracticeAgain={practiceAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PracticePage;
