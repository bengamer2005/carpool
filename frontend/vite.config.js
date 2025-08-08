import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "y3b5x2-ip-189-175-119-183.tunnelmole.net"
    ]
  }
})
