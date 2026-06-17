import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Phone, Mail, Tag, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ContactInfo {
  nome: string;
  email: string | null;
  telefone: string | null;
  grupo: string | null;
  etiquetas: string[] | null;
}

export default function ChatContactDetails({
  chat,
  onClose,
}: {
  chat: ChatItemData;
  onClose: () => void;
}) {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      const phone = chat.phone?.replace(/\D/g, "");
      if (!phone) return;

      // Build variants for BR numbers (with/without 9th digit)
      const last8 = phone.slice(-8);
      const conditions = [`telefone.ilike.%${last8}%`];
      
      // If BR mobile with 9: also try without
      const base = phone.startsWith("55") && phone.length >= 12 ? phone.slice(2) : phone;
      if (base.length === 11 && base[2] === "9") {
        const without9 = base.slice(0, 2) + base.slice(3);
        conditions.push(`telefone.ilike.%${without9.slice(-8)}%`);
      } else if (base.length === 10) {
        const with9 = base.slice(0, 2) + "9" + base.slice(2);
        conditions.push(`telefone.ilike.%${with9.slice(-8)}%`);
      }

      const { data } = await supabase
        .from("contatos" as any)
        .select("nome, email, telefone, grupo, etiquetas")
        .or(conditions.join(","))
        .limit(1)
        .maybeSingle();

      if (data) setContact(data as any);
    };
    fetchContact();
  }, [chat.phone]);

  const initials = (chat.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  return (
    <div className="w-[320px] shrink-0 bg-white border-l border-neutral-200 flex flex-col h-full">
      {/* Header */}
      <div className="h-[60px] shrink-0 flex items-center justify-between px-4 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900">Detalhes do contato</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Avatar and name */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center mb-3">
              {chat.profilePictureUrl ? (
                <img src={chat.profilePictureUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-neutral-500">{initials}</span>
              )}
            </div>
            <h4 className="text-base font-semibold text-neutral-900">{chat.name}</h4>
            <p className="text-sm text-neutral-500">{chat.phone}</p>
            {chat.labelName && (
              <span
                className="inline-flex items-center mt-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                style={{ backgroundColor: chat.labelColor || "#6B7280" }}
              >
                {chat.labelName}
              </span>
            )}
          </div>

          <Separator className="mb-4" />

          {/* Contact info */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Informações</h5>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-neutral-400 shrink-0" />
              <div>
                <p className="text-xs text-neutral-500">Telefone</p>
                <p className="text-sm text-neutral-900">{contact?.telefone || chat.phone}</p>
              </div>
            </div>

            {(contact?.email) && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-neutral-400 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">E-mail</p>
                  <p className="text-sm text-neutral-900">{contact.email}</p>
                </div>
              </div>
            )}

            {contact?.grupo && (
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-neutral-400 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Grupo</p>
                  <p className="text-sm text-neutral-900">{contact.grupo}</p>
                </div>
              </div>
            )}

            {contact?.etiquetas && contact.etiquetas.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Etiquetas</p>
                  <div className="flex flex-wrap gap-1">
                    {contact.etiquetas.map((et, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-700">
                        {et}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Media sections */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Mídia compartilhada</h5>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-left">
                <ImageIcon size={16} className="text-neutral-400" />
                <span className="text-sm text-neutral-700">Fotos</span>
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-left">
                <Video size={16} className="text-neutral-400" />
                <span className="text-sm text-neutral-700">Vídeos</span>
              </button>
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-left">
                <FileText size={16} className="text-neutral-400" />
                <span className="text-sm text-neutral-700">Documentos</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
