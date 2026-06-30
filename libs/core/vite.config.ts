import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/core',
  plugins: [
    dts({
      entryRoot: 'src',
      outDirs: process.env.TYUI_OUT_DIR ?? 'dist',
      tsconfigPath: resolve(root, 'tsconfig.lib.json'),
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    }),
  ],
  resolve: {
    alias: workspaceAliases,
  },
  build: {
    outDir: process.env.TYUI_OUT_DIR ?? 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(root, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
  },
  test: {
    environment: 'node',
  },
});
