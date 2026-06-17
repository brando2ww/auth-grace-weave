import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Fetch profile picture for a single JID (with timeout)
async function fetchProfilePicture(
  evoUrl: string,
  evoKey: string,
  connectionName: string,
  jid: string,
): Promise<string | null> {
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
      return data?.profilePictureUrl || null;
    }
  } catch {
    // Timeout or network error — return null
  }
  return null;
}

// Fetch group participants to resolve LID JIDs
async function fetchGroupParticipants(
  evoUrl: string,
  evoKey: string,
  connectionName: string,
  groupJid: string,
): Promise<Array<{ id: string; name?: string }>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `${evoUrl}/group/participants/${encodeURIComponent(connectionName)}?groupJid=${encodeURIComponent(groupJid)}`,
      {
        method: "GET",
        headers: { apikey: evoKey },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      // Evolution API returns array of participants or { participants: [...] }
      const participants = Array.isArray(data) ? data : data?.participants || [];
      return participants.map((p: any) => ({
        id: p.id || p.jid || "",
        name: p.name || p.pushName || p.notify || null,
      }));
    }
  } catch {
    // timeout or error
  }
  return [];
}

// Resolve mention placeholders in message text
async function resolveMentions(
  supabase: any,
  text: string,
  mentionedJid: string[],
  userId: string,
  instanceName?: string,
  chatJid?: string,
): Promise<string> {
  if (!mentionedJid || mentionedJid.length === 0) return text;

  let resolved = text;

  // Pre-fetch group participants if any mentionedJid is a LID and we're in a group
  let groupParticipants: Array<{ id: string; name?: string }> = [];
  const hasLidMentions = mentionedJid.some(jid => jid.endsWith("@lid"));
  if (hasLidMentions && chatJid?.endsWith("@g.us") && instanceName) {
    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    if (evoUrl && evoKey) {
      groupParticipants = await fetchGroupParticipants(evoUrl, evoKey, instanceName, chatJid);
      console.log(`[evolution-webhook] Fetched ${groupParticipants.length} group participants for LID resolution`);
    }
  }

  for (const jid of mentionedJid) {
    const isLid = jid.endsWith("@lid");
    const identifier = jid.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@g.us", "").replace(/@lid$/, "").replace(/:.*/, "");
    
    let name: string | null = null;

    if (isLid) {
      // Try to find name from group participants
      const participant = groupParticipants.find(p => p.id === jid || p.id?.includes(identifier));
      if (participant?.name) {
        name = participant.name;
        console.log(`[evolution-webhook] Resolved LID ${jid} → ${name} via group participants`);
      }

      // Fallback: search previous messages in this group for pushName
      if (!name && chatJid) {
        const { data: prevMsg } = await supabase
          .from("messages")
          .select("raw_data")
          .eq("user_id", userId)
          .eq("chat_jid", chatJid)
          .eq("from_me", false)
          .order("timestamp", { ascending: false })
          .limit(50);
        
        if (prevMsg) {
          for (const m of prevMsg) {
            const raw = m.raw_data;
            const participant = raw?.key?.participant || raw?.participant;
            if (participant && (participant === jid || participant.includes(identifier))) {
              if (raw?.pushName) {
                name = raw.pushName;
                console.log(`[evolution-webhook] Resolved LID ${jid} → ${name} via message history`);
                break;
              }
            }
          }
        }
      }
    } else {
      // Regular phone-based JID — try contatos table
      const { data: contato } = await supabase
        .from("contatos")
        .select("nome")
        .eq("user_id", userId)
        .eq("telefone", identifier)
        .maybeSingle();
      if (contato?.nome) {
        name = contato.nome;
      }

      // Fallback: chat_last_messages contact_name
      if (!name) {
        const { data: chat } = await supabase
          .from("chat_last_messages")
          .select("contact_name")
          .eq("user_id", userId)
          .eq("chat_jid", `${identifier}@s.whatsapp.net`)
          .maybeSingle();
        if (chat?.contact_name) {
          name = chat.contact_name;
        }
      }

      // Last fallback: formatted phone
      if (!name) {
        name = formatPhone(identifier);
      }
    }

    if (name) {
      // Replace @<identifier> with @<name>
      const mentionRegex = new RegExp(`@${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      resolved = resolved.replace(mentionRegex, `@${name}`);
    }
  }

  return resolved;
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("apikey") || new URL(req.url).searchParams.get("apikey");
    const expectedKey = Deno.env.get("EVOLUTION_API_KEY");
    if (!apiKey || apiKey !== expectedKey) {
      console.error("Invalid webhook API key");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    console.log(`[evolution-webhook] body keys: ${JSON.stringify(Object.keys(body))}`);
    console.log(`[evolution-webhook] body.instance: ${JSON.stringify(body.instance)}`);
    
    const rawEvent = body.event || "";
    const event = rawEvent.toLowerCase().replace(/_/g, ".");

    const instanceName = 
      body.instance?.instanceName || 
      body.instanceName || 
      (typeof body.instance === "string" ? body.instance : "") ||
      body.data?.instance?.instanceName ||
      body.sender ||
      "";
    
    if (!instanceName) {
      console.error(`[evolution-webhook] Could not extract instanceName. Body (truncated): ${JSON.stringify(body).substring(0, 500)}`);
    }
    
    console.log(`[evolution-webhook] event="${rawEvent}" normalized="${event}" instance="${instanceName}"`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event === "messages.upsert") {
      await handleMessagesUpsert(supabase, body, instanceName);
    } else if (event === "messages.update") {
      await handleMessagesUpdate(supabase, body, instanceName);
    } else if (event === "contacts.upsert" || event === "contacts.set" || event === "contacts.update") {
      await handleContactsUpsert(supabase, body, instanceName);
    } else {
      console.log(`[evolution-webhook] Ignoring event: ${rawEvent}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("evolution-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function isValidChatJid(jid: string): boolean {
  if (!jid || !jid.includes("@")) return false;
  if (jid === "status@broadcast") return false;
  if (jid === "0@s.whatsapp.net") return false;
  if (jid.endsWith("@lid")) return false;
  return true;
}

function formatPhone(phone: string): string {
  if (phone.length === 13 && phone.startsWith("55")) {
    return `+${phone.slice(0,2)} (${phone.slice(2,4)}) ${phone.slice(4,9)}-${phone.slice(9)}`;
  }
  if (phone.length === 12 && phone.startsWith("55")) {
    return `+${phone.slice(0,2)} (${phone.slice(2,4)}) ${phone.slice(4,8)}-${phone.slice(8)}`;
  }
  return `+${phone}`;
}

async function handleMessagesUpsert(supabase: any, body: any, instanceName: string) {
  const data = body.data;

  if (!instanceName || !data) {
    console.error("Missing instanceName or data in messages.upsert");
    return;
  }

  const { data: session, error: sessionError } = await supabase
    .from("whatsapp_sessions")
    .select("user_id, label_name, label_color")
    .eq("connection_name", instanceName)
    .eq("status", "connected")
    .single();

  if (sessionError || !session) {
    console.error(`No connected session found for ${instanceName}:`, sessionError?.message);
    return;
  }

  const userId = session.user_id;

  const message = data.key ? data : data.message ? data : null;
  if (!message || !message.key) {
    console.log("No valid message key found, skipping");
    return;
  }

  const key = message.key;
  const jid = key.remoteJid;
  if (!isValidChatJid(jid)) return;

  const messageId = key.id;
  const fromMe = key.fromMe || false;
  const isGroup = jid.endsWith("@g.us");

  const msg = message.message || {};
  let content =
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.documentMessage?.fileName ||
    (msg.audioMessage ? (() => {
      const secs = msg.audioMessage.seconds || 0;
      const m = Math.floor(secs / 60);
      const s = String(secs % 60).padStart(2, "0");
      return `🎤 Áudio • ${m}:${s}`;
    })() : "") ||
    (msg.stickerMessage ? "🙂 Sticker" : "") ||
    (msg.imageMessage ? "🖼️ Foto" : "") ||
    (msg.videoMessage ? "🎥 Vídeo" : "") ||
    (msg.documentMessage ? "📄 Documento" : "") ||
    (msg.contactMessage ? "👤 Contato" : "") ||
    (msg.locationMessage ? "📍 Localização" : "") ||
    (msg.bcallMessage ? "📞 Chamada de voz" : "") ||
    "";

  // Resolve mention placeholders (@number → @name)
  const mentionedJid = msg.extendedTextMessage?.contextInfo?.mentionedJid || data.contextInfo?.mentionedJid || [];
  if (content && mentionedJid && mentionedJid.length > 0) {
    content = await resolveMentions(supabase, content, mentionedJid, userId, instanceName, jid);
  }

  let messageType = "text";
  if (msg.imageMessage) messageType = "image";
  else if (msg.videoMessage) messageType = "video";
  else if (msg.audioMessage) messageType = "audio";
  else if (msg.documentMessage) messageType = "document";
  else if (msg.stickerMessage) messageType = "sticker";
  else if (msg.contactMessage) messageType = "contact";
  else if (msg.locationMessage) messageType = "location";

  const timestamp = message.messageTimestamp
    ? typeof message.messageTimestamp === "number"
      ? message.messageTimestamp
      : parseInt(message.messageTimestamp, 10)
    : Math.floor(Date.now() / 1000);

  const { error: msgError } = await supabase
    .from("messages")
    .upsert(
      {
        user_id: userId,
        session_name: instanceName,
        chat_jid: jid,
        message_id: messageId,
        from_me: fromMe,
        content,
        message_type: messageType,
        timestamp,
        raw_data: message,
      },
      { onConflict: "session_name,message_id" }
    );

  if (msgError) {
    console.error("Error inserting message:", msgError.message);
  }

  // Upsert chat_last_messages — check if chat already exists to decide if we need a profile pic
  const pushName = message.pushName || "";
  const phone = jid.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@g.us", "").replace("@lid", "");

  // Check if this chat already exists
  const { data: existingChat } = await supabase
    .from("chat_last_messages")
    .select("id, profile_picture_url, unread_count, contact_name")
    .eq("user_id", userId)
    .eq("session_name", instanceName)
    .eq("chat_jid", jid)
    .maybeSingle();

  let profilePictureUrl: string | null = existingChat?.profile_picture_url || null;

  // If chat is new (doesn't exist yet), fetch profile picture
  if (!existingChat) {
    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    if (evoUrl && evoKey) {
      profilePictureUrl = await fetchProfilePicture(evoUrl, evoKey, instanceName, jid);
      console.log(`[evolution-webhook] New chat ${jid}: fetched profile pic = ${profilePictureUrl ? "yes" : "no"}`);
    }
  }

  // For groups: preserve group name, store sender separately
  // For individuals: use pushName as contact_name
  let contactName: string;
  let lastMessageSender: string | null = null;

  if (isGroup) {
    if (fromMe) {
      lastMessageSender = "Você";
    } else {
      // If pushName looks like a JID (contains @), extract and format the phone number
      if (pushName && pushName.includes("@")) {
        const senderPhone = pushName.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@g.us", "").replace(/:.*@lid$/, "").replace("@lid", "");
        lastMessageSender = formatPhone(senderPhone);
      } else {
        lastMessageSender = pushName || null;
      }
    }
    // Preserve existing group name; for new groups use JID-based name
    if (existingChat?.contact_name) {
      contactName = existingChat.contact_name;
    } else {
      // Try to use a group-like fallback name
      contactName = phone;
      // Attempt to fetch group name from Evolution API
      const evoUrl = Deno.env.get("EVOLUTION_API_URL");
      const evoKey = Deno.env.get("EVOLUTION_API_KEY");
      if (evoUrl && evoKey) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(
            `${evoUrl}/group/findGroupInfos/${encodeURIComponent(instanceName)}?groupJid=${encodeURIComponent(jid)}`,
            {
              method: "GET",
              headers: { apikey: evoKey },
              signal: controller.signal,
            }
          );
          clearTimeout(timeout);
          if (res.ok) {
            const groupData = await res.json();
            if (groupData?.subject) {
              contactName = groupData.subject;
              console.log(`[evolution-webhook] Group ${jid}: name = ${contactName}`);
            }
          }
        } catch {
          // timeout or error — keep fallback
        }
      }
    }
  } else {
    // Look up saved contact name from contatos table (try multiple phone variants)
    let savedContactName: string | null = null;
    const phoneVariants = [phone];
    if (phone.startsWith("55") && phone.length >= 12) {
      phoneVariants.push(phone.slice(2)); // without country code
      phoneVariants.push(phone.slice(4)); // without country code + DDD
    }
    const { data: savedContact } = await supabase
      .from("contatos")
      .select("nome")
      .eq("user_id", userId)
      .in("telefone", phoneVariants)
      .limit(1)
      .maybeSingle();
    if (savedContact?.nome) {
      savedContactName = savedContact.nome;
    }

    if (fromMe) {
      const existingIsJustPhone = existingChat?.contact_name && /^[\d\s()+\-]+$/.test(existingChat.contact_name);
      contactName = savedContactName || (existingIsJustPhone ? null : existingChat?.contact_name) || formatPhone(phone);
    } else {
      contactName = savedContactName || pushName || formatPhone(phone);
    }
    lastMessageSender = null;
  }

  const chatUpsertData: any = {
    user_id: userId,
    session_name: instanceName,
    chat_jid: jid,
    contact_name: contactName || phone,
    last_message: content.substring(0, 200),
    last_message_timestamp: timestamp,
    last_message_sender: lastMessageSender,
    is_group: isGroup,
    last_message_from_me: fromMe,
    label_name: session.label_name || instanceName,
    label_color: session.label_color || "#6B7280",
    updated_at: new Date().toISOString(),
    last_message_status: fromMe ? "sent" : null,
  };

  // Increment unread for incoming messages, reset for outgoing
  if (!fromMe) {
    chatUpsertData.unread_count = (existingChat?.unread_count || 0) + 1;
  } else {
    chatUpsertData.unread_count = 0;
  }

  // Only set profile_picture_url if we have one (to avoid overwriting existing with null)
  if (profilePictureUrl) {
    chatUpsertData.profile_picture_url = profilePictureUrl;
  }

  const { error: chatError } = await supabase
    .from("chat_last_messages")
    .upsert(chatUpsertData, { onConflict: "user_id,session_name,chat_jid", ignoreDuplicates: false });

  if (chatError) {
    console.error("Error upserting chat_last_messages:", chatError.message);
  }

  // Auto-extract LID→phone mappings from message payload
  try {
    const participant = message.key?.participant || message.participant || "";
    const messageLid = message.lid || data.lid || "";
    const senderPushName = message.pushName || "";

    // Case 1: participant is real JID, lid field has the LID
    if (participant.endsWith("@s.whatsapp.net") && messageLid && messageLid.endsWith("@lid")) {
      const realPhone = participant.replace("@s.whatsapp.net", "").replace("@c.us", "");
      const lidClean = messageLid.replace("@lid", "").replace(/:.*/, "");
      await supabase.from("lid_phone_mappings").upsert(
        { user_id: userId, lid: lidClean, phone: realPhone, contact_name: senderPushName || null, session_name: instanceName },
        { onConflict: "user_id,lid" }
      );
      console.log(`[evolution-webhook] Auto-mapped LID ${lidClean} → ${realPhone} from message`);
    }
    // Case 2: participant is LID, check if we have a real JID elsewhere
    else if (participant.endsWith("@lid") && messageLid && messageLid.endsWith("@s.whatsapp.net")) {
      const realPhone = messageLid.replace("@s.whatsapp.net", "").replace("@c.us", "");
      const lidClean = participant.replace("@lid", "").replace(/:.*/, "");
      await supabase.from("lid_phone_mappings").upsert(
        { user_id: userId, lid: lidClean, phone: realPhone, contact_name: senderPushName || null, session_name: instanceName },
        { onConflict: "user_id,lid" }
      );
      console.log(`[evolution-webhook] Auto-mapped LID ${lidClean} → ${realPhone} from message (reversed)`);
    }
  } catch (e) {
    // Non-critical, don't break message processing
    console.error("[evolution-webhook] Error extracting LID mapping from message:", e);
  }
}

function mapAckStatus(ackStatus: any): string | null {
  // Handle string status from Evolution API v2
  if (typeof ackStatus === "string") {
    const s = ackStatus.toUpperCase();
    if (s === "SERVER_ACK" || s === "SERVER") return "sent";
    if (s === "DELIVERY_ACK" || s === "DELIVERED" || s === "DELIVERY") return "delivered";
    if (s === "READ") return "read";
    if (s === "PLAYED") return "read";
    // Try parsing as number string
    const n = parseInt(ackStatus, 10);
    if (!isNaN(n)) return mapAckStatus(n);
    return null;
  }
  // Handle numeric status
  if (typeof ackStatus === "number") {
    if (ackStatus >= 5) return "read";
    if (ackStatus >= 3) return "read";
    if (ackStatus === 2) return "delivered";
    if (ackStatus === 1) return "sent";
  }
  return null;
}

async function handleMessagesUpdate(supabase: any, body: any, instanceName: string) {
  const data = body.data;

  if (!instanceName || !data) return;

  console.log(`[evolution-webhook] messages.update payload: ${JSON.stringify(data).substring(0, 500)}`);

  const updates = Array.isArray(data) ? data : [data];
  for (const update of updates) {
    // Support both flat (Evolution API v2) and nested payload formats
    const messageId = update.keyId || update.key?.id;
    const remoteJid = update.remoteJid || update.key?.remoteJid;
    const isFromMe = update.fromMe ?? update.key?.fromMe;
    const ackStatus = update.status || update.key?.status;

    if (!messageId) {
      console.log(`[evolution-webhook] messages.update: no messageId found, skipping`);
      continue;
    }

    // Update raw_data on the messages table
    const { error } = await supabase
      .from("messages")
      .update({ raw_data: update })
      .eq("session_name", instanceName)
      .eq("message_id", messageId);

    if (error) {
      console.error("Error updating message:", error.message);
    }

    // Update ACK status on chat_last_messages
    if (ackStatus !== undefined && isFromMe) {
      const statusText = mapAckStatus(ackStatus);

      // Resolve the real chat_jid: if remoteJid is @lid or invalid, look it up from messages table
      let chatJid = remoteJid && isValidChatJid(remoteJid) ? remoteJid : null;

      if (!chatJid) {
        const { data: msgRow } = await supabase
          .from("messages")
          .select("chat_jid")
          .eq("session_name", instanceName)
          .eq("message_id", messageId)
          .maybeSingle();

        chatJid = msgRow?.chat_jid || null;
      }

      console.log(`[evolution-webhook] ACK: raw=${JSON.stringify(ackStatus)} mapped=${statusText} jid=${chatJid} (original=${remoteJid})`);

      if (statusText && chatJid) {
        const { data: chatRow } = await supabase
          .from("chat_last_messages")
          .select("id")
          .eq("session_name", instanceName)
          .eq("chat_jid", chatJid)
          .eq("last_message_from_me", true)
          .maybeSingle();

        if (chatRow) {
          await supabase
            .from("chat_last_messages")
            .update({ last_message_status: statusText })
            .eq("id", chatRow.id);
        }
      }
}

async function handleContactsUpsert(supabase: any, body: any, instanceName: string) {
  const data = body.data;
  if (!instanceName || !data) return;

  console.log(`[evolution-webhook] contacts event payload: ${JSON.stringify(data).substring(0, 1000)}`);

  // Find the session to get user_id
  const { data: session } = await supabase
    .from("whatsapp_sessions")
    .select("user_id")
    .eq("connection_name", instanceName)
    .eq("status", "connected")
    .single();

  if (!session) {
    console.error(`[evolution-webhook] No connected session for ${instanceName} in contacts event`);
    return;
  }

  const userId = session.user_id;
  const contacts = Array.isArray(data) ? data : [data];
  const mappings: Array<{ user_id: string; lid: string; phone: string; contact_name: string | null; session_name: string }> = [];

  for (const contact of contacts) {
    const id = contact.remoteJid || contact.id || "";
    const lid = contact.lid || "";
    const pushName = contact.pushName || contact.verifiedName || contact.notify || null;

    // Case 1: contact has both a regular JID (id) and a lid field
    if (lid && lid.endsWith("@lid") && id && id.endsWith("@s.whatsapp.net")) {
      const phone = id.replace("@s.whatsapp.net", "").replace("@c.us", "");
      const lidClean = lid.replace("@lid", "");
      mappings.push({ user_id: userId, lid: lidClean, phone, contact_name: pushName, session_name: instanceName });
      console.log(`[evolution-webhook] LID mapping: ${lidClean} → ${phone} (${pushName})`);
    }
    // Case 2: id is @lid and lid field contains the real JID
    else if (id.endsWith("@lid") && lid && lid.endsWith("@s.whatsapp.net")) {
      const phone = lid.replace("@s.whatsapp.net", "").replace("@c.us", "");
      const lidClean = id.replace("@lid", "");
      mappings.push({ user_id: userId, lid: lidClean, phone, contact_name: pushName, session_name: instanceName });
      console.log(`[evolution-webhook] LID mapping (reversed): ${lidClean} → ${phone} (${pushName})`);
    }
    // Case 3: contact has 'owner' field with the real number
    else if (id.endsWith("@lid") && contact.owner) {
      const phone = contact.owner.replace("@s.whatsapp.net", "").replace("@c.us", "");
      const lidClean = id.replace("@lid", "");
      if (phone && !phone.includes("@")) {
        mappings.push({ user_id: userId, lid: lidClean, phone, contact_name: pushName, session_name: instanceName });
        console.log(`[evolution-webhook] LID mapping (owner): ${lidClean} → ${phone} (${pushName})`);
      }
    }
  }

  if (mappings.length > 0) {
    const { error } = await supabase
      .from("lid_phone_mappings")
      .upsert(mappings, { onConflict: "user_id,lid" });

    if (error) {
      console.error(`[evolution-webhook] Error upserting lid_phone_mappings:`, error.message);
    } else {
      console.log(`[evolution-webhook] Upserted ${mappings.length} LID→phone mappings`);
    }
  }
}
  }
}
