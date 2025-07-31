import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',          // Asegura que Vite use la carpeta raíz
  publicDir: 'public',// Tus assets siguen en public/
  build: {
    outDir: 'dist',   // Carpeta de salida estándar
    emptyOutDir: true,
  },
  plugins: [react()],
})
