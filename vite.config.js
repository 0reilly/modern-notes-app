import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine base path based on environment
  const basePath = mode === 'production' ? '/modern-notes-app/' : '/modern-notes-app-dev/'
  
  return {
    base: basePath,
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Bind to all network interfaces
      port: mode === 'production' ? 3002 : 3003,
      strictPort: true, // Don't try other ports if the specified port is taken
    },
    preview: {
      host: '0.0.0.0',
      port: mode === 'production' ? 3002 : 3003,
      strictPort: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.js'
    },
    define: {
      // Make environment variables available to the client
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
      'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE || 'Modern Notes App')
    }
  }
})