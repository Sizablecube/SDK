// src/client/createCrudResource.ts
//
// Folders, Tags, and Entry Types (and Task Statuses/Priorities) are all
// structurally identical: list/get/create/update/delete on a base path.
// Write that pattern once here; a new simple domain becomes one call to
// this factory instead of five hand-written functions. Domains with real
// extra behavior (Task's /gantt, /status) spread this factory's output
// and add the extra methods alongside it — see services/task.service.ts
// once that domain is added.
import type { AxiosInstance } from "axios";
import { unwrap } from "./unwrap";

export interface CrudResource<T, TCreate, TUpdate> {
  list: (params?: Record<string, unknown>) => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (payload: TCreate) => Promise<T>;
  update: (id: string, payload: TUpdate) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function createCrudResource<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  client: AxiosInstance,
  basePath: string
): CrudResource<T, TCreate, TUpdate> {
  return {
    list: (params) => unwrap<T[]>(client.get(basePath, { params })),
    get: (id) => unwrap<T>(client.get(`${basePath}/${id}`)),
    create: (payload) => unwrap<T>(client.post(basePath, payload)),
    update: (id, payload) => unwrap<T>(client.put(`${basePath}/${id}`, payload)),
    remove: (id) => unwrap<void>(client.delete(`${basePath}/${id}`)),
  };
}
