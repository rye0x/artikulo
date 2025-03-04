/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ignore watch errors for system files
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/DumpStack.log.tmp',
        '**/hiberfil.sys',
        '**/pagefile.sys',
        '**/swapfile.sys',
        'C:\\DumpStack.log.tmp',
        'C:\\hiberfil.sys',
        'C:\\pagefile.sys',
        'C:\\swapfile.sys',
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
