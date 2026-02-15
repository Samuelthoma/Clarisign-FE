import config from "../config";

async function baseFetch(
  baseUrl: string,
  path: string,
  options: RequestInit = {}
){
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...options
  });

  if (!res.ok){
    let errorMessage = "Unknown API Error";
    try {
      const body = await res.json();
      errorMessage = body.message || JSON.stringify(body);
    } catch(_) {}
    throw new Error(errorMessage);
  }
  return res.json();
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

export function fastApiFetch(
  path: string,
  options: RequestInit = {},
) {
  return baseFetch(config.FAST_API_BASE_URL as string, path, options)
}
