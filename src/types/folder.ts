// src/types/folder.ts — matches the app's existing types/journal/folder.ts
// exactly (same field names/optionality), so migrating call sites over is
// a straight import-path swap with no shape changes.
export interface Folder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string | null;
  parentId?: string | null;
  createdAt: string;
  modifiedAt: string | null;
  children?: Folder[];
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}
