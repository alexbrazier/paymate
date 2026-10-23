// @ts-check

/**
 * @type {import('next/dist/server/config').NextConfig}
 **/
const config = {
  output: 'standalone',
  poweredByHeader: false,
  compress: false,
  sassOptions: {
    // Allow `@import 'src/...'` relative to the project root
    loadPaths: [__dirname],
  },
};

module.exports = config;
