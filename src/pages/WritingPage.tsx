import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import TalkieCat from "@/components/TalkieCat";
import { writingPrompts } from "@/data/writingPrompts";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";

const WritingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idx, setIdx] = useState(0);
  const prompt = writingPrompts[idx];
  const [essay, setEssay] = useState("");
  const [seconds, setSeconds] = useState(prompt.minutes * 60);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setSeconds(prompt.minutes * 60); setEssay(""); setResult(null); }, [idx, prompt.minutes]);

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [result]);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  const submit = async () => {
    if (wordCount < 50) { toast({ title: "Write more first", description: `At least ${prompt.minWords} words recommended` }); return; }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-writing", {
        body: { task: prompt.task, prompt: prompt.prompt, essay, wordCount },
      });
      if (error) throw error;
      setResult(data);
      await supabase.from("writing_attempts").insert({
        session_id: getSessionId(),
        task: prompt.task, prompt: prompt.prompt, essay, word_count: wordCount,
        band_score: data.band_score, task_response: data.task_response,
        coherence: data.coherence, lexical: data.lexical, grammar: data.grammar,
        feedback: data.feedback, improved_sample: data.improved_sample,
      });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen relative">
      <DecorativeBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-4">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold font-display">Writing Practice</h1>
        </header>

        <div className="flex justify-center mb-4"><TalkieCat state={result ? "happy" : "idle"} size={70} /></div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {writingPrompts.map((p, i) => (
            <button key={p.id} onClick={() => setIdx(i)} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${i === idx ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>Task {p.task}: {p.id}</button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-medium space-y-4">
          <div>
            <span className="text-xs font-medium text-primary bg-lavender-soft px-2 py-1 rounded-full">Task {prompt.task} • {prompt.minWords}+ words • {prompt.minutes} min</span>
            <p className="text-sm text-foreground mt-3 leading-relaxed">{prompt.prompt}</p>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span className="tabular-nums">⏱ {mm}:{ss}</span>
          </div>

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            disabled={!!result}
            placeholder="Write your essay here..."
            className="w-full min-h-[300px] px-3 py-2 rounded-xl bg-background border border-border text-sm font-sans"
          />

          {!result ? (
            <button onClick={submit} disabled={submitting} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2">
              {submitting && <Loader2 size={16} className="animate-spin" />} Submit essay
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-3 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Overall Band</p>
                <p className="text-4xl font-bold font-display text-primary">{Number(result.band_score).toFixed(1)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-background rounded-xl p-2 text-center"><p className="text-muted-foreground">Task Response</p><p className="font-bold text-foreground">{result.task_response}</p></div>
                <div className="bg-background rounded-xl p-2 text-center"><p className="text-muted-foreground">Coherence</p><p className="font-bold text-foreground">{result.coherence}</p></div>
                <div className="bg-background rounded-xl p-2 text-center"><p className="text-muted-foreground">Lexical</p><p className="font-bold text-foreground">{result.lexical}</p></div>
                <div className="bg-background rounded-xl p-2 text-center"><p className="text-muted-foreground">Grammar</p><p className="font-bold text-foreground">{result.grammar}</p></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Feedback</p>
                <p className="text-sm text-foreground whitespace-pre-line">{result.feedback}</p>
              </div>
              {result.improved_sample && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Improved sample</p>
                  <p className="text-sm text-foreground whitespace-pre-line bg-background rounded-xl p-3">{result.improved_sample}</p>
                </div>
              )}
              <button onClick={() => setResult(null)} className="w-full py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium">Write another</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingPage;