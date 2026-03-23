import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useState } from "react";
import type { RKHReport } from "./backend.d";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "./hooks/useQueries";
import type { Page } from "./types";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

// Lazy-load heavy pages to reduce initial bundle size
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InputRKHPage = lazy(() => import("./pages/InputRKHPage"));
const RiwayatLaporanPage = lazy(() => import("./pages/RiwayatLaporanPage"));
const ProfilPage = lazy(() => import("./pages/ProfilPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-brand-muted text-xs">Memuat...</p>
      </div>
    </div>
  );
}

export default function App() {
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

  const [tokenVerified, setTokenVerified] = useState<boolean>(
    () => sessionStorage.getItem("tokenVerified") === "true",
  );

  const handleTokenVerified = () => {
    sessionStorage.setItem("tokenVerified", "true");
    setTokenVerified(true);
  };

  const effectiveTokenVerified = isAdmin || tokenVerified;

  const handleNavigate = (page: Page, report?: RKHReport) => {
    setCurrentPage(page);
    setEditReport(report ?? null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
        return (
          <RiwayatLaporanPage
            profile={profile ?? null}
            isAdmin={isAdmin}
            onNavigate={handleNavigate}
          />
        );
      case "profil":
        return <ProfilPage />;
      case "admin":
        return isAdmin ? (
          <AdminPage />
        ) : (
          <DashboardPage
            profile={profile ?? null}
            onNavigate={handleNavigate}
            tokenVerified={effectiveTokenVerified}
            onTokenVerified={handleTokenVerified}
          />
        );
      default:
        return (
          <DashboardPage
            profile={profile ?? null}
            onNavigate={handleNavigate}
            tokenVerified={effectiveTokenVerified}
            onTokenVerified={handleTokenVerified}
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
        tokenVerified={effectiveTokenVerified}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-5">
        <div className="flex gap-4">
          <div className="hidden lg:block">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigate}
              isAdmin={isAdmin}
              tokenVerified={effectiveTokenVerified}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster richColors />
    </div>
  );
}
