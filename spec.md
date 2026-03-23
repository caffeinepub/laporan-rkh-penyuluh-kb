# Laporan RKH Penyuluh KB

## Current State
App loads slowly due to multiple initialization cycles in `useInternetIdentity` and excessive query refetching in `useActor`.

## Requested Changes (Diff)

### Add
- `useRef`-based single-run initialization guard in `useInternetIdentity`
- Default QueryClient options: `refetchOnWindowFocus: false`, `refetchOnReconnect: false`, `staleTime: 5min`

### Modify
- `useInternetIdentity`: Remove `authClient` from `useEffect` dependency array; use `useRef` to store client so effect only runs once on mount
- `useActor`: Remove `useQueryClient` + `useEffect` block that invalidated/refetched all queries on actor change (was causing cascading backend calls)
- `main.tsx`: Add QueryClient defaultOptions to reduce unnecessary refetches

### Remove
- N/A

## Implementation Plan
1. Fix `useInternetIdentity` to initialize AuthClient only once using `useRef`
2. Simplify `useActor` to remove aggressive query invalidation
3. Configure QueryClient with conservative default staleTime and disable focus/reconnect refetching
