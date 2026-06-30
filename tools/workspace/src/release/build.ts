import {
  exists,
  packageInfos,
  parseOptions,
  runOrExit,
  runStep,
  check,
  type CheckResult,
} from './shared';
import { resolve } from 'node:path';

const options = parseOptions();
const checks: CheckResult[] = [];

for (const pkg of packageInfos(options.packages)) {
  checks.push(
    await runStep(`${pkg.project}:build`, 'yarn', [
      'nx',
      'run',
      `${pkg.project}:build`,
      '--skip-nx-cache',
    ]),
  );
}

for (const pkg of packageInfos(options.packages)) {
  checks.push(
    check(
      `${pkg.project} JS`,
      await exists(resolve(pkg.distRoot, 'index.js')),
      `${pkg.distRoot}/index.js`,
    ),
  );
  checks.push(
    check(
      `${pkg.project} declarations`,
      await exists(resolve(pkg.distRoot, 'index.d.ts')),
      `${pkg.distRoot}/index.d.ts`,
    ),
  );
}

await runOrExit(checks, 'build');
