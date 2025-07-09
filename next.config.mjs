/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante o build (se houver)
    ignoreBuildErrors: true,
  },
  // Configurações para builds mais robustos
  experimental: {
    // Otimizações para build
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  // Configuração para produção
  output: 'standalone',
};

export default nextConfig;
