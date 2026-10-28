import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import clarityLocalApi from './lib/clarity/vitePlugin.js'

export default defineConfig({
  plugins: [react(), clarityLocalApi()],
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api/customization-price-schema': {
        target: 'http://127.0.0.1:3004',
        changeOrigin: true,
      },
      '/api/customization-pricing': {
        target: 'http://127.0.0.1:3004',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://api.brandeduk.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://admin.brandeduk.com',
        },
      },
      '/assets': {
        target: 'https://api.brandeduk.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://admin.brandeduk.com',
        },
      },
      '/uploads': {
        target: 'https://api.brandeduk.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://admin.brandeduk.com',
        },
      }
    }
  }
})
