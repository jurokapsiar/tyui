import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';
import { workspaceAliases } from '../../../vite.aliases.ts';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: workspaceAliases,
      },
    }),
};

export default config;
