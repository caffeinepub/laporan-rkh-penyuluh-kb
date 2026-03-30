import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Paperclip, Pencil, Printer } from "lucide-react";
import { useRef, useState } from "react";
import type { RKHReport, UserProfile } from "../backend.d";
import { useQueryRKHReports } from "../hooks/useQueries";
import type { Page } from "../types";
import {
  BULAN_ID,
  formatMonthYear,
  formatTanggal,
  getCurrentMonthYear,
} from "../utils/date";

interface RiwayatProps {
  profile: UserProfile | null;
  isAdmin?: boolean;
  onNavigate?: (page: Page, report?: RKHReport) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

interface LampiranItem {
  name: string;
  url: string;
  type: string;
}

function parseLampiran(lampiran: string | undefined): LampiranItem[] {
  if (!lampiran) return [];
  try {
    const parsed = JSON.parse(lampiran);
    if (Array.isArray(parsed)) return parsed as LampiranItem[];
    if (parsed && typeof parsed === "object" && parsed.url)
      return [parsed as LampiranItem];
    return [];
  } catch {
    return [];
  }
}

function PrintSingleReport({
  report,
  profile,
  nomorLaporan,
}: {
  report: RKHReport;
  profile: UserProfile | null;
  nomorLaporan: number;
}) {
  const lampiranItems = parseLampiran(report.lampiran);
  const gambarItems = lampiranItems.filter(
    (l) => l.type === "gambar" || l.type === "image",
  );
  const dokumenItems = lampiranItems.filter(
    (l) => l.type === "dokumen" || l.type === "document",
  );

  const allLampiranLabels: string[] = [
    ...gambarItems.map(() => "Foto/Gambar"),
    ...dokumenItems.map((d) => d.name || "Dokumen/PDF"),
  ];

  const detailRows: [string, string][] = [
    ["Nomor Laporan", `RKH-${String(nomorLaporan).padStart(4, "0")}`],
    ["Tanggal", formatTanggal(report.tanggal)],
    ["Nama Kegiatan", report.kegiatan],
    ["Sasaran", report.sasaran],
    ["Jumlah Sasaran", report.jumlahSasaran.toString()],
    ["Lokasi Kegiatan", report.lokasi],
    ["Hasil Kegiatan", report.hasilKegiatan],
    ["Keterangan", report.keterangan ?? "-"],
  ];

  const identitasRows: [string, string][] = [
    ["Nama", profile?.nama ?? "-"],
    ["NIP", profile?.nip ?? "-"],
    ["Unit Kerja", profile?.unitKerja ?? "-"],
    ["Wilayah", profile?.wilayahKerja ?? "-"],
  ];

  const headerStyle: React.CSSProperties = {
    background: "#1a5c3e",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "9.5pt",
    padding: "5px 10px",
  };

  const cellLabelStyle: React.CSSProperties = {
    padding: "5px 10px",
    fontWeight: 600,
    width: "160px",
    borderRight: "1px solid #ddd",
    background: "#f9f9f9",
  };

  const cellValueStyle: React.CSSProperties = {
    padding: "5px 10px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "9.5pt",
    border: "1px solid #999",
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "24px",
    borderTop: "1px solid #ddd",
    paddingTop: "6px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "8pt",
    color: "#888",
  };

  const pageStyle: React.CSSProperties = {
    background: "#fff",
    padding: "28px 32px",
    minHeight: "29.7cm",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    fontSize: "10pt",
    color: "#000",
    pageBreakAfter: "always",
  };

  return (
    <>
      {/* PAGE 1: MAIN REPORT */}
      <div
        style={{
          ...pageStyle,
          pageBreakAfter: lampiranItems.length > 0 ? "always" : "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "3px double #1a5c3e",
            paddingBottom: "12px",
            marginBottom: "16px",
            gap: "16px",
          }}
        >
          <img
            src="/assets/uploads/logo-bkkbn-1.jpg"
            alt="Logo BKKBN"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              LAPORAN RENCANA KERJA HARIAN PENYULUH KB
            </div>
            <div style={{ fontSize: "9pt", marginTop: "3px", color: "#333" }}>
              Badan Kependudukan dan Keluarga Berencana Nasional
            </div>
            {profile?.unitKerja && (
              <div style={{ fontSize: "9pt", color: "#555" }}>
                {profile.unitKerja}
              </div>
            )}
          </div>
        </div>

        {/* IDENTITAS PENYULUH */}
        <div style={{ marginBottom: "14px" }}>
          <div style={headerStyle}>IDENTITAS PENYULUH</div>
          <table style={tableStyle}>
            <tbody>
              {identitasRows.map(([label, val]) => (
                <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={cellLabelStyle}>{label}</td>
                  <td style={cellValueStyle}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAIL LAPORAN */}
        <div style={{ marginBottom: "14px" }}>
          <div style={headerStyle}>DETAIL LAPORAN</div>
          <table style={tableStyle}>
            <tbody>
              {detailRows.map(([label, val]) => (
                <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={cellLabelStyle}>{label}</td>
                  <td style={cellValueStyle}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LAMPIRAN */}
        <div style={{ marginBottom: "24px" }}>
          <div style={headerStyle}>LAMPIRAN</div>
          <div
            style={{
              border: "1px solid #999",
              padding: "10px 12px",
              fontSize: "9.5pt",
            }}
          >
            {allLampiranLabels.length === 0 ? (
              <p style={{ margin: 0, color: "#888" }}>Tidak ada lampiran.</p>
            ) : (
              <>
                <p style={{ margin: "0 0 6px" }}>
                  Ada {allLampiranLabels.length} file lampiran yang terlampir
                  pada halaman lampiran(nya).
                </p>
                {allLampiranLabels.map((label, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list, order does not change
                  <p key={`lbl-${i}`} style={{ margin: "2px 0" }}>
                    Lampiran {i + 1}: {label}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              textAlign: "center",
              minWidth: "200px",
              fontSize: "9.5pt",
            }}
          >
            <p style={{ margin: "0 0 2px" }}>Yang Membuat Laporan,</p>
            <div
              style={{
                width: "130px",
                height: "65px",
                margin: "8px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profile?.tandaTangan && (
                <img
                  src={profile.tandaTangan}
                  alt="Tanda Tangan"
                  style={{
                    maxWidth: "130px",
                    maxHeight: "65px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <p
              style={{
                fontWeight: "bold",
                borderTop: "1px solid #000",
                paddingTop: "4px",
                margin: "0 0 2px",
              }}
            >
              {profile?.nama ?? "_____________________"}
            </p>
            <p style={{ margin: 0 }}>NIP: {profile?.nip ?? "-"}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <span>
            Laporan RKH Penyuluh KB &mdash; {profile?.unitKerja ?? "BKKBN"}
          </span>
          <span>Halaman 1</span>
        </div>
      </div>

      {/* PAGES: GAMBAR LAMPIRAN */}
      {gambarItems.map((item, idx) => (
        <div
          key={item.url || `gambar-${idx}`}
          style={{ ...pageStyle, pageBreakBefore: "always" }}
        >
          <div
            style={{
              background: "#1a5c3e",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11pt",
              padding: "10px 16px",
              marginBottom: "20px",
              letterSpacing: "0.5px",
            }}
          >
            LAMPIRAN {idx + 1} - FOTO/GAMBAR
          </div>
          <p style={{ fontSize: "9pt", color: "#555", marginBottom: "12px" }}>
            Laporan tanggal {formatTanggal(report.tanggal)} &bull;{" "}
            {report.kegiatan}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={item.url}
              alt={item.name || "Lampiran foto"}
              style={{
                maxWidth: "100%",
                maxHeight: "20cm",
                objectFit: "contain",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={footerStyle}>
            <span>
              Laporan RKH Penyuluh KB &mdash; {profile?.unitKerja ?? "BKKBN"}
            </span>
            <span>Halaman {idx + 2}</span>
          </div>
        </div>
      ))}

      {/* PAGES: DOKUMEN LAMPIRAN */}
      {dokumenItems.map((item, idx) => (
        <div
          key={item.url || `dok-${idx}`}
          style={{ ...pageStyle, pageBreakBefore: "always" }}
        >
          <div
            style={{
              background: "#1a5c3e",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11pt",
              padding: "10px 16px",
              marginBottom: "20px",
            }}
          >
            LAMPIRAN {gambarItems.length + idx + 1} - DOKUMEN
          </div>
          <p style={{ fontSize: "9pt", color: "#555", marginBottom: "12px" }}>
            Laporan tanggal {formatTanggal(report.tanggal)} &bull;{" "}
            {report.kegiatan}
          </p>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
              marginTop: "32px",
            }}
          >
            <p
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {item.name}
            </p>
            <p style={{ color: "#666", fontSize: "9pt" }}>
              File dokumen ini tersedia secara digital.
            </p>
            <p
              style={{
                fontSize: "9pt",
                wordBreak: "break-all",
                color: "#999",
                marginTop: "8px",
              }}
            >
              {item.url}
            </p>
          </div>
          <div style={footerStyle}>
            <span>
              Laporan RKH Penyuluh KB &mdash; {profile?.unitKerja ?? "BKKBN"}
            </span>
            <span>Halaman {gambarItems.length + idx + 2}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export default function RiwayatLaporanPage({
  profile,
  isAdmin = false,
  onNavigate,
}: RiwayatProps) {
  const { bulan: initBulan, tahun: initTahun } = getCurrentMonthYear();
  const [bulan, setBulan] = useState(initBulan);
  const [tahun, setTahun] = useState(initTahun);
  const [printReport, setPrintReport] = useState<RKHReport | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: reports = [], isLoading } = useQueryRKHReports({
    bulan,
    tahun,
  });
  const sorted = [...reports].sort((a, b) =>
    a.tanggal.localeCompare(b.tanggal),
  );

  const handlePrintSingle = (report: RKHReport) => {
    setPrintReport(report);
    setTimeout(() => window.print(), 150);
  };

  const handlePrintAll = () => {
    setPrintReport(null);
    setTimeout(() => window.print(), 150);
  };

  const bulanName = formatMonthYear(bulan, tahun);
  const printRows = printReport ? [printReport] : sorted;

  return (
    <>
      {/* SCREEN VIEW */}
      <div className="no-print space-y-4">
        <div className="bg-white rounded-lg shadow-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-brand-nav">
              Riwayat Laporan RKH
            </h2>
            {isAdmin && (
              <Button
                data-ocid="riwayat.print.primary_button"
                onClick={handlePrintAll}
                className="flex items-center gap-1.5 text-white text-xs px-3 py-2 h-auto"
                style={{ backgroundColor: "#2E7D5B" }}
              >
                <Printer size={14} />
                Cetak Laporan Gabungan
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div>
              <label
                htmlFor="filter-bulan"
                className="text-xs text-brand-muted mb-1 block"
              >
                Bulan
              </label>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger
                  id="filter-bulan"
                  data-ocid="riwayat.bulan.select"
                  className="w-40 h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_ID.map((nama) => (
                    <SelectItem
                      key={nama}
                      value={String(BULAN_ID.indexOf(nama) + 1).padStart(
                        2,
                        "0",
                      )}
                    >
                      {nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="filter-tahun"
                className="text-xs text-brand-muted mb-1 block"
              >
                Tahun
              </label>
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger
                  id="filter-tahun"
                  data-ocid="riwayat.tahun.select"
                  className="w-28 h-9 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-brand-border">
            <p className="text-sm font-semibold text-brand-nav">
              Laporan Bulan {bulanName}
            </p>
            <p className="text-xs text-brand-muted">
              {sorted.length} laporan ditemukan
            </p>
          </div>

          {isLoading ? (
            <div
              data-ocid="riwayat.reports.loading_state"
              className="flex justify-center py-12"
            >
              <Loader2 className="animate-spin text-brand-green" size={24} />
            </div>
          ) : sorted.length === 0 ? (
            <div
              data-ocid="riwayat.reports.empty_state"
              className="text-center py-12"
            >
              <p className="text-sm text-brand-muted">
                Tidak ada laporan untuk periode ini
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="riwayat.reports.table"
              >
                <thead className="bg-gray-50 text-xs font-semibold text-brand-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Kegiatan</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">
                      Sasaran
                    </th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">
                      Jml
                    </th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Hasil Kegiatan
                    </th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">
                      Lampiran
                    </th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {sorted.map((r, idx) => {
                    const lampiranItems = parseLampiran(r.lampiran);
                    return (
                      <tr
                        key={r.id.toString()}
                        data-ocid={`riwayat.reports.item.${idx + 1}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-brand-muted">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          {formatTanggal(r.tanggal)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="line-clamp-2 text-xs">
                            {r.kegiatan}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs"
                            style={{
                              backgroundColor: "#DFF3E8",
                              color: "#2E7D5B",
                            }}
                          >
                            {r.sasaran}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell text-xs">
                          {r.jumlahSasaran.toString()}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-brand-muted">
                          {r.lokasi}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="line-clamp-2 text-xs text-brand-muted">
                            {r.hasilKegiatan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          {lampiranItems.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700">
                              <Paperclip size={12} />
                              {lampiranItems.length}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-center">
                            <button
                              type="button"
                              title="Cetak laporan ini"
                              onClick={() => handlePrintSingle(r)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-green-700 transition-colors"
                            >
                              <Printer size={14} />
                            </button>
                            {onNavigate && (
                              <button
                                type="button"
                                title="Edit laporan ini"
                                onClick={() => onNavigate("edit-rkh", r)}
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PRINT VIEW */}
      <div ref={printRef} className="print-only">
        {printRows.map((report, idx) => (
          <PrintSingleReport
            key={report.id.toString()}
            report={report}
            profile={profile}
            nomorLaporan={idx + 1}
          />
        ))}
      </div>
    </>
  );
}
