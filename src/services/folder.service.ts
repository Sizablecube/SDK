// src/services/folder.service.ts
// Second proof point for createCrudResource — Folders' responses are
// direct objects (no {success,data} wrapper), unlike Auth. unwrap()
// handles both without either service knowing the difference.
import { journalClient } from "../client/httpClient";
import { createCrudResource } from "../client/createCrudResource";
import type { CreateFolderRequest, Folder, UpdateFolderRequest } from "../types/folder";

// Kept as exactly what CrudResource expects (no signature narrowing) so
// it stays a valid argument to createCrudHooks — the parentId-friendly
// call shape lives on the hook instead, see useFolders.ts.
export const folderService = createCrudResource<Folder, CreateFolderRequest, UpdateFolderRequest>(
  journalClient,
  "/api/Folders"
);
