import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DiscordTool',
        short_name: 'DiscordTool',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#343a40',
        icons: [
          {
            src: 'https://i.imgur.com/Yow9X0v.jpeg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://i.imgur.com/Yow9X0v.jpeg',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../backend/public',
  },
  base: '/',
  define: {
    'process.env': process.env,
  },
})
