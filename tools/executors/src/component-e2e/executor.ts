import { createServer, type ViteDevServer } from 'vite';
import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { runInDocker } from '../shared/docker';
import { resolveProjectPaths } from '../shared/workspace-paths';

export interface ComponentE2eOptions {
  port: number;
  grep?: string;
}

export default async function componentE2e(
  options: ComponentE2eOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const native = process.env.VISUAL_NATIVE === '1';
  const server = await startViteFixtureServer(paths.projectAbsRoot, options.port, native);

  try {
    const isCI = process.env.CI === '1' || process.env.CI === 'true';
    const localUrl = `http://localhost:${options.port}`;
    const e2eUrl =
      native || isCI ? localUrl : localUrl.replace('localhost', 'host.docker.internal');
    const command = ['playwright', 'test', '--config=playwright.e2e.config.ts'];

    if (options.grep) command.push('--grep', options.grep);

    const success = await runInDocker({
      workspaceRoot: context.root,
      cwd: paths.projectRoot,
      command,
      env: {
        E2E_URL: e2eUrl,
      },
    });

    return { success };
  } finally {
    await server.close();
  }
}

async function startViteFixtureServer(
  root: string,
  port: number,
  native: boolean,
): Promise<ViteDevServer> {
  const server = await createServer({
    root,
    configFile: join(root, 'vite.config.ts'),
    server: {
      host: native ? '127.0.0.1' : '0.0.0.0',
      port,
      strictPort: true,
    },
  });

  await server.listen();
  server.printUrls();

  return server;
}
