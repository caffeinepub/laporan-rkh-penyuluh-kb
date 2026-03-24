import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import { FileText, Image, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { RKHReport } from "../backend.d";
import { loadConfig } from "../config";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateRKHReport, useUpdateReport } from "../hooks/useQueries";
import type { Page } from "../types";
import { StorageClient } from "../utils/StorageClient";
import { compressFile } from "../utils/compressFile";

interface InputRKHPageProps {
  onNavigate: (page: Page) => void;
  editReport?: RKHReport | null;
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
  const identityRef = useRef(identity);
  identityRef.current = identity;

  const [form, setForm] = useState(() => {
    if (editReport) {
      return {
        tanggal: editReport.tanggal,
        kegiatan: editReport.kegiatan,
        sasaran: editReport.sasaran,
        jumlahSasaran: editReport.jumlahSasaran.toString(),
        lokasi: editReport.lokasi,
        hasilKegiatan: editReport.hasilKegiatan,
        keterangan: editReport.keterangan ?? "",
      };
    }
    const today = new Date().toISOString().split("T")[0];
    return {
      tanggal: today ?? "",
      kegiatan: "",
      sasaran: "",
      jumlahSasaran: "",
      lokasi: "",
      hasilKegiatan: "",
      keterangan: "",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Two separate file slots: dokumen (PDF) and gambar (image)
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dokumenProgress, setDokumenProgress] = useState(0);
  const [gambarProgress, setGambarProgress] = useState(0);

  const dokumenRef = useRef<HTMLInputElement>(null);
  const gambarRef = useRef<HTMLInputElement>(null);

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
    return e;
  };

  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDokumenFile(file);
    if (dokumenRef.current) dokumenRef.current.value = "";
  };

  const handleGambarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressFile(file);
      setGambarFile(compressed);
    }
    if (gambarRef.current) gambarRef.current.value = "";
  };

  const uploadSingleFile = async (
    file: File,
    storageClient: StorageClient,
    onProgress: (p: number) => void,
  ): Promise<{ name: string; url: string }> => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await storageClient.putFile(bytes, onProgress);
    const url = await storageClient.getDirectURL(hash);
    return { name: file.name, url };
  };

  const uploadAttachments = async (): Promise<string | undefined> => {
    if (!dokumenFile && !gambarFile) return undefined;
    setIsUploading(true);
    setDokumenProgress(0);
    setGambarProgress(0);
    try {
      const config = await loadConfig();
      const currentIdentity = identityRef.current;
      if (!currentIdentity) {
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      }
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

      const results: { name: string; url: string }[] = [];

      if (dokumenFile) {
        const result = await uploadSingleFile(dokumenFile, storageClient, (p) =>
          setDokumenProgress(p),
        );
        results.push({ ...result, type: "dokumen" } as {
          name: string;
          url: string;
          type: string;
        });
      }

      if (gambarFile) {
        const result = await uploadSingleFile(gambarFile, storageClient, (p) =>
          setGambarProgress(p),
        );
        results.push({ ...result, type: "gambar" } as {
          name: string;
          url: string;
          type: string;
        });
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
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengunggah lampiran.";
      toast.error(`${msg} Silakan coba lagi.`);
      return;
    }

    try {
      if (isEditing && editReport) {
        const updatedReport: RKHReport = {
          ...editReport,
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          sasaran: form.sasaran,
          jumlahSasaran: BigInt(form.jumlahSasaran),
          lokasi: form.lokasi,
          hasilKegiatan: form.hasilKegiatan,
          keterangan: form.keterangan || undefined,
          lampiran: lampiranValue ?? editReport.lampiran,
        };
        await updateMutation.mutateAsync(updatedReport);
        toast.success("Laporan berhasil diperbarui!");
      } else {
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
            <p className="text-xs text-red-500 mt-1">{errors.tanggal}</p>
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
            <p className="text-xs text-red-500 mt-1">{errors.kegiatan}</p>
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
              <p className="text-xs text-red-500 mt-1">{errors.sasaran}</p>
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
              <p className="text-xs text-red-500 mt-1">
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
            <p className="text-xs text-red-500 mt-1">{errors.lokasi}</p>
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
            <p className="text-xs text-red-500 mt-1">{errors.hasilKegiatan}</p>
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

        {/* Lampiran -- Dokumen & Gambar terpisah, masing-masing 1 file */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-brand-nav">
            Lampiran{" "}
            <span className="text-gray-400 text-xs font-normal">
              (opsional)
            </span>
          </Label>

          {/* Upload Dokumen (PDF) */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Dokumen / PDF
              </span>
              <span className="text-xs text-gray-400">(maks. 1 file)</span>
            </div>
            {dokumenFile ? (
              <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2">
                <FileText size={16} className="text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">
                    {dokumenFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(dokumenFile.size)}
                  </p>
                  {isUploading && dokumenProgress > 0 && (
                    <div className="mt-1">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${dokumenProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => setDokumenFile(null)}
                    className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ) : (
              <label
                htmlFor="lampiran-dokumen"
                className="flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors"
              >
                <FileText size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Pilih file PDF atau dokumen
                </span>
                <input
                  ref={dokumenRef}
                  id="lampiran-dokumen"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleDokumenChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          {/* Upload Gambar */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Image size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                Gambar / Foto
              </span>
              <span className="text-xs text-gray-400">
                (maks. 1 file, otomatis dikecilkan)
              </span>
            </div>
            {gambarFile ? (
              <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2">
                <Image size={16} className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">
                    {gambarFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(gambarFile.size)}
                    <span className="ml-1 text-green-500">(dikompres)</span>
                  </p>
                  {isUploading && gambarProgress > 0 && (
                    <div className="mt-1">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${gambarProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => setGambarFile(null)}
                    className="shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ) : (
              <label
                htmlFor="lampiran-gambar"
                className="flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
              >
                <Image size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Pilih file gambar / foto
                </span>
                <input
                  ref={gambarRef}
                  id="lampiran-gambar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGambarChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
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
