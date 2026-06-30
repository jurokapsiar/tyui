import { spawn } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { join, resolve as resolvePath } from 'node:path';
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

    child.on('exit', async (code) => {
      if (code !== 0) {
        resolve({ success: false });
        return;
      }

      const packageDistRoot = resolvePath(paths.projectAbsRoot, 'dist');
      if (resolvePath(paths.distRoot) !== packageDistRoot) {
        try {
          await rm(packageDistRoot, { recursive: true, force: true });
          await cp(paths.distRoot, packageDistRoot, { recursive: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          process.stderr.write(`build executor: failed to mirror dist output: ${message}\n`);
          process.stderr.write(`from: ${paths.distRoot}\n`);
          process.stderr.write(`to: ${packageDistRoot}\n`);
          resolve({ success: false });
          return;
        }
      }

      resolve({ success: true });
    });
    child.on('error', (err) => {
      process.stderr.write(`build executor: failed to run vite: ${err.message}\n`);
      process.stderr.write(`project root: ${join(context.root, paths.projectRoot)}\n`);
      resolve({ success: false });
    });
  });
}
