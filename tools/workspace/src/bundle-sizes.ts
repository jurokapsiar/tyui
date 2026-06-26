import { readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const distRoot = resolve(workspaceRoot, 'dist');

async function collectFiles(dir: string): Promise<Array<{ file: string; size: number }>> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return collectFiles(path);
        if (!entry.isFile() || !entry.name.endsWith('.js')) return [];
        const info = await stat(path);
        return [{ file: relative(workspaceRoot, path), size: info.size }];
      }),
    );

    return files.flat();
  } catch {
    return [];
  }
}

const files = await collectFiles(distRoot);

if (files.length === 0) {
  console.info('No built JavaScript bundles found under dist/.');
} else {
  for (const file of files.sort((a, b) => a.file.localeCompare(b.file))) {
    console.info(`${file.file} ${file.size} bytes`);
  }
}
