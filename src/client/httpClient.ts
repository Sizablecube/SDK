// src/client/httpClient.ts
//
// One axios instance per backend domain, not one shared instance — "each
// project has its own proxy" means Auth and Journal can (and likely will)
// live at different origins. configureSdk() points each one at wherever
// that backend's proxy actually is. Until configureSdk() runs, both
// default to "" (relative requests) — fine if the consuming app's own
// dev-server proxy already forwards /api/*, and harmless either way since
// nothing fires a request at import time.
//
// Adding a third backend later (Anatomy, per the old architecture doc) is
// one line here (`export const anatomyClient = createDomainClient();`)
// plus one more field on SdkConfig — nothing else in the SDK changes.
import axios from "axios";

function createDomainClient() {
  return axios.create({
    withCredentials: true, // both backends authenticate via the access_token cookie
  });
}

export const authClient = createDomainClient();
export const journalClient = createDomainClient();
