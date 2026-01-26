import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://youtube.com https://www.gstatic.com",
              "connect-src 'self' https://www.youtube.com https://youtube.com https://googlevideo.com https://*.googlevideo.com",
              "img-src 'self' data: https: http:",
              "media-src 'self' https: http:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; '),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
