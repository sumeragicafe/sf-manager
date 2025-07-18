import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0',
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://host.docker.internal:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
        // Aqui a rota /api continua igual; você pode ajustar caso queira
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
