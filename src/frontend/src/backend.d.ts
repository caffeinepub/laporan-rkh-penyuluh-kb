import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RKHReport {
    id: bigint;
    hasilKegiatan: string;
    kegiatan: string;
    tanggal: string;
    createdAt: bigint;
    user: Principal;
    lokasi: string;
    keterangan?: string;
    jumlahSasaran: bigint;
    sasaran: string;
}
export interface UserProfile {
    nip: string;
    nama: string;
    wilayahKerja: string;
    nomorHp: string;
    jabatan: string;
    unitKerja: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRKHReport(reportInput: {
        hasilKegiatan: string;
        kegiatan: string;
        tanggal: string;
        lokasi: string;
        keterangan?: string;
        jumlahSasaran: bigint;
        sasaran: string;
    }): Promise<RKHReport>;
    deleteReport(reportId: bigint): Promise<void>;
    filterReports(user: Principal, monthFilter: string | null, yearFilter: string | null): Promise<Array<RKHReport>>;
    getAllReports(): Promise<Array<RKHReport>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyReports(): Promise<Array<RKHReport>>;
    getReportById(reportId: bigint): Promise<RKHReport>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    queryRKHReports(filter: {
        tahun?: string;
        tanggal?: string;
        user?: Principal;
        bulan?: string;
    }): Promise<Array<RKHReport>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserRole(user: Principal, newRole: UserRole): Promise<void>;
    updateMyProfile(profile: UserProfile): Promise<void>;
    updateReport(reportId: bigint, updatedData: {
        hasilKegiatan: string;
        kegiatan: string;
        tanggal: string;
        lokasi: string;
        keterangan?: string;
        jumlahSasaran: bigint;
        sasaran: string;
    }): Promise<RKHReport>;
}
