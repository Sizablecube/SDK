import { AxiosInstance } from 'axios';
import * as _tanstack_react_query from '@tanstack/react-query';

interface SdkConfig {
    authBaseUrl?: string;
    journalBaseUrl?: string;
}
declare function configureSdk(config: SdkConfig): void;

declare class ApiError extends Error {
    readonly status: number;
    readonly errors?: string[];
    /** Seconds until retry is allowed — set from the Retry-After header on a 423 (account lockout). */
    readonly retryAfterSeconds?: number;
    constructor(message: string, status: number, errors?: string[], retryAfterSeconds?: number);
    get isLockedOut(): boolean;
}

interface CrudResource<T, TCreate, TUpdate> {
    list: (params?: Record<string, unknown>) => Promise<T[]>;
    get: (id: string) => Promise<T>;
    create: (payload: TCreate) => Promise<T>;
    update: (id: string, payload: TUpdate) => Promise<T>;
    remove: (id: string) => Promise<void>;
}
declare function createCrudResource<T, TCreate = Partial<T>, TUpdate = Partial<T>>(client: AxiosInstance, basePath: string): CrudResource<T, TCreate, TUpdate>;

declare function createCrudHooks<T, TCreate, TUpdate>(queryKey: string, api: CrudResource<T, TCreate, TUpdate>): {
    useList: (params?: Record<string, unknown>) => _tanstack_react_query.UseQueryResult<T[], Error>;
    useOne: (id: string | undefined) => _tanstack_react_query.UseQueryResult<T, Error>;
    useCreate: () => _tanstack_react_query.UseMutationResult<T, Error, TCreate, unknown>;
    useUpdate: () => _tanstack_react_query.UseMutationResult<T, Error, {
        id: string;
        payload: TUpdate;
    }, unknown>;
    useDelete: () => _tanstack_react_query.UseMutationResult<void, Error, string, unknown>;
};

interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    surname: string;
}
interface LoginRequest {
    email: string;
    password: string;
}
interface AuthResponse {
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
interface UpdateProfileRequest {
    firstName?: string | null;
    surname?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    profileImageUrl?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
}
interface ProfileResponse {
    firstName: string | null;
    surname: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    profileImageUrl: string | null;
    bio: string | null;
    phoneNumber: string | null;
}
interface ForgotPasswordRequest {
    email: string;
}
interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}
interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
interface CurrentUser {
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

declare const authService: {
    register: (payload: RegisterRequest) => Promise<AuthResponse>;
    login: (payload: LoginRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    forgotPassword: (payload: ForgotPasswordRequest) => Promise<void>;
    resetPassword: (payload: ResetPasswordRequest) => Promise<void>;
    changePassword: (payload: ChangePasswordRequest) => Promise<void>;
    getProfile: () => Promise<CurrentUser>;
    updateProfile: (payload: UpdateProfileRequest) => Promise<CurrentUser>;
    deleteProfile: () => Promise<void>;
};

declare function useCurrentUser(): _tanstack_react_query.UseQueryResult<CurrentUser, Error>;
declare function useLogin(): _tanstack_react_query.UseMutationResult<AuthResponse, Error, LoginRequest, unknown>;
declare function useRegister(): _tanstack_react_query.UseMutationResult<AuthResponse, Error, RegisterRequest, unknown>;
declare function useLogout(): _tanstack_react_query.UseMutationResult<void, Error, void, unknown>;
declare function useForgotPassword(): _tanstack_react_query.UseMutationResult<void, Error, ForgotPasswordRequest, unknown>;
declare function useResetPassword(): _tanstack_react_query.UseMutationResult<void, Error, ResetPasswordRequest, unknown>;
declare function useChangePassword(): _tanstack_react_query.UseMutationResult<void, Error, ChangePasswordRequest, unknown>;
declare function useUpdateProfile(): _tanstack_react_query.UseMutationResult<CurrentUser, Error, UpdateProfileRequest, unknown>;

interface Folder {
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
interface CreateFolderRequest {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: string;
}
interface UpdateFolderRequest {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: string;
}

declare const folderService: CrudResource<Folder, CreateFolderRequest, UpdateFolderRequest>;

declare function useFolders(parentId?: string | null): _tanstack_react_query.UseQueryResult<Folder[], Error>;
declare const useFolder: (id: string | undefined) => _tanstack_react_query.UseQueryResult<Folder, Error>;
declare const useCreateFolder: () => _tanstack_react_query.UseMutationResult<Folder, Error, CreateFolderRequest, unknown>;
declare const useUpdateFolder: () => _tanstack_react_query.UseMutationResult<Folder, Error, {
    id: string;
    payload: UpdateFolderRequest;
}, unknown>;
declare const useDeleteFolder: () => _tanstack_react_query.UseMutationResult<void, Error, string, unknown>;

export { ApiError, type AuthResponse, type ChangePasswordRequest, type CreateFolderRequest, type CrudResource, type CurrentUser, type Folder, type ForgotPasswordRequest, type LoginRequest, type ProfileResponse, type RegisterRequest, type ResetPasswordRequest, type SdkConfig, type UpdateFolderRequest, type UpdateProfileRequest, authService, configureSdk, createCrudHooks, createCrudResource, folderService, useChangePassword, useCreateFolder, useCurrentUser, useDeleteFolder, useFolder, useFolders, useForgotPassword, useLogin, useLogout, useRegister, useResetPassword, useUpdateFolder, useUpdateProfile };
