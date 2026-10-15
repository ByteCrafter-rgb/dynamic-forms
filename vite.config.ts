/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /dynamic-forms/, dev server stays at /
  base: command === 'build' ? '/dynamic-forms/' : '/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
}));
