import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// const API_URL = "http://localhost:3333";
const API_URL = "https://chatbot-integration-api.vercel.app";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_URL,
        changeOrigin: true,
        ws: true,
        rewriteWsOrigin: true,
      }
    }
  }
})
