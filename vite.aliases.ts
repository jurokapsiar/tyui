import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AliasOptions } from 'vite';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

export const workspaceAliases: AliasOptions = [
  {
    find: /^@tyui\/core$/,
    replacement: resolve(workspaceRoot, 'libs/core/src/index.ts'),
  },
  {
    find: /^@tyui\/elements$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/index.ts'),
  },
  {
    find: /^@tyui\/elements\/button$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/button/index.ts'),
  },
  {
    find: /^@tyui\/define$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/index.ts'),
  },
  {
    find: /^@tyui\/define\/button$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/button.ts'),
  },
  {
    find: /^@tyui\/solid$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/index.ts'),
  },
  {
    find: /^@tyui\/solid\/button$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/button.tsx'),
  },
  {
    find: /^@tyui\/solid\/jsx$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/jsx.ts'),
  },
  {
    find: /^@tyui\/testing$/,
    replacement: resolve(workspaceRoot, 'libs/testing/src/index.ts'),
  },
];
