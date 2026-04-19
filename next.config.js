/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
  },
  i18n: {
    locales: ['pt-BR', 'es-ES', 'en-US', 'de-DE', 'it-IT', 'fr-FR', 'zh-CN'],
    defaultLocale: 'pt-BR',
  },
};

export default nextConfig;
