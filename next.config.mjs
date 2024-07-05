/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "http://127.0.0.1:4010/:path*", // mock server
        basePath: false,
      },
    ]
  },
  env: {
    api_key: process.env.API_KEY,
  },
}

export default nextConfig
