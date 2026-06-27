import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

const allowedTopLevelKeys = new Set([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
  'requires',
]);

export default async function skillsValidate(
  _options: Record<string, never>,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const skillsDir = join(paths.projectAbsRoot, 'skills');

  if (!existsSync(skillsDir)) return { success: true };

  const errors: string[] = [];

  for (const dirent of await readdir(skillsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name.startsWith('_')) continue;

    const skillPath = join(skillsDir, dirent.name, 'SKILL.md');
    if (!existsSync(skillPath)) {
      errors.push(`${relative(context.root, skillPath)} is missing.`);
      continue;
    }

    validateSkill({
      text: await readFile(skillPath, 'utf8'),
      dirName: dirent.name,
      path: relative(context.root, skillPath),
      errors,
    });
  }

  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`skills-validate: ${error}\n`);
    return { success: false };
  }

  return { success: true };
}

function validateSkill(input: {
  text: string;
  dirName: string;
  path: string;
  errors: string[];
}): void {
  const lines = input.text.split(/\r?\n/);

  if (lines.length > 500) {
    input.errors.push(`${input.path} exceeds 500 lines.`);
  }

  if (lines[0] !== '---') {
    input.errors.push(`${input.path} must start with YAML frontmatter.`);
    return;
  }

  const end = lines.indexOf('---', 1);
  if (end === -1) {
    input.errors.push(`${input.path} is missing closing YAML frontmatter marker.`);
    return;
  }

  const frontmatter = lines.slice(1, end);
  const keys = new Set<string>();
  let metadataType: string | undefined;
  let hasRequires = false;

  for (const line of frontmatter) {
    const keyMatch = /^([A-Za-z0-9_-]+):/.exec(line);
    if (keyMatch) {
      const key = keyMatch[1]!;
      keys.add(key);
      if (!allowedTopLevelKeys.has(key)) {
        input.errors.push(`${input.path} uses unsupported frontmatter key "${key}".`);
      }
      if (key === 'requires') hasRequires = true;
    }

    const metadataTypeMatch = /^\s+type:\s*"?([A-Za-z0-9_-]+)"?/.exec(line);
    if (metadataTypeMatch) metadataType = metadataTypeMatch[1];
  }

  const name = scalarValue(frontmatter, 'name');
  const description = scalarValue(frontmatter, 'description');

  if (!name) input.errors.push(`${input.path} is missing required "name".`);
  else if (name !== input.dirName) {
    input.errors.push(
      `${input.path} name "${name}" must match parent directory "${input.dirName}".`,
    );
  } else if (!/^[a-z0-9-]{1,64}$/.test(name)) {
    input.errors.push(`${input.path} name must be [a-z0-9-] and <=64 characters.`);
  }

  if (!description) input.errors.push(`${input.path} is missing required "description".`);
  else if (description.length > 1024) {
    input.errors.push(`${input.path} description exceeds 1024 characters.`);
  }

  if (metadataType === 'framework' && !hasRequires) {
    input.errors.push(`${input.path} has metadata.type=framework and must declare requires.`);
  }
}

function scalarValue(frontmatter: string[], key: string): string | undefined {
  const line = frontmatter.find((entry) => entry.startsWith(`${key}:`));
  if (!line) return undefined;
  return line
    .slice(key.length + 1)
    .trim()
    .replace(/^["']|["']$/g, '');
}
