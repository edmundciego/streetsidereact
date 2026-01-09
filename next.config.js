const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  // Exclude Firebase messaging SW from being overwritten
  publicExcludes: ['!firebase-messaging-sw.js'],
  
  // Exclude non-existent Next.js 15 files from precaching
  buildExcludes: [/dynamic-css-manifest\.json$/],
  
  // Fallback page when offline
  fallbacks: {
    document: '/offline',
  },
  
  // Runtime caching strategies
  runtimeCaching: [
    // Prioritize Category Images (served via Next.js Image Optimization or direct)
    {
      urlPattern: ({ url }) => {
        const isNextImage = url.pathname.startsWith('/_next/image') && url.searchParams.get('url')?.includes('category');
        const isDirectCategory = url.pathname.includes('category') && /\.(?:png|jpg|jpeg|webp|gif|svg|ico)$/i.test(url.pathname);
        return isNextImage || isDirectCategory;
      },
      handler: 'CacheFirst',
      options: {
        cacheName: 'category-image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 2592000, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Config API - critical, refresh in background
    {
      urlPattern: /\/api\/v1\/config$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'config-cache',
        expiration: {
          maxAgeSeconds: 300, // 5 minutes
        },
      },
    },
    // Static API data (categories, modules, landing page)
    {
      urlPattern: /\/api\/v1\/(categories|module|react-landing-page)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 600, // 10 minutes
        },
      },
    },
    // Dynamic product/store data
    {
      urlPattern: /\/api\/v1\/(items|stores|banners|campaigns|flash-sales)/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'dynamic-api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 300, // 5 minutes
        },
      },
    },
    // Images from any CDN (Cloudflare, S3, etc.)
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|gif|svg|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 86400, // 24 hours
        },
      },
    },
    // Google Fonts stylesheets
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    // Google Fonts webfont files
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 31536000, // 1 year
        },
      },
    },
    // Static assets (JS, CSS)
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 86400, // 24 hours
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn, remove log, info, debug, etc.
    } : false,
  },
  images: {
    // Use modern formats (WebP/AVIF)
    formats: ['image/avif', 'image/webp'],
    
    // Define device sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    
    // Define image sizes for smaller images (thumbnails, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache optimized images longer
    minimumCacheTTL: 86400, // 24 hours
    
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // allows all https domains
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // allows all https domains
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [
//       "bjorn66.com",
//       "6ammart-test.6amdev.xyz",
//       "192.168.50.168",
//       "6ammart-dev.6amdev.xyz",
//     ], // Add the domain here
//   },
// };
//
// module.exports = nextConfig;
