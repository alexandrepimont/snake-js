import { defineConfig } from 'vite';

export default defineConfig({
  worker: {
    format: 'es',
    rollupOptions: {
      external: [/cdn\.jsdelivr\.net/],
    },
  },
});
