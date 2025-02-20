import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Permite imagens do Cloudinary
  },
};

export default nextConfig;
