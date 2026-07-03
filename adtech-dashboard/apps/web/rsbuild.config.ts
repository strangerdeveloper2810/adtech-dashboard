import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute path to the monorepo `packages/` dir so Rsbuild transpiles the
// raw-TS JIT workspace packages (@adtech/*) that ship no build step.
const packagesDir = path.resolve(__dirname, '../../packages');

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    // Transpile workspace packages (their `src` is raw TS, no dist).
    include: [
      {
        and: [packagesDir, { not: /[\\/]node_modules[\\/]/ }],
      },
    ],
  },
  html: {
    // Fonts are self-hosted via @fontsource (imported in src/index.tsx).
    title: 'AdTech Dashboard',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
});
