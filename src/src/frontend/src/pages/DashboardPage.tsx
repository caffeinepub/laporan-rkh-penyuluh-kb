import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Edit,
  FileText,
  History,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RKHReport, UserProfile } from "../backend.d";
import TokenGateDialog from "../components/TokenGateDialog";
import { useDeleteReport, useGetMyReports } from "../hooks/useQueries";
import type { Page } from "../types";
import { BULAN_ID, formatTanggal, getCurrentMonthYear } from "../utils/date";

interface DashboardProps {
  tokenVerified?: boolean;
  onTokenVerified?: () => void;
  profile: UserProfile | null;
  onNavigate: (page: Page, editReport?: RKHReport) => void;
}

export default function DashboardPage({
  profile,
  onNavigate,
  tokenVerified = true,
  onTokenVerified,
}: DashboardProps) {
  const { data: reports = [], isLoading } = useGetMyReports();
  const deleteMutation = useDeleteReport();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const { bulan, tahun } = getCurrentMonthYear();
  const thisMonthReports = reports.filter((r) => {
    const [y, m] = r.tanggal.split("-");
    return m === bulan && y === tahun;
  });

  const filtered = reports.filter(
    (r) =>
      r.kegiatan.toLowerCase().includes(search.toLowerCase()) ||
      r.lokasi.toLowerCase().includes(search.toLowerCase()) ||
      r.sasaran.toLowerCase().includes(search.toLowerCase()),
  );

  const recent = filtered
    .slice()
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 10);

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast.success("Laporan berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus laporan");
    } finally {
      setDeleteTarget(null);
    }
  };

  const bulanName = BULAN_ID[Number.parseInt(bulan, 10) - 1];

  return (
    <>
      {!tokenVerified && onTokenVerified && (
        <TokenGateDialog onTokenVerified={onTokenVerified} />
      )}
      <div className="bg-white rounded-lg shadow-card p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-brand-nav">
              Selamat datang, {profile?.nama ?? "Penyuluh KB"}!
            </h2>
            <p className="text-sm text-brand-muted">
              {profile?.jabatan} — {profile?.wilayahKerja}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              data-ocid="dashboard.create_rkh.primary_button"
              onClick={() => onNavigate("input-rkh")}
              className="flex items-center gap-1.5 text-white text-xs px-3 py-2 h-auto"
              style={{ backgroundColor: "#2E7D5B" }}
            >
              <PlusCircle size={14} />
              Buat RKH Baru
            </Button>
            <Button
              data-ocid="dashboard.history.secondary_button"
              onClick={() => onNavigate("riwayat")}
              variant="outline"
              className="flex items-center gap-1.5 text-xs px-3 py-2 h-auto border-brand-blue text-brand-blue"
            >
              <History size={14} />
              Lihat Riwayat
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <input
            data-ocid="dashboard.search_input"
            type="text"
            placeholder="Cari laporan (kegiatan, lokasi, sasaran)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-brand-nav">
                Laporan Terbaru
              </h3>
              <span className="text-xs text-brand-muted">
                {recent.length} laporan
              </span>
            </div>

            {isLoading ? (
              <div
                data-ocid="dashboard.reports.loading_state"
                className="flex justify-center py-12"
              >
                <Loader2 className="animate-spin text-brand-green" size={24} />
              </div>
            ) : recent.length === 0 ? (
              <div
                data-ocid="dashboard.reports.empty_state"
                className="text-center py-12"
              >
                <FileText className="mx-auto text-brand-muted mb-3" size={32} />
                <p className="text-sm text-brand-muted">Belum ada laporan</p>
                <button
                  type="button"
                  onClick={() => onNavigate("input-rkh")}
                  className="mt-2 text-sm text-brand-green hover:underline"
                >
                  Buat laporan pertama Anda
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="dashboard.reports.table"
                >
                  <thead className="bg-gray-50 text-xs font-semibold text-brand-muted uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">No</th>
                      <th className="px-4 py-3 text-left">Tanggal</th>
                      <th className="px-4 py-3 text-left">Kegiatan</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        Sasaran
                      </th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        Lokasi
                      </th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">
                        Hasil
                      </th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {recent.map((report, idx) => (
                      <tr
                        key={report.id.toString()}
                        data-ocid={`dashboard.reports.item.${idx + 1}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-brand-muted">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatTanggal(report.tanggal)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="line-clamp-2">
                            {report.kegiatan}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#DFF3E8",
                              color: "#2E7D5B",
                            }}
                          >
                            {report.sasaran}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-brand-muted">
                          {report.lokasi}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="line-clamp-1 text-xs text-brand-muted">
                            {report.hasilKegiatan}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              data-ocid={`dashboard.reports.edit_button.${idx + 1}`}
                              onClick={() => onNavigate("edit-rkh", report)}
                              className="p-1.5 rounded hover:bg-blue-50 text-brand-blue transition-colors"
                              title="Edit"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`dashboard.reports.delete_button.${idx + 1}`}
                              onClick={() => setDeleteTarget(report.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border">
              <h3 className="text-sm font-semibold text-brand-nav">
                Rekap Bulanan — {bulanName} {tahun}
              </h3>
            </div>
            <div className="px-5 py-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-brand-bg">
                <p className="text-2xl font-bold text-brand-green">
                  {thisMonthReports.length}
                </p>
                <p className="text-xs text-brand-muted mt-1">Total Laporan</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-bg">
                <p className="text-2xl font-bold text-brand-blue">
                  {thisMonthReports.reduce(
                    (s, r) => s + Number(r.jumlahSasaran),
                    0,
                  )}
                </p>
                <p className="text-xs text-brand-muted mt-1">Total Sasaran</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-bg">
                <p className="text-2xl font-bold text-amber-600">
                  {new Set(thisMonthReports.map((r) => r.lokasi)).size}
                </p>
                <p className="text-xs text-brand-muted mt-1">Lokasi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div
              className="px-4 py-3 text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
              }}
            >
              Ringkasan Kinerja Saya
            </div>
            <div className="p-4 space-y-4">
              {[
                {
                  label: "Laporan Bulan Ini",
                  value: thisMonthReports.length,
                  max: 26,
                  color: "#2E7D5B",
                },
                {
                  label: "Total Laporan",
                  value: reports.length,
                  max: Math.max(reports.length, 1),
                  color: "#2B4C6F",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-brand-nav font-medium">
                      {item.label}
                    </span>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-brand-border">
                <p className="text-xs text-brand-muted font-medium mb-2">
                  Laporan per Bulan (3 terakhir)
                </p>
                {[0, 1, 2].map((offset) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - offset);
                  const m = String(d.getMonth() + 1).padStart(2, "0");
                  const y = String(d.getFullYear());
                  const count = reports.filter((r) => {
                    const [ry, rm] = r.tanggal.split("-");
                    return rm === m && ry === y;
                  }).length;
                  return (
                    <div
                      key={offset}
                      className="flex justify-between text-xs py-1"
                    >
                      <span className="text-brand-muted">
                        {BULAN_ID[d.getMonth()]?.slice(0, 3)} {y}
                      </span>
                      <span className="font-semibold text-brand-nav">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="dashboard.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Laporan?</AlertDialogTitle>
            <AlertDialogDescription>
              Laporan ini akan dihapus secara permanen. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="dashboard.delete.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="dashboard.delete.confirm_button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
