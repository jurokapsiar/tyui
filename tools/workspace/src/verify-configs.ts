import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const requiredFiles = [
  'nx.json',
  'package.json',
  '.yarnrc.yml',
  'tsconfig.base.json',
  'tools/executors/executors.json',
  'pipelines/playwright.Dockerfile',
  'libs/elements/custom-elements.json',
  'llms.txt',
  'dist/ai/index.md',
  'dist/ai/llms.txt',
  'dist/ai/custom-elements.compact.json',
  'dist/ai/tokens.resolved.json',
  'dist/ai/context.json',
];

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const missing: string[] = [];

for (const file of requiredFiles) {
  try {
    await access(resolve(workspaceRoot, file));
  } catch {
    missing.push(file);
  }
}

if (missing.length > 0) {
  throw new Error(`Missing workspace configuration files: ${missing.join(', ')}`);
}

console.info('Workspace configuration files are present.');
