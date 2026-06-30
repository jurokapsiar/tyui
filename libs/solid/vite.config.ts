import { copyFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
import { workspaceAliases } from '../../vite.aliases';

const root = dirname(fileURLToPath(import.meta.url));
const outDirs = process.env.TYUI_OUT_DIR ?? 'dist';

function rewriteSolidDeclarationImports(content: string): string {
  return content
    .replaceAll(
      /from ['"]\.\.\/\.\.\/elements\/src\/([^/]+)\/index\.ts['"]/g,
      "from '@toyu-ui/elements/$1'",
    )
    .replaceAll(/from ['"]\.\.\/\.\.\/define\/src\/index\.ts['"]/g, "from '@toyu-ui/define'")
    .replaceAll(
      /from ['"]\.\.\/\.\.\/\.\.\/define\/src\/([^'"/]+)\.ts['"]/g,
      "from '@toyu-ui/define/$1'",
    );
}

export default defineConfig({
  root,
  cacheDir: '../../node_modules/.vite/libs/solid',
  plugins: [
    solid(),
    dts({
      entryRoot: 'src',
      outDirs,
      tsconfigPath: resolve(root, 'tsconfig.lib.json'),
      compilerOptions: {
        paths: {},
      },
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/*.spec.tsx', 'src/**/*.test.tsx'],
      beforeWriteFile(filePath, content) {
        return {
          filePath,
          content: rewriteSolidDeclarationImports(content),
        };
      },
    }),
    {
      name: 'tyui-solid-custom-elements-manifest',
      async closeBundle() {
        await mkdir(resolve(root, outDirs), { recursive: true });
        await copyFile(
          resolve(root, 'custom-elements.json'),
          resolve(root, outDirs, 'custom-elements.json'),
        );
      },
    },
  ],
  resolve: {
    alias: workspaceAliases,
  },
  build: {
    outDir: outDirs,
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
        define: resolve(root, 'src/define.ts'),
        'define/button': resolve(root, 'src/define/button.ts'),
        'define/center': resolve(root, 'src/define/center.ts'),
        'define/checkbox': resolve(root, 'src/define/checkbox.ts'),
        'define/cluster': resolve(root, 'src/define/cluster.ts'),
        'define/container': resolve(root, 'src/define/container.ts'),
        'define/flex': resolve(root, 'src/define/flex.ts'),
        'define/frame': resolve(root, 'src/define/frame.ts'),
        'define/grid': resolve(root, 'src/define/grid.ts'),
        'define/input': resolve(root, 'src/define/input.ts'),
        'define/radio': resolve(root, 'src/define/radio.ts'),
        'define/radio-group': resolve(root, 'src/define/radio-group.ts'),
        'define/sidebar': resolve(root, 'src/define/sidebar.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        '@toyu-ui/define',
        '@toyu-ui/define/all',
        '@toyu-ui/define/button',
        '@toyu-ui/define/center',
        '@toyu-ui/define/checkbox',
        '@toyu-ui/define/cluster',
        '@toyu-ui/define/container',
        '@toyu-ui/define/flex',
        '@toyu-ui/define/frame',
        '@toyu-ui/define/grid',
        '@toyu-ui/define/input',
        '@toyu-ui/define/radio',
        '@toyu-ui/define/radio-group',
        '@toyu-ui/define/sidebar',
        '@toyu-ui/elements',
        '@toyu-ui/elements/button',
        '@toyu-ui/elements/checkbox',
        '@toyu-ui/elements/input',
        '@toyu-ui/elements/radio',
        '@toyu-ui/elements/radio-group',
        'solid-js',
        'solid-js/web',
      ],
    },
  },
  test: {
    environment: 'happy-dom',
  },
});
