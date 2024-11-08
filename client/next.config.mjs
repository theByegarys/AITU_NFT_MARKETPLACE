// next.config.js
const nextConfig = {
  images: {
    domains: ["ipfs.io", "gateway.pinata.cloud"],
  },
  i18n: {
    locales: ['en', 'kz', 'mn', 'ru'], // Add all the supported locales here
    defaultLocale: 'en', // Default language
  },
};

export default nextConfig;
