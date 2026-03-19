import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareResultCardProps {
  bandScore: number;
  fluencyScore?: number;
  vocabularyScore?: number;
  grammarScore?: number;
  pronunciationScore?: number;
}

const ShareResultCard = ({ bandScore, fluencyScore, vocabularyScore, grammarScore, pronunciationScore }: ShareResultCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateCanvas = useCallback(async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;

    // Lavender gradient background
    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, "#e8e0f0");
    grad.addColorStop(1, "#d4c5e8");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 600, 400, 24);
    ctx.fill();

    // Decorative stars
    ctx.fillStyle = "rgba(155, 135, 195, 0.3)";
    ctx.font = "16px sans-serif";
    const starPositions = [[50, 50], [540, 80], [80, 340], [520, 350], [300, 30]];
    starPositions.forEach(([x, y]) => ctx.fillText("✦", x, y));

    // Cat emoji
    ctx.font = "48px sans-serif";
    ctx.fillText("🐱", 260, 80);

    // Title
    ctx.fillStyle = "#4a3670";
    ctx.font = "bold 22px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MeowTalk predicted my band score:", 300, 140);

    // Band score
    const scoreColor = bandScore >= 7 ? "#16a34a" : bandScore >= 6 ? "#7c5cbf" : "#ea580c";
    ctx.fillStyle = scoreColor;
    ctx.font = "bold 72px 'Outfit', sans-serif";
    ctx.fillText(bandScore.toFixed(1), 300, 230);

    // Criteria scores
    if (fluencyScore || vocabularyScore || grammarScore || pronunciationScore) {
      ctx.font = "14px 'Outfit', sans-serif";
      ctx.fillStyle = "#6b5b8a";
      const labels = [
        { label: "Fluency", score: fluencyScore },
        { label: "Vocabulary", score: vocabularyScore },
        { label: "Grammar", score: grammarScore },
        { label: "Pronunciation", score: pronunciationScore },
      ];
      labels.forEach((item, i) => {
        const x = 90 + i * 140;
        ctx.fillText(`${item.label}: ${item.score || "-"}%`, x, 290);
      });
    }

    // Footer
    ctx.fillStyle = "#9b87c3";
    ctx.font = "14px 'Outfit', sans-serif";
    ctx.fillText("Practice IELTS Speaking with MeowTalk 🐾", 300, 370);

    return canvas;
  }, [bandScore, fluencyScore, vocabularyScore, grammarScore, pronunciationScore]);

  const downloadImage = useCallback(async () => {
    const canvas = await generateCanvas();
    const link = document.createElement("a");
    link.download = `meowtalk-band-${bandScore.toFixed(1)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "Image downloaded! 🎉" });
  }, [generateCanvas, bandScore, toast]);

  const shareResult = useCallback(async () => {
    const canvas = await generateCanvas();
    const text = `🐱 MeowTalk predicted my IELTS band score: ${bandScore.toFixed(1)}! Practice speaking with MeowTalk.`;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "meowtalk-result.png", { type: "image/png" });
          await navigator.share({ text, files: [file] });
        });
      } catch {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard! 📋" });
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard! 📋" });
    }
  }, [generateCanvas, bandScore, toast]);

  return (
    <div ref={cardRef} className="flex gap-2 justify-center">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={downloadImage}
        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium"
      >
        <Download size={14} />
        Download
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={shareResult}
        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-glow"
      >
        <Share2 size={14} />
        Share
      </motion.button>
    </div>
  );
};

export default ShareResultCard;
