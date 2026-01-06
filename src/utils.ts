export function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function safeJsonParse(text: string): unknown {
  if (text.trim() === "") return null;
  return JSON.parse(text);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldRetry(status?: number, err?: unknown): boolean {
  if (typeof status === "number") {
    return status === 408 || status === 429 || (status >= 500 && status <= 599);
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("network") || msg.includes("fetch") || msg.includes("socket") || msg.includes("econnreset");
  }

  return false;
}
