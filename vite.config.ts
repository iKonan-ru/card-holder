import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfig } from './pwa.config';

export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {},
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/test/**',
        '**/*.less',
        '**/assets/**',
        '**/data/**',
      ],
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
});
