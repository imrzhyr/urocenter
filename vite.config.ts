import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting';
import autoprefixer from 'autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindNesting,
        tailwindcss,
        autoprefixer
      ]
    }
  },
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    hmr: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/light/icon-192x192.png', 'icons/dark/icon-192x192.png', 'icons/light/icon-512x512.png', 'icons/dark/icon-512x512.png'],
      manifest: {
        name: 'UroCenter',
        short_name: 'UroCenter',
        description: 'Online Urology Consultation',
        theme_color: '#0066CC',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/light/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/light/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/light/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src")
      },
      {
        find: "react-native",
        replacement: "react-native-web"
      }
    ],
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"]
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('@tanstack') || id.includes('query')) {
              return 'vendor-query';
            }
            if (id.includes('agora-rtc')) {
              return 'vendor-agora';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('i18next') || id.includes('translation')) {
              return 'vendor-i18n';
            }
            if (id.includes('wavesurfer') || id.includes('audio') || id.includes('media')) {
              return 'vendor-media';
            }
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            if (id.includes('tailwind') || id.includes('css') || id.includes('style')) {
              return 'vendor-styles';
            }
            return 'vendor-other';
          }
          if (id.includes('/components/chat/')) {
            if (id.includes('/audio/') || id.includes('/video/')) {
              return 'feature-chat-media';
            }
            if (id.includes('/messages/')) {
              return 'feature-chat-messages';
            }
            return 'feature-chat-core';
          }
          if (id.includes('/components/dashboard/')) {
            return 'feature-dashboard';
          }
          if (id.includes('/components/auth/')) {
            return 'feature-auth';
          }
          return 'main';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild'
  }
});