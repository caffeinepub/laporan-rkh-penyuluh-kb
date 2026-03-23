import { c as createLucideIcon, j as jsxRuntimeExports, d as cn, l as useCreateRKHReport, m as useUpdateReport, n as useInternetIdentity, r as reactExports, L as Label, I as Input, B as Button, g as LoaderCircle, h as ue, o as loadConfig, p as HttpAgent, S as StorageClient } from "./index-BMrz64Wn.js";
import { U as Upload } from "./upload-doz95gcY.js";
import { F as FileText } from "./file-text-DcvWNEC3.js";
import { P as Paperclip } from "./paperclip-CL7xJM1A.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
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
const MIN_ATTACHMENTS = 5;
function getFileIcon(file) {
  if (file.type.startsWith("image/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18, className: "text-blue-500" });
  if (file.type === "application/pdf")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 18, className: "text-red-500" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 18, className: "text-gray-500" });
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
  const [form, setForm] = reactExports.useState({
    tanggal: "",
    kegiatan: "",
    sasaran: "",
    jumlahSasaran: "",
    lokasi: "",
    hasilKegiatan: "",
    keterangan: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [attachedFiles, setAttachedFiles] = reactExports.useState([]);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState([]);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useState(() => {
    if (editReport) {
      setForm({
        tanggal: editReport.tanggal,
        kegiatan: editReport.kegiatan,
        sasaran: editReport.sasaran,
        jumlahSasaran: editReport.jumlahSasaran.toString(),
        lokasi: editReport.lokasi,
        hasilKegiatan: editReport.hasilKegiatan,
        keterangan: editReport.keterangan ?? ""
      });
    } else {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      setForm((f) => ({ ...f, tanggal: today ?? "" }));
    }
  });
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
    if (attachedFiles.length > 0 && attachedFiles.length < MIN_ATTACHMENTS)
      e.lampiran = `Lampiran minimal ${MIN_ATTACHMENTS} file. Saat ini baru ${attachedFiles.length} file.`;
    return e;
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setAttachedFiles((prev) => {
        const combined = [...prev, ...files];
        return combined;
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleRemoveFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };
  const uploadAttachments = async () => {
    if (attachedFiles.length === 0) return void 0;
    setIsUploading(true);
    setUploadProgress(new Array(attachedFiles.length).fill(0));
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({
        host: config.backend_host,
        identity: identity ?? void 0
      });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
      const results = [];
      for (let i = 0; i < attachedFiles.length; i++) {
        const file = attachedFiles[i];
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (progress) => {
          setUploadProgress((prev) => {
            const updated = [...prev];
            updated[i] = progress;
            return updated;
          });
        });
        const url = await storageClient.getDirectURL(hash);
        results.push({ name: file.name, url });
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
    } catch {
      ue.error("Gagal mengunggah lampiran. Silakan coba lagi.");
      return;
    }
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
    try {
      if (isEditing && editReport) {
        await updateMutation.mutateAsync({ id: editReport.id, data });
        ue.success("Laporan berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync(data);
        ue.success("Laporan RKH berhasil disimpan!");
      }
      onNavigate("dashboard");
    } catch {
      ue.error("Gagal menyimpan laporan. Silakan coba lagi.");
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
  const remaining = Math.max(0, MIN_ATTACHMENTS - attachedFiles.length);
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
        errors.tanggal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "rkh_form.tanggal.error_state",
            className: "text-xs text-red-500 mt-1",
            children: errors.tanggal
          }
        )
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
        errors.kegiatan && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "rkh_form.kegiatan.error_state",
            className: "text-xs text-red-500 mt-1",
            children: errors.kegiatan
          }
        )
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
          errors.sasaran && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "rkh_form.sasaran.error_state",
              className: "text-xs text-red-500 mt-1",
              children: errors.sasaran
            }
          )
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
          errors.jumlahSasaran && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "rkh_form.jumlah_sasaran.error_state",
              className: "text-xs text-red-500 mt-1",
              children: errors.jumlahSasaran
            }
          )
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
        errors.lokasi && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "rkh_form.lokasi.error_state",
            className: "text-xs text-red-500 mt-1",
            children: errors.lokasi
          }
        )
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
        errors.hasilKegiatan && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "rkh_form.hasil_kegiatan.error_state",
            className: "text-xs text-red-500 mt-1",
            children: errors.hasilKegiatan
          }
        )
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-brand-nav", children: [
            "Lampiran",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 text-xs font-normal", children: [
              "(opsional, minimal ",
              MIN_ATTACHMENTS,
              " file jika diisi)"
            ] })
          ] }),
          attachedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-semibold px-2 py-0.5 rounded-full ${attachedFiles.length >= MIN_ATTACHMENTS ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
              children: [
                attachedFiles.length,
                "/",
                MIN_ATTACHMENTS,
                " file"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mb-2", children: [
          "Unggah minimal ",
          MIN_ATTACHMENTS,
          " file pendukung: gambar, PDF, Word, atau format lainnya"
        ] }),
        attachedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-3", children: attachedFiles.map((file, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: getFileIcon(file) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-700 truncate", children: file.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: formatFileSize(file.size) }),
                isUploading && uploadProgress[index] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-green-500 rounded-full transition-all",
                      style: { width: `${uploadProgress[index]}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [
                    uploadProgress[index],
                    "%"
                  ] })
                ] })
              ] }),
              !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleRemoveFile(index),
                  className: "shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors",
                  title: "Hapus lampiran",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ]
          },
          `${file.name}-${index}`
        )) }),
        attachedFiles.length > 0 && attachedFiles.length < MIN_ATTACHMENTS && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          [1, 2, 3, 4, 5].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-1.5 flex-1 rounded-full transition-all ${step - 1 < attachedFiles.length ? "bg-green-500" : "bg-gray-200"}`
            },
            step
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-600 whitespace-nowrap", children: [
            "+",
            remaining,
            " lagi"
          ] })
        ] }),
        !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "lampiran-file",
            className: "border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors block",
            children: [
              attachedFiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 22, className: "mx-auto mb-2 text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Klik untuk memilih file" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
                  "Tambahkan minimal ",
                  MIN_ATTACHMENTS,
                  " file (gambar, PDF, Word, dll)"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-green-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Tambah file lagi" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  id: "lampiran-file",
                  type: "file",
                  accept: "*/*",
                  multiple: true,
                  className: "hidden",
                  onChange: handleFileChange
                }
              )
            ]
          }
        ),
        errors.lampiran && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.lampiran }),
        attachedFiles.length >= MIN_ATTACHMENTS && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 mt-1.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓" }),
          " ",
          attachedFiles.length,
          " file siap diunggah"
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
