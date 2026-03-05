import React, { useState } from "react";
import {
  Search as SearchIcon,
  Dashboard as LayoutDashboard,
  Task as CheckSquare,
  Folder as FolderOpen,
  Calendar as CalendarIcon,
  UserMultiple as Users,
  Analytics as BarChart3,
  DocumentAdd as FilePlus,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  AddLarge as Plus,
  Filter,
  Time as Clock,
  InProgress as Loader,
  CheckmarkOutline as CheckCircle,
  Flag,
  Archive,
  View as Eye,
  Report as FileText,
  StarFilled as Star,
  ChartBar as BarChart,
  FolderOpen as FolderClosed,
  Share,
  CloudUpload as Upload,
  Security as Shield,
  Notification as Bell,
  Integration as Plug,
} from "@carbon/icons-react";

/** ======================= Local SVG paths (inline) ======================= */
const svgPaths = {
  p10dcabc0: "M8 11L3 6.00001L3.7 5.30001L8 9.60001L12.3 5.30001L13 6.00001L8 11Z",
  p13593580:
    "M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9Z",
  p154b5b00:
    "M14.5 13.793L10.724 10.0169C11.6313 8.92758 12.0838 7.53039 11.9872 6.11596C11.8907 4.70154 11.2525 3.37879 10.2055 2.42289C9.15856 1.46699 7.78336 0.951523 6.36601 0.983731C4.94866 1.01594 3.59829 1.59334 2.59581 2.59581C1.59334 3.59829 1.01594 4.94866 0.983731 6.36601C0.951523 7.78336 1.46699 9.15856 2.42289 10.2055C3.37879 11.2525 4.70154 11.8907 6.11596 11.9872C7.53039 12.0838 8.92758 11.6313 10.0169 10.724L13.793 14.5L14.5 13.793ZM2 6.5C2 5.60999 2.26392 4.73996 2.75839 3.99994C3.25286 3.25992 3.95566 2.68314 4.77793 2.34255C5.6002 2.00195 6.505 1.91284 7.37791 2.08647C8.25082 2.2601 9.05265 2.68869 9.68198 3.31802C10.3113 3.94736 10.7399 4.74918 10.9135 5.6221C11.0872 6.49501 10.9981 7.39981 10.6575 8.22208C10.3169 9.04435 9.74009 9.74715 9.00007 10.2416C8.26005 10.7361 7.39002 11 6.5 11C5.30694 10.9987 4.16311 10.5242 3.31949 9.68052C2.47586 8.8369 2.00133 7.69307 2 6.5Z",
  p15853b70:
    "M0.528 0C0.343183 0 0.250774 0 0.180183 0.0359679C0.11809 0.0676061 0.0676061 0.11809 0.0359679 0.180183C0 0.250774 0 0.343183 0 0.528V9.097C0 9.28181 0 9.37422 0.0359678 9.44481C0.0676061 9.50691 0.11809 9.55739 0.180183 9.58903C0.250774 9.625 0.343183 9.625 0.528 9.625L4.972 9.625C5.15682 9.625 5.24923 9.625 5.31982 9.58903C5.38191 9.55739 5.43239 9.50691 5.46403 9.44481C5.5 9.37422 5.5 9.28182 5.5 9.097V6.028C5.5 5.84318 5.5 5.75077 5.53597 5.68018C5.56761 5.61809 5.61809 5.56761 5.68018 5.53597C5.75077 5.5 5.84318 5.5 6.028 5.5L26.972 5.5C27.1568 5.5 27.2492 5.5 27.3198 5.53597C27.3819 5.56761 27.4324 5.61809 27.464 5.68018C27.5 5.75077 27.5 5.84318 27.5 6.028V9.097C27.5 9.28182 27.5 9.37423 27.536 9.44482C27.5676 9.50691 27.6181 9.55739 27.6802 9.58903C27.7508 9.625 27.8432 9.625 28.028 9.625L32.472 9.625C32.6568 9.625 32.7492 9.625 32.8198 9.58903C32.8819 9.55739 32.9324 9.50691 32.964 9.44482C33 9.37423 33 9.28182 33 9.097V0.528C33 0.343183 33 0.250774 32.964 0.180183C32.9324 0.11809 32.8819 0.0676061 32.8198 0.0359679C32.7492 0 32.6568 0 32.472 0H0.528Z",
  p1a3cd600:
    "M8.778 13.75C8.59318 13.75 8.50077 13.75 8.43018 13.714C8.36809 13.6824 8.31761 13.6319 8.28597 13.5698C8.25 13.4992 8.25 13.4068 8.25 13.222V8.778C8.25 8.59318 8.25 8.50077 8.28597 8.43018C8.31761 8.36809 8.36809 8.31761 8.43018 8.28597C8.50077 8.25 8.59318 8.25 8.778 8.25L24.222 8.25C24.4068 8.25 24.4992 8.25 24.5698 8.28597C24.6319 8.31761 24.6824 8.36809 24.714 8.43018C24.75 8.50077 24.75 8.59318 24.75 8.778V13.222C24.75 13.4068 24.75 13.4992 24.714 13.5698C24.6824 13.6319 24.6319 13.6824 24.5698 13.714C24.4992 13.75 24.4068 13.75 24.222 13.75H8.778Z",
  p29bde780: "M4 9C4.55228 9 5 8.55228 5 8C5 7.44772 4.55228 7 4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9Z",
  p2b29ce00:
    "M13 15H12V12.5C12 12.1717 11.9353 11.8466 11.8097 11.5433C11.6841 11.24 11.4999 10.9644 11.2678 10.7322C11.0356 10.5001 10.76 10.3159 10.4567 10.1903C10.1534 10.0647 9.8283 10 9.5 10H6.5C5.83696 10 5.20107 10.2634 4.73223 10.7322C4.26339 11.2011 4 11.837 4 12.5V15H3V12.5C3 11.5717 3.36875 10.6815 4.02513 10.0251C4.6815 9.36875 5.57174 9 6.5 9H9.5C10.4283 9 11.3185 9.36875 11.9749 10.0251C12.6313 10.6815 13 11.5717 13 12.5V15Z",
  p35081d00:
    "M0.528 22C0.343183 22 0.250774 22 0.180183 21.964C0.11809 21.9324 0.0676061 21.8819 0.0359679 21.8198C0 21.7492 0 21.6568 0 21.472V12.903C0 12.7182 0 12.6258 0.0359679 12.5552C0.0676061 12.4931 0.11809 12.4426 0.180183 12.411C0.250774 12.375 0.343183 12.375 0.528 12.375H4.972C5.15682 12.375 5.24923 12.375 5.31982 12.411C5.38191 12.4426 5.43239 12.4931 5.46403 12.5552C5.5 12.6258 5.5 12.7182 5.5 12.903V15.972C5.5 16.1568 5.5 16.2492 5.53597 16.3198C5.56761 16.3819 5.61809 16.4324 5.68018 16.464C5.75077 16.5 5.84318 16.5 6.028 16.5L26.972 16.5C27.1568 16.5 27.2492 16.5 27.3198 16.464C27.3819 16.4324 27.4324 16.3819 27.464 16.3198C27.5 16.2492 27.5 16.1568 27.5 15.972V12.903C27.5 12.7182 27.5 12.6258 27.536 12.5552C27.5676 12.4931 27.6181 12.4426 27.6802 12.411C27.7508 12.375 27.8432 12.375 28.028 12.375H32.472C32.6568 12.375 32.7492 12.375 32.8198 12.411C32.8819 12.4426 32.9324 12.4931 32.964 12.5552C33 12.6258 33 12.7182 33 12.903V21.472C33 21.6568 33 21.7492 32.964 21.8198C32.9324 21.8819 32.8819 21.9324 32.8198 21.964C32.7492 22 32.6568 22 32.472 22H0.528Z",
  p355df480:
    "M0.32 16C0.20799 16 0.151984 16 0.109202 15.9782C0.0715695 15.959 0.0409734 15.9284 0.0217987 15.8908C0 15.848 0 15.792 0 15.68V9.32C0 9.20799 0 9.15198 0.0217987 9.1092C0.0409734 9.07157 0.0715695 9.04097 0.109202 9.0218C0.151984 9 0.207989 9 0.32 9H3.68C3.79201 9 3.84802 9 3.8908 9.0218C3.92843 9.04097 3.95903 9.07157 3.9782 9.1092C4 9.15198 4 9.20799 4 9.32V11.68C4 11.792 4 11.848 4.0218 11.8908C4.04097 11.9284 4.07157 11.959 4.1092 11.9782C4.15198 12 4.20799 12 4.32 12L19.68 12C19.792 12 19.848 12 19.8908 11.9782C19.9284 11.959 19.959 11.9284 19.9782 11.8908C20 11.848 20 11.792 20 11.68V9.32C20 9.20799 20 9.15199 20.0218 9.1092C20.041 9.07157 20.0716 9.04098 20.1092 9.0218C20.152 9 20.208 9 20.32 9H23.68C23.792 9 23.848 9 23.8908 9.0218C23.9284 9.04098 23.959 9.07157 23.9782 9.1092C24 9.15199 24 9.20799 24 9.32V15.68C24 15.792 24 15.848 23.9782 15.8908C23.959 15.9284 23.9284 15.959 23.8908 15.9782C23.848 16 23.792 16 23.68 16H0.32Z",
  p36880f80:
    "M0.32 0C0.20799 0 0.151984 0 0.109202 0.0217987C0.0715695 0.0409734 0.0409734 0.0715695 0.0217987 0.109202C0 0.151984 0 0.20799 0 0.32V6.68C0 6.79201 0 6.84801 0.0217987 6.8908C0.0409734 6.92843 0.0715695 6.95902 0.109202 6.9782C0.151984 7 0.207989 7 0.32 7L3.68 7C3.79201 7 3.84802 7 3.8908 6.9782C3.92843 6.95903 3.95903 6.92843 3.9782 6.8908C4 6.84801 4 6.79201 4 6.68V4.32C4 4.20799 4 4.15198 4.0218 4.1092C4.04097 4.07157 4.07157 4.04097 4.1092 4.0218C4.15198 4 4.20799 4 4.32 4L19.68 4C19.792 4 19.848 4 19.8908 4.0218C19.9284 4.04097 19.959 4.07157 19.9782 4.1092C20 4.15198 20 4.20799 20 4.32V6.68C20 6.79201 20 6.84802 20.0218 6.8908C20.041 6.92843 20.0716 6.95903 20.1092 6.9782C20.152 7 20.208 7 20.32 7L23.68 7C23.792 7 23.848 7 23.8908 6.9782C23.9284 6.95903 23.959 6.92843 23.9782 6.8908C24 6.84802 24 6.79201 24 6.68V0.32C24 0.20799 24 0.151984 23.9782 0.109202C23.959 0.0715695 23.9284 0.0409734 23.8908 0.0217987C23.848 0 23.792 0 23.68 0H0.32Z",
  p3801bf80:
    "M8 2C8.49445 2 8.9778 2.14662 9.38893 2.42133C9.80005 2.69603 10.1205 3.08648 10.3097 3.54329C10.4989 4.00011 10.5484 4.50277 10.452 4.98773C10.3555 5.47268 10.1174 5.91814 9.76777 6.26777C9.41814 6.6174 8.97268 6.8555 8.48773 6.95196C8.00277 7.04843 7.50011 6.99892 7.04329 6.8097C6.58648 6.62048 6.19603 6.30005 5.92133 5.88893C5.64662 5.4778 5.5 4.99445 5.5 4.5C5.5 3.83696 5.76339 3.20107 6.23223 2.73223C6.70107 2.26339 7.33696 2 8 2ZM8 1C7.30777 1 6.63108 1.20527 6.0555 1.58986C5.47993 1.97444 5.03133 2.52107 4.76642 3.16061C4.50152 3.80015 4.4322 4.50388 4.56725 5.18282C4.7023 5.86175 5.03564 6.48539 5.52513 6.97487C6.01461 7.46436 6.63825 7.7977 7.31718 7.93275C7.99612 8.0678 8.69985 7.99849 9.33939 7.73358C9.97893 7.46867 10.5256 7.02007 10.9101 6.4445C11.2947 5.86892 11.5 5.19223 11.5 4.5C11.5 3.57174 11.1313 2.6815 10.4749 2.02513C9.8185 1.36875 8.92826 1 8 1Z",
  p3af0dbf2: "M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z",
  p5113400:
    "M14.252 4.06808L8.25195 0.568081C8.17548 0.523469 8.08853 0.499962 8 0.499962C7.91147 0.499962 7.82452 0.523469 7.74805 0.568081L1.74805 4.06808C1.67257 4.11212 1.60994 4.17517 1.56642 4.25095C1.5229 4.32673 1.5 4.41259 1.5 4.49998V11.5C1.5 11.5874 1.5229 11.6732 1.56642 11.749C1.60994 11.8248 1.67257 11.8878 1.74805 11.9319L7.74805 15.4319C7.82452 15.4765 7.91147 15.5 8 15.5C8.08853 15.5 8.17548 15.4765 8.25195 15.4319L14.252 11.9319C14.3274 11.8878 14.3901 11.8248 14.4336 11.749C14.4771 11.6732 14.5 11.5874 14.5 11.5V4.49998C14.5 4.41259 14.4771 4.32673 14.4336 4.25095C14.3901 4.17517 14.3274 4.11212 14.252 4.06808ZM8 1.57883L13.0078 4.49998L8 7.42113L2.9922 4.49998L8 1.57883ZM2.5 5.37058L7.5 8.28708V14.1294L2.5 11.2129V5.37058ZM8.5 14.1294V8.28708L13.5 5.37058V11.2129L8.5 14.1294Z",
  pfa0d600:
    "M6.32 10C6.20799 10 6.15198 10 6.1092 9.9782C6.07157 9.95903 6.04097 9.92843 6.0218 9.8908C6 9.84802 6 9.79201 6 9.68V6.32C6 6.20799 6 6.15198 6.0218 6.1092C6.04097 6.07157 6.07157 6.04097 6.1092 6.0218C6.15198 6 6.20799 6 6.32 6L17.68 6C17.792 6 17.848 6 17.8908 6.0218C17.9284 6.04097 17.959 6.07157 17.9782 6.1092C18 6.15198 18 6.20799 18 6.32V9.68C18 9.79201 18 9.84802 17.9782 9.8908C17.959 9.92843 17.9284 9.95903 17.8908 9.9782C17.848 10 17.792 10 17.68 10H6.32Z",
};

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function InterfacesLogoSquare() {
  return (
    <div
      style={{
        width: 33,
        height: 22,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: 33, height: 22, position: "absolute", left: 0, top: 0 }}>
        <div>
          <svg width="33" height="22" viewBox="0 0 33 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={svgPaths.p15853b70} fill="white" />
            <path d={svgPaths.p35081d00} fill="white" />
            <path d={svgPaths.p1a3cd600} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BrandBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 24,
            height: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={svgPaths.p36880f80} fill="white" />
            <path d={svgPaths.p355df480} fill="white" />
            <path d={svgPaths.pfa0d600} fill="white" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              color: "#fafafa",
              lineHeight: "20px",
            }}
          >
            Interfaces
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarCircle() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          position: "absolute",
          left: 0,
          top: 0,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UserIcon size={16} color="#fff" />
      </div>
    </div>
  );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 8,
        border: "1px solid #333",
        background: "#1a1a2e",
        opacity: isCollapsed ? 0 : 1,
        transition: `opacity 0.2s ${softSpringEasing}`,
        pointerEvents: isCollapsed ? "none" : "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, position: "relative" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={svgPaths.p154b5b00} fill="#a3a3a3" fillRule="evenodd" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-['Lexend',_sans-serif] text-[14px] text-neutral-50 placeholder:text-neutral-400 leading-[20px]"
              tabIndex={isCollapsed ? -1 : 0}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {/* keyboard shortcut badge */}
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
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "Dashboard Types",
          items: [
            { icon: <LayoutDashboard size={16} />, label: "Overview", isActive: true },
            {
              icon: <BarChart3 size={16} />,
              label: "Executive Summary",
              hasDropdown: true,
              children: [
                { label: "Revenue Overview" },
                { label: "Key Performance Indicators" },
                { label: "Strategic Goals Progress" },
                { label: "Department Highlights" },
              ],
            },
            {
              icon: <CheckSquare size={16} />,
              label: "Operations Dashboard",
              hasDropdown: true,
              children: [
                { label: "Project Timeline" },
                { label: "Resource Allocation" },
                { label: "Team Performance" },
                { label: "Capacity Planning" },
              ],
            },
            {
              icon: <BarChart size={16} />,
              label: "Financial Dashboard",
              hasDropdown: true,
              children: [
                { label: "Budget vs Actual" },
                { label: "Cash Flow Analysis" },
                { label: "Expense Breakdown" },
                { label: "Profit & Loss Summary" },
              ],
            },
          ],
        },
        {
          title: "Report Summaries",
          items: [
            {
              icon: <FileText size={16} />,
              label: "Weekly Reports",
              hasDropdown: true,
              children: [
                { label: "Team Productivity: 87% ↑" },
                { label: "Project Completion: 12/15" },
                { label: "Budget Utilization: 73%" },
                { label: "Client Satisfaction: 4.6/5" },
              ],
            },
            {
              icon: <FileText size={16} />,
              label: "Monthly Insights",
              hasDropdown: true,
              children: [
                { label: "Revenue Growth: +15.3%" },
                { label: "New Clients: 24" },
                { label: "Team Expansion: 8 hires" },
                { label: "Cost Reduction: 7.2%" },
              ],
            },
            {
              icon: <FileText size={16} />,
              label: "Quarterly Analysis",
              hasDropdown: true,
              children: [
                { label: "Market Position: Improved" },
                { label: "ROI: 23.4%" },
                { label: "Customer Retention: 92%" },
                { label: "Innovation Index: 8.7/10" },
              ],
            },
          ],
        },
        {
          title: "Business Intelligence",
          items: [
            {
              icon: <Star size={16} />,
              label: "Performance Metrics",
              hasDropdown: true,
              children: [
                { label: "Sales Conversion: 34.2%" },
                { label: "Lead Response Time: 2.3h" },
                { label: "Customer Lifetime Value: $4,280" },
                { label: "Churn Rate: 3.1%" },
              ],
            },
            {
              icon: <BarChart3 size={16} />,
              label: "Predictive Analytics",
              hasDropdown: true,
              children: [
                { label: "Q4 Revenue Forecast: $2.4M" },
                { label: "Resource Demand: High" },
                { label: "Market Trends: Positive" },
                { label: "Risk Assessment: Low" },
              ],
            },
          ],
        },
      ],
    },

    tasks: {
      title: "Tasks",
      sections: [
        {
          title: "Quick Actions",
          items: [
            { icon: <Plus size={16} />, label: "New task" },
            { icon: <Filter size={16} />, label: "Filter tasks" },
          ],
        },
        {
          title: "My Tasks",
          items: [
            {
              icon: <Clock size={16} />,
              label: "Due today",
              hasDropdown: true,
              children: [
                { icon: <Flag size={16} />, label: "Review design mockups" },
                { icon: <Flag size={16} />, label: "Update documentation" },
                { icon: <Flag size={16} />, label: "Test new feature" },
              ],
            },
            {
              icon: <Loader size={16} />,
              label: "In progress",
              hasDropdown: true,
              children: [
                { icon: <Loader size={16} />, label: "Implement user auth" },
                { icon: <Loader size={16} />, label: "Database migration" },
              ],
            },
            {
              icon: <CheckCircle size={16} />,
              label: "Completed",
              hasDropdown: true,
              children: [
                { icon: <CheckCircle size={16} />, label: "Fixed login bug" },
                { icon: <CheckCircle size={16} />, label: "Updated dependencies" },
                { icon: <CheckCircle size={16} />, label: "Code review completed" },
              ],
            },
          ],
        },
        {
          title: "Other",
          items: [
            {
              icon: <Flag size={16} />,
              label: "Priority tasks",
              hasDropdown: true,
              children: [
                { icon: <Flag size={16} />, label: "Security update" },
                { icon: <Flag size={16} />, label: "Client presentation" },
              ],
            },
            { icon: <Archive size={16} />, label: "Archived" },
          ],
        },
      ],
    },

    projects: {
      title: "Projects",
      sections: [
        {
          title: "Quick Actions",
          items: [
            { icon: <Plus size={16} />, label: "New project" },
            { icon: <Filter size={16} />, label: "Filter projects" },
          ],
        },
        {
          title: "Active Projects",
          items: [
            {
              icon: <FolderOpen size={16} />,
              label: "Web Application",
              hasDropdown: true,
              children: [
                { icon: <CheckSquare size={16} />, label: "Frontend development" },
                { icon: <CheckSquare size={16} />, label: "API integration" },
                { icon: <CheckSquare size={16} />, label: "Testing & QA" },
              ],
            },
            {
              icon: <FolderOpen size={16} />,
              label: "Mobile App",
              hasDropdown: true,
              children: [
                { icon: <CheckSquare size={16} />, label: "UI/UX design" },
                { icon: <CheckSquare size={16} />, label: "Native development" },
              ],
            },
          ],
        },
        {
          title: "Other",
          items: [
            { icon: <CheckCircle size={16} />, label: "Completed" },
            { icon: <Archive size={16} />, label: "Archived" },
          ],
        },
      ],
    },

    calendar: {
      title: "Calendar",
      sections: [
        {
          title: "Views",
          items: [
            { icon: <CalendarIcon size={16} />, label: "Month view" },
            { icon: <CalendarIcon size={16} />, label: "Week view" },
            { icon: <CalendarIcon size={16} />, label: "Day view" },
          ],
        },
        {
          title: "Events",
          items: [
            {
              icon: <Clock size={16} />,
              label: "Today's events",
              hasDropdown: true,
              children: [
                { icon: <Clock size={16} />, label: "Team standup (9:00 AM)" },
                { icon: <Clock size={16} />, label: "Client call (2:00 PM)" },
                { icon: <Clock size={16} />, label: "Project review (4:00 PM)" },
              ],
            },
            { icon: <CalendarIcon size={16} />, label: "Upcoming events" },
          ],
        },
        {
          title: "Quick Actions",
          items: [
            { icon: <Plus size={16} />, label: "New event" },
            { icon: <Share size={16} />, label: "Share calendar" },
          ],
        },
      ],
    },

    teams: {
      title: "Teams",
      sections: [
        {
          title: "My Teams",
          items: [
            {
              icon: <Users size={16} />,
              label: "Development Team",
              hasDropdown: true,
              children: [
                { icon: <UserIcon size={16} />, label: "John Doe (Lead)" },
                { icon: <UserIcon size={16} />, label: "Jane Smith" },
                { icon: <UserIcon size={16} />, label: "Mike Johnson" },
              ],
            },
            {
              icon: <Users size={16} />,
              label: "Design Team",
              hasDropdown: true,
              children: [
                { icon: <UserIcon size={16} />, label: "Sarah Wilson" },
                { icon: <UserIcon size={16} />, label: "Tom Brown" },
              ],
            },
          ],
        },
        {
          title: "Quick Actions",
          items: [
            { icon: <Plus size={16} />, label: "Invite member" },
            { icon: <SettingsIcon size={16} />, label: "Manage teams" },
          ],
        },
      ],
    },

    analytics: {
      title: "Analytics",
      sections: [
        {
          title: "Reports",
          items: [
            { icon: <BarChart3 size={16} />, label: "Performance report" },
            { icon: <CheckCircle size={16} />, label: "Task completion" },
            { icon: <Users size={16} />, label: "Team productivity" },
          ],
        },
        {
          title: "Insights",
          items: [
            {
              icon: <Star size={16} />,
              label: "Key metrics",
              hasDropdown: true,
              children: [
                { icon: <CheckSquare size={16} />, label: "Tasks completed: 24" },
                { icon: <Clock size={16} />, label: "Avg. completion time: 2.5d" },
                { icon: <BarChart3 size={16} />, label: "Team efficiency: 87%" },
              ],
            },
          ],
        },
      ],
    },

    files: {
      title: "Files",
      sections: [
        {
          title: "Quick Actions",
          items: [
            { icon: <Upload size={16} />, label: "Upload file" },
            { icon: <Plus size={16} />, label: "New folder" },
          ],
        },
        {
          title: "Recent Files",
          items: [
            {
              icon: <FileText size={16} />,
              label: "Recent documents",
              hasDropdown: true,
              children: [
                { icon: <FileText size={16} />, label: "Project proposal.pdf" },
                { icon: <FileText size={16} />, label: "Meeting notes.docx" },
                { icon: <FileText size={16} />, label: "Design specs.figma" },
              ],
            },
            { icon: <Share size={16} />, label: "Shared with me" },
          ],
        },
        {
          title: "Organization",
          items: [
            { icon: <FolderOpen size={16} />, label: "All folders" },
            { icon: <Archive size={16} />, label: "Archived files" },
          ],
        },
      ],
    },

    settings: {
      title: "Settings",
      sections: [
        {
          title: "Account",
          items: [
            { icon: <UserIcon size={16} />, label: "Profile settings" },
            { icon: <Shield size={16} />, label: "Security" },
            { icon: <Bell size={16} />, label: "Notifications" },
          ],
        },
        {
          title: "Workspace",
          items: [
            {
              icon: <SettingsIcon size={16} />,
              label: "Preferences",
              hasDropdown: true,
              children: [
                { icon: <Eye size={16} />, label: "Theme settings" },
                { icon: <Clock size={16} />, label: "Time zone" },
                { icon: <Bell size={16} />, label: "Default notifications" },
              ],
            },
            { icon: <Plug size={16} />, label: "Integrations" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.tasks;
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
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isActive ? "#ffffff14" : "transparent",
        border: "none",
        cursor: "pointer",
        color: isActive ? "#fafafa" : "#a3a3a3",
        transition: `all 0.2s ${softSpringEasing}`,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#ffffff0a";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
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
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { id: "projects", icon: <FolderOpen size={20} />, label: "Projects" },
    { id: "calendar", icon: <CalendarIcon size={20} />, label: "Calendar" },
    { id: "teams", icon: <Users size={20} />, label: "Teams" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { id: "files", icon: <FolderClosed size={20} />, label: "Files" },
  ];

  return (
    <div
      style={{
        width: 56,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "12px 8px",
        background: "#0f0f12",
        borderRight: "1px solid #222",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ transform: "scale(0.7)" }}>
          <InterfacesLogoSquare />
        </div>
      </div>

      {/* Navigation Icons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
        }}
      >
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

      <div style={{ flex: 1 }} />

      {/* Bottom section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")}>
          <SettingsIcon size={20} />
        </IconNavButton>
        <div style={{ marginTop: 4 }}>
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
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div
        style={{
          padding: "12px 8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#a3a3a3",
            padding: 4,
          }}
        >
          <ChevronDownIcon
            size={16}
            style={{ transform: "rotate(-90deg)" }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px 16px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'Lexend', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: "#fafafa",
                lineHeight: "24px",
              }}
            >
              {title}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onToggleCollapse}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#a3a3a3",
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChevronDownIcon
          size={16}
          style={{ transform: "rotate(90deg)" }}
        />
      </button>
    </div>
  );
}

function DetailSidebar({ activeSection }: { activeSection: string }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const content = getSidebarContent(activeSection);

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
      style={{
        width: isCollapsed ? 48 : 240,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#13131a",
        borderRight: "1px solid #222",
        transition: `width 0.3s ${softSpringEasing}`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {!isCollapsed && <SearchContainer isCollapsed={isCollapsed} />}

      <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: isCollapsed ? "4px" : "0 8px 8px",
        }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {!isCollapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #222" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrandBadge />
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={svgPaths.p29bde780} fill="#737373" />
                <path d={svgPaths.p3af0dbf2} fill="#737373" />
                <path d={svgPaths.p13593580} fill="#737373" />
              </svg>
            </div>
          </div>
        </div>
      )}
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: isCollapsed ? "6px" : "6px 8px",
        borderRadius: 6,
        cursor: "pointer",
        background: item.isActive ? "#ffffff14" : "transparent",
        transition: `background 0.15s ${softSpringEasing}`,
        justifyContent: isCollapsed ? "center" : "flex-start",
      }}
      onMouseEnter={(e) => {
        if (!item.isActive) e.currentTarget.style.background = "#ffffff0a";
      }}
      onMouseLeave={(e) => {
        if (!item.isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ flexShrink: 0, color: item.isActive ? "#fafafa" : "#a3a3a3", display: "flex" }}>
        {item.icon}
      </div>

      {!isCollapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: item.isActive ? "#fafafa" : "#d4d4d4",
              lineHeight: "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {item.label}
          </span>
        </div>
      )}

      {item.hasDropdown && !isCollapsed && (
        <div
          style={{
            flexShrink: 0,
            color: "#737373",
            transition: `transform 0.2s ${softSpringEasing}`,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
          }}
        >
          <ChevronDownIcon size={14} />
        </div>
      )}
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div
      onClick={onItemClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px 4px 32px",
        borderRadius: 6,
        cursor: "pointer",
        transition: `background 0.15s ${softSpringEasing}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#ffffff0a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            color: "#a3a3a3",
            lineHeight: "16px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      {!isCollapsed && (
        <div style={{ padding: "8px 8px 4px" }}>
          <span
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 500,
              fontSize: 11,
              color: "#737373",
              lineHeight: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {section.title}
          </span>
        </div>
      )}

      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div key={itemKey}>
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => console.log(`Clicked ${item.label}`)}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div style={{ marginTop: 2 }}>
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={childIndex}
                    item={child}
                    onItemClick={() => console.log(`Clicked ${child.label}`)}
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

/* --------------------------------- Layout -------------------------------- */

function TwoLevelSidebar() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <DetailSidebar activeSection={activeSection} />
    </div>
  );
}

/* ------------------------------- Root Frame ------------------------------ */

export function Frame760() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        background: "#0f0f12",
        overflow: "hidden",
      }}
    >
      <TwoLevelSidebar />
      <div style={{ flex: 1, background: "#0f0f12", overflow: "auto" }}>
        {/* Main content area */}
      </div>
    </div>
  );
}

export default Frame760;
