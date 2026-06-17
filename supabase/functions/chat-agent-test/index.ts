import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { messages, config_ia, agent_name } = await req.json();

    // Fetch ChatGPT API key from user's integrations
    const { data: integracao, error: intError } = await supabase
      .from("integracoes")
      .select("config")
      .eq("tipo", "chatgpt")
      .eq("user_id", userId)
      .maybeSingle();

    if (intError || !integracao) {
      return new Response(
        JSON.stringify({ error: "Integração com ChatGPT não encontrada. Configure em Integrações." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const config = integracao.config as Record<string, string>;
    const apiKey = config?.api_key;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key do ChatGPT não configurada. Acesse Integrações para configurar." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system prompt from config_ia
    const cfg = config_ia || {};
    const nome = agent_name || "Assistente";
    let systemPrompt = `Você é ${nome}.`;
    if (cfg.instrucoes) systemPrompt += ` ${cfg.instrucoes}`;
    if (cfg.tom && cfg.tom !== "padrao") systemPrompt += ` Tom de comunicação: ${cfg.tom}.`;
    if (cfg.inteligencia) systemPrompt += ` Nível de inteligência: ${cfg.inteligencia}.`;
    if (cfg.perguntas_respostas) {
      systemPrompt += `\n\nPerguntas e respostas de referência:\n${cfg.perguntas_respostas}`;
    }

    const modelo = config?.modelo || "gpt-4o-mini";
    const maxTokens = cfg.max_tokens || 1000;

    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelo,
        messages: openaiMessages,
        max_tokens: maxTokens,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      const errMsg = body?.error?.message || `Erro ${res.status} da OpenAI`;
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reply = body.choices?.[0]?.message?.content || "Sem resposta.";
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
