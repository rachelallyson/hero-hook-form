import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#ui': path.resolve(__dirname, 'src/ui/ind.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
