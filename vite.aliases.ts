import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AliasOptions } from 'vite';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

export const workspaceAliases: AliasOptions = [
  {
    find: /^@toyu-ui\/core$/,
    replacement: resolve(workspaceRoot, 'libs/core/src/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/button$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/button/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/center$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/center/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/checkbox/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/cluster$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/cluster/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/container$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/container/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/flex$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/flex/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/frame$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/frame/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/grid$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/grid/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/input$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/input/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/radio/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/radio-group/index.ts'),
  },
  {
    find: /^@toyu-ui\/elements\/sidebar$/,
    replacement: resolve(workspaceRoot, 'libs/elements/src/sidebar/index.ts'),
  },
  {
    find: /^@toyu-ui\/define$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/index.ts'),
  },
  {
    find: /^@toyu-ui\/define\/button$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/button.ts'),
  },
  {
    find: /^@toyu-ui\/define\/center$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/center.ts'),
  },
  {
    find: /^@toyu-ui\/define\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/checkbox.ts'),
  },
  {
    find: /^@toyu-ui\/define\/cluster$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/cluster.ts'),
  },
  {
    find: /^@toyu-ui\/define\/container$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/container.ts'),
  },
  {
    find: /^@toyu-ui\/define\/flex$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/flex.ts'),
  },
  {
    find: /^@toyu-ui\/define\/frame$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/frame.ts'),
  },
  {
    find: /^@toyu-ui\/define\/grid$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/grid.ts'),
  },
  {
    find: /^@toyu-ui\/define\/input$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/input.ts'),
  },
  {
    find: /^@toyu-ui\/define\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/radio.ts'),
  },
  {
    find: /^@toyu-ui\/define\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/radio-group.ts'),
  },
  {
    find: /^@toyu-ui\/define\/sidebar$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/sidebar.ts'),
  },
  {
    find: /^@toyu-ui\/define\/all$/,
    replacement: resolve(workspaceRoot, 'libs/define/src/all.ts'),
  },
  {
    find: /^@toyu-ui\/solid$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/index.ts'),
  },
  {
    find: /^@toyu-ui\/solid\/button$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/button.tsx'),
  },
  {
    find: /^@toyu-ui\/solid\/checkbox$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/checkbox.tsx'),
  },
  {
    find: /^@toyu-ui\/solid\/input$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/input.tsx'),
  },
  {
    find: /^@toyu-ui\/solid\/radio$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/radio.tsx'),
  },
  {
    find: /^@toyu-ui\/solid\/radio-group$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/radio-group.tsx'),
  },
  {
    find: /^@toyu-ui\/solid\/jsx$/,
    replacement: resolve(workspaceRoot, 'libs/solid/src/jsx.ts'),
  },
  {
    find: /^@toyu-ui\/testing$/,
    replacement: resolve(workspaceRoot, 'libs/testing/src/index.ts'),
  },
];
