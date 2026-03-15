import { motion } from "framer-motion";

interface FeedbackCardProps {
  band: number;
  fluency: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
  suggestions: string[];
  onClose: () => void;
  onPracticeAgain: () => void;
}

const criteria = [
  { key: "fluency", label: "Fluency" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "grammar", label: "Grammar" },
  { key: "pronunciation", label: "Pronunciation" },
] as const;

const FeedbackCard = ({
  band, fluency, vocabulary, grammar, pronunciation, suggestions, onClose, onPracticeAgain
}: FeedbackCardProps) => {
  const feedbackMap = { fluency, vocabulary, grammar, pronunciation };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full max-w-2xl mx-auto bg-card rounded-3xl p-8 shadow-medium"
    >
      {/* Score */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground mb-2 font-medium">Estimated Band Score</p>
        <p className="text-7xl font-bold text-primary font-display">{band.toFixed(1)}</p>
      </div>

      {/* Criteria Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {criteria.map(({ key, label }) => (
          <div key={key} className="bg-secondary/50 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-2">{label}</p>
            <p className="text-sm text-foreground leading-relaxed">{feedbackMap[key]}</p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-lavender-soft/50 rounded-2xl p-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">💡 Suggestions</p>
          <ul className="space-y-2">
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
      <div className="flex gap-3 justify-center">
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
