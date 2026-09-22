// src/client/unwrap.ts
//
// Both backends mix response conventions: Journal's entries/folders/tags/
// entry-types come back as the entity directly, while Journal's tasks/
// recurrence AND every Auth endpoint wrap in { success, data, message,
// errors } (see AuthController — every action goes through
// ApiResponseHelper). Every service function funnels through unwrap()
// once, so hooks and components never need to know which shape a given
// endpoint uses — a service always resolves to T, or throws ApiError.
import axios, { type AxiosResponse } from "axios";
import { ApiError } from "./errors";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

function isEnvelope(body: unknown): body is Envelope<unknown> {
  return !!body && typeof body === "object" && "success" in (body as Record<string, unknown>);
}

export async function unwrap<T>(request: Promise<AxiosResponse<T | Envelope<T>>>): Promise<T> {
  try {
    const { data } = await request;
    if (isEnvelope(data)) {
      if (!data.success) throw new ApiError(data.message ?? "Request failed", 200, data.errors);
      return data.data as T;
    }
    return data as T;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const body = err.response?.data as Envelope<unknown> | undefined;
      const retryAfterHeader = err.response?.headers?.["retry-after"];

      throw new ApiError(
        (isEnvelope(body) && body.message) || err.message,
        status,
        isEnvelope(body) ? body.errors : undefined,
        retryAfterHeader ? Number(retryAfterHeader) : undefined
      );
    }
    throw err;
  }
}
