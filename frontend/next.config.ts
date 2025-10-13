import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337", 
        pathname: "/uploads/**/*",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*", 
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**/*",
      },
      {
        protocol: "https", 
        hostname: "your-strapi-domain.com", // Replace with your production domain
        pathname: "/uploads/**/*",
      }
    ],
  },
};

export default nextConfig;



