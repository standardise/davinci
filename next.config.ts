import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://davinci-core-731059858056.asia-southeast1.run.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
