import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <div className="bg-white border-b border-brand-border px-6 py-3 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gradStart to-brand-gradEnd flex items-center justify-center">
          <span className="text-white font-bold text-xs">BKKBN</span>
        </div>
        <h1 className="text-sm font-bold text-brand-nav uppercase tracking-wide">
          Sistem Laporan RKH Penyuluh KB
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-card w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
              }}
            >
              <span className="text-white font-bold text-lg">RKH</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-brand-nav text-center mb-1">
            Selamat Datang
          </h2>
          <p className="text-sm text-brand-muted text-center mb-2">
            Sistem Laporan Rencana Kegiatan Harian
          </p>
          <p className="text-xs text-brand-muted text-center mb-8">
            Penyuluh Keluarga Berencana
          </p>

          <div className="space-y-4">
            <div className="bg-brand-greenLight rounded-lg p-4 text-sm text-brand-green">
              <p className="font-semibold mb-1">Petunjuk Login:</p>
              <p className="text-xs">
                Gunakan Internet Identity untuk masuk ke sistem. Pastikan Anda
                telah memiliki akun Internet Identity sebelum melanjutkan.
              </p>
            </div>

            <button
              type="button"
              data-ocid="login.primary_button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-60"
              style={{
                background: isLoggingIn
                  ? "#256B4D"
                  : "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
              }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sedang masuk...
                </>
              ) : (
                "Masuk dengan Internet Identity"
              )}
            </button>
          </div>

          <p className="text-xs text-brand-muted text-center mt-6">
            Aplikasi Resmi BKKBN - Laporan RKH Penyuluh KB
          </p>
        </div>
      </div>
    </div>
  );
}
