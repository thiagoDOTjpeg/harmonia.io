import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@harmonia/ui", "@harmonia/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);

