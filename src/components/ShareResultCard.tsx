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

  const drawTalkieCat = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    const s = size / 200; // scale factor based on 200x200 viewbox

    // Tail
    ctx.strokeStyle = "hsl(240, 10%, 12%)";
    ctx.lineWidth = 10 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 60 * s, cy + 60 * s);
    ctx.bezierCurveTo(cx + 75 * s, cy + 45 * s, cx + 80 * s, cy + 20 * s, cx + 72 * s, cy - 5 * s);
    ctx.stroke();

    // Body
    ctx.fillStyle = "hsl(240, 10%, 12%)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 40 * s, 72 * s, 62 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 2 * s, 54 * s, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.ellipse(cx - 32 * s, cy - 42 * s, 12 * s, 16 * s, -0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 32 * s, cy - 42 * s, 12 * s, 16 * s, 0.26, 0, Math.PI * 2);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = "hsl(340, 25%, 55%)";
    ctx.beginPath();
    ctx.ellipse(cx - 30 * s, cy - 40 * s, 6 * s, 9 * s, -0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 30 * s, cy - 40 * s, 6 * s, 9 * s, 0.26, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "hsl(45, 95%, 55%)";
    ctx.beginPath();
    ctx.arc(cx - 18 * s, cy - 8 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 18 * s, cy - 8 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = "hsl(240, 10%, 8%)";
    ctx.beginPath();
    ctx.arc(cx - 16 * s, cy - 6 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 16 * s, cy - 6 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cx - 13 * s, cy - 11 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 21 * s, cy - 11 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "hsl(340, 25%, 50%)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8 * s, 5 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (smile)
    ctx.strokeStyle = "hsl(240, 10%, 30%)";
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 10 * s, cy + 13 * s);
    ctx.quadraticCurveTo(cx - 5 * s, cy + 20 * s, cx, cy + 21 * s);
    ctx.quadraticCurveTo(cx + 5 * s, cy + 20 * s, cx + 10 * s, cy + 13 * s);
    ctx.stroke();

    // Collar
    ctx.strokeStyle = "hsl(265, 60%, 65%)";
    ctx.lineWidth = 4 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 44 * s, cy + 26 * s);
    ctx.quadraticCurveTo(cx - 22 * s, cy + 34 * s, cx, cy + 36 * s);
    ctx.quadraticCurveTo(cx + 22 * s, cy + 34 * s, cx + 44 * s, cy + 26 * s);
    ctx.stroke();

    // Bell
    ctx.fillStyle = "hsl(45, 95%, 60%)";
    ctx.beginPath();
    ctx.arc(cx, cy + 38 * s, 4 * s, 0, Math.PI * 2);
    ctx.fill();
  };

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
    ctx.beginPath();
    ctx.roundRect(0, 0, 600, 400, 24);
    ctx.fill();

    // Decorative stars
    ctx.fillStyle = "rgba(155, 135, 195, 0.25)";
    ctx.font = "14px sans-serif";
    const starPositions = [[50, 50], [540, 80], [80, 340], [520, 350], [300, 30], [150, 100], [450, 320]];
    starPositions.forEach(([x, y]) => ctx.fillText("✦", x, y));

    // Draw Talkie cat
    drawTalkieCat(ctx, 300, 90, 80);

    // Title
    ctx.fillStyle = "#4a3670";
    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MeowTalk Practice predicted my band score:", 300, 170);

    // Band score
    const scoreColor = bandScore >= 7 ? "#16a34a" : bandScore >= 6 ? "#7c5cbf" : "#ea580c";
    ctx.fillStyle = scoreColor;
    ctx.font = "bold 72px 'Outfit', sans-serif";
    ctx.fillText(bandScore.toFixed(1), 300, 260);

    // Criteria scores
    if (fluencyScore || vocabularyScore || grammarScore || pronunciationScore) {
      ctx.font = "13px 'Outfit', sans-serif";
      ctx.fillStyle = "#6b5b8a";
      const labels = [
        { label: "Fluency", score: fluencyScore },
        { label: "Vocabulary", score: vocabularyScore },
        { label: "Grammar", score: grammarScore },
        { label: "Pronunciation", score: pronunciationScore },
      ];
      labels.forEach((item, i) => {
        const x = 90 + i * 140;
        ctx.fillText(`${item.label}: ${item.score || "-"}%`, x, 300);
      });
    }

    // Footer
    ctx.fillStyle = "#9b87c3";
    ctx.font = "13px 'Outfit', sans-serif";
    ctx.fillText("Practice English Speaking with MeowTalk 🐾", 300, 375);

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
    const text = `🐱 MeowTalk Practice predicted my IELTS band score: ${bandScore.toFixed(1)}! Practice speaking with MeowTalk.`;

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
