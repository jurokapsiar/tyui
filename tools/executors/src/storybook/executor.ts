import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';
import storybookDocs from '../storybook-docs/executor';

export interface StorybookOptions {
  framework: 'web-components' | 'solid';
  port: number;
  mode: 'dev' | 'build';
}

export default async function storybook(
  options: StorybookOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const docs = await storybookDocs({}, context);
  if (!docs.success) return docs;

  const args =
    options.mode === 'dev' ? ['dev', '-p', String(options.port), '--no-open'] : ['build'];
  const storybookBin = resolveStorybookBin(paths.projectAbsRoot);

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [storybookBin, ...args], {
      cwd: paths.projectAbsRoot,
      stdio: 'inherit',
    });

    child.on('exit', (code) => resolve({ success: code === 0 }));
    child.on('error', () => resolve({ success: false }));
  });
}

function resolveStorybookBin(projectRoot: string): string {
  const require = createRequire(join(projectRoot, 'package.json'));
  const pkgPath = require.resolve('storybook/package.json');
  const pkg = require('storybook/package.json') as {
    name: string;
    bin: string | Record<string, string>;
  };
  const binPath = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin[pkg.name];
  if (!binPath) throw new Error(`Could not resolve bin entry for "${pkg.name}".`);
  return join(dirname(pkgPath), binPath);
}
