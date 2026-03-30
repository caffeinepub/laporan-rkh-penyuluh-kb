import { j as jsxRuntimeExports, d as cn, l as useCreateRKHReport, m as useUpdateReport, r as reactExports, L as Label, I as Input, B as Button, g as LoaderCircle, h as ue } from "./index-6p1Yqhdz.js";
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
function InputRKHPage({
  onNavigate,
  editReport
}) {
  const isEditing = !!editReport;
  const createMutation = useCreateRKHReport();
  const updateMutation = useUpdateReport();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
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
          lampiran: editReport.lampiran
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
          lampiran: void 0
        };
        await createMutation.mutateAsync(data);
        ue.success("Laporan RKH berhasil disimpan!");
      }
      onNavigate("dashboard");
    } catch {
      ue.error("Gagal menyimpan laporan. Silakan coba lagi.");
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
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
