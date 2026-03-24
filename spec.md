# Laporan RKH Penyuluh KB

## Current State
App has persistent upload error (403 Forbidden: Invalid payload) and loading/flicker issues. Root cause: `useInternetIdentity.ts` uses `useState` for `authClient` and includes `[createOptions, authClient]` in `useEffect` dependency array, causing infinite re-initialization loop that resets identity during uploads.

## Requested Changes (Diff)

### Add
- `initDoneRef` guard in `useInternetIdentity` to prevent any re-run

### Modify
- `useInternetIdentity.ts`: Move `authClient` from `useState` to `useRef` (no re-render), store `createOptions` in `useRef`, change `useEffect` dependency to `[]` (empty), remove `authClient` and `createOptions` from callbacks.

### Remove
- `authClient` state variable (replaced by `authClientRef`)
- `[createOptions, authClient]` dependencies from `useEffect`

## Implementation Plan
1. Rewrite `useInternetIdentity.ts` with `authClientRef` (useRef), `createOptionsRef` (useRef), `initDoneRef` guard, empty dependency `useEffect`.
2. Update all internal callbacks to use `authClientRef.current` instead of `authClient` state.
3. Validate and deploy.
