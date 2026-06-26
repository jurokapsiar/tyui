import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';

export interface ProjectPaths {
  projectName: string;
  projectRoot: string;
  projectAbsRoot: string;
  distRoot: string;
}

export function resolveProjectPaths(context: ExecutorContext): ProjectPaths {
  const projectName = context.projectName;
  if (!projectName) throw new Error('Executor context is missing projectName.');

  const projectRoot = context.projectsConfigurations?.projects[projectName]?.root;
  if (!projectRoot) throw new Error(`Could not resolve root for project "${projectName}".`);

  return {
    projectName,
    projectRoot,
    projectAbsRoot: join(context.root, projectRoot),
    distRoot: join(context.root, 'dist', projectRoot),
  };
}
