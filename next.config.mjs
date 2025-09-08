/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use consistent path normalization
  outputFileTracingRoot: process.cwd(),
  outputFileTracingExcludes: {
    "*": [
      "node_modules/next/dist/compiled/react-server-dom-webpack/client.edge.js",
      "node_modules/next/dist/compiled/react-server-dom-webpack/client.js",
    ],
  },
  // Adjust project settings for paths with spaces
  distDir: ".next",
  cleanDistDir: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  // Add support for cross-origin API requests
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://tajbee-backend-g2exf9drgrejg0bh.centralindia-01.azurewebsites.net/api/:path*",
      },
    ];
  },
  // Configure image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
