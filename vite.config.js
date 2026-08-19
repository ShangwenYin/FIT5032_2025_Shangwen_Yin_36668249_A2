import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/FIT5032_2025_Shangwen_Yin_36668249_A2/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MindWell Connect',
        short_name: 'MindWell',
        theme_color: '#1a73e8',
        background_color: '#f8f9fa',
        display: 'standalone',
        start_url: '/'
      }
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
})
