import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  allowedDevOrigins: ["192.168.100.193"]
};

export default nextConfig;
