import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/demand-system",
  assetPrefix: "/demand-system/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
