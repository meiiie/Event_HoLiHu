/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizeCss: true, // Bật tối ưu hóa CSS
    serverComponentsExternalPackages: ["@prisma/client", "@aws-sdk/client-s3"],
  },
  images: {
    domains: ['i.pinimg.com'], // Cho phép tải hình ảnh từ tên miền này
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wbygabwsqgvszpehwszj.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWdhYndzcWd2c3pwZWh3c3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODIwNDcsImV4cCI6MjA2MDI1ODA0N30._MMTef0lOVminPjzqZZQ-UXlbBNpou92xvGEYVkBS7A",
  },
  // Bổ sung cấu hình webpack để xác định vấn đề CSS
  webpack: (config, { dev, isServer }) => {
    // Cải thiện xử lý CSS
    if (!isServer && dev) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
