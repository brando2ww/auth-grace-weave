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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sessionName, chatJid, message, messageType = "text" } = await req.json();

    if (!sessionName || !chatJid || !message) {
      return new Response(JSON.stringify({ error: "sessionName, chatJid and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const evoUrl = Deno.env.get("EVOLUTION_API_URL")!;
    const evoKey = Deno.env.get("EVOLUTION_API_KEY")!;

    // Verify session belongs to user
    const { data: session } = await supabase
      .from("whatsapp_sessions")
      .select("connection_name")
      .eq("connection_name", sessionName)
      .single();

    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let evoEndpoint: string;
    let evoBody: any;

    if (messageType === "text") {
      evoEndpoint = `${evoUrl}/message/sendText/${sessionName}`;
      evoBody = {
        number: chatJid,
        text: message,
      };
    } else {
      // For media messages
      evoEndpoint = `${evoUrl}/message/sendMedia/${sessionName}`;
      evoBody = {
        number: chatJid,
        mediatype: messageType, // image, audio, document, video
        media: message, // base64 or URL
      };
    }

    const evoResponse = await fetch(evoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: evoKey,
      },
      body: JSON.stringify(evoBody),
    });

    const evoData = await evoResponse.json();

    if (!evoResponse.ok) {
      console.error("Evolution API error:", evoData);
      return new Response(JSON.stringify({ error: "Failed to send message", details: evoData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: evoData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
