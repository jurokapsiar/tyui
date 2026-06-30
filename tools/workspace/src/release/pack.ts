import { spawn } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  check,
  ensureReleaseDirs,
  packageInfos,
  parseOptions,
  readJson,
  runOrExit,
  tarballName,
  tarballRoot,
  writeJson,
  writeText,
  type CheckResult,
} from './shared';

interface PackFile {
  path: string;
}

interface PackResult {
  filename: string;
  files: PackFile[];
  name: string;
  version: string;
}

const options = parseOptions();
const checks: CheckResult[] = [];
const reports: Array<{ project: string; dryRun: PackResult[]; pack: PackResult[] }> = [];

async function npmPack(cwd: string, args: string[]): Promise<{ code: number; stdout: string }> {
  return new Promise((resolvePack) => {
    let stdout = '';
    const child = spawn('npm', ['pack', ...args], {
      cwd,
      stdio: ['ignore', 'pipe', 'inherit'],
      shell: process.platform === 'win32',
    });

    child.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.on('exit', (code) => resolvePack({ code: code ?? 1, stdout }));
    child.on('error', () => resolvePack({ code: 1, stdout }));
  });
}

function parsePackOutput(output: string): PackResult[] {
  return JSON.parse(output) as PackResult[];
}

await ensureReleaseDirs();
await rm(tarballRoot, { recursive: true, force: true });
await ensureReleaseDirs();

for (const pkg of packageInfos(options.packages)) {
  const dry = await npmPack(pkg.distRoot, ['--dry-run', '--json']);
  checks.push(
    check(
      `${pkg.project} npm pack dry-run`,
      dry.code === 0,
      `npm pack --dry-run --json in ${pkg.distRoot}`,
    ),
  );

  let dryRun: PackResult[] = [];
  try {
    dryRun = parsePackOutput(dry.stdout);
  } catch {
    checks.push(
      check(`${pkg.project} dry-run JSON`, false, 'npm pack --dry-run did not return JSON'),
    );
  }

  const files = dryRun.flatMap((result) => result.files.map((file) => file.path));
  const forbidden = files.filter((file) =>
    /(^|\/)(src|e2e|__visual_snapshots__|\.nx|node_modules|storybook-static|\.cache)\//.test(file),
  );
  checks.push(
    check(
      `${pkg.project} pack file list clean`,
      forbidden.length === 0,
      forbidden.length === 0
        ? `${pkg.packageName} dry-run contents are clean`
        : forbidden.join(', '),
    ),
  );

  const manifest = await readJson<{ exports?: Record<string, unknown>; types?: string }>(
    resolve(pkg.distRoot, 'package.json'),
  );
  const targetFiles = new Set(files);
  if (manifest.types)
    checks.push(
      check(
        `${pkg.project} types included`,
        targetFiles.has(manifest.types.slice(2)),
        manifest.types,
      ),
    );

  const exportsValue = manifest.exports ?? {};
  for (const value of Object.values(exportsValue)) {
    if (!value || typeof value !== 'object') continue;
    const conditions = value as Record<string, unknown>;
    for (const conditionValue of Object.values(conditions)) {
      if (typeof conditionValue !== 'string' || !conditionValue.startsWith('./')) continue;
      checks.push(
        check(
          `${pkg.project} packed export ${conditionValue}`,
          targetFiles.has(conditionValue.slice(2)),
          `${conditionValue} is included in npm pack output`,
        ),
      );
    }
  }

  const packed = await npmPack(pkg.distRoot, ['--json']);
  checks.push(
    check(`${pkg.project} npm pack`, packed.code === 0, `npm pack --json in ${pkg.distRoot}`),
  );

  let pack: PackResult[] = [];
  try {
    pack = parsePackOutput(packed.stdout);
  } catch {
    checks.push(check(`${pkg.project} pack JSON`, false, 'npm pack did not return JSON'));
  }

  for (const result of pack) {
    const expectedName = tarballName(pkg.project, options.version);
    checks.push(
      check(
        `${pkg.project} tarball version`,
        result.version === options.version && result.filename === expectedName,
        `${result.filename} for ${result.name}@${result.version}`,
      ),
    );
    await cp(resolve(pkg.distRoot, result.filename), resolve(tarballRoot, expectedName));
    await rm(resolve(pkg.distRoot, result.filename), { force: true });
  }

  reports.push({ project: pkg.project, dryRun, pack });
}

const reportLines = [
  `# TYUI pack report`,
  '',
  `Version: ${options.version}`,
  `Tag: ${options.tag}`,
  '',
  ...reports.flatMap((report) => [
    `## ${report.project}`,
    '',
    ...report.dryRun.flatMap((result) => result.files.map((file) => `- ${file.path}`)),
    '',
  ]),
];

await writeJson(resolve(tarballRoot, '../status/pack-output.json'), reports);
await writeText(resolve(tarballRoot, '../pack-report.md'), `${reportLines.join('\n')}\n`);
await runOrExit(checks, 'pack');
