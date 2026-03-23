import { FilePlus, History, LayoutDashboard, Shield, User } from "lucide-react";
import type { Page } from "../types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  {
    page: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    page: "input-rkh",
    label: "Input Laporan (RKH)",
    icon: <FilePlus size={16} />,
  },
  { page: "riwayat", label: "Riwayat Laporan", icon: <History size={16} /> },
  { page: "profil", label: "Profil Saya", icon: <User size={16} /> },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  isAdmin,
}: SidebarProps) {
  const items = isAdmin
    ? [
        ...navItems,
        {
          page: "admin" as Page,
          label: "Admin Panel",
          icon: <Shield size={16} />,
        },
      ]
    : navItems;

  return (
    <aside className="no-print w-52 shrink-0">
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-3 py-3 border-b border-brand-border">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
            Menu Utama
          </p>
        </div>
        <nav className="py-2">
          {items.map((item) => (
            <button
              type="button"
              key={item.page}
              data-ocid={`sidebar.${item.page}.link`}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                currentPage === item.page
                  ? "bg-brand-sidebarActive text-brand-green font-semibold border-l-2 border-brand-green"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={
                  currentPage === item.page
                    ? "text-brand-green"
                    : "text-brand-muted"
                }
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
