import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  // `next dev` blocks cross-origin dev requests (HMR/dev client) from origins that
  // aren't listed here. Serving through the Cloudflare tunnel means the browser's
  // origin is clarisign.site, so it must be allowed or the app never hydrates.
  allowedDevOrigins: ["192.168.100.193", "clarisign.site", "www.clarisign.site"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
