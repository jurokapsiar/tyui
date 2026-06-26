import type { PlaywrightTestConfig } from '@playwright/test';

export interface DefineTestingConfigOptions {
  testDir: string;
  snapshotDir?: string;
  mode: 'visual' | 'e2e';
}

export function defineTestingConfig(options: DefineTestingConfigOptions): PlaywrightTestConfig {
  const isCI = process.env.CI === '1' || process.env.CI === 'true';

  const config: PlaywrightTestConfig = {
    testDir: options.testDir,
    testMatch: '**/*.spec.ts',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: isCI ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]] : [['list']],
    use: {
      trace: isCI ? 'on-first-retry' : 'off',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.05,
        maxDiffPixels: 100,
      },
    },
  };

  if (options.mode === 'visual') {
    if (!options.snapshotDir) {
      throw new Error("defineTestingConfig: snapshotDir is required when mode is 'visual'.");
    }
    config.snapshotPathTemplate = `${options.snapshotDir}/{platform}/{projectName}/{arg}{ext}`;
  }

  return config;
}
