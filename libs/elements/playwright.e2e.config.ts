import { defineTestingConfig } from '@tyui/tools-executors/shared/playwright-config';

export default defineTestingConfig({
  testDir: 'e2e',
  mode: 'e2e',
});
