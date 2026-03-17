import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transcript, questionText, part } = await req.json();

    if (!transcript || !questionText) {
      return new Response(JSON.stringify({ error: "Missing transcript or questionText" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert IELTS Speaking examiner. Evaluate the student's spoken response based on official IELTS Band Descriptors.

You MUST respond by calling the "ielts_evaluation" tool with your assessment.

Be realistic but encouraging. If the response is very short or unclear, give a lower band. If it's well-developed, give a higher band.

For the improved answers:
- improved_answer_mid: Write a Band 6-7 level answer that improves upon the student's response while keeping it natural and achievable.
- improved_answer_high: Write a Band 8-9 level answer that demonstrates sophisticated vocabulary, complex grammar, and excellent coherence.`;

    const userPrompt = `IELTS Speaking Part ${part}
Question: "${questionText}"
Student's response (transcript): "${transcript}"

Evaluate this response and provide detailed feedback with two improved versions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "ielts_evaluation",
              description: "Return IELTS speaking evaluation results",
              parameters: {
                type: "object",
                properties: {
                  band_score: { type: "number", description: "Overall band score from 4.0 to 9.0 in 0.5 increments" },
                  fluency: { type: "string", description: "Feedback on fluency and coherence (2-3 sentences)" },
                  vocabulary: { type: "string", description: "Feedback on lexical resource (2-3 sentences)" },
                  grammar: { type: "string", description: "Feedback on grammatical range and accuracy (2-3 sentences)" },
                  pronunciation: { type: "string", description: "Feedback on pronunciation (2-3 sentences)" },
                  fluency_score: { type: "number", description: "Fluency score from 0 to 100" },
                  vocabulary_score: { type: "number", description: "Vocabulary score from 0 to 100" },
                  grammar_score: { type: "number", description: "Grammar score from 0 to 100" },
                  pronunciation_score: { type: "number", description: "Pronunciation score from 0 to 100" },
                  improved_answer_mid: { type: "string", description: "A Band 6-7 improved version of the answer (3-5 sentences)" },
                  improved_answer_high: { type: "string", description: "A Band 8-9 advanced version of the answer (3-5 sentences)" },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 specific actionable suggestions for improvement",
                  },
                  mistakes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        original: { type: "string" },
                        corrected: { type: "string" },
                        explanation: { type: "string" },
                      },
                      required: ["original", "corrected", "explanation"],
                    },
                    description: "Specific mistakes found in the response with corrections",
                  },
                },
                required: ["band_score", "fluency", "vocabulary", "grammar", "pronunciation", "fluency_score", "vocabulary_score", "grammar_score", "pronunciation_score", "improved_answer_mid", "improved_answer_high", "suggestions", "mistakes"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "ielts_evaluation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const evaluation = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-speech error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
