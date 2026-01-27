import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const languages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Spanish" },
  { code: "DE", name: "German" },
  { code: "IT", name: "Italian" },
  { code: "FR", name: "French" },
  { code: "ZH", name: "Chinese (Simplified)" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId } = await req.json();

    if (!postId) {
      return new Response(
        JSON.stringify({ success: false, error: "Post ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Database not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the post
    const { data: post, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt, content")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return new Response(
        JSON.stringify({ success: false, error: "Post not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating translations for post: ${post.title}`);

    const translations: Record<string, string | null> = {};
    const errors: string[] = [];

    // Generate translations for each language
    for (const lang of languages) {
      try {
        console.log(`Translating to ${lang.name}...`);

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
                content: `You are a professional legal translator. Translate content from Portuguese (Brazilian) to ${lang.name}.

CRITICAL RULES:
1. Maintain the exact same HTML structure and formatting
2. Keep all HTML tags, classes, and attributes unchanged
3. Only translate the text content within the HTML tags
4. Preserve legal terminology accuracy
5. Maintain the professional and formal tone
6. Do not add or remove any HTML elements
7. Keep numbers, dates, and currency values as-is

Respond ONLY with the JSON structured output.`
              },
              {
                role: "user",
                content: `Translate to ${lang.name}:

TITLE: ${post.title}

EXCERPT: ${post.excerpt || ""}

CONTENT (HTML):
${post.content}`
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
                      content: { type: "string", description: "Translated HTML content" }
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
          errors.push(`${lang.code}: API error ${aiResponse.status}`);
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

        if (toolCall) {
          const translatedData = JSON.parse(toolCall.function.arguments);
          const langKey = lang.code.toLowerCase();
          translations[`title_${langKey}`] = translatedData.title;
          translations[`excerpt_${langKey}`] = translatedData.excerpt;
          translations[`content_${langKey}`] = translatedData.content;
          console.log(`✓ ${lang.name} translation complete`);
        } else {
          errors.push(`${lang.code}: No structured data returned`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (langError) {
        console.error(`Error translating to ${lang.name}:`, langError);
        errors.push(`${lang.code}: ${langError instanceof Error ? langError.message : 'Unknown error'}`);
      }
    }

    // Update the post with translations
    if (Object.keys(translations).length > 0) {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update(translations)
        .eq("id", postId);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to save translations" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        translatedLanguages: Object.keys(translations).length / 3,
        errors: errors.length > 0 ? errors : undefined
      }),
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
