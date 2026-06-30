import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type ReleasePackageName = 'core' | 'elements' | 'define' | 'solid' | 'testing';
export type ReleaseStatus = 'pass' | 'fail' | 'skip';

export interface CheckResult {
  name: string;
  status: ReleaseStatus;
  message: string;
}

export interface ReleaseOptions {
  version: string;
  tag: string;
  packages: ReleasePackageName[];
  dryRun: boolean;
  skipHeavy: boolean;
}

export interface PackageInfo {
  project: ReleasePackageName;
  packageName: string;
  projectRoot: string;
  distRoot: string;
}

export const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
export const releaseRoot = resolve(workspaceRoot, 'dist/release');
export const statusRoot = resolve(releaseRoot, 'status');
export const tarballRoot = resolve(releaseRoot, 'tarballs');

const packageOrder: ReleasePackageName[] = ['core', 'elements', 'define', 'solid', 'testing'];

export function parseOptions(argv = process.argv.slice(2)): ReleaseOptions {
  const parsed = new Map<string, string | boolean>();

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, rawValue] = arg.slice(2).split('=', 2);
    if (!key) continue;
    parsed.set(key, rawValue ?? true);
  }

  const packages = String(parsed.get('packages') ?? 'core,elements,define,solid')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean) as ReleasePackageName[];

  const sortedPackages = packageOrder.filter((pkg) => packages.includes(pkg));

  return {
    version: String(
      parsed.get('release-version') ??
        parsed.get('releaseVersion') ??
        parsed.get('version') ??
        '0.1.0',
    ),
    tag: String(parsed.get('tag') ?? 'next'),
    packages: sortedPackages.length > 0 ? sortedPackages : ['core', 'elements', 'define', 'solid'],
    dryRun: parsed.get('dry-run') === 'true',
    skipHeavy: parsed.get('skip-heavy') === 'true',
  };
}

export function packageInfos(packages: ReleasePackageName[]): PackageInfo[] {
  return packages.map((project) => ({
    project,
    packageName: `@toyu-ui/${project}`,
    projectRoot: resolve(workspaceRoot, 'libs', project),
    distRoot: resolve(workspaceRoot, 'dist/libs', project),
  }));
}

export async function ensureReleaseDirs(): Promise<void> {
  await mkdir(statusRoot, { recursive: true });
  await mkdir(tarballRoot, { recursive: true });
}

export async function writeStatus(name: string, checks: CheckResult[]): Promise<void> {
  await ensureReleaseDirs();
  const status = checks.every((check) => check.status !== 'fail') ? 'pass' : 'fail';
  await writeJson(resolve(statusRoot, `${name}.json`), {
    status,
    checks,
    updatedAt: new Date().toISOString(),
  });
}

export async function readStatus(name: string): Promise<CheckResult[]> {
  try {
    const data = JSON.parse(await readFile(resolve(statusRoot, `${name}.json`), 'utf8')) as {
      checks?: CheckResult[];
    };
    return data.checks ?? [];
  } catch {
    return [
      {
        name,
        status: 'fail',
        message: `missing dist/release/status/${name}.json`,
      },
    ];
  }
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function writeText(path: string, value: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value);
}

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function listFiles(root: string): Promise<string[]> {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const path = join(root, entry.name);
        if (entry.isDirectory()) return listFiles(path);
        if (!entry.isFile()) return [];
        return [relative(root, path)];
      }),
    );
    return files.flat().sort();
  } catch {
    return [];
  }
}

export async function listFilesRelative(root: string): Promise<string[]> {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const path = join(root, entry.name);
        if (entry.isDirectory()) {
          return (await listFilesRelative(path)).map((file) => join(entry.name, file));
        }
        if (!entry.isFile()) return [];
        return [entry.name];
      }),
    );
    return files.flat().sort();
  } catch {
    return [];
  }
}

export async function copyIfExists(from: string, to: string): Promise<boolean> {
  if (!(await exists(from))) return false;
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
  return true;
}

export function publishCommand(options: ReleaseOptions): string {
  return packageInfos(options.packages)
    .map((pkg) => `npm publish dist/libs/${pkg.project} --access public --tag ${options.tag}`)
    .join(' && ');
}

export function tarballName(pkg: ReleasePackageName, version: string): string {
  const packageName = packageInfos([pkg])[0]?.packageName ?? `@toyu-ui/${pkg}`;
  return `${packageName.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
}

export async function runStep(
  name: string,
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; allowFailure?: boolean } = {},
): Promise<CheckResult> {
  const cwd = options.cwd ?? workspaceRoot;
  const display = [command, ...args].join(' ');
  console.info(`\n$ ${display}`);

  const code = await new Promise<number>((resolveExit) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, ...options.env },
      shell: process.platform === 'win32',
    });

    child.on('exit', (exitCode) => resolveExit(exitCode ?? 1));
    child.on('error', () => resolveExit(1));
  });

  if (code !== 0 && !options.allowFailure) {
    return { name, status: 'fail', message: `${display} failed with exit code ${code}` };
  }

  return {
    name,
    status: code === 0 ? 'pass' : 'fail',
    message: code === 0 ? display : `${display} failed with exit code ${code}`,
  };
}

export async function runOrExit(checks: CheckResult[], statusName: string): Promise<void> {
  await writeStatus(statusName, checks);

  const failed = checks.filter((check) => check.status === 'fail');
  if (failed.length > 0) {
    for (const check of failed) console.error(`✘ ${check.name}: ${check.message}`);
    process.exitCode = 1;
  }
}

export function check(name: string, condition: boolean, message: string): CheckResult {
  return { name, status: condition ? 'pass' : 'fail', message };
}

export function skip(name: string, message: string): CheckResult {
  return { name, status: 'skip', message };
}
