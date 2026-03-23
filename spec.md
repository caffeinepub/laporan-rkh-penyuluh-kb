# Laporan RKH Penyuluh KB

## Current State
Admin panel has a Token Akses tab. The handleSave function tries to find the user's Principal by checking if `entry.user.toString().includes(profile.nip)` -- this always fails because a Principal string never contains the NIP.

## Requested Changes (Diff)

### Add
- Backend function `getAllUserProfilesWithPrincipals()` returning `[{user: Principal, profile: UserProfile}]`
- Frontend hook `useGetAllUserProfilesWithPrincipals()`

### Modify
- TokenAksesTab: use principal-mapped data to correctly find Principal by NIP when saving token

### Remove
- Broken logic replaced with correct principal lookup

## Implementation Plan
1. Add `getAllUserProfilesWithPrincipals` to backend
2. Update backend.d.ts
3. Add hook in useQueries.ts
4. Fix TokenAksesTab in AdminPage.tsx
