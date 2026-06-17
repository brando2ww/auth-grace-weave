import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import { TwoLevelSidebar, type ChatItem } from "@/components/ui/sidebar-component";
import ChatConversation from "@/components/chat/ChatConversation";
import ChatContactDetails from "@/components/chat/ChatContactDetails";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const initialPhone = searchParams.get("phone") || undefined;
  const initialName = searchParams.get("name") || undefined;
  const initialAvatar = searchParams.get("avatar") || undefined;
  const [userName, setUserName] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const initialContact = useMemo(() => {
    if (!initialPhone) return undefined;
    return { phone: initialPhone, name: initialName, avatar: initialAvatar };
  }, [initialPhone, initialName, initialAvatar]);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.close(); return; }
      setUserName(session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuário");
    };
    loadSession();
  }, []);

  const handleSelectChat = (chat: ChatItem) => {
    setSelectedChat(chat);
    setShowDetails(false);
  };

  return (
    <div className="h-screen flex bg-white">
      <TwoLevelSidebar onSelectChat={handleSelectChat} initialContact={initialContact} />

      {selectedChat ? (
        <>
          <ChatConversation
            chat={selectedChat}
            onToggleDetails={() => setShowDetails(!showDetails)}
            showDetails={showDetails}
          />
          {showDetails && (
            <ChatContactDetails
              chat={selectedChat}
              onClose={() => setShowDetails(false)}
            />
          )}
        </>
      ) : (
        <main className="flex-1 flex items-center justify-center bg-sidebar">
          <div className="text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-full bg-sidebar-accent flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-sidebar-foreground">Selecione uma conversa</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Escolha uma conversa ao lado ou inicie uma nova para começar a atender
            </p>
          </div>
        </main>
      )}
    </div>
  );
};

export default ChatPage;
