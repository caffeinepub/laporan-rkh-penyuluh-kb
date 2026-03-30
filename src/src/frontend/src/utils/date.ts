export const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatTanggal(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  const month = BULAN_ID[Number.parseInt(m, 10) - 1] ?? m;
  return `${Number.parseInt(d, 10)} ${month} ${y}`;
}

export function getCurrentMonthYear() {
  const now = new Date();
  return {
    bulan: String(now.getMonth() + 1).padStart(2, "0"),
    tahun: String(now.getFullYear()),
  };
}

export function formatMonthYear(bulan: string, tahun: string): string {
  const idx = Number.parseInt(bulan, 10) - 1;
  return `${BULAN_ID[idx] ?? bulan} ${tahun}`;
}
