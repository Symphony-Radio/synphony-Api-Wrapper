import { HttpError, InvalidBaseUrlError, ParseError, TimeoutError } from "./errors.js";
import { joinUrl, safeJsonParse, shouldRetry, sleep } from "./utils.js";
import type { RequestOptions, RecentlyPlayedResponse, StatsResponse, UpcomingResponse } from "./types.js";

export interface SymphonyRadioClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export class SymphonyRadioClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly headers: Record<string, string>;

  constructor(options: SymphonyRadioClientOptions = {}) {
    const baseUrl = options.baseUrl ?? "https://panel.symphradio.live/api";
    try {
      // validate and normalise
      const u = new URL(baseUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        throw new Error("Invalid protocol");
      }
      this.baseUrl = u.toString().replace(/\/+$/, "");
    } catch (e) {
      throw new InvalidBaseUrlError(`Invalid baseUrl: ${baseUrl}`, e);
    }

    this.timeoutMs = Math.max(1000, options.timeoutMs ?? 10_000);
    this.retries = Math.max(0, Math.min(5, options.retries ?? 1));
    this.headers = {
      "Accept": "application/json",
      ...options.headers
    };
  }

  async getStats(options?: RequestOptions): Promise<StatsResponse> {
    return this.request<StatsResponse>("stats", options);
  }

  async getUpcoming(options?: RequestOptions): Promise<UpcomingResponse> {
    return this.request<UpcomingResponse>("upcoming", options);
  }

  async getRecentlyPlayed(params?: { limit?: number }, options?: RequestOptions): Promise<RecentlyPlayedResponse> {
    const limit = params?.limit;
    const qs = typeof limit === "number" ? `?limit=${encodeURIComponent(String(limit))}` : "";
    return this.request<RecentlyPlayedResponse>(`recentlyplayed${qs}`, options);
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = joinUrl(this.baseUrl, path);

    const timeoutMs = Math.max(250, options.timeoutMs ?? this.timeoutMs);
    const headers = {
      ...this.headers,
      ...options.headers
    };

    let lastErr: unknown;
    let lastStatus: number | undefined;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const ctrl = new AbortController();
      const onAbort = () => ctrl.abort();

      const timeout = setTimeout(() => ctrl.abort(), timeoutMs);
      if (options.signal) {
        if (options.signal.aborted) ctrl.abort();
        options.signal.addEventListener("abort", onAbort, { once: true });
      }

      try {
        const res = await fetch(url, {
          method: "GET",
          headers,
          signal: ctrl.signal
        });

        lastStatus = res.status;

        const text = await res.text();

        if (!res.ok) {
          const err = new HttpError(`Request failed with status ${res.status}`, res.status, url, text);
          if (attempt < this.retries && shouldRetry(res.status, err)) {
            await sleep(backoffMs(attempt));
            continue;
          }
          throw err;
        }

        try {
          return safeJsonParse(text) as T;
        } catch (e) {
          throw new ParseError(`Failed to parse JSON from ${url}`, e);
        }
      } catch (e) {
        lastErr = e;

        const isAbort = (e instanceof Error && e.name === "AbortError") || (typeof e === "object" && e !== null && (e as any).name === "AbortError");
        if (isAbort) {
          const err = new TimeoutError(`Request timed out after ${timeoutMs}ms`, e);
          if (attempt < this.retries && shouldRetry(undefined, err)) {
            await sleep(backoffMs(attempt));
            continue;
          }
          throw err;
        }

        if (attempt < this.retries && shouldRetry(lastStatus, e)) {
          await sleep(backoffMs(attempt));
          continue;
        }

        throw e;
      } finally {
        clearTimeout(timeout);
        if (options.signal) options.signal.removeEventListener("abort", onAbort);
      }
    }

    if (lastErr instanceof Error) throw lastErr;
    throw new HttpError("Request failed", lastStatus ?? 0, url);
  }
}

function backoffMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return Math.min(2500, base + jitter);
}
