import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  FileText,
  KeyRound,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAllReports,
  useGetAllUserProfiles,
  useGetAllUserProfilesWithPrincipals,
  useGetAllUserTokens,
  useSetUserToken,
} from "../hooks/useQueries";
import { BULAN_ID, formatTanggal } from "../utils/date";

export default function AdminPage() {
  const { data: profiles = [], isLoading: profilesLoading } =
    useGetAllUserProfiles();
  const { data: reports = [], isLoading: reportsLoading } = useGetAllReports();
  const [activeTab, setActiveTab] = useState("users");

  // Rekap per user
  const userReportCounts = profiles.map((p) => {
    const userReports = reports.filter((r) => r.user.toString() === p.nip);
    return { ...p, count: userReports.length };
  });

  const sortedReports = [...reports].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal),
  );

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div
        className="px-6 py-4 border-b border-brand-border"
        style={{
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)",
        }}
      >
        <h2 className="text-base font-bold text-white">Panel Admin</h2>
        <p className="text-white/70 text-xs mt-0.5">
          Kelola pengguna dan laporan seluruh penyuluh KB
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="mb-4">
          <TabsTrigger
            value="users"
            data-ocid="admin.users.tab"
            className="flex items-center gap-1.5 text-xs"
          >
            <Users size={13} /> Pengguna
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            data-ocid="admin.reports.tab"
            className="flex items-center gap-1.5 text-xs"
          >
            <FileText size={13} /> Semua Laporan
          </TabsTrigger>
          <TabsTrigger
            value="rekap"
            data-ocid="admin.rekap.tab"
            className="flex items-center gap-1.5 text-xs"
          >
            <BarChart3 size={13} /> Rekap
          </TabsTrigger>
          <TabsTrigger
            value="tokens"
            data-ocid="admin.tokens.tab"
            className="flex items-center gap-1.5 text-xs"
          >
            <KeyRound size={13} /> Token Akses
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Users */}
        <TabsContent value="users">
          {profilesLoading ? (
            <div
              data-ocid="admin.users.loading_state"
              className="flex justify-center py-12"
            >
              <Loader2 className="animate-spin text-brand-green" size={24} />
            </div>
          ) : profiles.length === 0 ? (
            <div
              data-ocid="admin.users.empty_state"
              className="text-center py-12"
            >
              <p className="text-sm text-brand-muted">
                Belum ada pengguna terdaftar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="admin.users.table">
                <thead className="bg-gray-50 text-xs font-semibold text-brand-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">NIP</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      Jabatan
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Wilayah Kerja
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      Unit Kerja
                    </th>
                    <th className="px-4 py-3 text-center">Total Laporan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {profiles.map((p, idx) => (
                    <tr
                      key={p.nip}
                      data-ocid={`admin.users.item.${idx + 1}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-brand-muted">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{p.nama}</td>
                      <td className="px-4 py-3 text-brand-muted text-xs">
                        {p.nip}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {p.jabatan}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs">
                        {p.wilayahKerja}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs">
                        {p.unitKerja}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#DFF3E8",
                            color: "#2E7D5B",
                          }}
                        >
                          {
                            reports.filter((r) => r.user.toString() === p.nip)
                              .length
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: All Reports */}
        <TabsContent value="reports">
          {reportsLoading ? (
            <div
              data-ocid="admin.reports.loading_state"
              className="flex justify-center py-12"
            >
              <Loader2 className="animate-spin text-brand-green" size={24} />
            </div>
          ) : sortedReports.length === 0 ? (
            <div
              data-ocid="admin.reports.empty_state"
              className="text-center py-12"
            >
              <p className="text-sm text-brand-muted">Belum ada laporan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="admin.reports.table">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {sortedReports.slice(0, 50).map((r, idx) => (
                    <tr
                      key={r.id.toString()}
                      data-ocid={`admin.reports.item.${idx + 1}`}
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
                      <td className="px-4 py-3 hidden md:table-cell">
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
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-brand-muted">
                        {r.lokasi}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="line-clamp-1 text-xs text-brand-muted">
                          {r.hasilKegiatan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Rekap */}
        <TabsContent value="rekap">
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Pengguna",
                  value: profiles.length,
                  color: "#2B4C6F",
                },
                {
                  label: "Total Laporan",
                  value: reports.length,
                  color: "#2E7D5B",
                },
                {
                  label: "Laporan Bulan Ini",
                  value: reports.filter((r) => {
                    const d = new Date();
                    const m = String(d.getMonth() + 1).padStart(2, "0");
                    const y = String(d.getFullYear());
                    const [ry, rm] = r.tanggal.split("-");
                    return rm === m && ry === y;
                  }).length,
                  color: "#1F8A63",
                },
                {
                  label: "Rata-rata per User",
                  value:
                    profiles.length > 0
                      ? Math.round(reports.length / profiles.length)
                      : 0,
                  color: "#6B7785",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-brand-bg rounded-lg p-4 text-center"
                >
                  <p className="text-2xl font-bold" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-bg rounded-lg p-4">
              <h4 className="text-sm font-semibold text-brand-nav mb-3">
                Laporan per Bulan (Tahun Ini)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {BULAN_ID.slice(0, 12).map((nama, idx) => {
                  const m = String(idx + 1).padStart(2, "0");
                  const y = String(new Date().getFullYear());
                  const count = reports.filter((r) => {
                    const [ry, rm] = r.tanggal.split("-");
                    return rm === m && ry === y;
                  }).length;
                  return (
                    <div
                      key={nama}
                      className="bg-white rounded p-2 text-center shadow-xs"
                    >
                      <p className="text-xs text-brand-muted">
                        {nama.slice(0, 3)}
                      </p>
                      <p className="text-lg font-bold text-brand-green">
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="admin.rekap.table">
                <thead className="bg-gray-50 text-xs font-semibold text-brand-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Nama Penyuluh</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      Jabatan
                    </th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      Wilayah Kerja
                    </th>
                    <th className="px-4 py-3 text-center">Total Laporan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {userReportCounts
                    .sort((a, b) => b.count - a.count)
                    .map((u, idx) => (
                      <tr
                        key={u.nip}
                        data-ocid={`admin.rekap.item.${idx + 1}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-brand-muted">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">{u.nama}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-brand-muted">
                          {u.jabatan}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-brand-muted">
                          {u.wilayahKerja}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: "#DFF3E8",
                              color: "#2E7D5B",
                            }}
                          >
                            {u.count}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tokens">
          <TokenAksesTab
            profiles={profiles}
            profilesLoading={profilesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function TokenAksesTab({
  profiles,
  profilesLoading,
}: {
  profiles: import("../backend.d").UserProfile[];
  profilesLoading: boolean;
}) {
  const {
    data: tokenEntries = [],
    isLoading: tokensLoading,
    refetch,
  } = useGetAllUserTokens();
  const { data: profilesWithPrincipals = [] } =
    useGetAllUserProfilesWithPrincipals();
  const setTokenMutation = useSetUserToken();
  const [editingNip, setEditingNip] = useState<string | null>(null);
  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});

  const handleSave = async (profile: import("../backend.d").UserProfile) => {
    const newToken = tokenInputs[profile.nip] ?? "";
    if (!newToken.trim()) {
      toast.error("Token tidak boleh kosong");
      return;
    }
    // Find principal by NIP using profilesWithPrincipals
    const entry = profilesWithPrincipals.find(
      (e) => e.profile.nip === profile.nip,
    );
    if (!entry) {
      toast.error(
        "Tidak dapat menemukan data pengguna. Pastikan pengguna sudah login minimal sekali.",
      );
      return;
    }
    try {
      await setTokenMutation.mutateAsync({
        user: entry.user,
        token: newToken.trim(),
      });
      toast.success(`Token untuk ${profile.nama} berhasil disimpan`);
      setEditingNip(null);
      refetch();
    } catch {
      toast.error("Gagal menyimpan token");
    }
  };

  if (profilesLoading || tokensLoading) {
    return (
      <div
        data-ocid="admin.tokens.loading_state"
        className="flex justify-center py-12"
      >
        <Loader2 className="animate-spin text-brand-green" size={24} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-brand-muted">
          Kelola token akses unik untuk setiap pengguna. Token digunakan untuk
          verifikasi saat masuk dashboard.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => refetch()}
          data-ocid="admin.tokens.secondary_button"
        >
          <RefreshCw size={12} className="mr-1" /> Refresh
        </Button>
      </div>
      {profiles.length === 0 ? (
        <div data-ocid="admin.tokens.empty_state" className="text-center py-12">
          <p className="text-sm text-brand-muted">
            Belum ada pengguna terdaftar
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="admin.tokens.table">
            <thead className="bg-gray-50 text-xs font-semibold text-brand-muted uppercase">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  NIP
                </th>
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {profiles.map((p, idx) => {
                const isEditing = editingNip === p.nip;
                const principalEntry = profilesWithPrincipals.find(
                  (e) => e.profile.nip === p.nip,
                );
                const currentToken = principalEntry
                  ? tokenEntries.find(
                      (e) =>
                        e.user.toString() === principalEntry.user.toString(),
                    )?.token
                  : undefined;
                return (
                  <tr
                    key={p.nip}
                    data-ocid={`admin.tokens.item.${idx + 1}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-brand-muted">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{p.nama}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-brand-muted">
                      {p.nip}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            data-ocid="admin.tokens.input"
                            className="h-8 text-xs font-mono w-40"
                            value={tokenInputs[p.nip] ?? ""}
                            onChange={(e) =>
                              setTokenInputs((prev) => ({
                                ...prev,
                                [p.nip]: e.target.value,
                              }))
                            }
                            placeholder="Masukkan token"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              const gen = generateToken();
                              setTokenInputs((prev) => ({
                                ...prev,
                                [p.nip]: gen,
                              }));
                            }}
                            data-ocid="admin.tokens.secondary_button"
                            title="Generate token acak"
                          >
                            <RefreshCw size={11} />
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            currentToken
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {currentToken ?? "Belum diatur"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleSave(p)}
                            disabled={setTokenMutation.isPending}
                            data-ocid="admin.tokens.save_button"
                            style={{ background: "#1F8A63", color: "#fff" }}
                          >
                            {setTokenMutation.isPending ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Simpan"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setEditingNip(null)}
                            data-ocid="admin.tokens.cancel_button"
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setEditingNip(p.nip);
                            setTokenInputs((prev) => ({
                              ...prev,
                              [p.nip]: currentToken ?? "",
                            }));
                          }}
                          data-ocid="admin.tokens.edit_button"
                        >
                          <KeyRound size={12} className="mr-1" />
                          Set Token
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
