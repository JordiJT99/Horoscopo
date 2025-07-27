const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  trailingSlash: true,
  swcMinify: true,
  compress: true,
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  serverExternalPackages: ['@genkit-ai/core', '@genkit-ai/ai', '@genkit-ai/flow'],
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  webpack: (config) => {
    config.externals.push({
      handlebars: 'commonjs handlebars',
    });
    
    config.externals.push(
      '@opentelemetry/exporter-jaeger',
      '@opentelemetry/exporter-zipkin',
      '@genkit-ai/core',
      '@genkit-ai/ai', 
      '@genkit-ai/flow',
      'firebase-admin',
      'firebase-functions'
    );

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 200000,
          },
        },
      },
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
