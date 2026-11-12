import type { NextConfig } from "next";

function storagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  // Portfolio may not require a Laravel API.
  if (!apiUrl) {
    return [];
  }

  try {
    const url = new URL(apiUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid protocol");
    }

    const protocol = url.protocol === "https:" ? "https" : "http";
    const hostnames = new Set([url.hostname]);

    if (["localhost", "127.0.0.1"].includes(url.hostname)) {
      hostnames.add("localhost");
      hostnames.add("127.0.0.1");
    }

    return [...hostnames].map((hostname) => ({
      protocol,
      hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/storage/**",
    }));
  } catch {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be a valid absolute URL",
    );
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    remotePatterns: storagePatterns(),
  },

  output: "standalone",

  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;