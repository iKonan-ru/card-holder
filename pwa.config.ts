import type { VitePWAOptions } from 'vite-plugin-pwa';

const PWA_THEME_COLOR = '#192032';
const PWA_BACKGROUND_COLOR = '#192032';

const PWA_ICONS = [
  {
    src: 'icons/pwa-64x64.png',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: 'icons/pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'icons/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: 'icons/maskable-icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
];

const WORKBOX_GLOB_PATTERNS = ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'];

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: [
    'icon.svg',
    'banks/**/*',
    'payment-systems/**/*',
    'fonts/**/*',
  ],
  manifest: {
    name: 'Card Holder',
    short_name: 'Card Holder',
    description:
      'Приложение для управления банковскими картами с возможностью просмотра и копирования данных карт',
    theme_color: PWA_THEME_COLOR,
    background_color: PWA_BACKGROUND_COLOR,
    display: 'standalone',
    orientation: 'any',
    scope: '/',
    start_url: '/',
    icons: PWA_ICONS,
  },
  workbox: {
    globPatterns: WORKBOX_GLOB_PATTERNS,
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  },
  devOptions: {
    enabled: true,
    type: 'module',
  },
};
