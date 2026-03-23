import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { useGetAllReports, useGetAllUserProfiles } from "../hooks/useQueries";
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
      </Tabs>
    </div>
  );
}
