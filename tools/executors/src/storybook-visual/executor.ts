import type { ExecutorContext } from '@nx/devkit';
import { runInDocker } from '../shared/docker';
import { startStorybook } from '../shared/storybook-server';
import { resolveProjectPaths } from '../shared/workspace-paths';
import storybookDocs from '../storybook-docs/executor';

export interface StorybookVisualOptions {
  port: number;
  themes: string[];
  viewports: Array<'narrow' | 'mobile' | 'tablet' | 'desktop'>;
  updateSnapshots: boolean;
}

const viewportSizes = {
  narrow: { width: 360, height: 720 },
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
};

export default async function storybookVisual(
  options: StorybookVisualOptions,
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
    const command = ['playwright', 'test', '--config=playwright.config.ts'];

    if (options.updateSnapshots) command.push('--update-snapshots');

    const success = await runInDocker({
      workspaceRoot: context.root,
      cwd: paths.projectRoot,
      command,
      env: {
        STORYBOOK_URL: storybookUrl,
        TYUI_VISUAL_THEMES: options.themes.join(','),
        TYUI_VISUAL_VIEWPORTS: JSON.stringify(
          options.viewports.map((key) => ({ key, ...viewportSizes[key] })),
        ),
        TYUI_VISUAL_MODE: 'visual',
      },
    });

    return { success };
  } finally {
    storybook.stop();
  }
}
