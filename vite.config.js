import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  
  plugins: [react()],
  build:{
    outDir: "build"
  },
  resolve: {
    alias: [
      { find: '@userAuth', replacement: '/src/userAuth' },
      { find: '@components', replacement: '/src/components' },
      { find: '@theme', replacement: '/src/theme' },
      { find: '@schedules', replacement: '/src/schedules' },
    ],
  },
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
