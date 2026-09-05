/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = require('path').resolve('./src');
    return config;
  },
  typescript: {
    // Ensure path aliases are resolved correctly
    configPath: './tsconfig.json',
  },
};

module.exports = nextConfig;