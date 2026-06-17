import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function formatPhoneDisplay(phone: string): string {
  let p = phone.startsWith("0") ? phone.slice(1) : phone;
  if (p.length === 11 && p.startsWith("1")) {
    return `+1 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
  }
  if (p.startsWith("55") && p.length >= 12) {
    const local = p.slice(2);
    if (local.startsWith("800")) {
      return `0800 ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (/^[3459]00/.test(local) && local.length === 10) {
      return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (local.length === 11 && local.charAt(2) === "9") {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    }
    if (local.length === 10) {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    }
  }
  return `+${p}`;
}

function looksLikePhone(s: string): boolean {
  return /^[0+]?\d{7,15}$/.test(s);
}

async function fetchProfilePicWithRetry(
  url: string,
  apiKey: string,
  sessionName: string,
  phone: string,
  timeoutMs = 5000,
  retries = 1,
): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(
        `${url}/chat/fetchProfilePictureUrl/${encodeURIComponent(sessionName)}`,
        {
          method: "POST",
          headers: { apikey: apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ number: phone }),
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data?.profilePictureUrl) return data.profilePictureUrl;
      }
      return null; // HTTP ok but no URL, no point retrying
    } catch (err) {
      if (attempt < retries) continue; // retry on timeout/network error
      return null;
    }
  }
  return null;
}

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
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    let sync = false;
    try {
      const body = await req.json();
      sync = body?.sync === true;
    } catch {
      // no body
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from("whatsapp_sessions")
      .select("connection_name, profile_name")
      .eq("status", "connected");

    if (sessionsError) throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);

    if (!sessions || sessions.length === 0) {
      return new Response(JSON.stringify({ contacts: [], synced: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const EVO_URL = Deno.env.get("EVOLUTION_API_URL")!;
    const EVO_KEY = Deno.env.get("EVOLUTION_API_KEY")!;

    const contactsMap = new Map<string, any>();
    const autoMappings: Array<{ user_id: string; lid: string; phone: string; contact_name: string | null; session_name: string }> = [];

    let totalFromApi = 0;
    let withPhotoFromApi = 0;

    for (const session of sessions) {
      try {
        const res = await fetch(
          `${EVO_URL}/chat/findContacts/${encodeURIComponent(session.connection_name)}`,
          {
            method: "POST",
            headers: { apikey: EVO_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({}),
          },
        );

        if (!res.ok) {
          console.error(`Failed to fetch contacts for ${session.connection_name}: ${res.status}`);
          continue;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          totalFromApi += data.length;
          for (const contact of data) {
            const jid = contact.remoteJid || contact.id;
            if (!jid || jid.endsWith("@g.us") || jid === "status@broadcast") continue;

            const isLidJid = jid.endsWith("@lid");
            const lid = contact.lid || "";
            const pushName = contact.pushName || contact.verifiedName || contact.notify || null;

            if (lid && lid.endsWith("@lid") && jid.endsWith("@s.whatsapp.net")) {
              const phone = jid.replace("@s.whatsapp.net", "").replace("@c.us", "");
              const lidClean = lid.replace("@lid", "");
              autoMappings.push({ user_id: userId, lid: lidClean, phone, contact_name: pushName, session_name: session.connection_name });
            } else if (jid.endsWith("@lid") && lid && lid.endsWith("@s.whatsapp.net")) {
              const phone = lid.replace("@s.whatsapp.net", "").replace("@c.us", "");
              const lidClean = jid.replace("@lid", "");
              autoMappings.push({ user_id: userId, lid: lidClean, phone, contact_name: pushName, session_name: session.connection_name });
            }

            if (!isLidJid && !contactsMap.has(jid)) {
              const phone = jid.replace("@s.whatsapp.net", "").replace("@c.us", "");
              const existingPic = contact.profilePictureUrl || null;
              if (existingPic) withPhotoFromApi++;
              contactsMap.set(jid, {
                id: jid,
                name: (pushName && !looksLikePhone(pushName)) ? pushName : formatPhoneDisplay(phone),
                phone,
                profilePictureUrl: existingPic,
                sessionName: session.connection_name,
              });
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching contacts for ${session.connection_name}:`, err);
      }
    }

    const allContacts = Array.from(contactsMap.values());
    console.log(`[evolution-contacts] Total from API: ${totalFromApi}, unique non-LID: ${allContacts.length}, with photo from findContacts: ${withPhotoFromApi}`);

    // Fetch profile pictures only for contacts without one
    const needPhoto = allContacts.filter((c) => !c.profilePictureUrl);
    console.log(`[evolution-contacts] Fetching profile pics for ${needPhoto.length} contacts (skipping ${allContacts.length - needPhoto.length} that already have one)`);

    let photoSuccess = 0;
    let photoFail = 0;
    const BATCH_SIZE = 10;
    for (let i = 0; i < needPhoto.length; i += BATCH_SIZE) {
      const batch = needPhoto.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (contact) => {
          const url = await fetchProfilePicWithRetry(EVO_URL, EVO_KEY, contact.sessionName, contact.phone);
          if (url) {
            contact.profilePictureUrl = url;
            photoSuccess++;
          } else {
            photoFail++;
          }
        }),
      );
    }
    console.log(`[evolution-contacts] Profile pic fetch results: ${photoSuccess} success, ${photoFail} failed/empty`);

    // Service client for DB operations
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Auto-save LID→phone mappings
    if (autoMappings.length > 0) {
      const { error: mapErr } = await serviceClient
        .from("lid_phone_mappings")
        .upsert(autoMappings, { onConflict: "user_id,lid" });
      if (mapErr) {
        console.error(`[evolution-contacts] Error saving auto mappings:`, mapErr.message);
      } else {
        console.log(`[evolution-contacts] Auto-saved ${autoMappings.length} LID→phone mappings`);
      }
    }

    // LID→phone mappings
    const { data: lidMappings } = await serviceClient
      .from("lid_phone_mappings")
      .select("lid, phone, contact_name")
      .eq("user_id", userId);

    const lidToPhone = new Map<string, { phone: string; name: string | null }>();
    if (lidMappings) {
      for (const m of lidMappings) {
        lidToPhone.set(m.lid, { phone: m.phone, name: m.contact_name });
      }
    }

    // Fetch saved contacts
    const { data: savedContacts } = await serviceClient
      .from("contatos")
      .select("*")
      .eq("user_id", userId);

    const savedPhones = new Set<string>();
    if (savedContacts) {
      for (const c of savedContacts) {
        if (c.telefone) savedPhones.add(c.telefone);
      }
    }

    const isSaved = (c: any) => {
      const full = c.phone;
      const noCountry = c.phone.length > 2 ? c.phone.slice(2) : c.phone;
      return savedPhones.has(full) || savedPhones.has(noCountry) || savedPhones.has(`+${full}`);
    };

    const unsaved = allContacts.filter((c) => !isSaved(c));
    const saved = allContacts.filter((c) => isSaved(c));

    // Sync: insert unsaved contacts
    let syncedCount = 0;
    if (sync && unsaved.length > 0) {
      const rows = unsaved.map((c) => {
        const phone = c.phone;
        let telefone = phone;
        let codigoPais = "+55";
        if (phone.startsWith("55") && phone.length >= 12) {
          telefone = phone.slice(2);
        } else if (phone.startsWith("1") && phone.length === 11) {
          telefone = phone.slice(1);
          codigoPais = "+1";
        }
        return {
          user_id: userId,
          nome: c.name,
          telefone,
          codigo_pais: codigoPais,
          profile_picture_url: c.profilePictureUrl || null,
        };
      });

      const { error: insertErr } = await serviceClient.from("contatos").insert(rows);
      if (insertErr) {
        console.error("[evolution-contacts] Error syncing contacts:", insertErr.message);
      } else {
        syncedCount = rows.length;
        const withPic = rows.filter((r) => r.profile_picture_url).length;
        console.log(`[evolution-contacts] Synced ${syncedCount} contacts (${withPic} with photo)`);
      }
    }

    // Rehydrate: update profile_picture_url for saved contacts missing it
    if (savedContacts) {
      const updates: Array<{ id: string; profile_picture_url: string }> = [];
      for (const evoContact of saved) {
        if (!evoContact.profilePictureUrl) continue;
        const dbRecord = savedContacts.find((sc) => {
          const cleanPhone = sc.telefone?.replace(/\D/g, "") || "";
          const withCountry = sc.codigo_pais
            ? sc.codigo_pais.replace("+", "") + cleanPhone
            : cleanPhone;
          return evoContact.phone === cleanPhone || evoContact.phone === withCountry;
        });
        if (dbRecord && !dbRecord.profile_picture_url) {
          updates.push({ id: dbRecord.id, profile_picture_url: evoContact.profilePictureUrl });
        }
      }
      if (updates.length > 0) {
        for (const u of updates) {
          await serviceClient
            .from("contatos")
            .update({ profile_picture_url: u.profile_picture_url })
            .eq("id", u.id);
        }
        console.log(`[evolution-contacts] Rehydrated ${updates.length} contacts with profile pictures`);
      }
    }

    // Build Evolution phones set for reverse lookup
    const evolutionPhones = new Set<string>();
    for (const c of allContacts) {
      evolutionPhones.add(c.phone);
      if (c.phone.length > 2) evolutionPhones.add(c.phone.slice(2));
    }

    // DB-only contacts
    const dbOnly: any[] = [];
    if (savedContacts) {
      for (const c of savedContacts) {
        if (!c.telefone) continue;
        const cleanPhone = c.telefone.replace(/\D/g, "");
        const withCountry = c.codigo_pais
          ? c.codigo_pais.replace("+", "") + cleanPhone
          : cleanPhone;
        if (!evolutionPhones.has(cleanPhone) && !evolutionPhones.has(withCountry)) {
          dbOnly.push({
            id: `db-${c.id}`,
            name: (c.nome && !looksLikePhone(c.nome)) ? c.nome : formatPhoneDisplay(withCountry || cleanPhone),
            phone: withCountry || cleanPhone,
            profilePictureUrl: c.profile_picture_url || null,
            sessionName: "",
            saved: true,
          });
        }
      }
    }

    const sortFn = (a: any, b: any) => (a.name || "").localeCompare(b.name || "");
    const contacts = [
      ...unsaved.sort(sortFn).map((c) => ({ ...c, saved: false })),
      ...[...saved.map((c) => ({ ...c, saved: true })), ...dbOnly].sort(sortFn),
    ];

    return new Response(JSON.stringify({ contacts, synced: syncedCount }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("evolution-contacts error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
