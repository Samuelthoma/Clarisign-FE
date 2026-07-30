import { headers } from "next/headers";
import config from "../config";
import { ApiError, signApiErrorParser } from "./Client";

const INTERNAL_BASE_URL =
  process.env.SIGN_API_INTERNAL_URL || (config.API_BASE_URL as string);

async function visitorIpHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();

  const visitorIp =
    incoming.get("cf-connecting-ip")?.trim() ||
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!visitorIp) return {};

  return {
    "CF-Connecting-IP": visitorIp,
    "X-Forwarded-For": visitorIp,
  };
}

export async function serverAuthFetch(path: string, options: RequestInit = {}) {
  const url = `${INTERNAL_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await visitorIpHeaders()),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("AUTH ERROR:", { url, status: res.status, body: text });
    throw signApiErrorParser(text, res.status);
  }

  return res;
}

/** Server-side twin of apiFetch — parses the body like the browser client does. */
export async function serverApiFetch(
  path: string,
  options: RequestInit & { responseType?: "json" | "blob" } = {},
) {
  const { responseType = "json", ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;
  const url = `${INTERNAL_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(await visitorIpHeaders()),
      ...(fetchOptions.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API ERROR:", { url, status: res.status, body: text });
    throw signApiErrorParser(text, res.status);
  }

  return responseType === "blob" ? res.blob() : res.json();
}

const fastApiErrorParser = (text: string, status: number) => {
  let message = text || `HTTP ${status}`;
  try {
    const body = JSON.parse(text) as { detail?: unknown };
    if (typeof body?.detail === "string") message = body.detail;
  } catch {
    // non-JSON body (e.g. an HTML error page) — keep the raw text
  }
  return new ApiError(message, { status, body: text });
};

const FAST_API_INTERNAL_BASE_URL =
  process.env.FAST_API_INTERNAL_URL || (config.FAST_API_BASE_URL as string);

export async function serverFastApiFetch(path: string, options: RequestInit = {}) {
  const url = `${FAST_API_INTERNAL_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(await visitorIpHeaders()),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("FAST API ERROR:", { url, status: res.status, body: text });
    throw fastApiErrorParser(text, res.status);
  }

  return res.json();
}
