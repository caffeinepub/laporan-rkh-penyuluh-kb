import {
  FilePlus,
  History,
  LayoutDashboard,
  Lock,
  Shield,
  User,
} from "lucide-react";
import type { Page } from "../types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
  tokenVerified?: boolean;
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
  tokenVerified = true,
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
          {items.map((item) => {
            const isLocked = !tokenVerified && item.page !== "dashboard";
            const isActive = currentPage === item.page;
            return (
              <button
                type="button"
                key={item.page}
                data-ocid={`sidebar.${item.page}.link`}
                onClick={() => !isLocked && onNavigate(item.page)}
                disabled={isLocked}
                title={
                  isLocked ? "Verifikasi token terlebih dahulu" : undefined
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isLocked
                    ? "opacity-40 pointer-events-none cursor-not-allowed"
                    : isActive
                      ? "bg-brand-sidebarActive text-brand-green font-semibold border-l-2 border-brand-green"
                      : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={isActive ? "text-brand-green" : "text-brand-muted"}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {isLocked && (
                  <Lock size={12} className="text-brand-muted shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
