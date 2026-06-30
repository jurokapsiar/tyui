import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';
import { workspaceAliases } from '../../../vite.aliases.ts';

const config: StorybookConfig = {
  stories: ['../src/generated/spec-docs/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    changeDetection: false,
    sidebarOnboardingChecklist: false,
  },
  viteFinal: (cfg) =>
    mergeConfig(cfg, {
      resolve: {
        alias: workspaceAliases,
      },
    }),
};

export default config;
