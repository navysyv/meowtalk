import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { task, prompt, essay, wordCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are a strict but fair IELTS Writing Task ${task} examiner. Score by official IELTS criteria. Return JSON only with: band_score (overall 0-9, half bands), task_response (0-9), coherence (0-9), lexical (0-9), grammar (0-9), feedback (3-5 sentences plain text), improved_sample (a band 8-9 rewrite under ${task === 1 ? 200 : 320} words).`,
          },
          { role: "user", content: `Prompt:\n${prompt}\n\nWord count: ${wordCount}\n\nEssay:\n${essay}` },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) throw new Error(`AI ${r.status}`);
    const d = await r.json();
    const parsed = JSON.parse(d.choices?.[0]?.message?.content || "{}");
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});