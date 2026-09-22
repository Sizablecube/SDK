"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ApiError: () => ApiError,
  authService: () => authService,
  configureSdk: () => configureSdk,
  createCrudHooks: () => createCrudHooks,
  createCrudResource: () => createCrudResource,
  folderService: () => folderService,
  useChangePassword: () => useChangePassword,
  useCreateFolder: () => useCreateFolder,
  useCurrentUser: () => useCurrentUser,
  useDeleteFolder: () => useDeleteFolder,
  useFolder: () => useFolder,
  useFolders: () => useFolders,
  useForgotPassword: () => useForgotPassword,
  useLogin: () => useLogin,
  useLogout: () => useLogout,
  useRegister: () => useRegister,
  useResetPassword: () => useResetPassword,
  useUpdateFolder: () => useUpdateFolder,
  useUpdateProfile: () => useUpdateProfile
});
module.exports = __toCommonJS(index_exports);

// src/client/httpClient.ts
var import_axios = __toESM(require("axios"));
function createDomainClient() {
  return import_axios.default.create({
    withCredentials: true
    // both backends authenticate via the access_token cookie
  });
}
var authClient = createDomainClient();
var journalClient = createDomainClient();

// src/config.ts
function configureSdk(config) {
  if (config.authBaseUrl !== void 0) {
    authClient.defaults.baseURL = config.authBaseUrl;
  }
  if (config.journalBaseUrl !== void 0) {
    journalClient.defaults.baseURL = config.journalBaseUrl;
  }
}

// src/client/errors.ts
var ApiError = class extends Error {
  constructor(message, status, errors, retryAfterSeconds) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.retryAfterSeconds = retryAfterSeconds;
  }
  get isLockedOut() {
    return this.status === 423;
  }
};

// src/client/unwrap.ts
var import_axios2 = __toESM(require("axios"));
function isEnvelope(body) {
  return !!body && typeof body === "object" && "success" in body;
}
async function unwrap(request) {
  try {
    const { data } = await request;
    if (isEnvelope(data)) {
      if (!data.success) throw new ApiError(data.message ?? "Request failed", 200, data.errors);
      return data.data;
    }
    return data;
  } catch (err) {
    if (import_axios2.default.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const body = err.response?.data;
      const retryAfterHeader = err.response?.headers?.["retry-after"];
      throw new ApiError(
        isEnvelope(body) && body.message || err.message,
        status,
        isEnvelope(body) ? body.errors : void 0,
        retryAfterHeader ? Number(retryAfterHeader) : void 0
      );
    }
    throw err;
  }
}

// src/client/createCrudResource.ts
function createCrudResource(client, basePath) {
  return {
    list: (params) => unwrap(client.get(basePath, { params })),
    get: (id) => unwrap(client.get(`${basePath}/${id}`)),
    create: (payload) => unwrap(client.post(basePath, payload)),
    update: (id, payload) => unwrap(client.put(`${basePath}/${id}`, payload)),
    remove: (id) => unwrap(client.delete(`${basePath}/${id}`))
  };
}

// src/client/createCrudHooks.ts
var import_react_query = require("@tanstack/react-query");
function createCrudHooks(queryKey, api) {
  function useList(params) {
    return (0, import_react_query.useQuery)({ queryKey: [queryKey, params], queryFn: () => api.list(params) });
  }
  function useOne(id) {
    return (0, import_react_query.useQuery)({
      queryKey: [queryKey, id],
      queryFn: () => api.get(id),
      enabled: !!id
    });
  }
  function useCreate() {
    const queryClient = (0, import_react_query.useQueryClient)();
    return (0, import_react_query.useMutation)({
      mutationFn: (payload) => api.create(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  }
  function useUpdate() {
    const queryClient = (0, import_react_query.useQueryClient)();
    return (0, import_react_query.useMutation)({
      mutationFn: ({ id, payload }) => api.update(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  }
  function useDelete() {
    const queryClient = (0, import_react_query.useQueryClient)();
    return (0, import_react_query.useMutation)({
      mutationFn: (id) => api.remove(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  }
  return { useList, useOne, useCreate, useUpdate, useDelete };
}

// src/services/auth.service.ts
var authService = {
  register: (payload) => unwrap(authClient.post("/api/Auth/register", payload)),
  // On a 423 (locked out), unwrap() throws ApiError with isLockedOut and
  // retryAfterSeconds set from the Retry-After header — catch that
  // specifically rather than treating every login failure the same way.
  login: (payload) => unwrap(authClient.post("/api/Auth/login", payload)),
  logout: () => unwrap(authClient.post("/api/Auth/logout")),
  // Always resolves — the backend returns 200 "if that email is
  // registered..." regardless, by design, so there's nothing to branch on.
  forgotPassword: (payload) => unwrap(authClient.post("/api/Auth/forgot-password", payload)),
  resetPassword: (payload) => unwrap(authClient.post("/api/Auth/reset-password", payload)),
  changePassword: (payload) => unwrap(authClient.post("/api/Auth/change-password", payload)),
  getProfile: () => unwrap(authClient.get("/api/Auth/me/profile")),
  updateProfile: (payload) => unwrap(authClient.put("/api/Auth/me/profile", payload)),
  deleteProfile: () => unwrap(authClient.delete("/api/Auth/me/profile"))
};

// src/hooks/useAuth.ts
var import_react_query2 = require("@tanstack/react-query");
var CURRENT_USER_KEY = ["auth", "me"];
function useCurrentUser() {
  return (0, import_react_query2.useQuery)({
    queryKey: CURRENT_USER_KEY,
    queryFn: authService.getProfile,
    retry: false
    // a 401 here means "not logged in", not a transient failure worth retrying
  });
}
function useLogin() {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY })
  });
}
function useRegister() {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY })
  });
}
function useLogout() {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
    mutationFn: authService.logout,
    // Wipe the entire cache, not just auth's — nothing from the previous
    // session (entries, tasks, anything) should linger for whoever logs in next.
    onSuccess: () => queryClient.clear()
  });
}
function useForgotPassword() {
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.forgotPassword(payload)
  });
}
function useResetPassword() {
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.resetPassword(payload)
  });
}
function useChangePassword() {
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.changePassword(payload)
  });
}
function useUpdateProfile() {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
    mutationFn: (payload) => authService.updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY })
  });
}

// src/services/folder.service.ts
var folderService = createCrudResource(
  journalClient,
  "/api/Folders"
);

// src/hooks/useFolders.ts
var folderHooks = createCrudHooks("folders", folderService);
function useFolders(parentId) {
  return folderHooks.useList(parentId ? { parentId } : void 0);
}
var useFolder = folderHooks.useOne;
var useCreateFolder = folderHooks.useCreate;
var useUpdateFolder = folderHooks.useUpdate;
var useDeleteFolder = folderHooks.useDelete;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiError,
  authService,
  configureSdk,
  createCrudHooks,
  createCrudResource,
  folderService,
  useChangePassword,
  useCreateFolder,
  useCurrentUser,
  useDeleteFolder,
  useFolder,
  useFolders,
  useForgotPassword,
  useLogin,
  useLogout,
  useRegister,
  useResetPassword,
  useUpdateFolder,
  useUpdateProfile
});
//# sourceMappingURL=index.js.map