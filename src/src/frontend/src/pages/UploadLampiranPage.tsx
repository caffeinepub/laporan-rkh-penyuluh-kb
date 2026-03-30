import { Button } from "@/components/ui/button";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  CheckCircle2,
  FileText,
  GitMerge,
  Image,
  Loader2,
  Paperclip,
  UploadCloud,
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

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface RowState {
  // Step 1: file selection
  dokumenFile: File | null;
  gambarFile: File | null;
  // Step 1: uploading individual files
  uploadingDokumen: boolean;
  uploadingGambar: boolean;
  dokumenProgress: number;
  gambarProgress: number;
  // Step 2: uploaded results (ready to merge)
  uploadedDokumen: UploadedFile | null;
  uploadedGambar: UploadedFile | null;
  // Step 2: merging
  isMerging: boolean;
}

const emptyRowState = (): RowState => ({
  dokumenFile: null,
  gambarFile: null,
  uploadingDokumen: false,
  uploadingGambar: false,
  dokumenProgress: 0,
  gambarProgress: 0,
  uploadedDokumen: null,
  uploadedGambar: null,
  isMerging: false,
});

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

  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [rowState, setRowState] = useState<RowState>(emptyRowState());

  const dokumenRef = useRef<HTMLInputElement>(null);
  const gambarRef = useRef<HTMLInputElement>(null);

  const handleOpenRow = (reportId: bigint) => {
    if (expandedId === reportId) {
      setExpandedId(null);
    } else {
      setExpandedId(reportId);
      setRowState(emptyRowState());
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

  const makeStorageClient = async () => {
    const config = await loadConfig();
    const currentIdentity = identityRef.current;
    if (!currentIdentity)
      throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
    const agent = new HttpAgent({
      host: config.backend_host,
      identity: currentIdentity,
    });
    return new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );
  };

  // Step 1a: Upload dokumen only
  const handleUploadDokumen = async () => {
    if (!rowState.dokumenFile) return;
    setRowState((s) => ({
      ...s,
      uploadingDokumen: true,
      dokumenProgress: 0,
    }));
    try {
      const storageClient = await makeStorageClient();
      const bytes = new Uint8Array(await rowState.dokumenFile.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (p) =>
        setRowState((s) => ({ ...s, dokumenProgress: p })),
      );
      const url = await storageClient.getDirectURL(hash);
      setRowState((s) => ({
        ...s,
        uploadedDokumen: {
          name: s.dokumenFile!.name,
          url,
          type: "dokumen",
          size: s.dokumenFile!.size,
        },
        dokumenFile: null,
        uploadingDokumen: false,
      }));
      toast.success("Dokumen berhasil diunggah!");
    } catch (err) {
      console.error("Upload dokumen error:", err);
      const msg =
        err instanceof Error ? err.message : "Gagal mengunggah dokumen.";
      toast.error(msg);
      setRowState((s) => ({ ...s, uploadingDokumen: false }));
    }
  };

  // Step 1b: Upload gambar only
  const handleUploadGambar = async () => {
    if (!rowState.gambarFile) return;
    setRowState((s) => ({
      ...s,
      uploadingGambar: true,
      gambarProgress: 0,
    }));
    try {
      const storageClient = await makeStorageClient();
      const bytes = new Uint8Array(await rowState.gambarFile.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (p) =>
        setRowState((s) => ({ ...s, gambarProgress: p })),
      );
      const url = await storageClient.getDirectURL(hash);
      setRowState((s) => ({
        ...s,
        uploadedGambar: {
          name: s.gambarFile!.name,
          url,
          type: "gambar",
          size: s.gambarFile!.size,
        },
        gambarFile: null,
        uploadingGambar: false,
      }));
      toast.success("Gambar berhasil diunggah!");
    } catch (err) {
      console.error("Upload gambar error:", err);
      const msg =
        err instanceof Error ? err.message : "Gagal mengunggah gambar.";
      toast.error(msg);
      setRowState((s) => ({ ...s, uploadingGambar: false }));
    }
  };

  // Step 2: Merge uploaded files with report (lightweight -- no file transfer)
  const handleMerge = async (report: RKHReport) => {
    const { uploadedDokumen, uploadedGambar } = rowState;
    if (!uploadedDokumen && !uploadedGambar) {
      toast.error("Upload minimal satu file terlebih dahulu.");
      return;
    }
    setRowState((s) => ({ ...s, isMerging: true }));
    try {
      const results: { name: string; url: string; type: string }[] = [];
      if (uploadedDokumen)
        results.push({
          name: uploadedDokumen.name,
          url: uploadedDokumen.url,
          type: "dokumen",
        });
      if (uploadedGambar)
        results.push({
          name: uploadedGambar.name,
          url: uploadedGambar.url,
          type: "gambar",
        });
      const lampiranStr = JSON.stringify(results);
      const updatedReport: RKHReport = { ...report, lampiran: lampiranStr };
      await updateMutation.mutateAsync(updatedReport);
      toast.success("Lampiran berhasil digabungkan ke laporan!");
      setExpandedId(null);
    } catch (err) {
      console.error("Merge error:", err);
      const msg =
        err instanceof Error ? err.message : "Gagal menggabungkan lampiran.";
      toast.error(msg);
      setRowState((s) => ({ ...s, isMerging: false }));
    }
  };

  const hasLampiran = (report: RKHReport) => !!report.lampiran;
  const hasUploaded = rowState.uploadedDokumen || rowState.uploadedGambar;
  const isAnyUploading = rowState.uploadingDokumen || rowState.uploadingGambar;

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
          Upload file terlebih dahulu, lalu gabungkan ke laporan
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
                        {expandedId === report.id ? "Tutup" : "Upload"}
                      </Button>
                    </td>
                  </tr>

                  {/* Expanded panel -- two separate steps */}
                  {expandedId === report.id && (
                    <tr key={`upload-${report.id.toString()}`}>
                      <td colSpan={5} className="px-4 pb-4 bg-green-50/20">
                        <div className="border border-green-200 rounded-lg p-4 space-y-4 mt-1">
                          <p className="text-xs font-semibold text-gray-600">
                            Laporan:{" "}
                            <span className="text-green-700">
                              {report.tanggal}
                            </span>
                          </p>

                          {/* ── STEP 1: Upload files independently ── */}
                          <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                              Langkah 1 — Upload File
                            </p>

                            {/* Dokumen */}
                            <div className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-red-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Dokumen / PDF
                                </span>
                              </div>

                              {rowState.uploadedDokumen ? (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                                  <CheckCircle2
                                    size={14}
                                    className="text-green-600 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-700 truncate font-medium">
                                      {rowState.uploadedDokumen.name}
                                    </p>
                                    <p className="text-xs text-green-600">
                                      Terupload —{" "}
                                      {formatFileSize(
                                        rowState.uploadedDokumen.size,
                                      )}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRowState((s) => ({
                                        ...s,
                                        uploadedDokumen: null,
                                      }))
                                    }
                                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ) : rowState.dokumenFile ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 min-w-0 bg-gray-50 rounded-md px-3 py-2">
                                    <p className="text-xs text-gray-700 truncate">
                                      {rowState.dokumenFile.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatFileSize(
                                        rowState.dokumenFile.size,
                                      )}
                                    </p>
                                    {rowState.uploadingDokumen &&
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
                                  <Button
                                    size="sm"
                                    disabled={rowState.uploadingDokumen}
                                    onClick={handleUploadDokumen}
                                    className="text-white text-xs shrink-0"
                                    style={{ backgroundColor: "#2E7D5B" }}
                                  >
                                    {rowState.uploadingDokumen ? (
                                      <Loader2
                                        size={12}
                                        className="animate-spin mr-1"
                                      />
                                    ) : (
                                      <UploadCloud size={12} className="mr-1" />
                                    )}
                                    {rowState.uploadingDokumen
                                      ? "Uploading..."
                                      : "Upload"}
                                  </Button>
                                  {!rowState.uploadingDokumen && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRowState((s) => ({
                                          ...s,
                                          dokumenFile: null,
                                        }))
                                      }
                                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                                    >
                                      <X size={13} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <label
                                  htmlFor={`dok-${report.id.toString()}`}
                                  className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors"
                                >
                                  <FileText
                                    size={14}
                                    className="text-gray-400"
                                  />
                                  <span className="text-sm text-gray-500">
                                    Pilih file PDF / dokumen
                                  </span>
                                  <input
                                    ref={dokumenRef}
                                    id={`dok-${report.id.toString()}`}
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    onChange={handleDokumenChange}
                                    disabled={isAnyUploading}
                                  />
                                </label>
                              )}
                            </div>

                            {/* Gambar */}
                            <div className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex items-center gap-2 mb-2">
                                <Image size={14} className="text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Gambar / Foto
                                </span>
                                <span className="text-xs text-gray-400">
                                  (otomatis dikecilkan)
                                </span>
                              </div>

                              {rowState.uploadedGambar ? (
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                                  <CheckCircle2
                                    size={14}
                                    className="text-blue-600 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-700 truncate font-medium">
                                      {rowState.uploadedGambar.name}
                                    </p>
                                    <p className="text-xs text-blue-600">
                                      Terupload —{" "}
                                      {formatFileSize(
                                        rowState.uploadedGambar.size,
                                      )}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRowState((s) => ({
                                        ...s,
                                        uploadedGambar: null,
                                      }))
                                    }
                                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ) : rowState.gambarFile ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 min-w-0 bg-gray-50 rounded-md px-3 py-2">
                                    <p className="text-xs text-gray-700 truncate">
                                      {rowState.gambarFile.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatFileSize(rowState.gambarFile.size)}
                                      <span className="ml-1 text-green-500">
                                        (dikompres)
                                      </span>
                                    </p>
                                    {rowState.uploadingGambar &&
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
                                  <Button
                                    size="sm"
                                    disabled={rowState.uploadingGambar}
                                    onClick={handleUploadGambar}
                                    className="text-xs shrink-0"
                                    style={{
                                      backgroundColor: "#1D6FA4",
                                      color: "white",
                                    }}
                                  >
                                    {rowState.uploadingGambar ? (
                                      <Loader2
                                        size={12}
                                        className="animate-spin mr-1"
                                      />
                                    ) : (
                                      <UploadCloud size={12} className="mr-1" />
                                    )}
                                    {rowState.uploadingGambar
                                      ? "Uploading..."
                                      : "Upload"}
                                  </Button>
                                  {!rowState.uploadingGambar && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRowState((s) => ({
                                          ...s,
                                          gambarFile: null,
                                        }))
                                      }
                                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                                    >
                                      <X size={13} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <label
                                  htmlFor={`img-${report.id.toString()}`}
                                  className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                                >
                                  <Image size={14} className="text-gray-400" />
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
                                    disabled={isAnyUploading}
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* ── STEP 2: Merge into report ── */}
                          <div
                            className={`border rounded-lg p-3 transition-all ${
                              hasUploaded
                                ? "border-green-300 bg-green-50/40"
                                : "border-gray-200 bg-gray-50/40 opacity-50"
                            }`}
                          >
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                              Langkah 2 — Gabungkan ke Laporan
                            </p>
                            {hasUploaded ? (
                              <div className="space-y-1 mb-3">
                                {rowState.uploadedDokumen && (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <CheckCircle2
                                      size={12}
                                      className="text-green-500"
                                    />
                                    Dokumen siap:{" "}
                                    {rowState.uploadedDokumen.name}
                                  </div>
                                )}
                                {rowState.uploadedGambar && (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <CheckCircle2
                                      size={12}
                                      className="text-blue-500"
                                    />
                                    Gambar siap: {rowState.uploadedGambar.name}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mb-3">
                                Upload minimal satu file di atas dulu.
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                data-ocid="upload_lampiran.merge_button"
                                disabled={!hasUploaded || rowState.isMerging}
                                onClick={() => handleMerge(report)}
                                className="text-white text-xs font-semibold"
                                style={{ backgroundColor: "#2E7D5B" }}
                              >
                                {rowState.isMerging ? (
                                  <Loader2
                                    size={12}
                                    className="animate-spin mr-1.5"
                                  />
                                ) : (
                                  <GitMerge size={12} className="mr-1.5" />
                                )}
                                {rowState.isMerging
                                  ? "Menggabungkan..."
                                  : "Gabungkan ke Laporan"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                data-ocid="upload_lampiran.cancel_button"
                                onClick={() => setExpandedId(null)}
                                disabled={isAnyUploading || rowState.isMerging}
                                className="text-xs"
                              >
                                Batal
                              </Button>
                            </div>
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
