import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    allowedHosts: ['phinma.loca.lt','6c4d-175-176-84-12.ngrok-free.app','lazy-rat-41.loca.lt','localhost']
  }
})
