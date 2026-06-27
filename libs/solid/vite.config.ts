import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/solid',
  plugins: [solid()],
  resolve: {
    alias: workspaceAliases,
  },
  build: {
    outDir: process.env.TYUI_OUT_DIR ?? 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(root, 'src/index.ts'),
        button: resolve(root, 'src/button.tsx'),
        checkbox: resolve(root, 'src/checkbox.tsx'),
        input: resolve(root, 'src/input.tsx'),
        radio: resolve(root, 'src/radio.tsx'),
        'radio-group': resolve(root, 'src/radio-group.tsx'),
        jsx: resolve(root, 'src/jsx.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        '@tyui/define',
        '@tyui/define/button',
        '@tyui/define/checkbox',
        '@tyui/define/input',
        '@tyui/define/radio',
        '@tyui/define/radio-group',
        '@tyui/elements',
        '@tyui/elements/button',
        '@tyui/elements/checkbox',
        '@tyui/elements/input',
        '@tyui/elements/radio',
        '@tyui/elements/radio-group',
        'solid-js',
        'solid-js/web',
      ],
    },
  },
  test: {
    environment: 'happy-dom',
  },
});
