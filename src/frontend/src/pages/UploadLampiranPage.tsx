import { Button } from "@/components/ui/button";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  CheckCircle2,
  FileText,
  Image,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { RKHReport } from "../backend.d";
import { loadConfig } from "../config";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryRKHReports, useUpdateReport } from "../hooks/useQueries";
import type { Page } from "../types";
import { StorageClient } from "../utils/StorageClient";
import { compressFile } from "../utils/compressFile";

interface UploadLampiranPageProps {
  onNavigate: (page: Page) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MONTHS = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) =>
  (currentYear - 2 + i).toString(),
);

interface RowUploadState {
  dokumenFile: File | null;
  gambarFile: File | null;
  isUploading: boolean;
  dokumenProgress: number;
  gambarProgress: number;
}

export default function UploadLampiranPage({
  onNavigate: _onNavigate,
}: UploadLampiranPageProps) {
  const { identity } = useInternetIdentity();
  const identityRef = useRef(identity);
  identityRef.current = identity;

  const now = new Date();
  const [bulan, setBulan] = useState(
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  const [tahun, setTahun] = useState(String(now.getFullYear()));

  const { data: reports = [], isLoading } = useQueryRKHReports({
    bulan,
    tahun,
  });
  const updateMutation = useUpdateReport();

  // Which row is expanded for upload
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  // Per-row upload state
  const [rowState, setRowState] = useState<RowUploadState>({
    dokumenFile: null,
    gambarFile: null,
    isUploading: false,
    dokumenProgress: 0,
    gambarProgress: 0,
  });

  const dokumenRef = useRef<HTMLInputElement>(null);
  const gambarRef = useRef<HTMLInputElement>(null);

  const handleOpenRow = (reportId: bigint) => {
    if (expandedId === reportId) {
      setExpandedId(null);
    } else {
      setExpandedId(reportId);
      setRowState({
        dokumenFile: null,
        gambarFile: null,
        isUploading: false,
        dokumenProgress: 0,
        gambarProgress: 0,
      });
    }
  };

  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setRowState((s) => ({ ...s, dokumenFile: file }));
    if (dokumenRef.current) dokumenRef.current.value = "";
  };

  const handleGambarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressFile(file);
      setRowState((s) => ({ ...s, gambarFile: compressed }));
    }
    if (gambarRef.current) gambarRef.current.value = "";
  };

  const handleUpload = async (report: RKHReport) => {
    if (!rowState.dokumenFile && !rowState.gambarFile) {
      toast.error("Pilih minimal satu file untuk diunggah.");
      return;
    }
    setRowState((s) => ({
      ...s,
      isUploading: true,
      dokumenProgress: 0,
      gambarProgress: 0,
    }));
    try {
      const config = await loadConfig();
      const currentIdentity = identityRef.current;
      if (!currentIdentity)
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");

      const agent = new HttpAgent({
        host: config.backend_host,
        identity: currentIdentity,
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const results: { name: string; url: string; type: string }[] = [];

      if (rowState.dokumenFile) {
        const bytes = new Uint8Array(await rowState.dokumenFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (p) =>
          setRowState((s) => ({ ...s, dokumenProgress: p })),
        );
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: rowState.dokumenFile.name, url, type: "dokumen" });
      }

      if (rowState.gambarFile) {
        const bytes = new Uint8Array(await rowState.gambarFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (p) =>
          setRowState((s) => ({ ...s, gambarProgress: p })),
        );
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: rowState.gambarFile.name, url, type: "gambar" });
      }

      const lampiranStr = JSON.stringify(results);
      const updatedReport: RKHReport = { ...report, lampiran: lampiranStr };
      await updateMutation.mutateAsync(updatedReport);
      toast.success("Lampiran berhasil disimpan!");
      setExpandedId(null);
    } catch (err) {
      console.error("Upload lampiran error:", err);
      const msg =
        err instanceof Error ? err.message : "Gagal mengunggah lampiran.";
      toast.error(`${msg} Silakan coba lagi.`);
    } finally {
      setRowState((s) => ({ ...s, isUploading: false }));
    }
  };

  const hasLampiran = (report: RKHReport) => !!report.lampiran;

  return (
    <div className="bg-white rounded-lg shadow-card">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-brand-border rounded-t-lg"
        style={{
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Paperclip size={18} className="text-white" />
          <h2 className="text-base font-bold text-white">Upload Lampiran</h2>
        </div>
        <p className="text-white/70 text-xs mt-0.5">
          Upload dokumen dan foto untuk setiap laporan RKH
        </p>
      </div>

      {/* Filter */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-bulan"
            className="text-xs font-medium text-gray-600"
          >
            Bulan:
          </label>
          <select
            id="filter-bulan"
            data-ocid="upload_lampiran.bulan.select"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-tahun"
            className="text-xs font-medium text-gray-600"
          >
            Tahun:
          </label>
          <select
            id="filter-tahun"
            data-ocid="upload_lampiran.tahun.select"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400 ml-auto">
          {reports.length} laporan ditemukan
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div
            data-ocid="upload_lampiran.loading_state"
            className="flex items-center justify-center py-12 text-gray-400"
          >
            <Loader2 size={20} className="animate-spin mr-2" />
            <span className="text-sm">Memuat laporan...</span>
          </div>
        ) : reports.length === 0 ? (
          <div
            data-ocid="upload_lampiran.empty_state"
            className="text-center py-12 text-gray-400"
          >
            <Paperclip size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada laporan untuk periode ini</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 w-10">
                  No
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                  Kegiatan
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">
                  Status Lampiran
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <>
                  <tr
                    key={report.id.toString()}
                    data-ocid={`upload_lampiran.row.item.${idx + 1}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {report.tanggal}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      <p className="truncate" title={report.kegiatan}>
                        {report.kegiatan}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasLampiran(report) ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 font-medium">
                          <CheckCircle2 size={11} />
                          Ada
                        </span>
                      ) : (
                        <span className="inline-block text-xs bg-gray-100 text-gray-400 rounded-full px-2.5 py-0.5">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant={
                          expandedId === report.id ? "secondary" : "outline"
                        }
                        data-ocid={`upload_lampiran.upload_button.${idx + 1}`}
                        onClick={() => handleOpenRow(report.id)}
                        className="text-xs h-7 px-3"
                      >
                        {expandedId === report.id ? "Tutup" : "Upload Lampiran"}
                      </Button>
                    </td>
                  </tr>

                  {/* Expanded upload panel */}
                  {expandedId === report.id && (
                    <tr key={`upload-${report.id.toString()}`}>
                      <td colSpan={5} className="px-4 pb-4 bg-green-50/30">
                        <div className="border border-green-200 rounded-lg p-4 space-y-3">
                          <p className="text-xs font-semibold text-gray-600 mb-3">
                            Upload lampiran untuk laporan tanggal{" "}
                            <span className="text-green-700">
                              {report.tanggal}
                            </span>
                          </p>

                          {/* Dokumen */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText size={15} className="text-red-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Dokumen / PDF
                              </span>
                              <span className="text-xs text-gray-400">
                                (maks. 1 file)
                              </span>
                            </div>
                            {rowState.dokumenFile ? (
                              <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2">
                                <FileText
                                  size={15}
                                  className="text-red-500 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-700 truncate">
                                    {rowState.dokumenFile.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatFileSize(rowState.dokumenFile.size)}
                                  </p>
                                  {rowState.isUploading &&
                                    rowState.dokumenProgress > 0 && (
                                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-green-500 rounded-full transition-all"
                                          style={{
                                            width: `${rowState.dokumenProgress}%`,
                                          }}
                                        />
                                      </div>
                                    )}
                                </div>
                                {!rowState.isUploading && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRowState((s) => ({
                                        ...s,
                                        dokumenFile: null,
                                      }))
                                    }
                                    className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor={`dok-${report.id.toString()}`}
                                className="flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors"
                              >
                                <FileText size={15} className="text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Pilih file PDF atau dokumen
                                </span>
                                <input
                                  ref={dokumenRef}
                                  id={`dok-${report.id.toString()}`}
                                  type="file"
                                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  className="hidden"
                                  onChange={handleDokumenChange}
                                  disabled={rowState.isUploading}
                                />
                              </label>
                            )}
                          </div>

                          {/* Gambar */}
                          <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                              <Image size={15} className="text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Gambar / Foto
                              </span>
                              <span className="text-xs text-gray-400">
                                (maks. 1 file, otomatis dikecilkan)
                              </span>
                            </div>
                            {rowState.gambarFile ? (
                              <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2">
                                <Image
                                  size={15}
                                  className="text-blue-500 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-700 truncate">
                                    {rowState.gambarFile.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatFileSize(rowState.gambarFile.size)}
                                    <span className="ml-1 text-green-500">
                                      (dikompres)
                                    </span>
                                  </p>
                                  {rowState.isUploading &&
                                    rowState.gambarProgress > 0 && (
                                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-blue-500 rounded-full transition-all"
                                          style={{
                                            width: `${rowState.gambarProgress}%`,
                                          }}
                                        />
                                      </div>
                                    )}
                                </div>
                                {!rowState.isUploading && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRowState((s) => ({
                                        ...s,
                                        gambarFile: null,
                                      }))
                                    }
                                    className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <label
                                htmlFor={`img-${report.id.toString()}`}
                                className="flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                              >
                                <Image size={15} className="text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Pilih file gambar / foto
                                </span>
                                <input
                                  ref={gambarRef}
                                  id={`img-${report.id.toString()}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleGambarChange}
                                  disabled={rowState.isUploading}
                                />
                              </label>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              data-ocid="upload_lampiran.submit_button"
                              disabled={
                                rowState.isUploading ||
                                (!rowState.dokumenFile && !rowState.gambarFile)
                              }
                              onClick={() => handleUpload(report)}
                              className="text-white text-xs font-semibold"
                              style={{ backgroundColor: "#2E7D5B" }}
                            >
                              {rowState.isUploading ? (
                                <Loader2
                                  size={13}
                                  className="animate-spin mr-1.5"
                                />
                              ) : null}
                              {rowState.isUploading
                                ? "Mengunggah..."
                                : "Simpan Lampiran"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid="upload_lampiran.cancel_button"
                              onClick={() => setExpandedId(null)}
                              disabled={rowState.isUploading}
                              className="text-xs"
                            >
                              Batal
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
