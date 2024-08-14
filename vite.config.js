import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add this build configuration:
  build: {
    rollupOptions: {
      output: {
        format: 'es', // Change the output format to 'es'
      }
    }
  }
})
