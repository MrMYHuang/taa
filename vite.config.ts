import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/taa/' : '/',
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectRegister: null,
      injectManifest: {
        swSrc: 'src/service-worker.ts',
        swDest: 'service-worker.js',
      },
    }),
  ],
  resolve: {
    alias: {
      fs: 'memfs-myh',
    },
  },
  define: {
    'process.env': {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
}));
