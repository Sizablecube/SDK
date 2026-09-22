// src/config.ts
//
// Call this once at app startup, before any hook fires its first request
// (e.g. at the top of your root layout/provider). Each field is optional
// so an app that only talks to one backend doesn't have to configure the
// other.
import { authClient, journalClient } from "./client/httpClient";

export interface SdkConfig {
  authBaseUrl?: string;
  journalBaseUrl?: string;
}

export function configureSdk(config: SdkConfig): void {
  if (config.authBaseUrl !== undefined) {
    authClient.defaults.baseURL = config.authBaseUrl;
  }
  if (config.journalBaseUrl !== undefined) {
    journalClient.defaults.baseURL = config.journalBaseUrl;
  }
}
