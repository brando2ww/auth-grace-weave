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
    // Auth
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

    const body = await req.json();
    const { connectionName, action } = body;
    if (!connectionName) {
      return new Response(JSON.stringify({ error: "connectionName is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const EVO_URL = Deno.env.get("EVOLUTION_API_URL")!;
    const EVO_KEY = Deno.env.get("EVOLUTION_API_KEY")!;

    // Handle logout action: logout + delete instance
    if (action === "logout") {
      const logoutRes = await fetch(
        `${EVO_URL}/instance/logout/${encodeURIComponent(connectionName)}`,
        { method: "DELETE", headers: { apikey: EVO_KEY } }
      );
      const logoutData = await logoutRes.json();
      console.log("logout response:", JSON.stringify(logoutData));

      const deleteRes = await fetch(
        `${EVO_URL}/instance/delete/${encodeURIComponent(connectionName)}`,
        { method: "DELETE", headers: { apikey: EVO_KEY } }
      );
      const deleteData = await deleteRes.json();
      console.log("delete instance response:", JSON.stringify(deleteData));

      return new Response(
        JSON.stringify({ status: "disconnected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch instance
    const fetchRes = await fetch(
      `${EVO_URL}/instance/fetchInstances?instanceName=${encodeURIComponent(connectionName)}`,
      { headers: { apikey: EVO_KEY } }
    );
    const fetchStatus = fetchRes.status;
    const instances = await fetchRes.json();
    console.log("fetchInstances response:", JSON.stringify(instances), "status:", fetchStatus);

    const instanceMissing =
      fetchStatus === 404 ||
      !instances ||
      (Array.isArray(instances) && instances.length === 0);

    // 2. If instance doesn't exist, create it
    if (instanceMissing) {
      console.log("Instance not found, creating:", connectionName);
      const createRes = await fetch(`${EVO_URL}/instance/create`, {
        method: "POST",
        headers: { apikey: EVO_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceName: connectionName,
          integration: "WHATSAPP-BAILEYS",
          qrcode: true,
          syncFullHistory: true,
        }),
      });
      const createData = await createRes.json();
      console.log("create response:", JSON.stringify(createData));

      if (!createRes.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to create instance", details: createData }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const base64Raw =
        createData?.qrcode?.base64 ||
        createData?.base64 ||
        createData?.data?.base64;

      if (base64Raw) {
        const base64Clean = base64Raw.includes(",") ? base64Raw.split(",").pop()! : base64Raw;
        return new Response(
          JSON.stringify({ status: "qrcode", base64: base64Clean }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const connectAfterCreate = await fetch(
        `${EVO_URL}/instance/connect/${encodeURIComponent(connectionName)}`,
        { method: "GET", headers: { apikey: EVO_KEY } }
      );
      const connectAfterCreateData = await connectAfterCreate.json();
      console.log("connect after create response:", JSON.stringify(connectAfterCreateData));

      const qrBase64 =
        connectAfterCreateData?.base64 ||
        connectAfterCreateData?.qrcode?.base64 ||
        connectAfterCreateData?.data?.base64;

      if (qrBase64) {
        const base64Clean = qrBase64.includes(",") ? qrBase64.split(",").pop()! : qrBase64;
        return new Response(
          JSON.stringify({ status: "qrcode", base64: base64Clean }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ status: "error", error: "No QR code after create", details: connectAfterCreateData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Instance exists — check status and extract profile data
    const instanceData = Array.isArray(instances) ? instances[0] : instances;
    const instanceName = instanceData?.instance?.instanceName || instanceData?.name || connectionName;

    const profileName = instanceData?.instance?.profileName || instanceData?.profileName || null;
    const profilePictureUrl = instanceData?.instance?.profilePicUrl || instanceData?.profilePicUrl || instanceData?.instance?.profilePictureUrl || instanceData?.profilePictureUrl || null;
    const ownerRaw = instanceData?.instance?.ownerJid || instanceData?.ownerJid || instanceData?.instance?.owner || instanceData?.owner || null;
    const ownerPhone = ownerRaw ? ownerRaw.replace("@s.whatsapp.net", "") : null;

    const connectionStatus =
      instanceData?.connectionStatus ||
      instanceData?.instance?.status ||
      instanceData?.instance?.connectionStatus;

    if (connectionStatus === "open") {
      return new Response(
        JSON.stringify({
          status: "connected",
          profileName,
          profilePictureUrl,
          ownerPhone,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to connect
    const connectRes = await fetch(`${EVO_URL}/instance/connect/${encodeURIComponent(instanceName)}`, {
      method: "GET",
      headers: { apikey: EVO_KEY },
    });
    const connectData = await connectRes.json();
    console.log("connect response:", JSON.stringify(connectData));

    const connectState = connectData?.instance?.state;
    if (connectState === "open") {
      return new Response(
        JSON.stringify({
          status: "connected",
          profileName,
          profilePictureUrl,
          ownerPhone,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Raw =
      connectData?.base64 ||
      connectData?.qrcode?.base64 ||
      connectData?.data?.base64;

    if (!base64Raw) {
      return new Response(
        JSON.stringify({ status: "error", error: "No QR code returned", details: connectData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Clean = base64Raw.includes(",") ? base64Raw.split(",").pop()! : base64Raw;
    return new Response(
      JSON.stringify({ status: "qrcode", base64: base64Clean }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("evolution-qrcode error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
