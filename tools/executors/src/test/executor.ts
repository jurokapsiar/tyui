import { spawn } from 'node:child_process';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

export interface TestOptions {
  browser?: boolean;
  watch?: boolean;
  coverage?: boolean;
}

export default async function test(
  options: TestOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const args = ['run', '--passWithNoTests'];

  if (options.coverage) args.push('--coverage');
  if (options.watch) args.splice(0, 1);

  return new Promise((resolve) => {
    const child = spawn('vitest', args, {
      cwd: paths.projectAbsRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        TYUI_VITEST_BROWSER: options.browser ? '1' : '0',
      },
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => resolve({ success: code === 0 }));
    child.on('error', () => resolve({ success: false }));
  });
}
