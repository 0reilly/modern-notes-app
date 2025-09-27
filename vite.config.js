import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/modern-notes-app/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 3002,      // Use port 3002 for the app
    strictPort: true, // Don't try other ports if 3002 is taken
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js'
  }
})