# @sizablecube/sdk

A shared TypeScript SDK: typed API client + React Query hooks, packaged once
instead of duplicated Axios calls and DTOs across every frontend.

The SDK is **universal** — it doesn't assume any single backend. Each API
domain (Auth, Journal, and whatever comes next) gets its own axios instance
and its own service + hooks layer inside the SDK. Frontends consume hooks
like `useTasks()` or `useFolders()` and never talk to Axios directly.

This package will grow over time as more domains and backends are added.
The publishing contract stays the same: build to `dist/`, ship types, ship
hooks, ship nothing else.

---

## Architecture at a glance

- **No universal gateway.** Each backend keeps its own proxy.
- The SDK handles that by holding **one axios instance per domain**, not one
  shared client. You point each instance at wherever that backend's proxy
  lives via `configureSdk({...})`.
- **React Query is a peer dependency.** The consuming app owns the
  `QueryClient`; the SDK just registers queries and mutations against it.
- **Types ship with the package.** Frontend developers get IntelliSense on
  every request/response DTO without maintaining a copy.

---

## What's in here today

Two domains implemented, and both are the reference patterns for the rest:

| Domain | Status | Pattern |
|---|---|---|
| **Auth** | ✅ | Hand-written service + hooks. Covers register / login / logout, forgot / reset / change password, and profile. Matches `AuthController.cs` action-for-action, including the `423 Locked` lockout case (`ApiError.isLockedOut` / `.retryAfterSeconds`). |
| **Folders** | ✅ | Built via the generic `createCrudResource` + `createCrudHooks` factories. This is the template for anything that's plain `list / get / create / update / delete`. |

**Not yet added:** Entries, Tasks, Recurrence, Dashboard.

Entries and Tasks will need the *factory-plus-extra-methods* pattern — they
have endpoints beyond plain CRUD (`/gantt`, `/status`, occurrence actions).
See the comment at the top of `createCrudResource.ts` for the shape.

---

## Using it today (before it's on npm)

Until the package is published, pick whichever install path matches your setup:

- **Workspaces** (frontend + SDK live in one repo):
  ```jsonc
  // frontend/package.json
  {
    "dependencies": {
      "@sizablecube/sdk": "workspace:*"
    }
  }
  ```

- **`npm link`** (SDK and frontend live in separate repos):
  ```bash
  # in the SDK repo
  npm link

  # in the frontend repo
  npm link @sizablecube/sdk
  ```

- **Local path install** (quick and dirty, no linking):
  ```bash
  npm install file:../path/to/sdk
  ```

All three behave identically to a real `npm install @sizablecube/sdk` from
the frontend's perspective — `import { useFolders } from "@sizablecube/sdk"`
works the same either way. Publishing later changes only *how the package is
fetched*, not the code that imports it.

---

## Setup (consumer side)

```ts
import { configureSdk } from "@sizablecube/sdk";

configureSdk({
  authBaseUrl:    process.env.NEXT_PUBLIC_AUTH_API_URL,
  journalBaseUrl: process.env.NEXT_PUBLIC_JOURNAL_API_URL,
});
```

Call `configureSdk(...)` **once**, before any hook fires its first request —
e.g. at the top of your root layout or provider, alongside where you already
set up `QueryClientProvider`.

The SDK does **not** create its own `QueryClient`. Both React Query and this
SDK expect the app to already be wrapped in `<QueryClientProvider>`.

### Adding a new backend later

Because each domain has its own base URL, adding a third backend is just a
new key in the config:

```ts
configureSdk({
  authBaseUrl:     process.env.NEXT_PUBLIC_AUTH_API_URL,
  journalBaseUrl:  process.env.NEXT_PUBLIC_JOURNAL_API_URL,
  analyticsBaseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL, // future
});
```

The SDK's internals don't care how many backends exist — each domain
service is bound to exactly one axios instance.

---

## Adding a new domain (e.g. Tags)

The whole domain is three small files:

```ts
// src/types/tag.ts — same shape as folder.ts
export interface Tag { id: string; name: string; }
export interface CreateTagRequest { name: string; }
export interface UpdateTagRequest { name: string; }
```

```ts
// src/services/tag.service.ts
import { journalClient } from "../client/httpClient";
import { createCrudResource } from "../client/createCrudResource";
import type { Tag, CreateTagRequest, UpdateTagRequest } from "../types/tag";

export const tagService = createCrudResource<Tag, CreateTagRequest, UpdateTagRequest>(
  journalClient,
  "/api/Tags"
);
```

```ts
// src/hooks/useTags.ts
import { createCrudHooks } from "../client/createCrudHooks";
import { tagService } from "../services/tag.service";

export const {
  useList:   useTags,
  useOne:    useTag,
  useCreate: useCreateTag,
  useUpdate: useUpdateTag,
  useDelete: useDeleteTag,
} = createCrudHooks("tags", tagService);
```

Then re-export from `src/index.ts`. Done — the frontend now has
`useTags()`, `useCreateTag()`, and so on, with full typing and cache
invalidation handled by the factory.

---

## Publishing

```bash
# 1. Bump the version
npm version patch   # or minor / major

# 2. Build + verify
npm run build
npm pack --dry-run  # should list only dist/, README.md, LICENSE, package.json

# 3. Publish
npm publish --access public
```

Only `dist/` ships — `src/` stays in the repo. The `files` field in
`package.json` is the safety gate.

---

## License

MIT — see `LICENSE`.