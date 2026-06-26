import { spawn, type ChildProcess } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export interface StartStorybookOptions {
  cwd: string;
  port: number;
  readyTimeoutMs?: number;
  env?: Record<string, string>;
}

export interface StorybookHandle {
  url: string;
  stop(): void;
}

export async function startStorybook(options: StartStorybookOptions): Promise<StorybookHandle> {
  const url = `http://localhost:${options.port}`;
  const bin = resolveStorybookBin(options.cwd);
  const child: ChildProcess = spawn(
    process.execPath,
    [bin, 'dev', '-p', String(options.port), '--no-open', '--ci', '--quiet', '--host', '0.0.0.0'],
    {
      cwd: options.cwd,
      stdio: 'inherit',
      env: options.env ? { ...process.env, ...options.env } : process.env,
    },
  );

  child.on('error', () => {
    // Readiness polling below surfaces startup failures.
  });

  try {
    await pollUntilOk(`${url}/index.json`, options.readyTimeoutMs ?? 60_000);
  } catch (error) {
    if (!child.killed) child.kill('SIGTERM');
    throw error;
  }

  return {
    url,
    stop: () => {
      if (!child.killed) child.kill('SIGTERM');
    },
  };
}

function resolveStorybookBin(cwd: string): string {
  const require = createRequire(join(cwd, 'package.json'));
  const pkgPath = require.resolve('storybook/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
    name: string;
    bin: string | Record<string, string>;
  };
  const binPath = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin[pkg.name];
  if (!binPath) throw new Error(`Could not resolve Storybook bin for "${pkg.name}".`);
  return join(dirname(pkgPath), binPath);
}

async function pollUntilOk(url: string, timeoutMs: number): Promise<void> {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (response.ok) return;
    } catch {
      // Storybook is still starting.
    } finally {
      clearTimeout(timeout);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Storybook did not become ready at ${url} within ${timeoutMs}ms.`);
}
