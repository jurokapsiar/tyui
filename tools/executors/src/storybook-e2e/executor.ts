import type { ExecutorContext } from '@nx/devkit';
import { runInDocker } from '../shared/docker';
import { startStorybook } from '../shared/storybook-server';
import { resolveProjectPaths } from '../shared/workspace-paths';
import storybookDocs from '../storybook-docs/executor';

export interface StorybookE2eOptions {
  port: number;
  grep?: string;
}

export default async function storybookE2e(
  options: StorybookE2eOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const docs = await storybookDocs({}, context);
  if (!docs.success) return docs;

  const storybook = await startStorybook({ cwd: paths.projectAbsRoot, port: options.port });

  try {
    const isCI = process.env.CI === '1' || process.env.CI === 'true';
    const storybookUrl =
      process.env.VISUAL_NATIVE === '1' || isCI
        ? storybook.url
        : storybook.url.replace('localhost', 'host.docker.internal');
    const command = ['playwright', 'test', '--config=playwright.e2e.config.ts'];

    if (options.grep) command.push('--grep', options.grep);

    const success = await runInDocker({
      workspaceRoot: context.root,
      cwd: paths.projectRoot,
      command,
      env: {
        STORYBOOK_URL: storybookUrl,
      },
    });

    return { success };
  } finally {
    storybook.stop();
  }
}
