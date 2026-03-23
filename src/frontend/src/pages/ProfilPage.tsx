import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetCallerUserProfile,
  useUpdateMyProfile,
} from "../hooks/useQueries";

export default function ProfilPage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateMutation = useUpdateMyProfile();

  const [form, setForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    unitKerja: "",
    wilayahKerja: "",
    nomorHp: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await updateMutation.mutateAsync(form);
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
