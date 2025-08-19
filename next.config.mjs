/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
