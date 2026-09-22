// src/client/createCrudHooks.ts
//
// Same idea as createCrudResource, one level up: wraps a CRUD resource in
// React Query with consistent, scoped cache-key discipline built in — a
// mutation here only ever invalidates its own domain's queryKey, never
// the whole cache (the exact bug the standalone RefreshButton work fixed
// on the frontend; baking scoped invalidation into the SDK itself means
// no hook anywhere can accidentally regress back to invalidating
// everything). A brand-new simple domain's hooks are two lines total —
// one call to createCrudResource, one call to this.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CrudResource } from "./createCrudResource";

export function createCrudHooks<T, TCreate, TUpdate>(queryKey: string, api: CrudResource<T, TCreate, TUpdate>) {
  function useList(params?: Record<string, unknown>) {
    return useQuery({ queryKey: [queryKey, params], queryFn: () => api.list(params) });
  }

  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [queryKey, id],
      queryFn: () => api.get(id as string),
      enabled: !!id,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: TCreate) => api.create(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: TUpdate }) => api.update(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => api.remove(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  return { useList, useOne, useCreate, useUpdate, useDelete };
}
