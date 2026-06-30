import { parseOptions, runOrExit, runStep, skip, type CheckResult } from './shared';

const options = parseOptions();
const checks: CheckResult[] = [];

checks.push(await runStep('yarn install --immutable', 'yarn', ['install', '--immutable']));
checks.push(await runStep('format:check', 'yarn', ['format:check']));
checks.push(await runStep('lint', 'yarn', ['lint']));
checks.push(await runStep('root typecheck', 'yarn', ['typecheck']));
checks.push(await runStep('project typecheck', 'yarn', ['nx', 'run-many', '-t', 'typecheck']));
checks.push(await runStep('tests', 'yarn', ['nx', 'run-many', '-t', 'test']));

if (options.skipHeavy) {
  // checks.push(skip('elements:e2e', 'skipped with --skip-heavy=true'));
  // checks.push(skip('elements:visual', 'skipped with --skip-heavy=true'));
  checks.push(skip('elements:storybook build', 'skipped with --skip-heavy=true'));
} else {
  // checks.push(await runStep('elements:e2e', 'yarn', ['nx', 'run', 'elements:e2e']));
  // checks.push(await runStep('elements:visual', 'yarn', ['nx', 'run', 'elements:visual']));
  checks.push(
    await runStep('elements:storybook build', 'yarn', [
      'nx',
      'run',
      'elements:storybook',
      '--mode=build',
    ]),
  );
}

checks.push(await runStep('bundle sizes', 'yarn', ['report-bundle-sizes']));

await runOrExit(checks, 'verify');
