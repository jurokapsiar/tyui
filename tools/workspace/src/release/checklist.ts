import { resolve } from 'node:path';
import {
  parseOptions,
  publishCommand,
  readStatus,
  runOrExit,
  runStep,
  writeJson,
  writeText,
  releaseRoot,
  type CheckResult,
} from './shared';

const options = parseOptions();
const statusNames = ['metadata', 'verify', 'build', 'package', 'pack', 'smoke'];
const checks: CheckResult[] = [];

for (const name of statusNames) checks.push(...(await readStatus(name)));
checks.push(await runStep('npm auth', 'npm', ['whoami'], { allowFailure: true }));

const failed = checks.filter((check) => check.status === 'fail');
const lines = [`TYUI release checklist for ${options.version} (tag: ${options.tag})`, ''];

for (const check of checks) {
  const mark = check.status === 'pass' ? '✅' : check.status === 'skip' ? '⚠️' : '❌';
  lines.push(`${mark} ${check.name}: ${check.message}`);
}

lines.push('');
if (failed.length === 0) {
  lines.push('Publish command:');
  lines.push(publishCommand(options));
} else {
  lines.push('Publish command: not available until all checks pass.');
}

const text = `${lines.join('\n')}\n`;
console.info(text);

await writeText(resolve(releaseRoot, 'checklist.md'), text);
await writeJson(resolve(releaseRoot, 'checklist.json'), {
  version: options.version,
  tag: options.tag,
  checks,
  publishCommand: failed.length === 0 ? publishCommand(options) : null,
});

await runOrExit(checks, 'checklist');
