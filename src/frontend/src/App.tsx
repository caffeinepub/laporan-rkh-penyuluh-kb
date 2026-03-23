import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { RKHReport } from "./backend.d";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "./hooks/useQueries";
import type { Page } from "./types";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import InputRKHPage from "./pages/InputRKHPage";
import LoginPage from "./pages/LoginPage";
import ProfilPage from "./pages/ProfilPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import RiwayatLaporanPage from "./pages/RiwayatLaporanPage";

const queryClient = new QueryClient();

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [editReport, setEditReport] = useState<RKHReport | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: Page, report?: RKHReport) => {
    setCurrentPage(page);
    setEditReport(report ?? null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
            }}
          >
            <span className="text-white font-bold">RKH</span>
          </div>
          <p className="text-brand-muted text-sm">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated but no profile yet
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && profile === null;
  if (showProfileSetup) {
    return <ProfileSetupPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "input-rkh":
        return <InputRKHPage onNavigate={handleNavigate} editReport={null} />;
      case "edit-rkh":
        return (
          <InputRKHPage onNavigate={handleNavigate} editReport={editReport} />
        );
      case "riwayat":
        return <RiwayatLaporanPage profile={profile ?? null} />;
      case "profil":
        return <ProfilPage />;
      case "admin":
        return isAdmin ? (
          <AdminPage />
        ) : (
          <DashboardPage
            profile={profile ?? null}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <DashboardPage
            profile={profile ?? null}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        profile={profile ?? null}
        isAdmin={isAdmin}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-5">
        <div className="flex gap-4">
          {/* Left sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigate}
              isAdmin={isAdmin}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">{renderPage()}</div>
        </div>
      </main>

      <Footer />
      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
