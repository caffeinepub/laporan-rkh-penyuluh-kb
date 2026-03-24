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
    lampiran?: string;
    jumlahSasaran: bigint;
    sasaran: string;
}
export interface UserProfile {
    nip: string;
    nama: string;
    wilayahKerja: string;
    nomorHp: string;
    jabatan: string;
    tandaTangan?: string;
    unitKerja: string;
}
export interface UserTokenEntry {
    user: Principal;
    token: string;
}
export interface UserProfileWithPrincipal {
    user: Principal;
    profile: UserProfile;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReport(report: RKHReport): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRKHReport(input: {
        hasilKegiatan: string;
        kegiatan: string;
        tanggal: string;
        lokasi: string;
        keterangan?: string;
        lampiran?: string;
        jumlahSasaran: bigint;
        sasaran: string;
    }): Promise<RKHReport>;
    deleteReport(reportId: bigint): Promise<void>;
    filterReportsByUser(user: Principal): Promise<Array<RKHReport>>;
    filterReportsByUserAndMonth(user: Principal, month: string): Promise<Array<RKHReport>>;
    filterReportsByUserAndMonthYear(user: Principal, month: string, year: string): Promise<Array<RKHReport>>;
    filterReportsByUserAndYear(user: Principal, year: string): Promise<Array<RKHReport>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getAllUserProfilesWithPrincipals(): Promise<Array<UserProfileWithPrincipal>>;
    getAllUserTokens(): Promise<Array<UserTokenEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getReportById(reportId: bigint): Promise<RKHReport>;
    getReports(): Promise<Array<RKHReport>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserToken(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    isValidNumaiIndicator(numaiIndicator: Array<bigint>): Promise<boolean>;
    queryReports(tanggal: string | null, bulan: string | null, tahun: string | null, user: Principal | null): Promise<Array<RKHReport>>;
    queryReportsYearly(filterYear: string): Promise<Array<RKHReport>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserRole(user: Principal, newRole: UserRole): Promise<void>;
    setUserToken(user: Principal, token: string): Promise<void>;
    updateReport(reports: Array<RKHReport>): Promise<void>;
    validateUserToken(token: string): Promise<boolean>;
}
