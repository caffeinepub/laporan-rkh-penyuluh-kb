import { useQueryClient } from "@tanstack/react-query";
import {
  FilePlus,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
} from "lucide-react";
import type { UserProfile } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Page } from "../types";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profile: UserProfile | null;
  isAdmin: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  {
    page: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={15} />,
  },
  { page: "input-rkh", label: "Input Laporan", icon: <FilePlus size={15} /> },
  { page: "riwayat", label: "Riwayat Laporan", icon: <History size={15} /> },
  { page: "profil", label: "Profil", icon: <User size={15} /> },
];

export default function Header({
  currentPage,
  onNavigate,
  profile,
  isAdmin,
  mobileMenuOpen,
  onToggleMobileMenu,
}: HeaderProps) {
  const { clear } = useInternetIdentity();
  const qc = useQueryClient();

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  const allNavItems = isAdmin
    ? [
        ...navItems,
        {
          page: "admin" as Page,
          label: "Admin Panel",
          icon: <Shield size={15} />,
        },
      ]
    : navItems;

  return (
    <header className="no-print sticky top-0 z-40 shadow-sm">
      {/* Tier 1: Branding strip */}
      <div className="bg-white flex items-center justify-between px-4 py-2 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gradStart to-brand-gradEnd flex items-center justify-center">
              <span className="text-white font-bold text-xs">BKKBN</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-nav leading-tight">
                BADAN KEPENDUDUKAN
              </p>
              <p className="text-[10px] text-brand-nav leading-tight">
                KELUARGA BERENCANA NASIONAL
              </p>
            </div>
          </div>
        </div>
        <div
          className="hidden sm:flex flex-1 mx-4 rounded-lg px-4 py-2 items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
          }}
        >
          <h1 className="text-white font-bold text-sm tracking-wider uppercase text-center">
            SISTEM LAPORAN RKH PENYULUH KB
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-[8px] text-center leading-tight">
                KEMKES
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-nav leading-tight">
                KEMENTERIAN
              </p>
              <p className="text-[10px] text-brand-nav leading-tight">
                KESEHATAN RI
              </p>
            </div>
          </div>
          <button
            type="button"
            className="sm:hidden p-1 text-brand-nav"
            onClick={onToggleMobileMenu}
            aria-label="Toggle menu"
            data-ocid="header.toggle"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Tier 2: Navigation bar */}
      <nav className="bg-brand-nav px-2 py-0 flex items-center justify-between">
        <div className="flex items-center">
          {allNavItems.map((item) => (
            <button
              type="button"
              key={item.page}
              data-ocid={`nav.${item.page}.link`}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                currentPage === item.page
                  ? "text-white border-b-2 border-brand-gradEnd bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
          {profile && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-white text-xs font-semibold">
                {profile.nama}
              </span>
              <span className="text-white/60 text-[10px]">
                NIP: {profile.nip}
              </span>
            </div>
          )}
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-brand-nav border-t border-white/10">
          {allNavItems.map((item) => (
            <button
              type="button"
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                onToggleMobileMenu();
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-sm ${
                currentPage === item.page
                  ? "text-white bg-white/10"
                  : "text-white/70"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
