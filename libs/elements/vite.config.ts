import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/elements',
  resolve: {
    alias: workspaceAliases,
  },
  build: {
    outDir: process.env.TYUI_OUT_DIR ?? 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(root, 'src/index.ts'),
        button: resolve(root, 'src/button/index.ts'),
        center: resolve(root, 'src/center/index.ts'),
        checkbox: resolve(root, 'src/checkbox/index.ts'),
        cluster: resolve(root, 'src/cluster/index.ts'),
        container: resolve(root, 'src/container/index.ts'),
        flex: resolve(root, 'src/flex/index.ts'),
        frame: resolve(root, 'src/frame/index.ts'),
        grid: resolve(root, 'src/grid/index.ts'),
        input: resolve(root, 'src/input/index.ts'),
        radio: resolve(root, 'src/radio/index.ts'),
        'radio-group': resolve(root, 'src/radio-group/index.ts'),
        sidebar: resolve(root, 'src/sidebar/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['@tyui/core'],
    },
  },
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, 'e2e/**/*.spec.ts'],
  },
});
