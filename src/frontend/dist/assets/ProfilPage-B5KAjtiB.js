import { c as createLucideIcon, v as useGetCallerUserProfile, w as useUpdateMyProfile, r as reactExports, j as jsxRuntimeExports, g as LoaderCircle, U as User, L as Label, I as Input, B as Button, h as ue } from "./index-BGHXs2o8.js";
import { U as Upload } from "./upload-enxUg-td.js";
import { T as Trash2 } from "./trash-2-DU626A4C.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
function ProfilPage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateMutation = useUpdateMyProfile();
  const fileInputRef = reactExports.useRef(null);
  const [form, setForm] = reactExports.useState({
    nama: "",
    nip: "",
    jabatan: "",
    unitKerja: "",
    wilayahKerja: "",
    nomorHp: "",
    tandaTangan: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (profile) {
      setForm({
        nama: profile.nama,
        nip: profile.nip,
        jabatan: profile.jabatan,
        unitKerja: profile.unitKerja,
        wilayahKerja: profile.wilayahKerja,
        nomorHp: profile.nomorHp,
        tandaTangan: profile.tandaTangan ?? ""
      });
    }
  }, [profile]);
  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama lengkap wajib diisi";
    if (!form.nip.trim()) e.nip = "NIP wajib diisi";
    if (!form.jabatan.trim()) e.jabatan = "Jabatan wajib diisi";
    if (!form.unitKerja.trim()) e.unitKerja = "Unit Kerja wajib diisi";
    if (!form.wilayahKerja.trim()) e.wilayahKerja = "Wilayah Kerja wajib diisi";
    if (!form.nomorHp.trim()) e.nomorHp = "Nomor HP wajib diisi";
    return e;
  };
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const result = (_a2 = ev.target) == null ? void 0 : _a2.result;
      setForm((f) => ({ ...f, tandaTangan: result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleSubmit = async (e) => {
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
        tandaTangan: form.tandaTangan || void 0
      });
      ue.success("Profil berhasil diperbarui!");
    } catch {
      ue.error("Gagal memperbarui profil.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "profil.loading_state",
        className: "flex justify-center py-20",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-brand-green", size: 28 })
      }
    );
  }
  const fieldDef = [
    {
      key: "nama",
      label: "Nama Lengkap",
      placeholder: "Masukkan nama lengkap"
    },
    { key: "nip", label: "NIP", placeholder: "Masukkan NIP" },
    {
      key: "jabatan",
      label: "Jabatan",
      placeholder: "Contoh: Penyuluh KB Ahli Pertama"
    },
    {
      key: "unitKerja",
      label: "Unit Kerja",
      placeholder: "Contoh: DPPKB Kabupaten ..."
    },
    {
      key: "wilayahKerja",
      label: "Wilayah Kerja",
      placeholder: "Contoh: Kecamatan ..."
    },
    { key: "nomorHp", label: "Nomor HP", placeholder: "Contoh: 0812xxxxxxxx" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-6 py-4 border-b border-brand-border rounded-t-lg",
        style: {
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, className: "text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-white", children: "Profil Saya" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs", children: "Kelola informasi profil Anda" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: fieldDef.map(({ key, label, placeholder }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: key,
            className: "text-sm font-medium text-brand-nav",
            children: [
              label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: key,
            "data-ocid": `profil.${key}.input`,
            className: "mt-1",
            placeholder,
            value: form[key],
            onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
          }
        ),
        errors[key] && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": `profil.${key}.error_state`,
            className: "text-xs text-red-500 mt-1",
            children: errors[key]
          }
        )
      ] }, key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border border-brand-border rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 16, className: "text-brand-green" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-brand-nav", children: "Tanda Tangan" })
        ] }),
        form.tandaTangan ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "transparent",
                borderRadius: "6px",
                padding: "4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "160px",
                minHeight: "80px"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: form.tandaTangan,
                  alt: "Tanda Tangan",
                  style: {
                    maxWidth: "140px",
                    maxHeight: "64px",
                    objectFit: "contain"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand-muted", children: "Tanda tangan berhasil diunggah" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  "data-ocid": "profil.tanda_tangan.upload_button",
                  variant: "outline",
                  size: "sm",
                  className: "text-xs",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13, className: "mr-1" }),
                    "Ganti"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  "data-ocid": "profil.tanda_tangan.delete_button",
                  variant: "outline",
                  size: "sm",
                  className: "text-xs text-red-500 border-red-200 hover:bg-red-50",
                  onClick: () => setForm((f) => ({ ...f, tandaTangan: "" })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, className: "mr-1" }),
                    "Hapus"
                  ]
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
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
                fontSize: "12px"
              },
              children: "Belum ada tanda tangan"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              "data-ocid": "profil.tanda_tangan.upload_button",
              variant: "outline",
              size: "sm",
              className: "text-xs mt-1",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13, className: "mr-1" }),
                "Upload Tanda Tangan"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleFileChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand-muted mt-2", children: "Format: JPG, PNG, atau GIF. Disarankan menggunakan tanda tangan dengan latar belakang transparan atau putih." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          "data-ocid": "profil.save.primary_button",
          disabled: updateMutation.isPending,
          className: "text-white font-semibold",
          style: { backgroundColor: "#2E7D5B" },
          children: [
            updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin mr-2" }) : null,
            "Simpan Perubahan"
          ]
        }
      ) })
    ] })
  ] });
}
export {
  ProfilPage as default
};
