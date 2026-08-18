import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-left",
  },
  images: {
    // Every Supabase project's Storage URLs resolve under this pattern —
    // needed for next/image to render uploaded hero images (Homepage
    // Editor). Harmless while Supabase Storage is unconfigured; matters the
    // moment SUPABASE_URL is set and someone uploads an image.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
