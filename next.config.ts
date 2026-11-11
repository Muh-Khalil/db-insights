import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark native DB packages as server-external so native bindings work in API routes
  serverExternalPackages: [
    'mysql2',
    'pg',
    'better-sqlite3',
  ],
};

export default nextConfig;
