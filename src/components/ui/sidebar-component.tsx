"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { List as VirtualList } from "react-window";
import ReactDOM from "react-dom";
import izotopeLogo from "@/assets/IZOTOPE.png";
import EtiquetasPanel from "@/components/chat/EtiquetasPanel";
import ContatosPanel from "@/components/chat/ContatosPanel";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
} from "@carbon/icons-react";
import {
  MessageCircle,
  Tag,
  RefreshCw,
  Contact,
  Users,
  Zap,
  Clock,
  User,
  SlidersHorizontal,
  SquarePen,
  Pin,
  ChevronDown,
  BookOpen,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const svgPaths = {
  p15853b70:
    "M0.528 0C0.343183 0 0.250774 0 0.180183 0.0359679C0.11809 0.0676061 0.0676061 0.11809 0.0359679 0.180183C0 0.250774 0 0.343183 0 0.528V9.097C0 9.28181 0 9.37422 0.0359678 9.44481C0.0676061 9.50691 0.11809 9.55739 0.180183 9.58903C0.250774 9.625 0.343183 9.625 0.528 9.625L4.972 9.625C5.15682 9.625 5.24923 9.625 5.31982 9.58903C5.38191 9.55739 5.43239 9.50691 5.46403 9.44481C5.5 9.37422 5.5 9.28182 5.5 9.097V6.028C5.5 5.84318 5.5 5.75077 5.53597 5.68018C5.56761 5.61809 5.61809 5.56761 5.68018 5.53597C5.75077 5.5 5.84318 5.5 6.028 5.5L26.972 5.5C27.1568 5.5 27.2492 5.5 27.3198 5.53597C27.3819 5.56761 27.4324 5.61809 27.464 5.68018C27.5 5.75077 27.5 5.84318 27.5 6.028V9.097C27.5 9.28182 27.5 9.37423 27.536 9.44482C27.5676 9.50691 27.6181 9.55739 27.6802 9.58903C27.7508 9.625 27.8432 9.625 28.028 9.625L32.472 9.625C32.6568 9.625 32.7492 9.625 32.8198 9.58903C32.8819 9.55739 32.9324 9.50691 32.964 9.44482C33 9.37423 33 9.28182 33 9.097V0.528C33 0.343183 33 0.250774 32.964 0.180183C32.9324 0.11809 32.8819 0.0676061 32.8198 0.0359679C32.7492 0 32.6568 0 32.472 0H0.528Z",
  p35081d00:
    "M0.528 22C0.343183 22 0.250774 22 0.180183 21.964C0.11809 21.9324 0.0676061 21.8819 0.0359679 21.8198C0 21.7492 0 21.6568 0 21.472V12.903C0 12.7182 0 12.6258 0.0359679 12.5552C0.0676061 12.4931 0.11809 12.4426 0.180183 12.411C0.250774 12.375 0.343183 12.375 0.528 12.375H4.972C5.15682 12.375 5.24923 12.375 5.31982 12.411C5.38191 12.4426 5.43239 12.4931 5.46403 12.5552C5.5 12.6258 5.5 12.7182 5.5 12.903V15.972C5.5 16.1568 5.5 16.2492 5.53597 16.3198C5.56761 16.3819 5.61809 16.4324 5.68018 16.464C5.75077 16.5 5.84318 16.5 6.028 16.5L26.972 16.5C27.1568 16.5 27.2492 16.5 27.3198 16.464C27.3819 16.4324 27.4324 16.3819 27.464 16.3198C27.5 16.2492 27.5 16.1568 27.5 15.972V12.903C27.5 12.7182 27.5 12.6258 27.536 12.5552C27.5676 12.4931 27.6181 12.4426 27.6802 12.411C27.7508 12.375 27.8432 12.375 28.028 12.375H32.472C32.6568 12.375 32.7492 12.375 32.8198 12.411C32.8819 12.4426 32.9324 12.4931 32.964 12.5552C33 12.6258 33 12.7182 33 12.903V21.472C33 21.6568 33 21.7492 32.964 21.8198C32.9324 21.8819 32.8819 21.9324 32.8198 21.964C32.7492 22 32.6568 22 32.472 22H0.528Z",
  p36880f80:
    "M0.32 0C0.20799 0 0.151984 0 0.109202 0.0217987C0.0715695 0.0409734 0.0409734 0.0715695 0.0217987 0.109202C0 0.151984 0 0.20799 0 0.32V6.68C0 6.79201 0 6.84801 0.0217987 6.8908C0.0409734 6.92843 0.0715695 6.95902 0.109202 6.9782C0.151984 7 0.207989 7 0.32 7L3.68 7C3.79201 7 3.84802 7 3.8908 6.9782C3.92843 6.95903 3.95903 6.92843 3.9782 6.8908C4 6.84801 4 6.79201 4 6.68V4.32C4 4.20799 4 4.15198 4.0218 4.1092C4.04097 4.07157 4.07157 4.04097 4.1092 4.0218C4.15198 4 4.20799 4 4.32 4L19.68 4C19.792 4 19.848 4 19.8908 4.0218C19.9284 4.04097 19.959 4.07157 19.9782 4.1092C20 4.15198 20 4.20799 20 4.32V6.68C20 6.79201 20 6.84802 20.0218 6.8908C20.041 6.92843 20.0716 6.95903 20.1092 6.9782C20.152 7 20.208 7 20.32 7L23.68 7C23.792 7 23.848 7 23.8908 6.9782C23.9284 6.95903 23.959 6.92843 23.9782 6.8908C24 6.84802 24 6.79201 24 6.68V0.32C24 0.20799 24 0.151984 23.9782 0.109202C23.959 0.0715695 23.9284 0.0409734 23.8908 0.0217987C23.848 0 23.792 0 23.68 0H0.32Z",
  p355df480:
    "M0.32 16C0.20799 16 0.151984 16 0.109202 15.9782C0.0715695 15.959 0.0409734 15.9284 0.0217987 15.8908C0 15.848 0 15.792 0 15.68V9.32C0 9.20799 0 9.15198 0.0217987 9.1092C0.0409734 9.07157 0.0715695 9.04097 0.109202 9.0218C0.151984 9 0.207989 9 0.32 9H3.68C3.79201 9 3.84802 9 3.8908 9.0218C3.92843 9.04097 3.95903 9.07157 3.9782 9.1092C4 9.15198 4 9.20799 4 9.32V11.68C4 11.792 4 11.848 4.0218 11.8908C4.04097 11.9284 4.07157 11.959 4.1092 11.9782C4.15198 12 4.20799 12 4.32 12L19.68 12C19.792 12 19.848 12 19.8908 11.9782C19.9284 11.959 19.959 11.9284 19.9782 11.8908C20 11.848 20 11.792 20 11.68V9.32C20 9.20799 20 9.15199 20.0218 9.1092C20.041 9.07157 20.0716 9.04098 20.1092 9.0218C20.152 9 20.208 9 20.32 9H23.68C23.792 9 23.848 9 23.8908 9.0218C23.9284 9.04098 23.959 9.07157 23.9782 9.1092C24 9.15199 24 9.20799 24 9.32V15.68C24 15.792 24 15.848 23.9782 15.8908C23.959 15.9284 23.9284 15.959 23.8908 15.9782C23.848 16 23.792 16 23.68 16H0.32Z",
};

const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function InterfacesLogoSquare() {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <img src={izotopeLogo} alt="IZOTOPE" className="w-6 h-6 object-contain" />
    </div>
  );
}

function BrandBadge() {
  return (
    <div className="flex items-center px-2 py-1.5">
      <img src={logo} alt="Logo" className="h-[42px] w-auto" />
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarCircle() {
  return (
    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
        <UserIcon size={16} className="text-neutral-500" />
      </div>
    </div>
  );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="px-3 py-2">
      <div
        className="flex items-center gap-2 h-9 rounded-lg bg-neutral-50 border border-neutral-200 px-2.5"
        style={{ transition: `all 0.35s ${softSpringEasing}` }}
      >
        <div className="flex items-center justify-center shrink-0">
          <SearchIcon size={16} className="text-neutral-500" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[14px] text-neutral-900 placeholder:text-neutral-400 leading-[20px]"
              tabIndex={isCollapsed ? -1 : 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
}
interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}
interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

function getSidebarContent(activeSection: string): SidebarContent {
  const contentMap: Record<string, SidebarContent> = {
    chats: {
      title: "Chats",
      sections: [
        {
          title: "",
          items: [
            { icon: <MessageCircle size={20} />, label: "Todas" },
            { icon: <User size={20} />, label: "Minhas" },
            { icon: <Clock size={20} />, label: "Pendentes" },
            { icon: <Users size={20} />, label: "Grupos" },
          ],
        },
      ],
    },
    etiquetas: {
      title: "Etiquetas",
      sections: [
        {
          title: "Gerenciar Etiquetas",
          items: [
            { icon: <Tag size={20} />, label: "Todas as etiquetas" },
            { icon: <Tag size={20} />, label: "Criar etiqueta" },
          ],
        },
      ],
    },
    contatos: {
      title: "Contatos",
      sections: [
        {
          title: "Gerenciar Contatos",
          items: [
            { icon: <Contact size={20} />, label: "Todos os contatos" },
            { icon: <Contact size={20} />, label: "Grupos" },
          ],
        },
      ],
    },
    equipe: {
      title: "Equipe",
      sections: [
        {
          title: "Membros da Equipe",
          items: [
            { icon: <Users size={20} />, label: "Atendentes online" },
            { icon: <Users size={20} />, label: "Todos os atendentes" },
          ],
        },
      ],
    },
    "mensagens-rapidas": {
      title: "Mensagens Rápidas",
      sections: [
        {
          title: "Atalhos",
          items: [
            { icon: <Zap size={20} />, label: "Todas as mensagens" },
            { icon: <Zap size={20} />, label: "Criar mensagem rápida" },
          ],
        },
      ],
    },
    settings: {
      title: "Configurações",
      sections: [
        {
          title: "Conta",
          items: [
            { icon: <UserIcon size={20} />, label: "Perfil" },
            { icon: <SettingsIcon size={20} />, label: "Preferências" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.chats;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
        isActive
          ? "bg-neutral-100 text-neutral-900 shadow-sm"
          : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const navItems = [
    { id: "chats", icon: <MessageCircle size={20} />, label: "Chats" },
    { id: "etiquetas", icon: <Tag size={20} />, label: "Etiquetas" },
    { id: "contatos", icon: <Contact size={20} />, label: "Contatos" },
    { id: "equipe", icon: <Users size={20} />, label: "Equipe" },
    { id: "mensagens-rapidas", icon: <Zap size={20} />, label: "Mensagens Rápidas" },
  ];

  return (
    <div className="w-[60px] shrink-0 bg-white flex flex-col items-center py-3 border-r border-neutral-200">
      {/* Logo */}
      <div className="mb-4 p-1">
        <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
          <InterfacesLogoSquare />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="w-8 h-px bg-neutral-200 my-2" />

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-1">
        <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")}>
          <SettingsIcon size={20} />
        </IconNavButton>
        <div className="mt-1">
          <AvatarCircle />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
  hideCollapse = false,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
  hideCollapse?: boolean;
}) {
  if (isCollapsed && !hideCollapse) {
    return (
      <div className="py-3 flex justify-center">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-50 text-neutral-400 transition-colors"
        >
          <ChevronDownIcon size={16} className="-rotate-90" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BrandBadge />
      </div>
      {!hideCollapse && (
        <div className="flex items-center">
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-50 text-neutral-400 transition-colors"
          >
            <ChevronDownIcon size={16} className="rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}

function DetailSidebar({ activeSection, onActiveItemChange }: { activeSection: string; onActiveItemChange?: (item: string) => void }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const content = getSidebarContent(activeSection);

  // Get default active item (first item of first section)
  const getDefaultItem = (c: SidebarContent) => c.sections[0]?.items[0]?.label || "";
  const [activeItem, setActiveItem] = useState(() => getDefaultItem(content));

  const handleActiveItemChange = (label: string) => {
    setActiveItem(label);
    onActiveItemChange?.(label);
  };

  // Reset activeItem when section changes
  React.useEffect(() => {
    const newContent = getSidebarContent(activeSection);
    const defaultItem = getDefaultItem(newContent);
    setActiveItem(defaultItem);
    onActiveItemChange?.(defaultItem);
    if (activeSection === "etiquetas") setIsCollapsed(false);
  }, [activeSection]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  const toggleCollapse = () => setIsCollapsed((s) => !s);

  return (
    <div
      className="bg-white flex flex-col h-full border-r border-neutral-200 overflow-hidden"
      style={{
        width: isCollapsed ? 60 : 280,
        transition: `width 0.4s ${softSpringEasing}`,
      }}
    >
      <div style={{
        opacity: isCollapsed ? 0 : 1,
        maxHeight: isCollapsed ? 0 : 200,
        overflow: 'hidden',
        transition: `opacity 0.3s ${softSpringEasing}, max-height 0.3s ${softSpringEasing}`,
        pointerEvents: isCollapsed ? 'none' as const : 'auto' as const,
      }}>
        <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={false} hideCollapse={activeSection === "etiquetas"} />
        
        {activeSection !== "etiquetas" && activeSection !== "contatos" && (
          <div className="flex items-center justify-between mt-4 mb-2 px-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {content.title}
            </h2>
            {activeSection === "chats" && (
              <button onClick={handleRefresh} className="p-1 hover:bg-accent rounded-md transition-colors">
                <RefreshCw size={14} className={`text-muted-foreground transition-transform ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-hidden py-1 ${isCollapsed ? "flex flex-col items-center justify-center gap-1" : ""}`}>
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-neutral-50 text-neutral-400 transition-colors"
          >
            <ChevronDownIcon size={20} className="-rotate-90" />
          </button>
        )}
        {activeSection === "etiquetas" && !isCollapsed ? (
          <EtiquetasPanel />
        ) : activeSection === "contatos" && !isCollapsed ? (
          <ContatosPanel />
        ) : (
          content.sections.map((section, index) => (
            <MenuSection
              key={`${activeSection}-${index}`}
              section={section}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              onActiveItemChange={handleActiveItemChange}
            />
          ))
        )}
      </div>

      <div style={{
        opacity: isCollapsed ? 0 : 1,
        maxHeight: isCollapsed ? 0 : 100,
        overflow: 'hidden',
        transition: `opacity 0.3s ${softSpringEasing}, max-height 0.3s ${softSpringEasing}`,
        pointerEvents: isCollapsed ? 'none' as const : 'auto' as const,
      }}>
        <div className="px-3 py-3 border-t border-neutral-200">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
            <AvatarCircle />
            <span className="text-[13px] text-neutral-600 truncate flex-1">Text content</span>
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-neutral-500" />
              <div className="w-1 h-1 rounded-full bg-neutral-500" />
              <div className="w-1 h-1 rounded-full bg-neutral-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Menu Elements ---------------------------- */

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
      onClick={handleClick}
      className={`flex items-center rounded-lg cursor-pointer transition-all duration-150 ${
        isCollapsed
          ? "justify-center w-10 h-10 mx-auto"
          : "gap-2 px-3 py-1.5 mx-2"
      } ${
        item.isActive
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-neutral-500">
        {item.icon}
      </div>

      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <span className="text-[13px] leading-5 truncate block">{item.label}</span>
        </div>
      )}

      {item.hasDropdown && !isCollapsed && (
        <div className="shrink-0 text-neutral-500">
          <ChevronDownIcon
            size={14}
            className={`transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
          />
        </div>
      )}
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div
      onClick={onItemClick}
      className="flex items-center gap-2 px-3 py-1 mx-2 ml-7 rounded-md cursor-pointer text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-all duration-150"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[12px] leading-5 truncate block">{item.label}</span>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
  activeItem,
  onActiveItemChange,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
  activeItem?: string;
  onActiveItemChange?: (label: string) => void;
}) {
  return (
    <div className="mb-2">
      {!isCollapsed && section.title && (
        <div className="px-5 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            {section.title}
          </span>
        </div>
      )}

      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        const isActive = item.label === activeItem;
        return (
          <div key={itemKey}>
            <MenuItem
              item={{ ...item, isActive }}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => onActiveItemChange?.(item.label)}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="mt-0.5 mb-1">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={childIndex}
                    item={child}
                    onItemClick={() => onActiveItemChange?.(child.label)}
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

/* ----------------------------- Conversation List ------------------------- */

export interface ChatItem {
  id: string;
  name: string;
  phone: string;
  profilePictureUrl: string | null;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
  pinned?: boolean;
  sessionName: string;
  labelName: string;
  labelColor: string;
  isGroup?: boolean;
  lastMessageSender?: string;
  lastMessageFromMe?: boolean;
  lastMessageStatus?: string | null;
}

function formatChatTimestamp(ts: number): string {
  if (!ts) return "";
  const date = new Date(ts * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Ontem";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function MessageStatusIcon({ status }: { status?: string | null }) {
  if (!status) return null;

  const singleCheck = (
    <svg width="14" height="14" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.071 4.929L6.414 9.586L4.929 8.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const doubleCheck = (
    <svg width="18" height="14" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 8.5L7.5 11.5L14.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 8.5L11.5 11.5L18.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (status === "sent") {
    return <span className="text-muted-foreground mr-0.5 inline-flex items-center">{singleCheck}</span>;
  }
  if (status === "delivered") {
    return <span className="text-muted-foreground mr-0.5 inline-flex items-center">{doubleCheck}</span>;
  }
  if (status === "read") {
    return <span className="text-[hsl(210,100%,52%)] mr-0.5 inline-flex items-center">{doubleCheck}</span>;
  }
  return null;
}

function ChatItemRow({ chat, onTogglePin, isSelected, onSelect }: { chat: ChatItem; onTogglePin: (chat: ChatItem) => void; isSelected?: boolean; onSelect?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const initials = (chat.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const hasUnread = !chat.lastMessageFromMe && chat.unreadCount > 0;

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [dropdownOpen]);

  // Build preview prefix
  let previewPrefix: React.ReactNode = null;
  if (chat.lastMessageFromMe) {
    previewPrefix = (
      <>
        <MessageStatusIcon status={chat.lastMessageStatus} />
        <span className={`${hasUnread ? "font-semibold" : ""}`}>Você: </span>
      </>
    );
  } else if (chat.isGroup && chat.lastMessageSender) {
    previewPrefix = <span className="font-medium text-neutral-700">{chat.lastMessageSender}: </span>;
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-stretch cursor-pointer transition-colors rounded-md mx-1 overflow-hidden ${isSelected ? "bg-neutral-100" : "bg-white hover:bg-neutral-50"}`}
    >
      <div className="flex-1 flex items-center gap-3 px-3 py-2.5">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-neutral-200 flex items-center justify-center">
          {chat.profilePictureUrl ? (
            <img src={chat.profilePictureUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-neutral-500">{initials}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[13px] truncate ${hasUnread ? "font-semibold text-neutral-900" : "font-medium text-neutral-900"}`}>{chat.name && chat.name.length > 25 ? chat.name.slice(0, 25) + '...' : chat.name}</span>
            <div className="shrink-0 flex flex-col items-end gap-0.5">
              <div className="relative flex items-center">
                <span className={`text-[11px] whitespace-nowrap transition-transform duration-200 group-hover:-translate-x-4 ${hasUnread ? 'text-cyan-500 font-semibold' : 'text-neutral-400 font-normal'}`}>
                  {formatChatTimestamp(chat.timestamp)}
                </span>
                <button
                  ref={triggerRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!dropdownOpen && triggerRef.current) {
                      const rect = triggerRef.current.getBoundingClientRect();
                      setDropdownPos({ top: rect.bottom + 4, left: rect.right - 160 });
                    }
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="absolute right-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 w-4 h-4 flex items-center justify-center"
                >
                  <ChevronDown size={12} className="text-neutral-400" />
                </button>
                <div className="relative">
                  {dropdownOpen && ReactDOM.createPortal(
                    <div
                      ref={dropdownRef}
                      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                      className="w-40 bg-neutral-700 border border-neutral-600 rounded-md shadow-lg py-1 animate-scale-in"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePin(chat); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-white hover:bg-neutral-600 transition-colors"
                      >
                        <Pin size={12} />
                        {chat.pinned ? "Desafixar" : "Fixar"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-white hover:bg-neutral-600 transition-colors"
                      >
                        <BookOpen size={12} />
                        Marcar como lido
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-white hover:bg-neutral-600 transition-colors"
                      >
                        <Archive size={12} />
                        Arquivar
                      </button>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              {chat.pinned && <Pin size={11} className="text-neutral-400" />}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className={`text-[12px] truncate ${hasUnread ? "text-neutral-800 font-semibold" : "text-neutral-500"}`}>
              {previewPrefix}
              {chat.lastMessage ? (chat.lastMessage.length > 35 ? chat.lastMessage.substring(0, 35) + "..." : chat.lastMessage) : "..."}
            </p>
            {hasUnread && (
              <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}
          </div>
          <div className="mt-1">
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: chat.labelColor }}
            >
              {chat.labelName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationList({ activeFilter = "Todas", onSelectChat, initialContact }: { activeFilter?: string; onSelectChat?: (chat: ChatItem) => void; initialContact?: { phone: string; name?: string; avatar?: string } }) {
  const [searchValue, setSearchValue] = useState("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [initialPhoneHandled, setInitialPhoneHandled] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("evolution-chats");
      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }
      setChats(data?.chats || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Helper: generate BR phone variants (with/without 9th digit)
  const getPhoneVariants = (phone: string): string[] => {
    const d = phone.replace(/\D/g, "");
    const variants = new Set<string>();
    variants.add(d);
    // Strip country code 55
    const withoutCC = d.startsWith("55") && d.length >= 12 ? d.slice(2) : null;
    if (withoutCC) variants.add(withoutCC);
    const base = withoutCC || d;
    // BR mobile: DDD(2) + 9 + number(8) = 11 digits without CC
    if (base.length === 11 && base[2] === "9") {
      // variant without the 9
      variants.add(base.slice(0, 2) + base.slice(3));
      variants.add("55" + base.slice(0, 2) + base.slice(3));
      variants.add("55" + base);
    } else if (base.length === 10) {
      // variant with the 9
      variants.add(base.slice(0, 2) + "9" + base.slice(2));
      variants.add("55" + base.slice(0, 2) + "9" + base.slice(2));
      variants.add("55" + base);
    }
    // last 8 digits for loose match
    if (d.length >= 8) variants.add(d.slice(-8));
    return Array.from(variants);
  };

  // Auto-select chat when initialContact is provided
  useEffect(() => {
    if (!initialContact || initialPhoneHandled || loading) return;
    const variants = getPhoneVariants(initialContact.phone);

    // Try to find existing chat using variants
    const match = chats.find(c => {
      const chatDigits = (c.phone || c.id).replace(/\D/g, "");
      return variants.some(v => chatDigits === v || chatDigits.endsWith(v) || v.endsWith(chatDigits));
    });

    if (match) {
      setSelectedChatId(match.id);
      onSelectChat?.(match);
      setInitialPhoneHandled(true);
      return;
    }

    // No match — create synthetic chat with enriched data
    const createSyntheticChat = async () => {
      const { data: sessions } = await supabase
        .from("whatsapp_sessions" as any)
        .select("connection_name")
        .eq("status", "connected")
        .limit(1);

      const sessionName = (sessions as any)?.[0]?.connection_name;
      if (!sessionName) {
        setInitialPhoneHandled(true);
        return;
      }

      // Use data directly from initialContact (already passed via query params)
      const canonicalPhone = initialContact.phone.replace(/\D/g, "");
      const contactName = initialContact.name || initialContact.phone;
      const contactAvatar = initialContact.avatar || null;

      const jid = `${canonicalPhone}@s.whatsapp.net`;
      const syntheticChat: ChatItem = {
        id: jid,
        name: contactName,
        phone: canonicalPhone,
        profilePictureUrl: contactAvatar,
        lastMessage: "",
        timestamp: Math.floor(Date.now() / 1000),
        unreadCount: 0,
        pinned: false,
        sessionName,
        isGroup: false,
        labelName: undefined,
        labelColor: undefined,
      };
      setSelectedChatId(jid);
      onSelectChat?.(syntheticChat);
      setInitialPhoneHandled(true);
    };
    createSyntheticChat();
  }, [initialContact, initialPhoneHandled, loading, chats]);

  // Realtime subscription for live updates
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel("chat_last_messages_realtime")
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "chat_last_messages",
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const row = payload.new as any;
          if (!row || !row.chat_jid) return;
          const phone = row.chat_jid.replace(/@.+/, "");
          const mapped: ChatItem = {
            id: row.chat_jid,
            name: row.contact_name || phone,
            phone,
            profilePictureUrl: row.profile_picture_url,
            lastMessage: row.last_message || "",
            timestamp: row.last_message_timestamp,
            unreadCount: row.unread_count || 0,
            sessionName: row.session_name,
            labelName: row.label_name || row.session_name,
            labelColor: row.label_color || "#6B7280",
            isGroup: row.is_group || false,
            lastMessageSender: row.last_message_sender || "",
            lastMessageFromMe: row.last_message_from_me || false,
            lastMessageStatus: row.last_message_status || null,
          };

          setChats(prev => {
            const exists = prev.find(c => c.id === mapped.id && c.sessionName === mapped.sessionName);
            let updated;
            if (exists) {
              updated = prev.map(c =>
                c.id === mapped.id && c.sessionName === mapped.sessionName
                  ? { ...c, ...mapped, pinned: c.pinned }
                  : c
              );
            } else {
              updated = [...prev, { ...mapped, pinned: false }];
            }
            return [...updated].sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return b.timestamp - a.timestamp;
            });
          });
        })
        .subscribe();
    };
    setup();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const sortChats = (list: ChatItem[]) => {
    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });
  };

  const handleTogglePin = useCallback(async (chat: ChatItem) => {
    const wasPinned = chat.pinned;
    // Optimistic update
    setChats(prev =>
      sortChats(prev.map(c =>
        c.id === chat.id && c.sessionName === chat.sessionName
          ? { ...c, pinned: !wasPinned }
          : c
      ))
    );

    try {
      if (wasPinned) {
        await supabase
          .from("chat_pins" as any)
          .delete()
          .eq("chat_jid", chat.id)
          .eq("session_name", chat.sessionName);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("chat_pins" as any)
            .insert({ chat_jid: chat.id, session_name: chat.sessionName, user_id: user.id } as any);
        }
      }
    } catch (err) {
      console.error("Error toggling pin:", err);
      // Revert on error
      setChats(prev =>
        sortChats(prev.map(c =>
          c.id === chat.id && c.sessionName === chat.sessionName
            ? { ...c, pinned: wasPinned }
            : c
        ))
      );
    }
  }, []);


  const typeFiltered = activeFilter === "Grupos"
    ? chats.filter(c => c.isGroup)
    : chats.filter(c => !c.isGroup);

  const filtered = searchValue.trim()
    ? typeFiltered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          c.phone.includes(searchValue) ||
          c.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
      )
    : typeFiltered;

  const ITEM_HEIGHT = 76;

  interface ChatRowProps {
    chats: ChatItem[];
    selectedChatId: string | null;
    onTogglePin: (chat: ChatItem) => void;
    onSelect: (id: string) => void;
  }

  const ChatVirtualRow = ({ index, style, chats: rowChats, selectedChatId: selId, onTogglePin: togglePin, onSelect: selectChat }: { index: number; style: React.CSSProperties; ariaAttributes: any } & ChatRowProps) => {
    const chat = rowChats[index];
    if (!chat) return null;
    const chatKey = `${chat.sessionName}::${chat.id}`;
    return (
      <div style={style}>
        <ChatItemRow
          chat={chat}
          onTogglePin={togglePin}
          isSelected={selId === chatKey}
          onSelect={() => selectChat(chatKey)}
        />
      </div>
    );
  };

  const handleSelectChat = useCallback((id: string) => {
    setSelectedChatId(id);
    // Find the chat and call onSelectChat
    const chat = filtered.find(c => `${c.sessionName}::${c.id}` === id);
    if (chat && onSelectChat) onSelectChat(chat);
  }, [filtered, onSelectChat]);

  return (
    <div className="w-[380px] shrink-0 bg-white flex flex-col h-full border-r border-neutral-200">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 h-9 rounded-lg bg-neutral-50 border border-neutral-200 px-2.5">
            <SearchIcon size={16} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[13px] text-neutral-900 placeholder:text-neutral-400"
            />
          </div>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors">
            <SquarePen size={18} />
          </button>
        </div>
      </div>

      {/* Conversation list */}
      <div ref={listContainerRef} className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-3 h-full">
            <div className="flex flex-col items-center gap-3 px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <MessageCircle size={24} className="text-neutral-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-neutral-700">
                  {searchValue ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {searchValue
                    ? "Tente buscar por outro nome ou número"
                    : "Inicie uma nova conversa ou aguarde um contato chegar pela fila de atendimento"}
                </p>
              </div>
              {!searchValue && (
                <button className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors mt-1">
                  <SquarePen size={14} />
                  Nova conversa
                </button>
              )}
            </div>
          </div>
        ) : (
          <VirtualList
            rowCount={filtered.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={ChatVirtualRow as any}
            rowProps={{ chats: filtered, selectedChatId, onTogglePin: handleTogglePin, onSelect: handleSelectChat } as any}
            style={{ height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Layout -------------------------------- */

export function TwoLevelSidebar({ onSelectChat, initialContact }: { onSelectChat?: (chat: ChatItem) => void; initialContact?: { phone: string; name?: string; avatar?: string } }) {
  const [activeSection, setActiveSection] = useState("chats");
  const [activeFilter, setActiveFilter] = useState("Todas");

  return (
    <div className="flex h-full">
      <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <DetailSidebar activeSection={activeSection} onActiveItemChange={setActiveFilter} />
      {activeSection === "chats" && <ConversationList activeFilter={activeFilter} onSelectChat={onSelectChat} initialContact={initialContact} />}
    </div>
  );
}

/* ------------------------------- Root Frame ------------------------------ */

export function Frame760() {
  return (
    <div className="h-screen flex bg-white">
      <TwoLevelSidebar />
    </div>
  );
}

export default Frame760;
