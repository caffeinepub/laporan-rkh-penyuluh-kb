import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Printer } from "lucide-react";
import { useRef, useState } from "react";
import type { UserProfile } from "../backend.d";
import { useQueryRKHReports } from "../hooks/useQueries";
import {
  BULAN_ID,
  formatMonthYear,
  formatTanggal,
  getCurrentMonthYear,
} from "../utils/date";

interface RiwayatProps {
  profile: UserProfile | null;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

export default function RiwayatLaporanPage({ profile }: RiwayatProps) {
  const { bulan: initBulan, tahun: initTahun } = getCurrentMonthYear();
  const [bulan, setBulan] = useState(initBulan);
  const [tahun, setTahun] = useState(initTahun);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: reports = [], isLoading } = useQueryRKHReports({
    bulan,
    tahun,
  });
  const sorted = [...reports].sort((a, b) =>
    a.tanggal.localeCompare(b.tanggal),
  );

  const handlePrint = () => window.print();
  const bulanName = formatMonthYear(bulan, tahun);

  return (
    <>
      {/* Screen version */}
      <div className="no-print space-y-4">
        <div className="bg-white rounded-lg shadow-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-brand-nav">
              Riwayat Laporan RKH
            </h2>
            <Button
              data-ocid="riwayat.print.primary_button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-white text-xs px-3 py-2 h-auto"
              style={{ backgroundColor: "#2E7D5B" }}
            >
              <Printer size={14} />
              Cetak Laporan
            </Button>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {sorted.map((r, idx) => (
                    <tr
                      key={r.id.toString()}
                      data-ocid={`riwayat.reports.item.${idx + 1}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-brand-muted">{idx + 1}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Print-only version */}
      <div ref={printRef} className="print-only print-container">
        <div
          style={{
            textAlign: "center",
            borderBottom: "3px double #000",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#2E7D5B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}
              >
                BKKBN
              </span>
            </div>
            <div>
              <p style={{ fontWeight: "bold", fontSize: "11pt", margin: 0 }}>
                BADAN KEPENDUDUKAN DAN KELUARGA BERENCANA NASIONAL
              </p>
              <p style={{ fontSize: "9pt", margin: 0 }}>Perwakilan Provinsi</p>
            </div>
          </div>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              margin: "8px 0 4px",
              textTransform: "uppercase",
            }}
          >
            LAPORAN RENCANA KEGIATAN HARIAN (RKH)
          </h2>
          <p style={{ fontSize: "10pt", margin: 0 }}>
            PENYULUH KELUARGA BERENCANA
          </p>
          <p style={{ fontSize: "10pt", margin: 0 }}>Periode: {bulanName}</p>
        </div>

        <div style={{ marginBottom: "16px", fontSize: "10pt" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {(
                [
                  ["Nama", profile?.nama ?? "-"],
                  ["NIP", profile?.nip ?? "-"],
                  ["Jabatan", profile?.jabatan ?? "-"],
                  ["Unit Kerja", profile?.unitKerja ?? "-"],
                  ["Wilayah Kerja", profile?.wilayahKerja ?? "-"],
                ] as [string, string][]
              ).map(([label, val]) => (
                <tr key={label}>
                  <td
                    style={{
                      width: "160px",
                      paddingBottom: "4px",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </td>
                  <td style={{ paddingBottom: "4px" }}>: {val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "9pt",
            marginBottom: "24px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              {[
                "No",
                "Tanggal",
                "Kegiatan",
                "Sasaran",
                "Jumlah",
                "Lokasi",
                "Hasil Kegiatan",
                "Ket.",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    border: "1px solid #999",
                    padding: "6px 8px",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, idx) => (
              <tr key={r.id.toString()}>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {idx + 1}
                </td>
                <td
                  style={{
                    border: "1px solid #999",
                    padding: "5px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTanggal(r.tanggal)}
                </td>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {r.kegiatan}
                </td>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {r.sasaran}
                </td>
                <td
                  style={{
                    border: "1px solid #999",
                    padding: "5px 8px",
                    textAlign: "center",
                  }}
                >
                  {r.jumlahSasaran.toString()}
                </td>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {r.lokasi}
                </td>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {r.hasilKegiatan}
                </td>
                <td style={{ border: "1px solid #999", padding: "5px 8px" }}>
                  {r.keterangan ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "10pt",
          }}
        >
          <div style={{ textAlign: "center", minWidth: "200px" }}>
            <p style={{ marginBottom: "4px" }}>Mengetahui,</p>
            <p style={{ marginBottom: "4px" }}>Koordinator Penyuluh KB</p>
            <div style={{ height: "64px" }} />
            <p
              style={{
                fontWeight: "bold",
                borderTop: "1px solid #000",
                paddingTop: "4px",
              }}
            >
              {profile?.nama ?? "_____________________"}
            </p>
            <p>NIP: {profile?.nip ?? "_____________________"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
