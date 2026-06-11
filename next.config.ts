import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // PGlite loads its WASM via a URL; let Node require it natively instead of
  // bundling it, which avoids "path argument must be a string" at runtime.
  serverExternalPackages: ["@electric-sql/pglite"],
  // We live in a nested folder with a parent lockfile; pin the workspace root.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
