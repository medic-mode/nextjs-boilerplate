
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    turbopack: {}, 
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
