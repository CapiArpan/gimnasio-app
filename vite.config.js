import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',             // apunta a la carpeta raíz donde está index.html
  publicDir: 'public',   // tus assets siguen ahí (favicon, etc.)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
});
