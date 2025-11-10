import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://18.228.40.174:8080',
        changeOrigin: true,
      },
    },
    "rewrites": [
    { "source": "/api/(.*)", "destination": "https://18.228.40.174:8080/api/$1" }
    ]
  },
})
