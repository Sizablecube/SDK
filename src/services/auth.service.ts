// src/services/auth.service.ts — one function per AuthController action.
// Routes match the controller's [Route("api/[controller]")] + action
// names exactly (api/Auth/register, api/Auth/login, etc.).
import { authClient } from "../client/httpClient";
import { unwrap } from "../client/unwrap";
import type {
  AuthResponse,
  ChangePasswordRequest,
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from "../types/auth";

export const authService = {
  register: (payload: RegisterRequest) => unwrap<AuthResponse>(authClient.post("/api/Auth/register", payload)),

  // On a 423 (locked out), unwrap() throws ApiError with isLockedOut and
  // retryAfterSeconds set from the Retry-After header — catch that
  // specifically rather than treating every login failure the same way.
  login: (payload: LoginRequest) => unwrap<AuthResponse>(authClient.post("/api/Auth/login", payload)),

  logout: () => unwrap<void>(authClient.post("/api/Auth/logout")),

  // Always resolves — the backend returns 200 "if that email is
  // registered..." regardless, by design, so there's nothing to branch on.
  forgotPassword: (payload: ForgotPasswordRequest) =>
    unwrap<void>(authClient.post("/api/Auth/forgot-password", payload)),

  resetPassword: (payload: ResetPasswordRequest) =>
    unwrap<void>(authClient.post("/api/Auth/reset-password", payload)),

  changePassword: (payload: ChangePasswordRequest) =>
    unwrap<void>(authClient.post("/api/Auth/change-password", payload)),

  getProfile: () => unwrap<CurrentUser>(authClient.get("/api/Auth/me/profile")),

  updateProfile: (payload: UpdateProfileRequest) =>
    unwrap<CurrentUser>(authClient.put("/api/Auth/me/profile", payload)),

  deleteProfile: () => unwrap<void>(authClient.delete("/api/Auth/me/profile")),
};
