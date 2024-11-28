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
                hostname: 's2.r29static.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.hollywoodreporter.com',
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
            {
                protocol: 'https',
                hostname: 'assets-auto.rbl.ms',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.bostonmagazine.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.closerweekly.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.wikia.nocookie.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'hips.hearstapps.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn1.edgedatg.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.ebayimg.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;

