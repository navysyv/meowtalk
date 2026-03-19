import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-supabase-client-platform-name",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { questionText, transcript, part } = await req.json();

    if (!questionText || !transcript) {
      return new Response(JSON.stringify({ questions: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an IELTS Speaking examiner. Generate 1-2 natural follow-up questions based on the student's answer. Questions should:
- Feel conversational and natural (like a real examiner)
- Probe deeper into what the student said
- Be appropriate for IELTS Speaking Part ${part}
- Examples: "Why do you think that?", "Can you give an example?", "How has this changed over time?"

Respond with a JSON object: { "questions": ["question1", "question2"] }`,
          },
          {
            role: "user",
            content: `Original question: "${questionText}"\nStudent's answer: "${transcript}"`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ questions: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify({ questions: parsed.questions || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-followup error:", e);
    return new Response(JSON.stringify({ questions: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
