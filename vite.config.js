import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // During `npm run dev`, forward multiplayer traffic to `npm run serve` on port 8080
    proxy: { '/ws': { target: 'ws://localhost:8080', ws: true } },
  },
});
