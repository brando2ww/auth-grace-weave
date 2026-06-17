import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, RotateCcw, Send, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface AgentTestPanelProps {
  agentName: string;
  configIA?: Record<string, any>;
  onClose?: () => void;
}

const AgentTestPanel = ({ agentName, configIA, onClose }: AgentTestPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Olá! Como posso ajudá-lo hoje?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build message history for the API (exclude welcome message)
      const chatHistory = updatedMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const { data, error } = await supabase.functions.invoke("chat-agent-test", {
        body: {
          messages: chatHistory,
          config_ia: configIA || {},
          agent_name: agentName,
        },
      });

      if (error) throw error;

      if (data?.error) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: `⚠️ ${data.error}`,
          sender: "agent",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data?.reply || "Sem resposta.",
          sender: "agent",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `⚠️ Erro ao enviar mensagem. Verifique suas integrações.`,
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        text: "Olá! Como posso ajudá-lo hoje?",
        sender: "agent",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="flex flex-col h-[600px] w-[350px] overflow-hidden border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-cyan-500/10 text-cyan-500 text-xs">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">Perfil teste</p>
            <p className="text-[10px] text-muted-foreground">Online</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-cyan-500 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="flex items-center gap-2 p-3 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground"
          onClick={resetChat}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Enviar mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="h-8 text-sm"
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="h-8 w-8 shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default AgentTestPanel;
