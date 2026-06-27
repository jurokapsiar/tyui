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
    find: /^@tyui\/elements\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/checkbox/index.ts'),
  },
  {
    find: /^@tyui\/elements\/input$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/input/index.ts'),
  },
  {
    find: /^@tyui\/elements\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/radio/index.ts'),
  },
  {
    find: /^@tyui\/elements\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/radio-group/index.ts'),
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
    find: /^@tyui\/define\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/checkbox.ts'),
  },
  {
    find: /^@tyui\/define\/input$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/input.ts'),
  },
  {
    find: /^@tyui\/define\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/radio.ts'),
  },
  {
    find: /^@tyui\/define\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/radio-group.ts'),
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
    find: /^@tyui\/solid\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/checkbox.tsx'),
  },
  {
    find: /^@tyui\/solid\/input$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/input.tsx'),
  },
  {
    find: /^@tyui\/solid\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/radio.tsx'),
  },
  {
    find: /^@tyui\/solid\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/radio-group.tsx'),
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
