import { headers } from "next/headers";
import config from "../config";
import { signApiErrorParser } from "./Client";

/**
 * Sign-api client for code that runs on the Next server (Server Actions).
 *
 * A Server Action executes in the Next process, so a plain fetch to the public
 * hostname arrives at sign-api as a request *from the server*: Cloudflare
 * rewrites CF-Connecting-IP at its edge with the Next box's address, and every
 * login lands in the audit log with the same IP no matter which device the user
 * is on. Browser-side callers (DocumentApi, UserApi, AuditLogApi) never had this
 * problem because their fetch really does originate from the visitor.
 *
 * So calls from here go straight to sign-api's internal port — skipping the
 * Cloudflare hairpin entirely — and carry the visitor IP forward by hand.
 */

// Falls back to the public URL so an unset variable degrades to the previous
// behaviour (correct responses, wrong logged IP) instead of breaking login.
const INTERNAL_BASE_URL =
  process.env.SIGN_API_INTERNAL_URL || (config.API_BASE_URL as string);

/**
 * The visitor IP of the request currently being served, formatted as the headers
 * sign-api's ClientIpUtil reads.
 *
 * Cloudflare overwrites CF-Connecting-IP at its edge, so on the request that
 * reached Next it is the genuine visitor address — a browser cannot forge it.
 * That guarantee only holds while Next itself is reachable solely through
 * Cloudflare; X-Forwarded-For is the fallback for local runs.
 */
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

/**
 * Server-side twin of authFetch — returns the raw Response so the caller can
 * read Set-Cookie off it.
 */
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
