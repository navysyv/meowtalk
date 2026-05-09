import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { transcript, questions, answers } = await req.json();
    let score = 0;
    const mistakes: any[] = [];
    for (const q of questions) {
      const given = (answers[q.id] || "").trim().toLowerCase();
      const correct = q.answer.trim().toLowerCase();
      if (given === correct) score++;
      else mistakes.push({ q: q.question, correct: q.answer, given: answers[q.id] || "" });
    }
    const band = Math.min(9, Math.max(3, 3 + (score / questions.length) * 6));

    let explanation = "Great work!";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY && mistakes.length > 0) {
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are an IELTS examiner. Briefly explain why each wrong listening answer was wrong, referencing the transcript. Keep under 150 words." },
            { role: "user", content: `Transcript:\n${transcript}\n\nMistakes:\n${mistakes.map((m) => `Q: ${m.q}\nCorrect: ${m.correct}\nGiven: ${m.given}`).join("\n\n")}` },
          ],
        }),
      });
      if (r.ok) {
        const d = await r.json();
        explanation = d.choices?.[0]?.message?.content || explanation;
      }
    }

    return new Response(JSON.stringify({ score, total: questions.length, band_score: band, mistakes, explanation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});