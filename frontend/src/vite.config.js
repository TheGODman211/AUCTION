import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
  },
     esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/, // Treat all .js files in /src as JSX
  },
});
