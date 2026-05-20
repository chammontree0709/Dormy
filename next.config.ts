import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Supabase SSR needs this for cookies
  },
  async redirects() {
    return [
      {
        source: '/rooms',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
