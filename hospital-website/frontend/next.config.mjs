/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.hopkinsmedicine.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'th-thumbnailer.cdn-si-edu.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'calhospital.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'qmedcenter.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'hips.hearstapps.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
