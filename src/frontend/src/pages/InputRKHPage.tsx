import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RKHReport } from "../backend.d";
import { useCreateRKHReport, useUpdateReport } from "../hooks/useQueries";
import type { Page } from "../types";

interface InputRKHPageProps {
  onNavigate: (page: Page) => void;
  editReport?: RKHReport | null;
}

export default function InputRKHPage({
  onNavigate,
  editReport,
}: InputRKHPageProps) {
  const isEditing = !!editReport;
  const createMutation = useCreateRKHReport();
  const updateMutation = useUpdateReport();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
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
          lampiran: editReport.lampiran,
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
          lampiran: undefined,
        };
        await createMutation.mutateAsync(data);
        toast.success("Laporan RKH berhasil disimpan!");
      }
      onNavigate("dashboard");
    } catch {
      toast.error("Gagal menyimpan laporan. Silakan coba lagi.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

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
