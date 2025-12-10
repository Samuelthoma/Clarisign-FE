import config from "../config";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${config.API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = "Unknown API Error";
    try {
      const body = await res.json();
      errorMessage = body.message || JSON.stringify(body);
    } catch (_) {}
    throw new Error(errorMessage);
  }
  return res.json();
}
