/** @type {import('next').NextConfig} */
const staticPreview = process.env.SWIFT_STATIC_EXPORT === '1' || process.env.SITES_MANAGED_LINUX_CONTAINER === '1';
const nextConfig = {
  output: staticPreview ? 'export' : 'standalone',
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: staticPreview },
};
export default nextConfig;
