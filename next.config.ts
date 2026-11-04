import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Images are pre-generated as AVIF and WebP at build time (scripts/optimize-images.mjs)
    // and served by a custom loader, so Vercel Image Optimization is never used.
    loader: "custom",
    loaderFile: "./image-loader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
    imageSizes: [32, 64, 96, 128, 256, 384],
  },
  // Prebuilt image variants: AVIF for browsers that accept it, WebP otherwise.
  // Vercel's CDN includes Accept in its cache key, and Vary tells browsers the same.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_opt/:file(.*)\\.webp",
          has: [{ type: "header", key: "accept", value: "(.*)image/avif(.*)" }],
          destination: "/_opt/:file.avif",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/_opt/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
};

export default nextConfig;
