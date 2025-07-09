
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Add this line to disable image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The i18n object from next.config.js is for the Pages Router.
  // For App Router, i18n is typically handled by middleware and [locale] dynamic segments.
  // We will use middleware for routing.
  webpack: (config) => {
    config.externals.push({
      handlebars: 'commonjs handlebars',
    });
    // Genkit dependencies that are not needed in the browser.
    config.externals.push(
      '@opentelemetry/exporter-jaeger',
      '@opentelemetry/exporter-zipkin'
    );
    return config;
  },
};

export default nextConfig;
