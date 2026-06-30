import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/define',
  plugins: [
    dts({
      entryRoot: 'src',
      outDirs: process.env.TYUI_OUT_DIR ?? 'dist',
      tsconfigPath: resolve(root, 'tsconfig.lib.json'),
      compilerOptions: {
        paths: {},
      },
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
      entry: {
        index: resolve(root, 'src/index.ts'),
        button: resolve(root, 'src/button.ts'),
        center: resolve(root, 'src/center.ts'),
        checkbox: resolve(root, 'src/checkbox.ts'),
        cluster: resolve(root, 'src/cluster.ts'),
        container: resolve(root, 'src/container.ts'),
        flex: resolve(root, 'src/flex.ts'),
        frame: resolve(root, 'src/frame.ts'),
        grid: resolve(root, 'src/grid.ts'),
        input: resolve(root, 'src/input.ts'),
        radio: resolve(root, 'src/radio.ts'),
        'radio-group': resolve(root, 'src/radio-group.ts'),
        sidebar: resolve(root, 'src/sidebar.ts'),
        all: resolve(root, 'src/all.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        '@toyu-ui/elements',
        '@toyu-ui/elements/button',
        '@toyu-ui/elements/center',
        '@toyu-ui/elements/checkbox',
        '@toyu-ui/elements/cluster',
        '@toyu-ui/elements/container',
        '@toyu-ui/elements/flex',
        '@toyu-ui/elements/frame',
        '@toyu-ui/elements/grid',
        '@toyu-ui/elements/input',
        '@toyu-ui/elements/radio',
        '@toyu-ui/elements/radio-group',
        '@toyu-ui/elements/sidebar',
      ],
    },
  },
  test: {
    environment: 'happy-dom',
  },
});
