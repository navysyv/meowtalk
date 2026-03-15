import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question | null;
  part: number;
}

const QuestionCard = ({ question, part }: QuestionCardProps) => {
  return (
    <AnimatePresence mode="wait">
      {question && (
        <motion.div
          key={question.id + "-" + question.text.slice(0, 20)}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-8 shadow-medium">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-primary bg-lavender-soft px-3 py-1 rounded-full">
                Part {part}
              </span>
              <span className="text-xs text-muted-foreground">{question.topic}</span>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-foreground font-display tracking-tight text-balance leading-snug whitespace-pre-line">
              {question.text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestionCard;
