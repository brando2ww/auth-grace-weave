import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  UserPlus,
  MessageCircle,
  Briefcase,
  Users,
  Star,
  Contact,
  Calendar,
  Cake,
  Megaphone,
  Settings,
  Instagram,
  Bot,
  Plug,
  User,
  CreditCard,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/logo.png";

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.2.16.15.26.36.27.58l.05 1.81c.02.56.6.93 1.11.7l2.02-.8c.17-.07.36-.08.54-.04.89.24 1.84.37 2.86.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.95 7.57l-2.75 4.36a1.5 1.5 0 0 1-2.17.45l-2.19-1.64a.6.6 0 0 0-.72 0l-2.95 2.24c-.39.3-.9-.18-.64-.6l2.75-4.36a1.5 1.5 0 0 1 2.17-.45l2.19 1.64a.6.6 0 0 0 .72 0l2.95-2.24c.39-.3.9.18.64.6z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L.057 23.57a.75.75 0 0 0 .914.914l5.747-1.467A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.373l-.361-.214-3.741.955.972-3.643-.234-.374A9.86 9.86 0 0 1 2.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z" />
  </svg>
);

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  permission?: string;
  feature?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const allNavGroups: NavGroup[] = [
  {
    label: "Início",
    items: [
      { name: "Tutorial", href: "#", icon: BookOpen },
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Leads", href: "/leads", icon: UserPlus, permission: "leads.view", feature: "leads.basic" },
    ],
  },
  {
    label: "Atendimento",
    items: [
      { name: "Chat", href: "/chat", icon: MessageCircle, external: true, permission: "chat.manage" },
      { name: "Departamentos", href: "/departamentos", icon: Briefcase, permission: "departamentos.manage" },
      { name: "Atendentes", href: "/atendentes", icon: Users, permission: "atendentes.manage" },
      { name: "Avaliações", href: "/avaliacoes", icon: Star },
      { name: "Contatos", href: "/contatos", icon: Contact, permission: "contatos.manage" },
      { name: "Agenda", href: "/agenda", icon: Calendar, feature: "agenda" },
      { name: "Aniversários", href: "/aniversarios", icon: Cake },
      { name: "Campanhas", href: "/campanhas", icon: Megaphone, permission: "campanhas.manage" },
      { name: "Configurações", href: "/configuracoes", icon: Settings, permission: "config.manage" },
    ],
  },
  {
    label: "Canais de atendimento",
    items: [
      { name: "Whatsapp QRcode", href: "/whatsapp-qrcode", icon: WhatsAppIcon, permission: "canais.manage" },
      { name: "Instagram", href: "/instagram", icon: Instagram, permission: "canais.manage" },
      { name: "Messenger", href: "/messenger", icon: MessengerIcon, permission: "canais.manage" },
    ],
  },
  {
    label: "Estoque",
    items: [
      { name: "Estoque", href: "/estoque", icon: Package, permission: "estoque.view", feature: "estoque.basic" },
      { name: "Anúncios", href: "/anuncios", icon: ShoppingBag, feature: "marketplace.integration" },
      { name: "Marketplaces", href: "/marketplaces", icon: Store, feature: "marketplace.integration" },
    ],
  },
  {
    label: "Automação",
    items: [
      { name: "Robôs", href: "/robos", icon: Bot, permission: "automacao.manage", feature: "automacao" },
      { name: "Integrações", href: "/integracoes", icon: Plug, permission: "integracoes.manage" },
    ],
  },
  {
    label: "Minha conta",
    items: [
      { name: "Perfil", href: "/perfil", icon: User },
      { name: "Faturamento", href: "/faturamento", icon: CreditCard, permission: "financeiro.view" },
    ],
  },
];

const demoEstoqueGroups: NavGroup[] = [
  {
    label: "Início",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Estoque",
    items: [
      { name: "Estoque", href: "/estoque", icon: Package },
      { name: "Anúncios", href: "/anuncios", icon: ShoppingBag },
      { name: "Marketplaces", href: "/marketplaces", icon: Store },
    ],
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, hasPermission, planAllows, loading } = useAuth();

  const baseGroups = role === "demo_estoque" ? demoEstoqueGroups : allNavGroups;

  // Filter items based on permission + plan
  const navGroups = baseGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.feature && !planAllows(item.feature)) return false;
      return true;
    }),
  })).filter(group => group.items.length > 0);

  return (
    <aside className="h-screen w-60 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-5 py-5">
        <img src={logo} alt="Logo" className="h-[50px] w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-hidden">
        {loading ? (
          <div className="space-y-4 px-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          navGroups.map((group, groupIdx) => (
            <div key={group.label}>
              {groupIdx > 0 && (
                <div className="border-t border-sidebar-border my-3" />
              )}
              <p className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.href !== "#" && location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          if (item.href === "#") return;
                          if (item.external) { window.open(item.href, "_blank"); return; }
                          navigate(item.href);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground"}`} />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
};

export default AppSidebar;
