import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // PGlite loads its WASM via a URL; let Node require it natively instead of
  // bundling it, which avoids "path argument must be a string" at runtime.
  serverExternalPackages: ["@electric-sql/pglite"],
  // We live in a nested folder with a parent lockfile; pin the workspace root.
  turbopack: { root: path.resolve(".") },
  experimental: {
    // Server Actions default to a 1MB body limit — too small for photo uploads.
    // Raise to ~Vercel's function body ceiling so gallery/finds uploads work.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
