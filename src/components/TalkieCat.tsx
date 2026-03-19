import { motion, type Easing } from "framer-motion";

interface TalkieCatProps {
  state: "idle" | "listening" | "feedback" | "sleeping" | "thinking" | "happy" | "impressed";
  size?: number;
}

const ease: Easing = "easeInOut";

const breatheAnimation: Record<TalkieCatProps["state"], any> = {
  idle: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 3.5, ease } },
  listening: { scale: [1, 1.04, 1], transition: { repeat: Infinity, duration: 2, ease } },
  feedback: { rotate: [0, 8, -8, 0], transition: { duration: 0.8, ease } },
  sleeping: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 4.5, ease } },
  thinking: { rotate: [0, -5, 0], y: [0, -4, 0], transition: { repeat: Infinity, duration: 3, ease } },
  happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.2, ease } },
  impressed: { scale: [1, 1.06, 1], transition: { repeat: Infinity, duration: 1.5, ease } },
};

const blinkAnimation: Record<TalkieCatProps["state"], any> = {
  idle: { scaleY: [1, 0.05, 1], transition: { repeat: Infinity, repeatDelay: 3, duration: 0.25, times: [0, 0.5, 1] } },
  listening: { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.5, ease } },
  feedback: {},
  sleeping: { scaleY: 0.1 },
  thinking: { scaleY: [1, 0.05, 1], transition: { repeat: Infinity, repeatDelay: 5, duration: 0.3, times: [0, 0.5, 1] } },
  happy: { scaleY: [1, 0.9, 1], transition: { repeat: Infinity, repeatDelay: 2, duration: 0.2, times: [0, 0.5, 1] } },
  impressed: { scale: [1, 1.12, 1], transition: { repeat: Infinity, duration: 1, ease } },
};

const tailWag: Record<TalkieCatProps["state"], any> = {
  idle: { rotate: [0, 12, -12, 0], transition: { repeat: Infinity, duration: 3, ease } },
  listening: { rotate: [0, 18, -18, 0], transition: { repeat: Infinity, duration: 1.2, ease } },
  feedback: { rotate: [0, 25, -25, 0], transition: { repeat: Infinity, duration: 0.8, ease } },
  sleeping: { rotate: 5 },
  thinking: { rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 4, ease } },
  happy: { rotate: [0, 30, -30, 0], transition: { repeat: Infinity, duration: 0.6, ease } },
  impressed: { rotate: [0, 20, -20, 0], transition: { repeat: Infinity, duration: 0.9, ease } },
};

const TalkieCat = ({ state = "idle", size = 128 }: TalkieCatProps) => {
  const s = size;
  const showStars = state === "impressed" || state === "listening";
  const showSmile = state === "happy" || state === "impressed";

  return (
    <motion.div
      animate={breatheAnimation[state]}
      className="relative inline-block"
      style={{ width: s, height: s }}
    >
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* Tail - attached naturally to body at back-right hip */}
        <motion.g animate={tailWag[state]} style={{ transformOrigin: "160px 140px" }}>
          <path
            d="M 160 140 C 175 125, 180 100, 172 75 C 168 60, 172 45, 178 35"
            fill="none"
            stroke="hsl(240, 10%, 12%)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Very round chubby body */}
        <ellipse cx="100" cy="120" rx="72" ry="62" fill="hsl(240, 10%, 12%)" />
        
        {/* Round head merged with body */}
        <circle cx="100" cy="78" r="54" fill="hsl(240, 10%, 12%)" />
        
        {/* Tiny ears */}
        <ellipse cx="68" cy="38" rx="12" ry="16" fill="hsl(240, 10%, 12%)" transform="rotate(-15, 68, 38)" />
        <ellipse cx="70" cy="40" rx="6" ry="9" fill="hsl(340, 25%, 55%)" transform="rotate(-15, 70, 40)" />
        <ellipse cx="132" cy="38" rx="12" ry="16" fill="hsl(240, 10%, 12%)" transform="rotate(15, 132, 38)" />
        <ellipse cx="130" cy="40" rx="6" ry="9" fill="hsl(340, 25%, 55%)" transform="rotate(15, 130, 40)" />
        
        {/* Collar - thin band around neck */}
        <path
          d="M 56 106 Q 78 114 100 116 Q 122 114 144 106"
          fill="none"
          stroke="hsl(265, 60%, 65%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Bell charm */}
        <circle cx="100" cy="118" r="4" fill="hsl(45, 95%, 60%)" />
        <circle cx="100" cy="118" r="1.5" fill="hsl(45, 85%, 45%)" />

        {/* Belly highlight */}
        <ellipse cx="100" cy="138" rx="32" ry="24" fill="hsl(240, 10%, 18%)" />
        
        {/* Whiskers */}
        <line x1="58" y1="82" x2="25" y2="76" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="88" x2="22" y2="90" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="94" x2="25" y2="102" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="142" y1="82" x2="175" y2="76" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="142" y1="88" x2="178" y2="90" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="142" y1="94" x2="175" y2="102" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Nose */}
        <ellipse cx="100" cy="88" rx="5" ry="3.5" fill="hsl(340, 25%, 50%)" />
        
        {/* Mouth - changes based on state */}
        {showSmile ? (
          <path d="M 90 93 Q 95 100 100 101 Q 105 100 110 93" fill="none" stroke="hsl(240, 10%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="M 93 93 Q 100 99 107 93" fill="none" stroke="hsl(240, 10%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
        )}
        
        {/* Front paws */}
        <ellipse cx="72" cy="172" rx="18" ry="10" fill="hsl(240, 10%, 12%)" />
        <ellipse cx="128" cy="172" rx="18" ry="10" fill="hsl(240, 10%, 12%)" />
      </svg>

      {/* Left eye */}
      <motion.div
        animate={blinkAnimation[state]}
        className="absolute rounded-full"
        style={{
          width: s * 0.18,
          height: s * 0.18,
          backgroundColor: "hsl(45, 95%, 55%)",
          top: "30%",
          left: "26%",
          boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "45%",
            height: "55%",
            backgroundColor: "hsl(240, 10%, 8%)",
            top: "22%",
            left: "28%",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "20%",
            height: "20%",
            backgroundColor: "white",
            top: "22%",
            left: "55%",
          }}
        />
        {/* Star sparkle in eye */}
        {showStars && (
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease }}
            className="absolute"
            style={{ top: "10%", right: "10%", fontSize: s * 0.04, color: "white" }}
          >
            ✦
          </motion.div>
        )}
      </motion.div>

      {/* Right eye */}
      <motion.div
        animate={blinkAnimation[state]}
        className="absolute rounded-full"
        style={{
          width: s * 0.18,
          height: s * 0.18,
          backgroundColor: "hsl(45, 95%, 55%)",
          top: "30%",
          right: "26%",
          boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "45%",
            height: "55%",
            backgroundColor: "hsl(240, 10%, 8%)",
            top: "22%",
            left: "28%",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "20%",
            height: "20%",
            backgroundColor: "white",
            top: "22%",
            left: "55%",
          }}
        />
        {/* Star sparkle in eye */}
        {showStars && (
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease }}
            className="absolute"
            style={{ top: "10%", right: "10%", fontSize: s * 0.04, color: "white" }}
          >
            ✦
          </motion.div>
        )}
      </motion.div>

      {state === "sleeping" && (
        <motion.span
          animate={{ opacity: [0, 1, 0], y: [0, -12] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute text-muted-foreground font-display text-sm"
          style={{ top: "12%", right: "8%" }}
        >
          zzz
        </motion.span>
      )}
    </motion.div>
  );
};

export default TalkieCat;
