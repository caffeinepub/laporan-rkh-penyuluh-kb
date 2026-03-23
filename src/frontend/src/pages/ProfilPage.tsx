import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PenLine, Trash2, Upload, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetCallerUserProfile,
  useUpdateMyProfile,
} from "../hooks/useQueries";

export default function ProfilPage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateMutation = useUpdateMyProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    unitKerja: "",
    wilayahKerja: "",
    nomorHp: "",
    tandaTangan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setForm({
        nama: profile.nama,
        nip: profile.nip,
        jabatan: profile.jabatan,
        unitKerja: profile.unitKerja,
        wilayahKerja: profile.wilayahKerja,
        nomorHp: profile.nomorHp,
        tandaTangan: profile.tandaTangan ?? "",
      });
    }
  }, [profile]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama lengkap wajib diisi";
    if (!form.nip.trim()) e.nip = "NIP wajib diisi";
    if (!form.jabatan.trim()) e.jabatan = "Jabatan wajib diisi";
    if (!form.unitKerja.trim()) e.unitKerja = "Unit Kerja wajib diisi";
    if (!form.wilayahKerja.trim()) e.wilayahKerja = "Wilayah Kerja wajib diisi";
    if (!form.nomorHp.trim()) e.nomorHp = "Nomor HP wajib diisi";
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm((f) => ({ ...f, tandaTangan: result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await updateMutation.mutateAsync({
        nama: form.nama,
        nip: form.nip,
        jabatan: form.jabatan,
        unitKerja: form.unitKerja,
        wilayahKerja: form.wilayahKerja,
        nomorHp: form.nomorHp,
        tandaTangan: form.tandaTangan || undefined,
      });
      toast.success("Profil berhasil diperbarui!");
    } catch {
      toast.error("Gagal memperbarui profil.");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="profil.loading_state"
        className="flex justify-center py-20"
      >
        <Loader2 className="animate-spin text-brand-green" size={28} />
      </div>
    );
  }

  const fieldDef = [
    {
      key: "nama",
      label: "Nama Lengkap",
      placeholder: "Masukkan nama lengkap",
    },
    { key: "nip", label: "NIP", placeholder: "Masukkan NIP" },
    {
      key: "jabatan",
      label: "Jabatan",
      placeholder: "Contoh: Penyuluh KB Ahli Pertama",
    },
    {
      key: "unitKerja",
      label: "Unit Kerja",
      placeholder: "Contoh: DPPKB Kabupaten ...",
    },
    {
      key: "wilayahKerja",
      label: "Wilayah Kerja",
      placeholder: "Contoh: Kecamatan ...",
    },
    { key: "nomorHp", label: "Nomor HP", placeholder: "Contoh: 0812xxxxxxxx" },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-card">
      <div
        className="px-6 py-4 border-b border-brand-border rounded-t-lg"
        style={{
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Profil Saya</h2>
            <p className="text-white/70 text-xs">
              Kelola informasi profil Anda
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fieldDef.map(({ key, label, placeholder }) => (
            <div key={key}>
              <Label
                htmlFor={key}
                className="text-sm font-medium text-brand-nav"
              >
                {label} <span className="text-red-500">*</span>
              </Label>
              <Input
                id={key}
                data-ocid={`profil.${key}.input`}
                className="mt-1"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
              {errors[key] && (
                <p
                  data-ocid={`profil.${key}.error_state`}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Tanda Tangan Section */}
        <div className="mt-6 border border-brand-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <PenLine size={16} className="text-brand-green" />
            <Label className="text-sm font-semibold text-brand-nav">
              Tanda Tangan
            </Label>
          </div>

          {form.tandaTangan ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                style={{
                  background: "#000",
                  border: "2px solid #333",
                  borderRadius: "6px",
                  padding: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "160px",
                  minHeight: "80px",
                }}
              >
                <img
                  src={form.tandaTangan}
                  alt="Tanda Tangan"
                  style={{
                    maxWidth: "140px",
                    maxHeight: "64px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-brand-muted">
                  Tanda tangan berhasil diunggah
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    data-ocid="profil.tanda_tangan.upload_button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} className="mr-1" />
                    Ganti
                  </Button>
                  <Button
                    type="button"
                    data-ocid="profil.tanda_tangan.delete_button"
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setForm((f) => ({ ...f, tandaTangan: "" }))}
                  >
                    <Trash2 size={13} className="mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <div
                style={{
                  background: "#f9fafb",
                  border: "2px dashed #ccc",
                  borderRadius: "6px",
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "160px",
                  minHeight: "80px",
                  color: "#aaa",
                  fontSize: "12px",
                }}
              >
                Belum ada tanda tangan
              </div>
              <Button
                type="button"
                data-ocid="profil.tanda_tangan.upload_button"
                variant="outline"
                size="sm"
                className="text-xs mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={13} className="mr-1" />
                Upload Tanda Tangan
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-brand-muted mt-2">
            Format: JPG, PNG, atau GIF. Disarankan menggunakan tanda tangan
            dengan latar belakang transparan atau putih.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="submit"
            data-ocid="profil.save.primary_button"
            disabled={updateMutation.isPending}
            className="text-white font-semibold"
            style={{ backgroundColor: "#2E7D5B" }}
          >
            {updateMutation.isPending ? (
              <Loader2 size={15} className="animate-spin mr-2" />
            ) : null}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
