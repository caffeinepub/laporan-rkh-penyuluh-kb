import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RKHReport, UserProfile, UserRole } from "../backend.d";
import { useActor } from "./useActor";

// ---- Profile ----
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useUpdateMyProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateMyProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

// ---- Reports ----
export function useGetMyReports() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<RKHReport[]>({
    queryKey: ["myReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyReports();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useQueryRKHReports(filter: {
  tanggal?: string;
  bulan?: string;
  tahun?: string;
  user?: Principal;
}) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<RKHReport[]>({
    queryKey: ["queryRKHReports", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.queryRKHReports(filter);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllReports() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<RKHReport[]>({
    queryKey: ["allReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateRKHReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      hasilKegiatan: string;
      kegiatan: string;
      tanggal: string;
      lokasi: string;
      keterangan?: string;
      jumlahSasaran: bigint;
      sasaran: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createRKHReport(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myReports"] });
      qc.invalidateQueries({ queryKey: ["allReports"] });
      qc.invalidateQueries({ queryKey: ["queryRKHReports"] });
    },
  });
}

export function useUpdateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: bigint;
      data: {
        hasilKegiatan: string;
        kegiatan: string;
        tanggal: string;
        lokasi: string;
        keterangan?: string;
        jumlahSasaran: bigint;
        sasaran: string;
      };
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateReport(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myReports"] });
      qc.invalidateQueries({ queryKey: ["allReports"] });
      qc.invalidateQueries({ queryKey: ["queryRKHReports"] });
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteReport(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myReports"] });
      qc.invalidateQueries({ queryKey: ["allReports"] });
      qc.invalidateQueries({ queryKey: ["queryRKHReports"] });
    },
  });
}

// ---- Admin ----
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["allUserProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setUserRole(user, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserProfiles"] }),
  });
}
