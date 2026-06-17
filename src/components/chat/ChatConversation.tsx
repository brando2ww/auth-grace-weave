import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface ChatItemData {
  id: string;
  name: string;
  phone: string;
  profilePictureUrl: string | null;
  sessionName: string;
  isGroup?: boolean;
  labelName?: string;
  labelColor?: string;
}

interface Message {
  id: string;
  message_id: string;
  chat_jid: string;
  session_name: string;
  content: string | null;
  from_me: boolean;
  timestamp: number;
  message_type: string | null;
  raw_data: any;
}

function formatMessageTime(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(ts: number): string {
  const date = new Date(ts * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function MessageStatusIcon({ status }: { status?: string }) {
  if (!status) return null;
  if (status === "sent") return <Check size={14} className="text-neutral-400" />;
  if (status === "delivered") return <CheckCheck size={14} className="text-neutral-400" />;
  if (status === "read") return <CheckCheck size={14} className="text-sky-400" />;
  return null;
}

function getMessageStatus(msg: Message): string | undefined {
  if (!msg.from_me) return undefined;
  const raw = msg.raw_data as any;
  if (!raw) return "sent";
  const status = raw?.status || raw?.ack;
  if (status === "READ" || status === 3 || status === "read") return "read";
  if (status === "DELIVERY_ACK" || status === 2 || status === "delivered") return "delivered";
  return "sent";
}

export default function ChatConversation({
  chat,
  onToggleDetails,
  showDetails,
}: {
  chat: ChatItemData;
  onToggleDetails: () => void;
  showDetails: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("evolution-chat-messages", {
          body: { sessionName: chat.sessionName, chatJid: chat.id, limit: 200 },
        });
        if (!error && data?.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chat.id, chat.sessionName]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Realtime subscription for new messages
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`messages_${chat.id}_${chat.sessionName}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_jid=eq.${chat.id}`,
        }, (payload) => {
          const row = payload.new as any;
          if (row.session_name === chat.sessionName && row.user_id === user.id) {
            setMessages(prev => {
              if (prev.some(m => m.message_id === row.message_id)) return prev;
              return [...prev, row as Message];
            });
          }
        })
        .subscribe();
    };
    setup();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [chat.id, chat.sessionName]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;

    setSending(true);
    setInputValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const { error } = await supabase.functions.invoke("evolution-send-message", {
        body: {
          sessionName: chat.sessionName,
          chatJid: chat.id,
          message: text,
          messageType: "text",
        },
      });
      if (error) console.error("Error sending message:", error);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const dateStr = formatDateSeparator(msg.timestamp);
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      groupedMessages.push({ date: dateStr, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  const initials = (chat.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const renderMessageContent = (msg: Message) => {
    const type = msg.message_type || "text";
    const raw = msg.raw_data as any;

    if (type === "image" || type === "imageMessage") {
      const caption = raw?.message?.imageMessage?.caption || raw?.caption || "";
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-neutral-400">
            <ImageIcon size={16} />
            <span className="text-xs">Imagem</span>
          </div>
          {caption && <p className="text-[13px] leading-relaxed break-words">{caption}</p>}
        </div>
      );
    }

    if (type === "audio" || type === "audioMessage" || type === "ptt") {
      return (
        <div className="flex items-center gap-2">
          <Mic size={16} className="text-neutral-400" />
          <span className="text-xs text-neutral-400">Mensagem de áudio</span>
        </div>
      );
    }

    if (type === "document" || type === "documentMessage" || type === "documentWithCaptionMessage") {
      const fileName = raw?.message?.documentMessage?.fileName || raw?.fileName || "Documento";
      return (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-neutral-400" />
          <span className="text-xs">{fileName}</span>
        </div>
      );
    }

    return <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{msg.content || ""}</p>;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100">
      {/* Header */}
      <div className="h-[60px] shrink-0 bg-white border-b border-neutral-200 flex items-center px-4 gap-3">
        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-neutral-200 flex items-center justify-center">
          {chat.profilePictureUrl ? (
            <img src={chat.profilePictureUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-neutral-500">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900 truncate">{chat.name}</h3>
          <p className="text-xs text-neutral-500 truncate">{chat.phone}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500">
            <Video size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${showDetails ? "text-neutral-900 bg-neutral-100" : "text-neutral-500"}`}
            onClick={onToggleDetails}
          >
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e5e5' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-neutral-400">Carregando mensagens...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-neutral-400">Nenhuma mensagem ainda</div>
          </div>
        ) : (
          groupedMessages.map((group, gi) => (
            <div key={gi}>
              {/* Date separator */}
              <div className="flex justify-center my-3">
                <span className="bg-white text-neutral-500 text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
                  {group.date}
                </span>
              </div>

              {group.messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`flex mb-1 ${msg.from_me ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm ${
                      msg.from_me
                        ? "bg-emerald-100 text-neutral-900"
                        : "bg-white text-neutral-900"
                    }`}
                  >
                    {renderMessageContent(msg)}
                    <div className={`flex items-center gap-1 mt-0.5 ${msg.from_me ? "justify-end" : ""}`}>
                      <span className="text-[10px] text-neutral-400">{formatMessageTime(msg.timestamp)}</span>
                      {msg.from_me && <MessageStatusIcon status={getMessageStatus(msg)} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-white border-t border-neutral-200 px-4 py-2">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-neutral-500">
            <Smile size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-neutral-500">
            <Paperclip size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma mensagem..."
              rows={1}
              className="w-full resize-none bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300 max-h-[120px]"
              style={{ height: "auto" }}
            />
          </div>
          {inputValue.trim() ? (
            <Button
              onClick={handleSend}
              disabled={sending}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Send size={18} />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-neutral-500">
              <Mic size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
