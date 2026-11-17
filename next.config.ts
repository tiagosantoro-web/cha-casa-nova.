import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site estático: `npm run build` gera a pasta `out/`, pronta para GitHub Pages ou Vercel.
  output: "export",
  // Caminho do site quando publicado em subpasta (ex.: GitHub Pages "/cha-casa-nova"). Vazio na Vercel.
  basePath: process.env.BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
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
