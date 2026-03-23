import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  FileText,
  Image,
  Loader2,
  Paperclip,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { RKHReport } from "../backend.d";
import { loadConfig } from "../config";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateRKHReport, useUpdateReport } from "../hooks/useQueries";
import type { Page } from "../types";
import { StorageClient } from "../utils/StorageClient";

const MIN_ATTACHMENTS = 2;
const MAX_ATTACHMENTS = 5;

interface InputRKHPageProps {
  onNavigate: (page: Page) => void;
  editReport?: RKHReport | null;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/"))
    return <Image size={18} className="text-blue-500" />;
  if (file.type === "application/pdf")
    return <FileText size={18} className="text-red-500" />;
  return <Paperclip size={18} className="text-gray-500" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function InputRKHPage({
  onNavigate,
  editReport,
}: InputRKHPageProps) {
  const isEditing = !!editReport;
  const createMutation = useCreateRKHReport();
  const updateMutation = useUpdateReport();
  const { identity } = useInternetIdentity();

  const [form, setForm] = useState({
    tanggal: "",
    kegiatan: "",
    sasaran: "",
    jumlahSasaran: "",
    lokasi: "",
    hasilKegiatan: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when editing
  useState(() => {
    if (editReport) {
      setForm({
        tanggal: editReport.tanggal,
        kegiatan: editReport.kegiatan,
        sasaran: editReport.sasaran,
        jumlahSasaran: editReport.jumlahSasaran.toString(),
        lokasi: editReport.lokasi,
        hasilKegiatan: editReport.hasilKegiatan,
        keterangan: editReport.keterangan ?? "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setForm((f) => ({ ...f, tanggal: today ?? "" }));
    }
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.tanggal) e.tanggal = "Tanggal kegiatan wajib diisi";
    if (!form.kegiatan.trim()) e.kegiatan = "Kegiatan wajib diisi";
    if (!form.sasaran.trim()) e.sasaran = "Sasaran wajib diisi";
    if (!form.jumlahSasaran || Number.isNaN(Number(form.jumlahSasaran)))
      e.jumlahSasaran = "Jumlah sasaran wajib diisi (angka)";
    if (!form.lokasi.trim()) e.lokasi = "Lokasi wajib diisi";
    if (!form.hasilKegiatan.trim())
      e.hasilKegiatan = "Hasil kegiatan wajib diisi";
    if (attachedFiles.length > MAX_ATTACHMENTS)
      e.lampiran = `Lampiran maksimal ${MAX_ATTACHMENTS} file.`;
    else if (attachedFiles.length > 0 && attachedFiles.length < MIN_ATTACHMENTS)
      e.lampiran = `Lampiran minimal ${MIN_ATTACHMENTS} file. Saat ini baru ${attachedFiles.length} file.`;
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setAttachedFiles((prev) => {
        const combined = [...prev, ...files].slice(0, MAX_ATTACHMENTS);
        return combined;
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (): Promise<string | undefined> => {
    if (attachedFiles.length === 0) return undefined;
    setIsUploading(true);
    setUploadProgress(new Array(attachedFiles.length).fill(0));
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({
        host: config.backend_host,
        identity: identity ?? undefined,
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const results: { name: string; url: string }[] = [];
      for (let i = 0; i < attachedFiles.length; i++) {
        const file = attachedFiles[i];
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (progress) => {
          setUploadProgress((prev) => {
            const updated = [...prev];
            updated[i] = progress;
            return updated;
          });
        });
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: file.name, url });
      }
      return JSON.stringify(results);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    let lampiranValue: string | undefined;
    try {
      lampiranValue = await uploadAttachments();
    } catch {
      toast.error("Gagal mengunggah lampiran. Silakan coba lagi.");
      return;
    }

    const data = {
      tanggal: form.tanggal,
      kegiatan: form.kegiatan,
      sasaran: form.sasaran,
      jumlahSasaran: BigInt(form.jumlahSasaran),
      lokasi: form.lokasi,
      hasilKegiatan: form.hasilKegiatan,
      keterangan: form.keterangan || undefined,
      lampiran: lampiranValue,
    };
    try {
      if (isEditing && editReport) {
        await updateMutation.mutateAsync({ id: editReport.id, data });
        toast.success("Laporan berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Laporan RKH berhasil disimpan!");
      }
      onNavigate("dashboard");
    } catch {
      toast.error("Gagal menyimpan laporan. Silakan coba lagi.");
    }
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || isUploading;

  const remaining = Math.max(0, MIN_ATTACHMENTS - attachedFiles.length);

  return (
    <div className="bg-white rounded-lg shadow-card">
      <div
        className="px-6 py-4 border-b border-brand-border rounded-t-lg"
        style={{
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
        }}
      >
        <h2 className="text-base font-bold text-white">
          {isEditing ? "Edit Laporan RKH" : "Input Laporan RKH Baru"}
        </h2>
        <p className="text-white/70 text-xs mt-0.5">
          Rencana Kegiatan Harian Penyuluh KB
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <Label
            htmlFor="tanggal"
            className="text-sm font-medium text-brand-nav"
          >
            Tanggal Kegiatan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tanggal"
            type="date"
            data-ocid="rkh_form.tanggal.input"
            className="mt-1 max-w-xs"
            value={form.tanggal}
            onChange={(e) =>
              setForm((f) => ({ ...f, tanggal: e.target.value }))
            }
          />
          {errors.tanggal && (
            <p
              data-ocid="rkh_form.tanggal.error_state"
              className="text-xs text-red-500 mt-1"
            >
              {errors.tanggal}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="kegiatan"
            className="text-sm font-medium text-brand-nav"
          >
            Kegiatan <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="kegiatan"
            data-ocid="rkh_form.kegiatan.textarea"
            className="mt-1"
            rows={3}
            placeholder="Deskripsikan kegiatan yang dilakukan..."
            value={form.kegiatan}
            onChange={(e) =>
              setForm((f) => ({ ...f, kegiatan: e.target.value }))
            }
          />
          {errors.kegiatan && (
            <p
              data-ocid="rkh_form.kegiatan.error_state"
              className="text-xs text-red-500 mt-1"
            >
              {errors.kegiatan}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="sasaran"
              className="text-sm font-medium text-brand-nav"
            >
              Sasaran <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sasaran"
              data-ocid="rkh_form.sasaran.input"
              className="mt-1"
              placeholder="Contoh: PUS, WUS, Remaja"
              value={form.sasaran}
              onChange={(e) =>
                setForm((f) => ({ ...f, sasaran: e.target.value }))
              }
            />
            {errors.sasaran && (
              <p
                data-ocid="rkh_form.sasaran.error_state"
                className="text-xs text-red-500 mt-1"
              >
                {errors.sasaran}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="jumlahSasaran"
              className="text-sm font-medium text-brand-nav"
            >
              Jumlah Sasaran <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jumlahSasaran"
              type="number"
              min="0"
              data-ocid="rkh_form.jumlah_sasaran.input"
              className="mt-1"
              placeholder="0"
              value={form.jumlahSasaran}
              onChange={(e) =>
                setForm((f) => ({ ...f, jumlahSasaran: e.target.value }))
              }
            />
            {errors.jumlahSasaran && (
              <p
                data-ocid="rkh_form.jumlah_sasaran.error_state"
                className="text-xs text-red-500 mt-1"
              >
                {errors.jumlahSasaran}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="lokasi"
            className="text-sm font-medium text-brand-nav"
          >
            Lokasi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lokasi"
            data-ocid="rkh_form.lokasi.input"
            className="mt-1"
            placeholder="Nama desa/kelurahan/kecamatan..."
            value={form.lokasi}
            onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
          />
          {errors.lokasi && (
            <p
              data-ocid="rkh_form.lokasi.error_state"
              className="text-xs text-red-500 mt-1"
            >
              {errors.lokasi}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="hasilKegiatan"
            className="text-sm font-medium text-brand-nav"
          >
            Hasil Kegiatan <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="hasilKegiatan"
            data-ocid="rkh_form.hasil_kegiatan.textarea"
            className="mt-1"
            rows={3}
            placeholder="Deskripsikan hasil yang dicapai..."
            value={form.hasilKegiatan}
            onChange={(e) =>
              setForm((f) => ({ ...f, hasilKegiatan: e.target.value }))
            }
          />
          {errors.hasilKegiatan && (
            <p
              data-ocid="rkh_form.hasil_kegiatan.error_state"
              className="text-xs text-red-500 mt-1"
            >
              {errors.hasilKegiatan}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="keterangan"
            className="text-sm font-medium text-brand-nav"
          >
            Keterangan{" "}
            <span className="text-gray-400 text-xs font-normal">
              (opsional)
            </span>
          </Label>
          <Textarea
            id="keterangan"
            data-ocid="rkh_form.keterangan.textarea"
            className="mt-1"
            rows={2}
            placeholder="Catatan tambahan jika ada..."
            value={form.keterangan}
            onChange={(e) =>
              setForm((f) => ({ ...f, keterangan: e.target.value }))
            }
          />
        </div>

        {/* Lampiran / Attachment - minimal 5 file */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-sm font-medium text-brand-nav">
              Lampiran{" "}
              <span className="text-gray-400 text-xs font-normal">
                (opsional, minimal {MIN_ATTACHMENTS} file jika diisi)
              </span>
            </Label>
            {attachedFiles.length > 0 && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  attachedFiles.length >= MIN_ATTACHMENTS
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {attachedFiles.length}/{MIN_ATTACHMENTS} file
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Unggah minimal {MIN_ATTACHMENTS} file pendukung: gambar, PDF, Word,
            atau format lainnya
          </p>

          {/* File list */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2 mb-3">
              {attachedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 bg-gray-50"
                >
                  <div className="shrink-0">{getFileIcon(file)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    {isUploading && uploadProgress[index] !== undefined && (
                      <div className="mt-1.5">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${uploadProgress[index]}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {uploadProgress[index]}%
                        </p>
                      </div>
                    )}
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                      title="Hapus lampiran"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress indicator */}
          {attachedFiles.length > 0 &&
            attachedFiles.length < MIN_ATTACHMENTS && (
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      step - 1 < attachedFiles.length
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-amber-600 whitespace-nowrap">
                  +{remaining} lagi
                </span>
              </div>
            )}

          {/* Add file button / drop zone */}
          {!isUploading && (
            <label
              htmlFor="lampiran-file"
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors block"
            >
              {attachedFiles.length === 0 ? (
                <>
                  <Upload size={22} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Klik untuk memilih file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tambahkan minimal {MIN_ATTACHMENTS} file (gambar, PDF, Word,
                    dll)
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Plus size={16} />
                  <span className="text-sm font-medium">Tambah file lagi</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="lampiran-file"
                type="file"
                accept="*/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}

          {errors.lampiran && (
            <p className="text-xs text-red-500 mt-1">{errors.lampiran}</p>
          )}

          {attachedFiles.length >= MIN_ATTACHMENTS && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <span>✓</span> {attachedFiles.length} file siap diunggah
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            data-ocid="rkh_form.submit_button"
            disabled={isPending}
            className="text-white font-semibold"
            style={{ backgroundColor: "#2E7D5B" }}
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin mr-2" />
            ) : null}
            {isEditing ? "Perbarui Laporan" : "Simpan Laporan"}
          </Button>
          <Button
            type="button"
            data-ocid="rkh_form.cancel_button"
            variant="outline"
            onClick={() => onNavigate("dashboard")}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
