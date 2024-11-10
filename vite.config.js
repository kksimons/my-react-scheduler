import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  
  plugins: [react()],
<<<<<<< HEAD:vite.config.ts
  resolve: {
    alias: {
      '@mui/utils/getReactNodeRef': ''
    }
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@mui/utils'] // Ensuring these are optimized
=======
  build:{
    outDir: "build"
  },
  resolve: {
    alias: [
      { find: '@userAuth', replacement: '/src/userAuth' },
      { find: '@components', replacement: '/src/components' },
      { find: '@theme', replacement: '/src/theme' },
      { find: '@schedules', replacement: '/src/schedules' },
      { find: '@utils', replacement: '/src/utils' },
    ],
>>>>>>> 5c3315884a190c34384140881b91bfbb0c01d184:vite.config.js
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
