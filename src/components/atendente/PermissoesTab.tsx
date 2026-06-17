import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  MessageSquare,
  Users,
  CreditCard,
  Bot,
  Megaphone,
  Radio,
  Settings,
  Contact,
  Building2,
  Plug,
  Package,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SubPermissao {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  permission: string;
}

const subPermissoesPainel: SubPermissao[] = [
  { icon: Users, titulo: "Gerenciar atendentes", descricao: "Criar, editar e apagar atendentes da plataforma.", permission: "atendentes.manage" },
  { icon: CreditCard, titulo: "Gerenciar faturamento", descricao: "Gerenciar o faturamento da conta.", permission: "financeiro.view" },
  { icon: Bot, titulo: "Gerenciar robôs", descricao: "Criar, editar e apagar robôs da plataforma.", permission: "automacao.manage" },
  { icon: Megaphone, titulo: "Gerenciar campanhas", descricao: "Criar, editar e apagar campanhas.", permission: "campanhas.manage" },
  { icon: Radio, titulo: "Gerenciar canais", descricao: "Criar, editar e apagar canais de atendimento.", permission: "canais.manage" },
  { icon: MessageSquare, titulo: "Gerenciador do chat", descricao: "Acessar e gerenciar o chat da plataforma.", permission: "chat.manage" },
  { icon: Settings, titulo: "Configurações gerais", descricao: "Acessar e editar as configurações gerais.", permission: "config.manage" },
  { icon: Contact, titulo: "Gerenciar contatos", descricao: "Criar, editar e apagar contatos.", permission: "contatos.manage" },
  { icon: Building2, titulo: "Gerenciar departamentos", descricao: "Criar, editar e apagar departamentos.", permission: "departamentos.manage" },
  { icon: Plug, titulo: "Gerenciar integrações", descricao: "Criar, editar e apagar integrações.", permission: "integracoes.manage" },
];

const subPermissoesEstoque: SubPermissao[] = [
  { icon: Package, titulo: "Visualizar estoque", descricao: "Ver veículos cadastrados no estoque.", permission: "estoque.view" },
  { icon: Package, titulo: "Cadastrar veículos", descricao: "Adicionar novos veículos ao estoque.", permission: "estoque.create" },
  { icon: Package, titulo: "Editar veículos", descricao: "Editar informações de veículos existentes.", permission: "estoque.edit" },
  { icon: Package, titulo: "Excluir veículos", descricao: "Remover veículos do estoque.", permission: "estoque.delete" },
];

const subPermissoesLeads: SubPermissao[] = [
  { icon: UserPlus, titulo: "Visualizar leads", descricao: "Ver leads recebidos.", permission: "leads.view" },
  { icon: UserPlus, titulo: "Editar leads", descricao: "Editar informações de leads.", permission: "leads.edit" },
  { icon: UserPlus, titulo: "Distribuir leads", descricao: "Atribuir leads a vendedores.", permission: "leads.assign" },
];

interface PermissoesTabProps {
  attendantUserId?: string;
}

const PermissoesTab = ({ attendantUserId }: PermissoesTabProps) => {
  const [permissaoChat, setPermissaoChat] = useState(false);
  const [verHistorico, setVerHistorico] = useState(false);
  const [acessoPainel, setAcessoPainel] = useState(false);
  const [painelPerms, setPainelPerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Load existing permissions from DB
  useEffect(() => {
    if (!attendantUserId) return;
    const loadPermissions = async () => {
      const { data } = await supabase
        .from("user_permissions" as any)
        .select("permission")
        .eq("user_id", attendantUserId);
      
      if (data) {
        const perms = (data as any[]).map((p: any) => p.permission);
        const permsMap: Record<string, boolean> = {};
        
        // Check chat permissions
        if (perms.includes("chat.manage")) setPermissaoChat(true);
        if (perms.includes("chat.history")) setVerHistorico(true);
        
        // Check panel + estoque + leads permissions
        const allSubs = [...subPermissoesPainel, ...subPermissoesEstoque, ...subPermissoesLeads];
        allSubs.forEach(item => {
          if (perms.includes(item.permission)) permsMap[item.permission] = true;
        });
        
        if (Object.keys(permsMap).length > 0) setAcessoPainel(true);
        setPainelPerms(permsMap);
      }
    };
    loadPermissions();
  }, [attendantUserId]);

  const togglePainelPerm = (permission: string) =>
    setPainelPerms((prev) => ({ ...prev, [permission]: !prev[permission] }));

  // Save permissions to DB when they change
  useEffect(() => {
    if (!attendantUserId || loading) return;
    
    const savePermissions = async () => {
      setLoading(true);
      try {
        // Build list of all active permissions
        const activePerms: string[] = [];
        if (permissaoChat) activePerms.push("chat.manage");
        if (permissaoChat && verHistorico) activePerms.push("chat.history");
        
        if (acessoPainel) {
          Object.entries(painelPerms).forEach(([perm, active]) => {
            if (active) activePerms.push(perm);
          });
        }

        // Delete existing and re-insert (simple approach)
        await supabase
          .from("user_permissions" as any)
          .delete()
          .eq("user_id", attendantUserId);

        if (activePerms.length > 0) {
          await supabase
            .from("user_permissions" as any)
            .insert(activePerms.map(p => ({ user_id: attendantUserId, permission: p })));
        }
      } catch (err) {
        console.error("Error saving permissions:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce save
    const timer = setTimeout(savePermissions, 500);
    return () => clearTimeout(timer);
  }, [attendantUserId, permissaoChat, verHistorico, acessoPainel, painelPerms]);

  const renderPermissionGroup = (title: string, items: SubPermissao[]) => (
    <>
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
      {items.map((item) => (
        <div key={item.permission} className="flex items-center justify-between p-4 pl-14">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{item.titulo}</p>
              <p className="text-sm text-muted-foreground">{item.descricao}</p>
            </div>
          </div>
          <Switch
            checked={!!painelPerms[item.permission]}
            onCheckedChange={() => togglePainelPerm(item.permission)}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Configure as permissões avançadas específicas do atendente.
      </p>
      <div className="divide-y rounded-lg border">
        {/* Chat principal */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Shield className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Permissões avançadas no Chat</p>
              <p className="text-sm text-muted-foreground">
                Permite acesso ao chat da plataforma com as funcionalidades selecionadas abaixo.
              </p>
            </div>
          </div>
          <Switch
            checked={permissaoChat}
            onCheckedChange={setPermissaoChat}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        {/* Sub: Ver histórico */}
        {permissaoChat && (
          <div className="flex items-center justify-between p-4 pl-14">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Ver histórico completo de conversas</p>
                <p className="text-sm text-muted-foreground">
                  Com este recurso habilitado, o atendente poderá visualizar o histórico completo de todas as conversas.
                </p>
              </div>
            </div>
            <Switch
              checked={verHistorico}
              onCheckedChange={setVerHistorico}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        )}

        {/* Painel principal */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Shield className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Acesso ao painel administrativo</p>
              <p className="text-sm text-muted-foreground">
                Permite acesso ao painel administrativo da plataforma com as funcionalidades selecionadas abaixo.
              </p>
            </div>
          </div>
          <Switch
            checked={acessoPainel}
            onCheckedChange={setAcessoPainel}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        {/* Sub-permissões agrupadas */}
        {acessoPainel && (
          <>
            {renderPermissionGroup("Painel", subPermissoesPainel)}
            {renderPermissionGroup("Estoque", subPermissoesEstoque)}
            {renderPermissionGroup("Leads", subPermissoesLeads)}
          </>
        )}
      </div>
    </div>
  );
};

export default PermissoesTab;
