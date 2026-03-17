import { motion } from "framer-motion";

interface ProgressMapProps {
  fluency: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
}

const criteria = [
  { key: "fluency", label: "Fluency", emoji: "🗣️" },
  { key: "vocabulary", label: "Vocabulary", emoji: "📚" },
  { key: "grammar", label: "Grammar", emoji: "✏️" },
  { key: "pronunciation", label: "Pronunciation", emoji: "🎯" },
] as const;

const ProgressMap = ({ fluency, vocabulary, grammar, pronunciation }: ProgressMapProps) => {
  const scores = { fluency, vocabulary, grammar, pronunciation };

  return (
    <div className="w-full bg-card rounded-3xl p-6 shadow-medium space-y-4">
      <h3 className="font-semibold font-display text-foreground text-sm">📊 Skills Progress</h3>
      <div className="space-y-3">
        {criteria.map(({ key, label, emoji }) => {
          const score = scores[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  {emoji} {label}
                </span>
                <span className="text-xs font-semibold text-foreground tabular-nums">{score}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressMap;
