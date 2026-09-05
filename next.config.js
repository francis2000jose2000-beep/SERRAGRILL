/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = require('path').resolve('./src');
    return config;
  },
  typescript: {
  },
};

module.exports = nextConfig;