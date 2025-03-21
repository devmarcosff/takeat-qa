import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "takeat-imgs.takeat.app",
      },
    ],
  },
};

export default nextConfig;
