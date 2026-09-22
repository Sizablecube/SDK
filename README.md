# journal-sdk

Shared TypeScript SDK for the Journal app's backends: typed API client + React Query hooks, one package instead of duplicated Axios/type code per frontend.

No universal gateway — each backend (Auth, Journal, ...) keeps its own proxy. The SDK handles that by holding one axios instance *per domain* rather than one shared client; you point each at wherever that backend's proxy lives.

## What's in here so far

Two domains, built as the reference pattern for the rest:

- **Auth** — register/login/logout, forgot/reset/change password, profile — matching `AuthController.cs` action-for-action, including the 423-lockout case (`ApiError.isLockedOut` / `.retryAfterSeconds`).
- **Folders** — full CRUD, built via the generic `createCrudResource` + `createCrudHooks` factories. This is the domain to copy for Tags, EntryTypes, TaskStatuses, TaskPriorities — anything that's plain list/get/create/update/delete.

Not yet added: Entries, Tasks, Recurrence, Dashboard. Entries/Tasks need the factory-plus-extra-methods pattern (see the comment in `createCrudResource.ts`) since they have endpoints beyond plain CRUD (`/gantt`, `/status`, occurrence actions).

## Using it today (before it's published)

This isn't on npm yet. Until it is, either:

- **npm/yarn/pnpm workspaces** (if the frontend and this package end up in the same repo): add `"journal-sdk": "workspace:*"` to the frontend's `package.json`.
- **`npm link`**: `npm link` here, then `npm link journal-sdk` in the frontend.
- **Local path install**: `npm install file:../path/to/journal-sdk` from the frontend.

All three work identically to a real npm install from the frontend's code — `import { useFolders } from "journal-sdk"` either way. Nothing about the source changes when you actually publish; only the install command does.

## Publishing later

1. Pick a real package name — `journal-sdk` is a placeholder. A scoped name (`@your-npm-username/journal-sdk`) avoids collisions on the public registry, or point `publishConfig.registry` at a private registry if you'd rather not publish publicly.
2. `npm run build` (tsup outputs `dist/` — CJS, ESM, and `.d.ts` — that's what actually ships; `src/` isn't published).
3. `npm publish` (bump `version` first, or use `npm version patch/minor/major`).

## Setup

```ts
import { configureSdk } from "journal-sdk";

configureSdk({
  authBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL,
  journalBaseUrl: process.env.NEXT_PUBLIC_JOURNAL_API_URL,
});
```

Call this once, before any hook fires its first request — e.g. at the top of the root layout/provider, alongside where `QueryClientProvider` is already set up. Both React Query and this SDK need the app to already be wrapped in a `QueryClientProvider` — the SDK doesn't create its own.

## Adding the next domain (e.g. Tags)

```ts
// src/types/tag.ts — same shape as folder.ts
// src/services/tag.service.ts
import { journalClient } from "../client/httpClient";
import { createCrudResource } from "../client/createCrudResource";
export const tagService = createCrudResource<Tag, CreateTagRequest, UpdateTagRequest>(journalClient, "/api/Tags");

// src/hooks/useTags.ts
import { createCrudHooks } from "../client/createCrudHooks";
export const { useList: useTags, useOne: useTag, useCreate: useCreateTag, useUpdate: useUpdateTag, useDelete: useDeleteTag } =
  createCrudHooks("tags", tagService);
```

Then export the new pieces from `src/index.ts`. That's the whole domain.
