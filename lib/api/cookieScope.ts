
export function authCookieScope(host: string) {
  const hostname = host.split(":")[0];
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocal || !hostname.includes(".")) {
    return { secure: false as const };
  }

  const baseDomain = hostname.split(".").slice(-2).join(".");
  return { domain: `.${baseDomain}`, secure: true as const };
}

export function isTokenLive(token: string, now: number = Date.now()): boolean {
  const payload = token.split(".")[1];
  if (!payload) return false;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));

    return typeof claims.exp === "number" && claims.exp * 1000 > now;
  } catch {
    return false;
  }
}
