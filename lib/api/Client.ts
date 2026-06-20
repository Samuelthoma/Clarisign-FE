import config from "../config";

export class ApiError extends Error {
  status: number;
  code?: string;
  body?: unknown;
  constructor(message: string, opts: { status: number; code?: string; body?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.body = opts.body;
  }
}

type ErrorParser = (text: string, status: number) => Error;

const rawErrorParser: ErrorParser = (text, status) =>
  new Error(text || `HTTP ${status}`);

const signApiErrorParser: ErrorParser = (text, status) => {
  let message = text || `HTTP ${status}`;
  let code: string | undefined;
  let body: unknown;

  try {
    body = JSON.parse(text);
    const b = body as ApiErrorBody;
    message =
      b?.outputSchema?.message ||
      b?.errorSchema?.message ||
      b?.message ||
      text ||
      `HTTP ${status}`;
    code = b?.errorSchema?.code;
  } catch {

  }
  return new ApiError(message, { status, code, body });
};

async function baseFetch(
  baseUrl: string,
  path: string,
  options: RequestInit & { responseType?: "json" | "blob"; errorParser?: ErrorParser } = {},
) {
  const { responseType = "json", errorParser = rawErrorParser, ...fetchOptions } = options;
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...fetchOptions,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API ERROR:", { url, status: res.status, body: text });
    throw errorParser(text, res.status);
  }

  return responseType === "blob" ? res.blob() : res.json();
}

interface ApiErrorBody {
  errorSchema?: { code?: string; message?: string };
  outputSchema?: { message?: string };
  message?: string;
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
    const text = await res.text().catch(() => "");
    console.error("AUTH ERROR:", { url, status: res.status, body: text });
    throw signApiErrorParser(text, res.status); // sign-api
  }

  return res;
}

export function apiFetch(
  path: string,
  options: RequestInit & { responseType?: "json" | "blob" } = {},
) {
  const isFormData = options.body instanceof FormData;
  return baseFetch(config.API_BASE_URL as string, path, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
    errorParser: signApiErrorParser, // sign-api → parser baru
  });
}

export function fastApiFetch(path: string, options: RequestInit = {}) {
  // Tanpa errorParser → pakai rawErrorParser = perilaku ASLI, Python tidak tersentuh.
  return baseFetch(config.FAST_API_BASE_URL as string, path, options);
}