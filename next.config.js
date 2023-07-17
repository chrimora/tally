/** @type {import('next').NextConfig} */
let root = "/tally";

const nextConfig = {
  basePath: root,
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
