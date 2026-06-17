import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isValidChatJid(jid: string): boolean {
  if (!jid || !jid.includes("@")) return false;
  if (jid === "status@broadcast") return false;
  if (jid === "0@s.whatsapp.net") return false;
  if (jid.endsWith("@lid")) return false;
  return true;
}

// Fetch profile pictures for specific JIDs in batches (re-hydration only)
async function fetchProfilePicturesForJids(
  evoUrl: string,
  evoKey: string,
  connectionName: string,
  jids: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const BATCH_SIZE = 10;

  for (let i = 0; i < jids.length; i += BATCH_SIZE) {
    const batch = jids.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (jid) => {
        try {
          const phone = jid.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@g.us", "").replace("@lid", "");
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(
            `${evoUrl}/chat/fetchProfilePictureUrl/${encodeURIComponent(connectionName)}`,
            {
              method: "POST",
              headers: { apikey: evoKey, "Content-Type": "application/json" },
              body: JSON.stringify({ number: phone }),
              signal: controller.signal,
            }
          );
          clearTimeout(timeout);
          if (res.ok) {
            const data = await res.json();
            if (data?.profilePictureUrl) {
              result.set(jid, data.profilePictureUrl);
            }
          }
        } catch {
          // timeout or error
        }
      })
    );
  }

  return result;
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
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch local chats + pins in parallel
    const [chatsResult, pinsResult] = await Promise.all([
      supabase
        .from("chat_last_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("last_message_timestamp", { ascending: false })
        .limit(500),
      supabase
        .from("chat_pins")
        .select("chat_jid, session_name")
        .eq("user_id", user.id),
    ]);

    if (chatsResult.error) {
      throw new Error(`Failed to fetch chats: ${chatsResult.error.message}`);
    }

    let chatRows = chatsResult.data || [];

    // Auto-cleanup: filter out invalid JIDs and delete them from DB
    const invalidRows = chatRows.filter((r: any) => !isValidChatJid(r.chat_jid));
    if (invalidRows.length > 0) {
      console.log(`[evolution-chats] Cleaning up ${invalidRows.length} invalid chat_jid rows`);
      const serviceSupabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const invalidIds = invalidRows.map((r: any) => r.id);
      for (let i = 0; i < invalidIds.length; i += 100) {
        await serviceSupabase
          .from("chat_last_messages")
          .delete()
          .in("id", invalidIds.slice(i, i + 100));
      }
      chatRows = chatRows.filter((r: any) => isValidChatJid(r.chat_jid));
    }

    // Incremental re-hydration: fill missing photos
    const EVO_URL = Deno.env.get("EVOLUTION_API_URL");
    const EVO_KEY = Deno.env.get("EVOLUTION_API_KEY");

    if (chatRows.length > 0 && EVO_URL && EVO_KEY) {
      const nullPhotoRows = chatRows.filter((r: any) =>
        !r.profile_picture_url && isValidChatJid(r.chat_jid)
      );

      if (nullPhotoRows.length > 0) {
        console.log(`[evolution-chats] Re-hydrating ${nullPhotoRows.length} rows with missing photos`);
        const serviceSupabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Group by session
        const bySession = new Map<string, string[]>();
        for (const row of nullPhotoRows) {
          const jids = bySession.get(row.session_name) || [];
          jids.push(row.chat_jid);
          bySession.set(row.session_name, jids);
        }

        for (const [sessionName, jids] of bySession) {
          const photosMap = await fetchProfilePicturesForJids(EVO_URL, EVO_KEY, sessionName, jids);
          if (photosMap.size > 0) {
            for (const [jid, url] of photosMap) {
              await serviceSupabase
                .from("chat_last_messages")
                .update({ profile_picture_url: url, updated_at: new Date().toISOString() })
                .eq("user_id", user.id)
                .eq("session_name", sessionName)
                .eq("chat_jid", jid);
              // Update in-memory
              const row = chatRows.find((r: any) => r.session_name === sessionName && r.chat_jid === jid);
              if (row) row.profile_picture_url = url;
            }
            console.log(`[evolution-chats] Re-hydrated ${photosMap.size} photos for ${sessionName}`);
          }
        }
      }
    }

    // Re-hydrate group names: groups whose contact_name is just a number (JID-based)
    const groupsWithoutName = chatRows.filter((r: any) =>
      r.is_group && r.contact_name && /^\d+$/.test(r.contact_name)
    );

    if (groupsWithoutName.length > 0 && EVO_URL && EVO_KEY) {
      console.log(`[evolution-chats] Re-hydrating ${groupsWithoutName.length} group names`);
      const serviceSupabase2 = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Group by session
      const groupsBySession = new Map<string, any[]>();
      for (const row of groupsWithoutName) {
        const list = groupsBySession.get(row.session_name) || [];
        list.push(row);
        groupsBySession.set(row.session_name, list);
      }

      for (const [sessionName, rows] of groupsBySession) {
        for (const row of rows) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(
              `${EVO_URL}/group/findGroupInfos/${encodeURIComponent(sessionName)}?groupJid=${encodeURIComponent(row.chat_jid)}`,
              {
                method: "GET",
                headers: { apikey: EVO_KEY },
                signal: controller.signal,
              }
            );
            clearTimeout(timeout);
            if (res.ok) {
              const groupData = await res.json();
              if (groupData?.subject) {
                row.contact_name = groupData.subject;
                await serviceSupabase2
                  .from("chat_last_messages")
                  .update({ contact_name: groupData.subject, updated_at: new Date().toISOString() })
                  .eq("id", row.id);
                console.log(`[evolution-chats] Group ${row.chat_jid} name updated to: ${groupData.subject}`);
              }
            }
          } catch {
            // timeout or error
          }
        }
      }
    }

    // Re-hydrate contact names from contatos table for individual chats with numeric names
    const chatsWithNumericName = chatRows.filter((r: any) =>
      !r.is_group && r.contact_name && /^[\d\s()+\-]+$/.test(r.contact_name)
    );

    if (chatsWithNumericName.length > 0) {
      // Collect all phone variants for batch lookup
      const allVariants: string[] = [];
      const variantMap = new Map<string, any[]>(); // variant -> rows

      for (const row of chatsWithNumericName) {
        const phone = row.chat_jid.replace("@s.whatsapp.net", "").replace("@c.us", "");
        const variants = [phone];
        if (phone.startsWith("55") && phone.length >= 12) {
          variants.push(phone.slice(2));
          variants.push(phone.slice(4));
        }
        for (const v of variants) {
          allVariants.push(v);
          const existing = variantMap.get(v) || [];
          existing.push(row);
          variantMap.set(v, existing);
        }
      }

      const { data: matchedContacts } = await supabase
        .from("contatos")
        .select("nome, telefone")
        .eq("user_id", user.id)
        .in("telefone", allVariants);

      if (matchedContacts && matchedContacts.length > 0) {
        const serviceSupabase3 = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        for (const contact of matchedContacts) {
          const rows = variantMap.get(contact.telefone) || [];
          for (const row of rows) {
            if (row.contact_name !== contact.nome) {
              row.contact_name = contact.nome;
              await serviceSupabase3
                .from("chat_last_messages")
                .update({ contact_name: contact.nome, updated_at: new Date().toISOString() })
                .eq("id", row.id);
            }
          }
        }
        console.log(`[evolution-chats] Re-hydrated ${matchedContacts.length} contact names from contatos table`);
      }
    }

    const pinnedSet = new Set<string>();
    if (pinsResult.data) {
      for (const pin of pinsResult.data) {
        pinnedSet.add(`${pin.session_name}::${pin.chat_jid}`);
      }
    }

    const chats = chatRows
      .filter((chat: any) => isValidChatJid(chat.chat_jid))
      .map((chat: any) => {
        const phone = chat.chat_jid
          .replace("@s.whatsapp.net", "")
          .replace("@c.us", "")
          .replace("@g.us", "")
          .replace("@lid", "");
        const isPinned = pinnedSet.has(`${chat.session_name}::${chat.chat_jid}`);

        return {
          id: chat.chat_jid,
          name: chat.contact_name || phone,
          phone,
          profilePictureUrl: chat.profile_picture_url,
          lastMessage: chat.last_message || "",
          timestamp: chat.last_message_timestamp,
          unreadCount: chat.unread_count || 0,
          pinned: isPinned,
          sessionName: chat.session_name,
          labelName: chat.label_name || chat.session_name,
          labelColor: chat.label_color || "#6B7280",
          isGroup: chat.is_group || false,
          lastMessageSender: chat.last_message_sender || "",
          lastMessageFromMe: chat.last_message_from_me || false,
          lastMessageStatus: chat.last_message_status || null,
        };
      });

    chats.sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });

    return new Response(JSON.stringify({ chats }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("evolution-chats error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
