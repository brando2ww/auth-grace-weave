import React, { useState } from "react";
import Estoque from "@/pages/Estoque";
import EntradaVeiculo from "@/pages/EntradaVeiculo";
import Marketplaces from "@/pages/Marketplaces";
import wiseautoLogo from "@/assets/wiseauto-logo-new.png";
import waIcon from "@/assets/wa-icon.png";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Search as SearchIcon,
  Dashboard,
  Folder,
  UserMultiple,
  Analytics,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  AddLarge,
  Filter,
  View,
  Group,
  ChartBar,
  Share,
  Security,
  Notification,
  Integration,
  InProgress,
  CheckmarkOutline,
  FolderOpen,
  Archive,
  DocumentAdd,
} from "@carbon/icons-react";

const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ========================= Types ========================= */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
  sectionKey?: string;
}

interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}

interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

/* ====================== Sidebar Content ====================== */

function getSidebarContent(activeSection: string): SidebarContent {
  const map: Record<string, SidebarContent> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "Visão Geral",
          items: [
            { icon: <View size={16} className="text-neutral-50" />, label: "Overview", isActive: true },
            {
              icon: <Dashboard size={16} className="text-neutral-50" />,
              label: "Resumo Executivo",
              hasDropdown: true,
              children: [{ label: "KPIs" }, { label: "Metas" }, { label: "Tendências" }],
            },
            {
              icon: <ChartBar size={16} className="text-neutral-50" />,
              label: "Relatórios",
              hasDropdown: true,
              children: [{ label: "Semanal" }, { label: "Mensal" }, { label: "Trimestral" }],
            },
          ],
        },
        {
          title: "Métricas",
          items: [
            {
              icon: <Analytics size={16} className="text-neutral-50" />,
              label: "Performance",
              hasDropdown: true,
              children: [
                { label: "Conversão: 34%" },
                { label: "Ticket Médio: R$42k" },
                { label: "Prazo Médio: 18d" },
              ],
            },
          ],
        },
      ],
    },

    estoque: {
      title: "Estoque",
      sections: [
        {
          title: "Ações Rápidas",
          items: [
            {
              icon: <AddLarge size={16} className="text-neutral-50" />,
              label: "Entrada de Veículo",
              sectionKey: "entrada-veiculo",
            },
            { icon: <Filter size={16} className="text-neutral-50" />, label: "Filtrar Veículos" },
          ],
        },
        {
          title: "Veículos",
          items: [
            { icon: <FolderOpen size={16} className="text-neutral-50" />, label: "Todos", isActive: true },
            { icon: <CheckmarkOutline size={16} className="text-neutral-50" />, label: "Disponíveis" },
            { icon: <View size={16} className="text-neutral-50" />, label: "Reservados" },
            { icon: <Archive size={16} className="text-neutral-50" />, label: "Vendidos" },
          ],
        },
        {
          title: "Gestão",
          items: [
            {
              icon: <Share size={16} className="text-neutral-50" />,
              label: "Marketplaces",
              sectionKey: "marketplaces",
            },
            { icon: <DocumentAdd size={16} className="text-neutral-50" />, label: "Avaliações" },
          ],
        },
      ],
    },

    leads: {
      title: "Leads",
      sections: [
        {
          title: "Pipeline",
          items: [
            { icon: <AddLarge size={16} className="text-neutral-50" />, label: "Novos Leads" },
            { icon: <InProgress size={16} className="text-neutral-50" />, label: "Em Negociação" },
            { icon: <CheckmarkOutline size={16} className="text-neutral-50" />, label: "Convertidos" },
            { icon: <Archive size={16} className="text-neutral-50" />, label: "Perdidos" },
          ],
        },
      ],
    },

    anuncios: {
      title: "Anúncios",
      sections: [
        {
          title: "Campanhas",
          items: [
            { icon: <View size={16} className="text-neutral-50" />, label: "Anúncios Ativos" },
            { icon: <AddLarge size={16} className="text-neutral-50" />, label: "Criar Anúncio" },
            { icon: <ChartBar size={16} className="text-neutral-50" />, label: "Performance" },
          ],
        },
      ],
    },

    automacao: {
      title: "Automação",
      sections: [
        {
          title: "Fluxos",
          items: [
            { icon: <InProgress size={16} className="text-neutral-50" />, label: "Fluxos Ativos" },
            { icon: <AddLarge size={16} className="text-neutral-50" />, label: "Criar Fluxo" },
            { icon: <Archive size={16} className="text-neutral-50" />, label: "Histórico" },
          ],
        },
      ],
    },

    inteligencia: {
      title: "Inteligência",
      sections: [
        {
          title: "Analytics",
          items: [
            { icon: <Analytics size={16} className="text-neutral-50" />, label: "Métricas" },
            { icon: <ChartBar size={16} className="text-neutral-50" />, label: "Previsões" },
            { icon: <DocumentAdd size={16} className="text-neutral-50" />, label: "Relatórios" },
          ],
        },
      ],
    },

    integracoes: {
      title: "Integrações",
      sections: [
        {
          title: "Marketplaces",
          items: [
            {
              icon: <Share size={16} className="text-neutral-50" />,
              label: "Todos os canais",
              sectionKey: "marketplaces",
            },
            { icon: <View size={16} className="text-neutral-50" />, label: "OLX / ZAP" },
            { icon: <View size={16} className="text-neutral-50" />, label: "iCarros" },
            { icon: <View size={16} className="text-neutral-50" />, label: "WebMotors" },
          ],
        },
        {
          title: "Configurar",
          items: [
            { icon: <Integration size={16} className="text-neutral-50" />, label: "Conectar canal" },
            { icon: <Security size={16} className="text-neutral-50" />, label: "API Keys" },
          ],
        },
      ],
    },

    financeiro: {
      title: "Financeiro",
      sections: [
        {
          title: "Fluxo",
          items: [
            { icon: <ChartBar size={16} className="text-neutral-50" />, label: "Faturamento" },
            { icon: <DocumentAdd size={16} className="text-neutral-50" />, label: "Despesas" },
            { icon: <Analytics size={16} className="text-neutral-50" />, label: "Fluxo de Caixa" },
          ],
        },
      ],
    },

    equipe: {
      title: "Equipe",
      sections: [
        {
          title: "Pessoas",
          items: [
            { icon: <UserMultiple size={16} className="text-neutral-50" />, label: "Membros" },
            { icon: <ChartBar size={16} className="text-neutral-50" />, label: "Desempenho" },
            { icon: <Security size={16} className="text-neutral-50" />, label: "Permissões" },
          ],
        },
      ],
    },

    configuracoes: {
      title: "Configurações",
      sections: [
        {
          title: "Conta",
          items: [
            { icon: <UserIcon size={16} className="text-neutral-50" />, label: "Perfil" },
            { icon: <Security size={16} className="text-neutral-50" />, label: "Segurança" },
            { icon: <Notification size={16} className="text-neutral-50" />, label: "Notificações" },
          ],
        },
        {
          title: "App",
          items: [
            { icon: <SettingsIcon size={16} className="text-neutral-50" />, label: "Preferências" },
            { icon: <Integration size={16} className="text-neutral-50" />, label: "Integrações" },
          ],
        },
      ],
    },
  };

  return map[activeSection] ?? map.dashboard;
}

/* ========================= AvatarCircle ========================= */

function AvatarCircle() {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-neutral-800">
      <div className="flex items-center justify-center size-8">
        <UserIcon size={16} className="text-neutral-50" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-neutral-700 pointer-events-none"
      />
    </div>
  );
}

/* ========================= SearchContainer ========================= */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`bg-black h-10 relative rounded-lg flex items-center transition-all duration-500 ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCollapsed ? "p-1" : "px-1"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="size-8 flex items-center justify-center">
            <SearchIcon size={16} className="text-neutral-50" />
          </div>
        </div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <input
            type="text"
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-neutral-50 placeholder:text-neutral-400 leading-5 pr-2 py-1"
            tabIndex={isCollapsed ? -1 : 0}
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-lg border border-neutral-800 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ========================= IconNavButton ========================= */

function IconNavButton({
  children,
  isActive = false,
  onClick,
  title,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-500 ${
        isActive
          ? "bg-neutral-800 text-neutral-50"
          : "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ========================= IconNavigation ========================= */

function getActiveIconSection(section: string): string {
  if (section === "entrada-veiculo") return "estoque";
  if (section === "marketplaces") return "integracoes";
  return section;
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const activeIcon = getActiveIconSection(activeSection);

  const navItems = [
    { id: "dashboard", icon: <Dashboard size={16} />, label: "Dashboard" },
    { id: "estoque", icon: <Folder size={16} />, label: "Estoque" },
    { id: "leads", icon: <UserMultiple size={16} />, label: "Leads" },
    { id: "anuncios", icon: <View size={16} />, label: "Anúncios" },
    { id: "automacao", icon: <InProgress size={16} />, label: "Automação" },
    { id: "inteligencia", icon: <Analytics size={16} />, label: "Inteligência" },
    { id: "integracoes", icon: <Integration size={16} />, label: "Integrações" },
    { id: "financeiro", icon: <ChartBar size={16} />, label: "Financeiro" },
    { id: "equipe", icon: <Group size={16} />, label: "Equipe" },
  ];

  return (
    <aside className="bg-black flex flex-col gap-2 items-center p-3 w-16 min-w-16 h-full border-r border-neutral-800 rounded-l-2xl">
      {/* Logo WA */}
      <div className="mb-2 size-10 flex items-center justify-center">
        <img src={waIcon} alt="WA" className="h-7 w-7 object-contain" />
      </div>

      {/* Nav icons */}
      <div className="flex flex-col gap-1 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeIcon === item.id}
            onClick={() => onSectionChange(item.id)}
            title={item.label}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="flex-1" />

      {/* Configurações + Avatar */}
      <div className="flex flex-col gap-2 w-full items-center">
        <IconNavButton
          isActive={activeIcon === "configuracoes"}
          onClick={() => onSectionChange("configuracoes")}
          title="Configurações"
        >
          <SettingsIcon size={16} />
        </IconNavButton>
        <AvatarCircle />
      </div>
    </aside>
  );
}

/* ========================= SectionTitle ========================= */

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div className="w-full flex justify-center transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-lg size-10 min-w-10 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300 transition-colors duration-500"
          style={{ transitionTimingFunction: softSpringEasing }}
          aria-label="Expandir sidebar"
        >
          <span className="inline-block rotate-180">
            <ChevronDownIcon size={16} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center h-10 px-2">
          <span className="font-semibold text-lg text-neutral-50 leading-tight">{title}</span>
        </div>
        <div className="pr-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded-lg size-10 min-w-10 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300 transition-colors duration-500"
            style={{ transitionTimingFunction: softSpringEasing }}
            aria-label="Colapsar sidebar"
          >
            <ChevronDownIcon size={16} className="-rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= MenuItem ========================= */

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else onItemClick?.();
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`rounded-lg cursor-pointer transition-all duration-500 flex items-center relative ${
          item.isActive ? "bg-neutral-800" : "hover:bg-neutral-800"
        } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center" : "w-full h-10 px-3 py-2"}`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center shrink-0">{item.icon}</div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <span className="text-sm text-neutral-50 leading-5 truncate block">{item.label}</span>
        </div>

        {item.hasDropdown && (
          <div
            className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
          >
            <ChevronDownIcon
              size={16}
              className="text-neutral-50 transition-transform duration-500"
              style={{
                transitionTimingFunction: softSpringEasing,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================= SubMenuItem ========================= */

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div className="w-full pl-9 pr-1 py-[1px]">
      <div
        className="h-9 w-full rounded-lg cursor-pointer transition-colors hover:bg-neutral-800 flex items-center px-3"
        onClick={onItemClick}
      >
        <span className="text-sm text-neutral-300 leading-[18px] truncate">{item.label}</span>
      </div>
    </div>
  );
}

/* ========================= MenuSection ========================= */

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  onSectionChange,
  isCollapsed,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  onSectionChange: (s: string) => void;
  isCollapsed?: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex items-center h-9 px-3">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
            {section.title}
          </span>
        </div>
      </div>

      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div key={itemKey} className="w-full flex flex-col">
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => {
                if (item.sectionKey) onSectionChange(item.sectionKey);
              }}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="flex flex-col gap-1 mb-1">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() => {
                      if (child.sectionKey) onSectionChange(child.sectionKey);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ========================= DetailSidebar ========================= */

function DetailSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (s: string) => void;
}) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuthContext();
  const content = getSidebarContent(activeSection);

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  return (
    <aside
      className={`bg-black flex flex-col rounded-r-2xl transition-all duration-500 h-full overflow-hidden ${
        isCollapsed
          ? "w-16 min-w-16 gap-3 items-center px-2 py-3"
          : "w-72 gap-3 items-start p-4"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {/* Logo */}
      {isCollapsed ? (
        <div className="w-full flex justify-center shrink-0">
          <img src={waIcon} alt="WA" className="h-7 w-7 object-contain" />
        </div>
      ) : (
        <div className="w-full px-2 shrink-0">
          <img src={wiseautoLogo} alt="WiseAuto" className="h-8 w-auto object-contain" />
        </div>
      )}

      {/* Section title + collapse button */}
      <SectionTitle
        title={content.title}
        onToggleCollapse={() => setIsCollapsed((s) => !s)}
        isCollapsed={isCollapsed}
      />

      {/* Search */}
      <SearchContainer isCollapsed={isCollapsed} />

      {/* Menu sections */}
      <div
        className={`flex flex-col w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 transition-all duration-500 ${
          isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            onSectionChange={onSectionChange}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="w-full shrink-0 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2 px-1 py-1">
            <AvatarCircle />
            <span className="text-sm text-neutral-50 truncate flex-1">
              {profile?.first_name ?? "Usuário"}
            </span>
            <button
              type="button"
              className="ml-auto size-8 rounded-md flex items-center justify-center hover:bg-neutral-800 shrink-0 transition-colors"
              aria-label="Mais opções"
            >
              <svg className="size-4" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="8" r="1" fill="#FAFAFA" />
                <circle cx="8" cy="8" r="1" fill="#FAFAFA" />
                <circle cx="12" cy="8" r="1" fill="#FAFAFA" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ========================= TwoLevelSidebar ========================= */

function TwoLevelSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (s: string) => void;
}) {
  return (
    <div className="flex flex-row h-full shrink-0">
      <IconNavigation activeSection={activeSection} onSectionChange={onSectionChange} />
      <DetailSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
    </div>
  );
}

/* ========================= Frame760 ========================= */

export function Frame760() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const contentSections = ["estoque", "entrada-veiculo", "marketplaces"];

  return (
    <div className="flex h-screen w-full bg-[#111111] overflow-hidden p-2 gap-2">
      <TwoLevelSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-hidden rounded-2xl bg-white">
        {activeSection === "estoque" && <Estoque onNavigate={setActiveSection} />}
        {activeSection === "entrada-veiculo" && (
          <EntradaVeiculo onBack={() => setActiveSection("estoque")} />
        )}
        {activeSection === "marketplaces" && <Marketplaces />}
        {!contentSections.includes(activeSection) && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400">
            <span className="text-2xl font-semibold text-neutral-300">
              {getSidebarContent(activeSection).title}
            </span>
            <span className="text-sm">Em breve</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default Frame760;
