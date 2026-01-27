import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const languageNames: Record<string, string> = {
  PT: "Portuguese (Brazilian)",
  ES: "Spanish",
  EN: "English",
  DE: "German",
  IT: "Italian",
  FR: "French",
  ZH: "Chinese (Simplified)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, excerpt, content, targetLanguage, sourceLanguage = "PT" } = await req.json();

    if (!title || !content || !targetLanguage) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If target language is the same as source, return original content
    if (targetLanguage === sourceLanguage) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { title, excerpt, content } 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage;
    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage;

    console.log(`Translating from ${sourceLangName} to ${targetLangName}`);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a professional legal translator. Translate content from ${sourceLangName} to ${targetLangName}.

CRITICAL RULES:
1. Maintain the exact same HTML structure and formatting
2. Keep all HTML tags, classes, and attributes unchanged
3. Only translate the text content within the HTML tags
4. Preserve legal terminology accuracy
5. Maintain the professional and formal tone
6. Do not add or remove any HTML elements
7. Keep numbers, dates, and currency values as-is (just translate the text around them)

Respond ONLY with the JSON structured output, no additional text.`
          },
          {
            role: "user",
            content: `Translate the following blog post content to ${targetLangName}:

TITLE: ${title}

EXCERPT: ${excerpt || ""}

CONTENT (HTML):
${content}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "translate_content",
              description: "Return the translated blog post content",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Translated title" },
                  excerpt: { type: "string", description: "Translated excerpt" },
                  content: { type: "string", description: "Translated HTML content with all formatting preserved" }
                },
                required: ["title", "excerpt", "content"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "translate_content" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Translation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          return new Response(
            JSON.stringify({ success: true, data: parsed }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch {
          console.error("Failed to parse AI content");
        }
      }
      return new Response(
        JSON.stringify({ success: false, error: "AI did not return structured data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const translatedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: translatedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
