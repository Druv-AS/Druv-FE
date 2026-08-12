import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxying keeps the browser on one origin in development, so the session cookie is
    // first-party and CORS never applies. Leave VITE_BACKEND_URL empty locally to use it.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
  build: {
    // Source maps make production stack traces readable. They are separate files, so they
    // are only fetched when devtools is open.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split the vendor bundle so app changes do not invalidate the React chunk.
        manualChunks: {
          react: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
