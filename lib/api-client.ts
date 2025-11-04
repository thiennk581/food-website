export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const apiClient = {
  get: async <T>(path: string, init?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "GET",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      credentials: "include",
    });
    return handle<T>(res);
  },
  post: async <T>(path: string, body?: unknown, init?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    return handle<T>(res);
  },
};
