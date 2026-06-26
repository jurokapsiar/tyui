import { createServer } from 'vite';
import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

export interface ServeOptions {
  port: number;
}

export default async function serve(
  options: ServeOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const server = await createServer({
    root: paths.projectAbsRoot,
    configFile: join(paths.projectAbsRoot, 'vite.config.ts'),
    server: {
      port: options.port,
    },
  });

  await server.listen();
  server.printUrls();

  return new Promise<{ success: boolean }>((resolve) => {
    const shutdown = async () => {
      await server.close();
      resolve({ success: true });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });
}
