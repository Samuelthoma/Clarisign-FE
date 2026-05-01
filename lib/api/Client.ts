import config from "../config";

async function baseFetch(
  baseUrl: string,
  path: string,
  options: RequestInit & { responseType?: "json" | "blob" } = {},
) {
  const { responseType = "json", ...fetchOptions } = options;

  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
  });

  if (!res.ok) {
    const text = await res.text();

    console.error("API ERROR:", {
      url,
      status: res.status,
      body: text,
    });

    throw new Error(text || `HTTP ${res.status}`);
  }

  if (responseType === "blob") {
    return res.blob();
  }

  return res.json();
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const url = `${config.API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;

    try {
      const text = await res.text();

      try {
        const body = JSON.parse(text);
        errorMessage = body.message || text;
      } catch {
        errorMessage = text;
      }
    } catch {}

    throw new Error(errorMessage);
  }

  return res;
}

export function apiFetch(path: string, options: RequestInit & { responseType?: "json" | "blob" } = {}) {
  const isFormData = options.body instanceof FormData;

  return baseFetch(config.API_BASE_URL as string, path, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });
}

export function fastApiFetch(path: string, options: RequestInit = {}) {
  return baseFetch(config.FAST_API_BASE_URL as string, path, options);
}
