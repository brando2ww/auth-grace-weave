import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { connectionName } = await req.json();
    if (!connectionName) {
      return new Response(JSON.stringify({ error: "connectionName required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const EVO_URL = Deno.env.get("EVOLUTION_API_URL")!;
    const EVO_KEY = Deno.env.get("EVOLUTION_API_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

    const webhookUrl = `${SUPABASE_URL}/functions/v1/evolution-webhook?apikey=${encodeURIComponent(EVO_KEY)}`;
    console.log(`[evolution-register-webhook] Registering webhook for "${connectionName}" -> ${webhookUrl}`);

    // Register webhook on Evolution API
    const response = await fetch(
      `${EVO_URL}/webhook/set/${encodeURIComponent(connectionName)}`,
      {
        method: "POST",
        headers: { apikey: EVO_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          webhook: {
            enabled: true,
            url: webhookUrl,
            webhookByEvents: false,
            webhookBase64: false,
          events: [
              "APPLICATION_STARTUP",
              "QRCODE_UPDATED",
              "MESSAGES_SET",
              "MESSAGES_UPSERT",
              "MESSAGES_UPDATE",
              "MESSAGES_DELETE",
              "SEND_MESSAGE",
              "CONTACTS_SET",
              "CONTACTS_UPSERT",
              "CONTACTS_UPDATE",
              "PRESENCE_UPDATE",
              "CHATS_SET",
              "CHATS_UPSERT",
              "CHATS_UPDATE",
              "CHATS_DELETE",
              "GROUPS_UPSERT",
              "GROUP_UPDATE",
              "GROUP_PARTICIPANTS_UPDATE",
              "CONNECTION_UPDATE",
              "LABELS_EDIT",
              "LABELS_ASSOCIATION",
              "CALL",
              "TYPEBOT_START",
              "TYPEBOT_CHANGE_STATUS",
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to register webhook: ${response.status} - ${errText}`);
      return new Response(
        JSON.stringify({ error: "Failed to register webhook", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    console.log(`[evolution-register-webhook] Success for "${connectionName}":`, JSON.stringify(result));

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("evolution-register-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
