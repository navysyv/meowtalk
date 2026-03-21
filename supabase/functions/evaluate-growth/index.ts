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
  "improved_answer": "A natural, fluent version of their answer that keeps the same meaning but uses better grammar, vocabulary and phrasing",
  "vocabulary_words": [
    { "word": "word1", "meaning": "clear definition", "example": "example sentence using this word" },
    { "word": "word2", "meaning": "clear definition", "example": "example sentence using this word" },
    { "word": "word3", "meaning": "clear definition", "example": "example sentence using this word" }
  ],
  "grammar_fix": {
    "original": "a sentence with a grammar error from the transcript",
    "corrected": "the corrected version",
    "explanation": "brief explanation of the grammar rule"
  },
  "useful_phrase": {
    "phrase": "a useful English phrase related to the topic",
    "usage": "when and how to use this phrase with an example"
  }
}

Rules:
- The improved_answer MUST be different from the original - show clear improvements
- Pick vocabulary words that would upgrade their speaking level
- Find a real grammar mistake from their transcript
- If no obvious mistakes, pick the weakest sentence and show how to strengthen it
- Always return valid JSON, nothing else`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Question: "${questionText}"\n\nStudent's spoken answer: "${transcript}"\n\nAnalyze and return JSON only. No markdown, no backticks, just the JSON object.` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", response.status, errText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again in a moment" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON from response - handle markdown code blocks
    let jsonStr = content;
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }

    try {
      const parsed = JSON.parse(jsonStr);
      
      // Validate required fields exist with defaults
      const result = {
        improved_answer: parsed.improved_answer || transcript,
        vocabulary_words: Array.isArray(parsed.vocabulary_words) ? parsed.vocabulary_words.slice(0, 3) : [],
        grammar_fix: parsed.grammar_fix || { original: "", corrected: "", explanation: "" },
        useful_phrase: parsed.useful_phrase || { phrase: "", usage: "" },
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Content:", content.substring(0, 500));
      // Return a fallback with just the improved answer extracted if possible
      return new Response(JSON.stringify({
        improved_answer: transcript,
        vocabulary_words: [],
        grammar_fix: { original: "", corrected: "", explanation: "" },
        useful_phrase: { phrase: "", usage: "" },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Growth evaluation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
