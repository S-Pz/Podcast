/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
//module.exports = nextConfig
module.exports = {
  //pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  images: {
    domains: ['storage.googleapis.com']
  }
}