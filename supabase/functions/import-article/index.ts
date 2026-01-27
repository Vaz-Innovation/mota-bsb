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
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("Scraping URL:", formattedUrl);

    // Step 1: Scrape the URL with Firecrawl
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error("Firecrawl error:", scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to scrape URL" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";
    const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

    console.log("Scraped content length:", markdown.length);

    // Step 2: Use AI to extract structured blog post data
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
            content: `Você é um redator jurídico especializado em criar conteúdo para blogs de escritórios de advocacia. Sua tarefa é extrair e REESCREVER artigos de forma completa, profissional e bem formatada.

REGRAS CRÍTICAS PARA O CONTEÚDO:

1. EXTENSÃO E PROFUNDIDADE:
   - O conteúdo deve ser COMPLETO e EXTENSO, nunca resumido
   - Mínimo de 800-1500 palavras no conteúdo final
   - Expanda cada ponto com explicações detalhadas, exemplos práticos e contexto legal
   - Se o artigo original for curto, desenvolva os tópicos com mais profundidade

2. ESTRUTURA HTML COM BOA LEGIBILIDADE:
   - Use <h2> para títulos principais de seção (com classe "mt-8 mb-4")
   - Use <h3> para subtítulos (com classe "mt-6 mb-3")
   - Cada parágrafo <p> deve ter classe "mb-6 leading-relaxed"
   - O primeiro parágrafo deve ser um LEAD destacado com classe "text-lg font-medium mb-8 leading-relaxed"
   - Use <ul> e <ol> com classe "mb-6 space-y-2 ml-6" para listas
   - Use <li> com classe "leading-relaxed" para itens de lista
   - Use <blockquote> com classe "border-l-4 border-gold pl-4 my-6 italic" para citações importantes
   - Use <strong> para termos jurídicos importantes

3. HIERARQUIA VISUAL:
   - Sempre comece com um parágrafo introdutório forte (lead)
   - Divida o conteúdo em seções claras com títulos H2
   - Use subtítulos H3 quando necessário para organização
   - Inclua uma seção de conclusão ao final

4. FORMATAÇÃO DE PARÁGRAFOS:
   - Parágrafos de 3-5 linhas (não muito longos)
   - Espaçamento generoso entre parágrafos (mb-6)
   - Line-height confortável (leading-relaxed)

5. ELEMENTOS ESPECIAIS:
   - Destaque informações importantes em <strong>
   - Use listas para enumerar requisitos, etapas ou benefícios
   - Inclua citações de leis quando relevante

Responda APENAS com o JSON estruturado, sem markdown ou explicações.`
          },
          {
            role: "user",
            content: `Título da página: ${metadata.title || "Não disponível"}
Descrição: ${metadata.description || "Não disponível"}

IMPORTANTE: Reescreva e EXPANDA este conteúdo de forma completa e profissional, seguindo todas as regras de formatação e legibilidade. O resultado deve ser um artigo jurídico completo, bem estruturado e fácil de ler.

Conteúdo original:
${markdown.substring(0, 20000)}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_blog_post",
              description: "Extract and rewrite blog post data with proper formatting",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Título claro e profissional do artigo" },
                  excerpt: { type: "string", description: "Resumo envolvente de 200-300 caracteres que capture a essência do artigo" },
                  content: { type: "string", description: "Conteúdo COMPLETO e EXTENSO em HTML bem formatado com classes de espaçamento. Mínimo 800 palavras." },
                  tags: { type: "array", items: { type: "string" }, description: "4-6 tags relevantes para categorização" },
                  metaTitle: { type: "string", description: "Título SEO otimizado (máximo 60 caracteres)" },
                  metaDescription: { type: "string", description: "Descrição SEO persuasiva (máximo 160 caracteres)" }
                },
                required: ["title", "excerpt", "content", "tags", "metaTitle", "metaDescription"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_blog_post" } }
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
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response:", JSON.stringify(aiData).substring(0, 500));

    // Extract the tool call arguments
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Try to parse from content as fallback
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

    const extractedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
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
