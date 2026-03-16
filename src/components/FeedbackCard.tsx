import { motion } from "framer-motion";

interface Mistake {
  original: string;
  corrected: string;
  explanation: string;
}

interface FeedbackCardProps {
  band: number;
  fluency: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
  suggestions: string[];
  transcript?: string;
  improvedAnswer?: string;
  mistakes?: Mistake[];
  onClose: () => void;
  onPracticeAgain: () => void;
}

const criteria = [
  { key: "fluency", label: "Fluency & Coherence" },
  { key: "vocabulary", label: "Lexical Resource" },
  { key: "grammar", label: "Grammar Range" },
  { key: "pronunciation", label: "Pronunciation" },
] as const;

const FeedbackCard = ({
  band, fluency, vocabulary, grammar, pronunciation, suggestions,
  transcript, improvedAnswer, mistakes,
  onClose, onPracticeAgain
}: FeedbackCardProps) => {
  const feedbackMap = { fluency, vocabulary, grammar, pronunciation };

  const bandColor = band >= 7 ? "text-green-600" : band >= 6 ? "text-primary" : "text-orange-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full max-w-2xl mx-auto bg-card rounded-3xl p-6 md:p-8 shadow-medium space-y-6 max-h-[70vh] overflow-y-auto"
    >
      {/* Score */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1 font-medium">Estimated Band Score</p>
        <p className={`text-6xl font-bold font-display ${bandColor}`}>{band.toFixed(1)}</p>
      </div>

      {/* Criteria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {criteria.map(({ key, label }) => (
          <div key={key} className="bg-secondary/50 rounded-2xl p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1.5">{label}</p>
            <p className="text-sm text-foreground leading-relaxed">{feedbackMap[key]}</p>
          </div>
        ))}
      </div>

      {/* Your transcript */}
      {transcript && (
        <div className="bg-secondary/30 rounded-2xl p-4">
          <p className="text-sm font-semibold text-foreground mb-2">🎙️ Your Response</p>
          <p className="text-sm text-muted-foreground leading-relaxed italic">"{transcript}"</p>
        </div>
      )}

      {/* Mistakes */}
      {mistakes && mistakes.length > 0 && (
        <div className="bg-destructive/5 rounded-2xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3">🔍 Corrections</p>
          <div className="space-y-3">
            {mistakes.map((m, i) => (
              <div key={i} className="text-sm">
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="line-through text-destructive">{m.original}</span>
                  <span className="text-foreground">→</span>
                  <span className="font-medium text-green-700">{m.corrected}</span>
                </div>
                <p className="text-xs text-muted-foreground">{m.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improved answer */}
      {improvedAnswer && (
        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-sm font-semibold text-foreground mb-2">✨ Band 7–8 Model Answer</p>
          <p className="text-sm text-foreground leading-relaxed">{improvedAnswer}</p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-lavender-soft/50 rounded-2xl p-4">
          <p className="text-sm font-semibold text-foreground mb-2">💡 Suggestions</p>
          <ul className="space-y-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                <span className="text-primary">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center pt-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium text-sm"
        >
          Back to Home
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={onPracticeAgain}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-glow"
        >
          Practice Again
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;
