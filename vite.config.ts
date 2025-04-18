import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow the ngrok host
    allowedHosts: [
      "42d2-102-215-76-178.ngrok-free.app",
      // Add more hosts if needed (e.g., "*.ngrok-free.app")
    ],
    // Optional: Disable or configure HMR (Hot Module Replacement) for ngrok
    hmr: {
      clientPort: 443, // Helps with WebSocket connection via ngrok
    },
  },
})