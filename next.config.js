
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    turbopack: {}, // Tells Next.js you've acknowledged the transition
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
          },
        },
      ],
    });
    return config;
  },
  
    reactStrictMode: true,
  
};



module.exports = nextConfig;
