export type Page =
  | "dashboard"
  | "input-rkh"
  | "edit-rkh"
  | "riwayat"
  | "profil"
  | "admin"
  | "upload-lampiran";

export interface NavItem {
  page: Page;
  label: string;
  icon: string;
}
