import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <- هذا مهم للـ SPA على Nginx
  build: {
    outDir: 'dist', // مكان ملفات البناء
  },
})
