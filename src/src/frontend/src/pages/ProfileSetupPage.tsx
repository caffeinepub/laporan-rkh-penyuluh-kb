import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

export default function ProfileSetupPage() {
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    unitKerja: "",
    wilayahKerja: "",
    nomorHp: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saveMutation = useSaveProfile();

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
      await saveMutation.mutateAsync(form);
      toast.success("Profil berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan profil. Silakan coba lagi.");
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
  ) => (
    <div>
      <Label htmlFor={key} className="text-sm font-medium text-brand-nav">
        {label} <span className="text-red-500">*</span>
      </Label>
      <Input
        id={key}
        data-ocid={`profile_setup.${key}.input`}
        className="mt-1"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
      {errors[key] && (
        <p
          data-ocid={`profile_setup.${key}.error_state`}
          className="text-xs text-red-500 mt-1"
        >
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <div className="bg-white border-b border-brand-border px-6 py-3 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gradStart to-brand-gradEnd flex items-center justify-center">
          <span className="text-white font-bold text-xs">BKKBN</span>
        </div>
        <h1 className="text-sm font-bold text-brand-nav uppercase tracking-wide">
          Sistem Laporan RKH Penyuluh KB
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-xl shadow-card w-full max-w-lg p-8">
          <h2 className="text-xl font-bold text-brand-nav mb-1">
            Lengkapi Profil Anda
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            Isi data profil Anda untuk melanjutkan ke sistem
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field("nama", "Nama Lengkap", "Masukkan nama lengkap")}
            {field("nip", "NIP", "Masukkan NIP Anda")}
            {field("jabatan", "Jabatan", "Contoh: Penyuluh KB Ahli Pertama")}
            {field("unitKerja", "Unit Kerja", "Contoh: DPPKB Kabupaten ...")}
            {field("wilayahKerja", "Wilayah Kerja", "Contoh: Kecamatan ...")}
            {field("nomorHp", "Nomor HP", "Contoh: 0812xxxxxxxx")}

            <Button
              type="submit"
              data-ocid="profile_setup.submit_button"
              disabled={saveMutation.isPending}
              className="w-full text-white font-semibold mt-2"
              style={{
                background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
              }}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Profil"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
