import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { tipo, config } = await req.json();

    if (!tipo) {
      return new Response(
        JSON.stringify({ success: false, message: "Tipo de integração não informado." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: { success: boolean; message: string };

    switch (tipo) {
      case "chatgpt": {
        if (!config?.api_key) {
          result = { success: false, message: "API key é obrigatória." };
          break;
        }
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: config?.modelo || "gpt-4o-mini",
            messages: [{ role: "user", content: "Diga apenas: OK" }],
            max_tokens: 5,
          }),
        });
        const body = await res.text();
        result = res.ok
          ? { success: true, message: "Conexão com ChatGPT estabelecida com sucesso!" }
          : { success: false, message: `Erro ${res.status}: ${body.substring(0, 200)}` };
        break;
      }

      case "elevenlabs": {
        if (!config?.api_key) {
          result = { success: false, message: "API key é obrigatória." };
          break;
        }
        const res = await fetch("https://api.elevenlabs.io/v1/user", {
          headers: { "xi-api-key": config.api_key },
        });
        const body = await res.text();
        result = res.ok
          ? { success: true, message: "Conexão com ElevenLabs estabelecida com sucesso!" }
          : { success: false, message: `Erro ${res.status}: ${body.substring(0, 200)}` };
        break;
      }

      case "calcom": {
        if (!config?.api_key) {
          result = { success: false, message: "API key é obrigatória." };
          break;
        }
        const res = await fetch(`https://api.cal.com/v1/me?apiKey=${encodeURIComponent(config.api_key)}`);
        const body = await res.text();
        result = res.ok
          ? { success: true, message: "Conexão com Cal.com estabelecida com sucesso!" }
          : { success: false, message: `Erro ${res.status}: ${body.substring(0, 200)}` };
        break;
      }

      case "webhooks": {
        if (!config?.webhook_url) {
          result = { success: false, message: "URL do webhook é obrigatória." };
          break;
        }
        try {
          const method = config.metodo || "POST";
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (config.headers_custom) {
            try {
              const custom = JSON.parse(config.headers_custom);
              Object.assign(headers, custom);
            } catch { /* ignore */ }
          }
          const fetchOpts: RequestInit = { method, headers };
          if (method === "POST") {
            fetchOpts.body = JSON.stringify({ test: true, source: "izotope" });
          }
          const res = await fetch(config.webhook_url, fetchOpts);
          await res.text();
          result = res.ok
            ? { success: true, message: `Webhook respondeu com status ${res.status}!` }
            : { success: false, message: `Webhook respondeu com erro: status ${res.status}` };
        } catch (e) {
          result = { success: false, message: `Erro ao conectar: ${(e as Error).message}` };
        }
        break;
      }

      case "api": {
        if (!config?.url_base) {
          result = { success: false, message: "URL base é obrigatória." };
          break;
        }
        try {
          const headers: Record<string, string> = {};
          if (config.api_key) headers["Authorization"] = `Bearer ${config.api_key}`;
          if (config.headers_custom) {
            try {
              const custom = JSON.parse(config.headers_custom);
              Object.assign(headers, custom);
            } catch { /* ignore */ }
          }
          const res = await fetch(config.url_base, { headers });
          await res.text();
          result = res.ok
            ? { success: true, message: `API respondeu com status ${res.status}!` }
            : { success: false, message: `API respondeu com erro: status ${res.status}` };
        } catch (e) {
          result = { success: false, message: `Erro ao conectar: ${(e as Error).message}` };
        }
        break;
      }

      case "facebook_leads": {
        if (!config?.access_token) {
          result = { success: false, message: "Access Token é obrigatório." };
          break;
        }
        const res = await fetch(
          `https://graph.facebook.com/v19.0/me?access_token=${encodeURIComponent(config.access_token)}`
        );
        const body = await res.text();
        result = res.ok
          ? { success: true, message: "Conexão com Facebook estabelecida com sucesso!" }
          : { success: false, message: `Erro ${res.status}: ${body.substring(0, 200)}` };
        break;
      }

      default:
        result = { success: false, message: `Tipo de integração desconhecido: ${tipo}` };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ success: false, message: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
