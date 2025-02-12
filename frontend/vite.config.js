import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500, // ✅ Run on port 5500
    strictPort: true, // ✅ Prevent it from switching to another port if 5500 is busy
    open: false, // ✅ Automatically open the browser
  },
})
