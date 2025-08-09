
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  compress: true,
  
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
    // Excluir dependencias pesadas del bundle
    config.externals.push({
      handlebars: 'commonjs handlebars',
    });
    
    // Dependencias que no se necesitan en el browser
    config.externals.push(
      '@opentelemetry/exporter-jaeger',
      '@opentelemetry/exporter-zipkin',
      '@genkit-ai/core',
      '@genkit-ai/ai', 
      '@genkit-ai/flow',
      'firebase-admin',
      'firebase-functions'
    );

    return config;
  },
};

export default nextConfig;
