import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Prefer local files in /public. Remote https images are allowed as a fallback.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
