import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/utils/getReactNodeRef': ''
    }
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@mui/utils'] // Ensuring these are optimized
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
