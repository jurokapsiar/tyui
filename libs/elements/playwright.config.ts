import { defineTestingConfig } from '@tyui/tools-executors/shared/playwright-config';

export default defineTestingConfig({
  testDir: '../../tools/executors/src/storybook-visual',
  snapshotDir: '__visual_snapshots__',
  mode: 'visual',
});
