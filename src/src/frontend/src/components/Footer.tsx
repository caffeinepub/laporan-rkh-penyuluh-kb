export default function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="no-print bg-brand-nav text-white mt-8">
      <div className="border-b border-white/10 py-2 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 text-xs text-white/60">
          <span>Sistem Informasi Laporan RKH</span>
          <span>|</span>
          <span>BKKBN</span>
          <span>|</span>
          <span>Penyuluh KB</span>
        </div>
      </div>
      <div className="py-8 px-6 text-center">
        <div className="flex justify-center mb-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
            }}
          >
            <span className="text-white font-bold text-xs">BKKBN</span>
          </div>
        </div>
        <p className="text-sm font-semibold">LAPORAN RKH PENYULUH KB</p>
        <p className="text-xs text-white/50 mt-1">
          Badan Kependudukan dan Keluarga Berencana Nasional
        </p>
        <p className="text-xs text-white/40 mt-4">
          &copy; {year}. Dibuat dengan ❤️ menggunakan{" "}
          <a
            href={utmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/70"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
