/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // avoids double-initialising WebGL in dev
  output: 'export',       // "npm run build" writes plain files to the out/ folder
};
export default nextConfig;
