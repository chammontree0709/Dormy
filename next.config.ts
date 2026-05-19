import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Supabase SSR needs this for cookies
  },
};

export default nextConfig;
