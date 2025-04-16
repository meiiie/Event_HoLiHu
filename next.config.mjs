/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wbygabwsqgvszpehwszj.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWdhYndzcWd2c3pwZWh3c3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODIwNDcsImV4cCI6MjA2MDI1ODA0N30._MMTef0lOVminPjzqZZQ-UXlbBNpou92xvGEYVkBS7A",
  },
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client", "@aws-sdk/client-s3"],
    optimizeCss: true,
  }
}

export default nextConfig
