# Laporan RKH Penyuluh KB

## Current State
- UserProfile has: nama, nip, wilayahKerja, unitKerja, jabatan, nomorHp
- ProfilPage: form edit profil tanpa tanda tangan
- RiwayatLaporanPage: print section menampilkan nama dan NIP di bagian tanda tangan, tanpa gambar tanda tangan

## Requested Changes (Diff)

### Add
- Field `tandaTangan` (Optional Text / base64 data URL) di UserProfile backend
- Fitur upload gambar tanda tangan di ProfilPage
- Preview gambar tanda tangan setelah upload
- Tampilan tanda tangan di atas nama pada bagian cetak laporan

### Modify
- `UserProfile` type di backend: tambah field `tandaTangan: ?Text`
- `saveCallerUserProfile` dan `updateMyProfile` menerima field baru
- ProfilPage: tambah section upload tanda tangan
- RiwayatLaporanPage print section: tampilkan `<img>` tanda tangan di atas nama jika tersedia

### Remove
- Tidak ada

## Implementation Plan
1. Update backend UserProfile type dengan field tandaTangan
2. Update ProfilPage dengan upload tanda tangan (input file -> base64)
3. Update RiwayatLaporanPage print section: tampilkan tanda tangan di atas nama
