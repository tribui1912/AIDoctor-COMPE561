/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    images: {
        domains: [ /// Change to custom CDN when deployed
            'www.hopkinsmedicine.org',
            'th-thumbnailer.cdn-si-edu.com',
            'calhospital.org',
            'qmedcenter.com',
            'hips.hearstapps.com',
            'images.pexels.com'
        ],
    },
};

export default nextConfig;
