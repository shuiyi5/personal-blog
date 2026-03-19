import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js <Image> to optimize and CACHE images from these sources
    // Notion file URLs come from S3, external URLs can be anything
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" }, // Allow all HTTPS images
    ],
    // Cache optimized images for 1 hour (Notion URLs expire in ~1h)
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
