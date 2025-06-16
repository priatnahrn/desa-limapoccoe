/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://quiet-pans-appear.loca.lt/api/:path*' // Proxy to external API
            },
        ];
    }
};

export default nextConfig;
