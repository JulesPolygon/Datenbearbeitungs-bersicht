import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [react()],
  build: {
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {},
  optimizeDeps: {
    exclude: ['@apollo/client', `graphql`],
    include: ['*/@portis/**'],
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      http: 'http-browserify',
      https: 'http-browserify',
      timers: 'timers-browserify',
      process: 'process',
    },
  },
})
