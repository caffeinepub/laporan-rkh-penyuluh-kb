import { c as createLucideIcon, D as useInternetIdentity, r as reactExports, o as useQueryRKHReports, m as useUpdateReport, j as jsxRuntimeExports, p as Paperclip, g as LoaderCircle, B as Button, h as ue, E as loadConfig, F as HttpAgent, S as StorageClient } from "./index-CnmjN4dY.js";
import { F as FileText } from "./file-text-B9cnb-4I.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
async function compressFile(file) {
  if (!file.type.startsWith("image/")) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX_DIM = 1200;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) {
          height = Math.round(height * MAX_DIM / width);
          width = MAX_DIM;
        } else {
          width = Math.round(width * MAX_DIM / height);
          height = MAX_DIM;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const quality = outputType === "image/jpeg" ? 0.75 : void 0;
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const ext = outputType === "image/jpeg" ? "jpg" : "png";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const compressed = new File([blob], `${baseName}.${ext}`, {
            type: outputType,
            lastModified: Date.now()
          });
          resolve(compressed);
        },
        outputType,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}
function formatFileSize(bytes) {
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
  { value: "12", label: "Desember" }
];
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const YEARS = Array.from(
  { length: 5 },
  (_, i) => (currentYear - 2 + i).toString()
);
function UploadLampiranPage({
  onNavigate: _onNavigate
}) {
  const { identity } = useInternetIdentity();
  const identityRef = reactExports.useRef(identity);
  identityRef.current = identity;
  const now = /* @__PURE__ */ new Date();
  const [bulan, setBulan] = reactExports.useState(
    String(now.getMonth() + 1).padStart(2, "0")
  );
  const [tahun, setTahun] = reactExports.useState(String(now.getFullYear()));
  const { data: reports = [], isLoading } = useQueryRKHReports({
    bulan,
    tahun
  });
  const updateMutation = useUpdateReport();
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [rowState, setRowState] = reactExports.useState({
    dokumenFile: null,
    gambarFile: null,
    isUploading: false,
    dokumenProgress: 0,
    gambarProgress: 0
  });
  const dokumenRef = reactExports.useRef(null);
  const gambarRef = reactExports.useRef(null);
  const handleOpenRow = (reportId) => {
    if (expandedId === reportId) {
      setExpandedId(null);
    } else {
      setExpandedId(reportId);
      setRowState({
        dokumenFile: null,
        gambarFile: null,
        isUploading: false,
        dokumenProgress: 0,
        gambarProgress: 0
      });
    }
  };
  const handleDokumenChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) setRowState((s) => ({ ...s, dokumenFile: file }));
    if (dokumenRef.current) dokumenRef.current.value = "";
  };
  const handleGambarChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      const compressed = await compressFile(file);
      setRowState((s) => ({ ...s, gambarFile: compressed }));
    }
    if (gambarRef.current) gambarRef.current.value = "";
  };
  const handleUpload = async (report) => {
    if (!rowState.dokumenFile && !rowState.gambarFile) {
      ue.error("Pilih minimal satu file untuk diunggah.");
      return;
    }
    setRowState((s) => ({
      ...s,
      isUploading: true,
      dokumenProgress: 0,
      gambarProgress: 0
    }));
    try {
      const config = await loadConfig();
      const currentIdentity = identityRef.current;
      if (!currentIdentity)
        throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      const agent = new HttpAgent({
        host: config.backend_host,
        identity: currentIdentity
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
      const results = [];
      if (rowState.dokumenFile) {
        const bytes = new Uint8Array(await rowState.dokumenFile.arrayBuffer());
        const { hash } = await storageClient.putFile(
          bytes,
          (p) => setRowState((s) => ({ ...s, dokumenProgress: p }))
        );
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: rowState.dokumenFile.name, url, type: "dokumen" });
      }
      if (rowState.gambarFile) {
        const bytes = new Uint8Array(await rowState.gambarFile.arrayBuffer());
        const { hash } = await storageClient.putFile(
          bytes,
          (p) => setRowState((s) => ({ ...s, gambarProgress: p }))
        );
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: rowState.gambarFile.name, url, type: "gambar" });
      }
      const lampiranStr = JSON.stringify(results);
      const updatedReport = { ...report, lampiran: lampiranStr };
      await updateMutation.mutateAsync(updatedReport);
      ue.success("Lampiran berhasil disimpan!");
      setExpandedId(null);
    } catch (err) {
      console.error("Upload lampiran error:", err);
      const msg = err instanceof Error ? err.message : "Gagal mengunggah lampiran.";
      ue.error(`${msg} Silakan coba lagi.`);
    } finally {
      setRowState((s) => ({ ...s, isUploading: false }));
    }
  };
  const hasLampiran = (report) => !!report.lampiran;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-6 py-4 border-b border-brand-border rounded-t-lg",
        style: {
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 18, className: "text-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-white", children: "Upload Lampiran" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs mt-0.5", children: "Upload dokumen dan foto untuk setiap laporan RKH" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-bulan",
            className: "text-xs font-medium text-gray-600",
            children: "Bulan:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "filter-bulan",
            "data-ocid": "upload_lampiran.bulan.select",
            value: bulan,
            onChange: (e) => setBulan(e.target.value),
            className: "text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400",
            children: MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.value, children: m.label }, m.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-tahun",
            className: "text-xs font-medium text-gray-600",
            children: "Tahun:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "filter-tahun",
            "data-ocid": "upload_lampiran.tahun.select",
            value: tahun,
            onChange: (e) => setTahun(e.target.value),
            className: "text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400",
            children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400 ml-auto", children: [
        reports.length,
        " laporan ditemukan"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "upload_lampiran.loading_state",
        className: "flex items-center justify-center py-12 text-gray-400",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Memuat laporan..." })
        ]
      }
    ) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "upload_lampiran.empty_state",
        className: "text-center py-12 text-gray-400",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 32, className: "mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Tidak ada laporan untuk periode ini" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 bg-gray-50/30 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-gray-500 w-10", children: "No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-gray-500", children: "Tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-gray-500", children: "Kegiatan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-gray-500 text-center", children: "Status Lampiran" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-gray-500 text-center", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: reports.map((report, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `upload_lampiran.row.item.${idx + 1}`,
            className: "border-b border-gray-50 hover:bg-gray-50/50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500 text-xs", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-700 whitespace-nowrap", children: report.tanggal }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-700 max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate", title: report.kegiatan, children: report.kegiatan }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: hasLampiran(report) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                "Ada"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-xs bg-gray-100 text-gray-400 rounded-full px-2.5 py-0.5", children: "-" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: expandedId === report.id ? "secondary" : "outline",
                  "data-ocid": `upload_lampiran.upload_button.${idx + 1}`,
                  onClick: () => handleOpenRow(report.id),
                  className: "text-xs h-7 px-3",
                  children: expandedId === report.id ? "Tutup" : "Upload Lampiran"
                }
              ) })
            ]
          },
          report.id.toString()
        ),
        expandedId === report.id && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 pb-4 bg-green-50/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-green-200 rounded-lg p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-gray-600 mb-3", children: [
            "Upload lampiran untuk laporan tanggal",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-700", children: report.tanggal })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-3 bg-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15, className: "text-red-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Dokumen / PDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "(maks. 1 file)" })
            ] }),
            rowState.dokumenFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FileText,
                {
                  size: 15,
                  className: "text-red-500 shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 truncate", children: rowState.dokumenFile.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: formatFileSize(rowState.dokumenFile.size) }),
                rowState.isUploading && rowState.dokumenProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-green-500 rounded-full transition-all",
                    style: {
                      width: `${rowState.dokumenProgress}%`
                    }
                  }
                ) })
              ] }),
              !rowState.isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRowState((s) => ({
                    ...s,
                    dokumenFile: null
                  })),
                  className: "shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: `dok-${report.id.toString()}`,
                className: "flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Pilih file PDF atau dokumen" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: dokumenRef,
                      id: `dok-${report.id.toString()}`,
                      type: "file",
                      accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      className: "hidden",
                      onChange: handleDokumenChange,
                      disabled: rowState.isUploading
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-3 bg-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 15, className: "text-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Gambar / Foto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "(maks. 1 file, otomatis dikecilkan)" })
            ] }),
            rowState.gambarFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Image,
                {
                  size: 15,
                  className: "text-blue-500 shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 truncate", children: rowState.gambarFile.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                  formatFileSize(rowState.gambarFile.size),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-green-500", children: "(dikompres)" })
                ] }),
                rowState.isUploading && rowState.gambarProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-blue-500 rounded-full transition-all",
                    style: {
                      width: `${rowState.gambarProgress}%`
                    }
                  }
                ) })
              ] }),
              !rowState.isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRowState((s) => ({
                    ...s,
                    gambarFile: null
                  })),
                  className: "shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: `img-${report.id.toString()}`,
                className: "flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 15, className: "text-gray-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Pilih file gambar / foto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: gambarRef,
                      id: `img-${report.id.toString()}`,
                      type: "file",
                      accept: "image/*",
                      className: "hidden",
                      onChange: handleGambarChange,
                      disabled: rowState.isUploading
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                "data-ocid": "upload_lampiran.submit_button",
                disabled: rowState.isUploading || !rowState.dokumenFile && !rowState.gambarFile,
                onClick: () => handleUpload(report),
                className: "text-white text-xs font-semibold",
                style: { backgroundColor: "#2E7D5B" },
                children: [
                  rowState.isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LoaderCircle,
                    {
                      size: 13,
                      className: "animate-spin mr-1.5"
                    }
                  ) : null,
                  rowState.isUploading ? "Mengunggah..." : "Simpan Lampiran"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                "data-ocid": "upload_lampiran.cancel_button",
                onClick: () => setExpandedId(null),
                disabled: rowState.isUploading,
                className: "text-xs",
                children: "Batal"
              }
            )
          ] })
        ] }) }) }, `upload-${report.id.toString()}`)
      ] })) })
    ] }) })
  ] });
}
export {
  UploadLampiranPage as default
};
