import { parseOptions, runStep, workspaceRoot } from './shared';

const options = parseOptions();
const args = [
  `--release-version=${options.version}`,
  `--tag=${options.tag}`,
  `--packages=${options.packages.join(',')}`,
  `--dry-run=${options.dryRun}`,
  `--skip-heavy=${options.skipHeavy}`,
];

for (const target of [
  'release:metadata',
  'release:verify',
  'release:build',
  'release:package',
  'release:pack',
  'release:smoke',
  'release:checklist',
]) {
  const result = await runStep(
    `workspace:${target}`,
    'yarn',
    ['nx', 'run', `workspace:${target}`, ...args],
    {
      cwd: workspaceRoot,
    },
  );
  if (result.status === 'fail') {
    process.exitCode = 1;
    break;
  }
}
