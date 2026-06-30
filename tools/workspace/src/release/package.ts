import { cp, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  check,
  copyIfExists,
  listFilesRelative,
  packageInfos,
  parseOptions,
  readJson,
  runOrExit,
  workspaceRoot,
  type CheckResult,
} from './shared';

type JsonObject = Record<string, unknown>;

const options = parseOptions();
const checks: CheckResult[] = [];

function rewritePath(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.replace(/^\.\/dist\//, './');
}

function rewriteExports(exportsValue: unknown): unknown {
  if (!exportsValue || typeof exportsValue !== 'object') return exportsValue;

  const rewritten: JsonObject = {};
  for (const [key, value] of Object.entries(exportsValue as JsonObject)) {
    if (typeof value === 'string') {
      rewritten[key] = rewritePath(value);
      continue;
    }

    if (!value || typeof value !== 'object') {
      rewritten[key] = value;
      continue;
    }

    const conditions: JsonObject = {};
    for (const [condition, conditionValue] of Object.entries(value as JsonObject)) {
      conditions[condition] = rewritePath(conditionValue);
    }
    rewritten[key] = conditions;
  }

  return rewritten;
}

function exportTargets(exportsValue: unknown): string[] {
  const targets: string[] = [];
  if (!exportsValue || typeof exportsValue !== 'object') return targets;

  for (const value of Object.values(exportsValue as JsonObject)) {
    if (typeof value === 'string') {
      targets.push(value);
      continue;
    }
    if (!value || typeof value !== 'object') continue;
    for (const conditionValue of Object.values(value as JsonObject)) {
      if (typeof conditionValue === 'string') targets.push(conditionValue);
    }
  }

  return targets.filter((target) => target.startsWith('./'));
}

for (const pkg of packageInfos(options.packages)) {
  const sourceManifest = await readJson<JsonObject>(resolve(pkg.projectRoot, 'package.json'));
  const outputManifest: JsonObject = {
    ...sourceManifest,
    version: options.version,
    private: false,
    types: rewritePath(sourceManifest.types),
    main: rewritePath(sourceManifest.main),
    module: rewritePath(sourceManifest.module),
    exports: rewriteExports(sourceManifest.exports),
    publishConfig: { access: 'public' },
  };
  delete outputManifest.files;

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const deps = outputManifest[field];
    if (!deps || typeof deps !== 'object') continue;

    const nextDeps: JsonObject = {};
    for (const [name, range] of Object.entries(deps as JsonObject)) {
      nextDeps[name] =
        typeof range === 'string' && range.startsWith('workspace:') ? `^${options.version}` : range;
    }
    outputManifest[field] = nextDeps;
  }

  const devDependencies = outputManifest.devDependencies;
  if (devDependencies && typeof devDependencies === 'object') {
    for (const [name, range] of Object.entries(devDependencies as JsonObject)) {
      if (typeof range === 'string' && range.startsWith('workspace:'))
        delete (devDependencies as JsonObject)[name];
    }
  }

  await mkdir(pkg.distRoot, { recursive: true });
  await writeFile(
    resolve(pkg.distRoot, 'package.json'),
    `${JSON.stringify(outputManifest, null, 2)}\n`,
  );
  await cp(resolve(workspaceRoot, 'README.md'), resolve(pkg.distRoot, 'README.md'));
  await cp(resolve(workspaceRoot, 'LICENSE'), resolve(pkg.distRoot, 'LICENSE'));

  if (pkg.project === 'elements') {
    await cp(
      resolve(workspaceRoot, 'libs/elements/custom-elements.json'),
      resolve(pkg.distRoot, 'custom-elements.json'),
    );
    await copyIfExists(
      resolve(workspaceRoot, 'libs/elements/skills'),
      resolve(pkg.distRoot, 'skills'),
    );
  }

  if (pkg.project === 'solid') {
    await cp(
      resolve(workspaceRoot, 'libs/solid/custom-elements.json'),
      resolve(pkg.distRoot, 'custom-elements.json'),
    );
    await copyIfExists(
      resolve(workspaceRoot, 'libs/solid/skills'),
      resolve(pkg.distRoot, 'skills'),
    );
  }

  const files = new Set(await listFilesRelative(pkg.distRoot));
  checks.push(
    check(
      `${pkg.project} package.json`,
      files.has('package.json'),
      `${pkg.packageName} has package.json`,
    ),
  );
  checks.push(
    check(`${pkg.project} README`, files.has('README.md'), `${pkg.packageName} has README.md`),
  );
  checks.push(
    check(`${pkg.project} LICENSE`, files.has('LICENSE'), `${pkg.packageName} has LICENSE`),
  );
  checks.push(
    check(`${pkg.project} JS`, files.has('index.js'), `${pkg.packageName} has compiled JS`),
  );
  checks.push(
    check(
      `${pkg.project} declarations`,
      files.has('index.d.ts'),
      `${pkg.packageName} has declarations`,
    ),
  );

  for (const target of exportTargets(outputManifest.exports)) {
    const normalized = target.slice(2);
    checks.push(
      check(
        `${pkg.project} export ${target}`,
        files.has(normalized),
        `${target} resolves to ${join('dist/libs', pkg.project, normalized)}`,
      ),
    );
  }

  const badFiles = [...files].filter((file) =>
    /(^|\/)(src|e2e|__visual_snapshots__|\.nx|node_modules|storybook-static)\//.test(file),
  );
  checks.push(
    check(
      `${pkg.project} package contents clean`,
      badFiles.length === 0,
      badFiles.length === 0
        ? `${pkg.packageName} contains package assets only`
        : badFiles.join(', '),
    ),
  );

  if (pkg.project === 'solid') {
    const exportsValue = outputManifest.exports as JsonObject | undefined;
    checks.push(
      check(
        'solid facade define exports',
        Boolean(exportsValue?.['./define'] && exportsValue?.['./define/button']),
        '@toyu-ui/solid exposes @toyu-ui/solid/define and @toyu-ui/solid/define/button',
      ),
    );
  }
}

await runOrExit(checks, 'package');
