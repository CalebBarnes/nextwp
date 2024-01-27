const withNextWp = require("@nextwp/core/with-nextwp");

/** @type {import('next').NextConfig} */

const wpBaseUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(
  "https://",
  ""
)?.replace("http://", "");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpBaseUrl,
      },
      {
        protocol: "http",
        hostname: wpBaseUrl,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // logging: {
  //   fetches: {
  //     fullUrl: false,
  //   },
  // },
  // reactStrictMode: false,
};

if (process.env.SINGLE_THREAD_BUILD === "true") {
  // Single threaded builds for production during generateStaticParams and other functions to avoid rate limiting
  // Only enable this if you are running into rate limiting issues while fetching a lot of posts in parallel
  if (!nextConfig.experimental) {
    nextConfig.experimental = {};
  }
  nextConfig.experimental.workerThreads = false;
  nextConfig.experimental.cpus = 1;
}

// module.exports = nextConfig;

module.exports = withNextWp(nextConfig);
