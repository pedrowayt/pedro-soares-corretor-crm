import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net"
      }
    ]
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
