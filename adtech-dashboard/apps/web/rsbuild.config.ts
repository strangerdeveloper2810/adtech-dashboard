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
    title: 'AdTech Dashboard',
    // Signal fonts: Fraunces (display) + Geist / Geist Mono (sans + mono).
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
        },
      },
    ],
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
