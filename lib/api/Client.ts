import config from "../config";

async function baseFetch(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
) {
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
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
  return res.json();
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const url = `${config.API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

export function apiFetch(path: string, options: RequestInit = {}) {
  return baseFetch(config.API_BASE_URL as string, path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

export function fastApiFetch(path: string, options: RequestInit = {}) {
  return baseFetch(config.FAST_API_BASE_URL as string, path, options);
}
