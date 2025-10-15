import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Temporarily disable optimization to test
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
        hostname: "*.railway.app", // Railway backend domain
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "tagelong.onrender.com", // Render backend domain
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "api.tagelong.com", // Custom API domain
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary CDN
        pathname: "/**/*",
      }
    ],
  },
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
  },
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
};

export default nextConfig;



