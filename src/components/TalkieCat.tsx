import { motion } from "framer-motion";

interface TalkieCatProps {
  state: "idle" | "listening" | "feedback" | "sleeping";
  size?: number;
}

const TalkieCat = ({ state = "idle", size = 128 }: TalkieCatProps) => {
  const breatheAnimation = {
    idle: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    },
    listening: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
    },
    feedback: {
      rotate: [0, 15, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    sleeping: {
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
    },
  };

  const blinkAnimation = {
    idle: {
      scaleY: [1, 0.1, 1],
      transition: { repeat: Infinity, duration: 4, repeatDelay: 2, times: [0, 0.5, 1], duration: 0.3 },
    },
    listening: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
    },
    feedback: {},
    sleeping: {
      scaleY: 0.15,
    },
  };

  const tailWag = {
    idle: {
      rotate: [0, 10, -10, 0],
      transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
    },
    listening: {
      rotate: [0, 15, -15, 0],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
    },
    feedback: {
      rotate: [0, 20, -20, 0],
      transition: { repeat: Infinity, duration: 1, ease: "easeInOut" },
    },
    sleeping: {
      rotate: 0,
    },
  };

  return (
    <motion.div
      animate={breatheAnimation[state]}
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* Body */}
        <ellipse cx="100" cy="130" rx="55" ry="45" fill="hsl(240, 10%, 15%)" />
        
        {/* Head */}
        <circle cx="100" cy="80" r="45" fill="hsl(240, 10%, 15%)" />
        
        {/* Left ear */}
        <polygon points="65,50 55,15 85,45" fill="hsl(240, 10%, 15%)" />
        <polygon points="68,48 60,22 82,45" fill="hsl(340, 30%, 70%)" />
        
        {/* Right ear */}
        <polygon points="135,50 145,15 115,45" fill="hsl(240, 10%, 15%)" />
        <polygon points="132,48 140,22 118,45" fill="hsl(340, 30%, 70%)" />
        
        {/* Collar */}
        <ellipse cx="100" cy="112" rx="40" ry="8" fill="hsl(265, 70%, 70%)" />
        <circle cx="100" cy="118" r="5" fill="hsl(45, 95%, 60%)" />
        
        {/* Belly patch */}
        <ellipse cx="100" cy="140" rx="25" ry="20" fill="hsl(240, 10%, 22%)" />
        
        {/* Whiskers left */}
        <line x1="60" y1="85" x2="30" y2="80" stroke="hsl(240, 10%, 40%)" strokeWidth="1.5" />
        <line x1="60" y1="90" x2="28" y2="92" stroke="hsl(240, 10%, 40%)" strokeWidth="1.5" />
        
        {/* Whiskers right */}
        <line x1="140" y1="85" x2="170" y2="80" stroke="hsl(240, 10%, 40%)" strokeWidth="1.5" />
        <line x1="140" y1="90" x2="172" y2="92" stroke="hsl(240, 10%, 40%)" strokeWidth="1.5" />
        
        {/* Nose */}
        <ellipse cx="100" cy="88" rx="5" ry="3.5" fill="hsl(340, 30%, 60%)" />
        
        {/* Mouth */}
        <path d="M 95 92 Q 100 97 105 92" fill="none" stroke="hsl(240, 10%, 35%)" strokeWidth="1.5" />
        
        {/* Paws */}
        <ellipse cx="75" cy="170" rx="15" ry="8" fill="hsl(240, 10%, 15%)" />
        <ellipse cx="125" cy="170" rx="15" ry="8" fill="hsl(240, 10%, 15%)" />
      </svg>

      {/* Eyes as motion divs for animation */}
      <motion.div
        animate={blinkAnimation[state]}
        className="absolute rounded-full"
        style={{
          width: size * 0.1,
          height: size * 0.1,
          backgroundColor: "hsl(45, 95%, 60%)",
          top: "35%",
          left: "33%",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "40%",
            height: "40%",
            backgroundColor: "hsl(240, 10%, 10%)",
            top: "30%",
            left: "30%",
          }}
        />
      </motion.div>

      <motion.div
        animate={blinkAnimation[state]}
        className="absolute rounded-full"
        style={{
          width: size * 0.1,
          height: size * 0.1,
          backgroundColor: "hsl(45, 95%, 60%)",
          top: "35%",
          right: "33%",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "40%",
            height: "40%",
            backgroundColor: "hsl(240, 10%, 10%)",
            top: "30%",
            left: "30%",
          }}
        />
      </motion.div>

      {/* Tail */}
      <motion.div
        animate={tailWag[state]}
        className="absolute"
        style={{
          width: size * 0.15,
          height: size * 0.35,
          bottom: "10%",
          right: "-5%",
          transformOrigin: "bottom center",
        }}
      >
        <svg viewBox="0 0 30 70" width="100%" height="100%">
          <path d="M 15 70 Q 25 40 10 10 Q 5 0 15 0" fill="none" stroke="hsl(240, 10%, 15%)" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Zzz for sleeping state */}
      {state === "sleeping" && (
        <motion.span
          animate={{ opacity: [0, 1, 0], y: [0, -10] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute text-muted-foreground font-display text-sm"
          style={{ top: "15%", right: "10%" }}
        >
          zzz
        </motion.span>
      )}
    </motion.div>
  );
};

export default TalkieCat;
