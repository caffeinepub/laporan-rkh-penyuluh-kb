# Laporan RKH Penyuluh KB

## Current State
New project. Empty Motoko backend and React frontend scaffolded.

## Requested Changes (Diff)

### Add
- User registration with fields: nama lengkap, NIP, wilayah kerja, unit kerja, jabatan, nomor HP
- Login system using Principal-based authentication via authorization component
- Profile page to view/edit personal data
- RKH (Rencana Kegiatan Harian) report form with fields:
  - tanggal kegiatan
  - kegiatan (activity type/description)
  - sasaran (target audience/beneficiaries)
  - jumlah sasaran (count)
  - lokasi kegiatan
  - hasil kegiatan (activity results/outcomes)
  - keterangan (notes/remarks)
- Full CRUD for RKH reports (submit, view, edit, delete)
- Dashboard with report history filtered by tanggal/bulan/tahun
- Print/export functionality: formatted printable RKH document with header (logo BKKBN), user info, and report table
- Admin panel: view all reports from all penyuluh, manage users (activate/deactivate), recap by month/wilayah
- Role-based access: admin vs penyuluh user roles

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select authorization component for role-based access
2. Generate Motoko backend with:
   - UserProfile type (nama, NIP, wilayah_kerja, unit_kerja, jabatan, nomor_hp, role)
   - RKHReport type (id, user principal, tanggal, kegiatan, sasaran, jumlah_sasaran, lokasi, hasil_kegiatan, keterangan, created_at)
   - CRUD functions for profiles and reports
   - Admin functions to view all reports and users
3. Build React frontend:
   - Login/Register page with full profile fields
   - Dashboard with report list and date filters
   - RKH form (create/edit)
   - Report detail view with print layout
   - Admin panel (user management + report recap)
   - Print-friendly CSS for formal document output
