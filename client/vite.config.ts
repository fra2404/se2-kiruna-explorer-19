import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    cors: {
      origin: 'https://se2-kiruna-explorer-19-1.onrender.com',
      credentials: true,
    },
    middlewareMode: false, // Usato solo per server locale
  },
  build: {
    outDir: 'dist', // Specifica la directory di output
  },
});