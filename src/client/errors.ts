// src/client/errors.ts
export class ApiError extends Error {
  readonly status: number;
  readonly errors?: string[];
  /** Seconds until retry is allowed — set from the Retry-After header on a 423 (account lockout). */
  readonly retryAfterSeconds?: number;

  constructor(message: string, status: number, errors?: string[], retryAfterSeconds?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  get isLockedOut(): boolean {
    return this.status === 423;
  }
}
