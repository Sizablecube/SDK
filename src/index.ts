// src/index.ts — public surface of the package. Frontends only ever
// import from here (never a deeper path), so internal reorganization
// (e.g. splitting a service file) never breaks a consuming app.

export { configureSdk } from "./config";
export type { SdkConfig } from "./config";

export { ApiError } from "./client/errors";
export { createCrudResource } from "./client/createCrudResource";
export type { CrudResource } from "./client/createCrudResource";
export { createCrudHooks } from "./client/createCrudHooks";

// ---- Auth domain ----
export { authService } from "./services/auth.service";
export {
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
  useUpdateProfile,
} from "./hooks/useAuth";
export type {
  AuthResponse,
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from "./types/auth";

// ---- Folder domain ----
export { folderService } from "./services/folder.service";
export { useFolders, useFolder, useCreateFolder, useUpdateFolder, useDeleteFolder } from "./hooks/useFolders";
export type { CreateFolderRequest, Folder, UpdateFolderRequest } from "./types/folder";
