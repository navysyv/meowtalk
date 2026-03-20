import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, questionText } = await req.json();

    if (!transcript || !questionText) {
      return new Response(JSON.stringify({ error: "Missing transcript or questionText" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not set");

    const systemPrompt = `You are an English speaking coach. Analyze the user's spoken answer and provide learning material.

Return a JSON object with EXACTLY this structure:
{
  "improved_answer": "A natural, fluent version of their answer",
  "vocabulary_words": [
    { "word": "word1", "meaning": "definition", "example": "example sentence" },
    { "word": "word2", "meaning": "definition", "example": "example sentence" },
    { "word": "word3", "meaning": "definition", "example": "example sentence" }
  ],
  "grammar_fix": {
    "original": "a sentence with a grammar error from the transcript",
    "corrected": "the corrected version",
    "explanation": "why it was wrong"
  },
  "useful_phrase": {
    "phrase": "a useful English phrase related to the topic",
    "usage": "when and how to use it"
  }
}

Pick vocabulary words that would upgrade their speaking level. Find a real grammar mistake from their transcript. If no mistakes, pick the weakest sentence and show how to make it stronger.`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Question: "${questionText}"\n\nStudent's answer: "${transcript}"\n\nAnalyze and return JSON only.` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Growth evaluation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
