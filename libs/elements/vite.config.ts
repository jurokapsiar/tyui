import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));
const componentEntries = [
  'button',
  'center',
  'checkbox',
  'cluster',
  'container',
  'flex',
  'frame',
  'grid',
  'input',
  'radio',
  'radio-group',
  'sidebar',
] as const;

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/elements',
  plugins: [
    dts({
      entryRoot: 'src',
      outDirs: process.env.TYUI_OUT_DIR ?? 'dist',
      tsconfigPath: resolve(root, 'tsconfig.lib.json'),
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/**/*.stories.ts',
        'src/generated/**/*',
      ],
      beforeWriteFile(filePath, content) {
        for (const entryName of componentEntries) {
          const suffix = `/${entryName}/index.d.ts`;
          if (filePath.endsWith(suffix)) {
            return {
              filePath: filePath.slice(0, -suffix.length) + `/${entryName}.d.ts`,
              content: content
                .replaceAll(`'./`, `'./${entryName}/`)
                .replaceAll(`"./`, `"./${entryName}/`),
            };
          }
        }

        return { filePath, content };
      },
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
      external: ['@toyu-ui/core'],
    },
  },
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, 'e2e/**/*.spec.ts'],
  },
});
