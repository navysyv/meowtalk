import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Pause, Play, Minus } from "lucide-react";

interface CircularTimerProps {
  totalSeconds: number;
  label: string;
  onComplete: () => void;
  onExit: () => void;
  autoStart?: boolean;
}

const CircularTimer = ({ totalSeconds, label, onComplete, onExit, autoStart = false }: CircularTimerProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining, onComplete]);

  const progress = remaining / totalSeconds;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const subtract30 = useCallback(() => {
    setRemaining((prev) => Math.max(0, prev - 30));
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Exit button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onExit}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </motion.button>

        <svg width="140" height="140" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold font-display tabular-nums text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={subtract30}
          className="px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Minus size={14} className="inline mr-1" />
          30s
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onExit}
          className="px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Exit
        </motion.button>
      </div>
    </div>
  );
};

export default CircularTimer;
