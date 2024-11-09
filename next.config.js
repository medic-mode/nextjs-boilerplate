
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // Optional settings, e.g., icon: true for optimizing as icons
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
