/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  experimental: {
    // Make optimizeCss optional to avoid requiring critters
    optimizeCss: false,
    serverComponentsExternalPackages: ["@prisma/client", "@aws-sdk/client-s3"],
  },
  images: {
    domains: ['i.pinimg.com'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wbygabwsqgvszpehwszj.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWdhYndzcWd2c3pwZWh3c3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODIwNDcsImV4cCI6MjA2MDI1ODA0N30._MMTef0lOVminPjzqZZQ-UXlbBNpou92xvGEYVkBS7A",
  },
  // Sửa lại cấu hình webpack để kiểm tra trước khi truy cập cacheGroups
  webpack: (config, { dev, isServer }) => {
    // Cải thiện xử lý CSS
    if (!isServer && dev) {
      if (config.optimization && 
          config.optimization.splitChunks && 
          typeof config.optimization.splitChunks === 'object') {
        config.optimization.splitChunks.cacheGroups = {
          ...(config.optimization.splitChunks.cacheGroups || {}),
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
          },
        };
      }
    }
    
    return config;
  },
};

export default nextConfig;
