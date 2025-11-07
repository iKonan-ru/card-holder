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

const WORKBOX_GLOB_PATTERNS = ['**/*.{js,css,html,ico,png,svg,woff,woff2}'];

const GOOGLE_FONTS_CACHE_NAME = 'google-fonts-cache';
const GOOGLE_FONTS_URL_PATTERN = /^https:\/\/fonts\.googleapis\.com\/.*/i;
const CACHE_MAX_ENTRIES = 10;
const CACHE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const CACHE_STATUSES = [0, 200];

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['icon.svg', 'banks/**/*', 'payment-systems/**/*'],
  manifest: {
    name: 'Card Holder',
    short_name: 'Card Holder',
    description:
      'Приложение для управления банковскими картами с возможностью просмотра и копирования данных карт',
    theme_color: PWA_THEME_COLOR,
    background_color: PWA_BACKGROUND_COLOR,
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: PWA_ICONS,
  },
  workbox: {
    globPatterns: WORKBOX_GLOB_PATTERNS,
    runtimeCaching: [
      {
        urlPattern: GOOGLE_FONTS_URL_PATTERN,
        handler: 'CacheFirst',
        options: {
          cacheName: GOOGLE_FONTS_CACHE_NAME,
          expiration: {
            maxEntries: CACHE_MAX_ENTRIES,
            maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
          },
          cacheableResponse: {
            statuses: CACHE_STATUSES,
          },
        },
      },
    ],
  },
  devOptions: {
    enabled: true,
    type: 'module',
  },
};
