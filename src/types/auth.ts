// src/types/auth.ts — mirrors AuthBackend.DTOs (Dtos/AuthDtos.cs) field for field.
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  surname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  surname: string;
  gender: string | null;
  phoneNumber: string | null;
  roles: string[];
  accessToken: string;
  expiresAtUtc: string;
}

// DateOfBirth is DateOnly server-side, serialized as plain "YYYY-MM-DD" —
// no time or timezone component, so that's the exact string shape to send back.
export interface UpdateProfileRequest {
  firstName?: string | null;
  surname?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
}

export interface ProfileResponse {
  firstName: string | null;
  surname: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  phoneNumber: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// AuthService.GetCurrentUserAsync currently returns an anonymous object
// (id, email, profile fields, roles) rather than a named DTO — this type
// matches that shape as it exists today. If that ever becomes a real DTO
// backend-side (worth doing eventually, for OpenAPI generation), this
// type moves with it with no consumer-facing change.
export interface CurrentUser {
  id: string;
  email: string;
  firstName?: string | null;
  surname?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  roles: string[];
}
