/** @type {import('next').NextConfig} */
let root = "/tally";

const nextConfig = {
  basePath: root,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
