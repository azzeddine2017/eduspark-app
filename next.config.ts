import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // تجاهل أخطاء ESLint أثناء البناء
    ignoreDuringBuilds: true,
  },
  typescript: {
    // تجاهل أخطاء TypeScript أثناء البناء (اختياري)
    ignoreBuildErrors: false,
  },
  experimental: {
    // تحسينات الأداء
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
