import { c as createLucideIcon, j as jsxRuntimeExports, d as cn, l as useCreateRKHReport, m as useUpdateReport, n as useInternetIdentity, r as reactExports, L as Label, I as Input, B as Button, g as LoaderCircle, h as ue, o as loadConfig, p as HttpAgent, S as StorageClient } from "./index-D1CRhD9j.js";
import { F as FileText } from "./file-text-CIXZNmr9.js";
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
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
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
function InputRKHPage({
  onNavigate,
  editReport
}) {
  const isEditing = !!editReport;
  const createMutation = useCreateRKHReport();
  const updateMutation = useUpdateReport();
  const { identity } = useInternetIdentity();
  const identityRef = reactExports.useRef(identity);
  identityRef.current = identity;
  const [form, setForm] = reactExports.useState(() => {
    if (editReport) {
      return {
        tanggal: editReport.tanggal,
        kegiatan: editReport.kegiatan,
        sasaran: editReport.sasaran,
        jumlahSasaran: editReport.jumlahSasaran.toString(),
        lokasi: editReport.lokasi,
        hasilKegiatan: editReport.hasilKegiatan,
        keterangan: editReport.keterangan ?? ""
      };
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      tanggal: today ?? "",
      kegiatan: "",
      sasaran: "",
      jumlahSasaran: "",
      lokasi: "",
      hasilKegiatan: "",
      keterangan: ""
    };
  });
  const [errors, setErrors] = reactExports.useState({});
  const [dokumenFile, setDokumenFile] = reactExports.useState(null);
  const [gambarFile, setGambarFile] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [dokumenProgress, setDokumenProgress] = reactExports.useState(0);
  const [gambarProgress, setGambarProgress] = reactExports.useState(0);
  const dokumenRef = reactExports.useRef(null);
  const gambarRef = reactExports.useRef(null);
  const validate = () => {
    const e = {};
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
  const handleDokumenChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) setDokumenFile(file);
    if (dokumenRef.current) dokumenRef.current.value = "";
  };
  const handleGambarChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      const compressed = await compressFile(file);
      setGambarFile(compressed);
    }
    if (gambarRef.current) gambarRef.current.value = "";
  };
  const uploadSingleFile = async (file, storageClient, onProgress) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await storageClient.putFile(bytes, onProgress);
    const url = await storageClient.getDirectURL(hash);
    return { name: file.name, url };
  };
  const uploadAttachments = async () => {
    if (!dokumenFile && !gambarFile) return void 0;
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
      if (dokumenFile) {
        const result = await uploadSingleFile(
          dokumenFile,
          storageClient,
          (p) => setDokumenProgress(p)
        );
        results.push({ ...result, type: "dokumen" });
      }
      if (gambarFile) {
        const result = await uploadSingleFile(
          gambarFile,
          storageClient,
          (p) => setGambarProgress(p)
        );
        results.push({ ...result, type: "gambar" });
      }
      return JSON.stringify(results);
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    let lampiranValue;
    try {
      lampiranValue = await uploadAttachments();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah lampiran.";
      ue.error(`${msg} Silakan coba lagi.`);
      return;
    }
    try {
      if (isEditing && editReport) {
        const updatedReport = {
          ...editReport,
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          sasaran: form.sasaran,
          jumlahSasaran: BigInt(form.jumlahSasaran),
          lokasi: form.lokasi,
          hasilKegiatan: form.hasilKegiatan,
          keterangan: form.keterangan || void 0,
          lampiran: lampiranValue ?? editReport.lampiran
        };
        await updateMutation.mutateAsync(updatedReport);
        ue.success("Laporan berhasil diperbarui!");
      } else {
        const data = {
          tanggal: form.tanggal,
          kegiatan: form.kegiatan,
          sasaran: form.sasaran,
          jumlahSasaran: BigInt(form.jumlahSasaran),
          lokasi: form.lokasi,
          hasilKegiatan: form.hasilKegiatan,
          keterangan: form.keterangan || void 0,
          lampiran: lampiranValue
        };
        await createMutation.mutateAsync(data);
        ue.success("Laporan RKH berhasil disimpan!");
      }
      onNavigate("dashboard");
    } catch {
      ue.error("Gagal menyimpan laporan. Silakan coba lagi.");
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-6 py-4 border-b border-brand-border rounded-t-lg",
        style: {
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-white", children: isEditing ? "Edit Laporan RKH" : "Input Laporan RKH Baru" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs mt-0.5", children: "Rencana Kegiatan Harian Penyuluh KB" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "tanggal",
            className: "text-sm font-medium text-brand-nav",
            children: [
              "Tanggal Kegiatan ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tanggal",
            type: "date",
            "data-ocid": "rkh_form.tanggal.input",
            className: "mt-1 max-w-xs",
            value: form.tanggal,
            onChange: (e) => setForm((f) => ({ ...f, tanggal: e.target.value }))
          }
        ),
        errors.tanggal && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.tanggal })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "kegiatan",
            className: "text-sm font-medium text-brand-nav",
            children: [
              "Kegiatan ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "kegiatan",
            "data-ocid": "rkh_form.kegiatan.textarea",
            className: "mt-1",
            rows: 3,
            placeholder: "Deskripsikan kegiatan yang dilakukan...",
            value: form.kegiatan,
            onChange: (e) => setForm((f) => ({ ...f, kegiatan: e.target.value }))
          }
        ),
        errors.kegiatan && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.kegiatan })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "sasaran",
              className: "text-sm font-medium text-brand-nav",
              children: [
                "Sasaran ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "sasaran",
              "data-ocid": "rkh_form.sasaran.input",
              className: "mt-1",
              placeholder: "Contoh: PUS, WUS, Remaja",
              value: form.sasaran,
              onChange: (e) => setForm((f) => ({ ...f, sasaran: e.target.value }))
            }
          ),
          errors.sasaran && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.sasaran })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "jumlahSasaran",
              className: "text-sm font-medium text-brand-nav",
              children: [
                "Jumlah Sasaran ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "jumlahSasaran",
              type: "number",
              min: "0",
              "data-ocid": "rkh_form.jumlah_sasaran.input",
              className: "mt-1",
              placeholder: "0",
              value: form.jumlahSasaran,
              onChange: (e) => setForm((f) => ({ ...f, jumlahSasaran: e.target.value }))
            }
          ),
          errors.jumlahSasaran && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.jumlahSasaran })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "lokasi",
            className: "text-sm font-medium text-brand-nav",
            children: [
              "Lokasi ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "lokasi",
            "data-ocid": "rkh_form.lokasi.input",
            className: "mt-1",
            placeholder: "Nama desa/kelurahan/kecamatan...",
            value: form.lokasi,
            onChange: (e) => setForm((f) => ({ ...f, lokasi: e.target.value }))
          }
        ),
        errors.lokasi && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.lokasi })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "hasilKegiatan",
            className: "text-sm font-medium text-brand-nav",
            children: [
              "Hasil Kegiatan ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "hasilKegiatan",
            "data-ocid": "rkh_form.hasil_kegiatan.textarea",
            className: "mt-1",
            rows: 3,
            placeholder: "Deskripsikan hasil yang dicapai...",
            value: form.hasilKegiatan,
            onChange: (e) => setForm((f) => ({ ...f, hasilKegiatan: e.target.value }))
          }
        ),
        errors.hasilKegiatan && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.hasilKegiatan })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "keterangan",
            className: "text-sm font-medium text-brand-nav",
            children: [
              "Keterangan",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-xs font-normal", children: "(opsional)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "keterangan",
            "data-ocid": "rkh_form.keterangan.textarea",
            className: "mt-1",
            rows: 2,
            placeholder: "Catatan tambahan jika ada...",
            value: form.keterangan,
            onChange: (e) => setForm((f) => ({ ...f, keterangan: e.target.value }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-brand-nav", children: [
          "Lampiran",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-xs font-normal", children: "(opsional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-red-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Dokumen / PDF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "(maks. 1 file)" })
          ] }),
          dokumenFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-red-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 truncate", children: dokumenFile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: formatFileSize(dokumenFile.size) }),
              isUploading && dokumenProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-green-500 rounded-full transition-all",
                  style: { width: `${dokumenProgress}%` }
                }
              ) }) })
            ] }),
            !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setDokumenFile(null),
                className: "shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors",
                title: "Hapus",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "lampiran-dokumen",
              className: "flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Pilih file PDF atau dokumen" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: dokumenRef,
                    id: "lampiran-dokumen",
                    type: "file",
                    accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    className: "hidden",
                    onChange: handleDokumenChange,
                    disabled: isUploading
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "text-blue-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Gambar / Foto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "(maks. 1 file, otomatis dikecilkan)" })
          ] }),
          gambarFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "text-blue-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 truncate", children: gambarFile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                formatFileSize(gambarFile.size),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-green-500", children: "(dikompres)" })
              ] }),
              isUploading && gambarProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-blue-500 rounded-full transition-all",
                  style: { width: `${gambarProgress}%` }
                }
              ) }) })
            ] }),
            !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setGambarFile(null),
                className: "shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors",
                title: "Hapus",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "lampiran-gambar",
              className: "flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-3 py-2.5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Pilih file gambar / foto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: gambarRef,
                    id: "lampiran-gambar",
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handleGambarChange,
                    disabled: isUploading
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            "data-ocid": "rkh_form.submit_button",
            disabled: isPending,
            className: "text-white font-semibold",
            style: { backgroundColor: "#2E7D5B" },
            children: [
              isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin mr-2" }) : null,
              isEditing ? "Perbarui Laporan" : "Simpan Laporan"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            "data-ocid": "rkh_form.cancel_button",
            variant: "outline",
            onClick: () => onNavigate("dashboard"),
            children: "Batal"
          }
        )
      ] })
    ] })
  ] });
}
export {
  InputRKHPage as default
};
