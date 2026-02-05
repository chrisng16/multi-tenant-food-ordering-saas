import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://dpi9u0u4pb096.cloudfront.net/**')],
  },
};

export default nextConfig;
