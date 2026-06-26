import { spawn } from 'node:child_process';
import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

export default async function build(
  _options: Record<string, never>,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);

  return new Promise((resolve) => {
    const child = spawn('vite', ['build'], {
      cwd: paths.projectAbsRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        TYUI_OUT_DIR: paths.distRoot,
        TYUI_PROJECT_ROOT: paths.projectRoot,
      },
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => resolve({ success: code === 0 }));
    child.on('error', (err) => {
      process.stderr.write(`build executor: failed to run vite: ${err.message}\n`);
      process.stderr.write(`project root: ${join(context.root, paths.projectRoot)}\n`);
      resolve({ success: false });
    });
  });
}
