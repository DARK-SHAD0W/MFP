async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type ApiFetchFn = <T>(path: string, options?: RequestInit) => Promise<T>;

export function useApiFetch(token: string): ApiFetchFn {
  return async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(path, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await safeJson<T & { message?: string }>(response);

    if (!response.ok) {
      const message = data?.message || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data as T;
  };
}
