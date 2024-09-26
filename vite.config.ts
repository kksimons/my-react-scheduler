import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { 
    proxy: {
      // Proxying API requests to avoid CORS issues
      '/api': {
        target: 'http://localhost:80', // API server address
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
